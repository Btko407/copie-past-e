import { j as jsxRuntimeExports, C as CircleCheck, S as Skeleton, y as Shield, T as TriangleAlert, u as useActor, r as reactExports, d as ue, v as Label, s as Input, B as Button, Z as Zap, e as createActor } from "./index-CDYDluDX.js";
import { A as AdminLayout } from "./AdminLayout-BjK6RzTr.js";
import { B as Badge } from "./badge-tMJODRQh.js";
import { S as Separator } from "./separator-COrBmKFK.js";
import { S as Switch } from "./switch-DUDZecVN.js";
import { c as useGetStripeHealthStatus, d as useGetRevenueStats, e as useGetCanisterCyclesBalance } from "./useStripePayments-CjKiG-SB.js";
import { C as CircleX } from "./circle-x-bAaUQV7d.js";
import { L as LoaderCircle } from "./loader-circle-BkTHt6EF.js";
import { R as RefreshCcw } from "./refresh-ccw-ChM_NduS.js";
import { S as Save } from "./save-DA1yGkWo.js";
import { E as EyeOff } from "./eye-off-Q1gbbnMR.js";
import { E as Eye } from "./eye-R7ZJDlq3.js";
import "./credit-card-BORXzGfX.js";
import "./trash-2-B9mOI9ri.js";
import "./dollar-sign-rpn8AkE2.js";
import "./index-Dn2L3d5t.js";
import "./index-Dkz_c46u.js";
function safeNum(val) {
  const n = Number.parseFloat(String(val));
  return Number.isNaN(n) ? 0 : n;
}
function str(v) {
  return v ?? "";
}
function MaskedInput({
  id,
  value,
  onChange,
  placeholder,
  "data-ocid": ocid
}) {
  const [revealed, setRevealed] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Input,
      {
        id,
        type: revealed ? "text" : "password",
        value,
        onChange: (e) => onChange(e.target.value),
        placeholder,
        className: "font-mono text-xs pr-9",
        autoComplete: "off",
        "data-ocid": ocid
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => setRevealed((r) => !r),
        className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors",
        "aria-label": revealed ? "Hide key" : "Reveal key",
        children: revealed ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-3.5 h-3.5" })
      }
    )
  ] });
}
function StatusBadge({
  status,
  mode,
  label,
  errorMsg
}) {
  if (status === "connected") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Badge,
      {
        variant: "outline",
        className: "font-mono text-[10px] text-green-400 border-green-400/40 bg-green-400/5 gap-1",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-2.5 h-2.5" }),
          label,
          ": Connected (",
          mode === "live" ? "Live" : mode === "sandbox" ? "Sandbox" : "Test",
          " ",
          "Mode)"
        ]
      }
    );
  }
  if (status === "keys-ok-no-prices") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Badge,
      {
        variant: "outline",
        className: "font-mono text-[10px] text-accent border-accent/40 bg-accent/5 gap-1",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-2.5 h-2.5" }),
          label,
          ": Keys OK — Add Price IDs"
        ]
      }
    );
  }
  if (status === "failed") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Badge,
      {
        variant: "outline",
        className: "font-mono text-[10px] text-destructive border-destructive/40 bg-destructive/5 gap-1 max-w-[260px] truncate",
        title: errorMsg ? `Key Invalid: ${errorMsg}` : "Connection Failed",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-2.5 h-2.5 shrink-0" }),
          label,
          ": ",
          errorMsg ? `Key Invalid: ${errorMsg}` : "Connection Failed"
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Badge,
    {
      variant: "outline",
      className: "font-mono text-[10px] text-muted-foreground border-border/40 bg-muted/5",
      children: [
        label,
        ": Not Configured"
      ]
    }
  );
}
function CyclesBalanceCard() {
  const { data: balance, isLoading } = useGetCanisterCyclesBalance();
  const ONE_TRILLION = 1000000000000n;
  const LOW_THRESHOLD = 1000000000000n;
  const isLow = balance !== null && balance !== void 0 && balance < LOW_THRESHOLD;
  const trillions = balance !== null && balance !== void 0 ? (Number(balance) / 1e12).toFixed(3) : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `rounded-lg border px-4 py-3 flex items-center gap-3 ${isLow ? "border-accent/40 bg-accent/5" : "border-primary/20 bg-primary/5"}`,
      "data-ocid": "cycles-balance-card",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Zap,
          {
            className: `w-4 h-4 shrink-0 ${isLow ? "text-accent" : "text-primary"}`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-40 bg-primary/10" }) : trillions !== null ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xs text-foreground", children: [
            "Canister Cycles:",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: `font-bold ${isLow ? "text-accent" : "text-primary"}`,
                children: [
                  trillions,
                  " trillion"
                ]
              }
            ),
            balance !== null && balance !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground ml-2 text-[10px]", children: [
              "(",
              Number(balance).toLocaleString(),
              " cycles)"
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xs text-muted-foreground", children: [
            "Canister Cycles: Not available (",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60", children: "getCanisterCyclesBalance not yet deployed" }),
            ")"
          ] }),
          isLow && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-accent mt-0.5", children: "⚠ Low cycles warning. Top up your canister to prevent outages. HTTPS outcalls (Stripe, Gemini) will fail if cycles run out." })
        ] }),
        ONE_TRILLION && null
      ]
    }
  );
}
function IcpPaymentVerificationBlock() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      className: "rounded-xl border border-primary/20 bg-card overflow-hidden",
      "data-ocid": "icp-payment-verification-block",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 border-b border-border/50 bg-card/80 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-4 h-4 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xs font-bold tracking-widest uppercase text-foreground", children: "Payment Verification" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-muted-foreground mt-0.5", children: "ICP Architecture — Polling, not webhooks" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "outline",
              className: "ml-auto font-mono text-[10px] text-primary border-primary/40 bg-primary/5",
              children: "Polling (ICP)"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-primary/5 border border-primary/15 px-4 py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs font-bold text-primary mb-1", children: "Payment Verification: Polling (ICP Architecture)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-muted-foreground leading-relaxed", children: "Stripe payments are verified by direct canister HTTPS calls to Stripe's API. Webhooks are not used on Internet Computer — the canister cannot receive inbound HTTP requests." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 font-mono text-[10px] text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-start gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary shrink-0 mt-0.5", children: "1." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "User clicks upgrade → canister calls",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-primary bg-primary/10 px-1 rounded", children: "createStripeCheckoutSession" }),
                " ",
                "→ browser redirects to Stripe"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-start gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary shrink-0 mt-0.5", children: "2." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "After payment, Stripe redirects to",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-primary bg-primary/10 px-1 rounded", children: "/payment-success?session_id=XXX" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-start gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary shrink-0 mt-0.5", children: "3." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Frontend calls",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-primary bg-primary/10 px-1 rounded", children: "verifyAndGrantPayment(sessionId)" }),
                " ",
                "→ canister verifies with Stripe API → days added additively"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CyclesBalanceCard, {})
        ] })
      ]
    }
  );
}
function StripePanel() {
  const { actor } = useActor(createActor);
  const [form, setForm] = reactExports.useState({
    publishableKey: "",
    secretKey: "",
    priceWalker: "",
    priceTraveler: "",
    priceLord: "",
    priceBackup: "",
    gasWalkerPriceId: "",
    gasTravelerPriceId: "",
    gasLordPriceId: "",
    isTestMode: true
  });
  const [loading, setLoading] = reactExports.useState(true);
  const [status, setStatus] = reactExports.useState("untested");
  const [statusError, setStatusError] = reactExports.useState("");
  const [saving, setSaving] = reactExports.useState(false);
  const applyConfig = reactExports.useCallback((cfg) => {
    const walkerPrice = str(cfg.stripeWalkerPriceId);
    const travelerPrice = str(cfg.stripeProPriceId);
    const lordPrice = str(cfg.stripeMaxPriceId);
    setForm({
      publishableKey: str(cfg.stripePublishableKey),
      secretKey: str(cfg.stripeSecretKey),
      priceWalker: walkerPrice,
      priceTraveler: travelerPrice,
      priceLord: lordPrice,
      priceBackup: str(cfg.stripeBackupPriceId),
      gasWalkerPriceId: str(cfg.stripeGasWalkerPriceId) || walkerPrice,
      gasTravelerPriceId: str(cfg.stripeGasTravelerPriceId) || travelerPrice,
      gasLordPriceId: str(cfg.stripeGasLordPriceId) || lordPrice,
      isTestMode: cfg.stripeMode !== "live"
    });
    const hasKeys = !!(cfg.stripePublishableKey && cfg.stripeSecretKey);
    const hasPrices = !!(cfg.stripeWalkerPriceId || cfg.stripeProPriceId || cfg.stripeMaxPriceId);
    if (hasKeys && !hasPrices) setStatus("keys-ok-no-prices");
    else if (!hasKeys) setStatus("untested");
  }, []);
  reactExports.useEffect(() => {
    if (!actor) return;
    setLoading(true);
    actor.adminGetPaymentConfig().then((cfg) => applyConfig(cfg)).catch(() => {
      ue.error("Could not load payment config", {
        description: "Check your connection and refresh the page."
      });
    }).finally(() => setLoading(false));
  }, [actor, applyConfig]);
  function setField(k, v) {
    setForm((prev) => ({ ...prev, [k]: v }));
    if (status !== "untested") {
      setStatus("untested");
      setStatusError("");
    }
  }
  async function handleTest() {
    if (!form.publishableKey || !form.secretKey) {
      ue.error("Missing keys", {
        description: "Enter both Publishable and Secret keys to test."
      });
      return;
    }
    if (!actor) {
      ue.error("Not ready", { description: "Backend actor not available." });
      return;
    }
    setStatus("testing");
    setStatusError("");
    try {
      const result = await actor.adminTestStripeConnection(
        form.secretKey
      );
      if (result.__kind__ === "ok") {
        const raw = result.ok;
        const chargesEnabled = raw.includes("charges_enabled:true") || raw.includes('"charges_enabled":true');
        const hasPrices = !!(form.priceWalker || form.priceTraveler || form.priceLord);
        setStatus(hasPrices ? "connected" : "keys-ok-no-prices");
        ue.success("Stripe connected", {
          description: hasPrices ? `Connected — charges_enabled: ${chargesEnabled} (${form.isTestMode ? "Test" : "Live"} Mode)` : "Keys OK — add Price IDs to complete setup"
        });
      } else {
        const errMsg = result.err ?? "Invalid keys or unreachable endpoint.";
        setStatus("failed");
        setStatusError(errMsg);
        ue.error("Stripe connection failed", { description: errMsg });
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Unknown error.";
      setStatus("failed");
      setStatusError(errMsg);
      ue.error("Stripe connection failed", { description: errMsg });
    }
  }
  async function handleSave() {
    if (!actor) {
      ue.error("Not ready", { description: "Backend actor not available." });
      return;
    }
    const hasBothKeys = !!(form.publishableKey && form.secretKey);
    const hasPriceIds = !!(form.priceWalker || form.priceTraveler || form.priceLord || form.priceBackup);
    if (!hasBothKeys && !hasPriceIds) {
      ue.error("Nothing to save", {
        description: "Enter at least one Stripe key or Price ID before saving."
      });
      return;
    }
    setSaving(true);
    try {
      const gasWalker = form.gasWalkerPriceId || form.priceWalker;
      const gasTraveler = form.gasTravelerPriceId || form.priceTraveler;
      const gasLord = form.gasLordPriceId || form.priceLord;
      if (gasWalker !== form.gasWalkerPriceId || gasTraveler !== form.gasTravelerPriceId || gasLord !== form.gasLordPriceId) {
        setForm((prev) => ({
          ...prev,
          gasWalkerPriceId: gasWalker,
          gasTravelerPriceId: gasTraveler,
          gasLordPriceId: gasLord
        }));
      }
      let existingPayPal = {
        paypalClientId: void 0,
        paypalClientSecret: void 0,
        paypalMode: "sandbox"
      };
      try {
        const existing = await actor.adminGetPaymentConfig();
        existingPayPal = {
          paypalClientId: existing.paypalClientId,
          paypalClientSecret: existing.paypalClientSecret,
          paypalMode: existing.paypalMode
        };
      } catch {
      }
      const paymentConfig = {
        stripePublishableKey: form.publishableKey || void 0,
        stripeSecretKey: form.secretKey || void 0,
        // No webhook secrets — ICP architecture uses polling
        stripeWebhookSecret: void 0,
        stripeWebhookSecretTest: void 0,
        stripeWebhookSecretLive: void 0,
        stripeWalkerPriceId: form.priceWalker || void 0,
        stripeProPriceId: form.priceTraveler || void 0,
        stripeMaxPriceId: form.priceLord || void 0,
        stripeBackupPriceId: form.priceBackup || void 0,
        stripeGasWalkerPriceId: gasWalker || void 0,
        stripeGasTravelerPriceId: gasTraveler || void 0,
        stripeGasLordPriceId: gasLord || void 0,
        stripeMode: form.isTestMode ? "test" : "live",
        paypalClientId: existingPayPal.paypalClientId,
        paypalClientSecret: existingPayPal.paypalClientSecret,
        paypalMode: existingPayPal.paypalMode ?? "sandbox"
      };
      const result = await actor.adminSavePaymentConfig(
        paymentConfig
      );
      if (result.__kind__ === "ok") {
        ue.success("Payment settings saved", {
          description: "Keys and Price IDs stored permanently in canister stable storage."
        });
        try {
          const confirmed = await actor.adminGetPaymentConfig();
          applyConfig(confirmed);
          const savedOk = (!form.priceWalker || confirmed.stripeWalkerPriceId === form.priceWalker) && (!form.priceTraveler || confirmed.stripeProPriceId === form.priceTraveler) && (!form.priceLord || confirmed.stripeMaxPriceId === form.priceLord);
          if (!savedOk) {
            ue.warning("Verify your Price IDs", {
              description: "Some fields may not have saved — please check and re-save if needed."
            });
          }
          const hasKeys = !!(confirmed.stripePublishableKey && confirmed.stripeSecretKey);
          const hasPrices = !!(confirmed.stripeWalkerPriceId || confirmed.stripeProPriceId || confirmed.stripeMaxPriceId);
          if (hasKeys && hasPrices) setStatus("untested");
          else if (hasKeys) setStatus("keys-ok-no-prices");
          else if (hasPrices) setStatus("untested");
        } catch {
        }
      } else {
        ue.error("Save failed", {
          description: result.err ?? "Unknown error."
        });
      }
    } catch (err) {
      ue.error("Save failed", {
        description: err instanceof Error ? err.message : "Unknown error."
      });
    } finally {
      setSaving(false);
    }
  }
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "section",
      {
        className: "rounded-xl border border-primary/20 bg-card overflow-hidden",
        "data-ocid": "stripe-panel",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 border-b border-border/50 bg-card/80 flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs font-bold text-primary", children: "S" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xs font-bold tracking-widest uppercase text-foreground", children: "Stripe" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-muted-foreground mt-0.5", children: "Loading saved configuration…" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin text-muted-foreground ml-auto" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5 space-y-3", children: [0, 1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-full bg-primary/5" }, i)) })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      className: "rounded-xl border border-primary/20 bg-card overflow-hidden",
      "data-ocid": "stripe-panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 border-b border-border/50 bg-card/80 flex items-center justify-between gap-4 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs font-bold text-primary", children: "S" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xs font-bold tracking-widest uppercase text-foreground", children: "Stripe" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-muted-foreground mt-0.5", children: "Credit card + Apple Pay processing" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatusBadge,
            {
              status,
              mode: form.isTestMode ? "test" : "live",
              label: "Stripe",
              errorMsg: statusError
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-lg bg-secondary/20 border border-border/40 px-4 py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs font-bold text-foreground", children: form.isTestMode ? "Test Mode" : "Live Mode" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-muted-foreground mt-0.5", children: form.isTestMode ? "Test mode: use Stripe test keys and test cards (e.g. 4242 4242 4242 4242). No real charges." : "Live mode: real payments only — use your live keys from the Stripe dashboard." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Switch,
              {
                checked: !form.isTestMode,
                onCheckedChange: (v) => setField("isTestMode", !v),
                "data-ocid": "stripe-live-mode-toggle"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Label,
                {
                  htmlFor: "stripe-pub",
                  className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
                  children: [
                    "Publishable Key",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/50 normal-case tracking-normal ml-1", children: "(VITE_STRIPE_PUBLISHABLE_KEY)" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "stripe-pub",
                  value: form.publishableKey,
                  onChange: (e) => setField("publishableKey", e.target.value),
                  placeholder: form.isTestMode ? "pk_test_…" : "pk_live_…",
                  className: "font-mono text-xs mt-1",
                  "data-ocid": "stripe-publishable-key"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Label,
                {
                  htmlFor: "stripe-sec",
                  className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
                  children: [
                    "Secret Key",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/50 normal-case tracking-normal ml-1", children: "(STRIPE_SECRET_KEY)" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                MaskedInput,
                {
                  id: "stripe-sec",
                  value: form.secretKey,
                  onChange: (v) => setField("secretKey", v),
                  placeholder: form.isTestMode ? "sk_test_…" : "sk_live_…",
                  "data-ocid": "stripe-secret-key"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-border/40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1", children: "Subscription Tier Price IDs" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[9px] text-muted-foreground/60 mb-3", children: "Stripe Price IDs for each subscription tier — enter the price_… ID from your Stripe dashboard for each tier. All four fields are always saved together." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Label,
                  {
                    htmlFor: "stripe-walker-price",
                    className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
                    children: [
                      "Time Walker Price ID",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/50 normal-case tracking-normal ml-1", children: "($6.99 · STRIPE_PRICE_WALKER)" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "stripe-walker-price",
                    value: form.priceWalker,
                    onChange: (e) => setField("priceWalker", e.target.value),
                    placeholder: "price_…",
                    className: "font-mono text-xs mt-1",
                    "data-ocid": "stripe-walker-price-id"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Label,
                  {
                    htmlFor: "stripe-pro-price",
                    className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
                    children: [
                      "Time Traveler Price ID",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/50 normal-case tracking-normal ml-1", children: "($9.99 · STRIPE_PRICE_TRAVELER)" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "stripe-pro-price",
                    value: form.priceTraveler,
                    onChange: (e) => setField("priceTraveler", e.target.value),
                    placeholder: "price_…",
                    className: "font-mono text-xs mt-1",
                    "data-ocid": "stripe-pro-price-id"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Label,
                  {
                    htmlFor: "stripe-lord-price",
                    className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
                    children: [
                      "Time Lord Price ID",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/50 normal-case tracking-normal ml-1", children: "($19.99 · STRIPE_PRICE_LORD)" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "stripe-lord-price",
                    value: form.priceLord,
                    onChange: (e) => setField("priceLord", e.target.value),
                    placeholder: "price_…",
                    className: "font-mono text-xs mt-1",
                    "data-ocid": "stripe-lord-price-id"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Label,
                  {
                    htmlFor: "stripe-backup-price",
                    className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
                    children: [
                      "Smart Backup Export — $29.99",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/50 normal-case tracking-normal ml-1", children: "(STRIPE_PRICE_BACKUP)" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "stripe-backup-price",
                    value: form.priceBackup,
                    onChange: (e) => setField("priceBackup", e.target.value),
                    placeholder: "price_…",
                    className: "font-mono text-xs mt-1",
                    "data-ocid": "stripe-backup-price-id"
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1", children: "Gas Wallet Price IDs" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[9px] text-muted-foreground/60 mb-3", children: "Auto-populated from tier Price IDs above when you save. Gas Wallet purchases use the same Stripe products as subscription tiers — no new Stripe products needed." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-3", children: [
              {
                label: "Gas Walker Price ID",
                hint: "= Time Walker",
                value: form.gasWalkerPriceId || form.priceWalker || "—",
                ocid: "stripe-gas-walker-price-id"
              },
              {
                label: "Gas Traveler Price ID",
                hint: "= Time Traveler",
                value: form.gasTravelerPriceId || form.priceTraveler || "—",
                ocid: "stripe-gas-traveler-price-id"
              },
              {
                label: "Gas Lord Price ID",
                hint: "= Time Lord",
                value: form.gasLordPriceId || form.priceLord || "—",
                ocid: "stripe-gas-lord-price-id"
              }
            ].map(({ label, hint, value, ocid }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center justify-between rounded-lg bg-secondary/10 border border-border/30 px-3 py-2.5",
                "data-ocid": ocid,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground", children: [
                    label,
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "normal-case tracking-normal text-muted-foreground/50 ml-1", children: [
                      "(",
                      hint,
                      ")"
                    ] })
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "font-mono text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded max-w-[180px] truncate", children: value })
                ]
              },
              ocid
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-1 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                className: "font-mono text-xs gap-1.5",
                onClick: handleTest,
                disabled: status === "testing" || saving,
                "data-ocid": "stripe-test-btn",
                children: [
                  status === "testing" ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCcw, { className: "w-3.5 h-3.5" }),
                  status === "testing" ? "Testing…" : "Test Connection"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                className: "font-mono text-xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 ml-auto",
                onClick: handleSave,
                disabled: saving || status === "testing",
                "data-ocid": "stripe-save-btn",
                children: [
                  saving ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-3.5 h-3.5" }),
                  saving ? "Saving…" : "Save Configuration"
                ]
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function PayPalPanel() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      className: "rounded-xl border border-border/30 bg-card overflow-hidden opacity-60",
      "data-ocid": "paypal-panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 border-b border-border/50 bg-card/80 flex items-center justify-between gap-4 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-muted border border-border/30 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs font-bold text-muted-foreground", children: "P" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xs font-bold tracking-widest uppercase text-muted-foreground", children: "PayPal" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-muted-foreground/60 mt-0.5", children: "Not available in this version" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "outline",
              className: "font-mono text-[10px] text-muted-foreground border-border/30",
              children: "Not Available"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg bg-muted/30 border border-border/20 px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-muted-foreground leading-relaxed", children: "PayPal payments are not available in this version. Stripe Checkout is the production payment path. PayPal may be added in a future release." }) }) })
      ]
    }
  );
}
function ConnectionStatusBar() {
  const { data: health, isLoading } = useGetStripeHealthStatus();
  const scoreItems = [
    {
      label: "Publishable Key",
      ok: !!(health == null ? void 0 : health.keysConfigured),
      detail: (health == null ? void 0 : health.keysConfigured) ? "Configured ✓" : "Missing ✗"
    },
    {
      label: "Secret Key",
      ok: !!(health == null ? void 0 : health.keysConfigured),
      detail: (health == null ? void 0 : health.keysConfigured) ? "Configured ✓" : "Missing ✗"
    },
    {
      label: "Price IDs",
      ok: (health == null ? void 0 : health.status) === "ok",
      detail: (health == null ? void 0 : health.status) === "ok" ? "Configured ✓" : (health == null ? void 0 : health.status) === "keys_only" || (health == null ? void 0 : health.status) === "no_price_ids" ? "Missing ✗" : "Not set"
    },
    {
      label: "Connection",
      ok: (health == null ? void 0 : health.status) === "ok" || (health == null ? void 0 : health.status) === "keys_only",
      detail: (health == null ? void 0 : health.status) === "ok" || (health == null ? void 0 : health.status) === "keys_only" ? "Reachable ✓" : "Not verified"
    },
    {
      label: "Webhooks",
      ok: false,
      detail: "Not used (ICP)"
    }
  ];
  const configuredCount = scoreItems.filter((i) => i.ok).length;
  const stripeStatusText = (() => {
    if (!health) return "Not configured";
    if (!health.keysConfigured) return "Not configured";
    if (health.status === "no_price_ids" || health.status === "keys_only") {
      return "Keys OK — Price IDs missing";
    }
    return `Connected (${health.status === "ok" ? "Active" : health.status})`;
  })();
  const stripeStatusColor = (() => {
    if (!(health == null ? void 0 : health.keysConfigured)) return "text-destructive";
    if (health.status === "no_price_ids" || health.status === "keys_only")
      return "text-accent";
    return "text-green-400";
  })();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      className: "rounded-xl border border-border/40 bg-card overflow-hidden",
      "data-ocid": "stripe-connection-status-bar",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 border-b border-border/50 bg-card/80 flex items-center justify-between gap-3 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xs font-bold tracking-widest uppercase text-foreground", children: "Connection Status" }),
          !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Badge,
            {
              variant: "outline",
              className: `font-mono text-[10px] border-border/40 ${configuredCount === 5 ? "text-green-400 border-green-400/40 bg-green-400/5" : configuredCount >= 3 ? "text-accent border-accent/40 bg-accent/5" : "text-destructive border-destructive/40 bg-destructive/5"}`,
              "data-ocid": "config-completeness-badge",
              children: [
                "Config: ",
                configuredCount,
                "/5 configured"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-4 flex flex-col sm:flex-row gap-4 flex-wrap", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-64 bg-primary/5" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            (health == null ? void 0 : health.keysConfigured) ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              CircleCheck,
              {
                className: `w-4 h-4 shrink-0 ${stripeStatusColor}`
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-4 h-4 text-destructive shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs", children: [
              "Stripe:",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `font-bold ${stripeStatusColor}`, children: stripeStatusText })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden sm:block w-px bg-border/40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-4 h-4 text-primary shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs text-muted-foreground", children: [
              "Verification:",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-bold", children: "Polling (ICP Architecture)" })
            ] })
          ] }),
          !(health == null ? void 0 : health.keysConfigured) && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden sm:block w-px bg-border/40" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-4 h-4 text-accent shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-accent", children: "Add keys below to enable payments" })
            ] })
          ] })
        ] }) }),
        !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border/30 px-5 py-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-3", children: "Configuration Checklist" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-4 gap-2", children: scoreItems.map(({ label, ok, detail }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: `rounded-lg border px-3 py-2 flex flex-col gap-0.5 ${ok ? "border-green-400/20 bg-green-400/5" : "border-destructive/20 bg-destructive/5"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[9px] uppercase tracking-widest text-muted-foreground", children: label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `font-mono text-[10px] font-bold ${ok ? "text-green-400" : "text-destructive"}`,
                    children: detail
                  }
                )
              ]
            },
            label
          )) })
        ] })
      ]
    }
  );
}
function RevenueSummarySection() {
  const { data: stats, isLoading } = useGetRevenueStats();
  function buildCards(s) {
    return [
      {
        label: "Today",
        value: `$${safeNum(s == null ? void 0 : s.today).toFixed(2)}`,
        color: "text-primary"
      },
      {
        label: "This Week",
        value: `$${safeNum(s == null ? void 0 : s.week).toFixed(2)}`,
        color: "text-accent"
      },
      {
        label: "This Month",
        value: `$${safeNum(s == null ? void 0 : s.month).toFixed(2)}`,
        color: "text-green-400"
      },
      {
        label: "Active Subscribers",
        value: String(safeNum(s == null ? void 0 : s.activeSubscribers)),
        color: "text-foreground"
      }
    ];
  }
  let cards = buildCards(null);
  let renderError = false;
  try {
    cards = buildCards(stats);
  } catch {
    renderError = true;
    cards = buildCards(null);
  }
  const showNoDataNote = !isLoading && (stats === null || stats === void 0 || renderError);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      className: "rounded-xl border border-border/40 bg-card overflow-hidden",
      "data-ocid": "revenue-summary-section",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-4 border-b border-border/50 bg-card/80", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xs font-bold tracking-widest uppercase text-foreground", children: "Revenue Summary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5 grid grid-cols-2 sm:grid-cols-4 gap-3", children: cards.map(
          ({ label, value, color }) => isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 rounded-lg bg-primary/5" }, label) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-lg bg-background/60 border border-border/30 px-4 py-4 flex flex-col gap-1",
              "data-ocid": `revenue-stat-${label.toLowerCase().replace(/\s+/g, "-")}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground", children: label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: `font-display text-2xl font-black tracking-wide ${color}`,
                    children: value
                  }
                )
              ]
            },
            label
          )
        ) }),
        showNoDataNote && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-5 pb-4 font-mono text-[10px] text-muted-foreground", children: "Revenue data will appear after the first payment is processed." })
      ]
    }
  );
}
function AdminPaymentsPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminLayout, { title: "Payments", subtitle: "Configuration", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl space-y-8", "data-ocid": "admin-payments-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ConnectionStatusBar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xs font-bold tracking-widest uppercase text-foreground", children: "Payment Gateway Configuration" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-muted-foreground mt-1", children: "Configure Stripe and PayPal credentials. All values are stored permanently in canister stable variables — they survive every redeploy and never disappear. Secret keys are never displayed in plain text." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 rounded-md bg-destructive/5 border border-destructive/20 px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-destructive/80", children: "⚠ Admin only — these keys are never exposed to regular users or stored in browser history." }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(IcpPaymentVerificationBlock, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(StripePanel, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "section",
      {
        className: "rounded-xl border border-border/30 bg-card overflow-hidden",
        "data-ocid": "payment-model-info",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-4 border-b border-border/50 bg-card/80", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xs font-bold tracking-widest uppercase text-foreground", children: "Payment Methods" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 rounded-lg bg-primary/5 border border-primary/15 px-4 py-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-green-400 shrink-0 mt-0.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs font-bold text-foreground", children: "Stripe Checkout — Active" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-muted-foreground mt-0.5", children: "Production payment path. Credit card, Apple Pay, Google Pay via Stripe-hosted checkout. Verification uses polling (webhooks are architecturally impossible on the Internet Computer)." })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 rounded-lg bg-muted/20 border border-border/20 px-4 py-3 opacity-60", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-4 h-4 text-muted-foreground shrink-0 mt-0.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs font-bold text-muted-foreground", children: "PayPal — Not available in this version" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-muted-foreground/70 mt-0.5", children: "PayPal is not implemented. May be added in a future release." })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 rounded-lg bg-muted/20 border border-border/20 px-4 py-3 opacity-60", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-4 h-4 text-muted-foreground shrink-0 mt-0.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs font-bold text-muted-foreground", children: "Crypto — Not available in this version" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-muted-foreground/70 mt-0.5", children: "Cryptocurrency payments are not implemented. May be added in a future release." })
              ] })
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PayPalPanel, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(RevenueSummarySection, {})
  ] }) });
}
export {
  AdminPaymentsPage
};
