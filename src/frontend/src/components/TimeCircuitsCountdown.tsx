import { useEffect, useState } from "react";

interface TimeCircuitsCountdownProps {
  /** Expiration timestamp in nanoseconds (bigint or number) */
  expirationDate: number | bigint;
  label?: string;
  compact?: boolean;
  /** Force red color state regardless of remaining time */
  forceRed?: boolean;
}

interface TimeSegment {
  value: number;
  unit: string;
}

function getSegments(msRemaining: number): TimeSegment[] {
  const totalSecs = Math.max(0, Math.floor(msRemaining / 1000));
  const months = Math.floor(totalSecs / (30 * 24 * 3600));
  const rem1 = totalSecs % (30 * 24 * 3600);
  const weeks = Math.floor(rem1 / (7 * 24 * 3600));
  const rem2 = rem1 % (7 * 24 * 3600);
  const days = Math.floor(rem2 / (24 * 3600));
  const rem3 = rem2 % (24 * 3600);
  const hours = Math.floor(rem3 / 3600);
  const rem4 = rem3 % 3600;
  const mins = Math.floor(rem4 / 60);
  const secs = rem4 % 60;
  return [
    { value: months, unit: "MON" },
    { value: weeks, unit: "WKS" },
    { value: days, unit: "DAYS" },
    { value: hours, unit: "HRS" },
    { value: mins, unit: "MINS" },
    { value: secs, unit: "SECS" },
  ];
}

/** Returns 'green' | 'yellow' | 'red' based on days remaining */
function getColorState(msRemaining: number): "green" | "yellow" | "red" {
  const days = msRemaining / (1000 * 60 * 60 * 24);
  if (days > 30) return "green";
  if (days > 7) return "yellow";
  return "red";
}

const COLOR_CLASSES = {
  green: {
    border: "circuit-glow-green border",
    text: "text-glow-green",
    dot: "bg-green-400",
    textColor: "text-green-400",
    label: "text-green-400/70",
  },
  yellow: {
    border: "circuit-glow-yellow border",
    text: "text-glow-yellow",
    dot: "bg-accent",
    textColor: "text-accent",
    label: "text-accent/70",
  },
  red: {
    border: "circuit-glow-red border",
    text: "text-glow-red",
    dot: "bg-destructive",
    textColor: "text-destructive",
    label: "text-destructive/70",
  },
};

function SegmentDot({ color }: { color: "green" | "yellow" | "red" }) {
  const cls = COLOR_CLASSES[color];
  return (
    <div className="flex flex-col gap-1 items-center justify-center px-0.5">
      <span
        className={`w-1.5 h-1.5 rounded-full ${cls.dot} animate-circuit-pulse`}
      />
      <span
        className={`w-1.5 h-1.5 rounded-full ${cls.dot} animate-circuit-pulse`}
      />
    </div>
  );
}

function CircuitSegment({
  value,
  unit,
  color,
  compact,
}: TimeSegment & { color: "green" | "yellow" | "red"; compact: boolean }) {
  const cls = COLOR_CLASSES[color];
  const padded = String(value).padStart(2, "0");

  if (compact) {
    return (
      <div
        className={`flex flex-col items-center rounded px-1.5 py-1 ${cls.border} bg-card/80 min-w-[36px]`}
        data-ocid={`circuit-segment-${unit.toLowerCase()}`}
      >
        <span
          className={`font-mono text-sm font-bold leading-none ${cls.textColor} ${cls.text}`}
        >
          {padded}
        </span>
        <span
          className={`font-mono text-[9px] tracking-widest uppercase ${cls.label} mt-0.5`}
        >
          {unit}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center rounded-md px-3 py-2 ${cls.border} bg-card/80 min-w-[52px]`}
      data-ocid={`circuit-segment-${unit.toLowerCase()}`}
    >
      <span
        className={`font-mono text-2xl font-bold leading-none tabular-nums ${cls.textColor} ${cls.text}`}
      >
        {padded}
      </span>
      <span
        className={`font-mono text-[10px] tracking-[0.15em] uppercase ${cls.label} mt-1`}
      >
        {unit}
      </span>
    </div>
  );
}

export function TimeCircuitsCountdown({
  expirationDate,
  label,
  compact = false,
  forceRed = false,
}: TimeCircuitsCountdownProps) {
  const expMs =
    typeof expirationDate === "bigint"
      ? Number(expirationDate) / 1_000_000
      : expirationDate > 1e15
        ? expirationDate / 1_000_000
        : expirationDate;

  const [msRemaining, setMsRemaining] = useState(() => expMs - Date.now());

  useEffect(() => {
    const tick = () => setMsRemaining(expMs - Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expMs]);

  const color = forceRed ? "red" : getColorState(msRemaining);
  const segments = getSegments(msRemaining);
  const expired = msRemaining <= 0;
  const cls = COLOR_CLASSES[color];

  if (compact) {
    return (
      <div
        className="flex items-center gap-1"
        data-ocid="time-circuits-compact"
      >
        {expired ? (
          <span
            className={`font-mono text-xs font-bold uppercase tracking-widest ${cls.textColor} ${cls.text}`}
          >
            EXPIRED
          </span>
        ) : (
          <>
            {segments.map((seg, i) => (
              <span key={seg.unit}>
                {i > 0 && (
                  <span className={`font-mono text-xs ${cls.textColor} mx-0.5`}>
                    :
                  </span>
                )}
                <CircuitSegment {...seg} color={color} compact />
              </span>
            ))}
          </>
        )}
      </div>
    );
  }

  return (
    <div
      className="rounded-lg border border-primary/20 bg-card/40 p-4"
      data-ocid="time-circuits-countdown"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span
          className={`font-display text-xs font-bold tracking-[0.2em] uppercase ${cls.textColor} ${cls.text}`}
        >
          {label ?? "TIME CIRCUITS ACTIVATED"}
        </span>
        <span
          className={`font-mono text-[10px] tracking-widest uppercase px-2 py-0.5 rounded border ${cls.border} ${cls.textColor}`}
        >
          {expired
            ? "EXPIRED"
            : color === "green"
              ? "ACTIVE"
              : color === "yellow"
                ? "EXPIRING SOON"
                : "CRITICAL"}
        </span>
      </div>

      {/* Segments */}
      {expired ? (
        <div className="flex items-center justify-center py-4">
          <span
            className={`font-display text-2xl font-bold tracking-widest ${cls.textColor} ${cls.text} animate-circuit-pulse`}
          >
            FLUX CAPACITOR DEPLETED
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-1 flex-wrap">
          {segments.map((seg, i) => (
            <span key={seg.unit} className="flex items-center">
              {i > 0 && <SegmentDot color={color} />}
              <CircuitSegment {...seg} color={color} compact={false} />
            </span>
          ))}
        </div>
      )}

      {/* Footer hint */}
      {!expired && (
        <p className="font-mono text-[10px] text-muted-foreground mt-3 tracking-wide">
          {color === "red"
            ? "⚠ Renew now — listing will be archived soon"
            : color === "yellow"
              ? "↑ Upgrade to extend your timeline"
              : "✓ Listing active — time circuits nominal"}
        </p>
      )}
    </div>
  );
}
