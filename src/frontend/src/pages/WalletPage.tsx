import {
  CardElement,
  Elements,
  PaymentRequestButtonElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { type Stripe, loadStripe } from "@stripe/stripe-js";
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Fuel,
  Shield,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { GasFuelTank, computeFuelFromExpiry } from "@/components/GasFuelTank";
import { Layout } from "@/components/Layout";
import { TimeCircuitsCountdown } from "@/components/TimeCircuitsCountdown";
import { CarAnimation } from "@/components/animations/CarAnimation";
import { LightningAnimation } from "@/components/animations/LightningAnimation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  type GasPurchaseStatus,
  useConfirmGasPurchase,
  useFailGasPurchase,
  useGetGasPackages,
  useGetMyGasPurchases,
  useGetMyGasWallet,
  useInitiateGasPurchase,
  useSetAutoRenewal,
} from "@/hooks/useGasWallet";
import {
  LOYALTY_THRESHOLDS,
  isLoyaltyRewardAvailable,
  useClaimLoyaltyReward,
  useGetLoyaltyStatus,
  useGetRefuelHistory,
} from "@/hooks/useLoyalty";
import { useCreateStripePortalSession } from "@/hooks/useStripePayments";
import { useGetMySubscription, useGetTiers } from "@/hooks/useTiers";
import { useActor } from "@caffeineai/core-infrastructure";
import { createActor } from "../backend";

// ─── Stripe Setup ─────────────────────────────────────────────────────────────

// Stripe is initialized at runtime from backend config — not from env vars
// stripePromise is a ref that gets resolved after the key is fetched

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Gas tiers aligned exactly with tier prices
const GAS_TIERS = [
  {
    id: 1,
    name: "Starter Gas",
    tierName: "TIME WALKER",
    days: 30,
    price: 6.99,
    tagline: "30-day time fuel",
  },
  {
    id: 2,
    name: "Road Trip Gas",
    tierName: "TIME TRAVELER",
    days: 90,
    price: 9.99,
    tagline: "90-day time fuel",
    popular: true,
  },
  {
    id: 3,
    name: "Full Tank Gas",
    tierName: "TIME LORD",
    days: 180,
    price: 19.99,
    tagline: "180-day time fuel",
  },
];

const AUTO_RENEW_NAMES: Record<number, string> = {
  1: "TIME WALKER",
  2: "TIME TRAVELER",
  3: "TIME LORD",
};

function statusLabel(status: GasPurchaseStatus): string {
  if ("completed" in status) return "Completed";
  if ("failed" in status) return "Failed";
  return "Pending";
}

function statusColor(status: GasPurchaseStatus): string {
  if ("completed" in status) return "text-green-400";
  if ("failed" in status) return "text-destructive";
  return "text-accent";
}

function formatDate(ts: bigint | number): string {
  const ms = typeof ts === "bigint" ? Number(ts) : ts;
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Gas Tier Card ────────────────────────────────────────────────────────────

function GasTierCard({
  tier,
  selected,
  onSelect,
}: {
  tier: (typeof GAS_TIERS)[0];
  selected: boolean;
  onSelect: () => void;
}) {
  const borderClass = selected
    ? tier.id === 3
      ? "neon-border-green"
      : tier.id === 2
        ? "neon-border-yellow"
        : "neon-border-blue"
    : "border border-border/40 hover:border-primary/40";

  const priceColor =
    tier.id === 3
      ? "text-green-400"
      : tier.id === 2
        ? "text-accent"
        : "text-primary";

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.04, y: -4 }}
      whileTap={{ scale: 0.97 }}
      onClick={onSelect}
      className={`w-full rounded-xl p-5 text-left flex flex-col gap-3 relative overflow-hidden transition-smooth cursor-pointer
        ${selected ? `${borderClass} bg-card/90` : `bg-card/60 ${borderClass}`}`}
      data-ocid={`gas-tier-${tier.id}`}
    >
      {tier.popular && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-px">
          <span className="bg-accent text-accent-foreground font-display text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-b">
            MOST POPULAR
          </span>
        </div>
      )}

      <p className="font-display text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground pt-1">
        {tier.name}
      </p>

      <div>
        <p
          className={`font-display text-3xl font-black tracking-wide ${priceColor} ${selected ? "text-glow-blue" : ""}`}
        >
          ${tier.price.toFixed(2)}
        </p>
        <p className="font-mono text-xs text-muted-foreground mt-0.5">
          {tier.tierName} · {tier.days} days
        </p>
        <p className="font-mono text-[10px] text-muted-foreground/60 mt-0.5">
          {tier.tagline}
        </p>
      </div>

      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
        >
          <Zap className="w-3 h-3 text-primary-foreground" />
        </motion.div>
      )}
    </motion.button>
  );
}

// ─── Stripe Gas Payment Form ──────────────────────────────────────────────────

interface GasStripeFormProps {
  clientSecret: string;
  purchaseRecordId: number;
  finalAmountUSD: number;
  gasAmount: number;
  stripePromise: Promise<Stripe | null>;
  onSuccess: (gasAmount: number) => void;
  onFailure: (reason: string) => void;
}

function GasStripeForm({
  clientSecret,
  purchaseRecordId,
  finalAmountUSD,
  gasAmount,
  onSuccess,
  onFailure,
}: Omit<GasStripeFormProps, "stripePromise">) {
  const stripe = useStripe();
  const elements = useElements();
  const confirmGasPurchase = useConfirmGasPurchase();
  const failGasPurchase = useFailGasPurchase();

  const [submitting, setSubmitting] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);
  const [paymentRequest, setPaymentRequest] = useState<ReturnType<
    Stripe["paymentRequest"]
  > | null>(null);
  const [prAvailable, setPrAvailable] = useState(false);

  useEffect(() => {
    if (!stripe || !clientSecret) return;

    const pr = stripe.paymentRequest({
      country: "US",
      currency: "usd",
      total: {
        label: `DeLorean Gas — ${gasAmount} days`,
        amount: Math.round(finalAmountUSD * 100),
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    pr.canMakePayment().then((result) => {
      if (result) {
        setPaymentRequest(pr);
        setPrAvailable(true);
      }
    });

    pr.on("paymentmethod", async (ev) => {
      setSubmitting(true);
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        { payment_method: ev.paymentMethod.id },
        { handleActions: false },
      );
      if (error) {
        ev.complete("fail");
        await failGasPurchase.mutateAsync({ purchaseRecordId });
        onFailure(error.message ?? "Payment failed");
        setSubmitting(false);
      } else if (paymentIntent?.status === "requires_action") {
        ev.complete("success");
        const { error: confirmError } =
          await stripe.confirmCardPayment(clientSecret);
        if (confirmError) {
          onFailure(confirmError.message ?? "3DS failed");
        } else {
          await confirmGasPurchase.mutateAsync({ purchaseRecordId });
          onSuccess(gasAmount);
        }
        setSubmitting(false);
      } else if (paymentIntent) {
        ev.complete("success");
        await confirmGasPurchase.mutateAsync({ purchaseRecordId });
        onSuccess(gasAmount);
        setSubmitting(false);
      }
    });
  }, [
    stripe,
    clientSecret,
    finalAmountUSD,
    gasAmount,
    purchaseRecordId,
    confirmGasPurchase,
    failGasPurchase,
    onSuccess,
    onFailure,
  ]);

  async function handleCardSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    setCardError(null);

    const card = elements.getElement(CardElement);
    if (!card) return;

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      { payment_method: { card } },
    );

    if (error) {
      setCardError(error.message ?? "Payment failed");
      await failGasPurchase.mutateAsync({ purchaseRecordId });
      onFailure(error.message ?? "Card declined");
    } else if (paymentIntent?.status === "succeeded") {
      await confirmGasPurchase.mutateAsync({ purchaseRecordId });
      onSuccess(gasAmount);
    }
    setSubmitting(false);
  }

  return (
    <div className="space-y-4">
      {prAvailable && paymentRequest && (
        <div className="space-y-2">
          <p className="font-display text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground">
            EXPRESS CHECKOUT
          </p>
          <PaymentRequestButtonElement
            options={{
              paymentRequest,
              style: {
                paymentRequestButton: {
                  type: "default",
                  theme: "dark",
                  height: "44px",
                },
              },
            }}
          />
          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-border/40" />
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
              or pay by card
            </span>
            <div className="flex-1 h-px bg-border/40" />
          </div>
        </div>
      )}

      <form onSubmit={handleCardSubmit} className="space-y-4">
        <div
          className="rounded-md border border-input bg-background px-3 py-3 focus-within:border-primary transition-colors"
          data-ocid="gas-stripe-card-element"
        >
          <CardElement
            options={{
              style: {
                base: {
                  color: "oklch(0.95 0 0)",
                  fontFamily: "Space Grotesk, sans-serif",
                  fontSize: "14px",
                  "::placeholder": { color: "oklch(0.5 0 0)" },
                  iconColor: "oklch(0.65 0.22 262)",
                },
                invalid: {
                  color: "oklch(0.65 0.25 16)",
                  iconColor: "oklch(0.65 0.25 16)",
                },
              },
            }}
          />
        </div>

        {cardError && (
          <p className="font-mono text-xs text-destructive flex items-center gap-1.5">
            <span>⚠</span> {cardError}
          </p>
        )}

        <Button
          type="submit"
          disabled={submitting || !stripe}
          className="w-full font-display font-bold tracking-widest uppercase text-xs bg-primary hover:bg-primary/90 text-primary-foreground glow-blue-sm"
          data-ocid="gas-pay-submit-btn"
        >
          <Zap className="w-3.5 h-3.5 mr-2" />
          {submitting
            ? "FUELING UP THE DELOREAN…"
            : `PAY $${finalAmountUSD.toFixed(2)} · FUEL THE DELOREAN`}
        </Button>

        <p className="flex items-center justify-center gap-1.5 font-mono text-[10px] text-muted-foreground">
          <Shield className="w-3 h-3" />
          Secured by Stripe · SSL encrypted
        </p>
      </form>
    </div>
  );
}

// ─── Free Gas Success Modal (loyalty reward claim) ────────────────────────────

function FreeGasSuccessOverlay({
  newExpiration,
  onClose,
}: {
  newExpiration: number;
  onClose: () => void;
}) {
  const [showLightning, setShowLightning] = useState(true);
  const [showCar, setShowCar] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => {
      setShowLightning(false);
      setShowCar(true);
    }, 1400);
    const t2 = setTimeout(() => {
      setShowCar(false);
    }, 2200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <>
      <LightningAnimation active={showLightning} />
      <CarAnimation active={showCar} />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm px-4"
        data-ocid="free-gas-success-overlay"
      >
        <div className="max-w-lg w-full flex flex-col items-center gap-6 py-12 text-center bg-card rounded-2xl neon-border-blue p-8">
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-7xl"
          >
            ⛽
          </motion.div>

          <div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="font-display text-2xl font-black tracking-widest uppercase text-accent text-glow-yellow"
            >
              FREE GAS ACTIVATED!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              className="font-mono text-sm text-muted-foreground mt-2"
            >
              30 free days added to your subscription
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="w-full"
          >
            <p className="font-display text-[10px] font-bold tracking-[0.2em] uppercase text-primary/70 mb-2">
              DESTINATION TIME — AFTER UPGRADE
            </p>
            <TimeCircuitsCountdown
              expirationDate={newExpiration}
              label="NEW TIME CIRCUITS — DESTINATION DATE"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            <Button
              onClick={onClose}
              className="font-display font-bold tracking-widest uppercase text-xs bg-primary text-primary-foreground hover:bg-primary/90 glow-blue-sm"
              data-ocid="free-gas-close-btn"
            >
              BACK TO GAS WALLET
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export function WalletPage() {
  const { actor } = useActor(createActor);
  const { data: wallet, isLoading: walletLoading } = useGetMyGasWallet();
  const { isLoading: packagesLoading } = useGetGasPackages();
  const { data: purchases = [], isLoading: purchasesLoading } =
    useGetMyGasPurchases();
  const { data: subscription } = useGetMySubscription();
  const { data: loyaltyStatus } = useGetLoyaltyStatus();
  const { data: refuelHistory = [], isLoading: refuelLoading } =
    useGetRefuelHistory();
  const claimLoyaltyReward = useClaimLoyaltyReward();

  const initiateGasPurchase = useInitiateGasPurchase();
  const setAutoRenewal = useSetAutoRenewal();
  const portalSession = useCreateStripePortalSession();

  // ─── Runtime Stripe key + price IDs from backend ────────────────────────────
  const [stripeKey, setStripeKey] = useState<string | null>(null);
  const [stripeKeyLoading, setStripeKeyLoading] = useState(true);
  const [gasPriceIds, setGasPriceIds] = useState<Record<number, string>>({});

  useEffect(() => {
    if (!actor) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const a = actor as any;

    // Fetch publishable key at runtime
    a.getStripePublicKey()
      .then((result: { publishableKey: string }) => {
        if (result?.publishableKey) {
          setStripeKey(result.publishableKey);
        }
      })
      .catch(() => {})
      .finally(() => setStripeKeyLoading(false));

    // Fetch gas wallet price IDs from backend config
    // Try multiple possible key names for backward compatibility
    const fetchPriceId = async (keys: string[]): Promise<string> => {
      for (const key of keys) {
        try {
          const val = await a.getConfig(key);
          if (val && typeof val === "string" && val.startsWith("price_"))
            return val;
        } catch {
          /* ignore */
        }
      }
      return "";
    };

    Promise.all([
      fetchPriceId([
        "stripe_gas_walker",
        "stripe_price_walker",
        "stripeGasWalkerPriceId",
        "stripeWalkerPriceId",
      ]),
      fetchPriceId([
        "stripe_gas_traveler",
        "stripe_price_traveler",
        "stripeGasTravelerPriceId",
        "stripeProPriceId",
      ]),
      fetchPriceId([
        "stripe_gas_lord",
        "stripe_price_lord",
        "stripeGasLordPriceId",
        "stripeMaxPriceId",
      ]),
    ]).then(([walker, traveler, lord]) => {
      setGasPriceIds({
        1: walker,
        2: traveler,
        3: lord,
      });
    });
  }, [actor]);

  const stripePromise: Promise<Stripe | null> = stripeKey
    ? loadStripe(stripeKey)
    : Promise.resolve(null);

  const [selectedGasTierId, setSelectedGasTierId] = useState<number | null>(
    null,
  );
  const [checkoutPhase, setCheckoutPhase] = useState<
    "idle" | "loading" | "payment" | "success"
  >("idle");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [purchaseRecordId, setPurchaseRecordId] = useState<number | null>(null);
  const [purchasedGasAmount, setPurchasedGasAmount] = useState(0);
  const [finalAmount] = useState(0);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [refuelHistoryOpen, setRefuelHistoryOpen] = useState(false);
  const [autoRenewalEnabled, setAutoRenewalEnabled] = useState(
    wallet?.autoRenewal ?? false,
  );
  const [autoRenewalTierId, setAutoRenewalTierId] = useState(
    wallet?.autoRenewalTierId ?? 2,
  );
  const [showFreeGasSuccess, setShowFreeGasSuccess] = useState(false);
  const [freeGasExpiration, setFreeGasExpiration] = useState(0);

  // Sync auto-renewal state when wallet loads
  useEffect(() => {
    if (wallet) {
      setAutoRenewalEnabled(wallet.autoRenewal);
      setAutoRenewalTierId(wallet.autoRenewalTierId || 2);
    }
  }, [wallet]);

  // ─── Live fuel computation from subscription expiry ─────────────────────────
  const subTier = subscription
    ? (Math.max(1, Math.min(3, Number(subscription.tier))) as 1 | 2 | 3)
    : 1;
  const subExpiryMs = subscription?.expirationDate ?? 0;

  const { fuelPercent, daysRemaining } =
    subExpiryMs > 0
      ? computeFuelFromExpiry(subExpiryMs, subTier)
      : { fuelPercent: 0, daysRemaining: 0 };

  const loyaltyAvailable =
    loyaltyStatus != null && isLoyaltyRewardAvailable(loyaltyStatus);

  const loyaltyThreshold = loyaltyStatus
    ? (LOYALTY_THRESHOLDS[loyaltyStatus.currentTier] ?? 0)
    : 0;

  // ─── Handlers ────────────────────────────────────────────────────────────────

  const selectedGasTier = GAS_TIERS.find((t) => t.id === selectedGasTierId);

  async function handleBuyGas() {
    if (!selectedGasTierId || !selectedGasTier) return;
    setCheckoutPhase("loading");

    // Get price ID from backend config
    const priceId = gasPriceIds[selectedGasTierId] ?? "";
    if (!priceId) {
      toast.error(
        "Payment not configured. Please contact support or try again later.",
      );
      setCheckoutPhase("idle");
      return;
    }

    // Call canister directly — createStripeCheckoutSession returns #ok(sessionUrl) or #err(msg)
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await (actor as any).createStripeCheckoutSession?.(
        priceId,
        "",
      );
      if (!result) {
        toast.error("Payment setup failed. Please try again.");
        setCheckoutPhase("idle");
        return;
      }
      if (result.__kind__ === "err") {
        toast.error(
          (result.err as string) || "Payment setup failed. Please try again.",
        );
        setCheckoutPhase("idle");
        return;
      }
      // Redirect to Stripe Checkout — do NOT show success state before redirect
      window.location.href = result.ok as string;
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Payment setup failed. Please try again.",
      );
      setCheckoutPhase("idle");
    }
  }

  function handlePaymentSuccess(gasAmount: number) {
    setPurchasedGasAmount(gasAmount);
    setCheckoutPhase("success");
    toast.success("DeLorean fueled up! Subscription time added.");
  }

  function handlePaymentFailure(reason: string) {
    toast.error(`Purchase failed. ${reason}`);
    setCheckoutPhase("idle");
    setClientSecret(null);
    setPurchaseRecordId(null);
  }

  const failGasPurchase = useFailGasPurchase();
  function handleCancelPayment() {
    if (purchaseRecordId !== null) {
      failGasPurchase.mutate({ purchaseRecordId });
    }
    setCheckoutPhase("idle");
    setClientSecret(null);
    setPurchaseRecordId(null);
  }

  async function handleAutoRenewalToggle(enabled: boolean) {
    setAutoRenewalEnabled(enabled);
    try {
      await setAutoRenewal.mutateAsync({ enabled, tierId: autoRenewalTierId });
      toast.success(
        enabled ? "Auto-renewal enabled." : "Auto-renewal disabled.",
      );
    } catch {
      setAutoRenewalEnabled(!enabled);
      toast.error("Failed to update auto-renewal.");
    }
  }

  async function handleAutoRenewalTierChange(tierId: number) {
    setAutoRenewalTierId(tierId);
    if (autoRenewalEnabled) {
      try {
        await setAutoRenewal.mutateAsync({ enabled: true, tierId });
        toast.success("Auto-renewal tier updated.");
      } catch {
        toast.error("Failed to update tier.");
      }
    }
  }

  async function handleClaimFreeGas() {
    try {
      await claimLoyaltyReward.mutateAsync();
      const newExp = subscription?.expirationDate
        ? subscription.expirationDate + 30 * 86400 * 1000
        : Date.now() + 30 * 86400 * 1000;
      setFreeGasExpiration(newExp);
      setShowFreeGasSuccess(true);
      toast.success("Free 30 days added to your subscription!");
    } catch {
      toast.error("Failed to claim free gas. Try again.");
    }
  }

  // ─── Success screen ───────────────────────────────────────────────────────────

  if (checkoutPhase === "success") {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-10">
          <CarAnimation active={true} />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col items-center gap-6 py-12 text-center"
            data-ocid="gas-purchase-success"
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-7xl"
            >
              ⛽
            </motion.div>
            <div>
              <h2 className="font-display text-3xl font-black tracking-widest uppercase text-primary text-glow-blue">
                FUELED UP!
              </h2>
              <p className="font-display text-xl font-bold tracking-widest uppercase text-accent text-glow-yellow mt-1">
                SUBSCRIPTION TIME ADDED
              </p>
              <p className="font-mono text-sm text-muted-foreground mt-2">
                Your DeLorean is ready for another time jump.
              </p>
            </div>
            <GasFuelTank
              expirationDate={
                subExpiryMs > 0
                  ? subExpiryMs + purchasedGasAmount * 86400000
                  : Date.now() + purchasedGasAmount * 86400000
              }
              tier={subTier}
            />
            <div className="flex gap-3">
              <Button
                onClick={() => setCheckoutPhase("idle")}
                className="font-display font-bold tracking-widest uppercase text-xs bg-primary text-primary-foreground hover:bg-primary/90 glow-blue-sm"
                data-ocid="gas-success-wallet-btn"
              >
                BACK TO WALLET
              </Button>
            </div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Free Gas Success Overlay */}
      {showFreeGasSuccess && (
        <FreeGasSuccessOverlay
          newExpiration={freeGasExpiration}
          onClose={() => setShowFreeGasSuccess(false)}
        />
      )}

      <div
        className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10"
        data-ocid="wallet-page"
      >
        {/* ── Hero Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full neon-border-blue bg-primary/5 mb-2">
            <span className="text-base">⛽</span>
            <span className="font-mono text-xs text-primary/90 tracking-widest uppercase">
              DeLorean Gas Station
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-black tracking-widest uppercase text-foreground text-glow-blue">
            GAS WALLET
          </h1>
          <p className="font-mono text-sm text-muted-foreground max-w-md mx-auto">
            Fuel your DeLorean. Keep your listings alive.
          </p>
        </motion.div>

        {/* ── Fuel Tank + Subscription Status ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl bg-card neon-border-blue p-6 flex flex-col sm:flex-row items-center gap-8"
          data-ocid="gas-balance-panel"
        >
          {walletLoading ? (
            <Skeleton className="w-28 h-52 rounded-xl" />
          ) : (
            <GasFuelTank
              expirationDate={subExpiryMs}
              tier={subTier}
              size="lg"
            />
          )}

          <div className="flex-1 space-y-3 text-center sm:text-left">
            <p className="font-display text-[10px] font-bold tracking-[0.25em] uppercase text-muted-foreground">
              CURRENT FUEL LEVEL
            </p>
            {walletLoading ? (
              <Skeleton className="h-14 w-48 rounded-lg" />
            ) : (
              <div>
                <p
                  className="font-display text-5xl font-black tracking-widest text-primary text-glow-blue"
                  data-ocid="fuel-level-display"
                >
                  {fuelPercent}%
                </p>
                <p className="font-display text-lg font-bold tracking-widest text-primary/60 uppercase">
                  {daysRemaining}d remaining
                </p>
              </div>
            )}

            {subscription && !walletLoading && (
              <div className="rounded-lg bg-background/60 border border-border/30 px-4 py-3 mt-2">
                <p className="font-display text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-2">
                  TIME CIRCUITS
                </p>
                <TimeCircuitsCountdown
                  expirationDate={subscription.expirationDate}
                  label="SUBSCRIPTION EXPIRES"
                  compact
                />
              </div>
            )}

            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              <Badge
                variant="outline"
                className="font-mono text-[10px] tracking-widest border-border/30 text-muted-foreground"
              >
                Starter Gas = $6.99 · 30d
              </Badge>
              <Badge
                variant="outline"
                className="font-mono text-[10px] tracking-widest border-border/30 text-muted-foreground"
              >
                Road Trip = $9.99 · 90d
              </Badge>
              <Badge
                variant="outline"
                className="font-mono text-[10px] tracking-widest border-border/30 text-muted-foreground"
              >
                Full Tank = $19.99 · 180d
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* ── Loyalty: Activate Free Gas ── */}
        {loyaltyAvailable && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl neon-border-yellow bg-accent/5 p-6 flex flex-col sm:flex-row items-center gap-5"
            data-ocid="loyalty-free-gas-banner"
          >
            <div className="text-4xl">🏆</div>
            <div className="flex-1 text-center sm:text-left">
              <p className="font-display text-[10px] font-bold tracking-[0.2em] uppercase text-accent/80">
                LOYALTY REWARD UNLOCKED
              </p>
              <h3 className="font-display text-lg font-black tracking-widest uppercase text-accent text-glow-yellow">
                You've earned free gas!
              </h3>
              <p className="font-mono text-xs text-muted-foreground mt-0.5">
                Refueled {loyaltyStatus?.refuelCount ?? 0} times (threshold:{" "}
                {loyaltyThreshold}) · Claim 30 free days now
              </p>
            </div>
            <Button
              onClick={handleClaimFreeGas}
              disabled={claimLoyaltyReward.isPending}
              className="font-display font-bold tracking-widest uppercase text-xs bg-accent text-accent-foreground hover:bg-accent/90 glow-yellow-sm shrink-0"
              data-ocid="activate-free-gas-btn"
            >
              <Fuel className="w-4 h-4 mr-2" />
              CLAIM FREE GAS
            </Button>
          </motion.div>
        )}

        {/* ── Buy Gas Tiers ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-5"
          data-ocid="buy-gas-section"
        >
          <div>
            <h2 className="font-display text-sm font-black tracking-[0.25em] uppercase text-foreground">
              BUY GAS
            </h2>
            <p className="font-mono text-xs text-muted-foreground mt-0.5">
              Select a fuel package — each adds time to your subscription
            </p>
          </div>

          {packagesLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-44 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {GAS_TIERS.map((tier, i) => (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.08 }}
                >
                  <GasTierCard
                    tier={tier}
                    selected={selectedGasTierId === tier.id}
                    onSelect={() => setSelectedGasTierId(tier.id)}
                  />
                </motion.div>
              ))}
            </div>
          )}

          {/* Buy CTA */}
          <AnimatePresence>
            {selectedGasTier &&
              (checkoutPhase === "idle" || checkoutPhase === "loading") && (
                <motion.div
                  key="buy-cta"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex flex-col sm:flex-row items-center gap-4 rounded-xl bg-card/80 neon-border-yellow p-5"
                  data-ocid="gas-buy-cta"
                >
                  <div className="flex-1 text-center sm:text-left">
                    <p className="font-display text-[10px] font-bold tracking-[0.2em] uppercase text-accent/80">
                      SELECTED
                    </p>
                    <p className="font-display text-lg font-black tracking-widest text-accent text-glow-yellow">
                      {selectedGasTier.name}
                    </p>
                    <p className="font-mono text-xs text-muted-foreground">
                      ${selectedGasTier.price.toFixed(2)} ·{" "}
                      {selectedGasTier.days} days added
                    </p>
                  </div>
                  <Button
                    onClick={handleBuyGas}
                    disabled={
                      initiateGasPurchase.isPending ||
                      checkoutPhase === "loading" ||
                      stripeKeyLoading
                    }
                    className="font-display font-bold tracking-widest uppercase text-xs bg-accent text-accent-foreground hover:bg-accent/90 glow-yellow-sm min-w-[200px]"
                    data-ocid="buy-gas-btn"
                  >
                    {checkoutPhase === "loading" || stripeKeyLoading ? (
                      <>
                        <span className="inline-block w-3.5 h-3.5 mr-2 rounded-full border-2 border-accent-foreground/40 border-t-accent-foreground animate-spin" />
                        {stripeKeyLoading ? "LOADING…" : "REDIRECTING…"}
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        BUY GAS — ${selectedGasTier.price.toFixed(2)}
                      </>
                    )}
                  </Button>
                </motion.div>
              )}

            {/* Stripe checkout panel */}
            {checkoutPhase === "payment" &&
              clientSecret &&
              purchaseRecordId !== null && (
                <motion.div
                  key="gas-payment-form"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="rounded-xl bg-card neon-border-blue p-6 space-y-5"
                  data-ocid="gas-stripe-payment-panel"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-display text-[10px] font-bold tracking-[0.2em] uppercase text-primary/80">
                        GAS STATION CHECKOUT
                      </p>
                      <h3 className="font-display text-lg font-black tracking-wider uppercase text-primary text-glow-blue mt-0.5">
                        {selectedGasTier?.name ?? "Gas Package"}
                      </h3>
                      <p className="font-mono text-xs text-muted-foreground">
                        ${finalAmount.toFixed(2)} · {selectedGasTier?.days ?? 0}{" "}
                        days subscription time
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCancelPayment}
                      className="font-mono text-xs text-muted-foreground hover:text-foreground"
                      data-ocid="gas-cancel-payment-btn"
                    >
                      ← Back
                    </Button>
                  </div>

                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret,
                      appearance: {
                        theme: "night",
                        variables: {
                          colorPrimary: "oklch(0.65 0.22 262)",
                          colorBackground: "oklch(0.16 0 0)",
                          colorText: "oklch(0.95 0 0)",
                          colorDanger: "oklch(0.65 0.25 16)",
                          fontFamily: "Space Grotesk, sans-serif",
                          borderRadius: "6px",
                        },
                      },
                    }}
                  >
                    <GasStripeForm
                      clientSecret={clientSecret}
                      purchaseRecordId={purchaseRecordId}
                      finalAmountUSD={finalAmount}
                      gasAmount={selectedGasTier?.days ?? purchasedGasAmount}
                      onSuccess={handlePaymentSuccess}
                      onFailure={handlePaymentFailure}
                    />
                  </Elements>
                </motion.div>
              )}
          </AnimatePresence>

          {/* No stripe key warning */}
          {!stripeKeyLoading && !stripeKey && (
            <div className="rounded-lg border border-accent/30 bg-accent/5 px-4 py-3">
              <p className="font-mono text-xs text-accent/80">
                ⚠ Stripe key not configured. Add your Stripe keys in{" "}
                <a href="/admin/payments" className="underline text-accent">
                  Admin → Payments
                </a>{" "}
                to enable payments.
              </p>
            </div>
          )}
        </motion.div>

        {/* ── Gas Cost Guide ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="rounded-xl bg-muted/30 border border-border/30 p-5"
          data-ocid="gas-cost-guide"
        >
          <h2 className="font-display text-[10px] font-bold tracking-[0.25em] uppercase text-muted-foreground mb-3">
            GAS COST GUIDE
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {GAS_TIERS.map((tier) => (
              <div
                key={tier.id}
                className="flex items-center justify-between rounded-lg bg-card/60 px-4 py-3 border border-border/30"
              >
                <div>
                  <p className="font-display text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
                    {tier.name}
                  </p>
                  <p className="font-mono text-[10px] text-muted-foreground/60 mt-0.5">
                    {tier.tierName} · {tier.days}d
                  </p>
                </div>
                <p className="font-display text-sm font-black text-primary text-glow-blue">
                  ${tier.price.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Smart Backup ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.29 }}
          className="rounded-xl bg-card/70 border border-border/40 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          data-ocid="wallet-smart-backup-section"
        >
          <div>
            <h2 className="font-display text-sm font-black tracking-[0.25em] uppercase text-foreground">
              SMART BACKUP — $29.99
            </h2>
            <p className="font-mono text-xs text-muted-foreground mt-0.5">
              Export all your listings and photos before they are permanently
              deleted.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => window.location.assign("/settings")}
            className="font-display text-[10px] tracking-widest uppercase neon-border-blue text-primary hover:glow-blue-sm transition-smooth gap-2 w-full sm:w-auto shrink-0"
            data-ocid="wallet-smart-backup-btn"
          >
            <Shield className="w-3.5 h-3.5" />
            Back Up My Listings
          </Button>
        </motion.div>

        {/* ── Auto-Renewal Settings ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl bg-card/70 border border-border/40 p-6 space-y-5"
          data-ocid="auto-renewal-settings"
        >
          <h2 className="font-display text-sm font-black tracking-[0.25em] uppercase text-foreground">
            AUTO-RENEWAL
          </h2>

          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-mono text-sm text-foreground">
                Auto-renew subscription
              </p>
              <p className="font-mono text-xs text-muted-foreground mt-0.5">
                Payment auto-deducts 7 days before your subscription expires
              </p>
            </div>
            <Switch
              checked={autoRenewalEnabled}
              onCheckedChange={handleAutoRenewalToggle}
              data-ocid="auto-renewal-toggle"
              aria-label="Auto-renewal toggle"
            />
          </div>

          <AnimatePresence>
            {autoRenewalEnabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-2 space-y-2">
                  <p className="font-display text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground">
                    RENEW WITH TIER
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {GAS_TIERS.map((gasTier) => (
                      <button
                        key={gasTier.id}
                        type="button"
                        onClick={() => handleAutoRenewalTierChange(gasTier.id)}
                        className={`rounded-lg border p-3 text-center transition-smooth cursor-pointer
                          ${
                            autoRenewalTierId === gasTier.id
                              ? "neon-border-blue bg-primary/10 text-primary"
                              : "border-border/40 text-muted-foreground hover:border-primary/30"
                          }`}
                        data-ocid={`auto-renewal-tier-${gasTier.id}`}
                      >
                        <p className="font-display text-[9px] font-bold tracking-widest uppercase">
                          {AUTO_RENEW_NAMES[gasTier.id]}
                        </p>
                        <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
                          ${gasTier.price.toFixed(2)}
                        </p>
                      </button>
                    ))}
                  </div>
                  <p className="font-mono text-[10px] text-muted-foreground mt-1">
                    Auto-renew my{" "}
                    <span className="text-primary font-bold">
                      {AUTO_RENEW_NAMES[autoRenewalTierId] ?? "TIME WALKER"}
                    </span>{" "}
                    — 7 days before expiry
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Manage Billing & Invoices ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32 }}
          className="rounded-xl bg-card/70 border border-border/40 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          data-ocid="manage-billing-section"
        >
          <div>
            <h2 className="font-display text-sm font-black tracking-[0.25em] uppercase text-foreground">
              BILLING & INVOICES
            </h2>
            <p className="font-mono text-xs text-muted-foreground mt-0.5">
              Update your card, view invoices, or cancel your plan
            </p>
          </div>
          <Button
            variant="outline"
            onClick={async () => {
              try {
                await portalSession.mutateAsync();
              } catch (err) {
                toast.error(
                  err instanceof Error
                    ? err.message
                    : "Failed to open billing portal",
                );
              }
            }}
            disabled={portalSession.isPending}
            className="font-display text-[10px] tracking-widest uppercase neon-border-blue text-primary hover:glow-blue-sm transition-smooth gap-2 w-full sm:w-auto shrink-0"
            data-ocid="manage-billing-btn"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            {portalSession.isPending
              ? "Opening..."
              : "🧾 Manage Billing & Invoices"}
          </Button>
        </motion.div>

        {/* ── Refuel History + Loyalty ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-xl bg-card/70 border border-border/40 overflow-hidden"
          data-ocid="refuel-history-section"
        >
          <button
            type="button"
            onClick={() => setRefuelHistoryOpen((v) => !v)}
            className="w-full flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-card transition-smooth"
            data-ocid="refuel-history-toggle"
            aria-expanded={refuelHistoryOpen}
          >
            <div>
              <h2 className="font-display text-sm font-black tracking-[0.25em] uppercase text-foreground text-left">
                REFUEL HISTORY
              </h2>
              {loyaltyStatus && (
                <p className="font-mono text-xs text-muted-foreground text-left mt-0.5">
                  You have refueled{" "}
                  <span className="text-primary font-bold">
                    {loyaltyStatus.refuelCount}
                  </span>{" "}
                  times
                  {loyaltyAvailable && (
                    <span className="ml-2 text-accent">
                      · Loyalty reward available!
                    </span>
                  )}
                </p>
              )}
            </div>
            {refuelHistoryOpen ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
            )}
          </button>

          <AnimatePresence>
            {refuelHistoryOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-5 space-y-4">
                  {/* Loyalty threshold info */}
                  {loyaltyStatus && (
                    <div className="rounded-lg bg-muted/20 border border-border/30 px-4 py-3">
                      <p className="font-display text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-1">
                        LOYALTY PROGRESS — {loyaltyStatus.currentTier}
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${Math.min(100, (loyaltyStatus.refuelCount / loyaltyThreshold) * 100)}%`,
                            }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="h-full rounded-full bg-primary"
                          />
                        </div>
                        <span className="font-mono text-xs text-muted-foreground shrink-0">
                          {loyaltyStatus.refuelCount}/{loyaltyThreshold}
                        </span>
                      </div>
                      <p className="font-mono text-[10px] text-muted-foreground mt-1">
                        {loyaltyAvailable
                          ? "✓ Threshold met! Claim your free gas above."
                          : `${loyaltyThreshold - loyaltyStatus.refuelCount} more refuel(s) to unlock free gas reward`}
                      </p>
                    </div>
                  )}

                  {/* Refuel log */}
                  {refuelLoading ? (
                    <div className="space-y-2">
                      {[0, 1, 2].map((i) => (
                        <Skeleton key={i} className="h-12 rounded-lg" />
                      ))}
                    </div>
                  ) : refuelHistory.length === 0 ? (
                    <div
                      className="py-6 text-center"
                      data-ocid="refuel-history-empty"
                    >
                      <p className="font-mono text-xs text-muted-foreground">
                        No refuel history yet. Buy your first gas package!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {refuelHistory.map((entry) => (
                        <div
                          key={`${entry.date}-${entry.tier}`}
                          className="flex items-center justify-between rounded-lg bg-background/60 border border-border/30 px-4 py-3"
                          data-ocid={`refuel-row-${entry.date}`}
                        >
                          <div className="min-w-0">
                            <p className="font-display text-xs font-bold tracking-widest text-foreground">
                              {entry.tier || "Time Walker"}
                            </p>
                            <p className="font-mono text-[10px] text-muted-foreground">
                              {formatDate(entry.date)}
                            </p>
                          </div>
                          {entry.rewardClaimed && (
                            <Badge
                              variant="outline"
                              className="font-mono text-[9px] tracking-widest text-accent border-accent/30"
                            >
                              Reward claimed
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Purchase History ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38 }}
          className="rounded-xl bg-card/70 border border-border/40 overflow-hidden"
          data-ocid="purchase-history-section"
        >
          <button
            type="button"
            onClick={() => setHistoryOpen((v) => !v)}
            className="w-full flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-card transition-smooth"
            data-ocid="purchase-history-toggle"
            aria-expanded={historyOpen}
          >
            <h2 className="font-display text-sm font-black tracking-[0.25em] uppercase text-foreground">
              PURCHASE HISTORY
            </h2>
            {historyOpen ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
            )}
          </button>

          <AnimatePresence>
            {historyOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-5">
                  {purchasesLoading ? (
                    <div className="space-y-2">
                      {[0, 1, 2].map((i) => (
                        <Skeleton key={i} className="h-12 rounded-lg" />
                      ))}
                    </div>
                  ) : purchases.length === 0 ? (
                    <div
                      className="py-6 text-center"
                      data-ocid="purchase-history-empty"
                    >
                      <p className="font-mono text-xs text-muted-foreground">
                        No purchases yet. Buy your first gas package above!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {purchases.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center justify-between rounded-lg bg-background/60 border border-border/30 px-4 py-3"
                          data-ocid={`purchase-row-${p.id}`}
                        >
                          <div className="min-w-0">
                            <p className="font-display text-xs font-bold tracking-widest text-foreground">
                              {p.gasAmount} days
                            </p>
                            <p className="font-mono text-[10px] text-muted-foreground">
                              {formatDate(p.createdAt)} · $
                              {(p.priceUSD ?? 0).toFixed(2)}
                            </p>
                          </div>
                          <span
                            className={`font-mono text-[10px] font-bold ${statusColor(p.status)}`}
                          >
                            {statusLabel(p.status)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </Layout>
  );
}
