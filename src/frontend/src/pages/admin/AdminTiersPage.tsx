import { TimeCircuitsCountdown } from "@/components/TimeCircuitsCountdown";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminListProfiles } from "@/hooks/useAdminUsers";
import {
  useAdminCreateDiscountCode,
  useAdminDeactivateDiscountCode,
  useAdminListDiscountCodes,
} from "@/hooks/usePayments";
import {
  useAdminExtendUserTierByUsername,
  useAdminListSubscriptions,
  useAdminUpsertTier,
  useGetTiers,
} from "@/hooks/useTiers";
import {
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Plus,
  Tag,
  Trash2,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { TierConfig, UserTierSubscription } from "../../types";

// ─── Constants ────────────────────────────────────────────────────────────────

const TIER_NAMES: Record<number, string> = {
  1: "START TRIAL",
  2: "PRO ADVENTURE",
  3: "MAX FLUX",
};

const TIER_COLORS: Record<number, string> = {
  1: "text-green-400 border-green-400/40 bg-green-400/10",
  2: "text-primary border-primary/40 bg-primary/10",
  3: "text-accent border-accent/40 bg-accent/10",
};

const DAY_PRESETS = [
  { label: "30d", value: 30 },
  { label: "90d", value: 90 },
  { label: "6mo", value: 180 },
];

// ─── Tier Config Row ──────────────────────────────────────────────────────────

function TierConfigRow({
  tier,
  onEdit,
}: {
  tier: TierConfig;
  onEdit: (t: TierConfig) => void;
}) {
  const colorClass =
    TIER_COLORS[tier.tierId] ?? "text-foreground border-border bg-card/60";
  return (
    <div
      className="flex items-center gap-4 px-4 py-3 rounded-lg bg-card/60 border border-border/50 hover:border-primary/40 hover:bg-secondary/20 transition-all duration-200 group"
      data-ocid={`tier-config-row-${tier.tierId}`}
    >
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border-2 ${colorClass}`}
      >
        <span className="font-mono text-xs font-bold">{tier.tierId}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-display text-xs font-bold tracking-wider uppercase text-foreground">
          {TIER_NAMES[tier.tierId] ?? tier.name}
        </p>
        <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
          {tier.durationDays} days ·{" "}
          {tier.priceUSD === 0 ? (
            <span className="text-green-400">Free</span>
          ) : (
            <span className="text-accent">
              ${tier.priceUSD.toFixed(2)}/period
            </span>
          )}
        </p>
      </div>
      {tier.stripeProductId && (
        <span className="font-mono text-[10px] text-primary/50 truncate max-w-[110px] hidden md:block border border-primary/20 rounded px-1.5 py-0.5 bg-primary/5">
          {tier.stripeProductId}
        </span>
      )}
      <Button
        variant="outline"
        size="sm"
        className="font-mono text-[10px] tracking-widest uppercase shrink-0 opacity-60 group-hover:opacity-100 transition-opacity"
        onClick={() => onEdit(tier)}
        data-ocid={`edit-tier-btn-${tier.tierId}`}
      >
        Edit
      </Button>
    </div>
  );
}

// ─── Edit Tier Dialog ─────────────────────────────────────────────────────────

interface EditTierDialogProps {
  tier: TierConfig | null;
  onClose: () => void;
}

function EditTierDialog({ tier, onClose }: EditTierDialogProps) {
  const upsert = useAdminUpsertTier();
  const [name, setName] = useState(tier?.name ?? "");
  const [days, setDays] = useState(String(tier?.durationDays ?? 30));
  const [price, setPrice] = useState(String(tier?.priceUSD ?? 0));
  const [stripeId, setStripeId] = useState(tier?.stripeProductId ?? "");

  async function handleSave() {
    if (!tier) return;
    await upsert.mutateAsync({
      tierId: tier.tierId,
      name,
      durationDays: Number(days),
      priceUSD: Number(price),
      stripeProductId: stripeId || undefined,
    });
    toast.success(`Tier ${tier.tierId} saved`, {
      description: `${name} · ${days} days · $${Number(price).toFixed(2)}`,
    });
    onClose();
  }

  return (
    <Dialog open={!!tier} onOpenChange={() => onClose()}>
      <DialogContent className="bg-card border border-primary/30 max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display text-sm tracking-widest uppercase text-primary">
            ⚙ Edit Tier {tier?.tierId} — {TIER_NAMES[tier?.tierId ?? 1]}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 mt-2">
          <div>
            <Label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Internal Name
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="font-mono text-xs mt-1"
              data-ocid="edit-tier-name"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Duration (days)
              </Label>
              <Input
                value={days}
                onChange={(e) => setDays(e.target.value)}
                type="number"
                min={1}
                className="font-mono text-xs mt-1"
                data-ocid="edit-tier-days"
              />
            </div>
            <div>
              <Label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Price (USD)
              </Label>
              <Input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                type="number"
                step="0.01"
                min={0}
                className="font-mono text-xs mt-1"
                data-ocid="edit-tier-price"
              />
            </div>
          </div>
          <div>
            <Label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Stripe Product ID (optional)
            </Label>
            <Input
              value={stripeId}
              onChange={(e) => setStripeId(e.target.value)}
              className="font-mono text-xs mt-1"
              placeholder="prod_…"
              data-ocid="edit-tier-stripe-id"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              className="flex-1 font-mono text-xs"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 font-mono text-xs bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleSave}
              disabled={upsert.isPending}
              data-ocid="save-tier-btn"
            >
              {upsert.isPending ? "Saving…" : "Save Tier"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Grant Upgrade Dialog ─────────────────────────────────────────────────────

interface ExtendDialogProps {
  open: boolean;
  prefillUserId?: string;
  onClose: () => void;
}

function ExtendUserTierDialog({
  open,
  prefillUserId,
  onClose,
}: ExtendDialogProps) {
  const extend = useAdminExtendUserTierByUsername();
  const { data: tiers = [] } = useGetTiers();
  const [username, setUsername] = useState(prefillUserId ?? "");
  const [tierLevel, setTierLevel] = useState(2);
  const [days, setDays] = useState(30);
  const [customDays, setCustomDays] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [grantError, setGrantError] = useState<string | null>(null);

  const effectiveDays = useCustom ? Number(customDays) || 0 : days;
  const newExpiry = Date.now() + effectiveDays * 86400 * 1000;
  const selectedTier = tiers.find((t) => t.tierId === tierLevel);

  function handleClose() {
    if (!extend.isPending) {
      setGrantError(null);
      onClose();
    }
  }

  async function handleExtend() {
    if (!username.trim() || effectiveDays <= 0) return;
    setGrantError(null);

    try {
      await extend.mutateAsync({
        username: username.trim(),
        tierLevel,
        extraDays: effectiveDays,
      });
      toast.success(`⚡ Subscription granted to @${username}`, {
        description: `${TIER_NAMES[tierLevel]} · ${effectiveDays} days added · new expiry ${new Date(newExpiry).toLocaleDateString()}`,
      });
      setConfirmed(true);
      setTimeout(() => {
        setConfirmed(false);
        setUsername(prefillUserId ?? "");
        setTierLevel(2);
        setDays(30);
        setUseCustom(false);
        setCustomDays("");
        setGrantError(null);
        onClose();
      }, 2200);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to grant subscription.";
      setGrantError(message);
      toast.error("Grant failed", { description: message });
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-card border border-accent/40 max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span className="text-xl">🚗</span>
            <DialogTitle className="font-display text-sm tracking-widest uppercase text-accent">
              Fuel the DeLorean
            </DialogTitle>
          </div>
          <p className="font-mono text-[10px] text-muted-foreground tracking-wide mt-1">
            Grant a tier upgrade by username — adds time on top of current
            expiration
          </p>
        </DialogHeader>

        {confirmed ? (
          <div className="py-6 flex flex-col items-center gap-3">
            <span className="text-4xl animate-bounce">⚡</span>
            <p className="font-display text-sm font-bold tracking-widest uppercase text-accent text-center">
              88 MPH REACHED!
            </p>
            <p className="font-mono text-xs text-muted-foreground text-center">
              {effectiveDays} days added to @{username}&apos;s timeline
            </p>
            <TimeCircuitsCountdown expirationDate={newExpiry} compact />
          </div>
        ) : (
          <div className="space-y-4 mt-1">
            {/* Error display */}
            {grantError && (
              <div
                className="rounded-md bg-destructive/10 border border-destructive/30 px-3 py-2 flex items-start gap-2"
                role="alert"
                data-ocid="grant-error"
              >
                <span className="text-destructive text-sm shrink-0">⚠</span>
                <p className="text-destructive text-xs">{grantError}</p>
              </div>
            )}

            {/* Username — accepts username, not principal ID */}
            <div>
              <Label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Username
              </Label>
              <Input
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value.toLowerCase().replace(/\s+/g, ""))
                }
                className="font-mono text-xs mt-1"
                placeholder="e.g. johndoe"
                data-ocid="extend-user-id"
              />
              <p className="font-mono text-[10px] text-muted-foreground/60 mt-1">
                Enter the user&apos;s username (not their principal ID)
              </p>
            </div>

            {/* Tier selector */}
            <div>
              <Label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block">
                Select Tier
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTierLevel(t)}
                    className={`rounded-lg border px-3 py-2 text-left transition-all duration-150 ${
                      tierLevel === t
                        ? "border-accent bg-accent/10 ring-1 ring-accent/50"
                        : "border-border/50 hover:border-border"
                    }`}
                    data-ocid={`tier-select-${t}`}
                  >
                    <p
                      className={`font-mono text-[10px] font-bold uppercase tracking-widest ${tierLevel === t ? "text-accent" : "text-muted-foreground"}`}
                    >
                      Tier {t}
                    </p>
                    <p className="font-display text-[9px] uppercase tracking-wide text-foreground/60 truncate mt-0.5">
                      {TIER_NAMES[t]}
                    </p>
                    {tiers.length > 0 && (
                      <p className="font-mono text-[9px] text-primary/60 mt-0.5">
                        {selectedTier && t === tierLevel
                          ? `${selectedTier.durationDays}d base`
                          : `${tiers.find((x) => x.tierId === t)?.durationDays ?? "?"}d`}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Day presets */}
            <div>
              <Label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block">
                Days to Add
              </Label>
              <div className="flex gap-2 flex-wrap">
                {DAY_PRESETS.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => {
                      setDays(p.value);
                      setUseCustom(false);
                    }}
                    className={`font-mono text-xs px-3 py-1.5 rounded border transition-all duration-150 ${
                      !useCustom && days === p.value
                        ? "bg-primary/15 border-primary text-primary"
                        : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground"
                    }`}
                    data-ocid={`day-preset-${p.value}`}
                  >
                    {p.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setUseCustom(true)}
                  className={`font-mono text-xs px-3 py-1.5 rounded border transition-all duration-150 ${
                    useCustom
                      ? "bg-primary/15 border-primary text-primary"
                      : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground"
                  }`}
                  data-ocid="day-preset-custom"
                >
                  Custom
                </button>
              </div>
              {useCustom && (
                <Input
                  value={customDays}
                  onChange={(e) => setCustomDays(e.target.value)}
                  type="number"
                  min={1}
                  placeholder="Enter days…"
                  className="font-mono text-xs mt-2 w-32"
                  data-ocid="extend-days-custom"
                  autoFocus
                />
              )}
            </div>

            {/* Preview new expiration */}
            {username.trim() && effectiveDays > 0 && (
              <div className="rounded-lg border border-accent/30 bg-accent/5 p-3">
                <p className="font-mono text-[10px] uppercase tracking-widest text-accent/70 mb-2">
                  Preview · New Expiration for @{username}
                </p>
                <TimeCircuitsCountdown expirationDate={newExpiry} compact />
                <p className="font-mono text-[10px] text-muted-foreground mt-2">
                  {new Date(newExpiry).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <Button
                variant="outline"
                className="flex-1 font-mono text-xs"
                onClick={handleClose}
                disabled={extend.isPending}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 font-mono text-xs bg-accent text-accent-foreground hover:bg-accent/90 gap-1.5 disabled:opacity-60"
                onClick={handleExtend}
                disabled={
                  extend.isPending || !username.trim() || effectiveDays <= 0
                }
                data-ocid="grant-tier-btn"
              >
                <Zap className="w-3 h-3" />
                {extend.isPending ? "Granting…" : `Add ${effectiveDays}d ⚡`}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TIER_DISPLAY_NAMES: Record<number, string> = {
  1: "Free",
  2: "Pro",
  3: "Max",
};

function formatTimeRemaining(expirationDate: number): string {
  const now = Date.now();
  const diffMs = expirationDate - now;
  if (diffMs <= 0) return "Expired";
  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

// ─── Subscription Table ───────────────────────────────────────────────────────

type SortKey = "username" | "tier" | "expirationDate";
type SortDir = "asc" | "desc";

function SubscriptionTable({
  subs,
  userMap,
  onGrant,
}: {
  subs: UserTierSubscription[];
  /** Maps userId (Principal string) → username */
  userMap: Map<string, string>;
  onGrant: (username: string) => void;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("expirationDate");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const sorted = useMemo(() => {
    return [...subs].sort((a, b) => {
      let cmp = 0;
      const aName = userMap.get(a.userId) ?? a.userId;
      const bName = userMap.get(b.userId) ?? b.userId;
      if (sortKey === "tier") cmp = a.tier - b.tier;
      else if (sortKey === "expirationDate")
        cmp = a.expirationDate - b.expirationDate;
      else cmp = aName.localeCompare(bName);
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [subs, sortKey, sortDir, userMap]);

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ArrowUpDown className="w-3 h-3 opacity-30" />;
    return sortDir === "asc" ? (
      <ChevronUp className="w-3 h-3 text-primary" />
    ) : (
      <ChevronDown className="w-3 h-3 text-primary" />
    );
  }

  return (
    <div className="rounded-xl border border-primary/20 bg-card overflow-hidden">
      {/* Desktop Header */}
      <div className="hidden sm:grid grid-cols-[1fr_90px_1fr_80px_44px] gap-2 px-4 py-2 border-b border-border/50 bg-card/80">
        <button
          type="button"
          className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors text-left"
          onClick={() => toggleSort("username")}
          data-ocid="sort-user"
        >
          User <SortIcon col="username" />
        </button>
        <button
          type="button"
          className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => toggleSort("tier")}
          data-ocid="sort-tier"
        >
          Tier <SortIcon col="tier" />
        </button>
        <button
          type="button"
          className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => toggleSort("expirationDate")}
          data-ocid="sort-expiry"
        >
          Expires / Remaining <SortIcon col="expirationDate" />
        </button>
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Status
        </span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground text-right">
          ⚡
        </span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-border/40">
        {sorted.map((sub) => {
          const username = userMap.get(sub.userId);
          const displayName = username ? `@${username}` : sub.userId;
          const isExpired = sub.expirationDate <= Date.now();
          const timeRemaining = formatTimeRemaining(sub.expirationDate);
          const expiryLabel = new Date(sub.expirationDate).toLocaleDateString(
            "en-US",
            { month: "short", day: "numeric", year: "numeric" },
          );

          const tierBadge = (
            <Badge
              variant="outline"
              className={`font-mono text-[10px] uppercase shrink-0 w-fit ${TIER_COLORS[sub.tier] ?? "text-foreground border-border"}`}
            >
              {TIER_DISPLAY_NAMES[sub.tier] ??
                TIER_NAMES[sub.tier] ??
                `T${sub.tier}`}
            </Badge>
          );

          const statusBadge = (
            <Badge
              variant="outline"
              className={`font-mono text-[10px] w-fit ${
                isExpired
                  ? "text-destructive border-destructive/40 bg-destructive/5"
                  : "text-green-400 border-green-400/40 bg-green-400/5"
              }`}
            >
              {isExpired ? "Expired" : "Active"}
            </Badge>
          );

          const grantBtn = (
            <Button
              variant="ghost"
              size="sm"
              className="h-9 min-h-[44px] w-9 px-0 font-mono text-[10px] text-accent hover:text-accent hover:bg-accent/10"
              onClick={() => onGrant(username ?? "")}
              disabled={!username}
              data-ocid={`quick-upgrade-${username ?? sub.userId.slice(0, 8)}`}
              title={
                username
                  ? `Grant upgrade to @${username}`
                  : "Username not found"
              }
            >
              <Zap className="w-3 h-3" />
            </Button>
          );

          return (
            <div key={sub.userId} data-ocid="subscription-row">
              {/* Desktop row */}
              <div className="hidden sm:grid grid-cols-[1fr_90px_1fr_80px_44px] gap-2 items-center px-4 py-3 hover:bg-secondary/10 transition-colors">
                <div className="min-w-0">
                  <p
                    className="font-mono text-xs text-foreground truncate"
                    title={
                      username ? `${displayName} (${sub.userId})` : sub.userId
                    }
                  >
                    {displayName}
                  </p>
                </div>
                {tierBadge}
                <div className="min-w-0">
                  <p className="font-mono text-[10px] text-foreground/80 truncate">
                    {expiryLabel}
                  </p>
                  <p
                    className={`font-mono text-[10px] mt-0.5 ${isExpired ? "text-destructive" : "text-primary"}`}
                  >
                    {timeRemaining}
                  </p>
                </div>
                {statusBadge}
                <div className="flex justify-end">{grantBtn}</div>
              </div>

              {/* Mobile card */}
              <div className="sm:hidden px-4 py-3 hover:bg-secondary/10 transition-colors">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <p
                    className="font-mono text-xs text-foreground truncate flex-1"
                    title={
                      username ? `${displayName} (${sub.userId})` : sub.userId
                    }
                  >
                    {displayName}
                  </p>
                  {grantBtn}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {tierBadge}
                  {statusBadge}
                  <span
                    className={`font-mono text-[10px] ${isExpired ? "text-destructive" : "text-primary"}`}
                  >
                    {timeRemaining}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {expiryLabel}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Discount Code Form ───────────────────────────────────────────────────────

function CreateDiscountCodeForm() {
  const createCode = useAdminCreateDiscountCode();
  const [code, setCode] = useState("");
  const [discountValue, setDiscountValue] = useState("10");
  const [codeType, setCodeType] = useState<"percentage" | "fixedUSD">(
    "percentage",
  );
  const [maxUses, setMaxUses] = useState("100");
  const [tierRestriction, setTierRestriction] = useState<string>("0");
  const [expiryDays, setExpiryDays] = useState("90");

  async function handleCreate() {
    if (!code.trim()) return;
    const expirationDate = Date.now() + Number(expiryDays) * 86400 * 1000;
    const tierVal = Number(tierRestriction);
    const discountType =
      codeType === "percentage" ? { percentage: null } : { fixedUSD: null };
    await createCode.mutateAsync({
      code: code.toUpperCase().trim(),
      discountType,
      discountValue: Number(discountValue),
      expirationDate,
      maxUses: Number(maxUses),
      tierRestriction: tierVal > 0 ? tierVal : undefined,
    });
    toast.success(`Code ${code.toUpperCase()} created`, {
      description: `${codeType === "percentage" ? `${discountValue}% off` : `$${discountValue} off`} · ${maxUses} max uses`,
    });
    setCode("");
    setDiscountValue("10");
    setMaxUses("100");
    setTierRestriction("0");
    setExpiryDays("90");
  }

  return (
    <div className="rounded-xl border border-accent/30 bg-card/60 p-4 space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <Tag className="w-4 h-4 text-accent" />
        <p className="font-display text-xs font-bold tracking-widest uppercase text-accent">
          Create New Code
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Code */}
        <div>
          <Label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Code
          </Label>
          <Input
            placeholder="e.g. FLUX30"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="font-mono text-xs uppercase mt-1 tracking-widest"
            data-ocid="new-discount-code-input"
          />
        </div>

        {/* Discount type + value */}
        <div>
          <Label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Discount
          </Label>
          <div className="flex gap-1.5 mt-1">
            <div className="flex rounded-md border border-input overflow-hidden">
              <button
                type="button"
                onClick={() => setCodeType("percentage")}
                className={`font-mono text-xs px-3 py-1 transition-colors ${codeType === "percentage" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                data-ocid="code-type-percent"
              >
                %
              </button>
              <button
                type="button"
                onClick={() => setCodeType("fixedUSD")}
                className={`font-mono text-xs px-3 py-1 border-l border-input transition-colors ${codeType === "fixedUSD" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                data-ocid="code-type-fixed"
              >
                $
              </button>
            </div>
            <Input
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              type="number"
              min={0}
              className="font-mono text-xs flex-1"
              data-ocid="new-discount-value-input"
            />
          </div>
        </div>

        {/* Max uses */}
        <div>
          <Label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Max Uses
          </Label>
          <Input
            value={maxUses}
            onChange={(e) => setMaxUses(e.target.value)}
            type="number"
            min={1}
            className="font-mono text-xs mt-1"
            data-ocid="new-discount-max-uses"
          />
        </div>

        {/* Expiry */}
        <div>
          <Label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Expires in (days)
          </Label>
          <Input
            value={expiryDays}
            onChange={(e) => setExpiryDays(e.target.value)}
            type="number"
            min={1}
            className="font-mono text-xs mt-1"
            data-ocid="new-discount-expiry"
          />
        </div>
      </div>

      {/* Tier restriction */}
      <div>
        <Label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block">
          Tier Restriction (optional)
        </Label>
        <div className="flex gap-2">
          {[
            { label: "All Tiers", value: "0" },
            { label: "Tier 1", value: "1" },
            { label: "Tier 2", value: "2" },
            { label: "Tier 3", value: "3" },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setTierRestriction(opt.value)}
              className={`font-mono text-[10px] px-2.5 py-1 rounded border transition-all duration-150 ${
                tierRestriction === opt.value
                  ? "bg-primary/15 border-primary text-primary"
                  : "border-border/50 text-muted-foreground hover:border-border"
              }`}
              data-ocid={`tier-restrict-${opt.value}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <Button
        className="w-full font-mono text-xs uppercase bg-accent text-accent-foreground hover:bg-accent/90 gap-1.5 mt-1"
        onClick={handleCreate}
        disabled={createCode.isPending || !code.trim()}
        data-ocid="create-code-btn"
      >
        <Plus className="w-3.5 h-3.5" />
        {createCode.isPending ? "Creating…" : "Create Discount Code"}
      </Button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function AdminTiersPage() {
  const { data: tiers = [], isLoading: tiersLoading } = useGetTiers();
  const { data: subscriptions = [], isLoading: subsLoading } =
    useAdminListSubscriptions();
  const { data: discountCodes = [], isLoading: codesLoading } =
    useAdminListDiscountCodes();
  const { data: profiles = [] } = useAdminListProfiles();
  const deactivateCode = useAdminDeactivateDiscountCode();

  const [editingTier, setEditingTier] = useState<TierConfig | null>(null);
  const [extendOpen, setExtendOpen] = useState(false);
  const [grantPrefillUser, setGrantPrefillUser] = useState<
    string | undefined
  >();

  /** Map of userId (Principal string) → username, built from adminListProfiles */
  const userMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const p of profiles) {
      const id =
        typeof p.userId === "object" && "toString" in p.userId
          ? (p.userId as { toString(): string }).toString()
          : String(p.userId);
      map.set(id, p.username);
    }
    return map;
  }, [profiles]);

  function handleQuickGrant(username: string) {
    if (!username) return;
    setGrantPrefillUser(username);
    setExtendOpen(true);
  }

  const activeCount = subscriptions.filter(
    (s) => s.expirationDate > Date.now(),
  ).length;

  return (
    <AdminLayout title="Tier Management" subtitle="DeLorean Fuel Station">
      <div className="max-w-4xl space-y-10" data-ocid="admin-tiers-page">
        {/* ── Tier Configuration ───────────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-display text-xs font-bold tracking-widest uppercase text-foreground">
                Tier Configuration
              </p>
              <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
                Edit tier pricing, duration, and Stripe product IDs
              </p>
            </div>
            <Button
              size="sm"
              className="gap-1.5 font-mono text-[10px] tracking-widest uppercase bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={() => {
                setGrantPrefillUser(undefined);
                setExtendOpen(true);
              }}
              data-ocid="grant-upgrade-btn"
            >
              <Zap className="w-3.5 h-3.5" />
              Grant Upgrade
            </Button>
          </div>

          <div className="space-y-2">
            {tiersLoading
              ? [0, 1, 2].map((i) => (
                  <Skeleton key={i} className="h-14 rounded-lg" />
                ))
              : tiers.map((tier) => (
                  <TierConfigRow
                    key={tier.tierId}
                    tier={tier}
                    onEdit={setEditingTier}
                  />
                ))}
          </div>

          {/* BTTF promo */}
          <div className="mt-4 rounded-lg border border-accent/20 bg-accent/5 px-4 py-3 flex items-center gap-3">
            <span className="text-2xl shrink-0">🚗⚡</span>
            <div>
              <p className="font-display text-[10px] font-bold tracking-widest uppercase text-accent">
                DeLorean Fuel Levels
              </p>
              <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
                Free = 30% · Pro/Traveler = 60% · Max/Time Lord = 90% — fixed
                tier indicator, not a countdown
              </p>
            </div>
          </div>
        </section>

        {/* ── User Subscriptions ───────────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-display text-xs font-bold tracking-widest uppercase text-foreground">
                Active Subscriptions
              </p>
              <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
                {activeCount} active · {subscriptions.length - activeCount}{" "}
                expired
              </p>
            </div>
            <Badge
              variant="outline"
              className="font-mono text-[10px] text-primary border-primary/40"
            >
              {subscriptions.length} total
            </Badge>
          </div>

          {subsLoading ? (
            <div className="space-y-2">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-12 rounded-lg" />
              ))}
            </div>
          ) : subscriptions.length === 0 ? (
            <div
              className="rounded-xl border border-border/50 bg-card p-8 text-center"
              data-ocid="subscriptions-empty"
            >
              <p className="text-2xl mb-2">🕰️</p>
              <p className="font-display text-xs tracking-widest uppercase text-muted-foreground">
                No subscriptions yet
              </p>
              <p className="font-mono text-[10px] text-muted-foreground/60 mt-1">
                Users will appear here once they upgrade their tier
              </p>
            </div>
          ) : (
            <SubscriptionTable
              subs={subscriptions}
              userMap={userMap}
              onGrant={handleQuickGrant}
            />
          )}
        </section>

        {/* ── Discount Codes ───────────────────────────────────────────────── */}
        <section>
          <div className="mb-4">
            <p className="font-display text-xs font-bold tracking-widest uppercase text-foreground">
              Discount Codes
            </p>
            <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
              Create and manage promotional codes for tier upgrades
            </p>
          </div>

          <CreateDiscountCodeForm />

          {/* Code list */}
          <div className="mt-4 rounded-xl border border-border/50 bg-card overflow-hidden">
            {codesLoading ? (
              <div className="p-4 space-y-2">
                {[0, 1, 2].map((i) => (
                  <Skeleton key={i} className="h-10 rounded" />
                ))}
              </div>
            ) : discountCodes.length === 0 ? (
              <div className="p-6 text-center" data-ocid="codes-empty">
                <p className="font-mono text-xs text-muted-foreground">
                  No discount codes created
                </p>
              </div>
            ) : (
              <>
                {/* Desktop table header */}
                <div className="hidden sm:grid grid-cols-[1fr_60px_80px_80px_80px_40px] gap-2 px-4 py-2 border-b border-border/50 bg-card/80">
                  {["Code", "Type", "Value", "Uses", "Status", ""].map((h) => (
                    <span
                      key={h}
                      className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
                    >
                      {h}
                    </span>
                  ))}
                </div>
                <div className="divide-y divide-border/40">
                  {discountCodes.map((dc) => (
                    <div key={dc.id} data-ocid="discount-code-row">
                      {/* Desktop row */}
                      <div className="hidden sm:grid grid-cols-[1fr_60px_80px_80px_80px_40px] gap-2 items-center px-4 py-3 hover:bg-secondary/10 transition-colors">
                        <span className="font-mono text-xs font-bold text-accent tracking-widest uppercase truncate">
                          {dc.code}
                        </span>
                        <span className="font-mono text-[10px] text-muted-foreground uppercase">
                          {dc.discountType === "percentage" ? "%" : "$"}
                        </span>
                        <span className="font-mono text-xs text-foreground">
                          {dc.discountType === "percentage"
                            ? `${dc.discountValue}%`
                            : `$${dc.discountValue.toFixed(2)}`}
                        </span>
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {dc.usageCount}/{dc.maxUses}
                        </span>
                        <Badge
                          variant="outline"
                          className={`font-mono text-[10px] w-fit ${
                            dc.active
                              ? "text-green-400 border-green-400/40 bg-green-400/5"
                              : "text-muted-foreground border-border/40"
                          }`}
                        >
                          {dc.active ? "Active" : "Off"}
                        </Badge>
                        {dc.active ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => deactivateCode.mutate(dc.id)}
                            aria-label={`Deactivate ${dc.code}`}
                            data-ocid={`deactivate-code-${dc.id}`}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        ) : (
                          <div className="w-7 h-7" />
                        )}
                      </div>
                      {/* Mobile card */}
                      <div className="sm:hidden flex items-center justify-between gap-3 px-4 py-3 hover:bg-secondary/10 transition-colors">
                        <div className="flex-1 min-w-0">
                          <span className="font-mono text-xs font-bold text-accent tracking-widest uppercase">
                            {dc.code}
                          </span>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <Badge
                              variant="outline"
                              className={`font-mono text-[10px] w-fit ${
                                dc.active
                                  ? "text-green-400 border-green-400/40 bg-green-400/5"
                                  : "text-muted-foreground border-border/40"
                              }`}
                            >
                              {dc.active ? "Active" : "Off"}
                            </Badge>
                            <span className="font-mono text-[10px] text-foreground">
                              {dc.discountType === "percentage"
                                ? `${dc.discountValue}% off`
                                : `$${dc.discountValue.toFixed(2)} off`}
                            </span>
                            <span className="font-mono text-[10px] text-muted-foreground">
                              {dc.usageCount}/{dc.maxUses} uses
                            </span>
                          </div>
                        </div>
                        {dc.active ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-10 w-10 min-h-[44px] min-w-[44px] p-0 text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                            onClick={() => deactivateCode.mutate(dc.id)}
                            aria-label={`Deactivate ${dc.code}`}
                            data-ocid={`deactivate-code-mobile-${dc.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        ) : (
                          <div className="w-10 h-10" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </div>

      <EditTierDialog tier={editingTier} onClose={() => setEditingTier(null)} />
      <ExtendUserTierDialog
        open={extendOpen}
        prefillUserId={grantPrefillUser}
        onClose={() => {
          setExtendOpen(false);
          setGrantPrefillUser(undefined);
        }}
      />
    </AdminLayout>
  );
}
