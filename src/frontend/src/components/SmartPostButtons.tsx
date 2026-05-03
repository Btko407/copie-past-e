import { Button } from "@/components/ui/button";
import {
  isPlatformSupported,
  useExtensionDetection,
} from "@/hooks/useExtension";
import { Link } from "@tanstack/react-router";
import { ExternalLink, X, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { MasterListing, PlatformListingDraft } from "../backend.d.ts";
import { ALL_PLATFORMS, PLATFORM_CONFIG } from "../types/masterListing";
import type { Platform } from "../types/masterListing";
import { normalizePlatform } from "../utils/normalizePlatform";
import { LightningAnimation } from "./animations/LightningAnimation";

// ─── Mobile Detection ─────────────────────────────────────────────────────────

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768,
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface SmartPostButtonsProps {
  masterListing: MasterListing;
  platformDrafts?: PlatformListingDraft[];
}

// ─── Payload Builder ─────────────────────────────────────────────────────────

function stripPrice(price?: string | null): string {
  if (!price) return "0";
  return price.replace(/^\$/, "").replace(/[^0-9.]/g, "") || "0";
}

function buildSmartPostPayload(
  masterListing: MasterListing,
  platform: string,
  drafts: PlatformListingDraft[] | undefined,
) {
  // Priority 1: find existing platform draft
  const draft = drafts?.find((d) => normalizePlatform(d.platform) === platform);

  // Extract platform-specific fields from the draft's platformFields variant
  let platformFields: Record<string, unknown> = {};
  if (draft?.platformFields) {
    const pf = draft.platformFields as Record<string, unknown>;
    const nested = pf[platform] ?? pf.mecari ?? {}; // handle mecari alias
    if (nested && typeof nested === "object") {
      platformFields = nested as Record<string, unknown>;
    }
  }

  // Priority 2: master listing fields; Priority 3: safe defaults
  const pfTitle = (platformFields.title as string) || "";
  const pfDesc = (platformFields.description as string) || "";
  const pfPrice = (platformFields.price as string) || "";

  return {
    title: pfTitle || masterListing.title || "",
    description: pfDesc || masterListing.description || "",
    price: pfPrice || stripPrice(masterListing.price),
    brand: (platformFields.brand as string) || "",
    category:
      (platformFields.category as string) || masterListing.category || "",
    condition: (platformFields.condition as string) || "",
    images: Array.isArray(masterListing.photos) ? [] : [], // Uint8Array — extension uses URLs; skip
    platformFields,
  };
}

// ─── Extension Install Modal ──────────────────────────────────────────────────

function ExtensionInstallModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      role="presentation"
      data-ocid="ext-install-modal-backdrop"
    >
      <div
        className="relative w-full max-w-sm rounded-xl border border-primary/40 bg-card p-6 space-y-4 neon-border-blue"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        data-ocid="ext-install-modal"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center glow-blue-sm">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-display text-sm text-primary text-glow-blue tracking-wider">
              EXTENSION REQUIRED
            </p>
            <p className="font-mono text-[10px] text-muted-foreground">
              Auto-Fill feature
            </p>
          </div>
        </div>

        <p className="text-sm text-foreground/90 leading-relaxed">
          This feature requires the{" "}
          <span className="text-primary font-medium">
            Copie Past-e Chrome Extension
          </span>
          . Install it to auto-fill listings directly into any marketplace with
          one click.
        </p>

        <div className="flex gap-2">
          <Link
            to="/extension"
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-md h-9 border border-primary/50 bg-primary/10 text-primary text-xs font-display tracking-wider hover:bg-primary/20 transition-smooth"
            data-ocid="ext-install-modal-link"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            How to Install
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="font-mono text-xs text-muted-foreground hover:text-foreground"
            data-ocid="ext-install-modal-close"
          >
            Got It
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function SmartPostButtons({
  masterListing,
  platformDrafts,
}: SmartPostButtonsProps) {
  const { isInstalled, capabilities } = useExtensionDetection();
  const isMobile = useIsMobile();

  const [lightning, setLightning] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const resultListenerRef = useRef<((e: MessageEvent) => void) | null>(null);

  // Listen for autofill results from the extension
  useEffect(() => {
    function handleResult(e: MessageEvent) {
      const data = e.data;
      if (!data || data.source !== "copie-past-e-extension") return;
      if (data.type !== "COPIE_AUTOFILL_RESULT") return;

      const platform = String(data.platform || "");
      const config = PLATFORM_CONFIG[platform as Platform];
      const name = config?.name ?? platform;
      const filled: string[] = Array.isArray(data.filled) ? data.filled : [];
      const failed: string[] = Array.isArray(data.failed) ? data.failed : [];

      if (data.ok) {
        toast.success(
          `${config?.icon ?? "✅"} Auto-filled ${name}: ${filled.length} field${filled.length === 1 ? "" : "s"} filled`,
          { duration: 4000 },
        );
      } else {
        toast.error(`Auto-fill ${name} failed`, { duration: 4000 });
      }

      if (failed.length > 0) {
        toast.warning(
          `${name}: ${failed.length} field${failed.length === 1 ? "" : "s"} could not be filled`,
          { duration: 5000 },
        );
      }
    }

    resultListenerRef.current = handleResult;
    window.addEventListener("message", handleResult);
    return () => window.removeEventListener("message", handleResult);
  }, []);

  function triggerLightning() {
    setLightning(true);
    setTimeout(() => setLightning(false), 700);
  }

  function sendSmartPost(platform: Platform) {
    const payload = buildSmartPostPayload(
      masterListing,
      platform,
      platformDrafts,
    );

    // New unified COPIE_AUTOFILL contract
    window.postMessage(
      {
        source: "copie-past-e-app",
        type: "COPIE_AUTOFILL",
        platform,
        payload,
      },
      "*",
    );

    // Backward-compat fallback
    window.postMessage(
      {
        source: "copie-past-e-app",
        type: "COPIE_PASTE_SMART_POST",
        action: "SMART_POST",
        platform,
        data: payload,
      },
      "*",
    );
  }

  function handlePlatformClick(platform: Platform) {
    triggerLightning();
    sendSmartPost(platform);

    if (!isInstalled) {
      // Save to localStorage as fallback
      const payload = buildSmartPostPayload(
        masterListing,
        platform,
        platformDrafts,
      );
      try {
        localStorage.setItem(
          `copie-paste-draft-${platform}`,
          JSON.stringify(payload),
        );
      } catch {
        /* ignore storage errors */
      }

      const config = PLATFORM_CONFIG[platform];
      toast.info(
        `Draft saved. Navigate to ${config.name} and open the extension.`,
        { duration: 5000 },
      );
      setTimeout(() => setShowInstallModal(true), 400);
    } else {
      const config = PLATFORM_CONFIG[platform];
      toast.success(`${config.icon} Sending to ${config.name} Auto-Fill…`, {
        duration: 2000,
      });
    }
  }

  return (
    <>
      <LightningAnimation active={lightning} />

      {showInstallModal && (
        <ExtensionInstallModal onClose={() => setShowInstallModal(false)} />
      )}

      <div className="space-y-3" data-ocid="smart-post-section">
        <div className="flex items-center gap-2">
          <div className="h-px flex-1 bg-border/50" />
          <span className="font-display text-xs tracking-widest text-primary text-glow-blue uppercase px-2">
            ⚡ Smart Post
          </span>
          <div className="h-px flex-1 bg-border/50" />
        </div>

        {isMobile ? (
          /* ── Mobile: all six disabled ── */
          <div className="space-y-2" data-ocid="smart-post-mobile-disabled">
            {ALL_PLATFORMS.map((platform) => {
              const cfg = PLATFORM_CONFIG[platform];
              return (
                <Button
                  key={platform}
                  variant="outline"
                  size="sm"
                  disabled
                  title="Use desktop to auto-fill"
                  className="w-full font-mono text-xs border-border text-muted-foreground bg-muted/30 cursor-not-allowed h-9 gap-1.5"
                  data-ocid={`autofill-${platform}-desktop-only-btn`}
                >
                  <span>{cfg.icon}</span>
                  <span>Auto-Fill {cfg.name} (Desktop Only)</span>
                </Button>
              );
            })}
            <p className="text-center font-mono text-[10px] text-muted-foreground leading-relaxed px-1">
              Install Chrome on desktop to use Smart Post. On mobile, copy your
              listing details manually.
            </p>
          </div>
        ) : (
          /* ── Desktop: six platform buttons ── */
          <div className="space-y-2" data-ocid="smart-post-desktop">
            {isInstalled && (
              <div
                className="flex items-center justify-center gap-1.5"
                data-ocid="ext-connected-indicator"
              >
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                <span className="text-xs text-green-400 font-mono">
                  Extension Connected
                </span>
              </div>
            )}

            {ALL_PLATFORMS.map((platform) => {
              const cfg = PLATFORM_CONFIG[platform];
              const platformSupported = isPlatformSupported(
                platform,
                capabilities,
              );
              const isDisabled = isInstalled && !platformSupported;
              const tooltip = !isInstalled
                ? "Extension not detected — click to save draft"
                : isDisabled
                  ? `Update extension to support ${cfg.name}`
                  : `Auto-Fill ${cfg.name}`;

              return (
                <Button
                  key={platform}
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isDisabled}
                  title={tooltip}
                  className="relative w-full font-mono text-xs border-primary/40 text-foreground hover:border-primary hover:bg-primary/10 transition-smooth gap-1.5 h-9 disabled:opacity-40 disabled:cursor-not-allowed"
                  onClick={() => handlePlatformClick(platform)}
                  data-ocid={`autofill-${platform}-btn`}
                >
                  <span>{cfg.icon}</span>
                  <span>Auto-Fill {cfg.name}</span>
                  {!isInstalled && (
                    <span className="absolute -top-1.5 -right-1.5 px-1 py-0.5 text-[8px] font-display tracking-wider bg-accent text-accent-foreground rounded-full leading-none border border-accent/60 whitespace-nowrap">
                      + Install Extension
                    </span>
                  )}
                  {isDisabled && (
                    <span className="absolute -top-1.5 -right-1.5 px-1 py-0.5 text-[8px] font-display tracking-wider bg-destructive/20 text-destructive rounded-full leading-none border border-destructive/40 whitespace-nowrap">
                      Update Needed
                    </span>
                  )}
                </Button>
              );
            })}

            <p
              className="text-center font-mono text-[10px] text-muted-foreground tracking-wider"
              data-ocid="smart-post-desktop-notice"
            >
              Desktop Chrome only — requires the Copie Past-e extension
            </p>
          </div>
        )}
      </div>
    </>
  );
}
