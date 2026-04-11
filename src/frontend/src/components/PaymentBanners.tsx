/**
 * PaymentBanners — shows payment success (24h) and failure (persistent) banners
 * on the dashboard. Reads from localStorage for success, backend for failure.
 */

import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useCreateStripePortalSession,
  useDismissPaymentBanner,
  useGetPaymentBanner,
} from "../hooks/useStripePayments";

// ─── Success Banner ───────────────────────────────────────────────────────────

function SuccessBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="flex items-start sm:items-center justify-between gap-3 rounded-xl border border-primary/40 bg-primary/10 px-4 py-3 mb-4"
      role="alert"
      data-ocid="payment-success-banner"
    >
      <div className="flex items-center gap-3 min-w-0">
        <motion.span
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          className="text-lg shrink-0"
        >
          ⚡
        </motion.span>
        <div className="min-w-0">
          <p className="font-display text-xs font-bold tracking-widest uppercase text-primary text-glow-blue">
            DeLorean Refueled!
          </p>
          <p className="font-mono text-xs text-muted-foreground">
            Your subscription has been extended. Time circuits updated.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss success banner"
        className="text-muted-foreground hover:text-foreground transition-smooth shrink-0 text-lg leading-none"
        data-ocid="dismiss-success-banner-btn"
      >
        ×
      </button>
    </motion.div>
  );
}

// ─── Failure Banner ───────────────────────────────────────────────────────────

function FailureBanner() {
  const portalSession = useCreateStripePortalSession();
  const dismissBanner = useDismissPaymentBanner();

  async function handleFixNow() {
    try {
      await portalSession.mutateAsync();
      // onSuccess in mutation redirects automatically
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to open billing portal.",
      );
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-destructive/50 bg-destructive/10 px-4 py-3 mb-4"
      role="alert"
      data-ocid="payment-failure-banner"
    >
      <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
        <span className="text-lg shrink-0 mt-0.5 sm:mt-0">⚠</span>
        <div className="min-w-0">
          <p className="font-display text-xs font-bold tracking-widest uppercase text-destructive">
            Payment Failed
          </p>
          <p className="font-mono text-xs text-muted-foreground leading-relaxed">
            Update your payment method to avoid losing your listings.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Button
          size="sm"
          onClick={handleFixNow}
          disabled={portalSession.isPending}
          className="font-display text-[10px] tracking-widest uppercase bg-destructive text-destructive-foreground hover:bg-destructive/90 h-7 px-3"
          data-ocid="payment-failure-fix-now-btn"
        >
          {portalSession.isPending ? "Opening..." : "Fix Now"}
        </Button>
        <button
          type="button"
          onClick={() => dismissBanner.mutate()}
          aria-label="Dismiss failure banner"
          className="text-muted-foreground hover:text-foreground transition-smooth text-lg leading-none"
          data-ocid="dismiss-failure-banner-btn"
        >
          ×
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function PaymentBanners() {
  const { data: backendBanner } = useGetPaymentBanner();

  // Success: driven by localStorage (set on /payment-success page)
  const [successDismissed, setSuccessDismissed] = useState(false);
  const dismissBanner = useDismissPaymentBanner();

  const bannerExpiry = localStorage.getItem("refuel_banner_expiry");
  const showSuccess =
    !successDismissed &&
    bannerExpiry !== null &&
    Date.now() < Number(bannerExpiry);

  // Failure: driven by backend
  const showFailure = backendBanner?.bannerType === "failure";

  function handleSuccessDismiss() {
    setSuccessDismissed(true);
    localStorage.removeItem("refuel_banner_expiry");
    localStorage.removeItem("refuel_banner_shown");
    dismissBanner.mutate();
  }

  if (!showSuccess && !showFailure) return null;

  return (
    <div data-ocid="payment-banners">
      <AnimatePresence>
        {showSuccess && (
          <SuccessBanner key="success" onDismiss={handleSuccessDismiss} />
        )}
        {showFailure && <FailureBanner key="failure" />}
      </AnimatePresence>
    </div>
  );
}
