import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { ListingId } from "../backend.d.ts";

export function useDeleteListing() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<void, Error, ListingId>({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteListing(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
  });
}
