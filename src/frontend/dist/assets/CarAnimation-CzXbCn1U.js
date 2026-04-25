import { j as jsxRuntimeExports, m as motion } from "./index-BBOHKJcC.js";
function CarAnimation({ active }) {
  if (!active) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      className: "fixed inset-0 z-[9997] flex items-center justify-center pointer-events-none overflow-hidden",
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.2 },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-background/60 backdrop-blur-sm" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 overflow-hidden", children: Array.from({ length: 12 }, (_, i) => i).map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            className: "absolute h-px bg-primary/30",
            style: {
              top: `${15 + i * 6}%`,
              left: 0,
              right: 0
            },
            initial: { scaleX: 0, transformOrigin: "right" },
            animate: { scaleX: [0, 1, 0] },
            transition: {
              duration: 0.6,
              delay: i * 0.02,
              ease: "easeIn"
            }
          },
          `speed-line-${i}`
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            className: "relative z-10",
            initial: { x: "-110vw", skewX: -8 },
            animate: { x: "110vw", skewX: -12 },
            transition: {
              duration: 0.6,
              ease: [0.25, 0.46, 0.45, 0.94]
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  className: "absolute inset-y-0 -left-32 w-32 pointer-events-none",
                  style: {
                    background: "linear-gradient(to right, transparent, oklch(0.65 0.22 262 / 0.3))",
                    filter: "blur(8px)"
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "svg",
                {
                  width: "320",
                  height: "120",
                  viewBox: "0 0 320 120",
                  "aria-label": "Car silhouette",
                  style: {
                    filter: "drop-shadow(0 0 16px oklch(0.65 0.22 262)) drop-shadow(0 0 32px oklch(0.88 0.19 84 / 0.5))"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("title", { children: "Time-traveling car" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "path",
                      {
                        d: "M 20 85 L 20 60 L 60 30 L 200 25 L 260 45 L 300 60 L 305 85 Z",
                        fill: "oklch(0.65 0.22 262 / 0.9)",
                        stroke: "oklch(0.88 0.19 84)",
                        strokeWidth: "2"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "path",
                      {
                        d: "M 65 32 L 90 55 L 180 55 L 195 30 Z",
                        fill: "oklch(0.5 0.15 200 / 0.7)",
                        stroke: "oklch(0.65 0.22 262)",
                        strokeWidth: "1.5"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "path",
                      {
                        d: "M 195 32 L 190 55 L 230 55 L 250 45 Z",
                        fill: "oklch(0.5 0.15 200 / 0.6)",
                        stroke: "oklch(0.65 0.22 262)",
                        strokeWidth: "1"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "circle",
                      {
                        cx: "75",
                        cy: "85",
                        r: "22",
                        fill: "oklch(0.12 0 0)",
                        stroke: "oklch(0.65 0.22 262)",
                        strokeWidth: "3"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "circle",
                      {
                        cx: "75",
                        cy: "85",
                        r: "12",
                        fill: "oklch(0.2 0 0)",
                        stroke: "oklch(0.88 0.19 84)",
                        strokeWidth: "2"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "circle",
                      {
                        cx: "245",
                        cy: "85",
                        r: "22",
                        fill: "oklch(0.12 0 0)",
                        stroke: "oklch(0.65 0.22 262)",
                        strokeWidth: "3"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "circle",
                      {
                        cx: "245",
                        cy: "85",
                        r: "12",
                        fill: "oklch(0.2 0 0)",
                        stroke: "oklch(0.88 0.19 84)",
                        strokeWidth: "2"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "300", cy: "65", rx: "8", ry: "5", fill: "oklch(0.88 0.19 84)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "ellipse",
                      {
                        cx: "18",
                        cy: "78",
                        rx: "12",
                        ry: "5",
                        fill: "oklch(0.65 0.22 262 / 0.8)"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "line",
                      {
                        x1: "100",
                        y1: "50",
                        x2: "180",
                        y2: "50",
                        stroke: "oklch(0.88 0.19 84 / 0.5)",
                        strokeWidth: "1"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "line",
                      {
                        x1: "90",
                        y1: "58",
                        x2: "200",
                        y2: "58",
                        stroke: "oklch(0.88 0.19 84 / 0.3)",
                        strokeWidth: "0.5"
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  className: "absolute right-full top-1/2 -translate-y-1/2 -mr-4",
                  initial: { scaleX: 0 },
                  animate: { scaleX: [0, 1.5, 0.8, 1] },
                  transition: { duration: 0.6, ease: "easeOut" },
                  style: { transformOrigin: "right" },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "w-24 h-8",
                      style: {
                        background: "linear-gradient(to left, oklch(0.88 0.19 84 / 0.9), transparent)",
                        filter: "blur(4px)",
                        clipPath: "polygon(100% 50%, 0% 0%, 20% 50%, 0% 100%)"
                      }
                    }
                  )
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-[35%] left-0 right-0 h-px bg-primary/20" })
      ]
    }
  );
}
export {
  CarAnimation as C
};
