import { X } from "lucide-react";
import { useState } from "react";

// Detect mobile/tablet via userAgent
function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
}

/**
 * ExtensionBanner — nudge-only, never blocks.
 * Desktop only. Hidden if extension is already installed
 * (window.__COPIE_PASTE_INSTALLED__) or user dismisses it for the session.
 */
export function ExtensionBanner() {
  const [dismissed, setDismissed] = useState(false);

  // Mobile/tablet: never show
  if (isMobileDevice()) return null;

  // Extension already installed: never show
  if (
    typeof window !== "undefined" &&
    (window as unknown as Record<string, unknown>).__COPIE_PASTE_INSTALLED__ ===
      true
  )
    return null;

  // User dismissed for this session
  if (dismissed) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      className="relative flex items-center gap-3 px-4 py-2.5 font-mono text-xs"
      style={{
        background: "rgba(17, 10, 5, 0.95)",
        border: "1px solid #F59E0B",
        boxShadow:
          "0 0 12px rgba(245, 158, 11, 0.25), inset 0 0 20px rgba(245, 158, 11, 0.04)",
        borderRadius: "0.5rem",
      }}
      data-ocid="extension-banner"
    >
      {/* Amber glow left accent */}
      <span
        className="shrink-0 text-sm"
        aria-hidden="true"
        style={{ color: "#F59E0B", textShadow: "0 0 8px rgba(245,158,11,0.7)" }}
      >
        ⚠️
      </span>

      <p
        className="flex-1 min-w-0 leading-relaxed"
        style={{ color: "#FCD34D" }}
      >
        Autofill extension not detected.{" "}
        <a
          href="/copie-past-e.zip"
          download="copie-past-e.zip"
          className="underline underline-offset-2 font-semibold transition-colors"
          style={{
            color: "#F59E0B",
            textShadow: "0 0 6px rgba(245,158,11,0.6)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.color = "#FBBF24";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.color = "#F59E0B";
          }}
          data-ocid="extension-banner.download_button"
        >
          Download Expansion Module (.zip)
        </a>{" "}
        for 1-click listing.
      </p>

      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss extension banner"
        className="shrink-0 p-1 rounded transition-colors"
        style={{ color: "#92400E" }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = "#FCD34D";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = "#92400E";
        }}
        data-ocid="extension-banner.close_button"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
