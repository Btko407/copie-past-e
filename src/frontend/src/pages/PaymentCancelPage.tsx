import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";

export function PaymentCancelPage() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div
        className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12"
        data-ocid="payment-cancel-page"
      >
        {/* Subtle backdrop */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-accent/5 blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-md w-full flex flex-col items-center gap-7 text-center">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="w-24 h-24 rounded-full bg-muted/30 border border-border/40 flex items-center justify-center"
          >
            <span className="text-5xl">⛽</span>
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="space-y-2"
          >
            <h1 className="font-display text-3xl sm:text-4xl font-black tracking-widest uppercase text-foreground">
              Refuel Cancelled
            </h1>
            <p className="font-mono text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
              No charge was made. You can refuel anytime from your Gas Wallet.
            </p>
          </motion.div>

          {/* BTTF card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="w-full rounded-xl bg-card border border-border/40 px-5 py-4"
          >
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-2">
              DELOREAN FUEL STATION
            </p>
            <p className="font-display text-sm font-bold tracking-widest uppercase text-muted-foreground">
              Transaction Voided — No Charge
            </p>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
          >
            <Button
              onClick={() => void navigate({ to: "/wallet" })}
              className="font-display font-bold tracking-widest uppercase text-xs bg-accent text-accent-foreground hover:bg-accent/90 glow-yellow-sm min-w-[200px]"
              data-ocid="payment-cancel-wallet-btn"
            >
              ⛽ Return to Gas Wallet
            </Button>
            <Button
              variant="outline"
              onClick={() => void navigate({ to: "/dashboard" })}
              className="font-display font-bold tracking-widest uppercase text-xs border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-smooth"
              data-ocid="payment-cancel-dashboard-btn"
            >
              Back to Dashboard
            </Button>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
