import { u as useActor, k as useQuery, e as createActor } from "./index-CDYDluDX.js";
function useGetSiteAnalytics() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["siteAnalytics"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getSiteAnalytics();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 3e4
  });
}
export {
  useGetSiteAnalytics as u
};
