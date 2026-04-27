/**
 * InitializationPage — Retro-Cyberpunk System Boot screen.
 *
 * Mobile: auto-bypass — shows "MOBILE ACCESS INITIALIZED" header, skip all
 *   extension detection text, shows only "PROCEED TO TERMINAL" button.
 * Desktop: full boot sequence with silent extension check (never blocks proceed).
 *   Shows green status line if found, amber warning if not.
 *
 * "PROCEED TO TERMINAL" is ALWAYS enabled — never blocked.
 */

import { useDevice } from "@/hooks/useDevice";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Download,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

// ── Boot sequence lines ───────────────────────────────────────────────────────

interface BootLine {
  text: string;
  type: "info" | "success" | "warning" | "system";
  delay: number;
}

function buildBootLines(extensionInstalled: boolean): BootLine[] {
  const lines: BootLine[] = [
    {
      text: "> COPIE PAST-E CORE v1.3.0 — INITIALIZING...",
      type: "system",
      delay: 0,
    },
    {
      text: "> LOADING PLATFORM CONFIGS... [6/6 PLATFORMS]",
      type: "info",
      delay: 350,
    },
    { text: "> ICP CANISTER CONNECTION... OK", type: "success", delay: 700 },
    { text: "> USER PRINCIPAL VERIFIED... OK", type: "success", delay: 1000 },
    {
      text: "> LOADING MASTER LISTING ENGINE... OK",
      type: "success",
      delay: 1300,
    },
    {
      text: "> PLATFORM ADAPTERS: FACEBOOK, MERCARI, EBAY, POSHMARK, DEPOP, ETSY",
      type: "info",
      delay: 1600,
    },
  ];

  if (extensionInstalled) {
    lines.push(
      {
        text: "> AUTOFILL EXTENSION LINK... DETECTED ✓",
        type: "success",
        delay: 1900,
      },
      { text: "> ALL SYSTEMS NOMINAL.", type: "success", delay: 2200 },
      { text: "> SYSTEM READY.", type: "system", delay: 2500 },
    );
  } else {
    lines.push(
      {
        text: "⚠ AUTOFILL EXTENSION NOT DETECTED",
        type: "warning",
        delay: 1900,
      },
      {
        text: "> CORE MODULES READY. EXTENSION OPTIONAL.",
        type: "info",
        delay: 2200,
      },
      { text: "> SYSTEM READY.", type: "system", delay: 2500 },
    );
  }

  return lines;
}

const LINE_COLORS: Record<BootLine["type"], string> = {
  system: "text-primary",
  info: "text-foreground/80",
  success: "text-green-400",
  warning: "text-accent",
};

// ── Mobile Boot (simplified) ──────────────────────────────────────────────────

function MobileBoot({ onProceed }: { onProceed: () => void }) {
  return (
    <div
      className="min-h-screen bg-background flex flex-col items-center justify-center px-6 gap-8"
      data-ocid="initialization.page"
    >
      <div className="fixed inset-0 retro-grid opacity-20 pointer-events-none" />
      <div className="fixed inset-0 scanlines opacity-20 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-6 text-center max-w-sm w-full">
        <div className="flex items-center gap-2">
          <Zap className="w-6 h-6 text-primary" />
          <span className="font-display text-xl font-bold tracking-widest text-primary text-glow-blue">
            COPIE PAST-E
          </span>
        </div>

        <div
          className="w-full bg-card/90 backdrop-blur-sm neon-border-blue rounded-lg px-6 py-5 glow-blue-sm"
          data-ocid="initialization.terminal"
        >
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-primary/20">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <span className="font-mono text-xs text-green-400 tracking-widest uppercase font-bold">
              MOBILE ACCESS INITIALIZED
            </span>
          </div>
          <p className="font-mono text-xs text-foreground/70 leading-relaxed">
            &gt; All core modules loaded.
            <br />
            &gt; Running in mobile mode.
            <br />
            &gt; System ready.
          </p>
        </div>

        <button
          type="button"
          onClick={onProceed}
          className="group w-full flex items-center justify-center gap-3 bg-primary/10 hover:bg-primary/20 border border-primary/40 hover:border-primary/70 text-primary rounded-lg px-6 py-4 font-display text-sm tracking-widest uppercase transition-smooth hover:glow-blue-sm"
          data-ocid="initialization.proceed_button"
        >
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          PROCEED TO TERMINAL
        </button>
      </div>
    </div>
  );
}

// ── Desktop Boot ──────────────────────────────────────────────────────────────

export function InitializationPage() {
  const navigate = useNavigate();
  const { isMobile } = useDevice();

  // Silent extension flag check on desktop — no errors, no console noise
  const [extensionInstalled, setExtensionInstalled] = useState(false);
  const checkedRef = useRef(false);

  useEffect(() => {
    if (isMobile || checkedRef.current) return;
    checkedRef.current = true;

    try {
      if (
        (window as unknown as Record<string, unknown>)
          .__COPIE_PASTE_INSTALLED__ === true
      ) {
        setExtensionInstalled(true);
        return;
      }
    } catch {
      /* silent */
    }

    // Give extension 600ms to inject the flag
    const t = setTimeout(() => {
      try {
        if (
          (window as unknown as Record<string, unknown>)
            .__COPIE_PASTE_INSTALLED__ === true
        ) {
          setExtensionInstalled(true);
        }
      } catch {
        /* silent */
      }
    }, 600);

    return () => clearTimeout(t);
  }, [isMobile]);

  const handleProceed = () => navigate({ to: "/dashboard" });
  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = "/copie-past-e.zip";
    a.download = "copie-past-e.zip";
    a.click();
  };

  // Mobile: simplified bypass screen
  if (isMobile) {
    return <MobileBoot onProceed={handleProceed} />;
  }

  // Desktop: full boot sequence
  return (
    <DesktopBoot
      extensionInstalled={extensionInstalled}
      onProceed={handleProceed}
      onDownload={handleDownload}
    />
  );
}

// ── Desktop Boot Sequence ─────────────────────────────────────────────────────

function DesktopBoot({
  extensionInstalled,
  onProceed,
  onDownload,
}: {
  extensionInstalled: boolean;
  onProceed: () => void;
  onDownload: () => void;
}) {
  const bootLines = useMemo(
    () => buildBootLines(extensionInstalled),
    [extensionInstalled],
  );
  const [visibleCount, setVisibleCount] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    for (let i = 0; i < bootLines.length; i++) {
      const line = bootLines[i];
      timers.push(
        setTimeout(() => {
          setVisibleCount(i + 1);
          if (i === bootLines.length - 1) setReady(true);
        }, line.delay),
      );
    }

    // Auto-navigate after 3.2 seconds
    const autoNav = setTimeout(() => {
      onProceed();
    }, 3200);
    timers.push(autoNav);

    return () => {
      for (const t of timers) clearTimeout(t);
    };
  }, [bootLines, onProceed]);

  return (
    <div
      className="min-h-screen bg-background flex flex-col items-center justify-center overflow-hidden"
      data-ocid="initialization.page"
    >
      {/* Ambient effects */}
      <div className="fixed inset-0 retro-grid opacity-25 pointer-events-none" />
      <div className="fixed inset-0 scanlines opacity-25 pointer-events-none" />
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-primary/4 blur-[160px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-accent/3 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-2xl px-6">
        {/* Title bar */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-destructive/80" />
            <span className="w-3 h-3 rounded-full bg-accent/80" />
            <span className="w-3 h-3 rounded-full bg-green-400/80" />
          </div>
          <div className="flex-1 h-px bg-primary/20" />
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <span className="font-display text-sm text-primary tracking-widest">
              {"COPIE PAST-E // SYSTEM BOOT"}
            </span>
          </div>
          <div className="flex-1 h-px bg-primary/20" />
        </div>

        {/* Terminal window */}
        <div
          className="bg-card/90 backdrop-blur-sm neon-border-blue rounded-lg overflow-hidden glow-blue-sm"
          data-ocid="initialization.terminal"
        >
          {/* Terminal header */}
          <div className="bg-primary/10 border-b border-primary/20 px-4 py-2.5 flex items-center gap-2">
            <span className="font-mono text-xs text-primary tracking-widest uppercase">
              SYSTEM INITIALIZATION SEQUENCE
            </span>
            {ready && (
              <span className="ml-auto flex items-center gap-1 text-green-400 font-mono text-xs">
                <CheckCircle2 className="w-3 h-3" />
                READY
              </span>
            )}
          </div>

          {/* Terminal body */}
          <div className="p-6 min-h-[280px] font-mono text-sm leading-7 space-y-0.5">
            {bootLines.slice(0, visibleCount).map((line) => (
              <div
                key={line.text}
                className={`${LINE_COLORS[line.type]} flex items-start gap-2 animate-in fade-in duration-200`}
              >
                {line.type === "warning" && (
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-accent" />
                )}
                {line.type === "system" && line.text.includes("READY") && (
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-green-400" />
                )}
                <span className="break-words">{line.text}</span>
              </div>
            ))}

            {/* Blinking cursor */}
            {!ready && (
              <span
                className="inline-block w-2 h-4 bg-primary/80 animate-pulse ml-1"
                aria-hidden="true"
              />
            )}
          </div>

          {/* Extension warning footer (desktop + no extension) */}
          {!extensionInstalled && visibleCount >= bootLines.length && (
            <div
              className="border-t border-accent/30 bg-accent/5 px-4 py-2.5 flex items-center gap-2"
              data-ocid="initialization.extension_warning"
            >
              <AlertTriangle className="w-4 h-4 text-accent shrink-0" />
              <span className="font-mono text-xs text-accent">
                AUTOFILL EXTENSION NOT DETECTED — Visit{" "}
                <a
                  href="/extension-setup"
                  className="underline hover:text-accent/80 transition-colors"
                  data-ocid="initialization.setup_link"
                >
                  /extension-setup
                </a>{" "}
                to install it
              </span>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
          {/* Primary: always enabled proceed */}
          <button
            type="button"
            onClick={onProceed}
            className="group w-full sm:flex-1 flex items-center justify-center gap-3 bg-primary/10 hover:bg-primary/20 border border-primary/40 hover:border-primary/70 text-primary rounded-lg px-8 py-4 font-display text-sm tracking-widest uppercase transition-smooth hover:glow-blue-sm"
            data-ocid="initialization.proceed_button"
          >
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            PROCEED TO TERMINAL
          </button>

          {/* Secondary: download .zip */}
          <button
            type="button"
            onClick={onDownload}
            className="group w-full sm:w-auto flex items-center justify-center gap-2 bg-accent/10 hover:bg-accent/20 border border-accent/40 hover:border-accent/70 text-accent rounded-lg px-6 py-4 font-display text-xs tracking-widest uppercase transition-smooth hover:glow-yellow-sm"
            data-ocid="initialization.download_button"
          >
            <Download className="w-4 h-4" />
            DOWNLOAD EXPANSION (.ZIP)
          </button>
        </div>

        <p className="font-mono text-xs text-muted-foreground text-center mt-3">
          Auto-redirect in 3 seconds — or click above to enter now
        </p>
      </div>
    </div>
  );
}
