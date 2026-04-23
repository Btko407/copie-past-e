/**
 * Draft/Local Environment Utilities
 * Allows testing extension functionality without pushing to live canister
 */

export const DRAFT_CONFIG = {
  IDENTITY_STORAGE_KEY: "__copie_paste_draft_identity",
  PRINCIPAL_STORAGE_KEY: "__copie_paste_draft_principal",
  MODE_KEY: "__copie_paste_mode",
  IDENTITY_TTL_MS: 24 * 60 * 60 * 1000,
};

export function isDraftMode(): boolean {
  if (typeof window === "undefined") return false;
  const url = new URL(window.location.href);
  return (
    url.searchParams.has("draft") ||
    url.hostname.includes("localhost") ||
    url.hostname.includes("127.0.0.1") ||
    url.hostname.includes("preview") ||
    localStorage.getItem(DRAFT_CONFIG.MODE_KEY) === "draft"
  );
}

export function setDraftMode(enabled: boolean): void {
  if (enabled) {
    localStorage.setItem(DRAFT_CONFIG.MODE_KEY, "draft");
    console.log(
      "Draft mode ENABLED — testing extensions locally without live deploy",
    );
  } else {
    localStorage.removeItem(DRAFT_CONFIG.MODE_KEY);
    console.log("Draft mode disabled — production mode active");
  }
}

export function getCurrentEnvironment(): "draft" | "live" {
  return isDraftMode() ? "draft" : "live";
}

// Log draft mode status on load (only in browser)
if (typeof window !== "undefined" && isDraftMode()) {
  console.log(
    "DRAFT MODE ACTIVE — Extension testing available — Identity persisted for 24 hours",
  );
}
