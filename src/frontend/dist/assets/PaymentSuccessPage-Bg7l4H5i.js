import { u as useNavigate, r as reactExports, j as jsxRuntimeExports, d as Layout, m as motion, B as Button } from "./index-DkLW0GdO.js";
function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = reactExports.useState(3);
  reactExports.useEffect(() => {
    const expiry = Date.now() + 24 * 60 * 60 * 1e3;
    localStorage.setItem("refuel_banner_expiry", String(expiry));
    localStorage.setItem("refuel_banner_shown", "true");
  }, []);
  reactExports.useEffect(() => {
    if (countdown <= 0) {
      void navigate({ to: "/dashboard" });
      return;
    }
    const id = setTimeout(() => setCountdown((c) => c - 1), 1e3);
    return () => clearTimeout(id);
  }, [countdown, navigate]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-[80vh] flex flex-col items-center justify-center px-4 py-12",
      "data-ocid": "payment-success-page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 pointer-events-none overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 max-w-lg w-full flex flex-col items-center gap-8 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { scale: 0, rotate: -20 },
              animate: { scale: 1, rotate: 0 },
              transition: { type: "spring", stiffness: 300, damping: 20 },
              className: "relative",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  animate: {
                    boxShadow: [
                      "0 0 20px oklch(0.65 0.22 262 / 0.4)",
                      "0 0 60px oklch(0.65 0.22 262 / 0.8)",
                      "0 0 20px oklch(0.65 0.22 262 / 0.4)"
                    ]
                  },
                  transition: { duration: 1.5, repeat: Number.POSITIVE_INFINITY },
                  className: "w-28 h-28 rounded-full bg-primary/10 border-2 border-primary/40 flex items-center justify-center",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-6xl", children: "⚡" })
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.3, duration: 0.5 },
              className: "space-y-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-4xl sm:text-5xl font-black tracking-widest uppercase text-primary text-glow-blue", children: "DeLorean Refueled!" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-lg font-bold tracking-widest uppercase text-accent text-glow-yellow", children: "Subscription Time Added" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm text-muted-foreground mt-2 max-w-sm mx-auto", children: "Your subscription fuel has been added successfully. Your DeLorean is ready for another time jump." })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, scale: 0.9 },
              animate: { opacity: 1, scale: 1 },
              transition: { delay: 0.5, duration: 0.4 },
              className: "w-full rounded-xl bg-background border border-primary/30 overflow-hidden",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-foreground/5 border-b border-primary/20 px-5 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[9px] tracking-[0.3em] uppercase text-muted-foreground", children: "DELOREAN FUEL STATION — TRANSACTION COMPLETE" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-5 flex items-center gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[9px] tracking-[0.25em] uppercase text-muted-foreground mb-1", children: "STATUS" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      motion.p,
                      {
                        animate: { opacity: [1, 0.4, 1] },
                        transition: {
                          duration: 1.2,
                          repeat: Number.POSITIVE_INFINITY
                        },
                        className: "font-display text-xl font-black tracking-widest uppercase text-accent text-glow-yellow",
                        children: "PAYMENT CONFIRMED"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[9px] tracking-[0.25em] uppercase text-muted-foreground mb-1", children: "DAYS ADDED" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-2xl font-black tracking-widest text-primary text-glow-blue", children: "✓" })
                  ] })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              transition: { delay: 0.7 },
              className: "space-y-4",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xs text-muted-foreground", children: [
                  "Redirecting to your dashboard in",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    motion.span,
                    {
                      initial: { scale: 1.5, color: "oklch(0.65 0.22 262)" },
                      animate: { scale: 1, color: "oklch(0.65 0.22 262)" },
                      className: "font-bold text-primary",
                      children: countdown
                    },
                    countdown
                  ),
                  " ",
                  "second",
                  countdown !== 1 ? "s" : "",
                  "..."
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    onClick: () => void navigate({ to: "/dashboard" }),
                    className: "font-display font-bold tracking-widest uppercase text-xs bg-primary text-primary-foreground hover:bg-primary/90 glow-blue-sm",
                    "data-ocid": "payment-success-dashboard-btn",
                    children: "⚡ Go to Dashboard Now"
                  }
                )
              ]
            }
          )
        ] })
      ]
    }
  ) });
}
export {
  PaymentSuccessPage
};
