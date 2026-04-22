import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { LoyaltyStatus, RefuelHistoryEntry } from "../types";
import { useAuth } from "./useAuth";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ActorAny = any;

// ─── Loyalty Status ────────────────────────────────────────────────────────────

export function useGetLoyaltyStatus() {
  const { actor, isFetching } = useActor(createActor);
  const { principalId, authReady } = useAuth();

  return useQuery<LoyaltyStatus | null>({
    queryKey: ["loyaltyStatus", principalId],
    queryFn: async (): Promise<LoyaltyStatus | null> => {
      if (!actor) return null;
      try {
        const result = await (actor as ActorAny).getLoyaltyStatus();
        if (!result) return null;
        const data = "ok" in result ? result.ok : result;
        return {
          refuelCount: Number(data.refuelCount ?? 0),
          rewardClaimedForTiers: Array.isArray(data.rewardClaimedForTiers)
            ? data.rewardClaimedForTiers.map(String)
            : [],
          currentTier: String(data.currentTier ?? ""),
        };
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching && authReady && !!principalId,
    staleTime: 30_000,
  });
}

// ─── Refuel History ────────────────────────────────────────────────────────────

export function useGetRefuelHistory() {
  const { actor, isFetching } = useActor(createActor);
  const { principalId, authReady } = useAuth();

  return useQuery<RefuelHistoryEntry[]>({
    queryKey: ["refuelHistory", principalId],
    queryFn: async (): Promise<RefuelHistoryEntry[]> => {
      if (!actor) return [];
      try {
        const raw = await (actor as ActorAny).getRefuelHistory();
        if (!Array.isArray(raw)) return [];
        return raw.map((entry: ActorAny) => ({
          date: Number(entry.date ?? entry.createdAt ?? 0),
          tier: String(entry.tier ?? entry.tierName ?? ""),
          rewardClaimed: Boolean(entry.rewardClaimed ?? false),
        }));
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching && authReady && !!principalId,
    staleTime: 60_000,
  });
}

// ─── Claim Loyalty Reward ──────────────────────────────────────────────────────

export function useClaimLoyaltyReward() {
  const { actor } = useActor(createActor);
  const { principalId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: async (): Promise<void> => {
      if (!actor) throw new Error("Actor not ready");
      const result = await (actor as ActorAny).claimLoyaltyReward();
      if (result && "err" in result) throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["loyaltyStatus", principalId],
      });
      queryClient.invalidateQueries({
        queryKey: ["refuelHistory", principalId],
      });
      queryClient.invalidateQueries({ queryKey: ["mySubscription"] });
    },
  });
}

// ─── Loyalty reward eligibility helper ────────────────────────────────────────

export const LOYALTY_THRESHOLDS: Record<string, number> = {
  "Time Walker": 3,
  "Time Traveler": 2,
  "Time Lord": 1,
};

export function isLoyaltyRewardAvailable(status: LoyaltyStatus): boolean {
  const threshold = LOYALTY_THRESHOLDS[status.currentTier];
  if (threshold === undefined) return false;
  const alreadyClaimed = status.rewardClaimedForTiers.includes(
    status.currentTier,
  );
  return !alreadyClaimed && status.refuelCount >= threshold;
}
