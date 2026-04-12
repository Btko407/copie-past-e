import { c as createLucideIcon, j as jsxRuntimeExports, m as motion, r as reactExports, K as useComposedRefs, N as cn, B as Button, S as Skeleton, O as useAuth, G as useProfile, s as useGetMyGasWallet, P as useNotifications, Q as Navigate, n as Link, A as ArrowLeft, a as ue, l as Label, U as User, I as Input, T as Mail, H as CircleCheck } from "./index-C4SV0eZt.js";
import { B as Badge } from "./badge-BklfFr65.js";
import { b as useCreateStripePortalSession } from "./useStripePayments-CUXDe7T_.js";
import { u as useGetMySubscription, a as useGetTiers } from "./useTiers-Bs5hcHPl.js";
import { G as GasFuelTank } from "./GasFuelTank-D_u2VInf.js";
import { P as Primitive, c as createContextScope, a as composeEventHandlers, u as useLayoutEffect2 } from "./index-_OZlumP_.js";
import { P as Presence, u as useCallbackRef } from "./index-1keNSzgr.js";
import { u as useDirection } from "./index-BKaJPTDj.js";
import { A as AnimatePresence } from "./index-C-H-3nNw.js";
import { B as BackupsSection } from "./RefuelBanner-BMkabQPK.js";
import { b as useExportManualBackup } from "./useBackup-CifWZFPe.js";
import { u as useGetMyFbCredentials, a as useSaveFbCredentials, b as useGetFbListings } from "./useFbGraph-Dw7biPSY.js";
import { D as Download } from "./download-D_Nvr-2s.js";
import { C as CircleX } from "./circle-x-DGH6a9mp.js";
import { E as EyeOff } from "./eye-off-HLUWdJ_h.js";
import { E as Eye } from "./eye-CGiVyEso.js";
import { C as ChevronUp } from "./chevron-up-D_DjVKt6.js";
import { C as ChevronDown } from "./chevron-down-DMyKGXDo.js";
import "./trash-2-CqtURlKD.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }]
];
const Calendar = createLucideIcon("calendar", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    {
      d: "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z",
      key: "1tc9qg"
    }
  ],
  ["circle", { cx: "12", cy: "13", r: "3", key: "1vg3eu" }]
];
const Camera = createLucideIcon("camera", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    { d: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z", key: "1jg4f8" }
  ]
];
const Facebook = createLucideIcon("facebook", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",
      key: "9njp5v"
    }
  ]
];
const Phone = createLucideIcon("phone", __iconNode);
function getTierConfig(tierName) {
  const name = tierName.toUpperCase();
  const isMax = name === "MAX" || name.includes("TIME LORD") || name.includes("MAX");
  const isPro = name === "PRO" || name.includes("TRAVELER") || name.includes("ADVENTURE") || name.includes("PRO");
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
      tierId: 3
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
      tierId: 2
    };
  }
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
    tierId: 1
  };
}
function getExpiryMs(expiry) {
  if (!expiry) return 0;
  const val = expiry > BigInt(1e15) ? Number(expiry / BigInt(1e6)) : Number(expiry);
  return val;
}
function getDaysRemaining(expiry) {
  if (!expiry) return null;
  const expiryMs = getExpiryMs(expiry);
  const msLeft = expiryMs - Date.now();
  return Math.max(0, Math.floor(msLeft / 864e5));
}
function DeLoreanSVG({ config }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      viewBox: "0 0 280 140",
      width: "280",
      height: "140",
      role: "img",
      "aria-label": "DeLorean time machine",
      className: "drop-shadow-lg",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("filter", { id: "delorean-glow", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("feGaussianBlur", { stdDeviation: "3", result: "blur" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("feMerge", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "blur" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "SourceGraphic" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "body-grad", x1: "0", y1: "0", x2: "0", y2: "1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: config.bodyFill, stopOpacity: "1" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "stop",
              {
                offset: "100%",
                stopColor: "oklch(0.10 0.01 262)",
                stopOpacity: "1"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "window-grad", x1: "0", y1: "0", x2: "0", y2: "1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "oklch(0.4 0.1 220)", stopOpacity: "0.8" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "stop",
              {
                offset: "100%",
                stopColor: "oklch(0.2 0.05 220)",
                stopOpacity: "0.9"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "rect",
          {
            x: "20",
            y: "78",
            width: "240",
            height: "38",
            rx: "6",
            fill: "url(#body-grad)",
            stroke: config.bodyStroke,
            strokeWidth: "1.5",
            filter: "url(#delorean-glow)"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            d: "M 65 78 L 80 48 L 185 48 L 210 78 Z",
            fill: "url(#body-grad)",
            stroke: config.bodyStroke,
            strokeWidth: "1.5"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            d: "M 80 76 L 92 52 L 172 52 L 185 76 Z",
            fill: "url(#window-grad)",
            stroke: config.accentFill,
            strokeWidth: "1",
            opacity: "0.85"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "line",
          {
            x1: "90",
            y1: "78",
            x2: "95",
            y2: "60",
            stroke: config.bodyStroke,
            strokeWidth: "1",
            opacity: "0.6"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "line",
          {
            x1: "170",
            y1: "78",
            x2: "165",
            y2: "60",
            stroke: config.bodyStroke,
            strokeWidth: "1",
            opacity: "0.6"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "rect",
          {
            x: "100",
            y: "80",
            width: "80",
            height: "30",
            rx: "2",
            fill: "oklch(0.12 0.02 262)",
            stroke: config.bodyStroke,
            strokeWidth: "0.8",
            opacity: "0.7"
          }
        ),
        [0, 1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "rect",
          {
            x: 30 + i * 8,
            y: 84,
            width: "5",
            height: "20",
            rx: "1",
            fill: config.accentFill,
            opacity: "0.35"
          },
          i
        )),
        [0, 1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "rect",
          {
            x: 200 + i * 8,
            y: 84,
            width: "5",
            height: "20",
            rx: "1",
            fill: config.accentFill,
            opacity: "0.35"
          },
          i
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "circle",
          {
            cx: "70",
            cy: "116",
            r: "18",
            fill: "oklch(0.10 0 0)",
            stroke: config.bodyStroke,
            strokeWidth: "2"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "circle",
          {
            cx: "70",
            cy: "116",
            r: "10",
            fill: "oklch(0.18 0.02 262)",
            stroke: config.accentFill,
            strokeWidth: "1.5"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "70", cy: "116", r: "4", fill: config.accentFill }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "circle",
          {
            cx: "195",
            cy: "116",
            r: "18",
            fill: "oklch(0.10 0 0)",
            stroke: config.bodyStroke,
            strokeWidth: "2"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "circle",
          {
            cx: "195",
            cy: "116",
            r: "10",
            fill: "oklch(0.18 0.02 262)",
            stroke: config.accentFill,
            strokeWidth: "1.5"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "195", cy: "116", r: "4", fill: config.accentFill }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { filter: "url(#delorean-glow)", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "line",
            {
              x1: "140",
              y1: "65",
              x2: "140",
              y2: "55",
              stroke: config.fluxCapacitorColor,
              strokeWidth: "2.5"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "line",
            {
              x1: "140",
              y1: "65",
              x2: "132",
              y2: "72",
              stroke: config.fluxCapacitorColor,
              strokeWidth: "2.5"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "line",
            {
              x1: "140",
              y1: "65",
              x2: "148",
              y2: "72",
              stroke: config.fluxCapacitorColor,
              strokeWidth: "2.5"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "140", cy: "53", r: "3", fill: config.fluxCapacitorColor }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "130", cy: "74", r: "3", fill: config.fluxCapacitorColor }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "150", cy: "74", r: "3", fill: config.fluxCapacitorColor })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            cx: "30",
            cy: "88",
            rx: "8",
            ry: "5",
            fill: config.accentFill,
            opacity: "0.7",
            filter: "url(#delorean-glow)"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            cx: "250",
            cy: "88",
            rx: "8",
            ry: "5",
            fill: config.accentFill,
            opacity: "0.4"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "rect",
          {
            x: "95",
            y: "95",
            width: "70",
            height: "8",
            rx: "2",
            fill: "oklch(0.08 0 0)",
            stroke: config.accentFill,
            strokeWidth: "0.8",
            opacity: "0.9"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "text",
          {
            x: "130",
            y: "101.5",
            textAnchor: "middle",
            fill: config.accentFill,
            fontSize: "5",
            fontFamily: "monospace",
            letterSpacing: "1",
            children: "TIME CIRCUITS"
          }
        )
      ]
    }
  );
}
function DeLoreanTierDisplay({
  tierName,
  subscriptionExpiry
}) {
  const config = getTierConfig(tierName);
  const daysRemaining = getDaysRemaining(subscriptionExpiry);
  const expiryMs = getExpiryMs(subscriptionExpiry);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          className: `relative rounded-xl p-3 bg-card/60 ${config.borderClass}`,
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, ease: "easeOut" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DeLoreanSVG, { config }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-2 right-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `font-display text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded ${config.borderClass} bg-card/80 ${config.textColorClass} ${config.textGlowClass}`,
                children: config.label
              }
            ) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, x: 12 },
          animate: { opacity: 1, x: 0 },
          transition: { duration: 0.5, delay: 0.15 },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            GasFuelTank,
            {
              expirationDate: expiryMs > 0 ? expiryMs : void 0,
              tier: expiryMs > 0 ? config.tierId : void 0,
              fillPercent: expiryMs > 0 ? void 0 : 0,
              tierLabel: config.displayLabel,
              size: "md"
            }
          )
        }
      )
    ] }),
    daysRemaining !== null && /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        className: "flex items-center gap-2",
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { delay: 0.3 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `font-mono text-xs tracking-widest uppercase px-3 py-1 rounded ${daysRemaining === 0 ? "neon-border-red text-destructive text-glow-red bg-destructive/10" : daysRemaining <= 3 ? "neon-border-red text-destructive text-glow-red bg-destructive/10" : daysRemaining <= 7 ? "neon-border-yellow text-accent text-glow-yellow bg-accent/10" : "neon-border-blue text-primary text-glow-blue bg-primary/10"}`,
            children: daysRemaining === 0 ? "⚠ EXPIRED — REFUEL NOW" : `⚡ ${daysRemaining} day${daysRemaining !== 1 ? "s" : ""} remaining`
          }
        )
      }
    )
  ] });
}
function clamp(value, [min, max]) {
  return Math.min(max, Math.max(min, value));
}
function useStateMachine(initialState, machine) {
  return reactExports.useReducer((state, event) => {
    const nextState = machine[state][event];
    return nextState ?? state;
  }, initialState);
}
var SCROLL_AREA_NAME = "ScrollArea";
var [createScrollAreaContext] = createContextScope(SCROLL_AREA_NAME);
var [ScrollAreaProvider, useScrollAreaContext] = createScrollAreaContext(SCROLL_AREA_NAME);
var ScrollArea$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeScrollArea,
      type = "hover",
      dir,
      scrollHideDelay = 600,
      ...scrollAreaProps
    } = props;
    const [scrollArea, setScrollArea] = reactExports.useState(null);
    const [viewport, setViewport] = reactExports.useState(null);
    const [content, setContent] = reactExports.useState(null);
    const [scrollbarX, setScrollbarX] = reactExports.useState(null);
    const [scrollbarY, setScrollbarY] = reactExports.useState(null);
    const [cornerWidth, setCornerWidth] = reactExports.useState(0);
    const [cornerHeight, setCornerHeight] = reactExports.useState(0);
    const [scrollbarXEnabled, setScrollbarXEnabled] = reactExports.useState(false);
    const [scrollbarYEnabled, setScrollbarYEnabled] = reactExports.useState(false);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setScrollArea(node));
    const direction = useDirection(dir);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      ScrollAreaProvider,
      {
        scope: __scopeScrollArea,
        type,
        dir: direction,
        scrollHideDelay,
        scrollArea,
        viewport,
        onViewportChange: setViewport,
        content,
        onContentChange: setContent,
        scrollbarX,
        onScrollbarXChange: setScrollbarX,
        scrollbarXEnabled,
        onScrollbarXEnabledChange: setScrollbarXEnabled,
        scrollbarY,
        onScrollbarYChange: setScrollbarY,
        scrollbarYEnabled,
        onScrollbarYEnabledChange: setScrollbarYEnabled,
        onCornerWidthChange: setCornerWidth,
        onCornerHeightChange: setCornerHeight,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            dir: direction,
            ...scrollAreaProps,
            ref: composedRefs,
            style: {
              position: "relative",
              // Pass corner sizes as CSS vars to reduce re-renders of context consumers
              ["--radix-scroll-area-corner-width"]: cornerWidth + "px",
              ["--radix-scroll-area-corner-height"]: cornerHeight + "px",
              ...props.style
            }
          }
        )
      }
    );
  }
);
ScrollArea$1.displayName = SCROLL_AREA_NAME;
var VIEWPORT_NAME = "ScrollAreaViewport";
var ScrollAreaViewport = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeScrollArea, children, nonce, ...viewportProps } = props;
    const context = useScrollAreaContext(VIEWPORT_NAME, __scopeScrollArea);
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref, context.onViewportChange);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "style",
        {
          dangerouslySetInnerHTML: {
            __html: `[data-radix-scroll-area-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-scroll-area-viewport]::-webkit-scrollbar{display:none}`
          },
          nonce
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.div,
        {
          "data-radix-scroll-area-viewport": "",
          ...viewportProps,
          ref: composedRefs,
          style: {
            /**
             * We don't support `visible` because the intention is to have at least one scrollbar
             * if this component is used and `visible` will behave like `auto` in that case
             * https://developer.mozilla.org/en-US/docs/Web/CSS/overflow#description
             *
             * We don't handle `auto` because the intention is for the native implementation
             * to be hidden if using this component. We just want to ensure the node is scrollable
             * so could have used either `scroll` or `auto` here. We picked `scroll` to prevent
             * the browser from having to work out whether to render native scrollbars or not,
             * we tell it to with the intention of hiding them in CSS.
             */
            overflowX: context.scrollbarXEnabled ? "scroll" : "hidden",
            overflowY: context.scrollbarYEnabled ? "scroll" : "hidden",
            ...props.style
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: context.onContentChange, style: { minWidth: "100%", display: "table" }, children })
        }
      )
    ] });
  }
);
ScrollAreaViewport.displayName = VIEWPORT_NAME;
var SCROLLBAR_NAME = "ScrollAreaScrollbar";
var ScrollAreaScrollbar = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { forceMount, ...scrollbarProps } = props;
    const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
    const { onScrollbarXEnabledChange, onScrollbarYEnabledChange } = context;
    const isHorizontal = props.orientation === "horizontal";
    reactExports.useEffect(() => {
      isHorizontal ? onScrollbarXEnabledChange(true) : onScrollbarYEnabledChange(true);
      return () => {
        isHorizontal ? onScrollbarXEnabledChange(false) : onScrollbarYEnabledChange(false);
      };
    }, [isHorizontal, onScrollbarXEnabledChange, onScrollbarYEnabledChange]);
    return context.type === "hover" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaScrollbarHover, { ...scrollbarProps, ref: forwardedRef, forceMount }) : context.type === "scroll" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaScrollbarScroll, { ...scrollbarProps, ref: forwardedRef, forceMount }) : context.type === "auto" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaScrollbarAuto, { ...scrollbarProps, ref: forwardedRef, forceMount }) : context.type === "always" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaScrollbarVisible, { ...scrollbarProps, ref: forwardedRef }) : null;
  }
);
ScrollAreaScrollbar.displayName = SCROLLBAR_NAME;
var ScrollAreaScrollbarHover = reactExports.forwardRef((props, forwardedRef) => {
  const { forceMount, ...scrollbarProps } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
  const [visible, setVisible] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const scrollArea = context.scrollArea;
    let hideTimer = 0;
    if (scrollArea) {
      const handlePointerEnter = () => {
        window.clearTimeout(hideTimer);
        setVisible(true);
      };
      const handlePointerLeave = () => {
        hideTimer = window.setTimeout(() => setVisible(false), context.scrollHideDelay);
      };
      scrollArea.addEventListener("pointerenter", handlePointerEnter);
      scrollArea.addEventListener("pointerleave", handlePointerLeave);
      return () => {
        window.clearTimeout(hideTimer);
        scrollArea.removeEventListener("pointerenter", handlePointerEnter);
        scrollArea.removeEventListener("pointerleave", handlePointerLeave);
      };
    }
  }, [context.scrollArea, context.scrollHideDelay]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || visible, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollAreaScrollbarAuto,
    {
      "data-state": visible ? "visible" : "hidden",
      ...scrollbarProps,
      ref: forwardedRef
    }
  ) });
});
var ScrollAreaScrollbarScroll = reactExports.forwardRef((props, forwardedRef) => {
  const { forceMount, ...scrollbarProps } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
  const isHorizontal = props.orientation === "horizontal";
  const debounceScrollEnd = useDebounceCallback(() => send("SCROLL_END"), 100);
  const [state, send] = useStateMachine("hidden", {
    hidden: {
      SCROLL: "scrolling"
    },
    scrolling: {
      SCROLL_END: "idle",
      POINTER_ENTER: "interacting"
    },
    interacting: {
      SCROLL: "interacting",
      POINTER_LEAVE: "idle"
    },
    idle: {
      HIDE: "hidden",
      SCROLL: "scrolling",
      POINTER_ENTER: "interacting"
    }
  });
  reactExports.useEffect(() => {
    if (state === "idle") {
      const hideTimer = window.setTimeout(() => send("HIDE"), context.scrollHideDelay);
      return () => window.clearTimeout(hideTimer);
    }
  }, [state, context.scrollHideDelay, send]);
  reactExports.useEffect(() => {
    const viewport = context.viewport;
    const scrollDirection = isHorizontal ? "scrollLeft" : "scrollTop";
    if (viewport) {
      let prevScrollPos = viewport[scrollDirection];
      const handleScroll = () => {
        const scrollPos = viewport[scrollDirection];
        const hasScrollInDirectionChanged = prevScrollPos !== scrollPos;
        if (hasScrollInDirectionChanged) {
          send("SCROLL");
          debounceScrollEnd();
        }
        prevScrollPos = scrollPos;
      };
      viewport.addEventListener("scroll", handleScroll);
      return () => viewport.removeEventListener("scroll", handleScroll);
    }
  }, [context.viewport, isHorizontal, send, debounceScrollEnd]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || state !== "hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollAreaScrollbarVisible,
    {
      "data-state": state === "hidden" ? "hidden" : "visible",
      ...scrollbarProps,
      ref: forwardedRef,
      onPointerEnter: composeEventHandlers(props.onPointerEnter, () => send("POINTER_ENTER")),
      onPointerLeave: composeEventHandlers(props.onPointerLeave, () => send("POINTER_LEAVE"))
    }
  ) });
});
var ScrollAreaScrollbarAuto = reactExports.forwardRef((props, forwardedRef) => {
  const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
  const { forceMount, ...scrollbarProps } = props;
  const [visible, setVisible] = reactExports.useState(false);
  const isHorizontal = props.orientation === "horizontal";
  const handleResize = useDebounceCallback(() => {
    if (context.viewport) {
      const isOverflowX = context.viewport.offsetWidth < context.viewport.scrollWidth;
      const isOverflowY = context.viewport.offsetHeight < context.viewport.scrollHeight;
      setVisible(isHorizontal ? isOverflowX : isOverflowY);
    }
  }, 10);
  useResizeObserver(context.viewport, handleResize);
  useResizeObserver(context.content, handleResize);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || visible, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollAreaScrollbarVisible,
    {
      "data-state": visible ? "visible" : "hidden",
      ...scrollbarProps,
      ref: forwardedRef
    }
  ) });
});
var ScrollAreaScrollbarVisible = reactExports.forwardRef((props, forwardedRef) => {
  const { orientation = "vertical", ...scrollbarProps } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
  const thumbRef = reactExports.useRef(null);
  const pointerOffsetRef = reactExports.useRef(0);
  const [sizes, setSizes] = reactExports.useState({
    content: 0,
    viewport: 0,
    scrollbar: { size: 0, paddingStart: 0, paddingEnd: 0 }
  });
  const thumbRatio = getThumbRatio(sizes.viewport, sizes.content);
  const commonProps = {
    ...scrollbarProps,
    sizes,
    onSizesChange: setSizes,
    hasThumb: Boolean(thumbRatio > 0 && thumbRatio < 1),
    onThumbChange: (thumb) => thumbRef.current = thumb,
    onThumbPointerUp: () => pointerOffsetRef.current = 0,
    onThumbPointerDown: (pointerPos) => pointerOffsetRef.current = pointerPos
  };
  function getScrollPosition(pointerPos, dir) {
    return getScrollPositionFromPointer(pointerPos, pointerOffsetRef.current, sizes, dir);
  }
  if (orientation === "horizontal") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      ScrollAreaScrollbarX,
      {
        ...commonProps,
        ref: forwardedRef,
        onThumbPositionChange: () => {
          if (context.viewport && thumbRef.current) {
            const scrollPos = context.viewport.scrollLeft;
            const offset = getThumbOffsetFromScroll(scrollPos, sizes, context.dir);
            thumbRef.current.style.transform = `translate3d(${offset}px, 0, 0)`;
          }
        },
        onWheelScroll: (scrollPos) => {
          if (context.viewport) context.viewport.scrollLeft = scrollPos;
        },
        onDragScroll: (pointerPos) => {
          if (context.viewport) {
            context.viewport.scrollLeft = getScrollPosition(pointerPos, context.dir);
          }
        }
      }
    );
  }
  if (orientation === "vertical") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      ScrollAreaScrollbarY,
      {
        ...commonProps,
        ref: forwardedRef,
        onThumbPositionChange: () => {
          if (context.viewport && thumbRef.current) {
            const scrollPos = context.viewport.scrollTop;
            const offset = getThumbOffsetFromScroll(scrollPos, sizes);
            thumbRef.current.style.transform = `translate3d(0, ${offset}px, 0)`;
          }
        },
        onWheelScroll: (scrollPos) => {
          if (context.viewport) context.viewport.scrollTop = scrollPos;
        },
        onDragScroll: (pointerPos) => {
          if (context.viewport) context.viewport.scrollTop = getScrollPosition(pointerPos);
        }
      }
    );
  }
  return null;
});
var ScrollAreaScrollbarX = reactExports.forwardRef((props, forwardedRef) => {
  const { sizes, onSizesChange, ...scrollbarProps } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
  const [computedStyle, setComputedStyle] = reactExports.useState();
  const ref = reactExports.useRef(null);
  const composeRefs = useComposedRefs(forwardedRef, ref, context.onScrollbarXChange);
  reactExports.useEffect(() => {
    if (ref.current) setComputedStyle(getComputedStyle(ref.current));
  }, [ref]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollAreaScrollbarImpl,
    {
      "data-orientation": "horizontal",
      ...scrollbarProps,
      ref: composeRefs,
      sizes,
      style: {
        bottom: 0,
        left: context.dir === "rtl" ? "var(--radix-scroll-area-corner-width)" : 0,
        right: context.dir === "ltr" ? "var(--radix-scroll-area-corner-width)" : 0,
        ["--radix-scroll-area-thumb-width"]: getThumbSize(sizes) + "px",
        ...props.style
      },
      onThumbPointerDown: (pointerPos) => props.onThumbPointerDown(pointerPos.x),
      onDragScroll: (pointerPos) => props.onDragScroll(pointerPos.x),
      onWheelScroll: (event, maxScrollPos) => {
        if (context.viewport) {
          const scrollPos = context.viewport.scrollLeft + event.deltaX;
          props.onWheelScroll(scrollPos);
          if (isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos)) {
            event.preventDefault();
          }
        }
      },
      onResize: () => {
        if (ref.current && context.viewport && computedStyle) {
          onSizesChange({
            content: context.viewport.scrollWidth,
            viewport: context.viewport.offsetWidth,
            scrollbar: {
              size: ref.current.clientWidth,
              paddingStart: toInt(computedStyle.paddingLeft),
              paddingEnd: toInt(computedStyle.paddingRight)
            }
          });
        }
      }
    }
  );
});
var ScrollAreaScrollbarY = reactExports.forwardRef((props, forwardedRef) => {
  const { sizes, onSizesChange, ...scrollbarProps } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
  const [computedStyle, setComputedStyle] = reactExports.useState();
  const ref = reactExports.useRef(null);
  const composeRefs = useComposedRefs(forwardedRef, ref, context.onScrollbarYChange);
  reactExports.useEffect(() => {
    if (ref.current) setComputedStyle(getComputedStyle(ref.current));
  }, [ref]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollAreaScrollbarImpl,
    {
      "data-orientation": "vertical",
      ...scrollbarProps,
      ref: composeRefs,
      sizes,
      style: {
        top: 0,
        right: context.dir === "ltr" ? 0 : void 0,
        left: context.dir === "rtl" ? 0 : void 0,
        bottom: "var(--radix-scroll-area-corner-height)",
        ["--radix-scroll-area-thumb-height"]: getThumbSize(sizes) + "px",
        ...props.style
      },
      onThumbPointerDown: (pointerPos) => props.onThumbPointerDown(pointerPos.y),
      onDragScroll: (pointerPos) => props.onDragScroll(pointerPos.y),
      onWheelScroll: (event, maxScrollPos) => {
        if (context.viewport) {
          const scrollPos = context.viewport.scrollTop + event.deltaY;
          props.onWheelScroll(scrollPos);
          if (isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos)) {
            event.preventDefault();
          }
        }
      },
      onResize: () => {
        if (ref.current && context.viewport && computedStyle) {
          onSizesChange({
            content: context.viewport.scrollHeight,
            viewport: context.viewport.offsetHeight,
            scrollbar: {
              size: ref.current.clientHeight,
              paddingStart: toInt(computedStyle.paddingTop),
              paddingEnd: toInt(computedStyle.paddingBottom)
            }
          });
        }
      }
    }
  );
});
var [ScrollbarProvider, useScrollbarContext] = createScrollAreaContext(SCROLLBAR_NAME);
var ScrollAreaScrollbarImpl = reactExports.forwardRef((props, forwardedRef) => {
  const {
    __scopeScrollArea,
    sizes,
    hasThumb,
    onThumbChange,
    onThumbPointerUp,
    onThumbPointerDown,
    onThumbPositionChange,
    onDragScroll,
    onWheelScroll,
    onResize,
    ...scrollbarProps
  } = props;
  const context = useScrollAreaContext(SCROLLBAR_NAME, __scopeScrollArea);
  const [scrollbar, setScrollbar] = reactExports.useState(null);
  const composeRefs = useComposedRefs(forwardedRef, (node) => setScrollbar(node));
  const rectRef = reactExports.useRef(null);
  const prevWebkitUserSelectRef = reactExports.useRef("");
  const viewport = context.viewport;
  const maxScrollPos = sizes.content - sizes.viewport;
  const handleWheelScroll = useCallbackRef(onWheelScroll);
  const handleThumbPositionChange = useCallbackRef(onThumbPositionChange);
  const handleResize = useDebounceCallback(onResize, 10);
  function handleDragScroll(event) {
    if (rectRef.current) {
      const x = event.clientX - rectRef.current.left;
      const y = event.clientY - rectRef.current.top;
      onDragScroll({ x, y });
    }
  }
  reactExports.useEffect(() => {
    const handleWheel = (event) => {
      const element = event.target;
      const isScrollbarWheel = scrollbar == null ? void 0 : scrollbar.contains(element);
      if (isScrollbarWheel) handleWheelScroll(event, maxScrollPos);
    };
    document.addEventListener("wheel", handleWheel, { passive: false });
    return () => document.removeEventListener("wheel", handleWheel, { passive: false });
  }, [viewport, scrollbar, maxScrollPos, handleWheelScroll]);
  reactExports.useEffect(handleThumbPositionChange, [sizes, handleThumbPositionChange]);
  useResizeObserver(scrollbar, handleResize);
  useResizeObserver(context.content, handleResize);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollbarProvider,
    {
      scope: __scopeScrollArea,
      scrollbar,
      hasThumb,
      onThumbChange: useCallbackRef(onThumbChange),
      onThumbPointerUp: useCallbackRef(onThumbPointerUp),
      onThumbPositionChange: handleThumbPositionChange,
      onThumbPointerDown: useCallbackRef(onThumbPointerDown),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.div,
        {
          ...scrollbarProps,
          ref: composeRefs,
          style: { position: "absolute", ...scrollbarProps.style },
          onPointerDown: composeEventHandlers(props.onPointerDown, (event) => {
            const mainPointer = 0;
            if (event.button === mainPointer) {
              const element = event.target;
              element.setPointerCapture(event.pointerId);
              rectRef.current = scrollbar.getBoundingClientRect();
              prevWebkitUserSelectRef.current = document.body.style.webkitUserSelect;
              document.body.style.webkitUserSelect = "none";
              if (context.viewport) context.viewport.style.scrollBehavior = "auto";
              handleDragScroll(event);
            }
          }),
          onPointerMove: composeEventHandlers(props.onPointerMove, handleDragScroll),
          onPointerUp: composeEventHandlers(props.onPointerUp, (event) => {
            const element = event.target;
            if (element.hasPointerCapture(event.pointerId)) {
              element.releasePointerCapture(event.pointerId);
            }
            document.body.style.webkitUserSelect = prevWebkitUserSelectRef.current;
            if (context.viewport) context.viewport.style.scrollBehavior = "";
            rectRef.current = null;
          })
        }
      )
    }
  );
});
var THUMB_NAME = "ScrollAreaThumb";
var ScrollAreaThumb = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { forceMount, ...thumbProps } = props;
    const scrollbarContext = useScrollbarContext(THUMB_NAME, props.__scopeScrollArea);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || scrollbarContext.hasThumb, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaThumbImpl, { ref: forwardedRef, ...thumbProps }) });
  }
);
var ScrollAreaThumbImpl = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeScrollArea, style, ...thumbProps } = props;
    const scrollAreaContext = useScrollAreaContext(THUMB_NAME, __scopeScrollArea);
    const scrollbarContext = useScrollbarContext(THUMB_NAME, __scopeScrollArea);
    const { onThumbPositionChange } = scrollbarContext;
    const composedRef = useComposedRefs(
      forwardedRef,
      (node) => scrollbarContext.onThumbChange(node)
    );
    const removeUnlinkedScrollListenerRef = reactExports.useRef(void 0);
    const debounceScrollEnd = useDebounceCallback(() => {
      if (removeUnlinkedScrollListenerRef.current) {
        removeUnlinkedScrollListenerRef.current();
        removeUnlinkedScrollListenerRef.current = void 0;
      }
    }, 100);
    reactExports.useEffect(() => {
      const viewport = scrollAreaContext.viewport;
      if (viewport) {
        const handleScroll = () => {
          debounceScrollEnd();
          if (!removeUnlinkedScrollListenerRef.current) {
            const listener = addUnlinkedScrollListener(viewport, onThumbPositionChange);
            removeUnlinkedScrollListenerRef.current = listener;
            onThumbPositionChange();
          }
        };
        onThumbPositionChange();
        viewport.addEventListener("scroll", handleScroll);
        return () => viewport.removeEventListener("scroll", handleScroll);
      }
    }, [scrollAreaContext.viewport, debounceScrollEnd, onThumbPositionChange]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "data-state": scrollbarContext.hasThumb ? "visible" : "hidden",
        ...thumbProps,
        ref: composedRef,
        style: {
          width: "var(--radix-scroll-area-thumb-width)",
          height: "var(--radix-scroll-area-thumb-height)",
          ...style
        },
        onPointerDownCapture: composeEventHandlers(props.onPointerDownCapture, (event) => {
          const thumb = event.target;
          const thumbRect = thumb.getBoundingClientRect();
          const x = event.clientX - thumbRect.left;
          const y = event.clientY - thumbRect.top;
          scrollbarContext.onThumbPointerDown({ x, y });
        }),
        onPointerUp: composeEventHandlers(props.onPointerUp, scrollbarContext.onThumbPointerUp)
      }
    );
  }
);
ScrollAreaThumb.displayName = THUMB_NAME;
var CORNER_NAME = "ScrollAreaCorner";
var ScrollAreaCorner = reactExports.forwardRef(
  (props, forwardedRef) => {
    const context = useScrollAreaContext(CORNER_NAME, props.__scopeScrollArea);
    const hasBothScrollbarsVisible = Boolean(context.scrollbarX && context.scrollbarY);
    const hasCorner = context.type !== "scroll" && hasBothScrollbarsVisible;
    return hasCorner ? /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaCornerImpl, { ...props, ref: forwardedRef }) : null;
  }
);
ScrollAreaCorner.displayName = CORNER_NAME;
var ScrollAreaCornerImpl = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeScrollArea, ...cornerProps } = props;
  const context = useScrollAreaContext(CORNER_NAME, __scopeScrollArea);
  const [width, setWidth] = reactExports.useState(0);
  const [height, setHeight] = reactExports.useState(0);
  const hasSize = Boolean(width && height);
  useResizeObserver(context.scrollbarX, () => {
    var _a;
    const height2 = ((_a = context.scrollbarX) == null ? void 0 : _a.offsetHeight) || 0;
    context.onCornerHeightChange(height2);
    setHeight(height2);
  });
  useResizeObserver(context.scrollbarY, () => {
    var _a;
    const width2 = ((_a = context.scrollbarY) == null ? void 0 : _a.offsetWidth) || 0;
    context.onCornerWidthChange(width2);
    setWidth(width2);
  });
  return hasSize ? /* @__PURE__ */ jsxRuntimeExports.jsx(
    Primitive.div,
    {
      ...cornerProps,
      ref: forwardedRef,
      style: {
        width,
        height,
        position: "absolute",
        right: context.dir === "ltr" ? 0 : void 0,
        left: context.dir === "rtl" ? 0 : void 0,
        bottom: 0,
        ...props.style
      }
    }
  ) : null;
});
function toInt(value) {
  return value ? parseInt(value, 10) : 0;
}
function getThumbRatio(viewportSize, contentSize) {
  const ratio = viewportSize / contentSize;
  return isNaN(ratio) ? 0 : ratio;
}
function getThumbSize(sizes) {
  const ratio = getThumbRatio(sizes.viewport, sizes.content);
  const scrollbarPadding = sizes.scrollbar.paddingStart + sizes.scrollbar.paddingEnd;
  const thumbSize = (sizes.scrollbar.size - scrollbarPadding) * ratio;
  return Math.max(thumbSize, 18);
}
function getScrollPositionFromPointer(pointerPos, pointerOffset, sizes, dir = "ltr") {
  const thumbSizePx = getThumbSize(sizes);
  const thumbCenter = thumbSizePx / 2;
  const offset = pointerOffset || thumbCenter;
  const thumbOffsetFromEnd = thumbSizePx - offset;
  const minPointerPos = sizes.scrollbar.paddingStart + offset;
  const maxPointerPos = sizes.scrollbar.size - sizes.scrollbar.paddingEnd - thumbOffsetFromEnd;
  const maxScrollPos = sizes.content - sizes.viewport;
  const scrollRange = dir === "ltr" ? [0, maxScrollPos] : [maxScrollPos * -1, 0];
  const interpolate = linearScale([minPointerPos, maxPointerPos], scrollRange);
  return interpolate(pointerPos);
}
function getThumbOffsetFromScroll(scrollPos, sizes, dir = "ltr") {
  const thumbSizePx = getThumbSize(sizes);
  const scrollbarPadding = sizes.scrollbar.paddingStart + sizes.scrollbar.paddingEnd;
  const scrollbar = sizes.scrollbar.size - scrollbarPadding;
  const maxScrollPos = sizes.content - sizes.viewport;
  const maxThumbPos = scrollbar - thumbSizePx;
  const scrollClampRange = dir === "ltr" ? [0, maxScrollPos] : [maxScrollPos * -1, 0];
  const scrollWithoutMomentum = clamp(scrollPos, scrollClampRange);
  const interpolate = linearScale([0, maxScrollPos], [0, maxThumbPos]);
  return interpolate(scrollWithoutMomentum);
}
function linearScale(input, output) {
  return (value) => {
    if (input[0] === input[1] || output[0] === output[1]) return output[0];
    const ratio = (output[1] - output[0]) / (input[1] - input[0]);
    return output[0] + ratio * (value - input[0]);
  };
}
function isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos) {
  return scrollPos > 0 && scrollPos < maxScrollPos;
}
var addUnlinkedScrollListener = (node, handler = () => {
}) => {
  let prevPosition = { left: node.scrollLeft, top: node.scrollTop };
  let rAF = 0;
  (function loop() {
    const position = { left: node.scrollLeft, top: node.scrollTop };
    const isHorizontalScroll = prevPosition.left !== position.left;
    const isVerticalScroll = prevPosition.top !== position.top;
    if (isHorizontalScroll || isVerticalScroll) handler();
    prevPosition = position;
    rAF = window.requestAnimationFrame(loop);
  })();
  return () => window.cancelAnimationFrame(rAF);
};
function useDebounceCallback(callback, delay) {
  const handleCallback = useCallbackRef(callback);
  const debounceTimerRef = reactExports.useRef(0);
  reactExports.useEffect(() => () => window.clearTimeout(debounceTimerRef.current), []);
  return reactExports.useCallback(() => {
    window.clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = window.setTimeout(handleCallback, delay);
  }, [handleCallback, delay]);
}
function useResizeObserver(element, onResize) {
  const handleResize = useCallbackRef(onResize);
  useLayoutEffect2(() => {
    let rAF = 0;
    if (element) {
      const resizeObserver = new ResizeObserver(() => {
        cancelAnimationFrame(rAF);
        rAF = window.requestAnimationFrame(handleResize);
      });
      resizeObserver.observe(element);
      return () => {
        window.cancelAnimationFrame(rAF);
        resizeObserver.unobserve(element);
      };
    }
  }, [element, handleResize]);
}
var Root = ScrollArea$1;
var Viewport = ScrollAreaViewport;
var Corner = ScrollAreaCorner;
function ScrollArea({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Root,
    {
      "data-slot": "scroll-area",
      className: cn("relative", className),
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Viewport,
          {
            "data-slot": "scroll-area-viewport",
            className: "focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1",
            children
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollBar, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Corner, {})
      ]
    }
  );
}
function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollAreaScrollbar,
    {
      "data-slot": "scroll-area-scrollbar",
      orientation,
      className: cn(
        "flex touch-none p-px transition-colors select-none",
        orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent",
        orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        ScrollAreaThumb,
        {
          "data-slot": "scroll-area-thumb",
          className: "bg-border relative flex-1 rounded-full"
        }
      )
    }
  );
}
const TYPE_ICON = {
  subscriptionExpiry: "⚡",
  subscriptionRenewed: "🔋",
  listingArchived: "📦",
  listingDeletionWarning: "⚠️",
  adminAnnouncement: "📢",
  lowFuelWarning: "⛽",
  paymentFailed: "❌",
  subscriptionCancelled: "🚫",
  refuelSuccess: "⚡"
};
const TYPE_BORDER = {
  subscriptionExpiry: "border-l-accent",
  subscriptionRenewed: "border-l-primary",
  listingArchived: "border-l-muted-foreground",
  listingDeletionWarning: "border-l-destructive",
  adminAnnouncement: "border-l-accent",
  lowFuelWarning: "border-l-destructive",
  paymentFailed: "border-l-destructive",
  subscriptionCancelled: "border-l-destructive",
  refuelSuccess: "border-l-primary"
};
const TYPE_UNREAD_BG = {
  subscriptionExpiry: "bg-accent/5",
  subscriptionRenewed: "bg-primary/5",
  listingArchived: "bg-secondary/30",
  listingDeletionWarning: "bg-destructive/5",
  adminAnnouncement: "bg-accent/5",
  lowFuelWarning: "bg-destructive/5",
  paymentFailed: "bg-destructive/5",
  subscriptionCancelled: "bg-destructive/5",
  refuelSuccess: "bg-primary/5"
};
function formatRelativeTime(createdAt) {
  const ms = createdAt > BigInt(1e15) ? Number(createdAt / BigInt(1e6)) : Number(createdAt);
  const diff = Date.now() - ms;
  if (diff < 6e4) return "just now";
  if (diff < 36e5) return `${Math.floor(diff / 6e4)} min ago`;
  if (diff < 864e5)
    return `${Math.floor(diff / 36e5)} hour${Math.floor(diff / 36e5) !== 1 ? "s" : ""} ago`;
  if (diff < 6048e5)
    return `${Math.floor(diff / 864e5)} day${Math.floor(diff / 864e5) !== 1 ? "s" : ""} ago`;
  return `${Math.floor(diff / 6048e5)} week${Math.floor(diff / 6048e5) !== 1 ? "s" : ""} ago`;
}
function NotificationRow({
  notification,
  onMarkRead
}) {
  const icon = TYPE_ICON[notification.notificationType];
  const borderColor = TYPE_BORDER[notification.notificationType];
  const unreadBg = TYPE_UNREAD_BG[notification.notificationType];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.button,
    {
      layout: true,
      initial: { opacity: 0, x: -12 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 12 },
      transition: { duration: 0.25 },
      type: "button",
      onClick: () => !notification.isRead && onMarkRead(notification.id),
      className: `w-full text-left px-4 py-3 border-l-2 ${borderColor} rounded-r transition-smooth hover:bg-secondary/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${notification.isRead ? "bg-card/30 opacity-60" : unreadBg}`,
      "data-ocid": `notification-row-${String(notification.id)}`,
      "aria-label": `${notification.isRead ? "Read" : "Unread"}: ${notification.title}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg shrink-0 mt-0.5", "aria-hidden": "true", children: icon }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 mb-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: `font-display text-xs font-bold tracking-wide truncate ${notification.isRead ? "text-muted-foreground" : "text-foreground text-glow-blue"}`,
                children: notification.title
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-muted-foreground shrink-0 tabular-nums", children: formatRelativeTime(notification.createdAt) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-xs text-muted-foreground line-clamp-2 leading-relaxed", children: notification.message })
        ] }),
        !notification.isRead && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "shrink-0 mt-1.5 w-2 h-2 rounded-full bg-primary glow-blue-sm",
            "aria-hidden": "true"
          }
        )
      ] })
    }
  );
}
function NotificationSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2 px-1", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 p-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-6 rounded bg-primary/10 shrink-0" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-3/4 bg-primary/10 rounded" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-full bg-muted/30 rounded" })
    ] })
  ] }, i)) });
}
function NotificationCenter({
  notifications,
  unreadCount,
  onMarkRead,
  onMarkAllRead,
  isLoading = false
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-xl bg-card/60 neon-border-blue overflow-hidden",
      "data-ocid": "notification-center",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-b border-border/60", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-sm font-bold text-primary text-glow-blue tracking-wide uppercase", children: "Notifications" }),
            unreadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-primary/20 neon-border-blue font-mono text-[10px] font-bold text-primary text-glow-blue", children: unreadCount })
          ] }),
          unreadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: onMarkAllRead,
              className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary hover:bg-primary/10 transition-smooth h-7 px-2",
              "data-ocid": "mark-all-read-btn",
              children: "Mark all read"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "max-h-[360px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 flex flex-col gap-1", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(NotificationSkeleton, {}) : notifications.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center justify-center py-12 gap-3",
            "data-ocid": "notifications-empty",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl opacity-40", "aria-hidden": "true", children: "🔔" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xs text-muted-foreground tracking-widest uppercase", children: "No notifications" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-xs text-muted-foreground/60 text-center max-w-[200px]", children: "Account and subscription updates will appear here." })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { initial: false, children: notifications.map((notification) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          NotificationRow,
          {
            notification,
            onMarkRead
          },
          String(notification.id)
        )) }) }) })
      ]
    }
  );
}
function AvatarDisplay({
  avatarUrl,
  displayName,
  username,
  onAvatarChange
}) {
  const fileInputRef = reactExports.useRef(null);
  const initials = (displayName || username || "U").split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  const handleFileChange = (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      ue.error("Please select an image file");
      return;
    }
    const url = URL.createObjectURL(file);
    onAvatarChange(url);
    ue.success("Profile picture updated");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => {
          var _a;
          return (_a = fileInputRef.current) == null ? void 0 : _a.click();
        },
        className: "relative w-24 h-24 rounded-full overflow-hidden neon-border-blue glow-blue-sm transition-smooth hover:glow-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        "aria-label": "Change profile picture",
        "data-ocid": "avatar-upload-btn",
        children: [
          avatarUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: avatarUrl,
              alt: "Profile",
              className: "w-full h-full object-cover"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center bg-primary/10 font-display text-2xl font-black text-primary text-glow-blue", children: initials }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 group-hover:opacity-100 transition-smooth", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "w-6 h-6 text-primary" }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        ref: fileInputRef,
        type: "file",
        accept: "image/*",
        className: "sr-only",
        tabIndex: -1,
        onChange: handleFileChange
      }
    )
  ] });
}
function TierBadge({ tierName }) {
  const name = tierName.toUpperCase();
  const isLord = name.includes("LORD");
  const isTraveler = name.includes("TRAVELER");
  const cls = isLord ? "neon-border-yellow text-accent text-glow-yellow bg-accent/10" : isTraveler ? "neon-border-blue text-primary text-glow-blue bg-primary/10" : "border border-border text-muted-foreground bg-secondary/20";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `font-display text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded ${cls}`,
      children: tierName
    }
  );
}
function FacebookIntegrationSection() {
  const { data: savedCreds, isLoading: credsLoading } = useGetMyFbCredentials();
  const saveCreds = useSaveFbCredentials();
  const [appId, setAppId] = reactExports.useState("");
  const [accessToken, setAccessToken] = reactExports.useState("");
  const [showToken, setShowToken] = reactExports.useState(false);
  const [showListings, setShowListings] = reactExports.useState(false);
  const isConnected = !!((savedCreds == null ? void 0 : savedCreds.appId) && (savedCreds == null ? void 0 : savedCreds.accessToken));
  reactExports.useEffect(() => {
    if (savedCreds) {
      setAppId(savedCreds.appId ?? "");
      setAccessToken(savedCreds.accessToken ?? "");
    }
  }, [savedCreds]);
  const handleSave = async () => {
    if (!appId.trim() || !accessToken.trim()) {
      ue.error("Both App ID and Access Token are required");
      return;
    }
    try {
      await saveCreds.mutateAsync({
        appId: appId.trim(),
        accessToken: accessToken.trim()
      });
      ue.success("Facebook credentials saved");
    } catch (err) {
      ue.error(
        err instanceof Error ? err.message : "Failed to save credentials"
      );
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.section,
    {
      className: "rounded-xl bg-card/60 overflow-hidden",
      style: {
        border: "1px solid rgba(24,119,242,0.4)",
        boxShadow: "0 0 12px rgba(24,119,242,0.15)"
      },
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.4, delay: 0.25 },
      "data-ocid": "profile-fb-section",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-4 border-b border-border/60 flex items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Facebook, { className: "w-4 h-4 text-[#1877F2]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "h2",
              {
                className: "font-display text-sm font-bold tracking-wide uppercase",
                style: { color: "#1877F2" },
                children: "Facebook Marketplace Integration"
              }
            )
          ] }),
          credsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-24 bg-primary/10 rounded-full" }) : isConnected ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Badge,
            {
              className: "flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full",
              "data-ocid": "fb-status-connected",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3 h-3" }),
                "Connected"
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Badge,
            {
              className: "flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider bg-muted text-muted-foreground border border-border px-2 py-0.5 rounded-full",
              "data-ocid": "fb-status-not-configured",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3 h-3" }),
                "Not Configured"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-sm text-muted-foreground leading-relaxed", children: "Connect your Facebook account to import your own listings via the official API. Only your own listings will be accessible." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-primary/5 border border-primary/20 px-4 py-3 flex gap-2.5 items-start", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Facebook, { className: "w-3.5 h-3.5 text-[#1877F2] mt-0.5 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[11px] text-muted-foreground leading-relaxed", children: [
              "You can get your App ID and Access Token from the",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "a",
                {
                  href: "https://developers.facebook.com",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "text-[#1877F2] underline underline-offset-2 hover:opacity-80 transition-smooth",
                  children: "Facebook Developer Console"
                }
              ),
              ". Only your own listings will be accessible via the Graph API."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "fb-app-id",
                className: "flex items-center gap-2 font-mono text-xs text-muted-foreground uppercase tracking-wider",
                children: "Facebook App ID"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "fb-app-id",
                value: appId,
                onChange: (e) => setAppId(e.target.value),
                placeholder: "Enter your Facebook App ID",
                className: "bg-input/30 border-input font-mono text-sm focus:glow-blue-sm transition-smooth",
                style: { borderColor: "rgba(24,119,242,0.35)" },
                "data-ocid": "fb-app-id-input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "fb-access-token",
                className: "flex items-center gap-2 font-mono text-xs text-muted-foreground uppercase tracking-wider",
                children: "Access Token"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "fb-access-token",
                  type: showToken ? "text" : "password",
                  value: accessToken,
                  onChange: (e) => setAccessToken(e.target.value),
                  placeholder: "Paste your access token",
                  className: "bg-input/30 border-input font-mono text-sm pr-10 focus:glow-blue-sm transition-smooth",
                  style: { borderColor: "rgba(24,119,242,0.35)" },
                  "data-ocid": "fb-access-token-input"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setShowToken((v) => !v),
                  className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth",
                  "aria-label": showToken ? "Hide token" : "Reveal token",
                  "data-ocid": "fb-toggle-token-visibility",
                  children: showToken ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-4 h-4" })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: handleSave,
              disabled: saveCreds.isPending,
              className: "w-full sm:w-auto font-display text-xs tracking-widest uppercase transition-smooth",
              style: { background: "#1877F2", color: "#fff" },
              "data-ocid": "fb-save-credentials-btn",
              children: saveCreds.isPending ? "Saving..." : "Save Facebook Credentials"
            }
          ),
          isConnected && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-2 space-y-3 border-t border-border/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                onClick: () => setShowListings((v) => !v),
                className: "w-full flex items-center justify-between gap-2 font-display text-xs tracking-widest uppercase transition-smooth",
                style: { borderColor: "rgba(24,119,242,0.5)", color: "#1877F2" },
                "data-ocid": "fb-import-listings-btn",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3.5 h-3.5" }),
                    "Import My Facebook Listings"
                  ] }),
                  showListings ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-3.5 h-3.5" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: showListings && /* @__PURE__ */ jsxRuntimeExports.jsx(FbListingsPanel, {}) })
          ] })
        ] })
      ]
    }
  );
}
function FbListingsPanel() {
  const { data: listings = [], isLoading, isError } = useGetFbListings();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, height: 0 },
      animate: { opacity: 1, height: "auto" },
      exit: { opacity: 0, height: 0 },
      transition: { duration: 0.25 },
      className: "overflow-hidden",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-border/60 bg-background/40 overflow-hidden", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 space-y-2", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 w-full bg-primary/5 rounded" }, i)) }) : isError ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-8 h-8 text-destructive mx-auto mb-2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground", children: "Could not fetch listings. Check your credentials and try again." })
      ] }) : listings.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Facebook, { className: "w-8 h-8 text-[#1877F2]/50 mx-auto mb-2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground", children: "No listings found. Make sure your access token has the correct permissions." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        "ul",
        {
          className: "divide-y divide-border/40",
          "data-ocid": "fb-listings-list",
          children: listings.map((listing) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "li",
            {
              className: "flex items-center gap-3 px-4 py-3 hover:bg-primary/5 transition-smooth",
              "data-ocid": `fb-listing-item-${listing.id}`,
              children: [
                listing.imageUrls[0] ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: listing.imageUrls[0],
                    alt: listing.title,
                    className: "w-10 h-10 rounded object-cover shrink-0 border border-border/40"
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded bg-muted/30 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Facebook, { className: "w-4 h-4 text-[#1877F2]/50" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-sm text-foreground truncate", children: listing.title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-0.5", children: [
                    listing.price && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[11px] text-accent", children: listing.price }),
                    listing.category && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-muted-foreground/60 truncate", children: listing.category })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Link,
                  {
                    to: "/import",
                    className: "shrink-0",
                    "data-ocid": `fb-listing-import-${listing.id}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        size: "sm",
                        variant: "outline",
                        className: "font-display text-[10px] tracking-widest uppercase transition-smooth",
                        style: {
                          borderColor: "rgba(24,119,242,0.4)",
                          color: "#1877F2"
                        },
                        children: "Import"
                      }
                    )
                  }
                )
              ]
            },
            listing.id
          ))
        }
      ) })
    }
  );
}
function AccountInfoCard({
  email,
  phone,
  tierName,
  daysRemaining,
  memberSince
}) {
  const memberSinceStr = memberSince ? (() => {
    const ms = memberSince > BigInt(1e15) ? Number(memberSince / BigInt(1e6)) : Number(memberSince);
    return new Date(ms).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  })() : null;
  const subscriptionLabel = daysRemaining !== null && daysRemaining > 0 ? `${tierName} — ${daysRemaining} day${daysRemaining !== 1 ? "s" : ""} remaining` : daysRemaining === 0 ? `${tierName} — EXPIRED` : tierName;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.section,
    {
      className: "rounded-xl bg-card/60 neon-border-blue overflow-hidden",
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.4, delay: 0.05 },
      "data-ocid": "profile-account-info-section",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-3 border-b border-border/60", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-sm font-bold text-primary text-glow-blue tracking-wide uppercase", children: "Account Info" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-primary/5 border border-primary/20 px-4 py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5", children: "Membership" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: `font-display text-sm font-bold tracking-wide ${daysRemaining === 0 ? "text-destructive" : daysRemaining !== null && daysRemaining <= 7 ? "text-accent text-glow-yellow" : "text-primary text-glow-blue"}`,
                "data-ocid": "account-subscription-label",
                children: subscriptionLabel
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2.5", children: [
            email && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-3.5 h-3.5 text-muted-foreground shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-foreground truncate", children: email })
            ] }),
            phone && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "w-3.5 h-3.5 text-muted-foreground shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-foreground", children: phone })
            ] }),
            memberSinceStr && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-3.5 h-3.5 text-muted-foreground shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xs text-muted-foreground", children: [
                "Member since ",
                memberSinceStr
              ] })
            ] })
          ] })
        ] })
      ]
    }
  );
}
function RoleBadge({ role }) {
  const isAdmin = role.toLowerCase() === "admin";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `font-mono text-[10px] tracking-widest uppercase px-2 py-0.5 rounded ${isAdmin ? "neon-border-yellow text-accent text-glow-yellow bg-accent/10" : "border border-border text-muted-foreground"}`,
      children: isAdmin ? "⚡ Admin" : role
    }
  );
}
function ProfilePage() {
  const { isAuthenticated, isInitializing } = useAuth();
  const {
    profile,
    isLoading: profileLoading,
    username,
    displayName: savedDisplayName,
    phoneNumber: savedPhoneNumber,
    avatarUrl: savedAvatarUrl,
    updateMyProfile,
    isUpdatingProfile,
    setUsername,
    isSaving
  } = useProfile();
  const { data: subscription } = useGetMySubscription();
  const { data: tiers = [] } = useGetTiers();
  const { data: gasWallet } = useGetMyGasWallet();
  const portalSession = useCreateStripePortalSession();
  const {
    notifications,
    unreadCount,
    markRead,
    markAllRead,
    isLoading: notifLoading
  } = useNotifications();
  const exportManualBackup = useExportManualBackup();
  const [displayName, setDisplayName] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [phoneNumber, setPhoneNumber] = reactExports.useState("");
  const [newUsername, setNewUsername] = reactExports.useState("");
  const [localAvatarUrl, setLocalAvatarUrl] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (profile) {
      setEmail(profile.email ?? "");
      setNewUsername(profile.username ?? "");
    }
    if (savedDisplayName) setDisplayName(savedDisplayName);
    if (savedPhoneNumber) setPhoneNumber(savedPhoneNumber);
  }, [profile, savedDisplayName, savedPhoneNumber, savedAvatarUrl]);
  const currentTierId = subscription ? Number(subscription.tier) : 0;
  const tierConfig = tiers.find((t) => Number(t.tierId) === currentTierId);
  const tierName = (tierConfig == null ? void 0 : tierConfig.name) ?? (currentTierId === 0 ? "Free" : `Tier ${currentTierId}`);
  const expiryRaw = subscription == null ? void 0 : subscription.expirationDate;
  const expiryBigint = expiryRaw ? BigInt(Math.round(Number(expiryRaw))) : null;
  gasWallet ? Number(gasWallet.gasBalance) : 0;
  const daysRemaining = expiryRaw ? (() => {
    const expiryMs = Number(expiryRaw) > 1e15 ? Number(expiryRaw) / 1e6 : Number(expiryRaw);
    return Math.max(0, Math.floor((expiryMs - Date.now()) / 864e5));
  })() : null;
  if (isInitializing || profileLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center min-h-[60vh] gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 w-24 rounded-full bg-primary/10" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-40 bg-primary/10 rounded" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-24 bg-muted/20 rounded" })
    ] });
  }
  if (!isInitializing && !isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/" });
  }
  const handleSaveProfile = async () => {
    const args = {};
    if (displayName !== (savedDisplayName ?? ""))
      args.displayName = displayName;
    if (phoneNumber !== (savedPhoneNumber ?? ""))
      args.phoneNumber = phoneNumber;
    try {
      if (Object.keys(args).length > 0) {
        await updateMyProfile(args);
      }
      if (newUsername && newUsername !== (profile == null ? void 0 : profile.username)) {
        await setUsername(newUsername);
      }
      ue.success("Profile updated successfully");
    } catch (err) {
      ue.error(
        err instanceof Error ? err.message : "Failed to update profile"
      );
    }
  };
  const handleAvatarChange = (url) => {
    setLocalAvatarUrl(url);
    updateMyProfile({ displayName, phoneNumber }).catch(() => null);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto px-4 py-8 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to: "/dashboard",
        className: "inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-primary transition-smooth",
        "data-ocid": "profile-back-link",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-3.5 h-3.5" }),
          "Back to Dashboard"
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.section,
      {
        className: "rounded-xl bg-card/60 neon-border-blue overflow-hidden",
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4 },
        "data-ocid": "profile-header-section",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "retro-grid p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            AvatarDisplay,
            {
              avatarUrl: localAvatarUrl,
              displayName: savedDisplayName,
              username,
              onAvatarChange: handleAvatarChange
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center sm:items-start gap-1.5 min-w-0", children: [
            savedDisplayName ? /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-black text-foreground text-glow-blue truncate max-w-full", children: savedDisplayName }) : /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-black text-primary text-glow-blue truncate max-w-full", children: (profile == null ? void 0 : profile.username) ?? "Your Profile" }),
            username && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-sm text-muted-foreground", children: [
              "@",
              username
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 mt-1", children: [
              (profile == null ? void 0 : profile.role) && /* @__PURE__ */ jsxRuntimeExports.jsx(RoleBadge, { role: profile.role }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TierBadge, { tierName })
            ] }),
            daysRemaining !== null && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: `font-mono text-xs mt-1 ${daysRemaining === 0 ? "text-destructive" : daysRemaining <= 7 ? "text-accent" : "text-primary"}`,
                "data-ocid": "profile-tier-days-label",
                children: daysRemaining === 0 ? "⚠ Expired — Refuel Now" : `⚡ ${tierName} — ${daysRemaining} day${daysRemaining !== 1 ? "s" : ""} remaining`
              }
            ),
            (profile == null ? void 0 : profile.email) && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground/70 mt-1", children: profile.email })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AccountInfoCard,
      {
        email: (profile == null ? void 0 : profile.email) ?? null,
        phone: savedPhoneNumber ?? null,
        tierName,
        daysRemaining,
        memberSince: (profile == null ? void 0 : profile.createdAt) ?? null
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.section,
      {
        className: "rounded-xl bg-card/60 neon-border-blue overflow-hidden",
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, delay: 0.1 },
        "data-ocid": "profile-subscription-section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 py-4 border-b border-border/60", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-sm font-bold text-primary text-glow-blue tracking-wide uppercase", children: "Subscription & Gas" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            DeLoreanTierDisplay,
            {
              tierName,
              subscriptionExpiry: expiryBigint
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 pb-5 flex flex-col sm:flex-row gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/wallet", className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                className: "w-full font-display text-xs tracking-widest uppercase neon-border-yellow text-accent hover:glow-yellow-sm transition-smooth",
                "data-ocid": "profile-refuel-btn",
                children: "⛽ Refuel Gas"
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/upgrade", className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "default",
                className: "w-full font-display text-xs tracking-widest uppercase bg-primary text-primary-foreground hover:bg-primary/90 glow-blue-sm transition-smooth",
                "data-ocid": "profile-upgrade-btn",
                children: "⚡ Upgrade Tier"
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 pb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              onClick: async () => {
                try {
                  await portalSession.mutateAsync();
                } catch (err) {
                  ue.error(
                    err instanceof Error ? err.message : "Failed to open billing portal"
                  );
                }
              },
              disabled: portalSession.isPending,
              className: "w-full font-display text-xs tracking-widest uppercase neon-border-blue text-primary hover:glow-blue-sm transition-smooth gap-2",
              "data-ocid": "profile-manage-billing-btn",
              children: [
                "🧾",
                " ",
                portalSession.isPending ? "Opening..." : "Manage Billing & Invoices"
              ]
            }
          ) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.section,
      {
        className: "rounded-xl bg-card/60 neon-border-blue overflow-hidden",
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, delay: 0.2 },
        "data-ocid": "profile-edit-section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 py-4 border-b border-border/60", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-sm font-bold text-primary text-glow-blue tracking-wide uppercase", children: "Edit Profile" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Label,
                {
                  htmlFor: "displayName",
                  className: "flex items-center gap-2 font-mono text-xs text-muted-foreground uppercase tracking-wider",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-3.5 h-3.5" }),
                    "Display Name"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "displayName",
                  value: displayName,
                  onChange: (e) => setDisplayName(e.target.value),
                  placeholder: "How you want to appear",
                  className: "bg-input/30 border-input neon-border-blue font-body text-sm focus:glow-blue-sm transition-smooth",
                  "data-ocid": "profile-display-name-input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Label,
                {
                  htmlFor: "username",
                  className: "flex items-center gap-2 font-mono text-xs text-muted-foreground uppercase tracking-wider",
                  children: "@Username"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "username",
                  value: newUsername,
                  onChange: (e) => setNewUsername(
                    e.target.value.toLowerCase().replace(/\s+/g, "_")
                  ),
                  placeholder: "unique_username",
                  className: "bg-input/30 border-input neon-border-blue font-mono text-sm focus:glow-blue-sm transition-smooth",
                  "data-ocid": "profile-username-input"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-muted-foreground/60", children: "Unique. Used for account upgrades and referrals." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Label,
                {
                  htmlFor: "email",
                  className: "flex items-center gap-2 font-mono text-xs text-muted-foreground uppercase tracking-wider",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-3.5 h-3.5" }),
                    "Email Address"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "email",
                  type: "email",
                  value: email,
                  onChange: (e) => setEmail(e.target.value),
                  placeholder: "your@email.com",
                  className: "bg-input/30 border-input neon-border-blue font-body text-sm focus:glow-blue-sm transition-smooth",
                  "data-ocid": "profile-email-input"
                }
              ),
              (profile == null ? void 0 : profile.emailVerified) && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-primary text-glow-blue", children: "✓ Email verified" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Label,
                {
                  htmlFor: "phoneNumber",
                  className: "flex items-center gap-2 font-mono text-xs text-muted-foreground uppercase tracking-wider",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "w-3.5 h-3.5" }),
                    "Phone Number",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-muted-foreground/50 normal-case tracking-normal", children: "(for SMS alerts)" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "phoneNumber",
                  type: "tel",
                  value: phoneNumber,
                  onChange: (e) => setPhoneNumber(e.target.value),
                  placeholder: "+1 (555) 000-0000",
                  className: "bg-input/30 border-input neon-border-blue font-body text-sm focus:glow-blue-sm transition-smooth",
                  "data-ocid": "profile-phone-input"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-muted-foreground/60", children: "SMS notifications coming soon. Add your number now to be ready." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: handleSaveProfile,
                disabled: isUpdatingProfile || isSaving,
                className: "w-full sm:w-auto font-display text-xs tracking-widest uppercase bg-primary text-primary-foreground hover:bg-primary/90 glow-blue-sm transition-smooth disabled:opacity-50",
                "data-ocid": "profile-save-btn",
                children: isUpdatingProfile || isSaving ? "Saving..." : "Save Changes"
              }
            ) })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FacebookIntegrationSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.section,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, delay: 0.3 },
        id: "notifications",
        "data-ocid": "profile-notifications-section",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          NotificationCenter,
          {
            notifications,
            unreadCount,
            onMarkRead: markRead,
            onMarkAllRead: markAllRead,
            isLoading: notifLoading
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.section,
      {
        className: "rounded-xl bg-card/60 neon-border-blue overflow-hidden",
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, delay: 0.35 },
        "data-ocid": "profile-backups-section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-4 border-b border-border/60 flex items-center justify-between gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-sm font-bold text-primary text-glow-blue tracking-wide uppercase", children: "💾 Backups" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                disabled: exportManualBackup.isPending,
                onClick: () => exportManualBackup.mutateAsync().then(() => ue.success("Export downloaded!")).catch(() => ue.error("Export failed.")),
                className: "font-display text-[10px] tracking-widest uppercase border-border/60 hover:border-primary/50 hover:text-primary transition-smooth h-7 px-2.5",
                "data-ocid": "manual-export-btn",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3 h-3 mr-1" }),
                  exportManualBackup.isPending ? "Exporting..." : "Export Listings (Free)"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BackupsSection, {}) })
        ]
      }
    )
  ] });
}
export {
  ProfilePage
};
