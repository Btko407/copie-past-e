import { AdminLayout } from "@/components/admin/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useActor } from "@caffeineai/core-infrastructure";
import {
  CheckCircle2,
  Copy,
  Eye,
  EyeOff,
  Loader2,
  RefreshCcw,
  Save,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { createActor } from "../../backend";
import type { PaymentConfig } from "../../backend.d";
import {
  useGetFailedWebhookEvents,
  useGetRevenueStats,
  useGetStripeHealthStatus,
  useGetWebhookLog,
  useRetryFailedWebhookEvent,
} from "../../hooks/useStripePayments";

// ─── Types ────────────────────────────────────────────────────────────────────

type ConnectionStatus =
  | "untested"
  | "connected"
  | "failed"
  | "testing"
  | "keys-ok-no-prices";

// ─── Safe Number Helper ───────────────────────────────────────────────────────
// Prevents .toFixed() crashes when stats values are null/undefined/non-numeric

function safeNum(val: unknown): number {
  const n = Number.parseFloat(String(val));
  return Number.isNaN(n) ? 0 : n;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ActorAny = any;

// Internal form state — flat, matches each form field one-to-one
interface StripeFormState {
  publishableKey: string;
  secretKey: string;
  /** Webhook secret for test mode (stripeWebhookSecretTest) */
  webhookSecretTest: string;
  /** Webhook secret for live mode (stripeWebhookSecretLive) */
  webhookSecretLive: string;
  /** Time Walker $6.99 → stripeWalkerPriceId */
  priceWalker: string;
  /** Time Traveler $9.99 → stripeProPriceId */
  priceTraveler: string;
  /** Time Lord $19.99 → stripeLordPriceId */
  priceLord: string;
  /** Smart Backup $29.99 → stripeBackupPriceId */
  priceBackup: string;
  isTestMode: boolean;
}

interface PayPalFormState {
  clientId: string;
  clientSecret: string;
  liveMode: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Extract a string value from a PaymentConfig optional field safely */
function str(v: string | undefined | null): string {
  return v ?? "";
}

// ─── Masked Input ─────────────────────────────────────────────────────────────

function MaskedInput({
  id,
  value,
  onChange,
  placeholder,
  "data-ocid": ocid,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  "data-ocid"?: string;
}) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div className="relative">
      <Input
        id={id}
        type={revealed ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="font-mono text-xs pr-9"
        autoComplete="off"
        data-ocid={ocid}
      />
      <button
        type="button"
        onClick={() => setRevealed((r) => !r)}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        aria-label={revealed ? "Hide key" : "Reveal key"}
      >
        {revealed ? (
          <EyeOff className="w-3.5 h-3.5" />
        ) : (
          <Eye className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({
  status,
  mode,
  label,
}: {
  status: ConnectionStatus;
  mode: "live" | "sandbox" | "test";
  label: string;
}) {
  if (status === "connected") {
    return (
      <Badge
        variant="outline"
        className="font-mono text-[10px] text-green-400 border-green-400/40 bg-green-400/5 gap-1"
      >
        <CheckCircle2 className="w-2.5 h-2.5" />
        {label}: Connected (
        {mode === "live" ? "Live" : mode === "sandbox" ? "Sandbox" : "Test"}{" "}
        Mode)
      </Badge>
    );
  }
  if (status === "keys-ok-no-prices") {
    return (
      <Badge
        variant="outline"
        className="font-mono text-[10px] text-accent border-accent/40 bg-accent/5 gap-1"
      >
        <CheckCircle2 className="w-2.5 h-2.5" />
        {label}: Keys OK — Price IDs missing
      </Badge>
    );
  }
  if (status === "failed") {
    return (
      <Badge
        variant="outline"
        className="font-mono text-[10px] text-destructive border-destructive/40 bg-destructive/5 gap-1"
      >
        <XCircle className="w-2.5 h-2.5" />
        {label}: Connection Failed
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className="font-mono text-[10px] text-muted-foreground border-border/40 bg-muted/5"
    >
      {label}: Not Configured
    </Badge>
  );
}

// ─── Stripe Panel ─────────────────────────────────────────────────────────────

function StripePanel() {
  const { actor } = useActor(createActor);
  const [form, setForm] = useState<StripeFormState>({
    publishableKey: "",
    secretKey: "",
    webhookSecretTest: "",
    webhookSecretLive: "",
    priceWalker: "",
    priceTraveler: "",
    priceLord: "",
    priceBackup: "",
    isTestMode: true,
  });
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<ConnectionStatus>("untested");
  const [saving, setSaving] = useState(false);

  // Map PaymentConfig → form state — always called fresh from backend data
  const applyConfig = useCallback((cfg: PaymentConfig) => {
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
      isTestMode: cfg.stripeMode !== "live",
    });
    // Derive initial status indicator from loaded config
    const hasKeys = !!(cfg.stripePublishableKey && cfg.stripeSecretKey);
    const hasPrices = !!(
      cfg.stripeWalkerPriceId ||
      cfg.stripeProPriceId ||
      cfg.stripeMaxPriceId
    );
    if (hasKeys && !hasPrices) setStatus("keys-ok-no-prices");
    else if (!hasKeys) setStatus("untested");
    // If both keys and prices present, leave as untested until Test Connection runs
  }, []);

  // Load config from backend on mount — always re-fetches fresh data on each mount
  useEffect(() => {
    if (!actor) return;
    setLoading(true);
    (actor as ActorAny)
      .adminGetPaymentConfig()
      .then((cfg: PaymentConfig) => {
        applyConfig(cfg);
      })
      .catch(() => {
        toast.error("Could not load payment config", {
          description: "Check your connection and refresh the page.",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [actor, applyConfig]);

  function setField<K extends keyof StripeFormState>(
    k: K,
    v: StripeFormState[K],
  ) {
    setForm((prev) => ({ ...prev, [k]: v }));
    if (status !== "untested") setStatus("untested");
  }

  async function handleTest() {
    if (!form.publishableKey || !form.secretKey) {
      toast.error("Missing keys", {
        description: "Enter both Publishable and Secret keys to test.",
      });
      return;
    }
    if (!actor) {
      toast.error("Not ready", { description: "Backend actor not available." });
      return;
    }
    setStatus("testing");
    try {
      const result = await (actor as ActorAny).adminTestStripeConnection(
        form.secretKey,
      );
      if (result.__kind__ === "ok") {
        const hasPrices = !!(
          form.priceWalker ||
          form.priceTraveler ||
          form.priceLord
        );
        setStatus(hasPrices ? "connected" : "keys-ok-no-prices");
        toast.success("Stripe connected", {
          description: hasPrices
            ? `Keys validated (${form.isTestMode ? "Test" : "Live"} Mode)`
            : "Keys OK — add Price IDs to complete setup",
        });
      } else {
        const errMsg =
          (result.err as string) ?? "Invalid keys or unreachable endpoint.";
        setStatus("failed");
        toast.error("Stripe connection failed", { description: errMsg });
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Unknown error.";
      setStatus("failed");
      toast.error("Stripe connection failed", { description: errMsg });
    }
  }

  async function handleSave() {
    if (!actor) {
      toast.error("Not ready", { description: "Backend actor not available." });
      return;
    }

    // Allow saving price IDs even without keys — just warn if keys are also missing
    const hasBothKeys = !!(form.publishableKey && form.secretKey);
    const hasPriceIds = !!(
      form.priceWalker ||
      form.priceTraveler ||
      form.priceLord ||
      form.priceBackup
    );

    if (!hasBothKeys && !hasPriceIds) {
      toast.error("Nothing to save", {
        description: "Enter at least one Stripe key or Price ID before saving.",
      });
      return;
    }

    setSaving(true);
    try {
      // Fetch existing PayPal config so we don't overwrite it
      let existingPayPal: Pick<
        PaymentConfig,
        "paypalClientId" | "paypalClientSecret" | "paypalMode"
      > = {
        paypalClientId: undefined,
        paypalClientSecret: undefined,
        paypalMode: "sandbox",
      };
      try {
        const existing: PaymentConfig = await (
          actor as ActorAny
        ).adminGetPaymentConfig();
        existingPayPal = {
          paypalClientId: existing.paypalClientId,
          paypalClientSecret: existing.paypalClientSecret,
          paypalMode: existing.paypalMode,
        };
      } catch {
        /* ignore — proceed with empty PayPal config */
      }

      // Build the PaymentConfig, mapping every form field to the correct key.
      // Use undefined (not empty string) for blank optional fields so the backend
      // stores null rather than an empty string that looks "configured".
      const paymentConfig: PaymentConfig = {
        // Stripe keys — only set if non-empty
        stripePublishableKey: form.publishableKey || undefined,
        stripeSecretKey: form.secretKey || undefined,
        // Webhook secrets — test and live are separate fields
        stripeWebhookSecretTest: form.webhookSecretTest || undefined,
        stripeWebhookSecretLive: form.webhookSecretLive || undefined,
        // Legacy single webhook field — write active mode's secret here too
        stripeWebhookSecret: form.isTestMode
          ? form.webhookSecretTest || undefined
          : form.webhookSecretLive || undefined,
        // Price IDs — ALL FOUR must always be written to prevent field deletion
        stripeWalkerPriceId: form.priceWalker || undefined,
        stripeProPriceId: form.priceTraveler || undefined,
        stripeMaxPriceId: form.priceLord || undefined,
        stripeBackupPriceId: form.priceBackup || undefined,
        // Mode
        stripeMode: form.isTestMode ? "test" : "live",
        // Preserve existing PayPal config untouched
        paypalClientId: existingPayPal.paypalClientId,
        paypalClientSecret: existingPayPal.paypalClientSecret,
        paypalMode: existingPayPal.paypalMode ?? "sandbox",
      };

      const result = await (actor as ActorAny).adminSavePaymentConfig(
        paymentConfig,
      );

      if (result.__kind__ === "ok") {
        toast.success("Payment settings saved", {
          description:
            "All keys and Price IDs stored permanently. They will never disappear on redeploy.",
        });

        // Re-fetch from backend to confirm what was actually persisted
        try {
          const confirmed: PaymentConfig = await (
            actor as ActorAny
          ).adminGetPaymentConfig();
          applyConfig(confirmed);

          // Warn if any field that was entered is missing from what came back
          const savedOk =
            (!form.priceWalker ||
              confirmed.stripeWalkerPriceId === form.priceWalker) &&
            (!form.priceTraveler ||
              confirmed.stripeProPriceId === form.priceTraveler) &&
            (!form.priceLord || confirmed.stripeMaxPriceId === form.priceLord);
          if (!savedOk) {
            toast.warning("Verify your Price IDs", {
              description:
                "Some fields may not have saved — please check and re-save if needed.",
            });
          }

          // Update status badge based on confirmed saved values
          const hasKeys = !!(
            confirmed.stripePublishableKey && confirmed.stripeSecretKey
          );
          const hasPrices = !!(
            confirmed.stripeWalkerPriceId ||
            confirmed.stripeProPriceId ||
            confirmed.stripeMaxPriceId
          );
          if (hasKeys && hasPrices) setStatus("untested");
          else if (hasKeys) setStatus("keys-ok-no-prices");
          else if (hasPrices) setStatus("untested");
        } catch {
          /* silent — save already succeeded */
        }
      } else {
        toast.error("Save failed", {
          description: (result.err as string) ?? "Unknown error.",
        });
      }
    } catch (err) {
      toast.error("Save failed", {
        description: err instanceof Error ? err.message : "Unknown error.",
      });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section
        className="rounded-xl border border-primary/20 bg-card overflow-hidden"
        data-ocid="stripe-panel"
      >
        <div className="px-5 py-4 border-b border-border/50 bg-card/80 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
            <span className="font-mono text-xs font-bold text-primary">S</span>
          </div>
          <div>
            <p className="font-display text-xs font-bold tracking-widest uppercase text-foreground">
              Stripe
            </p>
            <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
              Loading saved configuration…
            </p>
          </div>
          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground ml-auto" />
        </div>
        <div className="p-5 space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-9 w-full bg-primary/5" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      className="rounded-xl border border-primary/20 bg-card overflow-hidden"
      data-ocid="stripe-panel"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-border/50 bg-card/80 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
            <span className="font-mono text-xs font-bold text-primary">S</span>
          </div>
          <div>
            <p className="font-display text-xs font-bold tracking-widest uppercase text-foreground">
              Stripe
            </p>
            <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
              Credit card + Apple Pay processing
            </p>
          </div>
        </div>
        <StatusBadge
          status={status}
          mode={form.isTestMode ? "test" : "live"}
          label="Stripe"
        />
      </div>

      {/* Body */}
      <div className="p-5 space-y-5">
        {/* Live / Test toggle */}
        <div className="flex items-center justify-between rounded-lg bg-secondary/20 border border-border/40 px-4 py-3">
          <div>
            <p className="font-mono text-xs font-bold text-foreground">
              {form.isTestMode ? "Test Mode" : "Live Mode"}
            </p>
            <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
              {form.isTestMode
                ? "Sandbox only — use test keys"
                : "Real payments enabled — use live keys"}
            </p>
          </div>
          <Switch
            checked={!form.isTestMode}
            onCheckedChange={(v) => setField("isTestMode", !v)}
            data-ocid="stripe-live-mode-toggle"
          />
        </div>

        {/* Keys */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label
              htmlFor="stripe-pub"
              className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
            >
              Publishable Key
              <span className="text-muted-foreground/50 normal-case tracking-normal ml-1">
                (VITE_STRIPE_PUBLISHABLE_KEY)
              </span>
            </Label>
            <Input
              id="stripe-pub"
              value={form.publishableKey}
              onChange={(e) => setField("publishableKey", e.target.value)}
              placeholder={form.isTestMode ? "pk_test_…" : "pk_live_…"}
              className="font-mono text-xs mt-1"
              data-ocid="stripe-publishable-key"
            />
          </div>
          <div>
            <Label
              htmlFor="stripe-sec"
              className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
            >
              Secret Key
              <span className="text-muted-foreground/50 normal-case tracking-normal ml-1">
                (STRIPE_SECRET_KEY)
              </span>
            </Label>
            <MaskedInput
              id="stripe-sec"
              value={form.secretKey}
              onChange={(v) => setField("secretKey", v)}
              placeholder={form.isTestMode ? "sk_test_…" : "sk_live_…"}
              data-ocid="stripe-secret-key"
            />
          </div>

          {/* Webhook secrets — separate fields for test and live */}
          <div>
            <Label
              htmlFor="stripe-webhook-test"
              className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
            >
              Webhook Secret — Test Mode
              <span className="text-muted-foreground/50 normal-case tracking-normal ml-1">
                (STRIPE_WEBHOOK_SECRET_TEST)
              </span>
            </Label>
            <MaskedInput
              id="stripe-webhook-test"
              value={form.webhookSecretTest}
              onChange={(v) => setField("webhookSecretTest", v)}
              placeholder="whsec_… (test)"
              data-ocid="stripe-webhook-secret-test"
            />
          </div>
          <div>
            <Label
              htmlFor="stripe-webhook-live"
              className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
            >
              Webhook Secret — Live Mode
              <span className="text-muted-foreground/50 normal-case tracking-normal ml-1">
                (STRIPE_WEBHOOK_SECRET_LIVE)
              </span>
            </Label>
            <MaskedInput
              id="stripe-webhook-live"
              value={form.webhookSecretLive}
              onChange={(v) => setField("webhookSecretLive", v)}
              placeholder="whsec_… (live)"
              data-ocid="stripe-webhook-secret-live"
            />
            {/* Webhook URL info */}
            <div className="mt-2 flex items-center gap-2 rounded-lg bg-primary/5 border border-primary/20 px-3 py-2">
              <p className="font-mono text-[10px] text-muted-foreground flex-1 min-w-0 truncate">
                Webhook URL:{" "}
                <span className="text-primary">
                  https://past-e-jev.caffeine.xyz/api/stripe/webhook
                </span>
              </p>
              <button
                type="button"
                onClick={() => {
                  void navigator.clipboard.writeText(
                    "https://past-e-jev.caffeine.xyz/api/stripe/webhook",
                  );
                  toast.success("Webhook URL copied");
                }}
                className="text-muted-foreground hover:text-primary transition-colors shrink-0"
                aria-label="Copy webhook URL"
                data-ocid="copy-webhook-url-btn"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <Separator className="bg-border/40" />

        {/* Subscription Tier Price IDs — ALL FOUR always visible */}
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
            Subscription Tier Price IDs
          </p>
          <p className="font-mono text-[9px] text-muted-foreground/60 mb-3">
            Stripe Price IDs for each subscription tier — enter the price_… ID
            from your Stripe dashboard for each tier. All four fields are always
            saved together.
          </p>
          <div className="grid grid-cols-1 gap-4">
            {/* Time Walker $6.99 */}
            <div>
              <Label
                htmlFor="stripe-walker-price"
                className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
              >
                Time Walker Price ID
                <span className="text-muted-foreground/50 normal-case tracking-normal ml-1">
                  ($6.99 · STRIPE_PRICE_WALKER)
                </span>
              </Label>
              <Input
                id="stripe-walker-price"
                value={form.priceWalker}
                onChange={(e) => setField("priceWalker", e.target.value)}
                placeholder="price_…"
                className="font-mono text-xs mt-1"
                data-ocid="stripe-walker-price-id"
              />
            </div>
            {/* Time Traveler $9.99 */}
            <div>
              <Label
                htmlFor="stripe-pro-price"
                className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
              >
                Time Traveler Price ID
                <span className="text-muted-foreground/50 normal-case tracking-normal ml-1">
                  ($9.99 · STRIPE_PRICE_TRAVELER)
                </span>
              </Label>
              <Input
                id="stripe-pro-price"
                value={form.priceTraveler}
                onChange={(e) => setField("priceTraveler", e.target.value)}
                placeholder="price_…"
                className="font-mono text-xs mt-1"
                data-ocid="stripe-pro-price-id"
              />
            </div>
            {/* Time Lord $19.99 */}
            <div>
              <Label
                htmlFor="stripe-lord-price"
                className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
              >
                Time Lord Price ID
                <span className="text-muted-foreground/50 normal-case tracking-normal ml-1">
                  ($19.99 · STRIPE_PRICE_LORD)
                </span>
              </Label>
              <Input
                id="stripe-lord-price"
                value={form.priceLord}
                onChange={(e) => setField("priceLord", e.target.value)}
                placeholder="price_…"
                className="font-mono text-xs mt-1"
                data-ocid="stripe-lord-price-id"
              />
            </div>
            {/* Smart Backup $29.99 */}
            <div>
              <Label
                htmlFor="stripe-backup-price"
                className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
              >
                Smart Backup Export — $29.99
                <span className="text-muted-foreground/50 normal-case tracking-normal ml-1">
                  (STRIPE_PRICE_BACKUP)
                </span>
              </Label>
              <Input
                id="stripe-backup-price"
                value={form.priceBackup}
                onChange={(e) => setField("priceBackup", e.target.value)}
                placeholder="price_…"
                className="font-mono text-xs mt-1"
                data-ocid="stripe-backup-price-id"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            className="font-mono text-xs gap-1.5"
            onClick={handleTest}
            disabled={status === "testing" || saving}
            data-ocid="stripe-test-btn"
          >
            {status === "testing" ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RefreshCcw className="w-3.5 h-3.5" />
            )}
            {status === "testing" ? "Testing…" : "Test Connection"}
          </Button>
          <Button
            size="sm"
            className="font-mono text-xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 ml-auto"
            onClick={handleSave}
            disabled={saving || status === "testing"}
            data-ocid="stripe-save-btn"
          >
            {saving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            {saving ? "Saving…" : "Save Configuration"}
          </Button>
        </div>
      </div>
    </section>
  );
}

// ─── PayPal Panel ─────────────────────────────────────────────────────────────

function PayPalPanel() {
  const { actor } = useActor(createActor);
  const [config, setConfig] = useState<PayPalFormState>({
    clientId: "",
    clientSecret: "",
    liveMode: false,
  });
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<ConnectionStatus>("untested");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!actor) return;
    setLoading(true);
    (actor as ActorAny)
      .adminGetPaymentConfig()
      .then((cfg: PaymentConfig) => {
        setConfig({
          clientId: str(cfg.paypalClientId),
          clientSecret: str(cfg.paypalClientSecret),
          liveMode: cfg.paypalMode === "live",
        });
      })
      .catch(() => {
        /* silent — no saved config yet */
      })
      .finally(() => setLoading(false));
  }, [actor]);

  function setField<K extends keyof PayPalFormState>(
    k: K,
    v: PayPalFormState[K],
  ) {
    setConfig((prev) => ({ ...prev, [k]: v }));
    if (status !== "untested") setStatus("untested");
  }

  async function handleTest() {
    if (!config.clientId || !config.clientSecret) {
      toast.error("Missing credentials", {
        description: "Enter both Client ID and Secret to test.",
      });
      return;
    }
    if (!actor) {
      toast.error("Not ready", { description: "Backend actor not available." });
      return;
    }
    setStatus("testing");
    try {
      const result = await (actor as ActorAny).adminTestPaypalConnection(
        config.clientId,
        config.clientSecret,
        config.liveMode ? "live" : "sandbox",
      );
      if (result.__kind__ === "ok") {
        setStatus("connected");
        toast.success("PayPal credentials valid", {
          description: `Connected in ${config.liveMode ? "Live" : "Sandbox"} mode`,
        });
      } else {
        setStatus("failed");
        toast.error("PayPal connection failed", {
          description: (result.err as string) ?? "Invalid credentials.",
        });
      }
    } catch (err) {
      setStatus("failed");
      toast.error("PayPal connection failed", {
        description: err instanceof Error ? err.message : "Unknown error.",
      });
    }
  }

  async function handleSave() {
    if (!config.clientId || !config.clientSecret) {
      toast.error("Required fields missing", {
        description: "Client ID and Secret are required.",
      });
      return;
    }
    if (!actor) {
      toast.error("Not ready", { description: "Backend actor not available." });
      return;
    }
    setSaving(true);
    try {
      // Merge with existing Stripe config to avoid overwriting it
      const existing: PaymentConfig = await (
        actor as ActorAny
      ).adminGetPaymentConfig();
      const paymentConfig: PaymentConfig = {
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
        paypalClientId: config.clientId || undefined,
        paypalClientSecret: config.clientSecret || undefined,
        paypalMode: config.liveMode ? "live" : "sandbox",
      };
      const result = await (actor as ActorAny).adminSavePaymentConfig(
        paymentConfig,
      );
      if (result.__kind__ === "ok") {
        toast.success("PayPal configuration saved", {
          description: `${config.liveMode ? "Live" : "Sandbox"} mode credentials stored.`,
        });
      } else {
        toast.error("Save failed", {
          description: (result.err as string) ?? "Unknown error.",
        });
      }
    } catch (err) {
      toast.error("Save failed", {
        description: err instanceof Error ? err.message : "Unknown error.",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <section
      className="rounded-xl border border-accent/20 bg-card overflow-hidden"
      data-ocid="paypal-panel"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-border/50 bg-card/80 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center shrink-0">
            <span className="font-mono text-xs font-bold text-accent">P</span>
          </div>
          <div>
            <p className="font-display text-xs font-bold tracking-widest uppercase text-foreground">
              PayPal
            </p>
            <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
              PayPal Checkout integration
            </p>
          </div>
        </div>
        <StatusBadge
          status={status}
          mode={config.liveMode ? "live" : "sandbox"}
          label="PayPal"
        />
      </div>

      {/* Body */}
      <div className="p-5 space-y-5">
        {loading ? (
          <div className="space-y-3">
            {[0, 1].map((i) => (
              <Skeleton key={i} className="h-9 w-full bg-primary/5" />
            ))}
          </div>
        ) : (
          <>
            {/* Sandbox / Live toggle */}
            <div className="flex items-center justify-between rounded-lg bg-secondary/20 border border-border/40 px-4 py-3">
              <div>
                <p className="font-mono text-xs font-bold text-foreground">
                  {config.liveMode ? "Live Mode" : "Sandbox Mode"}
                </p>
                <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
                  {config.liveMode
                    ? "Real transactions — use production credentials"
                    : "Test payments only — use sandbox credentials"}
                </p>
              </div>
              <Switch
                checked={config.liveMode}
                onCheckedChange={(v) => setField("liveMode", v)}
                data-ocid="paypal-live-mode-toggle"
              />
            </div>

            {/* Credentials */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label
                  htmlFor="paypal-client-id"
                  className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
                >
                  Client ID
                  <span className="text-muted-foreground/50 normal-case tracking-normal ml-1">
                    (PAYPAL_CLIENT_ID)
                  </span>
                </Label>
                <Input
                  id="paypal-client-id"
                  value={config.clientId}
                  onChange={(e) => setField("clientId", e.target.value)}
                  placeholder="AaBbCcDd…"
                  className="font-mono text-xs mt-1"
                  data-ocid="paypal-client-id"
                />
              </div>
              <div>
                <Label
                  htmlFor="paypal-secret"
                  className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
                >
                  Client Secret
                  <span className="text-muted-foreground/50 normal-case tracking-normal ml-1">
                    (PAYPAL_CLIENT_SECRET)
                  </span>
                </Label>
                <MaskedInput
                  id="paypal-secret"
                  value={config.clientSecret}
                  onChange={(v) => setField("clientSecret", v)}
                  placeholder="EeFfGgHh…"
                  data-ocid="paypal-client-secret"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                className="font-mono text-xs gap-1.5"
                onClick={handleTest}
                disabled={status === "testing"}
                data-ocid="paypal-test-btn"
              >
                {status === "testing" ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <RefreshCcw className="w-3.5 h-3.5" />
                )}
                {status === "testing" ? "Testing…" : "Test Connection"}
              </Button>
              <Button
                size="sm"
                className="font-mono text-xs gap-1.5 bg-accent text-accent-foreground hover:bg-accent/90 ml-auto"
                onClick={handleSave}
                disabled={saving}
                data-ocid="paypal-save-btn"
              >
                {saving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                {saving ? "Saving…" : "Save Configuration"}
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

// ─── Connection Status Bar ────────────────────────────────────────────────────

function ConnectionStatusBar() {
  const { data: health, isLoading } = useGetStripeHealthStatus();

  function formatTs(ts: bigint | null | undefined): string {
    if (!ts) return "No webhooks received yet";
    const ms = Number(ts) > 1e15 ? Number(ts) / 1_000_000 : Number(ts);
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
    if (!health?.keysConfigured) return "text-destructive";
    if (health.status === "no_price_ids" || health.status === "keys_only")
      return "text-accent";
    return "text-green-400";
  })();

  return (
    <section
      className="rounded-xl border border-border/40 bg-card overflow-hidden"
      data-ocid="stripe-connection-status-bar"
    >
      <div className="px-5 py-4 border-b border-border/50 bg-card/80">
        <p className="font-display text-xs font-bold tracking-widest uppercase text-foreground">
          Connection Status
        </p>
      </div>
      <div className="px-5 py-4 flex flex-col sm:flex-row gap-4">
        {isLoading ? (
          <Skeleton className="h-8 w-64 bg-primary/5" />
        ) : (
          <>
            <div className="flex items-center gap-2">
              {health?.keysConfigured ? (
                <CheckCircle2
                  className={`w-4 h-4 shrink-0 ${stripeStatusColor}`}
                />
              ) : (
                <XCircle className="w-4 h-4 text-destructive shrink-0" />
              )}
              <span className="font-mono text-xs">
                Stripe:{" "}
                <span className={`font-bold ${stripeStatusColor}`}>
                  {stripeStatusText}
                </span>
              </span>
            </div>
            <div className="hidden sm:block w-px bg-border/40" />
            <div className="flex items-center gap-2">
              {health?.webhookConfigured ? (
                <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-muted-foreground shrink-0" />
              )}
              <span className="font-mono text-xs text-muted-foreground">
                Webhook:{" "}
                <span className="text-foreground">
                  {health?.webhookConfigured ? "Configured" : "Not configured"}
                </span>
              </span>
            </div>
            <div className="hidden sm:block w-px bg-border/40" />
            <span className="font-mono text-[10px] text-muted-foreground">
              Last webhook:{" "}
              <span className="text-foreground">
                {formatTs(health?.lastWebhookReceived)}
              </span>
            </span>
          </>
        )}
      </div>
    </section>
  );
}

// ─── Webhook Log ──────────────────────────────────────────────────────────────

function WebhookLogSection() {
  const { data: log = [], isLoading } = useGetWebhookLog();

  function formatTs(ts: bigint): string {
    const ms = Number(ts) > 1e15 ? Number(ts) / 1_000_000 : Number(ts);
    return new Date(ms).toLocaleString();
  }

  return (
    <section
      className="rounded-xl border border-border/40 bg-card overflow-hidden"
      data-ocid="webhook-log-section"
    >
      <div className="px-5 py-4 border-b border-border/50 bg-card/80">
        <p className="font-display text-xs font-bold tracking-widest uppercase text-foreground">
          Webhook Log{" "}
          <span className="font-mono text-[10px] font-normal text-muted-foreground normal-case tracking-normal ml-1">
            (Last 50 Events)
          </span>
        </p>
      </div>
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="p-5 space-y-2">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-10 w-full bg-primary/5" />
            ))}
          </div>
        ) : log.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <p className="font-mono text-xs text-muted-foreground">
              No webhook events received yet. ⚡
            </p>
          </div>
        ) : (
          <table className="w-full min-w-[600px] text-left">
            <thead>
              <tr className="border-b border-border/40">
                {["Time", "Event Type", "User", "Amount", "Status"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {log.map((entry, i) => {
                // Handle both amountCents (legacy hook type) and amount (backend type)
                const rawAmount =
                  (entry as { amountCents?: number }).amountCents ??
                  (entry as { amount?: bigint }).amount;
                const amountDisplay = rawAmount
                  ? `$${safeNum(Number(rawAmount) / 100).toFixed(2)}`
                  : "—";
                return (
                  <tr
                    key={entry.eventId}
                    className={`border-b border-border/20 ${i % 2 === 0 ? "bg-card/60" : "bg-background/40"}`}
                    data-ocid={`webhook-log-row-${i}`}
                  >
                    <td className="px-4 py-2.5 font-mono text-[10px] text-muted-foreground whitespace-nowrap">
                      {formatTs(entry.processedAt)}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-xs text-foreground whitespace-nowrap">
                      {entry.eventType}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-[10px] text-muted-foreground max-w-[120px] truncate">
                      {entry.userId ?? "—"}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-xs text-right text-foreground whitespace-nowrap">
                      {amountDisplay}
                    </td>
                    <td className="px-4 py-2.5">
                      {entry.status === "processed" ? (
                        <span className="font-mono text-[10px] text-green-400">
                          ✓ Processed
                        </span>
                      ) : entry.status === "failed" ? (
                        <span className="font-mono text-[10px] text-destructive">
                          ✗ Failed
                        </span>
                      ) : (
                        <span className="font-mono text-[10px] text-muted-foreground">
                          Skipped
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

// ─── Failed Events ────────────────────────────────────────────────────────────

function FailedEventsSection() {
  const { data: events = [], isLoading } = useGetFailedWebhookEvents();
  const retryEvent = useRetryFailedWebhookEvent();

  function formatTs(ts: bigint): string {
    const ms = Number(ts) > 1e15 ? Number(ts) / 1_000_000 : Number(ts);
    return new Date(ms).toLocaleString();
  }

  return (
    <section
      className="rounded-xl border border-border/40 bg-card overflow-hidden"
      data-ocid="failed-events-section"
    >
      <div className="px-5 py-4 border-b border-border/50 bg-card/80">
        <p className="font-display text-xs font-bold tracking-widest uppercase text-foreground">
          Failed Events
        </p>
      </div>
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="p-5 space-y-2">
            {[0, 1].map((i) => (
              <Skeleton key={i} className="h-10 w-full bg-primary/5" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <p className="font-mono text-xs text-green-400">
              No failed events. All systems go! ⚡
            </p>
          </div>
        ) : (
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="border-b border-border/40">
                {["Time", "Event Type", "Error", "Retries", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {events.map((ev, i) => (
                <tr
                  key={ev.id}
                  className={`border-b border-border/20 ${i % 2 === 0 ? "bg-card/60" : "bg-background/40"}`}
                  data-ocid={`failed-event-row-${i}`}
                >
                  <td className="px-4 py-2.5 font-mono text-[10px] text-muted-foreground whitespace-nowrap">
                    {formatTs(ev.createdAt)}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs text-foreground whitespace-nowrap">
                    {ev.eventType}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-[10px] text-destructive max-w-[200px] truncate">
                    {ev.errorMessage}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground text-right">
                    {ev.retryCount}
                  </td>
                  <td className="px-4 py-2.5">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 px-2.5 font-mono text-[10px] gap-1.5"
                      disabled={retryEvent.isPending}
                      onClick={() => retryEvent.mutate({ eventId: ev.id })}
                      data-ocid={`retry-event-btn-${i}`}
                    >
                      {retryEvent.isPending ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <RefreshCcw className="w-3 h-3" />
                      )}
                      Retry
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

// ─── Revenue Summary ──────────────────────────────────────────────────────────

function RevenueSummarySection() {
  const { data: stats, isLoading } = useGetRevenueStats();

  function buildCards(s: typeof stats) {
    return [
      {
        label: "Today",
        value: `$${safeNum(s?.today).toFixed(2)}`,
        color: "text-primary",
      },
      {
        label: "This Week",
        value: `$${safeNum(s?.week).toFixed(2)}`,
        color: "text-accent",
      },
      {
        label: "This Month",
        value: `$${safeNum(s?.month).toFixed(2)}`,
        color: "text-green-400",
      },
      {
        label: "Active Subscribers",
        value: String(safeNum(s?.activeSubscribers)),
        color: "text-foreground",
      },
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

  const showNoDataNote =
    !isLoading && (stats === null || stats === undefined || renderError);

  return (
    <section
      className="rounded-xl border border-border/40 bg-card overflow-hidden"
      data-ocid="revenue-summary-section"
    >
      <div className="px-5 py-4 border-b border-border/50 bg-card/80">
        <p className="font-display text-xs font-bold tracking-widest uppercase text-foreground">
          Revenue Summary
        </p>
      </div>
      <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {cards.map(({ label, value, color }) =>
          isLoading ? (
            <Skeleton key={label} className="h-20 rounded-lg bg-primary/5" />
          ) : (
            <div
              key={label}
              className="rounded-lg bg-background/60 border border-border/30 px-4 py-4 flex flex-col gap-1"
              data-ocid={`revenue-stat-${label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {label}
              </p>
              <p
                className={`font-display text-2xl font-black tracking-wide ${color}`}
              >
                {value}
              </p>
            </div>
          ),
        )}
      </div>
      {showNoDataNote && (
        <p className="px-5 pb-4 font-mono text-[10px] text-muted-foreground">
          Revenue data will appear after the first payment is processed.
        </p>
      )}
    </section>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export function AdminPaymentsPage() {
  return (
    <AdminLayout title="Payments" subtitle="Configuration">
      <div className="max-w-3xl space-y-8" data-ocid="admin-payments-page">
        {/* Connection status bar */}
        <ConnectionStatusBar />

        {/* Page header */}
        <div>
          <p className="font-display text-xs font-bold tracking-widest uppercase text-foreground">
            Payment Gateway Configuration
          </p>
          <p className="font-mono text-[10px] text-muted-foreground mt-1">
            Configure Stripe and PayPal credentials. All values are stored
            permanently in the database — they survive every redeploy and never
            disappear. Secret keys are never displayed in plain text.
          </p>
          <div className="mt-3 rounded-md bg-destructive/5 border border-destructive/20 px-4 py-2.5">
            <p className="font-mono text-[10px] text-destructive/80">
              ⚠ Admin only — these keys are never exposed to regular users or
              stored in browser history.
            </p>
          </div>
        </div>

        <StripePanel />
        <PayPalPanel />

        {/* Webhook Log */}
        <WebhookLogSection />

        {/* Failed Events */}
        <FailedEventsSection />

        {/* Revenue Summary */}
        <RevenueSummarySection />
      </div>
    </AdminLayout>
  );
}
