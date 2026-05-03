import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { createActor } from "../backend";
import type { ExtensionListingData } from "../types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ActorAny = any;

// ─── Mobile Detection ─────────────────────────────────────────────────────────

/**
 * Returns true if the current device appears to be a mobile device.
 * On mobile, all extension-related UI should be hidden.
 */
export function isMobile(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent);
}

// ─── Extension Detection ──────────────────────────────────────────────────────

/**
 * Detects whether the Copie Past-e Chrome extension is installed.
 *
 * Detection strategy (in order of priority):
 * 1. On mobile: always returns isInstalled=false, skip all detection.
 * 2. Check window.__COPIE_PASTE_INSTALLED__ flag (injected by content_script.js).
 *    A 500ms debounce allows the extension time to inject the flag after navigation.
 * 3. Fallback: postMessage COPIE_PASTE_PING for backward compat with older
 *    extension versions that don't inject the global flag.
 * 4. localStorage "ext_installed" is used as the persisted initial state so
 *    returning users see the correct state immediately.
 */
// ─── Extension state shape ────────────────────────────────────────────────────

export interface ExtensionState {
  isInstalled: boolean;
  version: string;
  capabilities: string[];
}

const DEFAULT_CAPABILITIES = ["facebook", "mercari"];
const READY_MESSAGE_TYPES = [
  "COPIE_PASTE_EXT_PRESENT",
  "EXTENSION_READY",
  "COPIE_EXTENSION_READY",
] as const;

const STORAGE_KEY = "ext_state";

function loadPersistedState(): ExtensionState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as ExtensionState;
  } catch {
    /* ignore */
  }
  return {
    isInstalled: false,
    version: "",
    capabilities: DEFAULT_CAPABILITIES,
  };
}

function savePersistedState(state: ExtensionState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    // Keep legacy key in sync so ExtensionBanner still works
    localStorage.setItem("ext_installed", state.isInstalled ? "true" : "false");
  } catch {
    /* ignore */
  }
}

/**
 * Detects whether the Copie Past-e Chrome extension is installed.
 * Now stores { isInstalled, version, capabilities } instead of just isInstalled.
 *
 * Detection strategy:
 * 1. Mobile: always { isInstalled: false }
 * 2. window.__COPIE_PASTE_INSTALLED__ flag (500ms debounce)
 * 3. postMessage handshake — supports ALL THREE message types:
 *    COPIE_PASTE_EXT_PRESENT, EXTENSION_READY, COPIE_EXTENSION_READY
 * 4. localStorage persistence so returning users see correct state immediately.
 */
export function useExtensionDetection() {
  const mobile = isMobile();

  const [extState, setExtState] = useState<ExtensionState>(() => {
    if (mobile) return { isInstalled: false, version: "", capabilities: [] };
    return loadPersistedState();
  });

  // Ref mirror — lets the effect read current state without adding to deps
  const extStateRef = useRef<ExtensionState>(extState);
  extStateRef.current = extState;

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function persist(state: ExtensionState) {
      savePersistedState(state);
      setExtState(state);
    }

    if (mobile) {
      persist({ isInstalled: false, version: "", capabilities: [] });
      return;
    }

    debounceRef.current = setTimeout(() => {
      // Primary: global flag injected by content script
      if (
        (window as unknown as Record<string, unknown>)
          .__COPIE_PASTE_INSTALLED__ === true
      ) {
        persist({
          isInstalled: true,
          version: extStateRef.current.version || "",
          capabilities:
            extStateRef.current.capabilities.length > 0
              ? extStateRef.current.capabilities
              : DEFAULT_CAPABILITIES,
        });
        return;
      }

      // Fallback: listen for any of the three ready message types
      function handleMessage(e: MessageEvent) {
        const type: string = e.data?.type ?? "";
        if ((READY_MESSAGE_TYPES as readonly string[]).includes(type)) {
          if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
          }
          const version: string =
            typeof e.data?.version === "string" ? e.data.version : "";
          const capabilities: string[] = Array.isArray(e.data?.capabilities)
            ? (e.data.capabilities as string[])
            : DEFAULT_CAPABILITIES;
          persist({ isInstalled: true, version, capabilities });
          window.removeEventListener("message", handleMessage);
        }
      }

      window.addEventListener("message", handleMessage);
      window.postMessage({ type: "COPIE_PASTE_PING" }, "*");

      timerRef.current = setTimeout(() => {
        if (
          (window as unknown as Record<string, unknown>)
            .__COPIE_PASTE_INSTALLED__ === true
        ) {
          persist({
            isInstalled: true,
            version: extStateRef.current.version || "",
            capabilities:
              extStateRef.current.capabilities.length > 0
                ? extStateRef.current.capabilities
                : DEFAULT_CAPABILITIES,
          });
        } else {
          persist({
            isInstalled: false,
            version: "",
            capabilities: DEFAULT_CAPABILITIES,
          });
        }
        window.removeEventListener("message", handleMessage);
      }, 5000);
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobile]);

  // React to storage changes from other tabs
  useEffect(() => {
    if (mobile) return;
    function handleStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setExtState(JSON.parse(e.newValue) as ExtensionState);
        } catch {
          /* ignore */
        }
      }
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [mobile]);

  return {
    isInstalled: extState.isInstalled,
    version: extState.version,
    capabilities: extState.capabilities,
    isMobileDevice: mobile,
  };
}

/**
 * Returns true if the currently detected extension reports support for the
 * given platform. Falls back to true when extension is not installed (buttons
 * should be enabled and show the download prompt instead of being disabled).
 */
export function isPlatformSupported(
  platform: string,
  capabilities: string[],
): boolean {
  if (capabilities.length === 0) return true; // no extension yet — show all buttons
  return capabilities.includes(platform);
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
    staleTime: 300_000,
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

// ─── Receive Extension Data ───────────────────────────────────────────────────

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
    refetchInterval: 1000 * 60 * 60,
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
