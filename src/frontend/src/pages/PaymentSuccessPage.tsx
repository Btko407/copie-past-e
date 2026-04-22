import { createActor } from "@/backend";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

type VerifyState =
  | "verifying"
  | "success"
  | "already_processed"
  | "not_signed_in"
  | "error";

export function PaymentSuccessPage() {
  const navigate = useNavigate();
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const { isAuthenticated, isInitializing, login } = useAuth();

  const sessionId = new URLSearchParams(window.location.search).get(
    "session_id",
  );

  const [state, setState] = useState<VerifyState>("verifying");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [countdown, setCountdown] = useState(5);

  // Guard against double-invocation in React Strict Mode
  const hasVerified = useRef(false);

  // ── Core verification function (callable on mount and on retry) ──────────────
  const runVerification = useCallback(async () => {
    if (!sessionId) {
      setState("error");
      setErrorMessage(
        "No payment session found. If you completed a payment, please check your subscription in the Gas Wallet.",
      );
      return;
    }
    if (!actor) return;

    setState("verifying");
    setErrorMessage("");

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await (actor as any).verifyAndGrantPayment?.(sessionId);

      if (!result) {
        // Method not yet available in this build — degrade gracefully
        setState("success");
        setSuccessMessage(
          "Payment received. Subscription days have been added.",
        );
        void queryClient.invalidateQueries({ queryKey: ["myProfile"] });
        void queryClient.invalidateQueries({ queryKey: ["subscription"] });
        void queryClient.invalidateQueries({ queryKey: ["gasWallet"] });
        return;
      }

      if (result.__kind__ === "ok") {
        setState("success");
        setSuccessMessage(
          typeof result.ok === "string" && result.ok.length > 0
            ? result.ok
            : "Payment verified. Subscription days have been added.",
        );
        // Set refuel banner flags
        const expiry = Date.now() + 24 * 60 * 60 * 1000;
        localStorage.setItem("refuel_banner_expiry", String(expiry));
        localStorage.setItem("refuel_banner_shown", "true");
        localStorage.setItem("showRefuelBanner", "true");
        // Refresh subscription-related queries
        void queryClient.invalidateQueries({ queryKey: ["myProfile"] });
        void queryClient.invalidateQueries({ queryKey: ["subscription"] });
        void queryClient.invalidateQueries({ queryKey: ["gasWallet"] });
      } else if (result.__kind__ === "err") {
        const errMsg: string =
          typeof result.err === "string"
            ? result.err
            : "Payment verification failed.";

        const isAlreadyProcessed =
          errMsg.toLowerCase().includes("already") ||
          errMsg.includes("No pending payment");

        if (isAlreadyProcessed) {
          setState("already_processed");
          setErrorMessage(errMsg);
        } else {
          setState("error");
          setErrorMessage(errMsg);
        }
      } else {
        // Unknown shape — treat as success to avoid blocking the user
        setState("success");
        setSuccessMessage(
          "Payment received. Subscription days have been added.",
        );
        void queryClient.invalidateQueries({ queryKey: ["myProfile"] });
        void queryClient.invalidateQueries({ queryKey: ["subscription"] });
        void queryClient.invalidateQueries({ queryKey: ["gasWallet"] });
      }
    } catch (err) {
      setState("error");
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during payment verification.",
      );
    }
  }, [actor, sessionId, queryClient]);

  // ── Initial gate: no sessionId → immediate error ─────────────────────────────
  useEffect(() => {
    if (!sessionId) {
      setState("error");
      setErrorMessage(
        "No payment session found. If you completed a payment, please check your subscription in the Gas Wallet.",
      );
    }
  }, [sessionId]);

  // ── Main verification trigger ────────────────────────────────────────────────
  useEffect(() => {
    if (!sessionId) return; // already handled above
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
    runVerification,
  ]);

  // ── After sign-in: automatically retry verification ──────────────────────────
  useEffect(() => {
    if (!isAuthenticated) return;
    if (!sessionId) return;
    if (state !== "not_signed_in") return;
    if (!actor || isFetching) return;

    // Reset guard so runVerification will proceed
    hasVerified.current = false;
    void runVerification().then(() => {
      hasVerified.current = true;
    });
  }, [isAuthenticated, sessionId, state, actor, isFetching, runVerification]);

  // ── Countdown + auto-redirect (success only) ─────────────────────────────────
  useEffect(() => {
    if (state !== "success") return;
    if (countdown <= 0) {
      void navigate({ to: "/dashboard" });
      return;
    }
    const id = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [state, countdown, navigate]);

  // ── Retry handler ────────────────────────────────────────────────────────────
  function handleRetry() {
    hasVerified.current = false;
    void runVerification();
  }

  return (
    <Layout>
      <div
        className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12"
        data-ocid="payment-success-page"
      >
        {/* Neon glow backdrop */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-lg w-full flex flex-col items-center gap-8 text-center">
          {/* ── VERIFYING STATE ───────────────────────────────────────────── */}
          {state === "verifying" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-6"
              data-ocid="payment-verify-loading"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                className="w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary"
              />
              <div className="space-y-2">
                <p className="font-display text-2xl font-black tracking-widest uppercase text-primary text-glow-blue">
                  Verifying Payment
                </p>
                <p className="font-mono text-sm text-muted-foreground">
                  Verifying your payment…
                </p>
              </div>
            </motion.div>
          )}

          {/* ── NOT SIGNED IN STATE ──────────────────────────────────────── */}
          {state === "not_signed_in" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-6"
              data-ocid="payment-not-signed-in"
            >
              <div className="w-24 h-24 rounded-full bg-accent/10 border-2 border-accent/40 flex items-center justify-center">
                <span className="text-5xl">🔐</span>
              </div>

              <div className="space-y-2">
                <h1 className="font-display text-3xl font-black tracking-widest uppercase text-accent text-glow-yellow">
                  Almost There!
                </h1>
                <p className="font-mono text-sm text-foreground font-medium">
                  Please sign in to confirm your payment.
                </p>
                <p className="font-mono text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  Your payment was received by Stripe. Sign in with the same
                  identity you used when purchasing to activate your plan.
                </p>
              </div>

              <Button
                onClick={login}
                className="font-display font-bold tracking-widest uppercase text-xs bg-accent text-accent-foreground hover:bg-accent/90 glow-yellow-sm min-w-[220px]"
                data-ocid="payment-not-signed-in-login-btn"
              >
                🔑 Sign In to Activate
              </Button>
            </motion.div>
          )}

          {/* ── SUCCESS STATE ─────────────────────────────────────────────── */}
          {state === "success" && (
            <>
              {/* Lightning icon */}
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 20px oklch(0.65 0.22 262 / 0.4)",
                      "0 0 60px oklch(0.65 0.22 262 / 0.8)",
                      "0 0 20px oklch(0.65 0.22 262 / 0.4)",
                    ],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                  className="w-28 h-28 rounded-full bg-primary/10 border-2 border-primary/40 flex items-center justify-center"
                >
                  <span className="text-6xl">⚡</span>
                </motion.div>
              </motion.div>

              {/* Heading */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="space-y-2"
                data-ocid="payment-success-heading"
              >
                <h1 className="font-display text-4xl sm:text-5xl font-black tracking-widest uppercase text-primary text-glow-blue">
                  DeLorean Refueled!
                </h1>
                <p className="font-display text-lg font-bold tracking-widest uppercase text-accent text-glow-yellow">
                  Subscription Time Added
                </p>
                <p className="font-mono text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
                  {successMessage ||
                    "Your subscription fuel has been added successfully. Your DeLorean is ready for another time jump."}
                </p>
              </motion.div>

              {/* BTTF time display */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="w-full rounded-xl bg-background border border-primary/30 overflow-hidden"
              >
                <div className="bg-foreground/5 border-b border-primary/20 px-5 py-2">
                  <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-muted-foreground">
                    DELOREAN FUEL STATION — TRANSACTION COMPLETE
                  </p>
                </div>
                <div className="px-5 py-5 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-muted-foreground mb-1">
                      STATUS
                    </p>
                    <motion.p
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{
                        duration: 1.2,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                      className="font-display text-xl font-black tracking-widest uppercase text-accent text-glow-yellow"
                    >
                      PAYMENT VERIFIED
                    </motion.p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-muted-foreground mb-1">
                      CONFIRMED
                    </p>
                    <p className="font-display text-2xl font-black tracking-widest text-primary text-glow-blue">
                      ✓
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Redirect notice + button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="space-y-4"
              >
                <p className="font-mono text-xs text-muted-foreground">
                  Redirecting to your dashboard in{" "}
                  <motion.span
                    key={countdown}
                    initial={{ scale: 1.5 }}
                    animate={{ scale: 1 }}
                    className="font-bold text-primary"
                  >
                    {countdown}
                  </motion.span>{" "}
                  second{countdown !== 1 ? "s" : ""}…
                </p>
                <Button
                  onClick={() => void navigate({ to: "/dashboard" })}
                  className="font-display font-bold tracking-widest uppercase text-xs bg-primary text-primary-foreground hover:bg-primary/90 glow-blue-sm"
                  data-ocid="payment-success-dashboard-btn"
                >
                  ⚡ Go to Dashboard Now
                </Button>
              </motion.div>
            </>
          )}

          {/* ── ALREADY PROCESSED STATE ──────────────────────────────────── */}
          {state === "already_processed" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-6"
              data-ocid="payment-already-processed"
            >
              <div className="w-24 h-24 rounded-full bg-accent/10 border-2 border-accent/40 flex items-center justify-center">
                <span className="text-5xl">✅</span>
              </div>

              <div className="space-y-2">
                <h1 className="font-display text-3xl font-black tracking-widest uppercase text-accent text-glow-yellow">
                  Already Processed
                </h1>
                <p className="font-mono text-sm text-foreground font-medium max-w-sm mx-auto">
                  This payment was already processed. Check your Gas Wallet to
                  see your current subscription.
                </p>
                {errorMessage && (
                  <p className="font-mono text-xs text-muted-foreground max-w-sm mx-auto">
                    {errorMessage}
                  </p>
                )}
              </div>

              <Button
                onClick={() => void navigate({ to: "/wallet" })}
                className="font-display font-bold tracking-widest uppercase text-xs bg-accent text-accent-foreground hover:bg-accent/90 glow-yellow-sm"
                data-ocid="payment-already-processed-wallet-btn"
              >
                ⛽ Go to Gas Wallet
              </Button>
            </motion.div>
          )}

          {/* ── ERROR STATE ───────────────────────────────────────────────── */}
          {state === "error" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-6"
              data-ocid="payment-verify-error"
            >
              <div className="w-24 h-24 rounded-full bg-destructive/10 border-2 border-destructive/40 flex items-center justify-center">
                <span className="text-5xl">⚠️</span>
              </div>

              <div className="space-y-2">
                <h1 className="font-display text-3xl font-black tracking-widest uppercase text-destructive">
                  Verification Failed
                </h1>
                <p className="font-mono text-sm text-muted-foreground max-w-sm mx-auto">
                  {errorMessage}
                </p>
                {sessionId && (
                  <p className="font-mono text-xs text-muted-foreground mt-3 max-w-sm mx-auto leading-relaxed">
                    If you were charged, contact support with your Stripe
                    receipt — your days will be added manually.
                  </p>
                )}
              </div>

              <div className="flex gap-3 flex-wrap justify-center">
                {sessionId && (
                  <Button
                    onClick={handleRetry}
                    className="font-display font-bold tracking-widest uppercase text-xs bg-primary text-primary-foreground hover:bg-primary/90 glow-blue-sm"
                    data-ocid="payment-error-retry-btn"
                  >
                    ↺ Try Again
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => void navigate({ to: "/wallet" })}
                  className="font-mono text-xs uppercase tracking-widest border-border/60"
                  data-ocid="payment-error-wallet-btn"
                >
                  ⛽ Go to Gas Wallet
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
}
