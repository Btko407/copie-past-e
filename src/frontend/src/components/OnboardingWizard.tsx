import { useGetUserMasterListings } from "@/hooks/useGetUserMasterListings";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle2, ExternalLink, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────────

type StepKey = 1 | 2 | 3;
type StepStatus = "locked" | "active" | "completed";

// ─── ASCII Progress Bar ────────────────────────────────────────────────────────

function AsciiProgressBar({ percent }: { percent: number }) {
  const total = 20;
  const filled = Math.round((percent / 100) * total);
  const empty = total - filled;
  const bar = "█".repeat(filled) + "░".repeat(empty);
  return (
    <div
      className="font-mono text-xs text-[oklch(0.75_0.18_140)] tracking-wider"
      aria-label={`${percent}% complete`}
    >
      [{bar}] {percent}%
    </div>
  );
}

// ─── Step Indicator Dots ───────────────────────────────────────────────────────

function StepDot({ step, status }: { step: number; status: StepStatus }) {
  const base =
    "w-8 h-8 rounded-full border-2 flex items-center justify-center font-mono text-xs font-bold transition-all duration-500";
  const styles: Record<StepStatus, string> = {
    locked: "border-[oklch(0.4_0_0)] text-[oklch(0.4_0_0)]",
    active: "border-[oklch(0.88_0.19_84)] text-[oklch(0.88_0.19_84)]",
    completed:
      "border-[oklch(0.75_0.18_140)] bg-[oklch(0.75_0.18_140/0.15)] text-[oklch(0.75_0.18_140)]",
  };
  const glowStyles: Record<StepStatus, string> = {
    locked: "",
    active:
      "shadow-[0_0_8px_oklch(0.88_0.19_84/0.8),0_0_20px_oklch(0.88_0.19_84/0.4)]",
    completed:
      "shadow-[0_0_6px_oklch(0.75_0.18_140/0.6),0_0_16px_oklch(0.75_0.18_140/0.3)]",
  };
  return (
    <div className={`${base} ${styles[status]} ${glowStyles[status]}`}>
      {status === "completed" ? "✓" : step}
    </div>
  );
}

// ─── Blinking Cursor ───────────────────────────────────────────────────────────

function Cursor() {
  return (
    <span
      className="inline-block w-2 h-4 bg-[oklch(0.75_0.18_140)] ml-0.5 align-middle animate-pulse"
      aria-hidden="true"
    />
  );
}

// ─── Tier Card ─────────────────────────────────────────────────────────────────

interface TierInfo {
  name: string;
  price: string;
  color: string;
  features: string[];
}

const TIERS: TierInfo[] = [
  {
    name: "TIME WALKER",
    price: "$6.99/mo",
    color: "oklch(0.65 0.22 262)",
    features: ["25 active listings", "3 platform drafts", "Basic analytics"],
  },
  {
    name: "TIME TRAVELER",
    price: "$9.99/mo",
    color: "oklch(0.88 0.19 84)",
    features: ["100 active listings", "All 6 platforms", "Smart OCR"],
  },
  {
    name: "TIME LORD",
    price: "$19.99/mo",
    color: "oklch(0.75 0.18 140)",
    features: ["Unlimited listings", "Priority support", "Advanced analytics"],
  },
];

// ─── Step 1: Install Extension ─────────────────────────────────────────────────

interface Step1Props {
  onComplete: () => void;
  extInstalled: boolean;
}

function Step1({ onComplete, extInstalled }: Step1Props) {
  useEffect(() => {
    if (extInstalled) onComplete();
  }, [extInstalled, onComplete]);

  return (
    <div className="space-y-6" data-ocid="onboarding.step1.panel">
      <div className="font-mono text-xs text-[oklch(0.75_0.18_140/0.7)] uppercase tracking-widest">
        &gt; STATUS: AWAITING EXTENSION INSTALL...
        <Cursor />
      </div>

      <div className="border border-[oklch(0.65_0.22_262/0.3)] bg-[oklch(0.65_0.22_262/0.05)] rounded p-4 font-mono text-xs space-y-1.5">
        <p className="text-[oklch(0.65_0.22_262)] font-bold">
          &gt; REQUIRED MODULE: Chrome Extension v1.3.0
        </p>
        <p className="text-[oklch(0.7_0_0)]">
          &gt; The Copie Past-e extension enables autofill
        </p>
        <p className="text-[oklch(0.7_0_0)]">
          &gt; injection into marketplace listing forms.
        </p>
        <p className="text-[oklch(0.7_0_0)]">
          &gt; Manual posting. No auto-submit. You control it.
        </p>
      </div>

      <div className="space-y-3">
        <div
          className={`flex items-center gap-3 p-3 rounded border font-mono text-xs ${extInstalled ? "border-[oklch(0.75_0.18_140/0.6)] bg-[oklch(0.75_0.18_140/0.08)]" : "border-[oklch(0.4_0_0)] bg-transparent"}`}
        >
          <div
            className={`w-3 h-3 rounded-full border flex-shrink-0 ${extInstalled ? "bg-[oklch(0.75_0.18_140)] border-[oklch(0.75_0.18_140)] shadow-[0_0_6px_oklch(0.75_0.18_140/0.8)]" : "border-[oklch(0.4_0_0)]"}`}
          />
          <span
            className={
              extInstalled
                ? "text-[oklch(0.75_0.18_140)]"
                : "text-[oklch(0.5_0_0)]"
            }
          >
            {extInstalled
              ? "[ EXTENSION DETECTED — MODULE ONLINE ]"
              : "[ EXTENSION NOT DETECTED — INSTALL REQUIRED ]"}
          </span>
        </div>

        <a
          href="https://chrome.google.com/webstore"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 bg-[oklch(0.65_0.22_262/0.15)] border border-[oklch(0.65_0.22_262/0.6)] hover:bg-[oklch(0.65_0.22_262/0.25)] hover:border-[oklch(0.65_0.22_262)] text-[oklch(0.65_0.22_262)] font-mono text-xs font-bold uppercase tracking-widest transition-all duration-200 rounded shadow-[0_0_8px_oklch(0.65_0.22_262/0.2)] hover:shadow-[0_0_16px_oklch(0.65_0.22_262/0.4)]"
          data-ocid="onboarding.install-extension.button"
        >
          <ExternalLink className="w-3 h-3" />
          OPEN CHROME WEB STORE
        </a>
      </div>

      <p className="font-mono text-[10px] text-[oklch(0.45_0_0)] text-center">
        &gt; After install, this step auto-completes. Refresh if needed.
      </p>
    </div>
  );
}

// ─── Step 2: Create Listing ────────────────────────────────────────────────────

interface Step2Props {
  onComplete: () => void;
  onOpenNewListing: () => void;
  hasListing: boolean;
}

function Step2({ onComplete, onOpenNewListing, hasListing }: Step2Props) {
  useEffect(() => {
    if (hasListing) onComplete();
  }, [hasListing, onComplete]);

  return (
    <div className="space-y-6" data-ocid="onboarding.step2.panel">
      <div className="font-mono text-xs text-[oklch(0.75_0.18_140/0.7)] uppercase tracking-widest">
        &gt; OBJECTIVE: CREATE MASTER LISTING RECORD
        <Cursor />
      </div>

      <div className="border border-[oklch(0.88_0.19_84/0.3)] bg-[oklch(0.88_0.19_84/0.05)] rounded p-4 font-mono text-xs space-y-1.5">
        <p className="text-[oklch(0.88_0.19_84)] font-bold">
          &gt; SYSTEM: MASTER LISTING ARCHITECTURE
        </p>
        <p className="text-[oklch(0.7_0_0)]">
          &gt; One master record → 6 platform drafts
        </p>
        <p className="text-[oklch(0.7_0_0)]">
          &gt; Facebook • Mercari • eBay • Poshmark • Depop • Etsy
        </p>
        <p className="text-[oklch(0.7_0_0)]">
          &gt; Extension autofills forms. You submit manually.
        </p>
      </div>

      <div
        className={`flex items-center gap-3 p-3 rounded border font-mono text-xs ${hasListing ? "border-[oklch(0.75_0.18_140/0.6)] bg-[oklch(0.75_0.18_140/0.08)]" : "border-[oklch(0.4_0_0)] bg-transparent"}`}
      >
        <div
          className={`w-3 h-3 rounded-full border flex-shrink-0 ${hasListing ? "bg-[oklch(0.75_0.18_140)] border-[oklch(0.75_0.18_140)] shadow-[0_0_6px_oklch(0.75_0.18_140/0.8)]" : "border-[oklch(0.4_0_0)]"}`}
        />
        <span
          className={
            hasListing ? "text-[oklch(0.75_0.18_140)]" : "text-[oklch(0.5_0_0)]"
          }
        >
          {hasListing
            ? "[ LISTING CREATED — RECORD CONFIRMED ]"
            : "[ NO LISTINGS FOUND — CREATE ONE NOW ]"}
        </span>
      </div>

      {!hasListing && (
        <button
          type="button"
          onClick={onOpenNewListing}
          className="flex items-center justify-center gap-2 w-full py-3 bg-[oklch(0.88_0.19_84/0.15)] border border-[oklch(0.88_0.19_84/0.6)] hover:bg-[oklch(0.88_0.19_84/0.25)] hover:border-[oklch(0.88_0.19_84)] text-[oklch(0.88_0.19_84)] font-mono text-xs font-bold uppercase tracking-widest transition-all duration-200 rounded shadow-[0_0_8px_oklch(0.88_0.19_84/0.2)] hover:shadow-[0_0_16px_oklch(0.88_0.19_84/0.4)]"
          data-ocid="onboarding.create-listing.button"
        >
          <Zap className="w-3 h-3" />
          CREATE LISTING
        </button>
      )}
    </div>
  );
}

// ─── Step 3: Tier Awareness ────────────────────────────────────────────────────

interface Step3Props {
  onComplete: () => void;
  onNavigateUpgrade: () => void;
}

function Step3({ onComplete, onNavigateUpgrade }: Step3Props) {
  const [acknowledged, setAcknowledged] = useState(false);

  return (
    <div className="space-y-5" data-ocid="onboarding.step3.panel">
      <div className="font-mono text-xs text-[oklch(0.75_0.18_140/0.7)] uppercase tracking-widest">
        &gt; INITIALIZING TIER MATRIX...
        <Cursor />
      </div>

      <div className="grid gap-3">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className="border rounded p-3 space-y-1.5"
            style={{
              borderColor: `${tier.color}40`,
              background: `${tier.color}08`,
            }}
          >
            <div className="flex items-center justify-between">
              <span
                className="font-mono text-xs font-bold"
                style={{ color: tier.color }}
              >
                {tier.name}
              </span>
              <span className="font-mono text-xs font-bold text-foreground">
                {tier.price}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {tier.features.map((f) => (
                <span
                  key={f}
                  className="font-mono text-[10px] px-1.5 py-0.5 rounded"
                  style={{ color: tier.color, background: `${tier.color}15` }}
                >
                  ▸ {f}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onNavigateUpgrade}
          className="flex-1 py-2.5 bg-transparent border border-[oklch(0.65_0.22_262/0.5)] hover:border-[oklch(0.65_0.22_262)] text-[oklch(0.65_0.22_262)] font-mono text-xs uppercase tracking-widest transition-all duration-200 rounded hover:bg-[oklch(0.65_0.22_262/0.1)]"
          data-ocid="onboarding.view-plans.button"
        >
          VIEW PLANS
        </button>
        <button
          type="button"
          onClick={() => {
            setAcknowledged(true);
            onComplete();
          }}
          className={`flex-1 py-2.5 font-mono text-xs font-bold uppercase tracking-widest transition-all duration-200 rounded ${acknowledged ? "bg-[oklch(0.75_0.18_140/0.2)] border border-[oklch(0.75_0.18_140/0.6)] text-[oklch(0.75_0.18_140)]" : "bg-[oklch(0.75_0.18_140/0.15)] border border-[oklch(0.75_0.18_140/0.5)] hover:bg-[oklch(0.75_0.18_140/0.25)] hover:border-[oklch(0.75_0.18_140)] text-[oklch(0.75_0.18_140)] shadow-[0_0_8px_oklch(0.75_0.18_140/0.2)] hover:shadow-[0_0_16px_oklch(0.75_0.18_140/0.4)]"}`}
          data-ocid="onboarding.acknowledge.button"
        >
          {acknowledged ? "✓ ACKNOWLEDGED" : "I UNDERSTAND MY TIER"}
        </button>
      </div>
    </div>
  );
}

// ─── Main OnboardingWizard ─────────────────────────────────────────────────────

interface OnboardingWizardProps {
  onComplete: () => void;
  onOpenNewListing?: () => void;
}

export function OnboardingWizard({
  onComplete,
  onOpenNewListing,
}: OnboardingWizardProps) {
  const navigate = useNavigate();
  const { data: masterListings } = useGetUserMasterListings();
  const [currentStep, setCurrentStep] = useState<StepKey>(1);
  const [completedSteps, setCompletedSteps] = useState<Set<StepKey>>(new Set());
  const [extInstalled, setExtInstalled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect extension
  useEffect(() => {
    const stored = localStorage.getItem("ext_installed");
    if (stored === "true") setExtInstalled(true);
    const handler = (e: StorageEvent) => {
      if (e.key === "ext_installed" && e.newValue === "true")
        setExtInstalled(true);
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const hasListing = (masterListings?.length ?? 0) > 0;

  const totalSteps = 3;
  const completedCount = completedSteps.size;
  const progressPercent = Math.round((completedCount / totalSteps) * 100);

  function markComplete(step: StepKey) {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      next.add(step);
      return next;
    });
    const nextStep = (step + 1) as StepKey;
    if (nextStep <= 3) setCurrentStep(nextStep);
  }

  function getStatus(step: StepKey): StepStatus {
    if (completedSteps.has(step)) return "completed";
    if (step === currentStep) return "active";
    return "locked";
  }

  function handleFinish() {
    if (completedSteps.size === 3) {
      onComplete();
    }
  }

  const allComplete = completedSteps.size === 3;

  return (
    <dialog
      open
      className="terminal-overlay"
      style={{
        zIndex: 9999,
        background: "oklch(0.04 0 0)",
        maxWidth: "none",
        maxHeight: "none",
        width: "100%",
        height: "100%",
        padding: 0,
        margin: 0,
        border: "none",
      }}
      aria-label="System Initialization — Onboarding"
      data-ocid="onboarding.overlay"
    >
      {/* Scanlines */}
      <div className="scanlines" aria-hidden="true" />

      <div
        ref={containerRef}
        className="relative w-full max-w-xl mx-4 terminal-window rounded overflow-hidden flex flex-col"
        style={{ maxHeight: "90dvh" }}
        data-ocid="onboarding.terminal-window"
      >
        {/* Terminal header */}
        <div className="terminal-header flex-shrink-0">
          <div className="flex items-center justify-between">
            <span>[COPIE PAST-E SYSTEM INITIALIZATION v1.3.0]</span>
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[oklch(0.65_0.25_16/0.7)]" />
              <span className="w-3 h-3 rounded-full bg-[oklch(0.88_0.19_84/0.7)]" />
              <span className="w-3 h-3 rounded-full bg-[oklch(0.75_0.18_140/0.7)]" />
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 p-5 space-y-6 terminal-boot">
          {/* Boot text */}
          <div className="font-mono text-[10px] text-[oklch(0.4_0_0)] space-y-0.5 leading-relaxed">
            <p>BIOS v4.0.1 Copyright (C) Copie Past-e Systems Inc.</p>
            <p>Checking RAM..... OK</p>
            <p>
              Loading modules...{" "}
              <span className="text-[oklch(0.75_0.18_140)]">SYSTEM ONLINE</span>
            </p>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-[oklch(0.45_0_0)] uppercase tracking-widest">
                INITIALIZATION PROGRESS
              </span>
              <span className="font-mono text-[10px] text-[oklch(0.75_0.18_140)]">
                {completedCount}/{totalSteps} STEPS
              </span>
            </div>
            <AsciiProgressBar percent={progressPercent} />
          </div>

          {/* Step indicators */}
          <div
            className="flex items-center gap-3"
            data-ocid="onboarding.step-indicators"
          >
            {([1, 2, 3] as StepKey[]).map((s, i) => (
              <div key={s} className="flex items-center gap-3 flex-1">
                <StepDot step={s} status={getStatus(s)} />
                {i < 2 && (
                  <div
                    className={`flex-1 h-px transition-all duration-500 ${completedSteps.has(s) ? "bg-[oklch(0.75_0.18_140/0.6)]" : "bg-[oklch(0.25_0_0)]"}`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step labels */}
          <div className="grid grid-cols-3 gap-1">
            {[
              { label: "EXTENSION", step: 1 as StepKey },
              { label: "LISTING", step: 2 as StepKey },
              { label: "TIER", step: 3 as StepKey },
            ].map(({ label, step }) => (
              <div key={step} className="text-center">
                <span
                  className={`font-mono text-[9px] uppercase tracking-widest ${step === currentStep ? "text-[oklch(0.88_0.19_84)]" : completedSteps.has(step) ? "text-[oklch(0.75_0.18_140)]" : "text-[oklch(0.35_0_0)]"}`}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px bg-[oklch(0.65_0.22_262/0.25)]" />

          {/* Active step title */}
          <div>
            <h2 className="font-mono text-sm font-bold text-[oklch(0.75_0.18_140)] text-glow-green uppercase tracking-wider">
              {currentStep === 1 && "STEP 1: INSTALL CHROME EXTENSION"}
              {currentStep === 2 && "STEP 2: CREATE YOUR FIRST LISTING"}
              {currentStep === 3 && "STEP 3: CHOOSE YOUR TIER"}
            </h2>
          </div>

          {/* Step content */}
          {currentStep === 1 && (
            <Step1
              extInstalled={extInstalled}
              onComplete={() => markComplete(1)}
            />
          )}
          {currentStep === 2 && (
            <Step2
              hasListing={hasListing}
              onComplete={() => markComplete(2)}
              onOpenNewListing={onOpenNewListing ?? (() => {})}
            />
          )}
          {currentStep === 3 && (
            <Step3
              onComplete={() => markComplete(3)}
              onNavigateUpgrade={() => {
                onComplete();
                navigate({ to: "/upgrade" });
              }}
            />
          )}

          {/* Finish button — only visible when all steps complete */}
          {allComplete && (
            <div className="pt-2 border-t border-[oklch(0.75_0.18_140/0.3)]">
              <div className="font-mono text-xs text-[oklch(0.75_0.18_140)] mb-3 space-y-0.5">
                <p>&gt; ALL MODULES INITIALIZED</p>
                <p>&gt; SYSTEM READY — LAUNCHING DASHBOARD...</p>
              </div>
              <button
                type="button"
                onClick={handleFinish}
                className="w-full py-3 bg-[oklch(0.75_0.18_140/0.2)] border-2 border-[oklch(0.75_0.18_140)] text-[oklch(0.75_0.18_140)] font-mono text-sm font-bold uppercase tracking-widest rounded transition-all duration-200 hover:bg-[oklch(0.75_0.18_140/0.3)] shadow-[0_0_12px_oklch(0.75_0.18_140/0.4)] hover:shadow-[0_0_24px_oklch(0.75_0.18_140/0.6)]"
                data-ocid="onboarding.launch.button"
              >
                <CheckCircle2 className="w-4 h-4 inline mr-2" />
                LAUNCH COPIE PAST-E
              </button>
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
}
