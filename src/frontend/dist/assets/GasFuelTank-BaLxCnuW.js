import { W as interpolate, Y as frame, _ as isMotionValue, $ as JSAnimation, a0 as useConstant, a1 as motionValue, r as reactExports, a2 as MotionConfigContext, a3 as useIsomorphicLayoutEffect, a4 as cancelFrame, a5 as collectMotionValues, j as jsxRuntimeExports, m as motion } from "./index-D98vhwYy.js";
function transform(...args) {
  const useImmediate = !Array.isArray(args[0]);
  const argOffset = useImmediate ? 0 : -1;
  const inputValue = args[0 + argOffset];
  const inputRange = args[1 + argOffset];
  const outputRange = args[2 + argOffset];
  const options = args[3 + argOffset];
  const interpolator = interpolate(inputRange, outputRange, options);
  return useImmediate ? interpolator(inputValue) : interpolator;
}
function attachFollow(value, source, options = {}) {
  const initialValue = value.get();
  let activeAnimation = null;
  let latestValue = initialValue;
  let latestSetter;
  const unit = typeof initialValue === "string" ? initialValue.replace(/[\d.-]/g, "") : void 0;
  const stopAnimation = () => {
    if (activeAnimation) {
      activeAnimation.stop();
      activeAnimation = null;
    }
    value.animation = void 0;
  };
  const startAnimation = () => {
    const currentValue = asNumber(value.get());
    const targetValue = asNumber(latestValue);
    if (currentValue === targetValue) {
      stopAnimation();
      return;
    }
    const velocity = activeAnimation ? activeAnimation.getGeneratorVelocity() : value.getVelocity();
    stopAnimation();
    activeAnimation = new JSAnimation({
      keyframes: [currentValue, targetValue],
      velocity,
      // Default to spring if no type specified (matches useSpring behavior)
      type: "spring",
      restDelta: 1e-3,
      restSpeed: 0.01,
      ...options,
      onUpdate: latestSetter
    });
  };
  const scheduleAnimation = () => {
    var _a;
    startAnimation();
    value.animation = activeAnimation ?? void 0;
    (_a = value["events"].animationStart) == null ? void 0 : _a.notify();
    activeAnimation == null ? void 0 : activeAnimation.then(() => {
      var _a2;
      value.animation = void 0;
      (_a2 = value["events"].animationComplete) == null ? void 0 : _a2.notify();
    });
  };
  value.attach((v, set) => {
    latestValue = v;
    latestSetter = (latest) => set(parseValue(latest, unit));
    frame.postRender(scheduleAnimation);
  }, stopAnimation);
  if (isMotionValue(source)) {
    let skipNextAnimation = options.skipInitialAnimation === true;
    const removeSourceOnChange = source.on("change", (v) => {
      if (skipNextAnimation) {
        skipNextAnimation = false;
        value.jump(parseValue(v, unit), false);
      } else {
        value.set(parseValue(v, unit));
      }
    });
    const removeValueOnDestroy = value.on("destroy", removeSourceOnChange);
    return () => {
      removeSourceOnChange();
      removeValueOnDestroy();
    };
  }
  return stopAnimation;
}
function parseValue(v, unit) {
  return unit ? v + unit : v;
}
function asNumber(v) {
  return typeof v === "number" ? v : parseFloat(v);
}
function useMotionValue(initial) {
  const value = useConstant(() => motionValue(initial));
  const { isStatic } = reactExports.useContext(MotionConfigContext);
  if (isStatic) {
    const [, setLatest] = reactExports.useState(initial);
    reactExports.useEffect(() => value.on("change", setLatest), []);
  }
  return value;
}
function useCombineMotionValues(values, combineValues) {
  const value = useMotionValue(combineValues());
  const updateValue = () => value.set(combineValues());
  updateValue();
  useIsomorphicLayoutEffect(() => {
    const scheduleUpdate = () => frame.preRender(updateValue, false, true);
    const subscriptions = values.map((v) => v.on("change", scheduleUpdate));
    return () => {
      subscriptions.forEach((unsubscribe) => unsubscribe());
      cancelFrame(updateValue);
    };
  });
  return value;
}
function useComputed(compute) {
  collectMotionValues.current = [];
  compute();
  const value = useCombineMotionValues(collectMotionValues.current, compute);
  collectMotionValues.current = void 0;
  return value;
}
function useTransform(input, inputRangeOrTransformer, outputRangeOrMap, options) {
  if (typeof input === "function") {
    return useComputed(input);
  }
  const isOutputMap = outputRangeOrMap !== void 0 && !Array.isArray(outputRangeOrMap) && typeof inputRangeOrTransformer !== "function";
  if (isOutputMap) {
    return useMapTransform(input, inputRangeOrTransformer, outputRangeOrMap, options);
  }
  const outputRange = outputRangeOrMap;
  const transformer = typeof inputRangeOrTransformer === "function" ? inputRangeOrTransformer : transform(inputRangeOrTransformer, outputRange, options);
  const result = Array.isArray(input) ? useListTransform(input, transformer) : useListTransform([input], ([latest]) => transformer(latest));
  const inputAccelerate = !Array.isArray(input) ? input.accelerate : void 0;
  if (inputAccelerate && !inputAccelerate.isTransformed && typeof inputRangeOrTransformer !== "function" && Array.isArray(outputRangeOrMap) && (options == null ? void 0 : options.clamp) !== false) {
    result.accelerate = {
      ...inputAccelerate,
      times: inputRangeOrTransformer,
      keyframes: outputRangeOrMap,
      isTransformed: true,
      ...{}
    };
  }
  return result;
}
function useListTransform(values, transformer) {
  const latest = useConstant(() => []);
  return useCombineMotionValues(values, () => {
    latest.length = 0;
    const numValues = values.length;
    for (let i = 0; i < numValues; i++) {
      latest[i] = values[i].get();
    }
    return transformer(latest);
  });
}
function useMapTransform(inputValue, inputRange, outputMap, options) {
  const keys = useConstant(() => Object.keys(outputMap));
  const output = useConstant(() => ({}));
  for (const key of keys) {
    output[key] = useTransform(inputValue, inputRange, outputMap[key], options);
  }
  return output;
}
function useFollowValue(source, options = {}) {
  const { isStatic } = reactExports.useContext(MotionConfigContext);
  const getFromSource = () => isMotionValue(source) ? source.get() : source;
  if (isStatic) {
    return useTransform(getFromSource);
  }
  const value = useMotionValue(getFromSource());
  reactExports.useInsertionEffect(() => {
    return attachFollow(value, source, options);
  }, [value, JSON.stringify(options)]);
  return value;
}
function useSpring(source, options = {}) {
  return useFollowValue(source, { type: "spring", ...options });
}
const TIER_CONFIG = {
  1: { baseline: 30, days: 30 },
  2: { baseline: 60, days: 90 },
  3: { baseline: 90, days: 180 }
};
const TIER_NAMES = {
  1: "Time Walker",
  2: "Time Traveler",
  3: "Time Lord"
};
function computeFuelFromExpiry(expirationDateMs, tier) {
  const cfg = TIER_CONFIG[tier] ?? TIER_CONFIG[1];
  const msLeft = expirationDateMs - Date.now();
  const daysRemaining = Math.max(0, msLeft / (1e3 * 60 * 60 * 24));
  const fuelPercent = Math.max(
    0,
    Math.min(cfg.baseline, daysRemaining / cfg.days * cfg.baseline)
  );
  return {
    fuelPercent: Math.round(fuelPercent * 10) / 10,
    daysRemaining: Math.max(0, Math.floor(daysRemaining))
  };
}
function getBatteryState(pct) {
  if (pct <= 35) return "low";
  if (pct <= 65) return "mid";
  return "high";
}
function getFillColor(pct) {
  const state = getBatteryState(pct);
  if (pct <= 0) return "oklch(0.35 0.01 262)";
  if (state === "low") return "oklch(0.65 0.22 16)";
  if (state === "mid") return "oklch(0.88 0.19 84)";
  return "oklch(0.65 0.22 150)";
}
function getFillGlowClass(pct) {
  const state = getBatteryState(pct);
  if (pct <= 0) return "";
  if (state === "low") return "shadow-[0_0_18px_oklch(0.65_0.22_16/0.8)]";
  if (state === "mid") return "shadow-[0_0_18px_oklch(0.88_0.19_84/0.8)]";
  return "shadow-[0_0_18px_oklch(0.65_0.22_150/0.8)]";
}
function getBatteryMessage(pct) {
  const state = getBatteryState(pct);
  if (pct <= 0) return "No Fuel — Refuel Now";
  if (state === "low") return "Low Fuel — Refuel Now";
  if (state === "mid") return "Cruising — Top Off Anytime";
  return "Full Tank — You Are Good";
}
function getBatteryTextColor(pct) {
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
    balanceSize: "text-xs"
  },
  md: { width: 80, height: 160, labelSize: "text-xs", balanceSize: "text-sm" },
  lg: { width: 110, height: 220, labelSize: "text-xs", balanceSize: "text-lg" }
};
function GasFuelTank({
  expirationDate,
  tier,
  fillPercent: staticFillPercent,
  tierLabel = "GAS",
  size = "lg",
  daysRemaining: staticDaysRemaining
}) {
  const [liveData, setLiveData] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (!expirationDate || !tier) {
      setLiveData(null);
      return;
    }
    setLiveData(computeFuelFromExpiry(expirationDate, tier));
    const interval = setInterval(() => {
      setLiveData(computeFuelFromExpiry(expirationDate, tier));
    }, 6e4);
    return () => clearInterval(interval);
  }, [expirationDate, tier]);
  const resolvedFillPercent = liveData != null ? liveData.fuelPercent : staticFillPercent ?? 0;
  const resolvedDaysRemaining = liveData != null ? liveData.daysRemaining : staticDaysRemaining;
  const resolvedTierLabel = liveData != null && tier ? resolvedDaysRemaining === 0 ? "Expired — Refuel Now" : TIER_NAMES[tier] ?? tierLabel : tierLabel;
  const clamped = Math.max(0, Math.min(resolvedFillPercent, 100));
  const pct = clamped / 100;
  const fillColor = getFillColor(clamped);
  const glowClass = getFillGlowClass(clamped);
  const batteryMsg = getBatteryMessage(clamped);
  const textColorClass = getBatteryTextColor(clamped);
  const dims = SIZE_MAP[size];
  const springPct = useSpring(pct, { stiffness: 60, damping: 18 });
  reactExports.useEffect(() => {
    springPct.set(pct);
  }, [pct, springPct]);
  const fillHeight = useTransform(springPct, [0, 1], [0, dims.height - 32]);
  const fillY = useTransform(springPct, [0, 1], [dims.height - 16, 16]);
  const innerW = dims.width - 16;
  const displayLabel = resolvedDaysRemaining !== void 0 ? `${clamped.toFixed(1)}% · ${resolvedDaysRemaining}d` : resolvedTierLabel;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", style: { width: dims.width }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "svg",
        {
          width: dims.width,
          height: dims.height,
          viewBox: `0 0 ${dims.width} ${dims.height}`,
          className: "drop-shadow-lg",
          role: "img",
          "aria-label": `Gas tank: ${clamped}% full — ${batteryMsg}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "pattern",
                {
                  id: "scanlines-tank",
                  x: "0",
                  y: "0",
                  width: "1",
                  height: "4",
                  patternUnits: "userSpaceOnUse",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { width: "1", height: "1", fill: "rgba(0,0,0,0.25)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { y: "1", width: "1", height: "3", fill: "transparent" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("clipPath", { id: "tank-clip-v2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  x: "8",
                  y: "12",
                  width: innerW,
                  height: dims.height - 24,
                  rx: "6"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("filter", { id: "glow-filter-tank", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("feGaussianBlur", { stdDeviation: "2.5", result: "blur" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("feMerge", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "blur" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "SourceGraphic" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "rect",
              {
                x: "4",
                y: "8",
                width: dims.width - 8,
                height: dims.height - 16,
                rx: "10",
                fill: "oklch(0.14 0.02 262)",
                stroke: "oklch(0.65 0.22 262)",
                strokeWidth: "1.5",
                filter: "url(#glow-filter-tank)"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "rect",
              {
                x: dims.width / 2 - 8,
                y: "2",
                width: "16",
                height: "10",
                rx: "3",
                fill: "oklch(0.18 0.04 262)",
                stroke: "oklch(0.65 0.22 262)",
                strokeWidth: "1"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.rect,
              {
                x: "8",
                y: fillY,
                width: innerW,
                height: fillHeight,
                rx: "5",
                fill: fillColor,
                opacity: clamped > 0 ? 0.92 : 0,
                clipPath: "url(#tank-clip-v2)"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "rect",
              {
                x: "8",
                y: "12",
                width: innerW,
                height: dims.height - 24,
                rx: "6",
                fill: "url(#scanlines-tank)",
                clipPath: "url(#tank-clip-v2)"
              }
            ),
            clamped > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.rect,
              {
                x: "8",
                y: fillY,
                width: innerW,
                height: "2",
                fill: fillColor,
                opacity: 0.9,
                clipPath: "url(#tank-clip-v2)",
                animate: { opacity: [0.6, 1, 0.6] },
                transition: {
                  duration: 1.8,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut"
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.text,
              {
                x: dims.width / 2,
                y: dims.height / 2 + 5,
                textAnchor: "middle",
                fill: "oklch(0.97 0 0)",
                fontSize: size === "lg" ? 13 : size === "md" ? 10 : 8,
                fontFamily: "Space Mono, monospace",
                fontWeight: "700",
                filter: "url(#glow-filter-tank)",
                children: [
                  clamped.toFixed(1),
                  "%"
                ]
              }
            ),
            resolvedDaysRemaining !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "text",
              {
                x: dims.width / 2,
                y: dims.height / 2 + 20,
                textAnchor: "middle",
                fill: fillColor,
                fontSize: size === "lg" ? 9 : 7,
                fontFamily: "Space Mono, monospace",
                fontWeight: "600",
                letterSpacing: "1",
                children: [
                  resolvedDaysRemaining,
                  "d"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "text",
              {
                x: dims.width / 2,
                y: dims.height - 20,
                textAnchor: "middle",
                fill: "oklch(0.55 0.14 262)",
                fontSize: 7,
                fontFamily: "Space Mono, monospace",
                letterSpacing: "1.5",
                children: "DeLorean"
              }
            )
          ]
        }
      ),
      clamped > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          className: `absolute inset-0 rounded-xl pointer-events-none ${glowClass}`,
          animate: { opacity: [0.4, 0.9, 0.4] },
          transition: {
            duration: 2.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut"
          }
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: `font-display font-black tracking-widest uppercase ${dims.balanceSize} ${textColorClass}`,
          style: {
            textShadow: clamped > 65 ? "0 0 12px oklch(0.65 0.22 150 / 0.9)" : clamped > 35 ? "0 0 12px oklch(0.88 0.19 84 / 0.9)" : "0 0 12px oklch(0.65 0.22 16 / 0.9)"
          },
          children: displayLabel
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: `font-mono ${dims.labelSize} mt-0.5 ${textColorClass} opacity-80`,
          children: batteryMsg
        }
      ),
      liveData != null && tier && resolvedDaysRemaining !== 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] mt-0.5 text-muted-foreground tracking-widest uppercase", children: TIER_NAMES[tier] })
    ] })
  ] });
}
export {
  GasFuelTank as G,
  computeFuelFromExpiry as c
};
