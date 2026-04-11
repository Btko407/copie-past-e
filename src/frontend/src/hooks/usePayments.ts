import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type {
  DiscountCode,
  InitiateUpgradeResult,
  PaymentRecord,
} from "../types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ActorAny = any;

export interface InitiateUpgradeArgs {
  tierId: number;
  discountCode?: string;
}

export function useInitiateTierUpgrade() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<InitiateUpgradeResult, Error, InitiateUpgradeArgs>({
    mutationFn: async ({ tierId, discountCode }) => {
      if (!actor) throw new Error("Actor not ready");
      const raw = await (actor as ActorAny).initiateTierUpgrade(
        BigInt(tierId),
        discountCode ?? null,
      );
      // Map bigint fields to number for frontend use; add stripeClientSecret from raw response
      return {
        paymentRecordId: Number(raw.paymentRecordId),
        finalAmountUSD: raw.finalAmountUSD,
        tierDurationDays: Number(raw.tierDurationDays),
        discountApplied: raw.discountApplied,
        stripeClientSecret: raw.stripeClientSecret ?? undefined,
      } as InitiateUpgradeResult;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mySubscription"] });
      queryClient.invalidateQueries({ queryKey: ["myPayments"] });
    },
  });
}

export function useConfirmStripePayment() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    { paymentRecordId: number; stripePaymentIntentId: string }
  >({
    mutationFn: async ({ paymentRecordId, stripePaymentIntentId }) => {
      if (!actor) throw new Error("Actor not ready");
      await (actor as ActorAny).confirmStripePayment(
        BigInt(paymentRecordId),
        stripePaymentIntentId,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mySubscription"] });
      queryClient.invalidateQueries({ queryKey: ["myPayments"] });
    },
  });
}

export function useFailStripePayment() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<void, Error, { paymentRecordId: number; reason: string }>({
    mutationFn: async ({ paymentRecordId, reason: _reason }) => {
      if (!actor) throw new Error("Actor not ready");
      await (actor as ActorAny).failStripePayment(BigInt(paymentRecordId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myPayments"] });
    },
  });
}

export interface ValidatedDiscount {
  valid: boolean;
  discount?: DiscountCode;
  discountedPrice?: number;
}

export function useValidateDiscountCode(
  code: string,
  tierId?: number,
  basePrice?: number,
) {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<ValidatedDiscount>({
    queryKey: ["discountCode", code, tierId],
    queryFn: async (): Promise<ValidatedDiscount> => {
      if (!actor || !code) return { valid: false };
      // Backend returns ?DiscountCode — null | DiscountCode
      const result = (await (actor as ActorAny).validateDiscountCode(
        code,
        tierId !== undefined ? BigInt(tierId) : BigInt(0),
      )) as DiscountCode | null;
      if (result === null) {
        return { valid: false };
      }
      const discountValue = Number(result.discountValue);
      let discountedPrice: number | undefined;
      if (basePrice !== undefined) {
        const dtype = result.discountType as unknown as string;
        if (dtype === "percentage") {
          discountedPrice = Math.max(
            0,
            basePrice - basePrice * (discountValue / 100),
          );
        } else {
          discountedPrice = Math.max(0, basePrice - discountValue);
        }
      }
      return {
        valid: true,
        discount: result as unknown as DiscountCode,
        discountedPrice,
      };
    },
    enabled: !!actor && !isFetching && code.length > 0,
    staleTime: 10_000,
  });
}

export function useGetMyPayments() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<PaymentRecord[]>({
    queryKey: ["myPayments"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as ActorAny).getMyPayments() as Promise<PaymentRecord[]>;
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useAdminListDiscountCodes() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<DiscountCode[]>({
    queryKey: ["adminDiscountCodes"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as ActorAny).adminListDiscountCodes() as Promise<
        DiscountCode[]
      >;
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export interface CreateDiscountCodeArgs {
  code: string;
  discountType: { percentage: null } | { fixedUSD: null };
  discountValue: number;
  expirationDate: number;
  maxUses: number;
  tierRestriction?: number;
}

export function useAdminCreateDiscountCode() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<DiscountCode, Error, CreateDiscountCodeArgs>({
    mutationFn: async ({
      code,
      discountType,
      discountValue,
      expirationDate,
      maxUses,
      tierRestriction,
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return (actor as ActorAny).adminCreateDiscountCode(
        code,
        discountType,
        discountValue,
        BigInt(expirationDate),
        BigInt(maxUses),
        tierRestriction !== undefined ? BigInt(tierRestriction) : null,
      ) as Promise<DiscountCode>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminDiscountCodes"] });
    },
  });
}

export function useAdminDeactivateDiscountCode() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (codeId) => {
      if (!actor) throw new Error("Actor not ready");
      await (actor as ActorAny).adminDeactivateDiscountCode(BigInt(codeId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminDiscountCodes"] });
    },
  });
}
