import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { SiteAnalytics } from "../types";

export function useGetSiteAnalytics() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<SiteAnalytics | null>({
    queryKey: ["siteAnalytics"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getSiteAnalytics() as Promise<SiteAnalytics>;
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30_000,
  });
}
