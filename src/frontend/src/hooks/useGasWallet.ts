import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import { useAuth } from "./useAuth";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ActorAny = any;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GasWallet {
  userId: string;
  gasBalance: number;
  autoRenewal: boolean;
  autoRenewalTierId: number;
  updatedAt: bigint;
}

export interface GasPackage {
  packageId: number;
  name: string;
  gasAmount: number;
  priceUSD: number;
  stripeProductId: string;
}

export type GasPurchaseStatus =
  | { pending: null }
  | { completed: null }
  | { failed: null };

export interface GasPurchase {
  id: number;
  userId: string;
  gasAmount: number;
  priceUSD: number;
  stripePaymentIntentId: string;
  status: GasPurchaseStatus;
  createdAt: bigint;
}

export interface InitiateGasPurchaseResult {
  purchaseRecordId: number;
  finalAmountUSD: number;
  gasAmount: number;
  stripeClientSecret: string;
}

// ─── Query Hooks ──────────────────────────────────────────────────────────────

export function useGetMyGasWallet() {
  const { actor, isFetching } = useActor(createActor);
  const { principalId, authReady } = useAuth();

  return useQuery<GasWallet | null>({
    queryKey: ["myGasWallet", principalId],
    queryFn: async (): Promise<GasWallet | null> => {
      if (!actor) return null;
      const result = await (actor as ActorAny).getMyGasWallet();
      if ("err" in result) return null;
      const w = result.ok;
      return {
        userId: typeof w.userId === "string" ? w.userId : w.userId.toString(),
        gasBalance: Number(w.gasBalance),
        autoRenewal: Boolean(w.autoRenewal),
        autoRenewalTierId: Number(w.autoRenewalTierId),
        updatedAt: BigInt(w.updatedAt),
      };
    },
    enabled: !!actor && !isFetching && authReady && !!principalId,
    staleTime: 20_000,
  });
}

export function useGetGasPackages() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<GasPackage[]>({
    queryKey: ["gasPackages"],
    queryFn: async (): Promise<GasPackage[]> => {
      if (!actor) return [];
      const raw = await (actor as ActorAny).getGasPackages();
      return (raw as ActorAny[]).map((p) => ({
        packageId: Number(p.packageId),
        name: String(p.name),
        gasAmount: Number(p.gasAmount),
        priceUSD: Number(p.priceUSD),
        stripeProductId: String(p.stripeProductId),
      }));
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

export function useGetMyGasPurchases() {
  const { actor, isFetching } = useActor(createActor);
  const { principalId, authReady } = useAuth();

  return useQuery<GasPurchase[]>({
    queryKey: ["myGasPurchases", principalId],
    queryFn: async (): Promise<GasPurchase[]> => {
      if (!actor) return [];
      const raw = await (actor as ActorAny).getMyGasPurchases();
      return (raw as ActorAny[]).map((p) => ({
        id: Number(p.id),
        userId: String(p.userId),
        gasAmount: Number(p.gasAmount),
        priceUSD: Number(p.priceUSD),
        stripePaymentIntentId: String(p.stripePaymentIntentId),
        status: p.status as GasPurchaseStatus,
        createdAt: BigInt(p.createdAt),
      }));
    },
    enabled: !!actor && !isFetching && authReady && !!principalId,
    staleTime: 30_000,
  });
}

// ─── Mutation Hooks ───────────────────────────────────────────────────────────

export function useInitiateGasPurchase() {
  const { actor } = useActor(createActor);
  const { principalId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<
    InitiateGasPurchaseResult,
    Error,
    { packageId: number; discountCode?: string }
  >({
    mutationFn: async ({ packageId, discountCode }) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await (actor as ActorAny).initiateGasPurchase(
        BigInt(packageId),
        discountCode ? [discountCode] : [],
      );
      if ("err" in result) throw new Error(result.err);
      const ok = result.ok;
      return {
        purchaseRecordId: Number(ok.purchaseRecordId),
        finalAmountUSD: Number(ok.finalAmountUSD),
        gasAmount: Number(ok.gasAmount),
        stripeClientSecret: String(ok.stripeClientSecret),
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["myGasPurchases", principalId],
      });
    },
  });
}

export function useConfirmGasPurchase() {
  const { actor } = useActor(createActor);
  const { principalId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<GasWallet, Error, { purchaseRecordId: number }>({
    mutationFn: async ({ purchaseRecordId }) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await (actor as ActorAny).confirmGasPurchase(
        BigInt(purchaseRecordId),
      );
      if ("err" in result) throw new Error(result.err);
      const w = result.ok;
      return {
        userId: String(w.userId),
        gasBalance: Number(w.gasBalance),
        autoRenewal: Boolean(w.autoRenewal),
        autoRenewalTierId: Number(w.autoRenewalTierId),
        updatedAt: BigInt(w.updatedAt),
      };
    },
    onSuccess: (wallet) => {
      queryClient.setQueryData(["myGasWallet", principalId], wallet);
      queryClient.invalidateQueries({
        queryKey: ["myGasPurchases", principalId],
      });
    },
  });
}

export function useFailGasPurchase() {
  const { actor } = useActor(createActor);
  const { principalId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<void, Error, { purchaseRecordId: number }>({
    mutationFn: async ({ purchaseRecordId }) => {
      if (!actor) throw new Error("Actor not ready");
      await (actor as ActorAny).failGasPurchase(BigInt(purchaseRecordId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["myGasPurchases", principalId],
      });
    },
  });
}

export function useSetAutoRenewal() {
  const { actor } = useActor(createActor);
  const { principalId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<GasWallet, Error, { enabled: boolean; tierId: number }>({
    mutationFn: async ({ enabled, tierId }) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await (actor as ActorAny).setAutoRenewal(
        enabled,
        BigInt(tierId),
      );
      if ("err" in result) throw new Error(result.err);
      const w = result.ok;
      return {
        userId: String(w.userId),
        gasBalance: Number(w.gasBalance),
        autoRenewal: Boolean(w.autoRenewal),
        autoRenewalTierId: Number(w.autoRenewalTierId),
        updatedAt: BigInt(w.updatedAt),
      };
    },
    onSuccess: (wallet) => {
      queryClient.setQueryData(["myGasWallet", principalId], wallet);
    },
  });
}
