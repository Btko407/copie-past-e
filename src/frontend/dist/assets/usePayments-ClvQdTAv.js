import { b as useActor, d as useQueryClient, e as useMutation, l as useQuery, f as createActor } from "./index-Usp6K9eu.js";
function useInitiateTierUpgrade() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ tierId, discountCode }) => {
      if (!actor) throw new Error("Actor not ready");
      const raw = await actor.initiateTierUpgrade(
        BigInt(tierId),
        discountCode ?? null
      );
      return {
        paymentRecordId: Number(raw.paymentRecordId),
        finalAmountUSD: raw.finalAmountUSD,
        tierDurationDays: Number(raw.tierDurationDays),
        discountApplied: raw.discountApplied,
        stripeClientSecret: raw.stripeClientSecret ?? void 0
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mySubscription"] });
      queryClient.invalidateQueries({ queryKey: ["myPayments"] });
    }
  });
}
function useConfirmStripePayment() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ paymentRecordId, stripePaymentIntentId }) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.confirmStripePayment(
        BigInt(paymentRecordId),
        stripePaymentIntentId
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mySubscription"] });
      queryClient.invalidateQueries({ queryKey: ["myPayments"] });
    }
  });
}
function useFailStripePayment() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ paymentRecordId, reason: _reason }) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.failStripePayment(BigInt(paymentRecordId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myPayments"] });
    }
  });
}
function useValidateDiscountCode(code, tierId, basePrice) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["discountCode", code, tierId],
    queryFn: async () => {
      if (!actor || !code) return { valid: false };
      const result = await actor.validateDiscountCode(
        code,
        tierId !== void 0 ? BigInt(tierId) : BigInt(0)
      );
      if (result === null) {
        return { valid: false };
      }
      const discountValue = Number(result.discountValue);
      let discountedPrice;
      if (basePrice !== void 0) {
        const dtype = result.discountType;
        if (dtype === "percentage") {
          discountedPrice = Math.max(
            0,
            basePrice - basePrice * (discountValue / 100)
          );
        } else {
          discountedPrice = Math.max(0, basePrice - discountValue);
        }
      }
      return {
        valid: true,
        discount: result,
        discountedPrice
      };
    },
    enabled: !!actor && !isFetching && code.length > 0,
    staleTime: 1e4
  });
}
function useAdminListDiscountCodes() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["adminDiscountCodes"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminListDiscountCodes();
    },
    enabled: !!actor && !isFetching,
    staleTime: 3e4
  });
}
function useAdminCreateDiscountCode() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      code,
      discountType,
      discountValue,
      expirationDate,
      maxUses,
      tierRestriction
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.adminCreateDiscountCode(
        code,
        discountType,
        discountValue,
        BigInt(expirationDate),
        BigInt(maxUses),
        tierRestriction !== void 0 ? BigInt(tierRestriction) : null
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminDiscountCodes"] });
    }
  });
}
function useAdminDeactivateDiscountCode() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (codeId) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.adminDeactivateDiscountCode(BigInt(codeId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminDiscountCodes"] });
    }
  });
}
export {
  useValidateDiscountCode as a,
  useFailStripePayment as b,
  useConfirmStripePayment as c,
  useAdminListDiscountCodes as d,
  useAdminDeactivateDiscountCode as e,
  useAdminCreateDiscountCode as f,
  useInitiateTierUpgrade as u
};
