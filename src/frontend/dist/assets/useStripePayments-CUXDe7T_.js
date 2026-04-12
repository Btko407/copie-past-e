import { f as useActor, O as useAuth, h as useMutation, p as useQuery, g as useQueryClient, i as createActor } from "./index-C4SV0eZt.js";
function useCreateStripePortalSession() {
  const { actor, isFetching } = useActor(createActor);
  const { isAuthenticated } = useAuth();
  return useMutation({
    mutationFn: async () => {
      var _a;
      if (!actor || isFetching || !isAuthenticated)
        throw new Error("Not ready");
      const result = await ((_a = actor.createStripePortalSession) == null ? void 0 : _a.call(actor));
      if (!result) throw new Error("Backend method not available");
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (url) => {
      window.location.href = url;
    }
  });
}
function useGetPaymentBanner() {
  const { actor, isFetching } = useActor(createActor);
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ["paymentBanner"],
    queryFn: async () => {
      var _a;
      if (!actor) return null;
      const result = await ((_a = actor.getPaymentBanner) == null ? void 0 : _a.call(actor));
      if (result === void 0 || result === null) return null;
      if (Array.isArray(result)) {
        if (result.length === 0) return null;
        return result[0];
      }
      return result;
    },
    enabled: !!actor && !isFetching && isAuthenticated,
    staleTime: 3e4,
    refetchInterval: 6e4
  });
}
function useDismissPaymentBanner() {
  const { actor, isFetching } = useActor(createActor);
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      var _a;
      if (!actor || isFetching || !isAuthenticated) return;
      await ((_a = actor.dismissPaymentBanner) == null ? void 0 : _a.call(actor));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentBanner"] });
    }
  });
}
function useGetStripeHealthStatus() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["stripeHealth"],
    queryFn: async () => {
      var _a;
      if (!actor) return null;
      const result = await ((_a = actor.getStripeHealthStatus) == null ? void 0 : _a.call(actor));
      if (!result) return null;
      return result;
    },
    enabled: !!actor && !isFetching,
    staleTime: 3e4,
    refetchInterval: 6e4
  });
}
function useGetRevenueStats() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["revenueStats"],
    queryFn: async () => {
      var _a;
      if (!actor) return null;
      const result = await ((_a = actor.getRevenueStats) == null ? void 0 : _a.call(actor));
      if (!result) return null;
      return {
        today: Number(result.today ?? 0),
        week: Number(result.week ?? 0),
        month: Number(result.month ?? 0),
        activeSubscribers: Number(result.activeSubscribers ?? 0)
      };
    },
    enabled: !!actor && !isFetching,
    staleTime: 6e4,
    refetchInterval: 12e4
  });
}
function useGetCanisterCyclesBalance() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["canisterCyclesBalance"],
    queryFn: async () => {
      var _a;
      if (!actor) return null;
      const result = await ((_a = actor.getCanisterCyclesBalance) == null ? void 0 : _a.call(actor));
      if (result === void 0 || result === null) return null;
      return BigInt(result);
    },
    enabled: !!actor && !isFetching,
    staleTime: 6e4,
    refetchInterval: 12e4
  });
}
export {
  useDismissPaymentBanner as a,
  useCreateStripePortalSession as b,
  useGetStripeHealthStatus as c,
  useGetRevenueStats as d,
  useGetCanisterCyclesBalance as e,
  useGetPaymentBanner as u
};
