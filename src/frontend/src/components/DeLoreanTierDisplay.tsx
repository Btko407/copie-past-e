import { motion } from "motion/react";
import { GasFuelTank } from "./GasFuelTank";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DeLoreanTierDisplayProps {
  tierName: string;
  subscriptionExpiry: bigint | null;
  /** gasBalance is kept for API compatibility but no longer used for fill level */
  gasBalance?: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getTierConfig(tierName: string) {
  const name = tierName.toUpperCase();
  const isMax =
    name === "MAX" || name.includes("TIME LORD") || name.includes("MAX");
  const isPro =
    name === "PRO" ||
    name.includes("TRAVELER") ||
    name.includes("ADVENTURE") ||
    name.includes("PRO");

  if (isMax) {
    return {
      bodyFill: "oklch(0.22 0.05 84)",
      bodyStroke: "oklch(0.88 0.19 84)",
      glowClass: "glow-yellow",
      textGlowClass: "text-glow-yellow",
      borderClass: "neon-border-yellow",
      textColorClass: "text-accent",
      accentFill: "oklch(0.88 0.19 84)",
      label: "MAX",
      displayLabel: "Time Lord",
      fluxCapacitorColor: "oklch(0.88 0.19 84)",
      tierId: 3 as 1 | 2 | 3,
    };
  }
  if (isPro) {
    return {
      bodyFill: "oklch(0.16 0.05 262)",
      bodyStroke: "oklch(0.65 0.22 262)",
      glowClass: "glow-blue",
      textGlowClass: "text-glow-blue",
      borderClass: "neon-border-blue",
      textColorClass: "text-primary",
      accentFill: "oklch(0.65 0.22 262)",
      label: "PRO",
      displayLabel: "Traveler",
      fluxCapacitorColor: "oklch(0.65 0.22 262)",
      tierId: 2 as 1 | 2 | 3,
    };
  }
  // Time Walker / Free tier — silver/gray
  return {
    bodyFill: "oklch(0.18 0.01 262)",
    bodyStroke: "oklch(0.45 0.02 262)",
    glowClass: "",
    textGlowClass: "",
    borderClass: "border border-border",
    textColorClass: "text-muted-foreground",
    accentFill: "oklch(0.45 0.02 262)",
    label: "FREE",
    displayLabel: "Time Walker",
    fluxCapacitorColor: "oklch(0.45 0.02 262)",
    tierId: 1 as 1 | 2 | 3,
  };
}

function getExpiryMs(expiry: bigint | null): number {
  if (!expiry) return 0;
  // expiry might be in nanoseconds (ICP) or milliseconds
  const val =
    expiry > BigInt(1e15) ? Number(expiry / BigInt(1_000_000)) : Number(expiry);
  return val;
}

function getDaysRemaining(expiry: bigint | null): number | null {
  if (!expiry) return null;
  const expiryMs = getExpiryMs(expiry);
  const msLeft = expiryMs - Date.now();
  return Math.max(0, Math.floor(msLeft / 86_400_000));
}

// ─── DeLorean SVG ─────────────────────────────────────────────────────────────

function DeLoreanSVG({ config }: { config: ReturnType<typeof getTierConfig> }) {
  return (
    <svg
      viewBox="0 0 280 140"
      width="280"
      height="140"
      role="img"
      aria-label="DeLorean time machine"
      className="drop-shadow-lg"
    >
      <defs>
        <filter id="delorean-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="body-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={config.bodyFill} stopOpacity="1" />
          <stop
            offset="100%"
            stopColor="oklch(0.10 0.01 262)"
            stopOpacity="1"
          />
        </linearGradient>
        <linearGradient id="window-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.4 0.1 220)" stopOpacity="0.8" />
          <stop
            offset="100%"
            stopColor="oklch(0.2 0.05 220)"
            stopOpacity="0.9"
          />
        </linearGradient>
      </defs>

      {/* === BODY === */}
      {/* Main car body lower */}
      <rect
        x="20"
        y="78"
        width="240"
        height="38"
        rx="6"
        fill="url(#body-grad)"
        stroke={config.bodyStroke}
        strokeWidth="1.5"
        filter="url(#delorean-glow)"
      />

      {/* Car roof / cabin */}
      <path
        d="M 65 78 L 80 48 L 185 48 L 210 78 Z"
        fill="url(#body-grad)"
        stroke={config.bodyStroke}
        strokeWidth="1.5"
      />

      {/* Windshield */}
      <path
        d="M 80 76 L 92 52 L 172 52 L 185 76 Z"
        fill="url(#window-grad)"
        stroke={config.accentFill}
        strokeWidth="1"
        opacity="0.85"
      />

      {/* Gull-wing door lines */}
      <line
        x1="90"
        y1="78"
        x2="95"
        y2="60"
        stroke={config.bodyStroke}
        strokeWidth="1"
        opacity="0.6"
      />
      <line
        x1="170"
        y1="78"
        x2="165"
        y2="60"
        stroke={config.bodyStroke}
        strokeWidth="1"
        opacity="0.6"
      />

      {/* Door panel center */}
      <rect
        x="100"
        y="80"
        width="80"
        height="30"
        rx="2"
        fill="oklch(0.12 0.02 262)"
        stroke={config.bodyStroke}
        strokeWidth="0.8"
        opacity="0.7"
      />

      {/* Side vents (stainless panels) */}
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={30 + i * 8}
          y={84}
          width="5"
          height="20"
          rx="1"
          fill={config.accentFill}
          opacity="0.35"
        />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={200 + i * 8}
          y={84}
          width="5"
          height="20"
          rx="1"
          fill={config.accentFill}
          opacity="0.35"
        />
      ))}

      {/* === WHEELS === */}
      {/* Front wheel */}
      <circle
        cx="70"
        cy="116"
        r="18"
        fill="oklch(0.10 0 0)"
        stroke={config.bodyStroke}
        strokeWidth="2"
      />
      <circle
        cx="70"
        cy="116"
        r="10"
        fill="oklch(0.18 0.02 262)"
        stroke={config.accentFill}
        strokeWidth="1.5"
      />
      <circle cx="70" cy="116" r="4" fill={config.accentFill} />

      {/* Rear wheel */}
      <circle
        cx="195"
        cy="116"
        r="18"
        fill="oklch(0.10 0 0)"
        stroke={config.bodyStroke}
        strokeWidth="2"
      />
      <circle
        cx="195"
        cy="116"
        r="10"
        fill="oklch(0.18 0.02 262)"
        stroke={config.accentFill}
        strokeWidth="1.5"
      />
      <circle cx="195" cy="116" r="4" fill={config.accentFill} />

      {/* === FLUX CAPACITOR (hood panel Y-shape) === */}
      <g filter="url(#delorean-glow)">
        <line
          x1="140"
          y1="65"
          x2="140"
          y2="55"
          stroke={config.fluxCapacitorColor}
          strokeWidth="2.5"
        />
        <line
          x1="140"
          y1="65"
          x2="132"
          y2="72"
          stroke={config.fluxCapacitorColor}
          strokeWidth="2.5"
        />
        <line
          x1="140"
          y1="65"
          x2="148"
          y2="72"
          stroke={config.fluxCapacitorColor}
          strokeWidth="2.5"
        />
        <circle cx="140" cy="53" r="3" fill={config.fluxCapacitorColor} />
        <circle cx="130" cy="74" r="3" fill={config.fluxCapacitorColor} />
        <circle cx="150" cy="74" r="3" fill={config.fluxCapacitorColor} />
      </g>

      {/* === HEADLIGHTS === */}
      <ellipse
        cx="30"
        cy="88"
        rx="8"
        ry="5"
        fill={config.accentFill}
        opacity="0.7"
        filter="url(#delorean-glow)"
      />
      <ellipse
        cx="250"
        cy="88"
        rx="8"
        ry="5"
        fill={config.accentFill}
        opacity="0.4"
      />

      {/* === TIME CIRCUITS strip === */}
      <rect
        x="95"
        y="95"
        width="70"
        height="8"
        rx="2"
        fill="oklch(0.08 0 0)"
        stroke={config.accentFill}
        strokeWidth="0.8"
        opacity="0.9"
      />
      <text
        x="130"
        y="101.5"
        textAnchor="middle"
        fill={config.accentFill}
        fontSize="5"
        fontFamily="monospace"
        letterSpacing="1"
      >
        TIME CIRCUITS
      </text>
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DeLoreanTierDisplay({
  tierName,
  subscriptionExpiry,
}: DeLoreanTierDisplayProps) {
  const config = getTierConfig(tierName);
  const daysRemaining = getDaysRemaining(subscriptionExpiry);
  const expiryMs = getExpiryMs(subscriptionExpiry);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* DeLorean + fuel tank row */}
      <div className="flex items-end gap-6">
        {/* DeLorean car */}
        <motion.div
          className={`relative rounded-xl p-3 bg-card/60 ${config.borderClass}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <DeLoreanSVG config={config} />

          {/* Tier badge overlay */}
          <div className="absolute top-2 right-2">
            <span
              className={`font-display text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded ${config.borderClass} bg-card/80 ${config.textColorClass} ${config.textGlowClass}`}
            >
              {config.label}
            </span>
          </div>
        </motion.div>

        {/* Fuel tank — fill level based on tier */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <GasFuelTank
            expirationDate={expiryMs > 0 ? expiryMs : undefined}
            tier={expiryMs > 0 ? config.tierId : undefined}
            fillPercent={expiryMs > 0 ? undefined : 0}
            tierLabel={config.displayLabel}
            size="md"
          />
        </motion.div>
      </div>

      {/* Days remaining label */}
      {daysRemaining !== null && (
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span
            className={`font-mono text-xs tracking-widest uppercase px-3 py-1 rounded ${
              daysRemaining === 0
                ? "neon-border-red text-destructive text-glow-red bg-destructive/10"
                : daysRemaining <= 3
                  ? "neon-border-red text-destructive text-glow-red bg-destructive/10"
                  : daysRemaining <= 7
                    ? "neon-border-yellow text-accent text-glow-yellow bg-accent/10"
                    : "neon-border-blue text-primary text-glow-blue bg-primary/10"
            }`}
          >
            {daysRemaining === 0
              ? "⚠ EXPIRED — REFUEL NOW"
              : `⚡ ${daysRemaining} day${daysRemaining !== 1 ? "s" : ""} remaining`}
          </span>
        </motion.div>
      )}
    </div>
  );
}
