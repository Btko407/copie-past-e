import { b as useActor, s as useQuery, g as createActor } from "./index-lWC1fMpK.js";
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
