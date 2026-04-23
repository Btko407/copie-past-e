import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useEffect } from "react";
import type { AuthStatus } from "../types";

// ── Draft identity helpers ───────────────────────────────────────────────────

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

// ── Auth state ───────────────────────────────────────────────────────────────

export interface AuthState {
  isAuthenticated: boolean;
  isInitializing: boolean;
  /** True once the identity provider has fully resolved (initializing === false). */
  authReady: boolean;
  status: AuthStatus;
  principalId?: string;
  login: () => void;
  logout: () => void;
}

export function useAuth(): AuthState {
  const { identity, login, clear, isInitializing, loginStatus } =
    useInternetIdentity();

  const principal = identity?.getPrincipal();
  const isAnonymous = !principal || principal.isAnonymous();
  const isAuthenticated =
    !isAnonymous &&
    (loginStatus === "success" ||
      (!!identity && loginStatus !== "initializing"));

  const status: AuthStatus = isInitializing
    ? "initializing"
    : isAuthenticated
      ? "authenticated"
      : "unauthenticated";

  // authReady is true as soon as the identity provider has resolved.
  // Use this to gate all backend actor calls so we never fire them with a
  // stale / anonymous identity.
  const authReady = !isInitializing;

  const principalId = !isAnonymous ? principal?.toText() : undefined;

  // Persist identity to localStorage so the Chrome extension can pick it up
  // for local/draft testing without needing a live deploy.
  useEffect(() => {
    if (authReady && principalId) {
      saveDraftIdentity(identity, principalId);
    }
  }, [authReady, principalId, identity]);

  return {
    isAuthenticated,
    isInitializing,
    authReady,
    status,
    principalId,
    login,
    logout: clear,
  };
}
