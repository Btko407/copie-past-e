import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { FbCredentials, FbListing } from "../types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ActorAny = any;

// ─── Get My FB Credentials ────────────────────────────────────────────────────

export function useGetMyFbCredentials() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<FbCredentials | null>({
    queryKey: ["myFbCredentials"],
    queryFn: async (): Promise<FbCredentials | null> => {
      if (!actor) return null;
      try {
        const result = await (actor as ActorAny).getMyFbCredentials();
        if (!result) return null;
        const data = "ok" in result ? result.ok : result;
        if (!data) return null;
        return {
          appId: String(data.appId ?? ""),
          accessToken: String(data.accessToken ?? ""),
        };
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

// ─── Save FB Credentials ──────────────────────────────────────────────────────

export function useSaveFbCredentials() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<void, Error, FbCredentials>({
    mutationFn: async (creds: FbCredentials): Promise<void> => {
      if (!actor) throw new Error("Actor not ready");
      const result = await (actor as ActorAny).saveFbCredentials(
        creds.appId,
        creds.accessToken,
      );
      if (result && "err" in result) throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myFbCredentials"] });
    },
  });
}

// ─── Get My FB Listings ───────────────────────────────────────────────────────

export function useGetFbListings() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<FbListing[]>({
    queryKey: ["myFbListings"],
    queryFn: async (): Promise<FbListing[]> => {
      if (!actor) return [];
      try {
        const result = await (actor as ActorAny).getFbListings();
        if (!result) return [];
        const data = "ok" in result ? result.ok : result;
        if (!Array.isArray(data)) return [];
        return data.map((item: ActorAny) => ({
          id: String(item.id ?? ""),
          title: String(item.title ?? ""),
          description: item.description?.[0] ?? item.description ?? undefined,
          price: item.price?.[0] ?? item.price ?? undefined,
          category: item.category?.[0] ?? item.category ?? undefined,
          imageUrls: Array.isArray(item.imageUrls)
            ? item.imageUrls.map(String)
            : [],
        }));
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}
