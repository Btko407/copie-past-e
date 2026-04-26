import type { Identity } from "@dfinity/agent";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { saveDraftIdentity } from "../hooks/useAuth";
import type { AuthStatus } from "../types";

// ─── Auth context ─────────────────────────────────────────────────────────────

export interface AuthContextValue {
  isAuthenticated: boolean;
  isInitializing: boolean;
  authReady: boolean;
  status: AuthStatus;
  principalId?: string;
  identity: Identity | null;
  /** Opens NFID modal — supports both Google and Internet Identity (user chooses in NFID UI) */
  login: () => Promise<void>;
  logout: () => Promise<void>;
  /** Alias for logout — backward compat with pages that call `clear()` */
  clear: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

// ─── NFID lazy singleton ──────────────────────────────────────────────────────

// Import type only — real instance created via NFID.init()
import type { NFID as NfidType } from "@nfid/embed";

let nfidSingleton: NfidType | null = null;

async function getNfid(): Promise<NfidType> {
  if (nfidSingleton) return nfidSingleton;
  const { NFID } = await import("@nfid/embed");
  nfidSingleton = await NFID.init({
    application: {
      name: "Copie Past-e",
      logo: `${window.location.origin}/assets/generated/copie-paste-logo-transparent.dim_200x200.png`,
    },
  });
  return nfidSingleton;
}

// ─── Global NFID bridge (consumed by patched InternetIdentityProvider) ────────
//
// @caffeineai/core-infrastructure's useActor reads identity via
// useInternetIdentity(). The patched version of that hook reads from this
// global bridge, so we must keep it in sync with our NFID auth state.

declare global {
  // eslint-disable-next-line no-var
  var __nfidIdentityBridge: {
    identity?: Identity;
    isInitializing: boolean;
    loginStatus: string;
    loginError?: Error;
    login?: () => void;
    clear?: () => void;
    subscribers?: Set<() => void>;
  };
}

function notifyBridgeSubscribers() {
  try {
    if (globalThis.__nfidIdentityBridge?.subscribers) {
      for (const fn of globalThis.__nfidIdentityBridge.subscribers) {
        fn();
      }
    }
  } catch {
    // ignore
  }
}

function updateBridge(patch: Partial<typeof globalThis.__nfidIdentityBridge>) {
  if (typeof globalThis.__nfidIdentityBridge === "undefined") {
    globalThis.__nfidIdentityBridge = {
      isInitializing: true,
      loginStatus: "initializing",
      subscribers: new Set(),
    };
  }
  Object.assign(globalThis.__nfidIdentityBridge, patch);
  notifyBridgeSubscribers();
}

// ─── AuthProvider ─────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [principalId, setPrincipalId] = useState<string | undefined>(undefined);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const initRef = useRef(false);

  // Restore existing session on mount
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    // Initialise bridge immediately so InternetIdentityProvider renders
    updateBridge({ isInitializing: true, loginStatus: "initializing" });

    let cancelled = false;
    (async () => {
      try {
        const nfid = await getNfid();
        if (cancelled) return;
        if (nfid.isAuthenticated) {
          const id = nfid.getIdentity();
          const p = id.getPrincipal();
          if (!p.isAnonymous()) {
            setIdentity(id as Identity);
            setPrincipalId(p.toText());
            setIsAuthenticated(true);
            updateBridge({
              identity: id as Identity,
              isInitializing: false,
              loginStatus: "success",
            });
            return;
          }
        }
      } catch (err) {
        console.warn("[AuthProvider] NFID init error:", err);
      } finally {
        if (!cancelled) {
          setIsInitializing(false);
          updateBridge({ isInitializing: false, loginStatus: "idle" });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Keep bridge in sync whenever identity or status changes
  useEffect(() => {
    updateBridge({
      identity: identity ?? undefined,
      isInitializing,
      loginStatus: isInitializing
        ? "initializing"
        : isAuthenticated
          ? "success"
          : "idle",
    });
  }, [identity, isInitializing, isAuthenticated]);

  // Persist draft identity for extension whenever principal changes
  useEffect(() => {
    if (!isInitializing && principalId && identity) {
      saveDraftIdentity(identity, principalId);
    }
  }, [isInitializing, principalId, identity]);

  const login = useCallback(async () => {
    try {
      setIsInitializing(true);
      updateBridge({ isInitializing: true, loginStatus: "logging-in" });
      const nfid = await getNfid();

      // getDelegation opens the NFID iframe which presents both
      // "Sign in with Google" and "Internet Identity" options.
      const id = await nfid.getDelegation({
        maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1_000_000_000), // 7 days in ns
      });

      const p = id.getPrincipal();
      if (!p.isAnonymous()) {
        setIdentity(id as Identity);
        setPrincipalId(p.toText());
        setIsAuthenticated(true);
        updateBridge({
          identity: id as Identity,
          isInitializing: false,
          loginStatus: "success",
        });
      }
    } catch (err) {
      // User cancelled or error — do not surface as crash
      console.warn("[AuthProvider] login cancelled or error:", err);
      updateBridge({ isInitializing: false, loginStatus: "idle" });
    } finally {
      setIsInitializing(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const nfid = await getNfid();
      await nfid.logout();
    } catch (err) {
      console.warn("[AuthProvider] logout error:", err);
    } finally {
      setIdentity(null);
      setPrincipalId(undefined);
      setIsAuthenticated(false);
      updateBridge({
        identity: undefined,
        isInitializing: false,
        loginStatus: "idle",
      });
    }
  }, []);

  const status: AuthStatus = isInitializing
    ? "initializing"
    : isAuthenticated
      ? "authenticated"
      : "unauthenticated";

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      isInitializing,
      authReady: !isInitializing,
      status,
      principalId,
      identity,
      login,
      logout,
      clear: logout,
    }),
    [
      isAuthenticated,
      isInitializing,
      status,
      principalId,
      identity,
      login,
      logout,
    ],
  );

  // Expose login/clear on bridge so InternetIdentityProvider can delegate
  useEffect(() => {
    updateBridge({ login, clear: logout });
  }, [login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
