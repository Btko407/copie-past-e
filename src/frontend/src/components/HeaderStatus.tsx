/**
 * HeaderStatus — permanent navbar extension status badge.
 *
 * Desktop + no extension: pulsing amber ⚠️ "Autofill Disabled" badge,
 *   clicking navigates to /extension-setup.
 * Desktop + extension installed: steady green ✅ "System Synced" badge.
 * Mobile: returns null (not rendered).
 *
 * Pulse is CSS keyframe animation (opacity + scale) defined inline.
 */
import { useDevice } from "@/hooks/useDevice";
import { useExtensionStatus } from "@/hooks/useExtensionStatus";
import { useNavigate } from "@tanstack/react-router";

export function HeaderStatus() {
  const { isMobile } = useDevice();
  const { extensionInstalled } = useExtensionStatus();
  const navigate = useNavigate();

  // Mobile: render nothing
  if (isMobile) return null;

  if (extensionInstalled) {
    return (
      <div
        className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded font-mono text-[10px] tracking-widest uppercase"
        style={{
          color: "oklch(0.75 0.18 140)",
          border: "1px solid oklch(0.75 0.18 140 / 0.4)",
          background: "oklch(0.75 0.18 140 / 0.08)",
        }}
        title="Copie Past-e extension detected — autofill enabled"
        data-ocid="header-status.synced"
      >
        <span>✅</span>
        <span>System Synced</span>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes header-status-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.55; transform: scale(0.92); }
        }
        .header-status-pulse {
          animation: header-status-pulse 2s ease-in-out infinite;
        }
      `}</style>
      <button
        type="button"
        onClick={() => navigate({ to: "/extension-setup" })}
        className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded font-mono text-[10px] tracking-widest uppercase cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2"
        style={{
          color: "oklch(0.88 0.19 84)",
          border: "1px solid oklch(0.88 0.19 84 / 0.5)",
          background: "oklch(0.88 0.19 84 / 0.08)",
        }}
        title="Autofill extension not detected. Click to install."
        aria-label="Autofill Disabled — click to install the extension"
        data-ocid="header-status.disabled"
      >
        <span className="header-status-pulse">⚠️</span>
        <span>Autofill Disabled</span>
      </button>
    </>
  );
}
