import { f as useActor, p as useQuery, i as createActor } from "./index-D1sD4pLM.js";
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
