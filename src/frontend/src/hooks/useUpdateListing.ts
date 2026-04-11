import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ExternalBlob, createActor } from "../backend";
import type {
  AddImageArgs,
  Image,
  ImageId,
  Listing,
  UpdateListingArgs,
} from "../backend.d.ts";

export function useUpdateListing() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<Listing, Error, UpdateListingArgs>({
    mutationFn: async (args) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateListing(args);
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({
        queryKey: ["listing", updated.id.toString()],
      });
    },
  });
}

export function useRemoveImage() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<void, Error, { imageId: ImageId; listingId: bigint }>({
    mutationFn: async ({ imageId }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.removeImage(imageId);
    },
    onSuccess: (_, { listingId }) => {
      queryClient.invalidateQueries({
        queryKey: ["images", listingId.toString()],
      });
    },
  });
}

export interface AddImageToListingArgs {
  listingId: bigint;
  file: File;
  order: number;
  onProgress?: (pct: number) => void;
}

export function useAddImageToListing() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<Image, Error, AddImageToListingArgs>({
    mutationFn: async ({ listingId, file, order, onProgress }) => {
      if (!actor) throw new Error("Actor not available");
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      let blob = ExternalBlob.fromBytes(bytes);
      if (onProgress) {
        blob = blob.withUploadProgress(onProgress);
      }
      const args: AddImageArgs = {
        order: BigInt(order),
        blob,
        listingId,
        altText: file.name,
      };
      return actor.addImage(args);
    },
    onSuccess: (_, { listingId }) => {
      queryClient.invalidateQueries({
        queryKey: ["images", listingId.toString()],
      });
    },
  });
}
