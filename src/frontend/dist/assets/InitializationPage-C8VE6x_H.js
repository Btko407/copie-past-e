import { c as createLucideIcon, u as useNavigate, k as useDevice, r as reactExports, j as jsxRuntimeExports, Z as Zap, g as CircleCheck, T as TriangleAlert } from "./index-wfeVo5SS.js";
import { D as Download } from "./download-Rr6bXV4_.js";
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
function buildBootLines(extensionInstalled) {
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
  if (extensionInstalled) {
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
function MobileBoot({ onProceed }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen bg-background flex flex-col items-center justify-center px-6 gap-8",
      "data-ocid": "initialization.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 retro-grid opacity-20 pointer-events-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 scanlines opacity-20 pointer-events-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 flex flex-col items-center gap-6 text-center max-w-sm w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-6 h-6 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-xl font-bold tracking-widest text-primary text-glow-blue", children: "COPIE PAST-E" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "w-full bg-card/90 backdrop-blur-sm neon-border-blue rounded-lg px-6 py-5 glow-blue-sm",
              "data-ocid": "initialization.terminal",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4 pb-3 border-b border-primary/20", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-green-400" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-green-400 tracking-widest uppercase font-bold", children: "MOBILE ACCESS INITIALIZED" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xs text-foreground/70 leading-relaxed", children: [
                  "> All core modules loaded.",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                  "> Running in mobile mode.",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                  "> System ready."
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: onProceed,
              className: "group w-full flex items-center justify-center gap-3 bg-primary/10 hover:bg-primary/20 border border-primary/40 hover:border-primary/70 text-primary rounded-lg px-6 py-4 font-display text-sm tracking-widest uppercase transition-smooth hover:glow-blue-sm",
              "data-ocid": "initialization.proceed_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-5 h-5 group-hover:translate-x-1 transition-transform" }),
                "PROCEED TO TERMINAL"
              ]
            }
          )
        ] })
      ]
    }
  );
}
function InitializationPage() {
  const navigate = useNavigate();
  const { isMobile } = useDevice();
  const [extensionInstalled, setExtensionInstalled] = reactExports.useState(false);
  const checkedRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    if (isMobile || checkedRef.current) return;
    checkedRef.current = true;
    try {
      if (window.__COPIE_PASTE_INSTALLED__ === true) {
        setExtensionInstalled(true);
        return;
      }
    } catch {
    }
    const t = setTimeout(() => {
      try {
        if (window.__COPIE_PASTE_INSTALLED__ === true) {
          setExtensionInstalled(true);
        }
      } catch {
      }
    }, 600);
    return () => clearTimeout(t);
  }, [isMobile]);
  const handleProceed = () => navigate({ to: "/dashboard" });
  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = "/copie-past-e.zip";
    a.download = "copie-past-e.zip";
    a.click();
  };
  if (isMobile) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(MobileBoot, { onProceed: handleProceed });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    DesktopBoot,
    {
      extensionInstalled,
      onProceed: handleProceed,
      onDownload: handleDownload
    }
  );
}
function DesktopBoot({
  extensionInstalled,
  onProceed,
  onDownload
}) {
  const bootLines = reactExports.useMemo(
    () => buildBootLines(extensionInstalled),
    [extensionInstalled]
  );
  const [visibleCount, setVisibleCount] = reactExports.useState(0);
  const [ready, setReady] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const timers = [];
    for (let i = 0; i < bootLines.length; i++) {
      const line = bootLines[i];
      timers.push(
        setTimeout(() => {
          setVisibleCount(i + 1);
          if (i === bootLines.length - 1) setReady(true);
        }, line.delay)
      );
    }
    const autoNav = setTimeout(() => {
      onProceed();
    }, 3200);
    timers.push(autoNav);
    return () => {
      for (const t of timers) clearTimeout(t);
    };
  }, [bootLines, onProceed]);
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
                !extensionInstalled && visibleCount >= bootLines.length && /* @__PURE__ */ jsxRuntimeExports.jsxs(
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
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-col sm:flex-row items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: onProceed,
                className: "group w-full sm:flex-1 flex items-center justify-center gap-3 bg-primary/10 hover:bg-primary/20 border border-primary/40 hover:border-primary/70 text-primary rounded-lg px-8 py-4 font-display text-sm tracking-widest uppercase transition-smooth hover:glow-blue-sm",
                "data-ocid": "initialization.proceed_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-5 h-5 group-hover:translate-x-1 transition-transform" }),
                  "PROCEED TO TERMINAL"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: onDownload,
                className: "group w-full sm:w-auto flex items-center justify-center gap-2 bg-accent/10 hover:bg-accent/20 border border-accent/40 hover:border-accent/70 text-accent rounded-lg px-6 py-4 font-display text-xs tracking-widest uppercase transition-smooth hover:glow-yellow-sm",
                "data-ocid": "initialization.download_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4" }),
                  "DOWNLOAD EXPANSION (.ZIP)"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground text-center mt-3", children: "Auto-redirect in 3 seconds — or click above to enter now" })
        ] })
      ]
    }
  );
}
export {
  InitializationPage
};
