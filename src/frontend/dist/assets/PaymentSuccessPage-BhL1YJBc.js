import { u as useNavigate, b as useActor, d as useQueryClient, k as useAuth, r as reactExports, j as jsxRuntimeExports, p as Layout, m as motion, B as Button, f as createActor } from "./index-Usp6K9eu.js";
function PaymentSuccessPage() {
  const navigate = useNavigate();
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const { isAuthenticated, isInitializing, login } = useAuth();
  const sessionId = new URLSearchParams(window.location.search).get(
    "session_id"
  );
  const [state, setState] = reactExports.useState("verifying");
  const [errorMessage, setErrorMessage] = reactExports.useState("");
  const [successMessage, setSuccessMessage] = reactExports.useState("");
  const [countdown, setCountdown] = reactExports.useState(5);
  const hasVerified = reactExports.useRef(false);
  const runVerification = reactExports.useCallback(async () => {
    var _a;
    if (!sessionId) {
      setState("error");
      setErrorMessage(
        "No payment session found. If you completed a payment, please check your subscription in the Gas Wallet."
      );
      return;
    }
    if (!actor) return;
    setState("verifying");
    setErrorMessage("");
    try {
      const result = await ((_a = actor.verifyAndGrantPayment) == null ? void 0 : _a.call(actor, sessionId));
      if (!result) {
        setState("success");
        setSuccessMessage(
          "Payment received. Subscription days have been added."
        );
        void queryClient.invalidateQueries({ queryKey: ["myProfile"] });
        void queryClient.invalidateQueries({ queryKey: ["subscription"] });
        void queryClient.invalidateQueries({ queryKey: ["gasWallet"] });
        return;
      }
      if (result.__kind__ === "ok") {
        setState("success");
        setSuccessMessage(
          typeof result.ok === "string" && result.ok.length > 0 ? result.ok : "Payment verified. Subscription days have been added."
        );
        const expiry = Date.now() + 24 * 60 * 60 * 1e3;
        localStorage.setItem("refuel_banner_expiry", String(expiry));
        localStorage.setItem("refuel_banner_shown", "true");
        localStorage.setItem("showRefuelBanner", "true");
        void queryClient.invalidateQueries({ queryKey: ["myProfile"] });
        void queryClient.invalidateQueries({ queryKey: ["subscription"] });
        void queryClient.invalidateQueries({ queryKey: ["gasWallet"] });
      } else if (result.__kind__ === "err") {
        const errMsg = typeof result.err === "string" ? result.err : "Payment verification failed.";
        const isAlreadyProcessed = errMsg.toLowerCase().includes("already") || errMsg.includes("No pending payment");
        if (isAlreadyProcessed) {
          setState("already_processed");
          setErrorMessage(errMsg);
        } else {
          setState("error");
          setErrorMessage(errMsg);
        }
      } else {
        setState("success");
        setSuccessMessage(
          "Payment received. Subscription days have been added."
        );
        void queryClient.invalidateQueries({ queryKey: ["myProfile"] });
        void queryClient.invalidateQueries({ queryKey: ["subscription"] });
        void queryClient.invalidateQueries({ queryKey: ["gasWallet"] });
      }
    } catch (err) {
      setState("error");
      setErrorMessage(
        err instanceof Error ? err.message : "An unexpected error occurred during payment verification."
      );
    }
  }, [actor, sessionId, queryClient]);
  reactExports.useEffect(() => {
    if (!sessionId) {
      setState("error");
      setErrorMessage(
        "No payment session found. If you completed a payment, please check your subscription in the Gas Wallet."
      );
    }
  }, [sessionId]);
  reactExports.useEffect(() => {
    if (!sessionId) return;
    if (isInitializing || isFetching) return;
    if (!actor) return;
    if (!isAuthenticated) {
      setState("not_signed_in");
      return;
    }
    if (hasVerified.current) return;
    hasVerified.current = true;
    void runVerification();
  }, [
    sessionId,
    isInitializing,
    isFetching,
    actor,
    isAuthenticated,
    runVerification
  ]);
  reactExports.useEffect(() => {
    if (!isAuthenticated) return;
    if (!sessionId) return;
    if (state !== "not_signed_in") return;
    if (!actor || isFetching) return;
    hasVerified.current = false;
    void runVerification().then(() => {
      hasVerified.current = true;
    });
  }, [isAuthenticated, sessionId, state, actor, isFetching, runVerification]);
  reactExports.useEffect(() => {
    if (state !== "success") return;
    if (countdown <= 0) {
      void navigate({ to: "/dashboard" });
      return;
    }
    const id = setTimeout(() => setCountdown((c) => c - 1), 1e3);
    return () => clearTimeout(id);
  }, [state, countdown, navigate]);
  function handleRetry() {
    hasVerified.current = false;
    void runVerification();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-[80vh] flex flex-col items-center justify-center px-4 py-12",
      "data-ocid": "payment-success-page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 pointer-events-none overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 max-w-lg w-full flex flex-col items-center gap-8 text-center", children: [
          state === "verifying" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              className: "flex flex-col items-center gap-6",
              "data-ocid": "payment-verify-loading",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.div,
                  {
                    animate: { rotate: 360 },
                    transition: {
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear"
                    },
                    className: "w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-2xl font-black tracking-widest uppercase text-primary text-glow-blue", children: "Verifying Payment" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm text-muted-foreground", children: "Verifying your payment…" })
                ] })
              ]
            }
          ),
          state === "not_signed_in" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              className: "flex flex-col items-center gap-6",
              "data-ocid": "payment-not-signed-in",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-24 rounded-full bg-accent/10 border-2 border-accent/40 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-5xl", children: "🔐" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-black tracking-widest uppercase text-accent text-glow-yellow", children: "Almost There!" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm text-foreground font-medium", children: "Please sign in to confirm your payment." }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed", children: "Your payment was received by Stripe. Sign in with the same identity you used when purchasing to activate your plan." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    onClick: login,
                    className: "font-display font-bold tracking-widest uppercase text-xs bg-accent text-accent-foreground hover:bg-accent/90 glow-yellow-sm min-w-[220px]",
                    "data-ocid": "payment-not-signed-in-login-btn",
                    children: "🔑 Sign In to Activate"
                  }
                )
              ]
            }
          ),
          state === "success" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                initial: { scale: 0, rotate: -20 },
                animate: { scale: 1, rotate: 0 },
                transition: { type: "spring", stiffness: 300, damping: 20 },
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
                    transition: {
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY
                    },
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
                "data-ocid": "payment-success-heading",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-4xl sm:text-5xl font-black tracking-widest uppercase text-primary text-glow-blue", children: "DeLorean Refueled!" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-lg font-bold tracking-widest uppercase text-accent text-glow-yellow", children: "Subscription Time Added" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm text-muted-foreground mt-2 max-w-sm mx-auto", children: successMessage || "Your subscription fuel has been added successfully. Your DeLorean is ready for another time jump." })
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
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
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
                          children: "PAYMENT VERIFIED"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right shrink-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[9px] tracking-[0.25em] uppercase text-muted-foreground mb-1", children: "CONFIRMED" }),
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
                        initial: { scale: 1.5 },
                        animate: { scale: 1 },
                        className: "font-bold text-primary",
                        children: countdown
                      },
                      countdown
                    ),
                    " ",
                    "second",
                    countdown !== 1 ? "s" : "",
                    "…"
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
          ] }),
          state === "already_processed" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              className: "flex flex-col items-center gap-6",
              "data-ocid": "payment-already-processed",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-24 rounded-full bg-accent/10 border-2 border-accent/40 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-5xl", children: "✅" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-black tracking-widest uppercase text-accent text-glow-yellow", children: "Already Processed" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm text-foreground font-medium max-w-sm mx-auto", children: "This payment was already processed. Check your Gas Wallet to see your current subscription." }),
                  errorMessage && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground max-w-sm mx-auto", children: errorMessage })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    onClick: () => void navigate({ to: "/wallet" }),
                    className: "font-display font-bold tracking-widest uppercase text-xs bg-accent text-accent-foreground hover:bg-accent/90 glow-yellow-sm",
                    "data-ocid": "payment-already-processed-wallet-btn",
                    children: "⛽ Go to Gas Wallet"
                  }
                )
              ]
            }
          ),
          state === "error" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              className: "flex flex-col items-center gap-6",
              "data-ocid": "payment-verify-error",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-24 rounded-full bg-destructive/10 border-2 border-destructive/40 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-5xl", children: "⚠️" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-black tracking-widest uppercase text-destructive", children: "Verification Failed" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm text-muted-foreground max-w-sm mx-auto", children: errorMessage }),
                  sessionId && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground mt-3 max-w-sm mx-auto leading-relaxed", children: "If you were charged, contact support with your Stripe receipt — your days will be added manually." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 flex-wrap justify-center", children: [
                  sessionId && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      onClick: handleRetry,
                      className: "font-display font-bold tracking-widest uppercase text-xs bg-primary text-primary-foreground hover:bg-primary/90 glow-blue-sm",
                      "data-ocid": "payment-error-retry-btn",
                      children: "↺ Try Again"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "outline",
                      onClick: () => void navigate({ to: "/wallet" }),
                      className: "font-mono text-xs uppercase tracking-widest border-border/60",
                      "data-ocid": "payment-error-wallet-btn",
                      children: "⛽ Go to Gas Wallet"
                    }
                  )
                ] })
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
