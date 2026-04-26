import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import type { AuthContextValue } from "../providers/AuthProvider";

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

export type { AuthContextValue as AuthState };

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
