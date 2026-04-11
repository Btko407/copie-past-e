import { f as useActor, p as useQuery, g as useQueryClient, h as useMutation, i as createActor } from "./index-D1sD4pLM.js";
const GRANT_TIMEOUT_MS = 15e3;
function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise(
      (_, reject) => setTimeout(
        () => reject(new Error("Request timed out — please try again.")),
        ms
      )
    )
  ]);
}
function useGetTiers() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["tiers"],
    queryFn: async () => {
      if (!actor) return [];
      const raw = await actor.getTiers();
      return raw.map(normalizeTierConfig);
    },
    enabled: !!actor && !isFetching,
    staleTime: 6e4
  });
}
function normalizeTierConfig(raw) {
  return {
    tierId: Number(raw.tierId),
    name: String(raw.name),
    durationDays: Number(raw.durationDays),
    priceUSD: Number(raw.priceUSD),
    stripeProductId: raw.stripeProductId ?? void 0
  };
}
function normalizeSubscription(raw) {
  const expNs = typeof raw.expirationDate === "bigint" ? Number(raw.expirationDate) : Number(raw.expirationDate);
  const updNs = typeof raw.updatedAt === "bigint" ? Number(raw.updatedAt) : Number(raw.updatedAt);
  return {
    userId: String(raw.userId),
    tier: Number(raw.tier),
    // Convert nanoseconds → milliseconds for frontend Date comparisons
    expirationDate: expNs > 1e15 ? expNs / 1e6 : expNs,
    autoRenewal: Boolean(raw.autoRenewal),
    stripeSubscriptionId: raw.stripeSubscriptionId ?? void 0,
    updatedAt: updNs > 1e15 ? updNs / 1e6 : updNs
  };
}
function useGetMySubscription() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["mySubscription"],
    queryFn: async () => {
      if (!actor) return null;
      const raw = await actor.getMySubscription();
      if (!raw) return null;
      return normalizeSubscription(raw);
    },
    enabled: !!actor && !isFetching,
    staleTime: 3e4
  });
}
function useAdminListSubscriptions() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["adminSubscriptions"],
    queryFn: async () => {
      if (!actor) return [];
      const raw = await actor.adminListSubscriptions();
      return raw.map(normalizeSubscription);
    },
    enabled: !!actor && !isFetching,
    staleTime: 3e4
  });
}
function useAdminExtendUserTierByUsername() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ username, tierLevel, extraDays }) => {
      if (!actor) throw new Error("Actor not ready");
      const res = await withTimeout(
        actor.adminExtendUserTierByUsername(
          username,
          BigInt(tierLevel),
          BigInt(extraDays)
        ),
        GRANT_TIMEOUT_MS
      );
      if (res && typeof res === "object" && "__kind__" in res) {
        const r = res;
        if (r.__kind__ === "err") {
          const msg = typeof r.err === "string" && r.err.trim() ? r.err : "Failed to grant subscription.";
          throw new Error(msg);
        }
        return;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminSubscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["mySubscription"] });
      queryClient.invalidateQueries({ queryKey: ["adminProfiles"] });
    }
  });
}
function useAdminUpsertTier() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (config) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.adminUpsertTier({
        tierId: BigInt(config.tierId),
        name: config.name,
        durationDays: BigInt(config.durationDays),
        priceUSD: config.priceUSD,
        stripeProductId: config.stripeProductId ?? void 0
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tiers"] });
    }
  });
}
export {
  useGetTiers as a,
  useAdminListSubscriptions as b,
  useAdminUpsertTier as c,
  useAdminExtendUserTierByUsername as d,
  useGetMySubscription as u
};
