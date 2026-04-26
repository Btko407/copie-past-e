/**
 * InitializationPage — Retro-Cyberpunk System Boot screen.
 *
 * Shows after login before the main dashboard. Displays animated terminal
 * boot lines one-by-one. After 3 seconds OR user clicks "PROCEED TO MAIN
 * DASHBOARD", redirects to /dashboard.
 *
 * On desktop: checks window.__COPIE_PASTE_INSTALLED__ — shows warning if absent.
 * On mobile (isMobile()): skips extension check entirely.
 * The bypass button is ALWAYS enabled — never blocked.
 */

import { isMobile } from "@/hooks/useExtension";
import { useNavigate } from "@tanstack/react-router";
import { AlertTriangle, ArrowRight, CheckCircle2, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// ── Boot sequence lines ───────────────────────────────────────────────────────

interface BootLine {
  text: string;
  type: "info" | "success" | "warning" | "system";
  delay: number;
}

function buildBootLines(
  extensionInstalled: boolean,
  mobile: boolean,
): BootLine[] {
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

  if (mobile) {
    lines.push(
      {
        text: "> MOBILE DEVICE DETECTED — EXTENSION CHECK BYPASSED",
        type: "warning",
        delay: 1900,
      },
      { text: "> ALL CORE MODULES READY.", type: "success", delay: 2200 },
      { text: "> SYSTEM READY.", type: "system", delay: 2500 },
    );
  } else if (extensionInstalled) {
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

// ── Color map ─────────────────────────────────────────────────────────────────

const LINE_COLORS: Record<BootLine["type"], string> = {
  system: "text-primary",
  info: "text-foreground/80",
  success: "text-green-400",
  warning: "text-accent",
};

// ── Component ─────────────────────────────────────────────────────────────────

export function InitializationPage() {
  const navigate = useNavigate();
  const mobile = isMobile();

  // Check extension flag immediately (no debounce needed here — this renders post-login)
  const [extensionInstalled, setExtensionInstalled] = useState(false);
  const checkedRef = useRef(false);

  useEffect(() => {
    if (checkedRef.current) return;
    checkedRef.current = true;

    // Immediate check
    if (
      (window as unknown as Record<string, unknown>)
        .__COPIE_PASTE_INSTALLED__ === true
    ) {
      setExtensionInstalled(true);
      return;
    }
    // Give extension 600ms to inject the flag
    const t = setTimeout(() => {
      if (
        (window as unknown as Record<string, unknown>)
          .__COPIE_PASTE_INSTALLED__ === true
      ) {
        setExtensionInstalled(true);
      }
    }, 600);
    return () => clearTimeout(t);
  }, []);

  const bootLines = buildBootLines(extensionInstalled, mobile);

  // Visible lines state — append one per delay
  const [visibleCount, setVisibleCount] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    for (let i = 0; i < bootLines.length; i++) {
      const line = bootLines[i];
      timers.push(
        setTimeout(() => {
          setVisibleCount(i + 1);
          if (i === bootLines.length - 1) {
            setReady(true);
          }
        }, line.delay),
      );
    }

    // Auto-navigate after 3 seconds
    const autoNav = setTimeout(() => {
      navigate({ to: "/dashboard" });
    }, 3200);
    timers.push(autoNav);

    return () => {
      for (const t of timers) clearTimeout(t);
    };
  }, [bootLines, navigate]);

  const handleProceed = () => {
    navigate({ to: "/dashboard" });
  };

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

          {/* Status bar */}
          {!mobile &&
            !extensionInstalled &&
            visibleCount >= bootLines.length && (
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

        {/* Bypass button — always enabled */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={handleProceed}
            className="group flex items-center gap-3 bg-primary/10 hover:bg-primary/20 border border-primary/40 hover:border-primary/70 text-primary rounded-lg px-8 py-4 font-display text-sm tracking-widest uppercase transition-smooth hover:glow-blue-sm"
            data-ocid="initialization.proceed_button"
          >
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            PROCEED TO MAIN DASHBOARD
          </button>
          <p className="font-mono text-xs text-muted-foreground text-center">
            Auto-redirect in 3 seconds — or click above to enter now
          </p>
        </div>
      </div>
    </div>
  );
}
