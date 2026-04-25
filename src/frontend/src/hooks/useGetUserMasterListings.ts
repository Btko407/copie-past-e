import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { MasterListing } from "../backend";
import { useAuth } from "./useAuth";

export function useGetUserMasterListings() {
  const { actor, isFetching } = useActor(createActor);
  const { principalId, authReady } = useAuth();

  return useQuery<MasterListing[]>({
    queryKey: ["masterListings", principalId],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.getUserMasterListings();
      if (result.__kind__ === "err") throw new Error(result.err.message);
      return result.ok;
    },
    enabled: !!actor && !isFetching && authReady && !!principalId,
    staleTime: 30_000,
  });
}
