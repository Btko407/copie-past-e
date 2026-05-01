import { b as useActor, l as useQuery, f as createActor } from "./index-B_oOf7NU.js";
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
