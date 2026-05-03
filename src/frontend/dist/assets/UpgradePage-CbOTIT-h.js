import { u as useActor, r as reactExports, j as jsxRuntimeExports, q as Layout, m as motion, S as Skeleton, s as Input, B as Button, Z as Zap, o as useNavigate, d as ue, y as Shield, e as createActor } from "./index-CDYDluDX.js";
import { l as loadStripe, E as Elements, u as useStripe, a as useElements, P as PaymentRequestButtonElement, C as CardElement } from "./index-Bxw2nbvT.js";
import { T as TimeCircuitsCountdown } from "./TimeCircuitsCountdown-CE8BHW6L.js";
import { C as CarAnimation } from "./CarAnimation-CsxzYjOf.js";
import { C as ClockAnimation } from "./ClockAnimation-rwc20G-d.js";
import { L as LightningAnimation } from "./LightningAnimation-Cx7KDAJK.js";
import { B as Badge } from "./badge-tMJODRQh.js";
import { u as useInitiateTierUpgrade, a as useValidateDiscountCode, b as useFailStripePayment, c as useConfirmStripePayment } from "./usePayments-tiFjNknt.js";
import { a as useGetTiers, u as useGetMySubscription } from "./useTiers-7_nHBRgX.js";
import { A as AnimatePresence } from "./index-XRn9Sjl6.js";
import { C as Check } from "./check-yvtMwp9K.js";
import { C as ChevronRight } from "./chevron-right-C9LphVzF.js";
import "./index-CZ3Ezh-d.js";
const TIER_FALLBACK_PRICES = {
  1: 6.99,
  2: 9.99,
  3: 19.99
};
function getTierDisplayPrice(tier) {
  const p = tier.priceUSD;
  if (p && p > 0) return p;
  return TIER_FALLBACK_PRICES[tier.tierId] ?? p;
}
const TIER_FLAVOR = {
  1: {
    badge: "TIME WALKER",
    headline: "$6.99 / 30 Days",
    fuelCopy: "Enough fuel for a quick trip",
    cta: "SELECT TIME WALKER",
    color: "text-primary",
    glowClass: "glow-blue",
    borderClass: "neon-border-blue"
  },
  2: {
    badge: "TIME TRAVELER",
    headline: "90 Days · $9.99",
    fuelCopy: "Long-haul chrono fuel",
    cta: "FUEL UP — $9.99",
    color: "text-accent",
    glowClass: "glow-yellow",
    borderClass: "neon-border-yellow"
  },
  3: {
    badge: "TIME LORD",
    headline: "6 Months · $19.99",
    fuelCopy: "Full flux capacitor charge",
    cta: "MAX POWER — $19.99",
    color: "text-green-400",
    glowClass: "glow-green",
    borderClass: "neon-border-green"
  }
};
const TIER_PERKS = {
  1: [
    "Up to 10 active listings",
    "30-day listing lifetime",
    "1-click copy any listing",
    "Basic time circuit display"
  ],
  2: [
    "Unlimited active listings",
    "90-day listing lifetime",
    "Priority copy speed",
    "Full BTTF time circuits"
  ],
  3: [
    "Unlimited active listings",
    "6-month listing lifetime",
    "Instant copy with history",
    "Max-power time circuits"
  ]
};
function TierCard({
  tier,
  selected,
  onSelect
}) {
  const flavor = TIER_FLAVOR[tier.tierId] ?? {
    badge: `TIER ${tier.tierId}`,
    headline: `${tier.durationDays} Days`,
    fuelCopy: "Custom fuel level",
    cta: "SELECT",
    color: "text-primary",
    glowClass: "glow-blue",
    borderClass: "neon-border-blue"
  };
  const perks = TIER_PERKS[tier.tierId] ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      whileHover: { scale: 1.03, y: -4 },
      whileTap: { scale: 0.98 },
      onClick: onSelect,
      className: `rounded-xl bg-card/70 p-5 cursor-pointer flex flex-col gap-3 relative overflow-hidden transition-smooth
        ${selected ? `${flavor.borderClass} ${flavor.glowClass}` : "border border-border/40 hover:border-primary/30"}`,
      "data-ocid": `tier-card-${tier.tierId}`,
      children: [
        selected && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center ${tier.tierId === 3 ? "bg-green-400" : tier.tierId === 2 ? "bg-accent" : "bg-primary"}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3 h-3 text-accent-foreground" })
          }
        ),
        tier.tierId === 2 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-1/2 -translate-x-1/2 -translate-y-px", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-accent text-accent-foreground font-display text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-b", children: "MOST POPULAR" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `font-display text-[10px] font-bold tracking-[0.25em] uppercase ${flavor.color}`,
              children: flavor.badge
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: `font-display text-lg font-black tracking-wider uppercase mt-0.5 ${flavor.color} ${selected ? tier.tierId === 1 ? "text-glow-blue" : tier.tierId === 2 ? "text-glow-yellow" : "text-glow-green" : ""}`,
              children: `$${getTierDisplayPrice(tier).toFixed(2)}`
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[11px] text-muted-foreground mt-0.5", children: [
            tier.durationDays,
            " days · ",
            flavor.fuelCopy
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1.5 flex-1", children: perks.map((perk) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: `w-3 h-3 mt-0.5 shrink-0 ${flavor.color}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[11px] text-foreground/80", children: perk })
        ] }, perk)) }),
        tier.tierId === 1 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              className: `w-full font-display font-bold tracking-widest uppercase text-[10px] transition-smooth
              ${selected ? `${flavor.color} border-current bg-current/10` : "border-border/50"}`,
              onClick: (e) => {
                e.stopPropagation();
                onSelect();
              },
              "data-ocid": `tier-select-btn-${tier.tierId}`,
              children: [
                "Proceed to Payment — $6.99",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3 h-3 ml-1" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-muted-foreground/70 leading-snug text-center", children: "New accounts receive the first 30 days free automatically at signup. All renewals are $6.99." })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            className: `w-full font-display font-bold tracking-widest uppercase text-[10px] transition-smooth
            ${selected ? `${flavor.color} border-current bg-current/10` : "border-border/50"}`,
            onClick: (e) => {
              e.stopPropagation();
              onSelect();
            },
            "data-ocid": `tier-select-btn-${tier.tierId}`,
            children: [
              flavor.cta,
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3 h-3 ml-1" })
            ]
          }
        )
      ]
    }
  );
}
function StripePaymentForm({
  clientSecret,
  paymentRecordId,
  finalAmountUSD,
  onSuccess,
  onFailure
}) {
  const stripe = useStripe();
  const elements = useElements();
  const confirmPayment = useConfirmStripePayment();
  const failPayment = useFailStripePayment();
  const [submitting, setSubmitting] = reactExports.useState(false);
  const [cardError, setCardError] = reactExports.useState(null);
  const [paymentRequest, setPaymentRequest] = reactExports.useState(null);
  const [prAvailable, setPrAvailable] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!stripe || !clientSecret) return;
    const pr = stripe.paymentRequest({
      country: "US",
      currency: "usd",
      total: {
        label: "DeLorean Fuel — Tier Upgrade",
        amount: Math.round(finalAmountUSD * 100)
      },
      requestPayerName: true,
      requestPayerEmail: true
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
        { handleActions: false }
      );
      if (error) {
        ev.complete("fail");
        await failPayment.mutateAsync({
          paymentRecordId,
          reason: error.message ?? "Payment request failed"
        });
        onFailure(error.message ?? "Payment failed");
        setSubmitting(false);
      } else if ((paymentIntent == null ? void 0 : paymentIntent.status) === "requires_action") {
        ev.complete("success");
        const { error: confirmError } = await stripe.confirmCardPayment(clientSecret);
        if (confirmError) {
          onFailure(confirmError.message ?? "3DS failed");
        } else {
          await confirmPayment.mutateAsync({
            paymentRecordId,
            stripePaymentIntentId: paymentIntent.id
          });
          onSuccess();
        }
        setSubmitting(false);
      } else if (paymentIntent) {
        ev.complete("success");
        await confirmPayment.mutateAsync({
          paymentRecordId,
          stripePaymentIntentId: paymentIntent.id
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
    onFailure
  ]);
  async function handleCardSubmit(e) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    setCardError(null);
    const card = elements.getElement(CardElement);
    if (!card) return;
    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      { payment_method: { card } }
    );
    if (error) {
      setCardError(error.message ?? "Payment failed");
      await failPayment.mutateAsync({
        paymentRecordId,
        reason: error.message ?? "Card declined"
      });
      onFailure(error.message ?? "Payment failed");
    } else if ((paymentIntent == null ? void 0 : paymentIntent.status) === "succeeded") {
      await confirmPayment.mutateAsync({
        paymentRecordId,
        stripePaymentIntentId: paymentIntent.id
      });
      onSuccess();
    }
    setSubmitting(false);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    prAvailable && paymentRequest && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground", children: "EXPRESS CHECKOUT" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        PaymentRequestButtonElement,
        {
          options: {
            paymentRequest,
            style: {
              paymentRequestButton: {
                type: "default",
                theme: "dark",
                height: "44px"
              }
            }
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 my-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-border/40" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-muted-foreground uppercase tracking-widest", children: "or pay by card" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-border/40" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleCardSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "rounded-md border border-input bg-background px-3 py-3 focus-within:border-primary transition-colors",
          "data-ocid": "stripe-card-element",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            CardElement,
            {
              options: {
                style: {
                  base: {
                    color: "oklch(0.95 0 0)",
                    fontFamily: "Space Grotesk, sans-serif",
                    fontSize: "14px",
                    "::placeholder": { color: "oklch(0.5 0 0)" },
                    iconColor: "oklch(0.65 0.22 262)"
                  },
                  invalid: {
                    color: "oklch(0.65 0.25 16)",
                    iconColor: "oklch(0.65 0.25 16)"
                  }
                }
              }
            }
          )
        }
      ),
      cardError && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xs text-destructive flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "⚠" }),
        " ",
        cardError
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "submit",
          disabled: submitting || !stripe,
          className: "w-full font-display font-bold tracking-widest uppercase text-xs bg-primary hover:bg-primary/90 text-primary-foreground glow-blue-sm animate-time-bounce",
          "data-ocid": "stripe-pay-submit-btn",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3.5 h-3.5 mr-2" }),
            submitting ? "CHARGING FLUX CAPACITOR…" : `PAY $${finalAmountUSD.toFixed(2)} · FUEL THE DELOREAN`
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center justify-center gap-1.5 font-mono text-[10px] text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-3 h-3" }),
        "Secured by Stripe · SSL encrypted"
      ] })
    ] })
  ] });
}
function SuccessScreen({ newExpiration }) {
  const [showLightning, setShowLightning] = reactExports.useState(true);
  const [showCar, setShowCar] = reactExports.useState(false);
  const navigate = useNavigate();
  reactExports.useEffect(() => {
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(LightningAnimation, { active: showLightning }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CarAnimation, { active: showCar }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        transition: { delay: 0.3, duration: 0.5 },
        className: "flex flex-col items-center gap-6 py-12 text-center",
        "data-ocid": "upgrade-success",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              animate: { rotate: [0, -5, 5, -5, 0], scale: [1, 1.1, 1] },
              transition: { duration: 0.6, delay: 0.4 },
              className: "text-7xl",
              children: "🚗"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.h2,
              {
                initial: { opacity: 0, y: 10 },
                animate: { opacity: 1, y: 0 },
                transition: { delay: 0.5 },
                className: "font-display text-2xl sm:text-3xl font-black tracking-widest uppercase text-accent text-glow-yellow",
                children: "YOUR DELOREAN IS FUELED"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.p,
              {
                initial: { opacity: 0, y: 10 },
                animate: { opacity: 1, y: 0 },
                transition: { delay: 0.65 },
                className: "font-display text-lg sm:text-xl font-bold tracking-widest uppercase text-accent/80 mt-1",
                children: "AND READY TO TRAVEL!"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.p,
              {
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                transition: { delay: 0.8 },
                className: "font-mono text-sm text-muted-foreground mt-2",
                children: "Time fuel added on top of your existing expiration"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, y: 16 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.9 },
              className: "w-full max-w-lg",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                TimeCircuitsCountdown,
                {
                  expirationDate: newExpiration,
                  label: "NEW TIME CIRCUITS — DESTINATION DATE"
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              transition: { delay: 1.1 },
              className: "flex gap-3",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    onClick: () => navigate({ to: "/dashboard" }),
                    className: "font-display font-bold tracking-widest uppercase text-xs bg-accent text-accent-foreground hover:bg-accent/90 glow-yellow-sm",
                    "data-ocid": "success-dashboard-btn",
                    children: "GO TO DASHBOARD"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "outline",
                    onClick: () => navigate({ to: "/import" }),
                    className: "font-display font-bold tracking-widest uppercase text-xs border-primary/40 text-primary hover:bg-primary/10",
                    "data-ocid": "success-import-btn",
                    children: "ADD LISTINGS"
                  }
                )
              ]
            }
          )
        ]
      }
    )
  ] });
}
function UpgradePage() {
  var _a;
  const { actor } = useActor(createActor);
  const { data: tiers = [], isLoading: tiersLoading } = useGetTiers();
  const { data: subscription } = useGetMySubscription();
  const initUpgrade = useInitiateTierUpgrade();
  const [stripeKey, setStripeKey] = reactExports.useState(null);
  const [stripeKeyLoading, setStripeKeyLoading] = reactExports.useState(true);
  const [tierPriceIds, setTierPriceIds] = reactExports.useState({});
  reactExports.useEffect(() => {
    if (!actor) return;
    const a = actor;
    a.getStripePublicKey().then((result) => {
      if (result == null ? void 0 : result.publishableKey) {
        setStripeKey(result.publishableKey);
      }
    }).catch(() => {
    }).finally(() => setStripeKeyLoading(false));
    const fetchPriceId = async (keys) => {
      for (const key of keys) {
        try {
          const val = await a.getConfig(key);
          if (val && typeof val === "string" && val.startsWith("price_"))
            return val;
        } catch {
        }
      }
      return "";
    };
    Promise.all([
      fetchPriceId([
        "stripe_price_walker",
        "stripeWalkerPriceId",
        "stripe_walker_price_id"
      ]),
      fetchPriceId([
        "stripe_price_traveler",
        "stripeProPriceId",
        "stripe_pro_price_id",
        "stripe_gas_traveler"
      ]),
      fetchPriceId([
        "stripe_price_lord",
        "stripeMaxPriceId",
        "stripe_max_price_id",
        "stripe_gas_lord"
      ])
    ]).then(([walker, traveler, lord]) => {
      setTierPriceIds({
        1: walker,
        2: traveler,
        3: lord
      });
    });
  }, [actor]);
  const stripePromise = stripeKey ? loadStripe(stripeKey) : Promise.resolve(null);
  const [selectedTierId, setSelectedTierId] = reactExports.useState(null);
  const [discountCode, setDiscountCode] = reactExports.useState("");
  const [appliedCode, setAppliedCode] = reactExports.useState("");
  const [checkoutPhase, setCheckoutPhase] = reactExports.useState("idle");
  const [clientSecret, setClientSecret] = reactExports.useState(null);
  const [paymentRecordId, setPaymentRecordId] = reactExports.useState(null);
  const [finalAmount] = reactExports.useState(0);
  const [tierDurationDays, setTierDurationDays] = reactExports.useState(0);
  const [stripeError, setStripeError] = reactExports.useState(null);
  const discountInputRef = reactExports.useRef(null);
  const selectedTier = tiers.find((t) => t.tierId === selectedTierId);
  const isFree = (selectedTier == null ? void 0 : selectedTier.priceUSD) === 0;
  const selectedTierDisplayPrice = selectedTier ? getTierDisplayPrice(selectedTier) : 0;
  const { data: discountData } = useValidateDiscountCode(
    appliedCode,
    selectedTierId ?? void 0,
    selectedTierDisplayPrice
  );
  const computedFinalPrice = (discountData == null ? void 0 : discountData.valid) && discountData.discountedPrice !== void 0 ? discountData.discountedPrice : selectedTierDisplayPrice;
  const previewExpiration = (subscription == null ? void 0 : subscription.expirationDate) ? subscription.expirationDate + ((selectedTier == null ? void 0 : selectedTier.durationDays) ?? 0) * 86400 * 1e3 : Date.now() + ((selectedTier == null ? void 0 : selectedTier.durationDays) ?? 30) * 86400 * 1e3;
  const successExpiration = checkoutPhase === "success" ? (subscription == null ? void 0 : subscription.expirationDate) ? subscription.expirationDate + tierDurationDays * 86400 * 1e3 : Date.now() + tierDurationDays * 86400 * 1e3 : Date.now();
  async function handleProceed() {
    var _a2;
    if (!selectedTierId || !selectedTier) return;
    if (isFree) {
      setCheckoutPhase("loading");
      try {
        const result = await initUpgrade.mutateAsync({
          tierId: selectedTierId,
          discountCode: appliedCode || void 0
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
    const priceId = tierPriceIds[selectedTierId] ?? "";
    if (!priceId) {
      ue.error(
        "Payment not configured. Please contact support or try again later."
      );
      setCheckoutPhase("idle");
      return;
    }
    try {
      const result = await ((_a2 = actor.createStripeCheckoutSession) == null ? void 0 : _a2.call(
        actor,
        priceId,
        ""
      ));
      if (!result) {
        ue.error("Payment setup failed. Please try again.");
        setCheckoutPhase("idle");
        return;
      }
      if (result.__kind__ === "err") {
        ue.error(
          result.err || "Payment setup failed. Please try again."
        );
        setCheckoutPhase("idle");
        return;
      }
      window.location.href = result.ok;
    } catch (err) {
      ue.error(
        err instanceof Error ? err.message : "Payment setup failed. Please try again."
      );
      setCheckoutPhase("idle");
    }
  }
  function handlePaymentSuccess() {
    setCheckoutPhase("success");
  }
  function handlePaymentFailure(reason) {
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
  if (checkoutPhase === "success") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-3xl mx-auto px-4 sm:px-6 py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SuccessScreen, { newExpiration: successExpiration }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10",
      "data-ocid": "upgrade-page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ClockAnimation, { active: checkoutPhase === "loading" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: -20 },
            animate: { opacity: 1, y: 0 },
            className: "text-center space-y-3",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 px-4 py-1.5 rounded-full neon-border-yellow bg-accent/5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base", children: "⚡" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-accent/90 tracking-widest uppercase", children: "DeLorean Fuel Station" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl sm:text-4xl font-black tracking-widest uppercase text-foreground text-glow-blue", children: "POWER UP YOUR DELOREAN" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-sm text-muted-foreground max-w-md mx-auto leading-relaxed", children: [
                "Buy time fuel and push your listings further into the future.",
                /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                "More flux = more time on the clock."
              ] })
            ]
          }
        ),
        subscription && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.1 },
            className: "rounded-xl bg-card/60 border border-border/40 p-4",
            "data-ocid": "current-status-panel",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-3", children: "CURRENT TIME CIRCUITS" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                TimeCircuitsCountdown,
                {
                  expirationDate: subscription.expirationDate,
                  label: "ACTIVE FUEL REMAINING"
                }
              )
            ]
          }
        ),
        tiersLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-72 rounded-xl" }, i)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: tiers.map((tier, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 24 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.15 + i * 0.1 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              TierCard,
              {
                tier,
                selected: selectedTierId === tier.tierId,
                onSelect: () => {
                  setSelectedTierId(tier.tierId);
                  setStripeError(null);
                }
              }
            )
          },
          tier.tierId
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatePresence, { children: [
          selectedTier && (checkoutPhase === "idle" || checkoutPhase === "loading") && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: -10 },
              className: "rounded-xl bg-card neon-border-blue p-6 space-y-6",
              "data-ocid": "checkout-panel",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-[10px] font-bold tracking-[0.2em] uppercase text-primary/70", children: "DESTINATION TIME — AFTER UPGRADE" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    TimeCircuitsCountdown,
                    {
                      expirationDate: previewExpiration,
                      label: "PROJECTED EXPIRATION"
                    }
                  )
                ] }),
                !isFree && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground", children: "DISCOUNT CODE" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        ref: discountInputRef,
                        placeholder: "Enter flux discount code",
                        value: discountCode,
                        onChange: (e) => setDiscountCode(e.target.value),
                        onBlur: () => {
                          if (discountCode.trim()) {
                            setAppliedCode(discountCode.trim().toUpperCase());
                          }
                        },
                        className: "font-mono text-xs bg-background border-border/50",
                        "data-ocid": "discount-code-input"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "outline",
                        className: "font-mono text-xs shrink-0 border-border/50 hover:border-primary/50",
                        onClick: () => {
                          if (discountCode.trim()) {
                            setAppliedCode(discountCode.trim().toUpperCase());
                          }
                        },
                        "data-ocid": "apply-discount-btn",
                        children: "Apply"
                      }
                    )
                  ] }),
                  (discountData == null ? void 0 : discountData.valid) && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xs text-green-400 flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3 h-3" }),
                    "Code applied — you save $",
                    (selectedTierDisplayPrice - computedFinalPrice).toFixed(2),
                    "!"
                  ] }),
                  appliedCode && discountData && !discountData.valid && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-destructive", children: "✗ Invalid or expired code" })
                ] }),
                !isFree && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border/30 pt-4 space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between font-mono text-xs text-muted-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Subtotal" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "$",
                      selectedTierDisplayPrice.toFixed(2)
                    ] })
                  ] }),
                  (discountData == null ? void 0 : discountData.valid) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between font-mono text-xs text-green-400", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "Discount (",
                      appliedCode,
                      ")"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "-$",
                      (selectedTierDisplayPrice - computedFinalPrice).toFixed(2)
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between font-display text-sm font-bold text-accent text-glow-yellow", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "TOTAL DUE" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "$",
                      computedFinalPrice.toFixed(2)
                    ] })
                  ] })
                ] }),
                stripeError && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xs text-destructive bg-destructive/10 border border-destructive/30 rounded px-3 py-2", children: [
                  "⚠ ",
                  stripeError
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    onClick: handleProceed,
                    disabled: initUpgrade.isPending || checkoutPhase === "loading" || stripeKeyLoading,
                    className: "w-full font-display font-bold tracking-widest uppercase text-xs bg-accent text-accent-foreground hover:bg-accent/90 glow-yellow-sm",
                    "data-ocid": "proceed-to-payment-btn",
                    children: checkoutPhase === "loading" || stripeKeyLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block w-3.5 h-3.5 mr-2 rounded-full border-2 border-accent-foreground/40 border-t-accent-foreground animate-spin" }),
                      stripeKeyLoading ? "LOADING…" : "REDIRECTING TO STRIPE…"
                    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4 mr-2" }),
                      `PROCEED TO PAYMENT — $${computedFinalPrice.toFixed(2)}`
                    ] })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Badge,
                  {
                    variant: "outline",
                    className: "font-mono text-[10px] tracking-widest uppercase text-muted-foreground border-border/30",
                    children: [
                      "⚡ ",
                      selectedTier.durationDays,
                      " days added on top of current expiry"
                    ]
                  }
                ) })
              ]
            },
            "checkout"
          ),
          selectedTier && checkoutPhase === "payment" && clientSecret && paymentRecordId !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: -10 },
              className: "rounded-xl bg-card neon-border-yellow p-6 space-y-5",
              "data-ocid": "stripe-payment-panel",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-[10px] font-bold tracking-[0.2em] uppercase text-accent/80", children: "FUEL STATION CHECKOUT" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg font-black tracking-wider uppercase text-accent text-glow-yellow mt-0.5", children: ((_a = TIER_FLAVOR[selectedTier.tierId]) == null ? void 0 : _a.badge) ?? selectedTier.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xs text-muted-foreground", children: [
                      selectedTier.durationDays,
                      " days · $",
                      finalAmount.toFixed(2)
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "ghost",
                      size: "sm",
                      onClick: handleCancelPayment,
                      className: "font-mono text-xs text-muted-foreground hover:text-foreground",
                      "data-ocid": "cancel-payment-btn",
                      children: "← Back"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Elements,
                  {
                    stripe: stripePromise,
                    options: {
                      clientSecret,
                      appearance: {
                        theme: "night",
                        variables: {
                          colorPrimary: "oklch(0.65 0.22 262)",
                          colorBackground: "oklch(0.16 0 0)",
                          colorText: "oklch(0.95 0 0)",
                          colorDanger: "oklch(0.65 0.25 16)",
                          fontFamily: "Space Grotesk, sans-serif",
                          borderRadius: "6px"
                        }
                      }
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      StripePaymentForm,
                      {
                        clientSecret,
                        paymentRecordId,
                        finalAmountUSD: finalAmount,
                        onSuccess: handlePaymentSuccess,
                        onFailure: handlePaymentFailure
                      }
                    )
                  }
                )
              ]
            },
            "payment-form"
          )
        ] }),
        !stripeKeyLoading && !stripeKey && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            className: "rounded-lg border border-accent/30 bg-accent/5 px-4 py-3",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xs text-accent/80", children: [
              "⚠ Stripe not configured. Add your Stripe keys in",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/admin/payments", className: "underline text-accent", children: "Admin → Payments" }),
              " ",
              "to enable live payments."
            ] })
          }
        )
      ]
    }
  ) });
}
export {
  UpgradePage
};
