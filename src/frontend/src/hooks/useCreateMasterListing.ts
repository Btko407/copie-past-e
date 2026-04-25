import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createActor } from "../backend";

export interface CreateMasterListingArgs {
  title: string;
  description: string;
  price: string | null;
  category: string | null;
  tags: string[];
  photos: Uint8Array[];
}

export function useCreateMasterListing() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (args: CreateMasterListingArgs) => {
      if (!actor) throw new Error("Not connected to backend");

      const result = await actor.createMasterListing({
        title: args.title,
        description: args.description,
        price: args.price ?? undefined,
        category: args.category ?? undefined,
        tags: args.tags,
        photos: args.photos,
      });

      if (result.__kind__ === "err") {
        throw new Error(result.err.message);
      }

      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["masterListings"] });
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Failed to create listing");
    },
  });
}
