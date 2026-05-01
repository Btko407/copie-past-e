import { r as reactExports, j as jsxRuntimeExports } from "./index-B_oOf7NU.js";
function getSegments(msRemaining) {
  const totalSecs = Math.max(0, Math.floor(msRemaining / 1e3));
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
    { value: secs, unit: "SECS" }
  ];
}
function getColorState(msRemaining) {
  const days = msRemaining / (1e3 * 60 * 60 * 24);
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
    label: "text-green-400/70"
  },
  yellow: {
    border: "circuit-glow-yellow border",
    text: "text-glow-yellow",
    dot: "bg-accent",
    textColor: "text-accent",
    label: "text-accent/70"
  },
  red: {
    border: "circuit-glow-red border",
    text: "text-glow-red",
    dot: "bg-destructive",
    textColor: "text-destructive",
    label: "text-destructive/70"
  }
};
function SegmentDot({ color }) {
  const cls = COLOR_CLASSES[color];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1 items-center justify-center px-0.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: `w-1.5 h-1.5 rounded-full ${cls.dot} animate-circuit-pulse`
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: `w-1.5 h-1.5 rounded-full ${cls.dot} animate-circuit-pulse`
      }
    )
  ] });
}
function CircuitSegment({
  value,
  unit,
  color,
  compact
}) {
  const cls = COLOR_CLASSES[color];
  const padded = String(value).padStart(2, "0");
  if (compact) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `flex flex-col items-center rounded px-1.5 py-1 ${cls.border} bg-card/80 min-w-[36px]`,
        "data-ocid": `circuit-segment-${unit.toLowerCase()}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `font-mono text-sm font-bold leading-none ${cls.textColor} ${cls.text}`,
              children: padded
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `font-mono text-[9px] tracking-widest uppercase ${cls.label} mt-0.5`,
              children: unit
            }
          )
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `flex flex-col items-center rounded-md px-3 py-2 ${cls.border} bg-card/80 min-w-[52px]`,
      "data-ocid": `circuit-segment-${unit.toLowerCase()}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `font-mono text-2xl font-bold leading-none tabular-nums ${cls.textColor} ${cls.text}`,
            children: padded
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `font-mono text-[10px] tracking-[0.15em] uppercase ${cls.label} mt-1`,
            children: unit
          }
        )
      ]
    }
  );
}
function TimeCircuitsCountdown({
  expirationDate,
  label,
  compact = false,
  forceRed = false
}) {
  const expMs = typeof expirationDate === "bigint" ? Number(expirationDate) / 1e6 : expirationDate > 1e15 ? expirationDate / 1e6 : expirationDate;
  const [msRemaining, setMsRemaining] = reactExports.useState(() => expMs - Date.now());
  reactExports.useEffect(() => {
    const tick = () => setMsRemaining(expMs - Date.now());
    tick();
    const id = setInterval(tick, 1e3);
    return () => clearInterval(id);
  }, [expMs]);
  const color = forceRed ? "red" : getColorState(msRemaining);
  const segments = getSegments(msRemaining);
  const expired = msRemaining <= 0;
  const cls = COLOR_CLASSES[color];
  if (compact) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex items-center gap-1",
        "data-ocid": "time-circuits-compact",
        children: expired ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `font-mono text-xs font-bold uppercase tracking-widest ${cls.textColor} ${cls.text}`,
            children: "EXPIRED"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: segments.map((seg, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          i > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `font-mono text-xs ${cls.textColor} mx-0.5`, children: ":" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircuitSegment, { ...seg, color, compact: true })
        ] }, seg.unit)) })
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-lg border border-primary/20 bg-card/40 p-4",
      "data-ocid": "time-circuits-countdown",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `font-display text-xs font-bold tracking-[0.2em] uppercase ${cls.textColor} ${cls.text}`,
              children: label ?? "TIME CIRCUITS ACTIVATED"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `font-mono text-[10px] tracking-widest uppercase px-2 py-0.5 rounded border ${cls.border} ${cls.textColor}`,
              children: expired ? "EXPIRED" : color === "green" ? "ACTIVE" : color === "yellow" ? "EXPIRING SOON" : "CRITICAL"
            }
          )
        ] }),
        expired ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `font-display text-2xl font-bold tracking-widest ${cls.textColor} ${cls.text} animate-circuit-pulse`,
            children: "FLUX CAPACITOR DEPLETED"
          }
        ) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1 flex-wrap", children: segments.map((seg, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center", children: [
          i > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(SegmentDot, { color }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircuitSegment, { ...seg, color, compact: false })
        ] }, seg.unit)) }),
        !expired && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-muted-foreground mt-3 tracking-wide", children: color === "red" ? "⚠ Renew now — listing will be archived soon" : color === "yellow" ? "↑ Upgrade to extend your timeline" : "✓ Listing active — time circuits nominal" })
      ]
    }
  );
}
export {
  TimeCircuitsCountdown as T
};
