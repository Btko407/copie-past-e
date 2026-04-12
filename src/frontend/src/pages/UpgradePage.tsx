import {
  CardElement,
  Elements,
  PaymentRequestButtonElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { type Stripe, loadStripe } from "@stripe/stripe-js";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Layout } from "@/components/Layout";
import { TimeCircuitsCountdown } from "@/components/TimeCircuitsCountdown";
import { CarAnimation } from "@/components/animations/CarAnimation";
import { ClockAnimation } from "@/components/animations/ClockAnimation";
import { LightningAnimation } from "@/components/animations/LightningAnimation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useConfirmStripePayment,
  useFailStripePayment,
  useInitiateTierUpgrade,
  useValidateDiscountCode,
} from "@/hooks/usePayments";
import { useGetMySubscription, useGetTiers } from "@/hooks/useTiers";
import type { TierConfig } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useNavigate } from "@tanstack/react-router";
import { Check, ChevronRight, Lock, Shield, Zap } from "lucide-react";
import { SiBitcoin, SiPaypal } from "react-icons/si";
import { createActor } from "../backend";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ActorAny = any;

// ─── Stripe Setup ─────────────────────────────────────────────────────────────
// Stripe publishable key is fetched at runtime from the backend — never from env vars.

// ─── Price ID helpers ─────────────────────────────────────────────────────────

// Hardcoded fallback prices per tier (shown when backend price is 0 or missing)
const TIER_FALLBACK_PRICES: Record<number, number> = {
  1: 6.99,
  2: 9.99,
  3: 19.99,
};

function getTierDisplayPrice(tier: TierConfig): number {
  const p = tier.priceUSD;
  if (p && p > 0) return p;
  return TIER_FALLBACK_PRICES[tier.tierId] ?? p;
}

// ─── Tier Config ──────────────────────────────────────────────────────────────

interface TierFlavor {
  badge: string;
  headline: string;
  fuelCopy: string;
  cta: string;
  color: string;
  glowClass: string;
  borderClass: string;
}

const TIER_FLAVOR: Record<number, TierFlavor> = {
  1: {
    badge: "TIME WALKER",
    headline: "$6.99 / 30 Days",
    fuelCopy: "Enough fuel for a quick trip",
    cta: "SELECT TIME WALKER",
    color: "text-primary",
    glowClass: "glow-blue",
    borderClass: "neon-border-blue",
  },
  2: {
    badge: "TIME TRAVELER",
    headline: "90 Days · $9.99",
    fuelCopy: "Long-haul chrono fuel",
    cta: "FUEL UP — $9.99",
    color: "text-accent",
    glowClass: "glow-yellow",
    borderClass: "neon-border-yellow",
  },
  3: {
    badge: "TIME LORD",
    headline: "6 Months · $19.99",
    fuelCopy: "Full flux capacitor charge",
    cta: "MAX POWER — $19.99",
    color: "text-green-400",
    glowClass: "glow-green",
    borderClass: "neon-border-green",
  },
};

const TIER_PERKS: Record<number, string[]> = {
  1: [
    "Up to 10 active listings",
    "30-day listing lifetime",
    "1-click copy any listing",
    "Basic time circuit display",
  ],
  2: [
    "Unlimited active listings",
    "90-day listing lifetime",
    "Priority copy speed",
    "Full BTTF time circuits",
  ],
  3: [
    "Unlimited active listings",
    "6-month listing lifetime",
    "Instant copy with history",
    "Max-power time circuits",
  ],
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function TierCard({
  tier,
  selected,
  onSelect,
}: {
  tier: TierConfig;
  selected: boolean;
  onSelect: () => void;
}) {
  const flavor = TIER_FLAVOR[tier.tierId] ?? {
    badge: `TIER ${tier.tierId}`,
    headline: `${tier.durationDays} Days`,
    fuelCopy: "Custom fuel level",
    cta: "SELECT",
    color: "text-primary",
    glowClass: "glow-blue",
    borderClass: "neon-border-blue",
  };
  const perks = TIER_PERKS[tier.tierId] ?? [];

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`rounded-xl bg-card/70 p-5 cursor-pointer flex flex-col gap-3 relative overflow-hidden transition-smooth
        ${selected ? `${flavor.borderClass} ${flavor.glowClass}` : "border border-border/40 hover:border-primary/30"}`}
      data-ocid={`tier-card-${tier.tierId}`}
    >
      {/* Selected check */}
      {selected && (
        <div
          className={`absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center ${
            tier.tierId === 3
              ? "bg-green-400"
              : tier.tierId === 2
                ? "bg-accent"
                : "bg-primary"
          }`}
        >
          <Check className="w-3 h-3 text-accent-foreground" />
        </div>
      )}

      {/* Popular badge */}
      {tier.tierId === 2 && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-px">
          <span className="bg-accent text-accent-foreground font-display text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-b">
            MOST POPULAR
          </span>
        </div>
      )}

      {/* Header */}
      <div className="pt-1">
        <span
          className={`font-display text-[10px] font-bold tracking-[0.25em] uppercase ${flavor.color}`}
        >
          {flavor.badge}
        </span>
        <p
          className={`font-display text-lg font-black tracking-wider uppercase mt-0.5 ${flavor.color} ${
            selected
              ? tier.tierId === 1
                ? "text-glow-blue"
                : tier.tierId === 2
                  ? "text-glow-yellow"
                  : "text-glow-green"
              : ""
          }`}
        >
          {`$${getTierDisplayPrice(tier).toFixed(2)}`}
        </p>
        <p className="font-mono text-[11px] text-muted-foreground mt-0.5">
          {tier.durationDays} days · {flavor.fuelCopy}
        </p>
      </div>

      {/* Perks */}
      <ul className="space-y-1.5 flex-1">
        {perks.map((perk) => (
          <li key={perk} className="flex items-start gap-2">
            <Check className={`w-3 h-3 mt-0.5 shrink-0 ${flavor.color}`} />
            <span className="font-mono text-[11px] text-foreground/80">
              {perk}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA — Time Walker shows price + info note; others show select button */}
      {tier.tierId === 1 ? (
        <div className="space-y-2">
          <Button
            variant="outline"
            className={`w-full font-display font-bold tracking-widest uppercase text-[10px] transition-smooth
              ${selected ? `${flavor.color} border-current bg-current/10` : "border-border/50"}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            data-ocid={`tier-select-btn-${tier.tierId}`}
          >
            Proceed to Payment — $6.99
            <ChevronRight className="w-3 h-3 ml-1" />
          </Button>
          <p className="font-mono text-[10px] text-muted-foreground/70 leading-snug text-center">
            New accounts receive the first 30 days free automatically at signup.
            All renewals are $6.99.
          </p>
        </div>
      ) : (
        <Button
          variant="outline"
          className={`w-full font-display font-bold tracking-widest uppercase text-[10px] transition-smooth
            ${selected ? `${flavor.color} border-current bg-current/10` : "border-border/50"}`}
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          data-ocid={`tier-select-btn-${tier.tierId}`}
        >
          {flavor.cta}
          <ChevronRight className="w-3 h-3 ml-1" />
        </Button>
      )}
    </motion.div>
  );
}

// ─── Stripe Payment Form ───────────────────────────────────────────────────────

interface StripeFormProps {
  clientSecret: string;
  paymentRecordId: number;
  finalAmountUSD: number;
  onSuccess: () => void;
  onFailure: (reason: string) => void;
}

function StripePaymentForm({
  clientSecret,
  paymentRecordId,
  finalAmountUSD,
  onSuccess,
  onFailure,
}: StripeFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const confirmPayment = useConfirmStripePayment();
  const failPayment = useFailStripePayment();

  const [submitting, setSubmitting] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);
  const [paymentRequest, setPaymentRequest] = useState<ReturnType<
    Stripe["paymentRequest"]
  > | null>(null);
  const [prAvailable, setPrAvailable] = useState(false);

  // Set up Payment Request (Apple Pay / Google Pay)
  useEffect(() => {
    if (!stripe || !clientSecret) return;

    const pr = stripe.paymentRequest({
      country: "US",
      currency: "usd",
      total: {
        label: "DeLorean Fuel — Tier Upgrade",
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
        await failPayment.mutateAsync({
          paymentRecordId,
          reason: error.message ?? "Payment request failed",
        });
        onFailure(error.message ?? "Payment failed");
        setSubmitting(false);
      } else if (paymentIntent?.status === "requires_action") {
        ev.complete("success");
        const { error: confirmError } =
          await stripe.confirmCardPayment(clientSecret);
        if (confirmError) {
          onFailure(confirmError.message ?? "3DS failed");
        } else {
          await confirmPayment.mutateAsync({
            paymentRecordId,
            stripePaymentIntentId: paymentIntent.id,
          });
          onSuccess();
        }
        setSubmitting(false);
      } else if (paymentIntent) {
        ev.complete("success");
        await confirmPayment.mutateAsync({
          paymentRecordId,
          stripePaymentIntentId: paymentIntent.id,
        });
        onSuccess();
        setSubmitting(false);
      }
    });
  }, [
    stripe,
    clientSecret,
    finalAmountUSD,
    paymentRecordId,
    confirmPayment,
    failPayment,
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
      await failPayment.mutateAsync({
        paymentRecordId,
        reason: error.message ?? "Card declined",
      });
      onFailure(error.message ?? "Payment failed");
    } else if (paymentIntent?.status === "succeeded") {
      await confirmPayment.mutateAsync({
        paymentRecordId,
        stripePaymentIntentId: paymentIntent.id,
      });
      onSuccess();
    }
    setSubmitting(false);
  }

  return (
    <div className="space-y-4">
      {/* Apple Pay / Google Pay */}
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

      {/* Card form */}
      <form onSubmit={handleCardSubmit} className="space-y-4">
        <div
          className="rounded-md border border-input bg-background px-3 py-3 focus-within:border-primary transition-colors"
          data-ocid="stripe-card-element"
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
          className="w-full font-display font-bold tracking-widest uppercase text-xs bg-primary hover:bg-primary/90 text-primary-foreground glow-blue-sm animate-time-bounce"
          data-ocid="stripe-pay-submit-btn"
        >
          <Zap className="w-3.5 h-3.5 mr-2" />
          {submitting
            ? "CHARGING FLUX CAPACITOR…"
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

// ─── Success Screen ────────────────────────────────────────────────────────────

function SuccessScreen({ newExpiration }: { newExpiration: number }) {
  const [showLightning, setShowLightning] = useState(true);
  const [showCar, setShowCar] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const t1 = setTimeout(() => {
      setShowLightning(false);
      setShowCar(true);
    }, 1400);
    const t2 = setTimeout(() => setShowCar(false), 2200);
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
        className="flex flex-col items-center gap-6 py-12 text-center"
        data-ocid="upgrade-success"
      >
        {/* Animated emoji car */}
        <motion.div
          animate={{ rotate: [0, -5, 5, -5, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-7xl"
        >
          🚗
        </motion.div>

        {/* Headline */}
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="font-display text-2xl sm:text-3xl font-black tracking-widest uppercase text-accent text-glow-yellow"
          >
            YOUR DELOREAN IS FUELED
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="font-display text-lg sm:text-xl font-bold tracking-widest uppercase text-accent/80 mt-1"
          >
            AND READY TO TRAVEL!
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="font-mono text-sm text-muted-foreground mt-2"
          >
            Time fuel added on top of your existing expiration
          </motion.p>
        </div>

        {/* New countdown */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="w-full max-w-lg"
        >
          <TimeCircuitsCountdown
            expirationDate={newExpiration}
            label="NEW TIME CIRCUITS — DESTINATION DATE"
          />
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="flex gap-3"
        >
          <Button
            onClick={() => navigate({ to: "/dashboard" })}
            className="font-display font-bold tracking-widest uppercase text-xs bg-accent text-accent-foreground hover:bg-accent/90 glow-yellow-sm"
            data-ocid="success-dashboard-btn"
          >
            GO TO DASHBOARD
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate({ to: "/import" })}
            className="font-display font-bold tracking-widest uppercase text-xs border-primary/40 text-primary hover:bg-primary/10"
            data-ocid="success-import-btn"
          >
            ADD LISTINGS
          </Button>
        </motion.div>
      </motion.div>
    </>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export function UpgradePage() {
  const { actor } = useActor(createActor);
  const { data: tiers = [], isLoading: tiersLoading } = useGetTiers();
  const { data: subscription } = useGetMySubscription();
  const initUpgrade = useInitiateTierUpgrade();

  // ─── Runtime Stripe key + price IDs from backend ────────────────────────────
  const [stripeKey, setStripeKey] = useState<string | null>(null);
  const [stripeKeyLoading, setStripeKeyLoading] = useState(true);
  const [tierPriceIds, setTierPriceIds] = useState<Record<number, string>>({});

  useEffect(() => {
    if (!actor) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const a = actor as any;

    // Fetch publishable key at runtime from backend config
    a.getStripePublicKey()
      .then((result: { publishableKey: string }) => {
        if (result?.publishableKey) {
          setStripeKey(result.publishableKey);
        }
      })
      .catch(() => {})
      .finally(() => setStripeKeyLoading(false));

    // Fetch subscription tier price IDs from backend config
    // Try both the canonical app_config key names and the PaymentConfig field names
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
        "stripe_price_walker",
        "stripeWalkerPriceId",
        "stripe_walker_price_id",
      ]),
      fetchPriceId([
        "stripe_price_traveler",
        "stripeProPriceId",
        "stripe_pro_price_id",
        "stripe_gas_traveler",
      ]),
      fetchPriceId([
        "stripe_price_lord",
        "stripeMaxPriceId",
        "stripe_max_price_id",
        "stripe_gas_lord",
      ]),
    ]).then(([walker, traveler, lord]) => {
      setTierPriceIds({
        1: walker,
        2: traveler,
        3: lord,
      });
    });
  }, [actor]);

  const stripePromise: Promise<Stripe | null> = stripeKey
    ? loadStripe(stripeKey)
    : Promise.resolve(null);

  const [selectedTierId, setSelectedTierId] = useState<number | null>(null);
  const [discountCode, setDiscountCode] = useState("");
  const [appliedCode, setAppliedCode] = useState("");
  const [checkoutPhase, setCheckoutPhase] = useState<
    "idle" | "loading" | "payment" | "success"
  >("idle");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentRecordId, setPaymentRecordId] = useState<number | null>(null);
  const [finalAmount] = useState(0);
  const [tierDurationDays, setTierDurationDays] = useState(0);
  const [stripeError, setStripeError] = useState<string | null>(null);

  const discountInputRef = useRef<HTMLInputElement>(null);

  const selectedTier = tiers.find((t) => t.tierId === selectedTierId);
  const isFree = selectedTier?.priceUSD === 0;

  const selectedTierDisplayPrice = selectedTier
    ? getTierDisplayPrice(selectedTier)
    : 0;

  const { data: discountData } = useValidateDiscountCode(
    appliedCode,
    selectedTierId ?? undefined,
    selectedTierDisplayPrice,
  );

  const computedFinalPrice =
    discountData?.valid && discountData.discountedPrice !== undefined
      ? discountData.discountedPrice
      : selectedTierDisplayPrice;

  const previewExpiration = subscription?.expirationDate
    ? subscription.expirationDate +
      (selectedTier?.durationDays ?? 0) * 86400 * 1000
    : Date.now() + (selectedTier?.durationDays ?? 30) * 86400 * 1000;

  const successExpiration =
    checkoutPhase === "success"
      ? subscription?.expirationDate
        ? subscription.expirationDate + tierDurationDays * 86400 * 1000
        : Date.now() + tierDurationDays * 86400 * 1000
      : Date.now();

  async function handleProceed() {
    if (!selectedTierId || !selectedTier) return;

    if (isFree) {
      setCheckoutPhase("loading");
      try {
        const result = await initUpgrade.mutateAsync({
          tierId: selectedTierId,
          discountCode: appliedCode || undefined,
        });
        setTierDurationDays(result.tierDurationDays);
        setCheckoutPhase("success");
      } catch {
        setStripeError("Failed to process tier upgrade. Please try again.");
        setCheckoutPhase("idle");
      }
      return;
    }

    setCheckoutPhase("loading");
    setStripeError(null);

    // Get price ID for the selected tier
    const priceId = tierPriceIds[selectedTierId] ?? "";
    if (!priceId) {
      toast.error(
        "Payment not configured. Please contact support or try again later.",
      );
      setCheckoutPhase("idle");
      return;
    }

    // Call canister directly — createStripeCheckoutSession returns #ok(sessionUrl) or #err(msg)
    try {
      const result = await (actor as ActorAny).createStripeCheckoutSession?.(
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
      // Redirect to Stripe Checkout — do NOT set success state here
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

  function handlePaymentSuccess() {
    setCheckoutPhase("success");
  }

  function handlePaymentFailure(reason: string) {
    setStripeError(reason);
    setCheckoutPhase("idle");
    setClientSecret(null);
    setPaymentRecordId(null);
  }

  const failPayment = useFailStripePayment();
  function handleCancelPayment() {
    if (paymentRecordId) {
      failPayment.mutate({ paymentRecordId, reason: "User cancelled" });
    }
    setCheckoutPhase("idle");
    setClientSecret(null);
    setPaymentRecordId(null);
    setStripeError(null);
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  if (checkoutPhase === "success") {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <SuccessScreen newExpiration={successExpiration} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div
        className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10"
        data-ocid="upgrade-page"
      >
        {/* Loading overlay */}
        <ClockAnimation active={checkoutPhase === "loading"} />

        {/* ── Hero ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full neon-border-yellow bg-accent/5">
            <span className="text-base">⚡</span>
            <span className="font-mono text-xs text-accent/90 tracking-widest uppercase">
              DeLorean Fuel Station
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-black tracking-widest uppercase text-foreground text-glow-blue">
            POWER UP YOUR DELOREAN
          </h1>
          <p className="font-mono text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Buy time fuel and push your listings further into the future.
            <br />
            More flux = more time on the clock.
          </p>
        </motion.div>

        {/* ── Current Status ── */}
        {subscription && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl bg-card/60 border border-border/40 p-4"
            data-ocid="current-status-panel"
          >
            <p className="font-display text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-3">
              CURRENT TIME CIRCUITS
            </p>
            <TimeCircuitsCountdown
              expirationDate={subscription.expirationDate}
              label="ACTIVE FUEL REMAINING"
            />
          </motion.div>
        )}

        {/* ── Tier Cards ── */}
        {tiersLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-72 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {tiers.map((tier, i) => (
              <motion.div
                key={tier.tierId}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.1 }}
              >
                <TierCard
                  tier={tier}
                  selected={selectedTierId === tier.tierId}
                  onSelect={() => {
                    setSelectedTierId(tier.tierId);
                    setStripeError(null);
                  }}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* ── Checkout Panel ── */}
        <AnimatePresence>
          {selectedTier &&
            (checkoutPhase === "idle" || checkoutPhase === "loading") && (
              <motion.div
                key="checkout"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="rounded-xl bg-card neon-border-blue p-6 space-y-6"
                data-ocid="checkout-panel"
              >
                {/* Time circuits preview */}
                <div className="space-y-2">
                  <p className="font-display text-[10px] font-bold tracking-[0.2em] uppercase text-primary/70">
                    DESTINATION TIME — AFTER UPGRADE
                  </p>
                  <TimeCircuitsCountdown
                    expirationDate={previewExpiration}
                    label="PROJECTED EXPIRATION"
                  />
                </div>

                {/* Discount code */}
                {!isFree && (
                  <div className="space-y-2">
                    <p className="font-display text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground">
                      DISCOUNT CODE
                    </p>
                    <div className="flex gap-2">
                      <Input
                        ref={discountInputRef}
                        placeholder="Enter flux discount code"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                        onBlur={() => {
                          if (discountCode.trim()) {
                            setAppliedCode(discountCode.trim().toUpperCase());
                          }
                        }}
                        className="font-mono text-xs bg-background border-border/50"
                        data-ocid="discount-code-input"
                      />
                      <Button
                        variant="outline"
                        className="font-mono text-xs shrink-0 border-border/50 hover:border-primary/50"
                        onClick={() => {
                          if (discountCode.trim()) {
                            setAppliedCode(discountCode.trim().toUpperCase());
                          }
                        }}
                        data-ocid="apply-discount-btn"
                      >
                        Apply
                      </Button>
                    </div>
                    {discountData?.valid && (
                      <p className="font-mono text-xs text-green-400 flex items-center gap-1.5">
                        <Check className="w-3 h-3" />
                        Code applied — you save $
                        {(
                          selectedTierDisplayPrice - computedFinalPrice
                        ).toFixed(2)}
                        !
                      </p>
                    )}
                    {appliedCode && discountData && !discountData.valid && (
                      <p className="font-mono text-xs text-destructive">
                        ✗ Invalid or expired code
                      </p>
                    )}
                  </div>
                )}

                {/* Price summary */}
                {!isFree && (
                  <div className="border-t border-border/30 pt-4 space-y-1.5">
                    <div className="flex justify-between font-mono text-xs text-muted-foreground">
                      <span>Subtotal</span>
                      <span>${selectedTierDisplayPrice.toFixed(2)}</span>
                    </div>
                    {discountData?.valid && (
                      <div className="flex justify-between font-mono text-xs text-green-400">
                        <span>Discount ({appliedCode})</span>
                        <span>
                          -$
                          {(
                            selectedTierDisplayPrice - computedFinalPrice
                          ).toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between font-display text-sm font-bold text-accent text-glow-yellow">
                      <span>TOTAL DUE</span>
                      <span>${computedFinalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                {stripeError && (
                  <p className="font-mono text-xs text-destructive bg-destructive/10 border border-destructive/30 rounded px-3 py-2">
                    ⚠ {stripeError}
                  </p>
                )}

                {/* Proceed CTA */}
                <Button
                  onClick={handleProceed}
                  disabled={
                    initUpgrade.isPending ||
                    checkoutPhase === "loading" ||
                    stripeKeyLoading
                  }
                  className="w-full font-display font-bold tracking-widest uppercase text-xs bg-accent text-accent-foreground hover:bg-accent/90 glow-yellow-sm"
                  data-ocid="proceed-to-payment-btn"
                >
                  {checkoutPhase === "loading" || stripeKeyLoading ? (
                    <>
                      <span className="inline-block w-3.5 h-3.5 mr-2 rounded-full border-2 border-accent-foreground/40 border-t-accent-foreground animate-spin" />
                      {stripeKeyLoading ? "LOADING…" : "REDIRECTING TO STRIPE…"}
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      {`PROCEED TO PAYMENT — $${computedFinalPrice.toFixed(2)}`}
                    </>
                  )}
                </Button>

                {/* Info badge */}
                <div className="flex justify-center">
                  <Badge
                    variant="outline"
                    className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground border-border/30"
                  >
                    ⚡ {selectedTier.durationDays} days added on top of current
                    expiry
                  </Badge>
                </div>

                {/* ── Alternative Payment Methods (Coming Soon) ── */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-border/30" />
                    <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                      or coming soon
                    </span>
                    <div className="flex-1 h-px bg-border/30" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* PayPal Coming Soon */}
                    <div className="relative group">
                      <Button
                        type="button"
                        variant="outline"
                        disabled
                        className="w-full h-11 border-border/40 text-muted-foreground/50 cursor-not-allowed opacity-60 gap-2 font-mono text-xs"
                        data-ocid="paypal-coming-soon-btn"
                        aria-label="PayPal payments coming soon"
                      >
                        <SiPaypal className="w-4 h-4 text-[#003087]/50" />
                        PayPal
                      </Button>
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 pointer-events-none">
                        <span className="bg-muted text-muted-foreground font-mono text-[8px] tracking-widest uppercase px-1.5 py-0.5 rounded border border-border/40 flex items-center gap-1">
                          <Lock className="w-2 h-2" />
                          Soon
                        </span>
                      </div>
                    </div>

                    {/* Crypto Coming Soon */}
                    <div className="relative group">
                      <Button
                        type="button"
                        variant="outline"
                        disabled
                        className="w-full h-11 border-border/40 text-muted-foreground/50 cursor-not-allowed opacity-60 gap-2 font-mono text-xs"
                        data-ocid="crypto-coming-soon-btn"
                        aria-label="Crypto payments coming soon"
                      >
                        <SiBitcoin className="w-4 h-4 text-[#F7931A]/50" />
                        Crypto
                      </Button>
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 pointer-events-none">
                        <span className="bg-muted text-muted-foreground font-mono text-[8px] tracking-widest uppercase px-1.5 py-0.5 rounded border border-border/40 flex items-center gap-1">
                          <Lock className="w-2 h-2" />
                          Soon
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          {/* ── Stripe Payment Panel ── */}
          {selectedTier &&
            checkoutPhase === "payment" &&
            clientSecret &&
            paymentRecordId !== null && (
              <motion.div
                key="payment-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="rounded-xl bg-card neon-border-yellow p-6 space-y-5"
                data-ocid="stripe-payment-panel"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-display text-[10px] font-bold tracking-[0.2em] uppercase text-accent/80">
                      FUEL STATION CHECKOUT
                    </p>
                    <h3 className="font-display text-lg font-black tracking-wider uppercase text-accent text-glow-yellow mt-0.5">
                      {TIER_FLAVOR[selectedTier.tierId]?.badge ??
                        selectedTier.name}
                    </h3>
                    <p className="font-mono text-xs text-muted-foreground">
                      {selectedTier.durationDays} days · $
                      {finalAmount.toFixed(2)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancelPayment}
                    className="font-mono text-xs text-muted-foreground hover:text-foreground"
                    data-ocid="cancel-payment-btn"
                  >
                    ← Back
                  </Button>
                </div>

                {/* Stripe Elements */}
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
                  <StripePaymentForm
                    clientSecret={clientSecret}
                    paymentRecordId={paymentRecordId}
                    finalAmountUSD={finalAmount}
                    onSuccess={handlePaymentSuccess}
                    onFailure={handlePaymentFailure}
                  />
                </Elements>
              </motion.div>
            )}
        </AnimatePresence>

        {/* ── No-stripe fallback notice ── */}
        {!stripeKeyLoading && !stripeKey && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-lg border border-accent/30 bg-accent/5 px-4 py-3"
          >
            <p className="font-mono text-xs text-accent/80">
              ⚠ Stripe not configured. Add your Stripe keys in{" "}
              <a href="/admin/payments" className="underline text-accent">
                Admin → Payments
              </a>{" "}
              to enable live payments.
            </p>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
