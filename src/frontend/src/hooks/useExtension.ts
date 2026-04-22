import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { createActor } from "../backend";
import type { ExtensionListingData } from "../types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ActorAny = any;

// ─── Extension Detection ──────────────────────────────────────────────────────

/**
 * Detects whether the Copie Past-e Chrome extension is installed.
 *
 * On mount:
 * 1. Reads the persisted "ext_installed" flag from localStorage as the initial
 *    state so returning users see the correct state instantly.
 * 2. Sends a COPIE_PASTE_PING to the extension (in case it was installed after
 *    the last page load).
 * 3. Starts a 5-second timer. If COPIE_PASTE_EXT_PRESENT is NOT received
 *    within 5 seconds, ext_installed is set to false — meaning the extension
 *    was removed from Chrome.
 * 4. If the message IS received before the timer fires, ext_installed is set
 *    to true and the timer is cancelled.
 *
 * The "Extension Required" modal is never shown when ext_installed is true.
 */
export function useExtensionDetection() {
  const [isInstalled, setIsInstalled] = useState<boolean>(() => {
    try {
      return localStorage.getItem("ext_installed") === "true";
    } catch {
      return false;
    }
  });

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (e.data?.type === "COPIE_PASTE_EXT_PRESENT") {
        // Cancel the 5-second timeout — extension is present
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        try {
          localStorage.setItem("ext_installed", "true");
        } catch {
          /* ignore */
        }
        setIsInstalled(true);
      }
    }

    window.addEventListener("message", handleMessage);

    // Send a ping so the extension re-announces itself
    window.postMessage({ type: "COPIE_PASTE_PING" }, "*");

    // 5-second countdown — if no reply, mark extension as not installed
    timerRef.current = setTimeout(() => {
      try {
        localStorage.setItem("ext_installed", "false");
      } catch {
        /* ignore */
      }
      setIsInstalled(false);
    }, 5000);

    return () => {
      window.removeEventListener("message", handleMessage);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Also react to storage changes from other tabs
  useEffect(() => {
    function handleStorage(e: StorageEvent) {
      if (e.key === "ext_installed") {
        setIsInstalled(e.newValue === "true");
      }
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return { isInstalled };
}

// ─── Get My Webhook Token ─────────────────────────────────────────────────────

export function useGetMyWebhookToken() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<string | null>({
    queryKey: ["myWebhookToken"],
    queryFn: async (): Promise<string | null> => {
      if (!actor) return null;
      try {
        const result = await (actor as ActorAny).getMyWebhookToken();
        if (!result) return null;
        const token = "ok" in result ? result.ok : result;
        return token ? String(token) : null;
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 300_000, // 5 min — tokens don't change often
  });
}

// ─── Generate Webhook Token ───────────────────────────────────────────────────

export function useGenerateWebhookToken() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<string, Error, void>({
    mutationFn: async (): Promise<string> => {
      if (!actor) throw new Error("Actor not ready");
      const result = await (actor as ActorAny).generateWebhookToken();
      if (result && "err" in result) throw new Error(result.err);
      const token = "ok" in result ? result.ok : result;
      return String(token);
    },
    onSuccess: (token) => {
      queryClient.setQueryData(["myWebhookToken"], token);
    },
  });
}

// ─── Receive Extension Data (webhook handler simulation) ─────────────────────

export function useReceiveExtensionData() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<string, Error, ExtensionListingData>({
    mutationFn: async (data: ExtensionListingData): Promise<string> => {
      if (!actor) throw new Error("Actor not ready");
      const result = await (actor as ActorAny).receiveExtensionData({
        title: data.title,
        description: data.description ? [data.description] : [],
        price: data.price ? [data.price] : [],
        imageUrls: data.imageUrls,
        category: data.category ? [data.category] : [],
        sourceUrl: data.sourceUrl ? [data.sourceUrl] : [],
      });
      if (result && "err" in result) throw new Error(result.err);
      const draftId = "ok" in result ? result.ok : result;
      return String(draftId);
    },
    onSuccess: () => {
      // Invalidate listings so the new draft shows up
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
  });
}

// ─── Extension Update Check ───────────────────────────────────────────────────

export interface ExtensionUpdateInfo {
  currentVersion: string;
  latestVersion: string;
  needsUpdate: boolean;
  isForceUpdate: boolean;
  buildNumber: number;
  releaseNotes: string;
  downloadUrl: string;
}

export function useExtensionUpdateCheck(currentVersion: string) {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<ExtensionUpdateInfo>({
    queryKey: ["extensionUpdate", currentVersion],
    queryFn: async (): Promise<ExtensionUpdateInfo> => {
      if (!actor) throw new Error("Backend not ready");
      const result = await (actor as ActorAny).checkExtensionUpdateStatus(
        currentVersion,
      );
      return {
        currentVersion: String(result.currentVersion),
        latestVersion: String(result.latestVersion),
        needsUpdate: Boolean(result.needsUpdate),
        isForceUpdate: Boolean(result.isForceUpdate),
        buildNumber: Number(result.buildNumber),
        releaseNotes: String(result.releaseNotes),
        downloadUrl: String(result.downloadUrl),
      };
    },
    refetchInterval: 1000 * 60 * 60, // Re-check every hour
    enabled: !!actor && !isFetching && currentVersion.length > 0,
  });
}

// ─── Extension Version History (admin) ───────────────────────────────────────

export function useExtensionVersions() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<ExtensionUpdateInfo[]>({
    queryKey: ["extensionVersionHistory"],
    queryFn: async (): Promise<ExtensionUpdateInfo[]> => {
      if (!actor) throw new Error("Backend not ready");
      const results = await (actor as ActorAny).adminListExtensionVersions();
      return (results as ActorAny[]).map((r) => ({
        currentVersion: "",
        latestVersion: String(r.version),
        needsUpdate: false,
        isForceUpdate: Boolean(r.isForceUpdate),
        buildNumber: Number(r.buildNumber),
        releaseNotes: String(r.releaseNotes),
        downloadUrl: String(r.downloadUrl),
      }));
    },
    enabled: !!actor && !isFetching,
  });
}
