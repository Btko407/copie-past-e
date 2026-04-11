import { j as jsxRuntimeExports, S as Skeleton, H as CircleCheck, f as useActor, r as reactExports, a as ue, l as Label, I as Input, C as Copy, B as Button, i as createActor } from "./index-DkLW0GdO.js";
import { A as AdminLayout } from "./AdminLayout-CjSNO73q.js";
import { B as Badge } from "./badge-Tda6TLdG.js";
import { S as Separator } from "./separator-B6RafDJ2.js";
import { S as Switch } from "./switch-sq4P8g4a.js";
import { c as useGetStripeHealthStatus, d as useGetWebhookLog, e as useGetFailedWebhookEvents, f as useRetryFailedWebhookEvent, g as useGetRevenueStats } from "./useStripePayments-XilLEMTj.js";
import { C as CircleX } from "./circle-x-B7R4_hK3.js";
import { L as LoaderCircle } from "./loader-circle-CUpMttTW.js";
import { R as RefreshCcw } from "./refresh-ccw-yR6Pet4H.js";
import { S as Save } from "./save-TuNOqQfm.js";
import { E as EyeOff } from "./eye-off-UwGmLWCX.js";
import { E as Eye } from "./eye-VpHU8fqO.js";
import "./credit-card-D70N9Wsa.js";
import "./trash-2-CfcC5itf.js";
import "./index-D25Z0HZt.js";
import "./index-Dbnhoa4M.js";
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
  label
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
          ": Keys OK — Price IDs missing"
        ]
      }
    );
  }
  if (status === "failed") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Badge,
      {
        variant: "outline",
        className: "font-mono text-[10px] text-destructive border-destructive/40 bg-destructive/5 gap-1",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-2.5 h-2.5" }),
          label,
          ": Connection Failed"
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
function StripePanel() {
  const { actor } = useActor(createActor);
  const [form, setForm] = reactExports.useState({
    publishableKey: "",
    secretKey: "",
    webhookSecretTest: "",
    webhookSecretLive: "",
    priceWalker: "",
    priceTraveler: "",
    priceLord: "",
    priceBackup: "",
    isTestMode: true
  });
  const [loading, setLoading] = reactExports.useState(true);
  const [status, setStatus] = reactExports.useState("untested");
  const [saving, setSaving] = reactExports.useState(false);
  const applyConfig = reactExports.useCallback((cfg) => {
    setForm({
      publishableKey: str(cfg.stripePublishableKey),
      secretKey: str(cfg.stripeSecretKey),
      webhookSecretTest: str(cfg.stripeWebhookSecretTest),
      webhookSecretLive: str(cfg.stripeWebhookSecretLive),
      // Price IDs — load from all possible field names for backward compat
      priceWalker: str(cfg.stripeWalkerPriceId),
      priceTraveler: str(cfg.stripeProPriceId),
      priceLord: str(cfg.stripeMaxPriceId),
      priceBackup: str(cfg.stripeBackupPriceId),
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
    actor.adminGetPaymentConfig().then((cfg) => {
      applyConfig(cfg);
    }).catch(() => {
      ue.error("Could not load payment config", {
        description: "Check your connection and refresh the page."
      });
    }).finally(() => {
      setLoading(false);
    });
  }, [actor, applyConfig]);
  function setField(k, v) {
    setForm((prev) => ({ ...prev, [k]: v }));
    if (status !== "untested") setStatus("untested");
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
    try {
      const result = await actor.adminTestStripeConnection(
        form.secretKey
      );
      if (result.__kind__ === "ok") {
        const hasPrices = !!(form.priceWalker || form.priceTraveler || form.priceLord);
        setStatus(hasPrices ? "connected" : "keys-ok-no-prices");
        ue.success("Stripe connected", {
          description: hasPrices ? `Keys validated (${form.isTestMode ? "Test" : "Live"} Mode)` : "Keys OK — add Price IDs to complete setup"
        });
      } else {
        const errMsg = result.err ?? "Invalid keys or unreachable endpoint.";
        setStatus("failed");
        ue.error("Stripe connection failed", { description: errMsg });
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Unknown error.";
      setStatus("failed");
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
        // Stripe keys — only set if non-empty
        stripePublishableKey: form.publishableKey || void 0,
        stripeSecretKey: form.secretKey || void 0,
        // Webhook secrets — test and live are separate fields
        stripeWebhookSecretTest: form.webhookSecretTest || void 0,
        stripeWebhookSecretLive: form.webhookSecretLive || void 0,
        // Legacy single webhook field — write active mode's secret here too
        stripeWebhookSecret: form.isTestMode ? form.webhookSecretTest || void 0 : form.webhookSecretLive || void 0,
        // Price IDs — ALL FOUR must always be written to prevent field deletion
        stripeWalkerPriceId: form.priceWalker || void 0,
        stripeProPriceId: form.priceTraveler || void 0,
        stripeMaxPriceId: form.priceLord || void 0,
        stripeBackupPriceId: form.priceBackup || void 0,
        // Mode
        stripeMode: form.isTestMode ? "test" : "live",
        // Preserve existing PayPal config untouched
        paypalClientId: existingPayPal.paypalClientId,
        paypalClientSecret: existingPayPal.paypalClientSecret,
        paypalMode: existingPayPal.paypalMode ?? "sandbox"
      };
      const result = await actor.adminSavePaymentConfig(
        paymentConfig
      );
      if (result.__kind__ === "ok") {
        ue.success("Payment settings saved", {
          description: "All keys and Price IDs stored permanently. They will never disappear on redeploy."
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
              label: "Stripe"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-lg bg-secondary/20 border border-border/40 px-4 py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs font-bold text-foreground", children: form.isTestMode ? "Test Mode" : "Live Mode" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-muted-foreground mt-0.5", children: form.isTestMode ? "Sandbox only — use test keys" : "Real payments enabled — use live keys" })
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
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Label,
                {
                  htmlFor: "stripe-webhook-test",
                  className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
                  children: [
                    "Webhook Secret — Test Mode",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/50 normal-case tracking-normal ml-1", children: "(STRIPE_WEBHOOK_SECRET_TEST)" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                MaskedInput,
                {
                  id: "stripe-webhook-test",
                  value: form.webhookSecretTest,
                  onChange: (v) => setField("webhookSecretTest", v),
                  placeholder: "whsec_… (test)",
                  "data-ocid": "stripe-webhook-secret-test"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Label,
                {
                  htmlFor: "stripe-webhook-live",
                  className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
                  children: [
                    "Webhook Secret — Live Mode",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/50 normal-case tracking-normal ml-1", children: "(STRIPE_WEBHOOK_SECRET_LIVE)" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                MaskedInput,
                {
                  id: "stripe-webhook-live",
                  value: form.webhookSecretLive,
                  onChange: (v) => setField("webhookSecretLive", v),
                  placeholder: "whsec_… (live)",
                  "data-ocid": "stripe-webhook-secret-live"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center gap-2 rounded-lg bg-primary/5 border border-primary/20 px-3 py-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[10px] text-muted-foreground flex-1 min-w-0 truncate", children: [
                  "Webhook URL:",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "https://past-e-jev.caffeine.xyz/api/stripe/webhook" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      void navigator.clipboard.writeText(
                        "https://past-e-jev.caffeine.xyz/api/stripe/webhook"
                      );
                      ue.success("Webhook URL copied");
                    },
                    className: "text-muted-foreground hover:text-primary transition-colors shrink-0",
                    "aria-label": "Copy webhook URL",
                    "data-ocid": "copy-webhook-url-btn",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-3.5 h-3.5" })
                  }
                )
              ] })
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
  const { actor } = useActor(createActor);
  const [config, setConfig] = reactExports.useState({
    clientId: "",
    clientSecret: "",
    liveMode: false
  });
  const [loading, setLoading] = reactExports.useState(true);
  const [status, setStatus] = reactExports.useState("untested");
  const [saving, setSaving] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!actor) return;
    setLoading(true);
    actor.adminGetPaymentConfig().then((cfg) => {
      setConfig({
        clientId: str(cfg.paypalClientId),
        clientSecret: str(cfg.paypalClientSecret),
        liveMode: cfg.paypalMode === "live"
      });
    }).catch(() => {
    }).finally(() => setLoading(false));
  }, [actor]);
  function setField(k, v) {
    setConfig((prev) => ({ ...prev, [k]: v }));
    if (status !== "untested") setStatus("untested");
  }
  async function handleTest() {
    if (!config.clientId || !config.clientSecret) {
      ue.error("Missing credentials", {
        description: "Enter both Client ID and Secret to test."
      });
      return;
    }
    if (!actor) {
      ue.error("Not ready", { description: "Backend actor not available." });
      return;
    }
    setStatus("testing");
    try {
      const result = await actor.adminTestPaypalConnection(
        config.clientId,
        config.clientSecret,
        config.liveMode ? "live" : "sandbox"
      );
      if (result.__kind__ === "ok") {
        setStatus("connected");
        ue.success("PayPal credentials valid", {
          description: `Connected in ${config.liveMode ? "Live" : "Sandbox"} mode`
        });
      } else {
        setStatus("failed");
        ue.error("PayPal connection failed", {
          description: result.err ?? "Invalid credentials."
        });
      }
    } catch (err) {
      setStatus("failed");
      ue.error("PayPal connection failed", {
        description: err instanceof Error ? err.message : "Unknown error."
      });
    }
  }
  async function handleSave() {
    if (!config.clientId || !config.clientSecret) {
      ue.error("Required fields missing", {
        description: "Client ID and Secret are required."
      });
      return;
    }
    if (!actor) {
      ue.error("Not ready", { description: "Backend actor not available." });
      return;
    }
    setSaving(true);
    try {
      const existing = await actor.adminGetPaymentConfig();
      const paymentConfig = {
        stripePublishableKey: existing.stripePublishableKey,
        stripeSecretKey: existing.stripeSecretKey,
        stripeWebhookSecret: existing.stripeWebhookSecret,
        stripeWebhookSecretTest: existing.stripeWebhookSecretTest,
        stripeWebhookSecretLive: existing.stripeWebhookSecretLive,
        stripeWalkerPriceId: existing.stripeWalkerPriceId,
        stripeProPriceId: existing.stripeProPriceId,
        stripeMaxPriceId: existing.stripeMaxPriceId,
        stripeBackupPriceId: existing.stripeBackupPriceId,
        stripeMode: existing.stripeMode,
        paypalClientId: config.clientId || void 0,
        paypalClientSecret: config.clientSecret || void 0,
        paypalMode: config.liveMode ? "live" : "sandbox"
      };
      const result = await actor.adminSavePaymentConfig(
        paymentConfig
      );
      if (result.__kind__ === "ok") {
        ue.success("PayPal configuration saved", {
          description: `${config.liveMode ? "Live" : "Sandbox"} mode credentials stored.`
        });
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      className: "rounded-xl border border-accent/20 bg-card overflow-hidden",
      "data-ocid": "paypal-panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 border-b border-border/50 bg-card/80 flex items-center justify-between gap-4 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs font-bold text-accent", children: "P" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xs font-bold tracking-widest uppercase text-foreground", children: "PayPal" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-muted-foreground mt-0.5", children: "PayPal Checkout integration" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatusBadge,
            {
              status,
              mode: config.liveMode ? "live" : "sandbox",
              label: "PayPal"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5 space-y-5", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [0, 1].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-full bg-primary/5" }, i)) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-lg bg-secondary/20 border border-border/40 px-4 py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs font-bold text-foreground", children: config.liveMode ? "Live Mode" : "Sandbox Mode" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-muted-foreground mt-0.5", children: config.liveMode ? "Real transactions — use production credentials" : "Test payments only — use sandbox credentials" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Switch,
              {
                checked: config.liveMode,
                onCheckedChange: (v) => setField("liveMode", v),
                "data-ocid": "paypal-live-mode-toggle"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Label,
                {
                  htmlFor: "paypal-client-id",
                  className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
                  children: [
                    "Client ID",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/50 normal-case tracking-normal ml-1", children: "(PAYPAL_CLIENT_ID)" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "paypal-client-id",
                  value: config.clientId,
                  onChange: (e) => setField("clientId", e.target.value),
                  placeholder: "AaBbCcDd…",
                  className: "font-mono text-xs mt-1",
                  "data-ocid": "paypal-client-id"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Label,
                {
                  htmlFor: "paypal-secret",
                  className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
                  children: [
                    "Client Secret",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/50 normal-case tracking-normal ml-1", children: "(PAYPAL_CLIENT_SECRET)" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                MaskedInput,
                {
                  id: "paypal-secret",
                  value: config.clientSecret,
                  onChange: (v) => setField("clientSecret", v),
                  placeholder: "EeFfGgHh…",
                  "data-ocid": "paypal-client-secret"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-1 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                className: "font-mono text-xs gap-1.5",
                onClick: handleTest,
                disabled: status === "testing",
                "data-ocid": "paypal-test-btn",
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
                className: "font-mono text-xs gap-1.5 bg-accent text-accent-foreground hover:bg-accent/90 ml-auto",
                onClick: handleSave,
                disabled: saving,
                "data-ocid": "paypal-save-btn",
                children: [
                  saving ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-3.5 h-3.5" }),
                  saving ? "Saving…" : "Save Configuration"
                ]
              }
            )
          ] })
        ] }) })
      ]
    }
  );
}
function ConnectionStatusBar() {
  const { data: health, isLoading } = useGetStripeHealthStatus();
  function formatTs(ts) {
    if (!ts) return "No webhooks received yet";
    const ms = Number(ts) > 1e15 ? Number(ts) / 1e6 : Number(ts);
    return new Date(ms).toLocaleString();
  }
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
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-4 border-b border-border/50 bg-card/80", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xs font-bold tracking-widest uppercase text-foreground", children: "Connection Status" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-4 flex flex-col sm:flex-row gap-4", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-64 bg-primary/5" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
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
            (health == null ? void 0 : health.webhookConfigured) ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-green-400 shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-4 h-4 text-muted-foreground shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs text-muted-foreground", children: [
              "Webhook:",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: (health == null ? void 0 : health.webhookConfigured) ? "Configured" : "Not configured" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden sm:block w-px bg-border/40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[10px] text-muted-foreground", children: [
            "Last webhook:",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: formatTs(health == null ? void 0 : health.lastWebhookReceived) })
          ] })
        ] }) })
      ]
    }
  );
}
function WebhookLogSection() {
  const { data: log = [], isLoading } = useGetWebhookLog();
  function formatTs(ts) {
    const ms = Number(ts) > 1e15 ? Number(ts) / 1e6 : Number(ts);
    return new Date(ms).toLocaleString();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      className: "rounded-xl border border-border/40 bg-card overflow-hidden",
      "data-ocid": "webhook-log-section",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-4 border-b border-border/50 bg-card/80", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display text-xs font-bold tracking-widest uppercase text-foreground", children: [
          "Webhook Log",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] font-normal text-muted-foreground normal-case tracking-normal ml-1", children: "(Last 50 Events)" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5 space-y-2", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full bg-primary/5" }, i)) }) : log.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-8 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground", children: "No webhook events received yet. ⚡" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full min-w-[600px] text-left", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border/40", children: ["Time", "Event Type", "User", "Amount", "Status"].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "th",
            {
              className: "px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
              children: h
            },
            h
          )) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: log.map((entry, i) => {
            const rawAmount = entry.amountCents ?? entry.amount;
            const amountDisplay = rawAmount ? `$${safeNum(Number(rawAmount) / 100).toFixed(2)}` : "—";
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "tr",
              {
                className: `border-b border-border/20 ${i % 2 === 0 ? "bg-card/60" : "bg-background/40"}`,
                "data-ocid": `webhook-log-row-${i}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 font-mono text-[10px] text-muted-foreground whitespace-nowrap", children: formatTs(entry.processedAt) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 font-mono text-xs text-foreground whitespace-nowrap", children: entry.eventType }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 font-mono text-[10px] text-muted-foreground max-w-[120px] truncate", children: entry.userId ?? "—" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 font-mono text-xs text-right text-foreground whitespace-nowrap", children: amountDisplay }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: entry.status === "processed" ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-green-400", children: "✓ Processed" }) : entry.status === "failed" ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-destructive", children: "✗ Failed" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-muted-foreground", children: "Skipped" }) })
                ]
              },
              entry.eventId
            );
          }) })
        ] }) })
      ]
    }
  );
}
function FailedEventsSection() {
  const { data: events = [], isLoading } = useGetFailedWebhookEvents();
  const retryEvent = useRetryFailedWebhookEvent();
  function formatTs(ts) {
    const ms = Number(ts) > 1e15 ? Number(ts) / 1e6 : Number(ts);
    return new Date(ms).toLocaleString();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      className: "rounded-xl border border-border/40 bg-card overflow-hidden",
      "data-ocid": "failed-events-section",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-4 border-b border-border/50 bg-card/80", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xs font-bold tracking-widest uppercase text-foreground", children: "Failed Events" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5 space-y-2", children: [0, 1].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full bg-primary/5" }, i)) }) : events.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-8 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-green-400", children: "No failed events. All systems go! ⚡" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full min-w-[640px] text-left", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border/40", children: ["Time", "Event Type", "Error", "Retries", "Actions"].map(
            (h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "th",
              {
                className: "px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
                children: h
              },
              h
            )
          ) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: events.map((ev, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "tr",
            {
              className: `border-b border-border/20 ${i % 2 === 0 ? "bg-card/60" : "bg-background/40"}`,
              "data-ocid": `failed-event-row-${i}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 font-mono text-[10px] text-muted-foreground whitespace-nowrap", children: formatTs(ev.createdAt) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 font-mono text-xs text-foreground whitespace-nowrap", children: ev.eventType }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 font-mono text-[10px] text-destructive max-w-[200px] truncate", children: ev.errorMessage }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 font-mono text-xs text-muted-foreground text-right", children: ev.retryCount }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    size: "sm",
                    variant: "outline",
                    className: "h-7 px-2.5 font-mono text-[10px] gap-1.5",
                    disabled: retryEvent.isPending,
                    onClick: () => retryEvent.mutate({ eventId: ev.id }),
                    "data-ocid": `retry-event-btn-${i}`,
                    children: [
                      retryEvent.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3 h-3 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCcw, { className: "w-3 h-3" }),
                      "Retry"
                    ]
                  }
                ) })
              ]
            },
            ev.id
          )) })
        ] }) })
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
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-muted-foreground mt-1", children: "Configure Stripe and PayPal credentials. All values are stored permanently in the database — they survive every redeploy and never disappear. Secret keys are never displayed in plain text." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 rounded-md bg-destructive/5 border border-destructive/20 px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-destructive/80", children: "⚠ Admin only — these keys are never exposed to regular users or stored in browser history." }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(StripePanel, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PayPalPanel, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(WebhookLogSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FailedEventsSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(RevenueSummarySection, {})
  ] }) });
}
export {
  AdminPaymentsPage
};
