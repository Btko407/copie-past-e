import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { Image, Listing } from "../backend";
import { useAuth } from "./useAuth";

export function useListings() {
  const { actor, isFetching } = useActor(createActor);
  const { principalId, authReady } = useAuth();

  return useQuery<Listing[]>({
    queryKey: ["listings", principalId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listListings();
    },
    enabled: !!actor && !isFetching && authReady && !!principalId,
    staleTime: 30_000,
  });
}

export function useFavoritedListings() {
  const { actor, isFetching } = useActor(createActor);
  const { principalId, authReady } = useAuth();

  return useQuery<Listing[]>({
    queryKey: ["favorited-listings", principalId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listFavoritedListings();
    },
    enabled: !!actor && !isFetching && authReady && !!principalId,
    staleTime: 30_000,
  });
}

export function useArchiveListing() {
  const { actor } = useActor(createActor);
  const { principalId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listingId: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.archiveListing(listingId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings", principalId] });
      queryClient.invalidateQueries({
        queryKey: ["favorited-listings", principalId],
      });
    },
  });
}

/**
 * Restore an archived listing back to active status.
 * Requires subscription to be active (expirationDate > now).
 */
export function useRestoreListing() {
  const { actor } = useActor(createActor);
  const { principalId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listingId: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      const actorWithRestore = actor as typeof actor & {
        restoreListing: (
          id: bigint,
        ) => Promise<
          { __kind__: "ok"; ok: Listing } | { __kind__: "err"; err: string }
        >;
      };
      return actorWithRestore.restoreListing(listingId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings", principalId] });
      queryClient.invalidateQueries({
        queryKey: ["favorited-listings", principalId],
      });
    },
  });
}

/**
 * Permanently delete a listing (cannot be undone).
 */
export function usePermanentDeleteListing() {
  const { actor } = useActor(createActor);
  const { principalId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listingId: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteListing(listingId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings", principalId] });
      queryClient.invalidateQueries({
        queryKey: ["favorited-listings", principalId],
      });
    },
  });
}

export function useListingImages(listingId: bigint, enabled = true) {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<Image[]>({
    queryKey: ["listing-images", listingId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listImages(listingId);
    },
    enabled: !!actor && !isFetching && enabled,
    staleTime: 60_000,
  });
}

// ─── Pin / Favorite — canister-backed ─────────────────────────────────────────

export function useTogglePin() {
  const { actor } = useActor(createActor);
  const { principalId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listingId: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.toggleListingPinned(listingId);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok; // true = now pinned, false = now unpinned
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings", principalId] });
    },
  });
}

export function useToggleFavorite() {
  const { actor } = useActor(createActor);
  const { principalId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listingId: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.toggleListingFavorited(listingId);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok; // true = now favorited, false = now unfavorited
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings", principalId] });
      queryClient.invalidateQueries({
        queryKey: ["favorited-listings", principalId],
      });
    },
  });
}
