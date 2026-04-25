import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Platform__2 } from "../backend.d.ts";

export type LogManualPostingPlatform =
  | "facebook"
  | "mecari"
  | "ebay"
  | "poshmark"
  | "depop"
  | "etsy";

export interface LogManualPostingArgs {
  listingId: string;
  platform: LogManualPostingPlatform;
  remoteUrl?: string;
}

const platformEnumMap: Record<LogManualPostingPlatform, Platform__2> = {
  facebook: "facebook" as Platform__2,
  mecari: "mecari" as Platform__2,
  ebay: "ebay" as Platform__2,
  poshmark: "poshmark" as Platform__2,
  depop: "depop" as Platform__2,
  etsy: "etsy" as Platform__2,
};

export function useLogManualPosting() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<string, Error, LogManualPostingArgs>({
    mutationFn: async ({ listingId, platform, remoteUrl }) => {
      if (!actor) throw new Error("Actor not available");

      const result = await actor.logManualPosting(
        listingId,
        platformEnumMap[platform],
        remoteUrl ?? null,
      );

      if (result.__kind__ === "err") {
        throw new Error(result.err.message ?? "Failed to log posting");
      }
      return result.ok;
    },
    onSuccess: (_, { listingId, platform }) => {
      queryClient.invalidateQueries({ queryKey: ["masterListings"] });
      queryClient.invalidateQueries({ queryKey: ["listing", listingId] });
      toast.success(`✅ Posting logged for ${platform}!`);
    },
    onError: (error) => {
      toast.error(`Failed to log posting: ${error.message}`);
    },
  });
}
