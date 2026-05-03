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
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  RefreshCcw,
  Save,
  Shield,
  XCircle,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { createActor } from "../../backend";
import type { PaymentConfig } from "../../backend.d";
import {
  useGetCanisterCyclesBalance,
  useGetRevenueStats,
  useGetStripeHealthStatus,
} from "../../hooks/useStripePayments";

// ─── Types ────────────────────────────────────────────────────────────────────

type ConnectionStatus =
  | "untested"
  | "connected"
  | "failed"
  | "testing"
  | "keys-ok-no-prices";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ActorAny = any;

// ─── Safe Number Helper ───────────────────────────────────────────────────────

function safeNum(val: unknown): number {
  const n = Number.parseFloat(String(val));
  return Number.isNaN(n) ? 0 : n;
}

// Internal form state
interface StripeFormState {
  publishableKey: string;
  secretKey: string;
  priceWalker: string;
  priceTraveler: string;
  priceLord: string;
  priceBackup: string;
  gasWalkerPriceId: string;
  gasTravelerPriceId: string;
  gasLordPriceId: string;
  isTestMode: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
  errorMsg,
}: {
  status: ConnectionStatus;
  mode: "live" | "sandbox" | "test";
  label: string;
  errorMsg?: string;
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
        {label}: Keys OK — Add Price IDs
      </Badge>
    );
  }
  if (status === "failed") {
    return (
      <Badge
        variant="outline"
        className="font-mono text-[10px] text-destructive border-destructive/40 bg-destructive/5 gap-1 max-w-[260px] truncate"
        title={errorMsg ? `Key Invalid: ${errorMsg}` : "Connection Failed"}
      >
        <XCircle className="w-2.5 h-2.5 shrink-0" />
        {label}: {errorMsg ? `Key Invalid: ${errorMsg}` : "Connection Failed"}
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

// ─── Cycles Balance Card ──────────────────────────────────────────────────────

function CyclesBalanceCard() {
  const { data: balance, isLoading } = useGetCanisterCyclesBalance();

  // Convert raw cycles to trillions
  const ONE_TRILLION = 1_000_000_000_000n;
  const LOW_THRESHOLD = 1_000_000_000_000n; // 1 trillion

  const isLow =
    balance !== null && balance !== undefined && balance < LOW_THRESHOLD;
  const trillions =
    balance !== null && balance !== undefined
      ? (Number(balance) / 1_000_000_000_000).toFixed(3)
      : null;

  return (
    <div
      className={`rounded-lg border px-4 py-3 flex items-center gap-3 ${
        isLow
          ? "border-accent/40 bg-accent/5"
          : "border-primary/20 bg-primary/5"
      }`}
      data-ocid="cycles-balance-card"
    >
      <Zap
        className={`w-4 h-4 shrink-0 ${isLow ? "text-accent" : "text-primary"}`}
      />
      <div className="flex-1 min-w-0">
        {isLoading ? (
          <Skeleton className="h-4 w-40 bg-primary/10" />
        ) : trillions !== null ? (
          <p className="font-mono text-xs text-foreground">
            Canister Cycles:{" "}
            <span
              className={`font-bold ${isLow ? "text-accent" : "text-primary"}`}
            >
              {trillions} trillion
            </span>
            {balance !== null && balance !== undefined && (
              <span className="text-muted-foreground ml-2 text-[10px]">
                ({Number(balance).toLocaleString()} cycles)
              </span>
            )}
          </p>
        ) : (
          <p className="font-mono text-xs text-muted-foreground">
            Canister Cycles: Not available (
            <span className="text-muted-foreground/60">
              getCanisterCyclesBalance not yet deployed
            </span>
            )
          </p>
        )}
        {isLow && (
          <p className="font-mono text-[10px] text-accent mt-0.5">
            ⚠ Low cycles warning. Top up your canister to prevent outages. HTTPS
            outcalls (Stripe, Gemini) will fail if cycles run out.
          </p>
        )}
      </div>
      {ONE_TRILLION && null /* keep import used */}
    </div>
  );
}

// ─── ICP Payment Verification Info Block ─────────────────────────────────────

function IcpPaymentVerificationBlock() {
  return (
    <section
      className="rounded-xl border border-primary/20 bg-card overflow-hidden"
      data-ocid="icp-payment-verification-block"
    >
      <div className="px-5 py-4 border-b border-border/50 bg-card/80 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
          <Shield className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="font-display text-xs font-bold tracking-widest uppercase text-foreground">
            Payment Verification
          </p>
          <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
            ICP Architecture — Polling, not webhooks
          </p>
        </div>
        <Badge
          variant="outline"
          className="ml-auto font-mono text-[10px] text-primary border-primary/40 bg-primary/5"
        >
          Polling (ICP)
        </Badge>
      </div>
      <div className="p-5 space-y-3">
        <div className="rounded-lg bg-primary/5 border border-primary/15 px-4 py-3">
          <p className="font-mono text-xs font-bold text-primary mb-1">
            Payment Verification: Polling (ICP Architecture)
          </p>
          <p className="font-mono text-[10px] text-muted-foreground leading-relaxed">
            Stripe payments are verified by direct canister HTTPS calls to
            Stripe&apos;s API. Webhooks are not used on Internet Computer — the
            canister cannot receive inbound HTTP requests.
          </p>
        </div>
        <div className="space-y-2 font-mono text-[10px] text-muted-foreground">
          <p className="flex items-start gap-2">
            <span className="text-primary shrink-0 mt-0.5">1.</span>
            <span>
              User clicks upgrade → canister calls{" "}
              <code className="text-primary bg-primary/10 px-1 rounded">
                createStripeCheckoutSession
              </code>{" "}
              → browser redirects to Stripe
            </span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-primary shrink-0 mt-0.5">2.</span>
            <span>
              After payment, Stripe redirects to{" "}
              <code className="text-primary bg-primary/10 px-1 rounded">
                /payment-success?session_id=XXX
              </code>
            </span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-primary shrink-0 mt-0.5">3.</span>
            <span>
              Frontend calls{" "}
              <code className="text-primary bg-primary/10 px-1 rounded">
                verifyAndGrantPayment(sessionId)
              </code>{" "}
              → canister verifies with Stripe API → days added additively
            </span>
          </p>
        </div>
        <CyclesBalanceCard />
      </div>
    </section>
  );
}

// ─── Stripe Panel ─────────────────────────────────────────────────────────────

function StripePanel() {
  const { actor } = useActor(createActor);
  const [form, setForm] = useState<StripeFormState>({
    publishableKey: "",
    secretKey: "",
    priceWalker: "",
    priceTraveler: "",
    priceLord: "",
    priceBackup: "",
    gasWalkerPriceId: "",
    gasTravelerPriceId: "",
    gasLordPriceId: "",
    isTestMode: true,
  });
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<ConnectionStatus>("untested");
  const [statusError, setStatusError] = useState<string>("");
  const [saving, setSaving] = useState(false);

  const applyConfig = useCallback((cfg: PaymentConfig) => {
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
      gasWalkerPriceId:
        str((cfg as ActorAny).stripeGasWalkerPriceId) || walkerPrice,
      gasTravelerPriceId:
        str((cfg as ActorAny).stripeGasTravelerPriceId) || travelerPrice,
      gasLordPriceId: str((cfg as ActorAny).stripeGasLordPriceId) || lordPrice,
      isTestMode: cfg.stripeMode !== "live",
    });
    const hasKeys = !!(cfg.stripePublishableKey && cfg.stripeSecretKey);
    const hasPrices = !!(
      cfg.stripeWalkerPriceId ||
      cfg.stripeProPriceId ||
      cfg.stripeMaxPriceId
    );
    if (hasKeys && !hasPrices) setStatus("keys-ok-no-prices");
    else if (!hasKeys) setStatus("untested");
  }, []);

  useEffect(() => {
    if (!actor) return;
    setLoading(true);
    (actor as ActorAny)
      .adminGetPaymentConfig()
      .then((cfg: PaymentConfig) => applyConfig(cfg))
      .catch(() => {
        toast.error("Could not load payment config", {
          description: "Check your connection and refresh the page.",
        });
      })
      .finally(() => setLoading(false));
  }, [actor, applyConfig]);

  function setField<K extends keyof StripeFormState>(
    k: K,
    v: StripeFormState[K],
  ) {
    setForm((prev) => ({ ...prev, [k]: v }));
    if (status !== "untested") {
      setStatus("untested");
      setStatusError("");
    }
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
    setStatusError("");
    try {
      const result = await (actor as ActorAny).adminTestStripeConnection(
        form.secretKey,
      );
      if (result.__kind__ === "ok") {
        const raw = result.ok as string;
        const chargesEnabled =
          raw.includes("charges_enabled:true") ||
          raw.includes('"charges_enabled":true');
        const hasPrices = !!(
          form.priceWalker ||
          form.priceTraveler ||
          form.priceLord
        );
        setStatus(hasPrices ? "connected" : "keys-ok-no-prices");
        toast.success("Stripe connected", {
          description: hasPrices
            ? `Connected — charges_enabled: ${chargesEnabled} (${form.isTestMode ? "Test" : "Live"} Mode)`
            : "Keys OK — add Price IDs to complete setup",
        });
      } else {
        const errMsg =
          (result.err as string) ?? "Invalid keys or unreachable endpoint.";
        setStatus("failed");
        setStatusError(errMsg);
        toast.error("Stripe connection failed", { description: errMsg });
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Unknown error.";
      setStatus("failed");
      setStatusError(errMsg);
      toast.error("Stripe connection failed", { description: errMsg });
    }
  }

  async function handleSave() {
    if (!actor) {
      toast.error("Not ready", { description: "Backend actor not available." });
      return;
    }
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
      // Auto-populate Gas Wallet price IDs from tier price IDs if left empty
      const gasWalker = form.gasWalkerPriceId || form.priceWalker;
      const gasTraveler = form.gasTravelerPriceId || form.priceTraveler;
      const gasLord = form.gasLordPriceId || form.priceLord;

      if (
        gasWalker !== form.gasWalkerPriceId ||
        gasTraveler !== form.gasTravelerPriceId ||
        gasLord !== form.gasLordPriceId
      ) {
        setForm((prev) => ({
          ...prev,
          gasWalkerPriceId: gasWalker,
          gasTravelerPriceId: gasTraveler,
          gasLordPriceId: gasLord,
        }));
      }

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
        /* ignore */
      }

      const paymentConfig = {
        stripePublishableKey: form.publishableKey || undefined,
        stripeSecretKey: form.secretKey || undefined,
        // No webhook secrets — ICP architecture uses polling
        stripeWebhookSecret: undefined,
        stripeWebhookSecretTest: undefined,
        stripeWebhookSecretLive: undefined,
        stripeWalkerPriceId: form.priceWalker || undefined,
        stripeProPriceId: form.priceTraveler || undefined,
        stripeMaxPriceId: form.priceLord || undefined,
        stripeBackupPriceId: form.priceBackup || undefined,
        stripeGasWalkerPriceId: gasWalker || undefined,
        stripeGasTravelerPriceId: gasTraveler || undefined,
        stripeGasLordPriceId: gasLord || undefined,
        stripeMode: form.isTestMode ? "test" : "live",
        paypalClientId: existingPayPal.paypalClientId,
        paypalClientSecret: existingPayPal.paypalClientSecret,
        paypalMode: existingPayPal.paypalMode ?? "sandbox",
      } as ActorAny;

      const result = await (actor as ActorAny).adminSavePaymentConfig(
        paymentConfig,
      );

      if (result.__kind__ === "ok") {
        toast.success("Payment settings saved", {
          description:
            "Keys and Price IDs stored permanently in canister stable storage.",
        });
        try {
          const confirmed: PaymentConfig = await (
            actor as ActorAny
          ).adminGetPaymentConfig();
          applyConfig(confirmed);
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
          /* silent */
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
          errorMsg={statusError}
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
                ? "Test mode: use Stripe test keys and test cards (e.g. 4242 4242 4242 4242). No real charges."
                : "Live mode: real payments only — use your live keys from the Stripe dashboard."}
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
        </div>

        <Separator className="bg-border/40" />

        {/* Subscription Tier Price IDs */}
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

        {/* Gas Wallet Price IDs — read-only display, auto-populated */}
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
            Gas Wallet Price IDs
          </p>
          <p className="font-mono text-[9px] text-muted-foreground/60 mb-3">
            Auto-populated from tier Price IDs above when you save. Gas Wallet
            purchases use the same Stripe products as subscription tiers — no
            new Stripe products needed.
          </p>
          <div className="grid grid-cols-1 gap-3">
            {[
              {
                label: "Gas Walker Price ID",
                hint: "= Time Walker",
                value: form.gasWalkerPriceId || form.priceWalker || "—",
                ocid: "stripe-gas-walker-price-id",
              },
              {
                label: "Gas Traveler Price ID",
                hint: "= Time Traveler",
                value: form.gasTravelerPriceId || form.priceTraveler || "—",
                ocid: "stripe-gas-traveler-price-id",
              },
              {
                label: "Gas Lord Price ID",
                hint: "= Time Lord",
                value: form.gasLordPriceId || form.priceLord || "—",
                ocid: "stripe-gas-lord-price-id",
              },
            ].map(({ label, hint, value, ocid }) => (
              <div
                key={ocid}
                className="flex items-center justify-between rounded-lg bg-secondary/10 border border-border/30 px-3 py-2.5"
                data-ocid={ocid}
              >
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {label}
                    <span className="normal-case tracking-normal text-muted-foreground/50 ml-1">
                      ({hint})
                    </span>
                  </p>
                </div>
                <code className="font-mono text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded max-w-[180px] truncate">
                  {value}
                </code>
              </div>
            ))}
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
  return (
    <section
      className="rounded-xl border border-border/30 bg-card overflow-hidden opacity-60"
      data-ocid="paypal-panel"
    >
      <div className="px-5 py-4 border-b border-border/50 bg-card/80 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-muted border border-border/30 flex items-center justify-center shrink-0">
            <span className="font-mono text-xs font-bold text-muted-foreground">
              P
            </span>
          </div>
          <div>
            <p className="font-display text-xs font-bold tracking-widest uppercase text-muted-foreground">
              PayPal
            </p>
            <p className="font-mono text-[10px] text-muted-foreground/60 mt-0.5">
              Not available in this version
            </p>
          </div>
        </div>
        <Badge
          variant="outline"
          className="font-mono text-[10px] text-muted-foreground border-border/30"
        >
          Not Available
        </Badge>
      </div>
      <div className="p-5">
        <div className="rounded-lg bg-muted/30 border border-border/20 px-4 py-3">
          <p className="font-mono text-[10px] text-muted-foreground leading-relaxed">
            PayPal payments are not available in this version. Stripe Checkout
            is the production payment path. PayPal may be added in a future
            release.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Connection Status Bar ────────────────────────────────────────────────────

function ConnectionStatusBar() {
  const { data: health, isLoading } = useGetStripeHealthStatus();

  // Compute config completeness score (out of 5 items)
  const scoreItems = [
    {
      label: "Publishable Key",
      ok: !!health?.keysConfigured,
      detail: health?.keysConfigured ? "Configured ✓" : "Missing ✗",
    },
    {
      label: "Secret Key",
      ok: !!health?.keysConfigured,
      detail: health?.keysConfigured ? "Configured ✓" : "Missing ✗",
    },
    {
      label: "Price IDs",
      ok: health?.status === "ok",
      detail:
        health?.status === "ok"
          ? "Configured ✓"
          : health?.status === "keys_only" || health?.status === "no_price_ids"
            ? "Missing ✗"
            : "Not set",
    },
    {
      label: "Connection",
      ok: health?.status === "ok" || health?.status === "keys_only",
      detail:
        health?.status === "ok" || health?.status === "keys_only"
          ? "Reachable ✓"
          : "Not verified",
    },
    {
      label: "Webhooks",
      ok: false,
      detail: "Not used (ICP)",
    },
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
      <div className="px-5 py-4 border-b border-border/50 bg-card/80 flex items-center justify-between gap-3 flex-wrap">
        <p className="font-display text-xs font-bold tracking-widest uppercase text-foreground">
          Connection Status
        </p>
        {!isLoading && (
          <Badge
            variant="outline"
            className={`font-mono text-[10px] border-border/40 ${
              configuredCount === 5
                ? "text-green-400 border-green-400/40 bg-green-400/5"
                : configuredCount >= 3
                  ? "text-accent border-accent/40 bg-accent/5"
                  : "text-destructive border-destructive/40 bg-destructive/5"
            }`}
            data-ocid="config-completeness-badge"
          >
            Config: {configuredCount}/5 configured
          </Badge>
        )}
      </div>
      <div className="px-5 py-4 flex flex-col sm:flex-row gap-4 flex-wrap">
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
              <Shield className="w-4 h-4 text-primary shrink-0" />
              <span className="font-mono text-xs text-muted-foreground">
                Verification:{" "}
                <span className="text-primary font-bold">
                  Polling (ICP Architecture)
                </span>
              </span>
            </div>
            {!health?.keysConfigured && (
              <>
                <div className="hidden sm:block w-px bg-border/40" />
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-accent shrink-0" />
                  <span className="font-mono text-[10px] text-accent">
                    Add keys below to enable payments
                  </span>
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Config Completeness Detail */}
      {!isLoading && (
        <div className="border-t border-border/30 px-5 py-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
            Configuration Checklist
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
            {scoreItems.map(({ label, ok, detail }) => (
              <div
                key={label}
                className={`rounded-lg border px-3 py-2 flex flex-col gap-0.5 ${
                  ok
                    ? "border-green-400/20 bg-green-400/5"
                    : "border-destructive/20 bg-destructive/5"
                }`}
              >
                <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                  {label}
                </span>
                <span
                  className={`font-mono text-[10px] font-bold ${
                    ok ? "text-green-400" : "text-destructive"
                  }`}
                >
                  {detail}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
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
            permanently in canister stable variables — they survive every
            redeploy and never disappear. Secret keys are never displayed in
            plain text.
          </p>
          <div className="mt-3 rounded-md bg-destructive/5 border border-destructive/20 px-4 py-2.5">
            <p className="font-mono text-[10px] text-destructive/80">
              ⚠ Admin only — these keys are never exposed to regular users or
              stored in browser history.
            </p>
          </div>
        </div>

        {/* ICP Payment Verification Info (replaces webhook section) */}
        <IcpPaymentVerificationBlock />

        <StripePanel />

        {/* Payment Model Info */}
        <section
          className="rounded-xl border border-border/30 bg-card overflow-hidden"
          data-ocid="payment-model-info"
        >
          <div className="px-5 py-4 border-b border-border/50 bg-card/80">
            <p className="font-display text-xs font-bold tracking-widest uppercase text-foreground">
              Payment Methods
            </p>
          </div>
          <div className="p-5 space-y-3">
            <div className="flex items-start gap-3 rounded-lg bg-primary/5 border border-primary/15 px-4 py-3">
              <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-mono text-xs font-bold text-foreground">
                  Stripe Checkout — Active
                </p>
                <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
                  Production payment path. Credit card, Apple Pay, Google Pay
                  via Stripe-hosted checkout. Verification uses polling
                  (webhooks are architecturally impossible on the Internet
                  Computer).
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg bg-muted/20 border border-border/20 px-4 py-3 opacity-60">
              <XCircle className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="font-mono text-xs font-bold text-muted-foreground">
                  PayPal — Not available in this version
                </p>
                <p className="font-mono text-[10px] text-muted-foreground/70 mt-0.5">
                  PayPal is not implemented. May be added in a future release.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg bg-muted/20 border border-border/20 px-4 py-3 opacity-60">
              <XCircle className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="font-mono text-xs font-bold text-muted-foreground">
                  Crypto — Not available in this version
                </p>
                <p className="font-mono text-[10px] text-muted-foreground/70 mt-0.5">
                  Cryptocurrency payments are not implemented. May be added in a
                  future release.
                </p>
              </div>
            </div>
          </div>
        </section>

        <PayPalPanel />

        {/* Revenue Summary */}
        <RevenueSummarySection />
      </div>
    </AdminLayout>
  );
}
