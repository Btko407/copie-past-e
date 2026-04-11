import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ExternalBlob, createActor } from "../backend";
import type { AddImageArgs, CreateListingArgs, Listing } from "../backend";

export interface UploadableFile {
  file: File;
  preview: string;
  progress: number;
  id: string;
}

export interface CreateListingWithImagesArgs {
  listing: CreateListingArgs;
  files: UploadableFile[];
  onImageProgress: (fileId: string, progress: number) => void;
}

export function useCreateListing() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<Listing, Error, CreateListingWithImagesArgs>({
    mutationFn: async ({ listing, files, onImageProgress }) => {
      if (!actor) throw new Error("Actor not available");

      // Create the listing first
      const created = await actor.createListing(listing);

      // Upload images sequentially to avoid overwhelming the backend
      for (let i = 0; i < files.length; i++) {
        const uploadable = files[i];
        const arrayBuffer = await uploadable.file.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);

        const blob = ExternalBlob.fromBytes(bytes).withUploadProgress(
          (percentage) => {
            onImageProgress(uploadable.id, percentage);
          },
        );

        const addImageArgs: AddImageArgs = {
          order: BigInt(i),
          blob,
          listingId: created.id,
          altText: uploadable.file.name,
        };

        await actor.addImage(addImageArgs);
        onImageProgress(uploadable.id, 100);
      }

      return created;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
  });
}
