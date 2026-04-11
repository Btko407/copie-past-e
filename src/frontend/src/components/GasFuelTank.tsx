import { motion, useSpring, useTransform } from "motion/react";
import { useEffect, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface GasFuelTankProps {
  /**
   * When provided, the component self-computes fill % from expiry + tier.
   * expirationDate is in MILLISECONDS (already converted from ns).
   * tier: 1 = Time Walker (30d / 30%), 2 = Time Traveler (90d / 60%), 3 = Time Lord (180d / 90%)
   */
  expirationDate?: number;
  tier?: 1 | 2 | 3;

  /**
   * Fallback static fill level (0–100).
   * Used only when expirationDate/tier are not supplied.
   */
  fillPercent?: number;

  /** Short label shown in the tank (e.g. "Time Traveler") */
  tierLabel?: string;
  size?: "sm" | "md" | "lg";
  /** Days remaining — shown numerically below the percentage.
   *  Auto-derived when expirationDate is provided. */
  daysRemaining?: number;
}

// ─── Tier config ──────────────────────────────────────────────────────────────

const TIER_CONFIG: Record<number, { baseline: number; days: number }> = {
  1: { baseline: 30, days: 30 },
  2: { baseline: 60, days: 90 },
  3: { baseline: 90, days: 180 },
};

export const TIER_NAMES: Record<number, string> = {
  1: "Time Walker",
  2: "Time Traveler",
  3: "Time Lord",
};

/** Compute live fuel % from expiry timestamp (ms) + tier number */
export function computeFuelFromExpiry(
  expirationDateMs: number,
  tier: 1 | 2 | 3,
): { fuelPercent: number; daysRemaining: number } {
  const cfg = TIER_CONFIG[tier] ?? TIER_CONFIG[1];
  const msLeft = expirationDateMs - Date.now();
  const daysRemaining = Math.max(0, msLeft / (1000 * 60 * 60 * 24));
  const fuelPercent = Math.max(
    0,
    Math.min(cfg.baseline, (daysRemaining / cfg.days) * cfg.baseline),
  );
  return {
    fuelPercent: Math.round(fuelPercent * 10) / 10,
    daysRemaining: Math.max(0, Math.floor(daysRemaining)),
  };
}

/** Legacy helper — compute fill % from tier name string + days remaining number */
export function computeFuelPercent(
  tierName: string,
  daysRemaining: number,
): number {
  const name = tierName.toLowerCase();
  if (name.includes("lord")) {
    return Math.round((daysRemaining / 180) * 90);
  }
  if (name.includes("traveler") || name.includes("traveller")) {
    return Math.round((daysRemaining / 90) * 60);
  }
  return Math.round((daysRemaining / 30) * 30);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getBatteryState(pct: number): "low" | "mid" | "high" {
  if (pct <= 35) return "low";
  if (pct <= 65) return "mid";
  return "high";
}

function getFillColor(pct: number): string {
  const state = getBatteryState(pct);
  if (pct <= 0) return "oklch(0.35 0.01 262)";
  if (state === "low") return "oklch(0.65 0.22 16)"; // RED
  if (state === "mid") return "oklch(0.88 0.19 84)"; // YELLOW
  return "oklch(0.65 0.22 150)"; // GREEN
}

function getFillGlowClass(pct: number): string {
  const state = getBatteryState(pct);
  if (pct <= 0) return "";
  if (state === "low") return "shadow-[0_0_18px_oklch(0.65_0.22_16/0.8)]";
  if (state === "mid") return "shadow-[0_0_18px_oklch(0.88_0.19_84/0.8)]";
  return "shadow-[0_0_18px_oklch(0.65_0.22_150/0.8)]";
}

function getBatteryMessage(pct: number): string {
  const state = getBatteryState(pct);
  if (pct <= 0) return "No Fuel — Refuel Now";
  if (state === "low") return "Low Fuel — Refuel Now";
  if (state === "mid") return "Cruising — Top Off Anytime";
  return "Full Tank — You Are Good";
}

function getBatteryTextColor(pct: number): string {
  const state = getBatteryState(pct);
  if (pct <= 0) return "text-muted-foreground";
  if (state === "low") return "text-destructive";
  if (state === "mid") return "text-accent";
  return "text-green-400";
}

const SIZE_MAP = {
  sm: {
    width: 60,
    height: 120,
    labelSize: "text-[10px]",
    balanceSize: "text-xs",
  },
  md: { width: 80, height: 160, labelSize: "text-xs", balanceSize: "text-sm" },
  lg: { width: 110, height: 220, labelSize: "text-xs", balanceSize: "text-lg" },
};

// ─── Component ────────────────────────────────────────────────────────────────

export function GasFuelTank({
  expirationDate,
  tier,
  fillPercent: staticFillPercent,
  tierLabel = "GAS",
  size = "lg",
  daysRemaining: staticDaysRemaining,
}: GasFuelTankProps) {
  // Live-computed state when expirationDate + tier are provided
  const [liveData, setLiveData] = useState<{
    fuelPercent: number;
    daysRemaining: number;
  } | null>(null);

  useEffect(() => {
    if (!expirationDate || !tier) {
      setLiveData(null);
      return;
    }

    // Compute immediately
    setLiveData(computeFuelFromExpiry(expirationDate, tier));

    // Re-compute every 60 seconds for real-time drain
    const interval = setInterval(() => {
      setLiveData(computeFuelFromExpiry(expirationDate, tier));
    }, 60_000);

    return () => clearInterval(interval);
  }, [expirationDate, tier]);

  // Resolve which values to render
  const resolvedFillPercent =
    liveData != null ? liveData.fuelPercent : (staticFillPercent ?? 0);

  const resolvedDaysRemaining =
    liveData != null ? liveData.daysRemaining : staticDaysRemaining;

  // Determine tier label — show real tier name when using live data
  const resolvedTierLabel =
    liveData != null && tier
      ? resolvedDaysRemaining === 0
        ? "Expired — Refuel Now"
        : (TIER_NAMES[tier] ?? tierLabel)
      : tierLabel;

  const clamped = Math.max(0, Math.min(resolvedFillPercent, 100));
  const pct = clamped / 100;
  const fillColor = getFillColor(clamped);
  const glowClass = getFillGlowClass(clamped);
  const batteryMsg = getBatteryMessage(clamped);
  const textColorClass = getBatteryTextColor(clamped);
  const dims = SIZE_MAP[size];

  // Animated fill level
  const springPct = useSpring(pct, { stiffness: 60, damping: 18 });
  useEffect(() => {
    springPct.set(pct);
  }, [pct, springPct]);

  const fillHeight = useTransform(springPct, [0, 1], [0, dims.height - 32]);
  const fillY = useTransform(springPct, [0, 1], [dims.height - 16, 16]);

  const innerW = dims.width - 16;

  // Display label below the big % number
  const displayLabel =
    resolvedDaysRemaining !== undefined
      ? `${clamped.toFixed(1)}% · ${resolvedDaysRemaining}d`
      : resolvedTierLabel;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Tank SVG */}
      <div className="relative" style={{ width: dims.width }}>
        <svg
          width={dims.width}
          height={dims.height}
          viewBox={`0 0 ${dims.width} ${dims.height}`}
          className="drop-shadow-lg"
          role="img"
          aria-label={`Gas tank: ${clamped}% full — ${batteryMsg}`}
        >
          {/* Scanline texture */}
          <defs>
            <pattern
              id="scanlines-tank"
              x="0"
              y="0"
              width="1"
              height="4"
              patternUnits="userSpaceOnUse"
            >
              <rect width="1" height="1" fill="rgba(0,0,0,0.25)" />
              <rect y="1" width="1" height="3" fill="transparent" />
            </pattern>
            <clipPath id="tank-clip-v2">
              <rect
                x="8"
                y="12"
                width={innerW}
                height={dims.height - 24}
                rx="6"
              />
            </clipPath>
            <filter id="glow-filter-tank">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Tank outer body */}
          <rect
            x="4"
            y="8"
            width={dims.width - 8}
            height={dims.height - 16}
            rx="10"
            fill="oklch(0.14 0.02 262)"
            stroke="oklch(0.65 0.22 262)"
            strokeWidth="1.5"
            filter="url(#glow-filter-tank)"
          />

          {/* Tank nozzle top */}
          <rect
            x={dims.width / 2 - 8}
            y="2"
            width="16"
            height="10"
            rx="3"
            fill="oklch(0.18 0.04 262)"
            stroke="oklch(0.65 0.22 262)"
            strokeWidth="1"
          />

          {/* Animated fill */}
          <motion.rect
            x="8"
            y={fillY}
            width={innerW}
            height={fillHeight}
            rx="5"
            fill={fillColor}
            opacity={clamped > 0 ? 0.92 : 0}
            clipPath="url(#tank-clip-v2)"
          />

          {/* Scanline overlay */}
          <rect
            x="8"
            y="12"
            width={innerW}
            height={dims.height - 24}
            rx="6"
            fill="url(#scanlines-tank)"
            clipPath="url(#tank-clip-v2)"
          />

          {/* Pulsing fill line */}
          {clamped > 0 && (
            <motion.rect
              x="8"
              y={fillY}
              width={innerW}
              height="2"
              fill={fillColor}
              opacity={0.9}
              clipPath="url(#tank-clip-v2)"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{
                duration: 1.8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          )}

          {/* Percentage text in tank */}
          <motion.text
            x={dims.width / 2}
            y={dims.height / 2 + 5}
            textAnchor="middle"
            fill="oklch(0.97 0 0)"
            fontSize={size === "lg" ? 13 : size === "md" ? 10 : 8}
            fontFamily="Space Mono, monospace"
            fontWeight="700"
            filter="url(#glow-filter-tank)"
          >
            {clamped.toFixed(1)}%
          </motion.text>

          {/* Days remaining sub-label */}
          {resolvedDaysRemaining !== undefined && (
            <text
              x={dims.width / 2}
              y={dims.height / 2 + 20}
              textAnchor="middle"
              fill={fillColor}
              fontSize={size === "lg" ? 9 : 7}
              fontFamily="Space Mono, monospace"
              fontWeight="600"
              letterSpacing="1"
            >
              {resolvedDaysRemaining}d
            </text>
          )}

          {/* DeLorean label bottom */}
          <text
            x={dims.width / 2}
            y={dims.height - 20}
            textAnchor="middle"
            fill="oklch(0.55 0.14 262)"
            fontSize={7}
            fontFamily="Space Mono, monospace"
            letterSpacing="1.5"
          >
            DeLorean
          </text>
        </svg>

        {/* Neon glow pulse overlay */}
        {clamped > 0 && (
          <motion.div
            className={`absolute inset-0 rounded-xl pointer-events-none ${glowClass}`}
            animate={{ opacity: [0.4, 0.9, 0.4] }}
            transition={{
              duration: 2.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        )}
      </div>

      {/* Fill label */}
      <div className="text-center">
        <p
          className={`font-display font-black tracking-widest uppercase ${dims.balanceSize} ${textColorClass}`}
          style={{
            textShadow:
              clamped > 65
                ? "0 0 12px oklch(0.65 0.22 150 / 0.9)"
                : clamped > 35
                  ? "0 0 12px oklch(0.88 0.19 84 / 0.9)"
                  : "0 0 12px oklch(0.65 0.22 16 / 0.9)",
          }}
        >
          {displayLabel}
        </p>
        <p
          className={`font-mono ${dims.labelSize} mt-0.5 ${textColorClass} opacity-80`}
        >
          {batteryMsg}
        </p>
        {/* Tier name label when in live mode */}
        {liveData != null && tier && resolvedDaysRemaining !== 0 && (
          <p className="font-mono text-[10px] mt-0.5 text-muted-foreground tracking-widest uppercase">
            {TIER_NAMES[tier]}
          </p>
        )}
      </div>
    </div>
  );
}
