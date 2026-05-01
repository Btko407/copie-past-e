import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import type { Identity } from "@dfinity/agent";
import type { AuthStatus } from "../types"; // imported for use inside this file

// ── Draft identity helpers (for extension compatibility) ─────────────────────

const DEBUG_IDENTITY_KEY = "__copie_paste_draft_identity";
const DEBUG_PRINCIPAL_KEY = "__copie_paste_draft_principal";
const DEBUG_TIMESTAMP_KEY = "__copie_paste_draft_timestamp";

export function saveDraftIdentity(identity: unknown, principal: string): void {
  try {
    localStorage.setItem(DEBUG_IDENTITY_KEY, JSON.stringify(identity));
    localStorage.setItem(DEBUG_PRINCIPAL_KEY, principal);
    localStorage.setItem(DEBUG_TIMESTAMP_KEY, Date.now().toString());
    console.log("Draft identity saved for extension:", principal);
  } catch (err) {
    console.warn("Could not save draft identity:", err);
  }
}

export function getDraftIdentity(): {
  principal: string;
  timestamp: number;
} | null {
  try {
    const stored = localStorage.getItem(DEBUG_PRINCIPAL_KEY);
    const timestamp = localStorage.getItem(DEBUG_TIMESTAMP_KEY);
    if (
      stored &&
      timestamp &&
      Date.now() - Number.parseInt(timestamp) < 24 * 60 * 60 * 1000
    ) {
      return { principal: stored, timestamp: Number.parseInt(timestamp) };
    }
  } catch (err) {
    console.warn("Could not retrieve draft identity:", err);
  }
  return null;
}

export function clearDraftIdentity(): void {
  localStorage.removeItem(DEBUG_IDENTITY_KEY);
  localStorage.removeItem(DEBUG_PRINCIPAL_KEY);
  localStorage.removeItem(DEBUG_TIMESTAMP_KEY);
  console.log("Cleared draft identity");
}

// Re-export AuthStatus from canonical location for backward compat
export type { AuthStatus } from "../types";

// ── Auth state shape ─────────────────────────────────────────────────────────

export interface AuthContextValue {
  isAuthenticated: boolean;
  /** True while the identity provider is still resolving the session. */
  isInitializing: boolean;
  /** Shorthand: !isInitializing */
  authReady: boolean;
  status: AuthStatus;
  principalId?: string;
  identity: Identity | undefined;
  login: () => void;
  logout: () => void;
  /** Alias for logout — backward compat with pages that call `clear()` */
  clear: () => void;
}

// ── useAuth hook ─────────────────────────────────────────────────────────────

/**
 * Thin wrapper around useInternetIdentity that exposes the shape the rest of
 * the app expects (isAuthenticated, isInitializing, authReady, principalId,
 * identity, login, logout / clear).
 *
 * @caffeineai/core-infrastructure v0.1.0 does not expose `isAuthenticated` —
 * we derive it from the identity being present and non-anonymous.
 */
export function useAuth(): AuthContextValue {
  const ii = useInternetIdentity();
  const identity = ii.identity as Identity | undefined;
  const principalId = identity?.getPrincipal().toText();
  // isAuthenticated: identity exists and is not the anonymous principal
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const status: AuthStatus = ii.isInitializing
    ? "initializing"
    : isAuthenticated
      ? "authenticated"
      : "unauthenticated";

  return {
    isAuthenticated,
    isInitializing: ii.isInitializing,
    authReady: !ii.isInitializing,
    status,
    principalId,
    identity,
    login: ii.login,
    logout: ii.clear,
    clear: ii.clear,
  };
}
