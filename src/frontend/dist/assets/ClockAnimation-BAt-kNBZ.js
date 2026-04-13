import { j as jsxRuntimeExports, m as motion } from "./index-C4SYi2ho.js";
const HOUR_MARKERS = Array.from({ length: 12 }, (_, i) => {
  const angle = (i * 30 - 90) * (Math.PI / 180);
  return {
    id: i,
    x1: 70 + 55 * Math.cos(angle),
    y1: 70 + 55 * Math.sin(angle),
    x2: 70 + 62 * Math.cos(angle),
    y2: 70 + 62 * Math.sin(angle),
    thick: i % 3 === 0
  };
});
function ClockAnimation({ active }) {
  if (!active) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      className: "fixed inset-0 z-[9998] flex items-center justify-center pointer-events-none",
      initial: { opacity: 0, scale: 0.5 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 1.5 },
      transition: { duration: 0.3, ease: "easeOut" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-background/80 backdrop-blur-sm" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex flex-col items-center gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              className: "relative w-48 h-48",
              animate: { rotate: 360 },
              transition: {
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-48 h-48 rounded-full border-4 border-primary/30 glow-blue absolute inset-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-48 h-48 rounded-full border-t-4 border-primary",
                    style: { boxShadow: "0 0 20px oklch(0.65 0.22 262 / 0.8)" }
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "svg",
            {
              width: "140",
              height: "140",
              viewBox: "0 0 140 140",
              "aria-label": "Animated clock face",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("title", { children: "Clock face animation" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "circle",
                  {
                    cx: "70",
                    cy: "70",
                    r: "65",
                    fill: "oklch(0.16 0 0)",
                    stroke: "oklch(0.65 0.22 262)",
                    strokeWidth: "2"
                  }
                ),
                HOUR_MARKERS.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "line",
                  {
                    x1: m.x1,
                    y1: m.y1,
                    x2: m.x2,
                    y2: m.y2,
                    stroke: "oklch(0.65 0.22 262)",
                    strokeWidth: m.thick ? 3 : 1
                  },
                  m.id
                )),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.line,
                  {
                    x1: "70",
                    y1: "70",
                    x2: "70",
                    y2: "38",
                    stroke: "oklch(0.95 0 0)",
                    strokeWidth: "4",
                    strokeLinecap: "round",
                    style: { transformOrigin: "70px 70px" },
                    animate: { rotate: 360 },
                    transition: {
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear"
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.line,
                  {
                    x1: "70",
                    y1: "70",
                    x2: "70",
                    y2: "26",
                    stroke: "oklch(0.65 0.22 262)",
                    strokeWidth: "3",
                    strokeLinecap: "round",
                    style: { transformOrigin: "70px 70px" },
                    animate: { rotate: [0, 360] },
                    transition: {
                      duration: 0.3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear"
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.line,
                  {
                    x1: "70",
                    y1: "70",
                    x2: "70",
                    y2: "18",
                    stroke: "oklch(0.88 0.19 84)",
                    strokeWidth: "2",
                    strokeLinecap: "round",
                    style: { transformOrigin: "70px 70px" },
                    animate: { rotate: [0, 360] },
                    transition: {
                      duration: 0.1,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear"
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "70", cy: "70", r: "5", fill: "oklch(0.88 0.19 84)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "70", cy: "70", r: "3", fill: "oklch(0.08 0 0)" })
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.p,
            {
              className: "text-primary font-display text-sm tracking-[0.3em] uppercase text-glow-blue mt-32",
              animate: { opacity: [0.5, 1, 0.5] },
              transition: { duration: 0.8, repeat: Number.POSITIVE_INFINITY },
              children: "Traveling through time..."
            }
          )
        ] })
      ]
    }
  );
}
export {
  ClockAnimation as C
};
