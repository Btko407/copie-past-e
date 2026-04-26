import { c as createLucideIcon, u as useNavigate, r as reactExports, j as jsxRuntimeExports, Z as Zap, g as CircleCheck, T as TriangleAlert } from "./index-jL7ZpINP.js";
import { i as isMobile } from "./useExtension-KWkjRiqR.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
];
const ArrowRight = createLucideIcon("arrow-right", __iconNode);
function buildBootLines(extensionInstalled, mobile) {
  const lines = [
    {
      text: "> COPIE PAST-E CORE v1.3.0 — INITIALIZING...",
      type: "system",
      delay: 0
    },
    {
      text: "> LOADING PLATFORM CONFIGS... [6/6 PLATFORMS]",
      type: "info",
      delay: 350
    },
    { text: "> ICP CANISTER CONNECTION... OK", type: "success", delay: 700 },
    { text: "> USER PRINCIPAL VERIFIED... OK", type: "success", delay: 1e3 },
    {
      text: "> LOADING MASTER LISTING ENGINE... OK",
      type: "success",
      delay: 1300
    },
    {
      text: "> PLATFORM ADAPTERS: FACEBOOK, MERCARI, EBAY, POSHMARK, DEPOP, ETSY",
      type: "info",
      delay: 1600
    }
  ];
  if (mobile) {
    lines.push(
      {
        text: "> MOBILE DEVICE DETECTED — EXTENSION CHECK BYPASSED",
        type: "warning",
        delay: 1900
      },
      { text: "> ALL CORE MODULES READY.", type: "success", delay: 2200 },
      { text: "> SYSTEM READY.", type: "system", delay: 2500 }
    );
  } else if (extensionInstalled) {
    lines.push(
      {
        text: "> AUTOFILL EXTENSION LINK... DETECTED ✓",
        type: "success",
        delay: 1900
      },
      { text: "> ALL SYSTEMS NOMINAL.", type: "success", delay: 2200 },
      { text: "> SYSTEM READY.", type: "system", delay: 2500 }
    );
  } else {
    lines.push(
      {
        text: "⚠ AUTOFILL EXTENSION NOT DETECTED",
        type: "warning",
        delay: 1900
      },
      {
        text: "> CORE MODULES READY. EXTENSION OPTIONAL.",
        type: "info",
        delay: 2200
      },
      { text: "> SYSTEM READY.", type: "system", delay: 2500 }
    );
  }
  return lines;
}
const LINE_COLORS = {
  system: "text-primary",
  info: "text-foreground/80",
  success: "text-green-400",
  warning: "text-accent"
};
function InitializationPage() {
  const navigate = useNavigate();
  const mobile = isMobile();
  const [extensionInstalled, setExtensionInstalled] = reactExports.useState(false);
  const checkedRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    if (checkedRef.current) return;
    checkedRef.current = true;
    if (window.__COPIE_PASTE_INSTALLED__ === true) {
      setExtensionInstalled(true);
      return;
    }
    const t = setTimeout(() => {
      if (window.__COPIE_PASTE_INSTALLED__ === true) {
        setExtensionInstalled(true);
      }
    }, 600);
    return () => clearTimeout(t);
  }, []);
  const bootLines = buildBootLines(extensionInstalled, mobile);
  const [visibleCount, setVisibleCount] = reactExports.useState(0);
  const [ready, setReady] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const timers = [];
    for (let i = 0; i < bootLines.length; i++) {
      const line = bootLines[i];
      timers.push(
        setTimeout(() => {
          setVisibleCount(i + 1);
          if (i === bootLines.length - 1) {
            setReady(true);
          }
        }, line.delay)
      );
    }
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen bg-background flex flex-col items-center justify-center overflow-hidden",
      "data-ocid": "initialization.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 retro-grid opacity-25 pointer-events-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 scanlines opacity-25 pointer-events-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 pointer-events-none", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-primary/4 blur-[160px]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-accent/3 blur-[120px]" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 w-full max-w-2xl px-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3 h-3 rounded-full bg-destructive/80" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3 h-3 rounded-full bg-accent/80" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3 h-3 rounded-full bg-green-400/80" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-primary/20" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4 text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-sm text-primary tracking-widest", children: "COPIE PAST-E // SYSTEM BOOT" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-primary/20" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "bg-card/90 backdrop-blur-sm neon-border-blue rounded-lg overflow-hidden glow-blue-sm",
              "data-ocid": "initialization.terminal",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-primary/10 border-b border-primary/20 px-4 py-2.5 flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-primary tracking-widest uppercase", children: "SYSTEM INITIALIZATION SEQUENCE" }),
                  ready && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto flex items-center gap-1 text-green-400 font-mono text-xs", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3 h-3" }),
                    "READY"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 min-h-[280px] font-mono text-sm leading-7 space-y-0.5", children: [
                  bootLines.slice(0, visibleCount).map((line) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: `${LINE_COLORS[line.type]} flex items-start gap-2 animate-in fade-in duration-200`,
                      children: [
                        line.type === "warning" && /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-4 h-4 mt-0.5 shrink-0 text-accent" }),
                        line.type === "system" && line.text.includes("READY") && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 mt-0.5 shrink-0 text-green-400" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "break-words", children: line.text })
                      ]
                    },
                    line.text
                  )),
                  !ready && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "inline-block w-2 h-4 bg-primary/80 animate-pulse ml-1",
                      "aria-hidden": "true"
                    }
                  )
                ] }),
                !mobile && !extensionInstalled && visibleCount >= bootLines.length && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "border-t border-accent/30 bg-accent/5 px-4 py-2.5 flex items-center gap-2",
                    "data-ocid": "initialization.extension_warning",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-4 h-4 text-accent shrink-0" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs text-accent", children: [
                        "AUTOFILL EXTENSION NOT DETECTED — Visit",
                        " ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "a",
                          {
                            href: "/extension-setup",
                            className: "underline hover:text-accent/80 transition-colors",
                            "data-ocid": "initialization.setup_link",
                            children: "/extension-setup"
                          }
                        ),
                        " ",
                        "to install it"
                      ] })
                    ]
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-col items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: handleProceed,
                className: "group flex items-center gap-3 bg-primary/10 hover:bg-primary/20 border border-primary/40 hover:border-primary/70 text-primary rounded-lg px-8 py-4 font-display text-sm tracking-widest uppercase transition-smooth hover:glow-blue-sm",
                "data-ocid": "initialization.proceed_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-5 h-5 group-hover:translate-x-1 transition-transform" }),
                  "PROCEED TO MAIN DASHBOARD"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground text-center", children: "Auto-redirect in 3 seconds — or click above to enter now" })
          ] })
        ] })
      ]
    }
  );
}
export {
  InitializationPage
};
