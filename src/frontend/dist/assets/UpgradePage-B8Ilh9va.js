import { e as React, f as useActor, r as reactExports, j as jsxRuntimeExports, d as Layout, m as motion, S as Skeleton, I as Input, B as Button, Z as Zap, u as useNavigate, a as ue, q as Shield, i as createActor } from "./index-C4SYi2ho.js";
import { l as loadStripe, E as Elements, u as useStripe, a as useElements, P as PaymentRequestButtonElement, C as CardElement } from "./index-DD--8HbZ.js";
import { T as TimeCircuitsCountdown } from "./TimeCircuitsCountdown-enzw7ii-.js";
import { C as CarAnimation } from "./CarAnimation-BQT9lGTf.js";
import { C as ClockAnimation } from "./ClockAnimation-BAt-kNBZ.js";
import { L as LightningAnimation } from "./LightningAnimation-DO1nyfpO.js";
import { B as Badge } from "./badge-CytO_Ger.js";
import { u as useInitiateTierUpgrade, a as useValidateDiscountCode, b as useFailStripePayment, c as useConfirmStripePayment } from "./usePayments-C_81Pdb2.js";
import { a as useGetTiers, u as useGetMySubscription } from "./useTiers-CMD_X8fk.js";
import { A as AnimatePresence } from "./index-L7eBRARd.js";
import { C as Check } from "./check-CXuH5Pwk.js";
import { L as Lock } from "./lock-UAxjWt6b.js";
import { C as ChevronRight } from "./chevron-right-943-d_NX.js";
var DefaultContext = {
  color: void 0,
  size: void 0,
  className: void 0,
  style: void 0,
  attr: void 0
};
var IconContext = React.createContext && /* @__PURE__ */ React.createContext(DefaultContext);
var _excluded = ["attr", "size", "title"];
function _objectWithoutProperties(e, t) {
  if (null == e) return {};
  var o, r, i = _objectWithoutPropertiesLoose(e, t);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
  }
  return i;
}
function _objectWithoutPropertiesLoose(r, e) {
  if (null == r) return {};
  var t = {};
  for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
    if (-1 !== e.indexOf(n)) continue;
    t[n] = r[n];
  }
  return t;
}
function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function(n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
      _defineProperty(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function Tree2Element(tree) {
  return tree && tree.map((node, i) => /* @__PURE__ */ React.createElement(node.tag, _objectSpread({
    key: i
  }, node.attr), Tree2Element(node.child)));
}
function GenIcon(data) {
  return (props) => /* @__PURE__ */ React.createElement(IconBase, _extends({
    attr: _objectSpread({}, data.attr)
  }, props), Tree2Element(data.child));
}
function IconBase(props) {
  var elem = (conf) => {
    var {
      attr,
      size,
      title
    } = props, svgProps = _objectWithoutProperties(props, _excluded);
    var computedSize = size || conf.size || "1em";
    var className;
    if (conf.className) className = conf.className;
    if (props.className) className = (className ? className + " " : "") + props.className;
    return /* @__PURE__ */ React.createElement("svg", _extends({
      stroke: "currentColor",
      fill: "currentColor",
      strokeWidth: "0"
    }, conf.attr, attr, svgProps, {
      className,
      style: _objectSpread(_objectSpread({
        color: props.color || conf.color
      }, conf.style), props.style),
      height: computedSize,
      width: computedSize,
      xmlns: "http://www.w3.org/2000/svg"
    }), title && /* @__PURE__ */ React.createElement("title", null, title), props.children);
  };
  return IconContext !== void 0 ? /* @__PURE__ */ React.createElement(IconContext.Consumer, null, (conf) => elem(conf)) : elem(DefaultContext);
}
function SiPaypal(props) {
  return GenIcon({ "attr": { "role": "img", "viewBox": "0 0 24 24" }, "child": [{ "tag": "path", "attr": { "d": "M15.607 4.653H8.941L6.645 19.251H1.82L4.862 0h7.995c3.754 0 6.375 2.294 6.473 5.513-.648-.478-2.105-.86-3.722-.86m6.57 5.546c0 3.41-3.01 6.853-6.958 6.853h-2.493L11.595 24H6.74l1.845-11.538h3.592c4.208 0 7.346-3.634 7.153-6.949a5.24 5.24 0 0 1 2.848 4.686M9.653 5.546h6.408c.907 0 1.942.222 2.363.541-.195 2.741-2.655 5.483-6.441 5.483H8.714Z" }, "child": [] }] })(props);
}
function SiBitcoin(props) {
  return GenIcon({ "attr": { "role": "img", "viewBox": "0 0 24 24" }, "child": [{ "tag": "path", "attr": { "d": "M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.548v-.002zm-6.35-4.613c.24-1.59-.974-2.45-2.64-3.03l.54-2.153-1.315-.33-.525 2.107c-.345-.087-.705-.167-1.064-.25l.526-2.127-1.32-.33-.54 2.165c-.285-.067-.565-.132-.84-.2l-1.815-.45-.35 1.407s.975.225.955.236c.535.136.63.486.615.766l-1.477 5.92c-.075.166-.24.406-.614.314.015.02-.96-.24-.96-.24l-.66 1.51 1.71.426.93.242-.54 2.19 1.32.327.54-2.17c.36.1.705.19 1.05.273l-.51 2.154 1.32.33.545-2.19c2.24.427 3.93.257 4.64-1.774.57-1.637-.03-2.58-1.217-3.196.854-.193 1.5-.76 1.68-1.93h.01zm-3.01 4.22c-.404 1.64-3.157.75-4.05.53l.72-2.9c.896.23 3.757.67 3.33 2.37zm.41-4.24c-.37 1.49-2.662.735-3.405.55l.654-2.64c.744.18 3.137.524 2.75 2.084v.006z" }, "child": [] }] })(props);
}
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
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pt-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-border/30" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-muted-foreground uppercase tracking-widest", children: "or coming soon" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-border/30" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        Button,
                        {
                          type: "button",
                          variant: "outline",
                          disabled: true,
                          className: "w-full h-11 border-border/40 text-muted-foreground/50 cursor-not-allowed opacity-60 gap-2 font-mono text-xs",
                          "data-ocid": "paypal-coming-soon-btn",
                          "aria-label": "PayPal payments coming soon",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(SiPaypal, { className: "w-4 h-4 text-[#003087]/50" }),
                            "PayPal"
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-2 left-1/2 -translate-x-1/2 pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "bg-muted text-muted-foreground font-mono text-[8px] tracking-widest uppercase px-1.5 py-0.5 rounded border border-border/40 flex items-center gap-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-2 h-2" }),
                        "Soon"
                      ] }) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        Button,
                        {
                          type: "button",
                          variant: "outline",
                          disabled: true,
                          className: "w-full h-11 border-border/40 text-muted-foreground/50 cursor-not-allowed opacity-60 gap-2 font-mono text-xs",
                          "data-ocid": "crypto-coming-soon-btn",
                          "aria-label": "Crypto payments coming soon",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(SiBitcoin, { className: "w-4 h-4 text-[#F7931A]/50" }),
                            "Crypto"
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-2 left-1/2 -translate-x-1/2 pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "bg-muted text-muted-foreground font-mono text-[8px] tracking-widest uppercase px-1.5 py-0.5 rounded border border-border/40 flex items-center gap-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-2 h-2" }),
                        "Soon"
                      ] }) })
                    ] })
                  ] })
                ] })
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
