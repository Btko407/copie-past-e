import { useDevice } from "@/hooks/useDevice";
import { useExtensionStatus } from "@/hooks/useExtensionStatus";
/**
 * StatusToast — transient session notification for missing extension.
 *
 * Shows once per session (sessionStorage guard). Desktop-only. Uses Sonner
 * toast() with retro-cyberpunk amber/neon styling. Duration 5000ms. After
 * dismissal the toast is gone — HeaderStatus handles the persistent icon.
 */
import { useEffect } from "react";
import { toast } from "sonner";

const SESSION_KEY = "copie_toast_shown";

export function StatusToast() {
  const { isMobile } = useDevice();
  const { extensionInstalled } = useExtensionStatus();

  useEffect(() => {
    // Only show on desktop, only if extension is missing, only once per session
    if (isMobile) return;
    if (extensionInstalled) return;
    if (sessionStorage.getItem(SESSION_KEY)) return;

    sessionStorage.setItem(SESSION_KEY, "1");

    toast.custom(
      (t) => (
        <div
          className="flex flex-col gap-1.5 px-4 py-3 rounded-lg font-mono text-xs"
          style={{
            background: "oklch(0.12 0 0)",
            border: "1px solid oklch(0.88 0.19 84 / 0.7)",
            boxShadow:
              "0 0 16px oklch(0.88 0.19 84 / 0.25), 0 2px 8px rgba(0,0,0,0.6)",
            minWidth: "300px",
            maxWidth: "380px",
          }}
          data-ocid="extension-status.toast"
        >
          <div className="flex items-center gap-2">
            <span style={{ color: "oklch(0.88 0.19 84)" }} className="text-sm">
              ⚠
            </span>
            <span
              style={{
                color: "oklch(0.88 0.19 84)",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Manual Mode Active
            </span>
            <button
              type="button"
              onClick={() => toast.dismiss(t)}
              className="ml-auto transition-colors"
              style={{ color: "oklch(0.5 0 0)" }}
              aria-label="Dismiss"
              data-ocid="extension-status.toast.close_button"
            >
              ×
            </button>
          </div>
          <p style={{ color: "oklch(0.75 0 0)", lineHeight: 1.5 }}>
            Extension missing. Install the Expansion Module for 1-click
            autofill.
          </p>
          <a
            href="/extension-setup"
            className="self-start transition-colors"
            style={{
              color: "oklch(0.88 0.19 84)",
              textDecoration: "underline",
              fontWeight: 600,
            }}
            data-ocid="extension-status.toast.install_link"
          >
            Install Now →
          </a>
        </div>
      ),
      {
        duration: 5000,
        position: "top-right",
        id: "extension-missing-toast",
      },
    );
  }, [isMobile, extensionInstalled]);

  return null;
}
