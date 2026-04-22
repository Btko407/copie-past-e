import { Button } from "@/components/ui/button";
import { useExtensionDetection } from "@/hooks/useExtension";
import { Link } from "@tanstack/react-router";
import { ExternalLink, X, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Image } from "../backend.d.ts";
import { LightningAnimation } from "./animations/LightningAnimation";

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

interface SmartPostButtonsProps {
  title: string;
  description: string;
  price?: string;
  category?: string;
  condition?: string;
  brand?: string;
  images: Image[];
}

// Strip "$" prefix and non-numeric characters for Smart Post price payload
function stripPrice(price?: string): string {
  if (!price) return "0";
  return price.replace(/^\$/, "").replace(/[^0-9.]/g, "") || "0";
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
          . Install it to auto-fill listings directly into Facebook Marketplace
          with one click.
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
  title,
  description,
  price,
  category,
  condition,
  brand,
  images,
}: SmartPostButtonsProps) {
  const { isInstalled } = useExtensionDetection();
  const isMobile = useIsMobile();

  const [lightning, setLightning] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);

  const imageUrls = images.map((img) => img.blob.getDirectURL());

  function triggerLightning() {
    setLightning(true);
    setTimeout(() => setLightning(false), 700);
  }

  function sendSmartPost(platform: "facebook" | "mercari") {
    const data = {
      action: "SMART_POST" as const,
      platform,
      listing: {
        title,
        price: stripPrice(price),
        description,
        category: category ?? "",
        condition: condition ?? "",
        brand: brand ?? "",
        images: imageUrls,
      },
    };

    // Send to extension
    window.postMessage({ type: "COPIE_PASTE_SMART_POST", ...data }, "*");

    // Fallback localStorage
    localStorage.setItem("copiepaste_pending_post", JSON.stringify(data));
  }

  function handleAutoFill() {
    triggerLightning();
    sendSmartPost("facebook");

    if (!isInstalled) {
      setTimeout(() => setShowInstallModal(true), 400);
    } else {
      toast.success("📘 Sent to Facebook Auto-Fill", { duration: 2000 });
    }
  }

  function handleMercariAutoFill() {
    triggerLightning();
    sendSmartPost("mercari");

    if (!isInstalled) {
      setTimeout(() => setShowInstallModal(true), 400);
    } else {
      toast.success("🟠 Sent to Mercari Auto-Fill", { duration: 2000 });
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

        <div className="space-y-2">
          {isMobile ? (
            /* ── Mobile: disabled gray buttons + instruction text ── */
            <div className="space-y-2" data-ocid="smart-post-mobile-disabled">
              <Button
                variant="outline"
                size="sm"
                disabled
                className="w-full font-mono text-xs border-border text-muted-foreground bg-muted/30 cursor-not-allowed h-9 gap-1.5"
                data-ocid="autofill-facebook-desktop-only-btn"
              >
                <span>📘</span>
                <span>Auto-Fill Facebook (Desktop Only)</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled
                className="w-full font-mono text-xs border-border text-muted-foreground bg-muted/30 cursor-not-allowed h-9 gap-1.5"
                data-ocid="autofill-mercari-desktop-only-btn"
              >
                <span>🟠</span>
                <span>Auto-Fill Mercari (Desktop Only)</span>
              </Button>
              <p className="text-center font-mono text-[10px] text-muted-foreground leading-relaxed px-1">
                Install Chrome on your desktop computer to use Smart Post. On
                mobile, copy your listing details manually.
              </p>
            </div>
          ) : (
            /* ── Desktop: full button with extension detection ── */
            <div className="space-y-2" data-ocid="smart-post-desktop">
              {/* Extension connected indicator */}
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

              {/* Auto-Fill Facebook Marketplace button */}
              <Button
                variant="outline"
                size="sm"
                className="relative w-full font-mono text-xs border-primary/40 text-foreground hover:border-primary hover:bg-primary/10 transition-smooth gap-1.5 h-9"
                onClick={handleAutoFill}
                data-ocid="autofill-facebook-btn"
              >
                <span>📘</span>
                <span>Auto-Fill Facebook Marketplace</span>
                {!isInstalled && (
                  <span className="absolute -top-1.5 -right-1.5 px-1 py-0.5 text-[8px] font-display tracking-wider bg-accent text-accent-foreground rounded-full leading-none border border-accent/60 whitespace-nowrap">
                    + Install Extension
                  </span>
                )}
              </Button>

              {/* Auto-Fill Mercari button */}
              <Button
                variant="outline"
                size="sm"
                className="relative w-full font-mono text-xs border-orange-500/40 text-foreground hover:border-orange-500 hover:bg-orange-500/10 transition-smooth gap-1.5 h-9"
                onClick={handleMercariAutoFill}
                data-ocid="autofill-mercari-btn"
              >
                <span>🟠</span>
                <span>Auto-Fill Mercari</span>
                {!isInstalled && (
                  <span className="absolute -top-1.5 -right-1.5 px-1 py-0.5 text-[8px] font-display tracking-wider bg-accent text-accent-foreground rounded-full leading-none border border-accent/60 whitespace-nowrap">
                    + Install Extension
                  </span>
                )}
              </Button>

              {/* Permanent desktop-only notice */}
              <p
                className="text-center font-mono text-[10px] text-muted-foreground tracking-wider"
                data-ocid="smart-post-desktop-notice"
              >
                Desktop Chrome only — requires the Copie Past-e extension
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
