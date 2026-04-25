import { r as reactExports, j as jsxRuntimeExports, B as Button, Z as Zap, S as Skeleton, q as Label, n as Input, a as ue } from "./index-BBOHKJcC.js";
import { T as TimeCircuitsCountdown } from "./TimeCircuitsCountdown-Cw8BCQ4c.js";
import { A as AdminLayout } from "./AdminLayout-BxO6e1tZ.js";
import { B as Badge } from "./badge-CVXfza97.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-CX1NPqXt.js";
import { a as useAdminListProfiles } from "./useAdminUsers-CSBIUr_8.js";
import { d as useAdminListDiscountCodes, e as useAdminDeactivateDiscountCode, f as useAdminCreateDiscountCode } from "./usePayments-DxtN_Wgo.js";
import { a as useGetTiers, b as useAdminListSubscriptions, c as useAdminUpsertTier, d as useAdminExtendUserTierByUsername } from "./useTiers-CkkhnXJk.js";
import { T as Trash2 } from "./trash-2-c2pd7eL2.js";
import { T as Tag } from "./tag-DxjOVoCV.js";
import { P as Plus } from "./plus-CwHsAhXa.js";
import { A as ArrowUpDown } from "./arrow-up-down-BFQ_cPyZ.js";
import { C as ChevronUp } from "./chevron-up-CTLrrQHi.js";
import { C as ChevronDown } from "./chevron-down-DEYevKHD.js";
import "./credit-card-BvziT4Ln.js";
import "./dollar-sign-CcGGxm9m.js";
import "./index-3awgtSe7.js";
import "./index-CVhydmUT.js";
import "./index-BY6nQEyL.js";
import "./index-CUFWdmmv.js";
import "./index-BIczvxJD.js";
const TIER_NAMES = {
  1: "START TRIAL",
  2: "PRO ADVENTURE",
  3: "MAX FLUX"
};
const TIER_COLORS = {
  1: "text-green-400 border-green-400/40 bg-green-400/10",
  2: "text-primary border-primary/40 bg-primary/10",
  3: "text-accent border-accent/40 bg-accent/10"
};
const DAY_PRESETS = [
  { label: "30d", value: 30 },
  { label: "90d", value: 90 },
  { label: "6mo", value: 180 }
];
function TierConfigRow({
  tier,
  onEdit
}) {
  const colorClass = TIER_COLORS[tier.tierId] ?? "text-foreground border-border bg-card/60";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-center gap-4 px-4 py-3 rounded-lg bg-card/60 border border-border/50 hover:border-primary/40 hover:bg-secondary/20 transition-all duration-200 group",
      "data-ocid": `tier-config-row-${tier.tierId}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `w-9 h-9 rounded-full flex items-center justify-center shrink-0 border-2 ${colorClass}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs font-bold", children: tier.tierId })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xs font-bold tracking-wider uppercase text-foreground", children: TIER_NAMES[tier.tierId] ?? tier.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[10px] text-muted-foreground mt-0.5", children: [
            tier.durationDays,
            " days ·",
            " ",
            tier.priceUSD === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-400", children: "Free" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-accent", children: [
              "$",
              tier.priceUSD.toFixed(2),
              "/period"
            ] })
          ] })
        ] }),
        tier.stripeProductId && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-primary/50 truncate max-w-[110px] hidden md:block border border-primary/20 rounded px-1.5 py-0.5 bg-primary/5", children: tier.stripeProductId }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            size: "sm",
            className: "font-mono text-[10px] tracking-widest uppercase shrink-0 opacity-60 group-hover:opacity-100 transition-opacity",
            onClick: () => onEdit(tier),
            "data-ocid": `edit-tier-btn-${tier.tierId}`,
            children: "Edit"
          }
        )
      ]
    }
  );
}
function EditTierDialog({ tier, onClose }) {
  const upsert = useAdminUpsertTier();
  const [name, setName] = reactExports.useState((tier == null ? void 0 : tier.name) ?? "");
  const [days, setDays] = reactExports.useState(String((tier == null ? void 0 : tier.durationDays) ?? 30));
  const [price, setPrice] = reactExports.useState(String((tier == null ? void 0 : tier.priceUSD) ?? 0));
  const [stripeId, setStripeId] = reactExports.useState((tier == null ? void 0 : tier.stripeProductId) ?? "");
  async function handleSave() {
    if (!tier) return;
    await upsert.mutateAsync({
      tierId: tier.tierId,
      name,
      durationDays: Number(days),
      priceUSD: Number(price),
      stripeProductId: stripeId || void 0
    });
    ue.success(`Tier ${tier.tierId} saved`, {
      description: `${name} · ${days} days · $${Number(price).toFixed(2)}`
    });
    onClose();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!tier, onOpenChange: () => onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "bg-card border border-primary/30 max-w-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display text-sm tracking-widest uppercase text-primary", children: [
      "⚙ Edit Tier ",
      tier == null ? void 0 : tier.tierId,
      " — ",
      TIER_NAMES[(tier == null ? void 0 : tier.tierId) ?? 1]
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 mt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground", children: "Internal Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: name,
            onChange: (e) => setName(e.target.value),
            className: "font-mono text-xs mt-1",
            "data-ocid": "edit-tier-name"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground", children: "Duration (days)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: days,
              onChange: (e) => setDays(e.target.value),
              type: "number",
              min: 1,
              className: "font-mono text-xs mt-1",
              "data-ocid": "edit-tier-days"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground", children: "Price (USD)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: price,
              onChange: (e) => setPrice(e.target.value),
              type: "number",
              step: "0.01",
              min: 0,
              className: "font-mono text-xs mt-1",
              "data-ocid": "edit-tier-price"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground", children: "Stripe Product ID (optional)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: stripeId,
            onChange: (e) => setStripeId(e.target.value),
            className: "font-mono text-xs mt-1",
            placeholder: "prod_…",
            "data-ocid": "edit-tier-stripe-id"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            className: "flex-1 font-mono text-xs",
            onClick: onClose,
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            className: "flex-1 font-mono text-xs bg-primary text-primary-foreground hover:bg-primary/90",
            onClick: handleSave,
            disabled: upsert.isPending,
            "data-ocid": "save-tier-btn",
            children: upsert.isPending ? "Saving…" : "Save Tier"
          }
        )
      ] })
    ] })
  ] }) });
}
function ExtendUserTierDialog({
  open,
  prefillUserId,
  onClose
}) {
  const extend = useAdminExtendUserTierByUsername();
  const { data: tiers = [] } = useGetTiers();
  const [username, setUsername] = reactExports.useState(prefillUserId ?? "");
  const [tierLevel, setTierLevel] = reactExports.useState(2);
  const [days, setDays] = reactExports.useState(30);
  const [customDays, setCustomDays] = reactExports.useState("");
  const [useCustom, setUseCustom] = reactExports.useState(false);
  const [confirmed, setConfirmed] = reactExports.useState(false);
  const [grantError, setGrantError] = reactExports.useState(null);
  const effectiveDays = useCustom ? Number(customDays) || 0 : days;
  const newExpiry = Date.now() + effectiveDays * 86400 * 1e3;
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
        extraDays: effectiveDays
      });
      ue.success(`⚡ Subscription granted to @${username}`, {
        description: `${TIER_NAMES[tierLevel]} · ${effectiveDays} days added · new expiry ${new Date(newExpiry).toLocaleDateString()}`
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
      const message = err instanceof Error ? err.message : "Failed to grant subscription.";
      setGrantError(message);
      ue.error("Grant failed", { description: message });
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: handleClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "bg-card border border-accent/40 max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl", children: "🚗" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-sm tracking-widest uppercase text-accent", children: "Fuel the DeLorean" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-muted-foreground tracking-wide mt-1", children: "Grant a tier upgrade by username — adds time on top of current expiration" })
    ] }),
    confirmed ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-6 flex flex-col items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-4xl animate-bounce", children: "⚡" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-sm font-bold tracking-widest uppercase text-accent text-center", children: "88 MPH REACHED!" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xs text-muted-foreground text-center", children: [
        effectiveDays,
        " days added to @",
        username,
        "'s timeline"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TimeCircuitsCountdown, { expirationDate: newExpiry, compact: true })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 mt-1", children: [
      grantError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded-md bg-destructive/10 border border-destructive/30 px-3 py-2 flex items-start gap-2",
          role: "alert",
          "data-ocid": "grant-error",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive text-sm shrink-0", children: "⚠" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-destructive text-xs", children: grantError })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground", children: "Username" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: username,
            onChange: (e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, "")),
            className: "font-mono text-xs mt-1",
            placeholder: "e.g. johndoe",
            "data-ocid": "extend-user-id"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-muted-foreground/60 mt-1", children: "Enter the user's username (not their principal ID)" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block", children: "Select Tier" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: [1, 2, 3].map((t) => {
          var _a;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setTierLevel(t),
              className: `rounded-lg border px-3 py-2 text-left transition-all duration-150 ${tierLevel === t ? "border-accent bg-accent/10 ring-1 ring-accent/50" : "border-border/50 hover:border-border"}`,
              "data-ocid": `tier-select-${t}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "p",
                  {
                    className: `font-mono text-[10px] font-bold uppercase tracking-widest ${tierLevel === t ? "text-accent" : "text-muted-foreground"}`,
                    children: [
                      "Tier ",
                      t
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-[9px] uppercase tracking-wide text-foreground/60 truncate mt-0.5", children: TIER_NAMES[t] }),
                tiers.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[9px] text-primary/60 mt-0.5", children: selectedTier && t === tierLevel ? `${selectedTier.durationDays}d base` : `${((_a = tiers.find((x) => x.tierId === t)) == null ? void 0 : _a.durationDays) ?? "?"}d` })
              ]
            },
            t
          );
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block", children: "Days to Add" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 flex-wrap", children: [
          DAY_PRESETS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                setDays(p.value);
                setUseCustom(false);
              },
              className: `font-mono text-xs px-3 py-1.5 rounded border transition-all duration-150 ${!useCustom && days === p.value ? "bg-primary/15 border-primary text-primary" : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground"}`,
              "data-ocid": `day-preset-${p.value}`,
              children: p.label
            },
            p.value
          )),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setUseCustom(true),
              className: `font-mono text-xs px-3 py-1.5 rounded border transition-all duration-150 ${useCustom ? "bg-primary/15 border-primary text-primary" : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground"}`,
              "data-ocid": "day-preset-custom",
              children: "Custom"
            }
          )
        ] }),
        useCustom && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: customDays,
            onChange: (e) => setCustomDays(e.target.value),
            type: "number",
            min: 1,
            placeholder: "Enter days…",
            className: "font-mono text-xs mt-2 w-32",
            "data-ocid": "extend-days-custom",
            autoFocus: true
          }
        )
      ] }),
      username.trim() && effectiveDays > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-accent/30 bg-accent/5 p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[10px] uppercase tracking-widest text-accent/70 mb-2", children: [
          "Preview · New Expiration for @",
          username
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TimeCircuitsCountdown, { expirationDate: newExpiry, compact: true }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-muted-foreground mt-2", children: new Date(newExpiry).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            className: "flex-1 font-mono text-xs",
            onClick: handleClose,
            disabled: extend.isPending,
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            className: "flex-1 font-mono text-xs bg-accent text-accent-foreground hover:bg-accent/90 gap-1.5 disabled:opacity-60",
            onClick: handleExtend,
            disabled: extend.isPending || !username.trim() || effectiveDays <= 0,
            "data-ocid": "grant-tier-btn",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3 h-3" }),
              extend.isPending ? "Granting…" : `Add ${effectiveDays}d ⚡`
            ]
          }
        )
      ] })
    ] })
  ] }) });
}
const TIER_DISPLAY_NAMES = {
  1: "Free",
  2: "Pro",
  3: "Max"
};
function formatTimeRemaining(expirationDate) {
  const now = Date.now();
  const diffMs = expirationDate - now;
  if (diffMs <= 0) return "Expired";
  const totalSeconds = Math.floor(diffMs / 1e3);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor(totalSeconds % 86400 / 3600);
  const minutes = Math.floor(totalSeconds % 3600 / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}
function SubscriptionTable({
  subs,
  userMap,
  onGrant
}) {
  const [sortKey, setSortKey] = reactExports.useState("expirationDate");
  const [sortDir, setSortDir] = reactExports.useState("asc");
  function toggleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => d === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }
  const sorted = reactExports.useMemo(() => {
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
  function SortIcon({ col }) {
    if (sortKey !== col) return /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpDown, { className: "w-3 h-3 opacity-30" });
    return sortDir === "asc" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "w-3 h-3 text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-3 h-3 text-primary" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-primary/20 bg-card overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden sm:grid grid-cols-[1fr_90px_1fr_80px_44px] gap-2 px-4 py-2 border-b border-border/50 bg-card/80", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          className: "flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors text-left",
          onClick: () => toggleSort("username"),
          "data-ocid": "sort-user",
          children: [
            "User ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(SortIcon, { col: "username" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          className: "flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors",
          onClick: () => toggleSort("tier"),
          "data-ocid": "sort-tier",
          children: [
            "Tier ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(SortIcon, { col: "tier" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          className: "flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors",
          onClick: () => toggleSort("expirationDate"),
          "data-ocid": "sort-expiry",
          children: [
            "Expires / Remaining ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(SortIcon, { col: "expirationDate" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground", children: "Status" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground text-right", children: "⚡" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border/40", children: sorted.map((sub) => {
      const username = userMap.get(sub.userId);
      const displayName = username ? `@${username}` : sub.userId;
      const isExpired = sub.expirationDate <= Date.now();
      const timeRemaining = formatTimeRemaining(sub.expirationDate);
      const expiryLabel = new Date(sub.expirationDate).toLocaleDateString(
        "en-US",
        { month: "short", day: "numeric", year: "numeric" }
      );
      const tierBadge = /* @__PURE__ */ jsxRuntimeExports.jsx(
        Badge,
        {
          variant: "outline",
          className: `font-mono text-[10px] uppercase shrink-0 w-fit ${TIER_COLORS[sub.tier] ?? "text-foreground border-border"}`,
          children: TIER_DISPLAY_NAMES[sub.tier] ?? TIER_NAMES[sub.tier] ?? `T${sub.tier}`
        }
      );
      const statusBadge = /* @__PURE__ */ jsxRuntimeExports.jsx(
        Badge,
        {
          variant: "outline",
          className: `font-mono text-[10px] w-fit ${isExpired ? "text-destructive border-destructive/40 bg-destructive/5" : "text-green-400 border-green-400/40 bg-green-400/5"}`,
          children: isExpired ? "Expired" : "Active"
        }
      );
      const grantBtn = /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "sm",
          className: "h-9 min-h-[44px] w-9 px-0 font-mono text-[10px] text-accent hover:text-accent hover:bg-accent/10",
          onClick: () => onGrant(username ?? ""),
          disabled: !username,
          "data-ocid": `quick-upgrade-${username ?? sub.userId.slice(0, 8)}`,
          title: username ? `Grant upgrade to @${username}` : "Username not found",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3 h-3" })
        }
      );
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "subscription-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden sm:grid grid-cols-[1fr_90px_1fr_80px_44px] gap-2 items-center px-4 py-3 hover:bg-secondary/10 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "font-mono text-xs text-foreground truncate",
              title: username ? `${displayName} (${sub.userId})` : sub.userId,
              children: displayName
            }
          ) }),
          tierBadge,
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-foreground/80 truncate", children: expiryLabel }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: `font-mono text-[10px] mt-0.5 ${isExpired ? "text-destructive" : "text-primary"}`,
                children: timeRemaining
              }
            )
          ] }),
          statusBadge,
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: grantBtn })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:hidden px-4 py-3 hover:bg-secondary/10 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "font-mono text-xs text-foreground truncate flex-1",
                title: username ? `${displayName} (${sub.userId})` : sub.userId,
                children: displayName
              }
            ),
            grantBtn
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
            tierBadge,
            statusBadge,
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `font-mono text-[10px] ${isExpired ? "text-destructive" : "text-primary"}`,
                children: timeRemaining
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-muted-foreground", children: expiryLabel })
          ] })
        ] })
      ] }, sub.userId);
    }) })
  ] });
}
function CreateDiscountCodeForm() {
  const createCode = useAdminCreateDiscountCode();
  const [code, setCode] = reactExports.useState("");
  const [discountValue, setDiscountValue] = reactExports.useState("10");
  const [codeType, setCodeType] = reactExports.useState(
    "percentage"
  );
  const [maxUses, setMaxUses] = reactExports.useState("100");
  const [tierRestriction, setTierRestriction] = reactExports.useState("0");
  const [expiryDays, setExpiryDays] = reactExports.useState("90");
  async function handleCreate() {
    if (!code.trim()) return;
    const expirationDate = Date.now() + Number(expiryDays) * 86400 * 1e3;
    const tierVal = Number(tierRestriction);
    const discountType = codeType === "percentage" ? { percentage: null } : { fixedUSD: null };
    await createCode.mutateAsync({
      code: code.toUpperCase().trim(),
      discountType,
      discountValue: Number(discountValue),
      expirationDate,
      maxUses: Number(maxUses),
      tierRestriction: tierVal > 0 ? tierVal : void 0
    });
    ue.success(`Code ${code.toUpperCase()} created`, {
      description: `${codeType === "percentage" ? `${discountValue}% off` : `$${discountValue} off`} · ${maxUses} max uses`
    });
    setCode("");
    setDiscountValue("10");
    setMaxUses("100");
    setTierRestriction("0");
    setExpiryDays("90");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-accent/30 bg-card/60 p-4 space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "w-4 h-4 text-accent" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xs font-bold tracking-widest uppercase text-accent", children: "Create New Code" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground", children: "Code" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "e.g. FLUX30",
            value: code,
            onChange: (e) => setCode(e.target.value.toUpperCase()),
            className: "font-mono text-xs uppercase mt-1 tracking-widest",
            "data-ocid": "new-discount-code-input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground", children: "Discount" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5 mt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex rounded-md border border-input overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setCodeType("percentage"),
                className: `font-mono text-xs px-3 py-1 transition-colors ${codeType === "percentage" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`,
                "data-ocid": "code-type-percent",
                children: "%"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setCodeType("fixedUSD"),
                className: `font-mono text-xs px-3 py-1 border-l border-input transition-colors ${codeType === "fixedUSD" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`,
                "data-ocid": "code-type-fixed",
                children: "$"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: discountValue,
              onChange: (e) => setDiscountValue(e.target.value),
              type: "number",
              min: 0,
              className: "font-mono text-xs flex-1",
              "data-ocid": "new-discount-value-input"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground", children: "Max Uses" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: maxUses,
            onChange: (e) => setMaxUses(e.target.value),
            type: "number",
            min: 1,
            className: "font-mono text-xs mt-1",
            "data-ocid": "new-discount-max-uses"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground", children: "Expires in (days)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: expiryDays,
            onChange: (e) => setExpiryDays(e.target.value),
            type: "number",
            min: 1,
            className: "font-mono text-xs mt-1",
            "data-ocid": "new-discount-expiry"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block", children: "Tier Restriction (optional)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: [
        { label: "All Tiers", value: "0" },
        { label: "Tier 1", value: "1" },
        { label: "Tier 2", value: "2" },
        { label: "Tier 3", value: "3" }
      ].map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => setTierRestriction(opt.value),
          className: `font-mono text-[10px] px-2.5 py-1 rounded border transition-all duration-150 ${tierRestriction === opt.value ? "bg-primary/15 border-primary text-primary" : "border-border/50 text-muted-foreground hover:border-border"}`,
          "data-ocid": `tier-restrict-${opt.value}`,
          children: opt.label
        },
        opt.value
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        className: "w-full font-mono text-xs uppercase bg-accent text-accent-foreground hover:bg-accent/90 gap-1.5 mt-1",
        onClick: handleCreate,
        disabled: createCode.isPending || !code.trim(),
        "data-ocid": "create-code-btn",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" }),
          createCode.isPending ? "Creating…" : "Create Discount Code"
        ]
      }
    )
  ] });
}
function AdminTiersPage() {
  const { data: tiers = [], isLoading: tiersLoading } = useGetTiers();
  const { data: subscriptions = [], isLoading: subsLoading } = useAdminListSubscriptions();
  const { data: discountCodes = [], isLoading: codesLoading } = useAdminListDiscountCodes();
  const { data: profiles = [] } = useAdminListProfiles();
  const deactivateCode = useAdminDeactivateDiscountCode();
  const [editingTier, setEditingTier] = reactExports.useState(null);
  const [extendOpen, setExtendOpen] = reactExports.useState(false);
  const [grantPrefillUser, setGrantPrefillUser] = reactExports.useState();
  const userMap = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const p of profiles) {
      const id = typeof p.userId === "object" && "toString" in p.userId ? p.userId.toString() : String(p.userId);
      map.set(id, p.username);
    }
    return map;
  }, [profiles]);
  function handleQuickGrant(username) {
    if (!username) return;
    setGrantPrefillUser(username);
    setExtendOpen(true);
  }
  const activeCount = subscriptions.filter(
    (s) => s.expirationDate > Date.now()
  ).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminLayout, { title: "Tier Management", subtitle: "DeLorean Fuel Station", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl space-y-10", "data-ocid": "admin-tiers-page", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xs font-bold tracking-widest uppercase text-foreground", children: "Tier Configuration" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-muted-foreground mt-0.5", children: "Edit tier pricing, duration, and Stripe product IDs" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              className: "gap-1.5 font-mono text-[10px] tracking-widest uppercase bg-accent text-accent-foreground hover:bg-accent/90",
              onClick: () => {
                setGrantPrefillUser(void 0);
                setExtendOpen(true);
              },
              "data-ocid": "grant-upgrade-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3.5 h-3.5" }),
                "Grant Upgrade"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: tiersLoading ? [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 rounded-lg" }, i)) : tiers.map((tier) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          TierConfigRow,
          {
            tier,
            onEdit: setEditingTier
          },
          tier.tierId
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 rounded-lg border border-accent/20 bg-accent/5 px-4 py-3 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl shrink-0", children: "🚗⚡" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-[10px] font-bold tracking-widest uppercase text-accent", children: "DeLorean Fuel Levels" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-muted-foreground mt-0.5", children: "Free = 30% · Pro/Traveler = 60% · Max/Time Lord = 90% — fixed tier indicator, not a countdown" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xs font-bold tracking-widest uppercase text-foreground", children: "Active Subscriptions" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[10px] text-muted-foreground mt-0.5", children: [
              activeCount,
              " active · ",
              subscriptions.length - activeCount,
              " ",
              "expired"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Badge,
            {
              variant: "outline",
              className: "font-mono text-[10px] text-primary border-primary/40",
              children: [
                subscriptions.length,
                " total"
              ]
            }
          )
        ] }),
        subsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 rounded-lg" }, i)) }) : subscriptions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-xl border border-border/50 bg-card p-8 text-center",
            "data-ocid": "subscriptions-empty",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl mb-2", children: "🕰️" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xs tracking-widest uppercase text-muted-foreground", children: "No subscriptions yet" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-muted-foreground/60 mt-1", children: "Users will appear here once they upgrade their tier" })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          SubscriptionTable,
          {
            subs: subscriptions,
            userMap,
            onGrant: handleQuickGrant
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xs font-bold tracking-widest uppercase text-foreground", children: "Discount Codes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] text-muted-foreground mt-0.5", children: "Create and manage promotional codes for tier upgrades" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CreateDiscountCodeForm, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 rounded-xl border border-border/50 bg-card overflow-hidden", children: codesLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 space-y-2", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 rounded" }, i)) }) : discountCodes.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 text-center", "data-ocid": "codes-empty", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground", children: "No discount codes created" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden sm:grid grid-cols-[1fr_60px_80px_80px_80px_40px] gap-2 px-4 py-2 border-b border-border/50 bg-card/80", children: ["Code", "Type", "Value", "Uses", "Status", ""].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground",
              children: h
            },
            h
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border/40", children: discountCodes.map((dc) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "discount-code-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden sm:grid grid-cols-[1fr_60px_80px_80px_80px_40px] gap-2 items-center px-4 py-3 hover:bg-secondary/10 transition-colors", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs font-bold text-accent tracking-widest uppercase truncate", children: dc.code }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-muted-foreground uppercase", children: dc.discountType === "percentage" ? "%" : "$" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-foreground", children: dc.discountType === "percentage" ? `${dc.discountValue}%` : `$${dc.discountValue.toFixed(2)}` }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[10px] text-muted-foreground", children: [
                dc.usageCount,
                "/",
                dc.maxUses
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: `font-mono text-[10px] w-fit ${dc.active ? "text-green-400 border-green-400/40 bg-green-400/5" : "text-muted-foreground border-border/40"}`,
                  children: dc.active ? "Active" : "Off"
                }
              ),
              dc.active ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "sm",
                  className: "h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10",
                  onClick: () => deactivateCode.mutate(dc.id),
                  "aria-label": `Deactivate ${dc.code}`,
                  "data-ocid": `deactivate-code-${dc.id}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3 h-3" })
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:hidden flex items-center justify-between gap-3 px-4 py-3 hover:bg-secondary/10 transition-colors", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs font-bold text-accent tracking-widest uppercase", children: dc.code }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1 flex-wrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      variant: "outline",
                      className: `font-mono text-[10px] w-fit ${dc.active ? "text-green-400 border-green-400/40 bg-green-400/5" : "text-muted-foreground border-border/40"}`,
                      children: dc.active ? "Active" : "Off"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-foreground", children: dc.discountType === "percentage" ? `${dc.discountValue}% off` : `$${dc.discountValue.toFixed(2)} off` }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[10px] text-muted-foreground", children: [
                    dc.usageCount,
                    "/",
                    dc.maxUses,
                    " uses"
                  ] })
                ] })
              ] }),
              dc.active ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "sm",
                  className: "h-10 w-10 min-h-[44px] min-w-[44px] p-0 text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0",
                  onClick: () => deactivateCode.mutate(dc.id),
                  "aria-label": `Deactivate ${dc.code}`,
                  "data-ocid": `deactivate-code-mobile-${dc.id}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" })
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10" })
            ] })
          ] }, dc.id)) })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(EditTierDialog, { tier: editingTier, onClose: () => setEditingTier(null) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ExtendUserTierDialog,
      {
        open: extendOpen,
        prefillUserId: grantPrefillUser,
        onClose: () => {
          setExtendOpen(false);
          setGrantPrefillUser(void 0);
        }
      }
    )
  ] });
}
export {
  AdminTiersPage
};
