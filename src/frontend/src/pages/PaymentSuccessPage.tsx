import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

export function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // Mark success banner for 24 hours
    const expiry = Date.now() + 24 * 60 * 60 * 1000;
    localStorage.setItem("refuel_banner_expiry", String(expiry));
    localStorage.setItem("refuel_banner_shown", "true");
  }, []);

  // Countdown + auto-redirect
  useEffect(() => {
    if (countdown <= 0) {
      void navigate({ to: "/dashboard" });
      return;
    }
    const id = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [countdown, navigate]);

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
          {/* Lightning icon */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative"
          >
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 20px oklch(0.65 0.22 262 / 0.4)",
                  "0 0 60px oklch(0.65 0.22 262 / 0.8)",
                  "0 0 20px oklch(0.65 0.22 262 / 0.4)",
                ],
              }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
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
          >
            <h1 className="font-display text-4xl sm:text-5xl font-black tracking-widest uppercase text-primary text-glow-blue">
              DeLorean Refueled!
            </h1>
            <p className="font-display text-lg font-bold tracking-widest uppercase text-accent text-glow-yellow">
              Subscription Time Added
            </p>
            <p className="font-mono text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
              Your subscription fuel has been added successfully. Your DeLorean
              is ready for another time jump.
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
              <div className="flex-1">
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
                  PAYMENT CONFIRMED
                </motion.p>
              </div>
              <div className="text-right">
                <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-muted-foreground mb-1">
                  DAYS ADDED
                </p>
                <p className="font-display text-2xl font-black tracking-widest text-primary text-glow-blue">
                  ✓
                </p>
              </div>
            </div>
          </motion.div>

          {/* Redirect notice */}
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
                initial={{ scale: 1.5, color: "oklch(0.65 0.22 262)" }}
                animate={{ scale: 1, color: "oklch(0.65 0.22 262)" }}
                className="font-bold text-primary"
              >
                {countdown}
              </motion.span>{" "}
              second{countdown !== 1 ? "s" : ""}...
            </p>
            <Button
              onClick={() => void navigate({ to: "/dashboard" })}
              className="font-display font-bold tracking-widest uppercase text-xs bg-primary text-primary-foreground hover:bg-primary/90 glow-blue-sm"
              data-ocid="payment-success-dashboard-btn"
            >
              ⚡ Go to Dashboard Now
            </Button>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
