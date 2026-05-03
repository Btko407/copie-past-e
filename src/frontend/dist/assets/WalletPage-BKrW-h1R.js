import { b as useActor, k as useAuth, l as useQuery, d as useQueryClient, e as useMutation, f as createActor, z as useGetMyGasWallet, D as useGetGasPackages, F as useGetMyGasPurchases, G as useInitiateGasPurchase, H as useSetAutoRenewal, r as reactExports, J as useFailGasPurchase, j as jsxRuntimeExports, p as Layout, m as motion, B as Button, S as Skeleton, K as Fuel, Z as Zap, y as Shield, a as ue, N as useConfirmGasPurchase } from "./index-Usp6K9eu.js";
import { l as loadStripe, E as Elements, u as useStripe, a as useElements, P as PaymentRequestButtonElement, C as CardElement } from "./index-GfYNSwfG.js";
import { c as computeFuelFromExpiry, G as GasFuelTank } from "./GasFuelTank-CHHzCcV4.js";
import { T as TimeCircuitsCountdown } from "./TimeCircuitsCountdown-CQVi1JLN.js";
import { C as CarAnimation } from "./CarAnimation-DLzczE1t.js";
import { L as LightningAnimation } from "./LightningAnimation-CSuhILSY.js";
import { B as Badge } from "./badge-GfO8jzh5.js";
import { S as Switch } from "./switch--0_L0vq2.js";
import { b as useCreateStripePortalSession } from "./useStripePayments-Ds3rwiB1.js";
import { u as useGetMySubscription } from "./useTiers-BZR7q9CQ.js";
import { A as AnimatePresence } from "./index-D-ZF4IHc.js";
import { E as ExternalLink } from "./external-link-Djp2Qgky.js";
import { C as ChevronUp } from "./chevron-up-C-YeK86K.js";
import { C as ChevronDown } from "./chevron-down-BBFFZ7Ey.js";
import "./index-CIEyaLGf.js";
import "./index-B5c87PCr.js";
import "./index-Hoduuafa.js";
function useGetLoyaltyStatus() {
  const { actor, isFetching } = useActor(createActor);
  const { principalId, authReady } = useAuth();
  return useQuery({
    queryKey: ["loyaltyStatus", principalId],
    queryFn: async () => {
      if (!actor) return null;
      try {
        const result = await actor.getLoyaltyStatus();
        if (!result) return null;
        const data = "ok" in result ? result.ok : result;
        return {
          refuelCount: Number(data.refuelCount ?? 0),
          rewardClaimedForTiers: Array.isArray(data.rewardClaimedForTiers) ? data.rewardClaimedForTiers.map(String) : [],
          currentTier: String(data.currentTier ?? "")
        };
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching && authReady && !!principalId,
    staleTime: 3e4
  });
}
function useGetRefuelHistory() {
  const { actor, isFetching } = useActor(createActor);
  const { principalId, authReady } = useAuth();
  return useQuery({
    queryKey: ["refuelHistory", principalId],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const raw = await actor.getRefuelHistory();
        if (!Array.isArray(raw)) return [];
        return raw.map((entry) => ({
          date: Number(entry.date ?? entry.createdAt ?? 0),
          tier: String(entry.tier ?? entry.tierName ?? ""),
          rewardClaimed: Boolean(entry.rewardClaimed ?? false)
        }));
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching && authReady && !!principalId,
    staleTime: 6e4
  });
}
function useClaimLoyaltyReward() {
  const { actor } = useActor(createActor);
  const { principalId } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.claimLoyaltyReward();
      if (result && "err" in result) throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["loyaltyStatus", principalId]
      });
      queryClient.invalidateQueries({
        queryKey: ["refuelHistory", principalId]
      });
      queryClient.invalidateQueries({ queryKey: ["mySubscription"] });
    }
  });
}
const LOYALTY_THRESHOLDS = {
  "Time Walker": 3,
  "Time Traveler": 2,
  "Time Lord": 1
};
function isLoyaltyRewardAvailable(status) {
  const threshold = LOYALTY_THRESHOLDS[status.currentTier];
  if (threshold === void 0) return false;
  const alreadyClaimed = status.rewardClaimedForTiers.includes(
    status.currentTier
  );
  return !alreadyClaimed && status.refuelCount >= threshold;
}
const GAS_TIERS = [
  {
    id: 1,
    name: "Starter Gas",
    tierName: "TIME WALKER",
    days: 30,
    price: 6.99,
    tagline: "30-day time fuel"
  },
  {
    id: 2,
    name: "Road Trip Gas",
    tierName: "TIME TRAVELER",
    days: 90,
    price: 9.99,
    tagline: "90-day time fuel",
    popular: true
  },
  {
    id: 3,
    name: "Full Tank Gas",
    tierName: "TIME LORD",
    days: 180,
    price: 19.99,
    tagline: "180-day time fuel"
  }
];
const AUTO_RENEW_NAMES = {
  1: "TIME WALKER",
  2: "TIME TRAVELER",
  3: "TIME LORD"
};
function statusLabel(status) {
  if ("completed" in status) return "Completed";
  if ("failed" in status) return "Failed";
  return "Pending";
}
function statusColor(status) {
  if ("completed" in status) return "text-green-400";
  if ("failed" in status) return "text-destructive";
  return "text-accent";
}
function formatDate(ts) {
  const ms = typeof ts === "bigint" ? Number(ts) : ts;
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
function GasTierCard({
  tier,
  selected,
  onSelect
}) {
  const borderClass = selected ? tier.id === 3 ? "neon-border-green" : tier.id === 2 ? "neon-border-yellow" : "neon-border-blue" : "border border-border/40 hover:border-primary/40";
  const priceColor = tier.id === 3 ? "text-green-400" : tier.id === 2 ? "text-accent" : "text-primary";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.button,
    {
      type: "button",
      whileHover: { scale: 1.04, y: -4 },
      whileTap: { scale: 0.97 },
      onClick: onSelect,
      className: `w-full rounded-xl p-5 text-left flex flex-col gap-3 relative overflow-hidden transition-smooth cursor-pointer
        ${selected ? `${borderClass} bg-card/90` : `bg-card/60 ${borderClass}`}`,
      "data-ocid": `gas-tier-${tier.id}`,
      children: [
        tier.popular && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-1/2 -translate-x-1/2 -translate-y-px", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-accent text-accent-foreground font-display text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-b", children: "MOST POPULAR" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground pt-1", children: tier.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "p",
            {
              className: `font-display text-3xl font-black tracking-wide ${priceColor} ${selected ? "text-glow-blue" : ""}`,
              children: [
                "$",
                tier.price.toFixed(2)
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xs text-muted-foreground mt-0.5", children: [
            tier.tierName,
            " · ",
            tier.days,
            " days"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-muted-foreground/60 mt-0.5", children: tier.tagline })
        ] }),
        selected && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { scale: 0 },
            animate: { scale: 1 },
            className: "absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3 h-3 text-primary-foreground" })
          }
        )
      ]
    }
  );
}
function GasStripeForm({
  clientSecret,
  purchaseRecordId,
  finalAmountUSD,
  gasAmount,
  onSuccess,
  onFailure
}) {
  const stripe = useStripe();
  const elements = useElements();
  const confirmGasPurchase = useConfirmGasPurchase();
  const failGasPurchase = useFailGasPurchase();
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
        label: `DeLorean Gas — ${gasAmount} days`,
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
        await failGasPurchase.mutateAsync({ purchaseRecordId });
        onFailure(error.message ?? "Payment failed");
        setSubmitting(false);
      } else if ((paymentIntent == null ? void 0 : paymentIntent.status) === "requires_action") {
        ev.complete("success");
        const { error: confirmError } = await stripe.confirmCardPayment(clientSecret);
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
      await failGasPurchase.mutateAsync({ purchaseRecordId });
      onFailure(error.message ?? "Card declined");
    } else if ((paymentIntent == null ? void 0 : paymentIntent.status) === "succeeded") {
      await confirmGasPurchase.mutateAsync({ purchaseRecordId });
      onSuccess(gasAmount);
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
          "data-ocid": "gas-stripe-card-element",
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
          className: "w-full font-display font-bold tracking-widest uppercase text-xs bg-primary hover:bg-primary/90 text-primary-foreground glow-blue-sm",
          "data-ocid": "gas-pay-submit-btn",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3.5 h-3.5 mr-2" }),
            submitting ? "FUELING UP THE DELOREAN…" : `PAY $${finalAmountUSD.toFixed(2)} · FUEL THE DELOREAN`
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
function FreeGasSuccessOverlay({
  newExpiration,
  onClose
}) {
  const [showLightning, setShowLightning] = reactExports.useState(true);
  const [showCar, setShowCar] = reactExports.useState(false);
  reactExports.useEffect(() => {
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(LightningAnimation, { active: showLightning }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CarAnimation, { active: showCar }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        transition: { delay: 0.3, duration: 0.5 },
        className: "fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm px-4",
        "data-ocid": "free-gas-success-overlay",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-lg w-full flex flex-col items-center gap-6 py-12 text-center bg-card rounded-2xl neon-border-blue p-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              animate: { rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] },
              transition: { duration: 0.7, delay: 0.4 },
              className: "text-7xl",
              children: "⛽"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.h2,
              {
                initial: { opacity: 0, y: 10 },
                animate: { opacity: 1, y: 0 },
                transition: { delay: 0.5 },
                className: "font-display text-2xl font-black tracking-widest uppercase text-accent text-glow-yellow",
                children: "FREE GAS ACTIVATED!"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.p,
              {
                initial: { opacity: 0, y: 10 },
                animate: { opacity: 1, y: 0 },
                transition: { delay: 0.65 },
                className: "font-mono text-sm text-muted-foreground mt-2",
                children: "30 free days added to your subscription"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 16 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.9 },
              className: "w-full",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-[10px] font-bold tracking-[0.2em] uppercase text-primary/70 mb-2", children: "DESTINATION TIME — AFTER UPGRADE" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  TimeCircuitsCountdown,
                  {
                    expirationDate: newExpiration,
                    label: "NEW TIME CIRCUITS — DESTINATION DATE"
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              transition: { delay: 1.1 },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  onClick: onClose,
                  className: "font-display font-bold tracking-widest uppercase text-xs bg-primary text-primary-foreground hover:bg-primary/90 glow-blue-sm",
                  "data-ocid": "free-gas-close-btn",
                  children: "BACK TO GAS WALLET"
                }
              )
            }
          )
        ] })
      }
    )
  ] });
}
function WalletPage() {
  const { actor } = useActor(createActor);
  const { data: wallet, isLoading: walletLoading } = useGetMyGasWallet();
  const { isLoading: packagesLoading } = useGetGasPackages();
  const { data: purchases = [], isLoading: purchasesLoading } = useGetMyGasPurchases();
  const { data: subscription } = useGetMySubscription();
  const { data: loyaltyStatus } = useGetLoyaltyStatus();
  const { data: refuelHistory = [], isLoading: refuelLoading } = useGetRefuelHistory();
  const claimLoyaltyReward = useClaimLoyaltyReward();
  const initiateGasPurchase = useInitiateGasPurchase();
  const setAutoRenewal = useSetAutoRenewal();
  const portalSession = useCreateStripePortalSession();
  const [stripeKey, setStripeKey] = reactExports.useState(null);
  const [stripeKeyLoading, setStripeKeyLoading] = reactExports.useState(true);
  const [gasPriceIds, setGasPriceIds] = reactExports.useState({});
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
        "stripe_gas_walker",
        "stripe_price_walker",
        "stripeGasWalkerPriceId",
        "stripeWalkerPriceId"
      ]),
      fetchPriceId([
        "stripe_gas_traveler",
        "stripe_price_traveler",
        "stripeGasTravelerPriceId",
        "stripeProPriceId"
      ]),
      fetchPriceId([
        "stripe_gas_lord",
        "stripe_price_lord",
        "stripeGasLordPriceId",
        "stripeMaxPriceId"
      ])
    ]).then(([walker, traveler, lord]) => {
      setGasPriceIds({
        1: walker,
        2: traveler,
        3: lord
      });
    });
  }, [actor]);
  const stripePromise = stripeKey ? loadStripe(stripeKey) : Promise.resolve(null);
  const [selectedGasTierId, setSelectedGasTierId] = reactExports.useState(
    null
  );
  const [checkoutPhase, setCheckoutPhase] = reactExports.useState("idle");
  const [clientSecret, setClientSecret] = reactExports.useState(null);
  const [purchaseRecordId, setPurchaseRecordId] = reactExports.useState(null);
  const [purchasedGasAmount, setPurchasedGasAmount] = reactExports.useState(0);
  const [finalAmount] = reactExports.useState(0);
  const [historyOpen, setHistoryOpen] = reactExports.useState(false);
  const [refuelHistoryOpen, setRefuelHistoryOpen] = reactExports.useState(false);
  const [autoRenewalEnabled, setAutoRenewalEnabled] = reactExports.useState(
    (wallet == null ? void 0 : wallet.autoRenewal) ?? false
  );
  const [autoRenewalTierId, setAutoRenewalTierId] = reactExports.useState(
    (wallet == null ? void 0 : wallet.autoRenewalTierId) ?? 2
  );
  const [showFreeGasSuccess, setShowFreeGasSuccess] = reactExports.useState(false);
  const [freeGasExpiration, setFreeGasExpiration] = reactExports.useState(0);
  reactExports.useEffect(() => {
    if (wallet) {
      setAutoRenewalEnabled(wallet.autoRenewal);
      setAutoRenewalTierId(wallet.autoRenewalTierId || 2);
    }
  }, [wallet]);
  const subTier = subscription ? Math.max(1, Math.min(3, Number(subscription.tier))) : 1;
  const subExpiryMs = (subscription == null ? void 0 : subscription.expirationDate) ?? 0;
  const { fuelPercent, daysRemaining } = subExpiryMs > 0 ? computeFuelFromExpiry(subExpiryMs, subTier) : { fuelPercent: 0, daysRemaining: 0 };
  const loyaltyAvailable = loyaltyStatus != null && isLoyaltyRewardAvailable(loyaltyStatus);
  const loyaltyThreshold = loyaltyStatus ? LOYALTY_THRESHOLDS[loyaltyStatus.currentTier] ?? 0 : 0;
  const selectedGasTier = GAS_TIERS.find((t) => t.id === selectedGasTierId);
  async function handleBuyGas() {
    var _a;
    if (!selectedGasTierId || !selectedGasTier) return;
    setCheckoutPhase("loading");
    const priceId = gasPriceIds[selectedGasTierId] ?? "";
    if (!priceId) {
      ue.error(
        "Payment not configured. Please contact support or try again later."
      );
      setCheckoutPhase("idle");
      return;
    }
    try {
      const result = await ((_a = actor.createStripeCheckoutSession) == null ? void 0 : _a.call(
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
  function handlePaymentSuccess(gasAmount) {
    setPurchasedGasAmount(gasAmount);
    setCheckoutPhase("success");
    ue.success("DeLorean fueled up! Subscription time added.");
  }
  function handlePaymentFailure(reason) {
    ue.error(`Purchase failed. ${reason}`);
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
  async function handleAutoRenewalToggle(enabled) {
    setAutoRenewalEnabled(enabled);
    try {
      await setAutoRenewal.mutateAsync({ enabled, tierId: autoRenewalTierId });
      ue.success(
        enabled ? "Auto-renewal enabled." : "Auto-renewal disabled."
      );
    } catch {
      setAutoRenewalEnabled(!enabled);
      ue.error("Failed to update auto-renewal.");
    }
  }
  async function handleAutoRenewalTierChange(tierId) {
    setAutoRenewalTierId(tierId);
    if (autoRenewalEnabled) {
      try {
        await setAutoRenewal.mutateAsync({ enabled: true, tierId });
        ue.success("Auto-renewal tier updated.");
      } catch {
        ue.error("Failed to update tier.");
      }
    }
  }
  async function handleClaimFreeGas() {
    try {
      await claimLoyaltyReward.mutateAsync();
      const newExp = (subscription == null ? void 0 : subscription.expirationDate) ? subscription.expirationDate + 30 * 86400 * 1e3 : Date.now() + 30 * 86400 * 1e3;
      setFreeGasExpiration(newExp);
      setShowFreeGasSuccess(true);
      ue.success("Free 30 days added to your subscription!");
    } catch {
      ue.error("Failed to claim free gas. Try again.");
    }
  }
  if (checkoutPhase === "success") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto px-4 py-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CarAnimation, { active: true }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          transition: { delay: 0.3, duration: 0.5 },
          className: "flex flex-col items-center gap-6 py-12 text-center",
          "data-ocid": "gas-purchase-success",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                animate: { rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] },
                transition: { duration: 0.7, delay: 0.4 },
                className: "text-7xl",
                children: "⛽"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl font-black tracking-widest uppercase text-primary text-glow-blue", children: "FUELED UP!" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xl font-bold tracking-widest uppercase text-accent text-glow-yellow mt-1", children: "SUBSCRIPTION TIME ADDED" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm text-muted-foreground mt-2", children: "Your DeLorean is ready for another time jump." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              GasFuelTank,
              {
                expirationDate: subExpiryMs > 0 ? subExpiryMs + purchasedGasAmount * 864e5 : Date.now() + purchasedGasAmount * 864e5,
                tier: subTier
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: () => setCheckoutPhase("idle"),
                className: "font-display font-bold tracking-widest uppercase text-xs bg-primary text-primary-foreground hover:bg-primary/90 glow-blue-sm",
                "data-ocid": "gas-success-wallet-btn",
                children: "BACK TO WALLET"
              }
            ) })
          ]
        }
      )
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    showFreeGasSuccess && /* @__PURE__ */ jsxRuntimeExports.jsx(
      FreeGasSuccessOverlay,
      {
        newExpiration: freeGasExpiration,
        onClose: () => setShowFreeGasSuccess(false)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10",
        "data-ocid": "wallet-page",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: -16 },
              animate: { opacity: 1, y: 0 },
              className: "text-center space-y-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 px-4 py-1.5 rounded-full neon-border-blue bg-primary/5 mb-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base", children: "⛽" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-primary/90 tracking-widest uppercase", children: "DeLorean Gas Station" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl sm:text-4xl font-black tracking-widest uppercase text-foreground text-glow-blue", children: "GAS WALLET" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm text-muted-foreground max-w-md mx-auto", children: "Fuel your DeLorean. Keep your listings alive." })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 16 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.1 },
              className: "rounded-xl bg-card neon-border-blue p-6 flex flex-col sm:flex-row items-center gap-8",
              "data-ocid": "gas-balance-panel",
              children: [
                walletLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-28 h-52 rounded-xl" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                  GasFuelTank,
                  {
                    expirationDate: subExpiryMs,
                    tier: subTier,
                    size: "lg"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-3 text-center sm:text-left", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-[10px] font-bold tracking-[0.25em] uppercase text-muted-foreground", children: "CURRENT FUEL LEVEL" }),
                  walletLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 w-48 rounded-lg" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "p",
                      {
                        className: "font-display text-5xl font-black tracking-widest text-primary text-glow-blue",
                        "data-ocid": "fuel-level-display",
                        children: [
                          fuelPercent,
                          "%"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display text-lg font-bold tracking-widest text-primary/60 uppercase", children: [
                      daysRemaining,
                      "d remaining"
                    ] })
                  ] }),
                  subscription && !walletLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-background/60 border border-border/30 px-4 py-3 mt-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-2", children: "TIME CIRCUITS" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      TimeCircuitsCountdown,
                      {
                        expirationDate: subscription.expirationDate,
                        label: "SUBSCRIPTION EXPIRES",
                        compact: true
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 justify-center sm:justify-start", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Badge,
                      {
                        variant: "outline",
                        className: "font-mono text-[10px] tracking-widest border-border/30 text-muted-foreground",
                        children: "Starter Gas = $6.99 · 30d"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Badge,
                      {
                        variant: "outline",
                        className: "font-mono text-[10px] tracking-widest border-border/30 text-muted-foreground",
                        children: "Road Trip = $9.99 · 90d"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Badge,
                      {
                        variant: "outline",
                        className: "font-mono text-[10px] tracking-widest border-border/30 text-muted-foreground",
                        children: "Full Tank = $19.99 · 180d"
                      }
                    )
                  ] })
                ] })
              ]
            }
          ),
          loyaltyAvailable && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, scale: 0.95 },
              animate: { opacity: 1, scale: 1 },
              className: "rounded-xl neon-border-yellow bg-accent/5 p-6 flex flex-col sm:flex-row items-center gap-5",
              "data-ocid": "loyalty-free-gas-banner",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl", children: "🏆" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 text-center sm:text-left", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-[10px] font-bold tracking-[0.2em] uppercase text-accent/80", children: "LOYALTY REWARD UNLOCKED" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg font-black tracking-widest uppercase text-accent text-glow-yellow", children: "You've earned free gas!" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xs text-muted-foreground mt-0.5", children: [
                    "Refueled ",
                    (loyaltyStatus == null ? void 0 : loyaltyStatus.refuelCount) ?? 0,
                    " times (threshold:",
                    " ",
                    loyaltyThreshold,
                    ") · Claim 30 free days now"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    onClick: handleClaimFreeGas,
                    disabled: claimLoyaltyReward.isPending,
                    className: "font-display font-bold tracking-widest uppercase text-xs bg-accent text-accent-foreground hover:bg-accent/90 glow-yellow-sm shrink-0",
                    "data-ocid": "activate-free-gas-btn",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Fuel, { className: "w-4 h-4 mr-2" }),
                      "CLAIM FREE GAS"
                    ]
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.2 },
              className: "space-y-5",
              "data-ocid": "buy-gas-section",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-sm font-black tracking-[0.25em] uppercase text-foreground", children: "BUY GAS" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground mt-0.5", children: "Select a fuel package — each adds time to your subscription" })
                ] }),
                packagesLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-44 rounded-xl" }, i)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: GAS_TIERS.map((tier, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.div,
                  {
                    initial: { opacity: 0, y: 20 },
                    animate: { opacity: 1, y: 0 },
                    transition: { delay: 0.25 + i * 0.08 },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      GasTierCard,
                      {
                        tier,
                        selected: selectedGasTierId === tier.id,
                        onSelect: () => setSelectedGasTierId(tier.id)
                      }
                    )
                  },
                  tier.id
                )) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatePresence, { children: [
                  selectedGasTier && (checkoutPhase === "idle" || checkoutPhase === "loading") && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    motion.div,
                    {
                      initial: { opacity: 0, y: 12 },
                      animate: { opacity: 1, y: 0 },
                      exit: { opacity: 0, y: -8 },
                      className: "flex flex-col sm:flex-row items-center gap-4 rounded-xl bg-card/80 neon-border-yellow p-5",
                      "data-ocid": "gas-buy-cta",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 text-center sm:text-left", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-[10px] font-bold tracking-[0.2em] uppercase text-accent/80", children: "SELECTED" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-lg font-black tracking-widest text-accent text-glow-yellow", children: selectedGasTier.name }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xs text-muted-foreground", children: [
                            "$",
                            selectedGasTier.price.toFixed(2),
                            " ·",
                            " ",
                            selectedGasTier.days,
                            " days added"
                          ] })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Button,
                          {
                            onClick: handleBuyGas,
                            disabled: initiateGasPurchase.isPending || checkoutPhase === "loading" || stripeKeyLoading,
                            className: "font-display font-bold tracking-widest uppercase text-xs bg-accent text-accent-foreground hover:bg-accent/90 glow-yellow-sm min-w-[200px]",
                            "data-ocid": "buy-gas-btn",
                            children: checkoutPhase === "loading" || stripeKeyLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block w-3.5 h-3.5 mr-2 rounded-full border-2 border-accent-foreground/40 border-t-accent-foreground animate-spin" }),
                              stripeKeyLoading ? "LOADING…" : "REDIRECTING…"
                            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4 mr-2" }),
                              "BUY GAS — $",
                              selectedGasTier.price.toFixed(2)
                            ] })
                          }
                        )
                      ]
                    },
                    "buy-cta"
                  ),
                  checkoutPhase === "payment" && clientSecret && purchaseRecordId !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    motion.div,
                    {
                      initial: { opacity: 0, y: 16 },
                      animate: { opacity: 1, y: 0 },
                      exit: { opacity: 0, y: -8 },
                      className: "rounded-xl bg-card neon-border-blue p-6 space-y-5",
                      "data-ocid": "gas-stripe-payment-panel",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-[10px] font-bold tracking-[0.2em] uppercase text-primary/80", children: "GAS STATION CHECKOUT" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg font-black tracking-wider uppercase text-primary text-glow-blue mt-0.5", children: (selectedGasTier == null ? void 0 : selectedGasTier.name) ?? "Gas Package" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xs text-muted-foreground", children: [
                              "$",
                              finalAmount.toFixed(2),
                              " · ",
                              (selectedGasTier == null ? void 0 : selectedGasTier.days) ?? 0,
                              " ",
                              "days subscription time"
                            ] })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Button,
                            {
                              variant: "ghost",
                              size: "sm",
                              onClick: handleCancelPayment,
                              className: "font-mono text-xs text-muted-foreground hover:text-foreground",
                              "data-ocid": "gas-cancel-payment-btn",
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
                              GasStripeForm,
                              {
                                clientSecret,
                                purchaseRecordId,
                                finalAmountUSD: finalAmount,
                                gasAmount: (selectedGasTier == null ? void 0 : selectedGasTier.days) ?? purchasedGasAmount,
                                onSuccess: handlePaymentSuccess,
                                onFailure: handlePaymentFailure
                              }
                            )
                          }
                        )
                      ]
                    },
                    "gas-payment-form"
                  )
                ] }),
                !stripeKeyLoading && !stripeKey && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-accent/30 bg-accent/5 px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xs text-accent/80", children: [
                  "⚠ Stripe key not configured. Add your Stripe keys in",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/admin/payments", className: "underline text-accent", children: "Admin → Payments" }),
                  " ",
                  "to enable payments."
                ] }) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 16 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.28 },
              className: "rounded-xl bg-muted/30 border border-border/30 p-5",
              "data-ocid": "gas-cost-guide",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-[10px] font-bold tracking-[0.25em] uppercase text-muted-foreground mb-3", children: "GAS COST GUIDE" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3", children: GAS_TIERS.map((tier) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex items-center justify-between rounded-lg bg-card/60 px-4 py-3 border border-border/30",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-[10px] font-bold tracking-widest uppercase text-muted-foreground", children: tier.name }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[10px] text-muted-foreground/60 mt-0.5", children: [
                          tier.tierName,
                          " · ",
                          tier.days,
                          "d"
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display text-sm font-black text-primary text-glow-blue", children: [
                        "$",
                        tier.price.toFixed(2)
                      ] })
                    ]
                  },
                  tier.id
                )) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 16 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.29 },
              className: "rounded-xl bg-card/70 border border-border/40 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",
              "data-ocid": "wallet-smart-backup-section",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-sm font-black tracking-[0.25em] uppercase text-foreground", children: "SMART BACKUP — $29.99" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground mt-0.5", children: "Export all your listings and photos before they are permanently deleted." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "outline",
                    onClick: () => window.location.assign("/settings"),
                    className: "font-display text-[10px] tracking-widest uppercase neon-border-blue text-primary hover:glow-blue-sm transition-smooth gap-2 w-full sm:w-auto shrink-0",
                    "data-ocid": "wallet-smart-backup-btn",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-3.5 h-3.5" }),
                      "Back Up My Listings"
                    ]
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.3 },
              className: "rounded-xl bg-card/70 border border-border/40 p-6 space-y-5",
              "data-ocid": "auto-renewal-settings",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-sm font-black tracking-[0.25em] uppercase text-foreground", children: "AUTO-RENEWAL" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm text-foreground", children: "Auto-renew subscription" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground mt-0.5", children: "Payment auto-deducts 7 days before your subscription expires" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Switch,
                    {
                      checked: autoRenewalEnabled,
                      onCheckedChange: handleAutoRenewalToggle,
                      "data-ocid": "auto-renewal-toggle",
                      "aria-label": "Auto-renewal toggle"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: autoRenewalEnabled && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.div,
                  {
                    initial: { opacity: 0, height: 0 },
                    animate: { opacity: 1, height: "auto" },
                    exit: { opacity: 0, height: 0 },
                    className: "overflow-hidden",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-2 space-y-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground", children: "RENEW WITH TIER" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: GAS_TIERS.map((gasTier) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "button",
                        {
                          type: "button",
                          onClick: () => handleAutoRenewalTierChange(gasTier.id),
                          className: `rounded-lg border p-3 text-center transition-smooth cursor-pointer
                          ${autoRenewalTierId === gasTier.id ? "neon-border-blue bg-primary/10 text-primary" : "border-border/40 text-muted-foreground hover:border-primary/30"}`,
                          "data-ocid": `auto-renewal-tier-${gasTier.id}`,
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-[9px] font-bold tracking-widest uppercase", children: AUTO_RENEW_NAMES[gasTier.id] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[10px] text-muted-foreground mt-0.5", children: [
                              "$",
                              gasTier.price.toFixed(2)
                            ] })
                          ]
                        },
                        gasTier.id
                      )) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[10px] text-muted-foreground mt-1", children: [
                        "Auto-renew my",
                        " ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-bold", children: AUTO_RENEW_NAMES[autoRenewalTierId] ?? "TIME WALKER" }),
                        " ",
                        "— 7 days before expiry"
                      ] })
                    ] })
                  }
                ) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 16 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.32 },
              className: "rounded-xl bg-card/70 border border-border/40 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",
              "data-ocid": "manage-billing-section",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-sm font-black tracking-[0.25em] uppercase text-foreground", children: "BILLING & INVOICES" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground mt-0.5", children: "Update your card, view invoices, or cancel your plan" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "outline",
                    onClick: async () => {
                      try {
                        await portalSession.mutateAsync();
                      } catch (err) {
                        ue.error(
                          err instanceof Error ? err.message : "Failed to open billing portal"
                        );
                      }
                    },
                    disabled: portalSession.isPending,
                    className: "font-display text-[10px] tracking-widest uppercase neon-border-blue text-primary hover:glow-blue-sm transition-smooth gap-2 w-full sm:w-auto shrink-0",
                    "data-ocid": "manage-billing-btn",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-3.5 h-3.5" }),
                      portalSession.isPending ? "Opening..." : "🧾 Manage Billing & Invoices"
                    ]
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 16 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.35 },
              className: "rounded-xl bg-card/70 border border-border/40 overflow-hidden",
              "data-ocid": "refuel-history-section",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => setRefuelHistoryOpen((v) => !v),
                    className: "w-full flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-card transition-smooth",
                    "data-ocid": "refuel-history-toggle",
                    "aria-expanded": refuelHistoryOpen,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-sm font-black tracking-[0.25em] uppercase text-foreground text-left", children: "REFUEL HISTORY" }),
                        loyaltyStatus && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xs text-muted-foreground text-left mt-0.5", children: [
                          "You have refueled",
                          " ",
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-bold", children: loyaltyStatus.refuelCount }),
                          " ",
                          "times",
                          loyaltyAvailable && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 text-accent", children: "· Loyalty reward available!" })
                        ] })
                      ] }),
                      refuelHistoryOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "w-4 h-4 text-muted-foreground shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-4 h-4 text-muted-foreground shrink-0" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: refuelHistoryOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.div,
                  {
                    initial: { height: 0, opacity: 0 },
                    animate: { height: "auto", opacity: 1 },
                    exit: { height: 0, opacity: 0 },
                    transition: { duration: 0.25 },
                    className: "overflow-hidden",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 pb-5 space-y-4", children: [
                      loyaltyStatus && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-muted/20 border border-border/30 px-4 py-3", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-1", children: [
                          "LOYALTY PROGRESS — ",
                          loyaltyStatus.currentTier
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                            motion.div,
                            {
                              initial: { width: 0 },
                              animate: {
                                width: `${Math.min(100, loyaltyStatus.refuelCount / loyaltyThreshold * 100)}%`
                              },
                              transition: { duration: 0.8, ease: "easeOut" },
                              className: "h-full rounded-full bg-primary"
                            }
                          ) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs text-muted-foreground shrink-0", children: [
                            loyaltyStatus.refuelCount,
                            "/",
                            loyaltyThreshold
                          ] })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-muted-foreground mt-1", children: loyaltyAvailable ? "✓ Threshold met! Claim your free gas above." : `${loyaltyThreshold - loyaltyStatus.refuelCount} more refuel(s) to unlock free gas reward` })
                      ] }),
                      refuelLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 rounded-lg" }, i)) }) : refuelHistory.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "py-6 text-center",
                          "data-ocid": "refuel-history-empty",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground", children: "No refuel history yet. Buy your first gas package!" })
                        }
                      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: refuelHistory.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          className: "flex items-center justify-between rounded-lg bg-background/60 border border-border/30 px-4 py-3",
                          "data-ocid": `refuel-row-${entry.date}`,
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xs font-bold tracking-widest text-foreground", children: entry.tier || "Time Walker" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-muted-foreground", children: formatDate(entry.date) })
                            ] }),
                            entry.rewardClaimed && /* @__PURE__ */ jsxRuntimeExports.jsx(
                              Badge,
                              {
                                variant: "outline",
                                className: "font-mono text-[9px] tracking-widest text-accent border-accent/30",
                                children: "Reward claimed"
                              }
                            )
                          ]
                        },
                        `${entry.date}-${entry.tier}`
                      )) })
                    ] })
                  }
                ) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 16 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.38 },
              className: "rounded-xl bg-card/70 border border-border/40 overflow-hidden",
              "data-ocid": "purchase-history-section",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => setHistoryOpen((v) => !v),
                    className: "w-full flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-card transition-smooth",
                    "data-ocid": "purchase-history-toggle",
                    "aria-expanded": historyOpen,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-sm font-black tracking-[0.25em] uppercase text-foreground", children: "PURCHASE HISTORY" }),
                      historyOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "w-4 h-4 text-muted-foreground shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-4 h-4 text-muted-foreground shrink-0" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: historyOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.div,
                  {
                    initial: { height: 0, opacity: 0 },
                    animate: { height: "auto", opacity: 1 },
                    exit: { height: 0, opacity: 0 },
                    transition: { duration: 0.25 },
                    className: "overflow-hidden",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 pb-5", children: purchasesLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 rounded-lg" }, i)) }) : purchases.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "py-6 text-center",
                        "data-ocid": "purchase-history-empty",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground", children: "No purchases yet. Buy your first gas package above!" })
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: purchases.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: "flex items-center justify-between rounded-lg bg-background/60 border border-border/30 px-4 py-3",
                        "data-ocid": `purchase-row-${p.id}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display text-xs font-bold tracking-widest text-foreground", children: [
                              p.gasAmount,
                              " days"
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[10px] text-muted-foreground", children: [
                              formatDate(p.createdAt),
                              " · $",
                              (p.priceUSD ?? 0).toFixed(2)
                            ] })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: `font-mono text-[10px] font-bold ${statusColor(p.status)}`,
                              children: statusLabel(p.status)
                            }
                          )
                        ]
                      },
                      p.id
                    )) }) })
                  }
                ) })
              ]
            }
          )
        ]
      }
    )
  ] });
}
export {
  WalletPage
};
