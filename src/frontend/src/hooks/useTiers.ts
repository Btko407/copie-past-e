import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { TierConfig, UserTierSubscription } from "../types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ActorAny = any;

const GRANT_TIMEOUT_MS = 15_000;

/** Wraps a promise with a timeout that rejects with a friendly message. */
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(
        () => reject(new Error("Request timed out — please try again.")),
        ms,
      ),
    ),
  ]);
}

export function useGetTiers() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<TierConfig[]>({
    queryKey: ["tiers"],
    queryFn: async () => {
      if (!actor) return [];
      const raw = await (actor as ActorAny).getTiers();
      return (raw as ActorAny[]).map(normalizeTierConfig);
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

/** Normalize a raw backend TierConfig (bigint fields) to the frontend type (number fields). */
function normalizeTierConfig(raw: ActorAny): TierConfig {
  return {
    tierId: Number(raw.tierId),
    name: String(raw.name),
    durationDays: Number(raw.durationDays),
    priceUSD: Number(raw.priceUSD),
    stripeProductId: raw.stripeProductId ?? undefined,
  };
}

/** Normalize a raw backend UserTierSubscription (bigint fields) to the frontend type (number fields).
 * expirationDate is converted from nanoseconds (backend) to milliseconds (frontend).
 * updatedAt is also converted from nanoseconds to milliseconds.
 */
function normalizeSubscription(raw: ActorAny): UserTierSubscription {
  const expNs =
    typeof raw.expirationDate === "bigint"
      ? Number(raw.expirationDate)
      : Number(raw.expirationDate);
  const updNs =
    typeof raw.updatedAt === "bigint"
      ? Number(raw.updatedAt)
      : Number(raw.updatedAt);
  return {
    userId: String(raw.userId),
    tier: Number(raw.tier),
    // Convert nanoseconds → milliseconds for frontend Date comparisons
    expirationDate: expNs > 1e15 ? expNs / 1_000_000 : expNs,
    autoRenewal: Boolean(raw.autoRenewal),
    stripeSubscriptionId: raw.stripeSubscriptionId ?? undefined,
    updatedAt: updNs > 1e15 ? updNs / 1_000_000 : updNs,
  };
}

export function useGetMySubscription() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<UserTierSubscription | null>({
    queryKey: ["mySubscription"],
    queryFn: async () => {
      if (!actor) return null;
      const raw = await (actor as ActorAny).getMySubscription();
      if (!raw) return null;
      return normalizeSubscription(raw);
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useAdminListSubscriptions() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<UserTierSubscription[]>({
    queryKey: ["adminSubscriptions"],
    queryFn: async () => {
      if (!actor) return [];
      const raw = await (actor as ActorAny).adminListSubscriptions();
      return (raw as ActorAny[]).map(normalizeSubscription);
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export interface AdminExtendTierArgs {
  userId: string;
  tierLevel: number;
  extraDays: number;
}

export function useAdminExtendUserTier() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<void, Error, AdminExtendTierArgs>({
    mutationFn: async ({ userId, tierLevel, extraDays }) => {
      if (!actor) throw new Error("Actor not ready");
      await withTimeout(
        (actor as ActorAny).adminExtendUserTier(
          userId,
          BigInt(tierLevel),
          BigInt(extraDays),
        ),
        GRANT_TIMEOUT_MS,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminSubscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["mySubscription"] });
    },
  });
}

export interface AdminExtendTierByUsernameArgs {
  username: string;
  tierLevel: number;
  extraDays: number;
}

export function useAdminExtendUserTierByUsername() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<void, Error, AdminExtendTierByUsernameArgs>({
    mutationFn: async ({ username, tierLevel, extraDays }) => {
      if (!actor) throw new Error("Actor not ready");
      // Backend returns variant {#ok: UserTierSubscription; #err: Text}
      const res = await withTimeout(
        (actor as ActorAny).adminExtendUserTierByUsername(
          username,
          BigInt(tierLevel),
          BigInt(extraDays),
        ),
        GRANT_TIMEOUT_MS,
      );
      // Parse Motoko variant — Caffeine SDK encodes as { __kind__: "ok"|"err", ok/err: value }
      if (res && typeof res === "object" && "__kind__" in res) {
        const r = res as { __kind__: string; ok?: unknown; err?: unknown };
        if (r.__kind__ === "err") {
          const msg =
            typeof r.err === "string" && r.err.trim()
              ? r.err
              : "Failed to grant subscription.";
          throw new Error(msg);
        }
        // __kind__ === "ok" — success, nothing to throw
        return;
      }
      // Unexpected shape — treat as success to avoid false negatives
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminSubscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["mySubscription"] });
      queryClient.invalidateQueries({ queryKey: ["adminProfiles"] });
    },
  });
}

export function useAdminUpsertTier() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<void, Error, TierConfig>({
    mutationFn: async (config) => {
      if (!actor) throw new Error("Actor not ready");
      // Convert number fields back to BigInt for the backend
      await (actor as ActorAny).adminUpsertTier({
        tierId: BigInt(config.tierId),
        name: config.name,
        durationDays: BigInt(config.durationDays),
        priceUSD: config.priceUSD,
        stripeProductId: config.stripeProductId ?? undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tiers"] });
    },
  });
}
