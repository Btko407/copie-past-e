import { c as createLucideIcon, b as useActor, h as useAuth, i as useQuery, d as useQueryClient, e as useMutation, f as createActor, a as ue } from "./index-DlPcOTZa.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ],
  ["path", { d: "m15 5 4 4", key: "1mk7zo" }]
];
const Pencil = createLucideIcon("pencil", __iconNode);
function useListings() {
  const { actor, isFetching } = useActor(createActor);
  const { principalId, authReady } = useAuth();
  return useQuery({
    queryKey: ["listings", principalId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listListings();
    },
    enabled: !!actor && !isFetching && authReady && !!principalId,
    staleTime: 3e4
  });
}
function useFavoritedListings() {
  const { actor, isFetching } = useActor(createActor);
  const { principalId, authReady } = useAuth();
  return useQuery({
    queryKey: ["favorited-listings", principalId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listFavoritedListings();
    },
    enabled: !!actor && !isFetching && authReady && !!principalId,
    staleTime: 3e4
  });
}
function useArchiveListing() {
  const { actor } = useActor(createActor);
  const { principalId } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (listingId) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.archiveListing(listingId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings", principalId] });
      queryClient.invalidateQueries({
        queryKey: ["favorited-listings", principalId]
      });
    }
  });
}
function useRestoreListing() {
  const { actor } = useActor(createActor);
  const { principalId } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (listingId) => {
      if (!actor) throw new Error("Actor not ready");
      const actorWithRestore = actor;
      return actorWithRestore.restoreListing(listingId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings", principalId] });
      queryClient.invalidateQueries({
        queryKey: ["favorited-listings", principalId]
      });
    }
  });
}
function usePermanentDeleteListing() {
  const { actor } = useActor(createActor);
  const { principalId } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (listingId) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteListing(listingId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings", principalId] });
      queryClient.invalidateQueries({
        queryKey: ["favorited-listings", principalId]
      });
    }
  });
}
function useListingImages(listingId, enabled = true) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["listing-images", listingId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listImages(listingId);
    },
    enabled: !!actor && !isFetching && enabled,
    staleTime: 6e4
  });
}
function useTogglePin() {
  const { actor } = useActor(createActor);
  const { principalId } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (listingId) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.toggleListingPinned(listingId);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings", principalId] });
    }
  });
}
function useToggleFavorite() {
  const { actor } = useActor(createActor);
  const { principalId } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (listingId) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.toggleListingFavorited(listingId);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings", principalId] });
      queryClient.invalidateQueries({
        queryKey: ["favorited-listings", principalId]
      });
    }
  });
}
const TOAST_STYLE = {
  duration: 2e3,
  style: {
    background: "oklch(0.16 0 0)",
    border: "1px solid oklch(0.65 0.22 262 / 0.6)",
    color: "oklch(0.95 0 0)"
  }
};
function showToast(message, type) {
  if (type === "success") {
    ue.success(message, TOAST_STYLE);
  } else {
    ue.error(message, { ...TOAST_STYLE, duration: 2e3 });
  }
}
async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Copied!", "success");
      return;
    } catch {
    }
  }
  const el = document.createElement("textarea");
  el.value = text;
  el.setAttribute("readonly", "");
  el.style.cssText = "position:fixed;top:-9999px;left:-9999px;opacity:0";
  document.body.appendChild(el);
  el.focus();
  el.select();
  try {
    const success = document.execCommand("copy");
    if (success) {
      showToast("Copied!", "success");
    } else {
      showToast("Copy failed. Please copy manually.", "error");
    }
  } catch {
    showToast("Copy failed. Please copy manually.", "error");
  } finally {
    document.body.removeChild(el);
  }
}
export {
  Pencil as P,
  useArchiveListing as a,
  useRestoreListing as b,
  copyText as c,
  usePermanentDeleteListing as d,
  useTogglePin as e,
  useToggleFavorite as f,
  useListings as g,
  useFavoritedListings as h,
  useListingImages as u
};
