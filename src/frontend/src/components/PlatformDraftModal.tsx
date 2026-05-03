import { useDevice } from "@/hooks/useDevice";
import { useLogManualPosting } from "@/hooks/useLogManualPosting";
import {
  type DepopDraftFields,
  type EbayDraftFields,
  type EtsyDraftFields,
  type FacebookDraftFields,
  type MecariDraftFields,
  type PoshmarkDraftFields,
  useSavePlatformDraft,
} from "@/hooks/useSavePlatformDraft";
import {
  AlertTriangle,
  CheckCircle2,
  Copy,
  ExternalLink,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

type PlatformId =
  | "facebook"
  | "mercari"
  | "ebay"
  | "poshmark"
  | "depop"
  | "etsy";

interface MasterListingPrefill {
  title: string;
  description: string;
  price?: string | null;
  category?: string | null;
  tags?: string[];
}

interface ExistingDraft {
  platformFields: Record<string, unknown>;
  status: string;
  completenessPercent: number;
  isValid: boolean;
}

export interface PlatformDraftModalProps {
  isOpen: boolean;
  onClose: () => void;
  listingId: string;
  platform: PlatformId;
  masterListing?: MasterListingPrefill;
  existingDraft?: ExistingDraft | null;
}

// ─── Platform metadata ────────────────────────────────────────────────────────

const PLATFORM_META: Record<
  PlatformId,
  {
    label: string;
    icon: string;
    headerColor: string;
    borderColor: string;
    bgColor: string;
  }
> = {
  facebook: {
    label: "Facebook Marketplace",
    icon: "📘",
    headerColor: "#1877F2",
    borderColor: "border-blue-500/50",
    bgColor: "bg-blue-950/40",
  },
  mercari: {
    label: "Mercari",
    icon: "🏯",
    headerColor: "#d62f7d",
    borderColor: "border-pink-500/50",
    bgColor: "bg-pink-950/40",
  },
  ebay: {
    label: "eBay",
    icon: "🔨",
    headerColor: "#e53238",
    borderColor: "border-red-500/50",
    bgColor: "bg-red-950/40",
  },
  poshmark: {
    label: "Poshmark",
    icon: "👜",
    headerColor: "#BF0626",
    borderColor: "border-rose-500/50",
    bgColor: "bg-rose-950/40",
  },
  depop: {
    label: "Depop",
    icon: "🎨",
    headerColor: "#FF4040",
    borderColor: "border-orange-500/50",
    bgColor: "bg-orange-950/40",
  },
  etsy: {
    label: "Etsy",
    icon: "🛍",
    headerColor: "#F16521",
    borderColor: "border-amber-500/50",
    bgColor: "bg-amber-950/40",
  },
};

// ─── Shared field input components ───────────────────────────────────────────

interface FieldInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  max: number;
  required?: boolean;
  warnAt?: number;
  "data-ocid"?: string;
}

function CharCountInput({
  id,
  label,
  value,
  onChange,
  max,
  required,
  warnAt,
  "data-ocid": ocid,
}: FieldInputProps) {
  const len = value.length;
  const isOver = len > max;
  const isWarning = warnAt !== undefined && len > warnAt && !isOver;
  const counterClass = isOver
    ? "text-destructive font-bold"
    : isWarning
      ? "text-accent"
      : "text-muted-foreground";
  return (
    <div>
      <label
        htmlFor={id}
        className="text-xs font-semibold text-muted-foreground mb-1.5 flex items-center justify-between"
      >
        <span>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </span>
        <span className={`text-xs tabular-nums ${counterClass}`}>
          {len}/{max}
        </span>
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 bg-secondary/40 rounded text-foreground text-sm focus:outline-none transition-smooth border ${isOver ? "border-destructive/70 focus:border-destructive" : "border-border/50 focus:border-primary/60"}`}
        data-ocid={ocid}
      />
      {isOver && (
        <p className="text-xs text-destructive mt-1">
          Exceeds {max} character limit
        </p>
      )}
    </div>
  );
}

interface TextareaFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  max: number;
  rows?: number;
  "data-ocid"?: string;
}

function CharCountTextarea({
  id,
  label,
  value,
  onChange,
  max,
  rows = 4,
  "data-ocid": ocid,
}: TextareaFieldProps) {
  const len = value.length;
  const isOver = len > max;
  const counterClass = isOver
    ? "text-destructive font-bold"
    : "text-muted-foreground";
  return (
    <div>
      <label
        htmlFor={id}
        className="text-xs font-semibold text-muted-foreground mb-1.5 flex items-center justify-between"
      >
        <span>{label}</span>
        <span className={`text-xs tabular-nums ${counterClass}`}>
          {len}/{max}
        </span>
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className={`w-full px-3 py-2 bg-secondary/40 rounded text-foreground text-sm focus:outline-none transition-smooth resize-none border ${isOver ? "border-destructive/70 focus:border-destructive" : "border-border/50 focus:border-primary/60"}`}
        data-ocid={ocid}
      />
      {isOver && (
        <p className="text-xs text-destructive mt-1">
          Exceeds {max} character limit
        </p>
      )}
    </div>
  );
}

function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  helpText,
  required,
  "data-ocid": ocid,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  helpText?: string;
  required?: boolean;
  "data-ocid"?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="text-xs font-semibold text-muted-foreground mb-1.5 block"
      >
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-secondary/40 border border-border/50 rounded text-foreground text-sm focus:border-primary/60 focus:outline-none transition-smooth"
        data-ocid={ocid}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {helpText && (
        <p className="text-xs text-muted-foreground mt-1">{helpText}</p>
      )}
    </div>
  );
}

function Toggle({
  id,
  label,
  checked,
  onChange,
  "data-ocid": ocid,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  "data-ocid"?: string;
}) {
  return (
    <label
      htmlFor={id}
      className="flex items-center gap-3 cursor-pointer select-none"
    >
      <div className="relative">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
          data-ocid={ocid}
        />
        <div
          className={`w-10 h-5 rounded-full transition-smooth ${checked ? "bg-primary" : "bg-secondary"}`}
        />
        <div
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-foreground transition-smooth ${checked ? "translate-x-5" : "translate-x-0"}`}
        />
      </div>
      <span className="text-sm text-foreground">{label}</span>
    </label>
  );
}

// ─── Platform form sections ───────────────────────────────────────────────────

const FB_CONDITIONS = [
  { value: "new_", label: "New" },
  { value: "likeNew", label: "Like New" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "poor", label: "Poor" },
];
const MECARI_CONDITIONS = [
  { value: "new_", label: "1 — New" },
  { value: "likeNew", label: "2 — Like New" },
  { value: "good", label: "3 — Good" },
  { value: "fair", label: "4 — Fair" },
  { value: "poor", label: "5 — Poor" },
];
const SHIPPING_TYPES = [
  { value: "normal", label: "Normal Shipping" },
  { value: "fast", label: "Fast Shipping" },
  { value: "sameDay", label: "Same Day" },
];

function FacebookForm({
  fields,
  onChange,
}: {
  fields: FacebookDraftFields;
  onChange: (f: Partial<FacebookDraftFields>) => void;
}) {
  return (
    <div className="space-y-4">
      <CharCountInput
        id="fb-title"
        label="Title"
        value={fields.title}
        onChange={(v) => onChange({ title: v })}
        max={200}
        required
        data-ocid="platform-draft.fb-title.input"
      />
      <CharCountTextarea
        id="fb-desc"
        label="Description"
        value={fields.description}
        onChange={(v) => onChange({ description: v })}
        max={5000}
        data-ocid="platform-draft.fb-description.textarea"
      />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="fb-price"
            className="text-xs font-semibold text-muted-foreground mb-1.5 block"
          >
            Price
          </label>
          <input
            id="fb-price"
            type="text"
            value={fields.price ?? ""}
            onChange={(e) => onChange({ price: e.target.value || undefined })}
            placeholder="$0.00"
            className="w-full px-3 py-2 bg-secondary/40 border border-border/50 rounded text-sm text-foreground focus:border-primary/60 focus:outline-none transition-smooth"
            data-ocid="platform-draft.fb-price.input"
          />
        </div>
        <SelectField
          id="fb-condition"
          label="Condition"
          value={fields.condition ?? "good"}
          onChange={(v) =>
            onChange({ condition: v as FacebookDraftFields["condition"] })
          }
          options={FB_CONDITIONS}
          data-ocid="platform-draft.fb-condition.select"
        />
      </div>
      <div className="space-y-3 pt-1">
        <Toggle
          id="fb-local-pickup"
          label="Local Pickup"
          checked={fields.localPickup}
          onChange={(v) => onChange({ localPickup: v })}
          data-ocid="platform-draft.fb-local-pickup.toggle"
        />
        <Toggle
          id="fb-shipping"
          label="Shipping Available"
          checked={fields.shipping}
          onChange={(v) => onChange({ shipping: v })}
          data-ocid="platform-draft.fb-shipping.toggle"
        />
      </div>
    </div>
  );
}

function MercariForm({
  fields,
  onChange,
  masterTitle,
}: {
  fields: MecariDraftFields;
  onChange: (f: Partial<MecariDraftFields>) => void;
  masterTitle: string;
}) {
  const isTitleTruncated =
    masterTitle.length > 80 && fields.title === masterTitle.slice(0, 80);
  return (
    <div className="space-y-4">
      <div>
        <CharCountInput
          id="mc-title"
          label="Title"
          value={fields.title}
          onChange={(v) => onChange({ title: v })}
          max={80}
          required
          data-ocid="platform-draft.mc-title.input"
        />
        {isTitleTruncated && (
          <div className="flex items-center gap-1.5 mt-1.5 px-2 py-1 bg-accent/10 border border-accent/30 rounded text-xs text-accent">
            <AlertTriangle className="h-3 w-3 shrink-0" />
            Title truncated to 80 characters for Mercari
          </div>
        )}
      </div>
      <CharCountTextarea
        id="mc-desc"
        label="Description"
        value={fields.description}
        onChange={(v) => onChange({ description: v })}
        max={1000}
        data-ocid="platform-draft.mc-description.textarea"
      />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="mc-price"
            className="text-xs font-semibold text-muted-foreground mb-1.5 block"
          >
            Price
          </label>
          <input
            id="mc-price"
            type="text"
            value={fields.price ?? ""}
            onChange={(e) => onChange({ price: e.target.value || undefined })}
            placeholder="$0.00"
            className="w-full px-3 py-2 bg-secondary/40 border border-border/50 rounded text-sm text-foreground focus:border-primary/60 focus:outline-none transition-smooth"
            data-ocid="platform-draft.mc-price.input"
          />
        </div>
        <div>
          <label
            htmlFor="mc-brand"
            className="text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1 block"
          >
            Brand<span className="text-destructive">*</span>
          </label>
          <input
            id="mc-brand"
            type="text"
            value={fields.brand}
            onChange={(e) => onChange({ brand: e.target.value })}
            placeholder="e.g. Nike, Apple…"
            className={`w-full px-3 py-2 bg-secondary/40 rounded text-sm text-foreground focus:outline-none transition-smooth border ${!fields.brand ? "border-destructive/50" : "border-border/50 focus:border-primary/60"}`}
            data-ocid="platform-draft.mc-brand.input"
          />
        </div>
      </div>
      <SelectField
        id="mc-condition"
        label="Condition"
        value={fields.condition ?? "good"}
        onChange={(v) =>
          onChange({ condition: v as MecariDraftFields["condition"] })
        }
        options={MECARI_CONDITIONS}
        helpText="Mercari uses a 1–5 scale"
        required
        data-ocid="platform-draft.mc-condition.select"
      />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="mc-category"
            className="text-xs font-semibold text-muted-foreground mb-1.5 block"
          >
            Category
          </label>
          <input
            id="mc-category"
            type="text"
            value={fields.category ?? ""}
            onChange={(e) =>
              onChange({ category: e.target.value || undefined })
            }
            placeholder="e.g. Women's Tops"
            className="w-full px-3 py-2 bg-secondary/40 border border-border/50 rounded text-sm text-foreground focus:border-primary/60 focus:outline-none transition-smooth"
            data-ocid="platform-draft.mc-category.input"
          />
        </div>
        <SelectField
          id="mc-shipping"
          label="Shipping Type"
          value={fields.shippingType ?? "normal"}
          onChange={(v) =>
            onChange({ shippingType: v as MecariDraftFields["shippingType"] })
          }
          options={SHIPPING_TYPES}
          data-ocid="platform-draft.mc-shipping.select"
        />
      </div>
    </div>
  );
}

function EbayForm({
  fields,
  onChange,
}: {
  fields: EbayDraftFields;
  onChange: (f: Partial<EbayDraftFields>) => void;
}) {
  return (
    <div className="space-y-4">
      <CharCountInput
        id="eb-title"
        label="Title"
        value={fields.title}
        onChange={(v) => onChange({ title: v })}
        max={80}
        required
        data-ocid="platform-draft.eb-title.input"
      />
      <CharCountTextarea
        id="eb-desc"
        label="Description"
        value={fields.description}
        onChange={(v) => onChange({ description: v })}
        max={4000}
        data-ocid="platform-draft.eb-description.textarea"
      />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="eb-price"
            className="text-xs font-semibold text-muted-foreground mb-1.5 block"
          >
            Price
          </label>
          <input
            id="eb-price"
            type="text"
            value={fields.price ?? ""}
            onChange={(e) => onChange({ price: e.target.value || undefined })}
            placeholder="$0.00"
            className="w-full px-3 py-2 bg-secondary/40 border border-border/50 rounded text-sm text-foreground focus:border-primary/60 focus:outline-none transition-smooth"
            data-ocid="platform-draft.eb-price.input"
          />
        </div>
        <div>
          <label
            htmlFor="eb-category"
            className="text-xs font-semibold text-muted-foreground mb-1.5 block"
          >
            Category
          </label>
          <input
            id="eb-category"
            type="text"
            value={fields.category ?? ""}
            onChange={(e) =>
              onChange({ category: e.target.value || undefined })
            }
            placeholder="e.g. Electronics"
            className="w-full px-3 py-2 bg-secondary/40 border border-border/50 rounded text-sm text-foreground focus:border-primary/60 focus:outline-none transition-smooth"
            data-ocid="platform-draft.eb-category.input"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <SelectField
          id="eb-condition"
          label="Condition"
          value={fields.condition ?? "good"}
          onChange={(v) =>
            onChange({ condition: v as EbayDraftFields["condition"] })
          }
          options={FB_CONDITIONS}
          data-ocid="platform-draft.eb-condition.select"
        />
        <div>
          <label
            htmlFor="eb-quantity"
            className="text-xs font-semibold text-muted-foreground mb-1.5 block"
          >
            Quantity
          </label>
          <input
            id="eb-quantity"
            type="number"
            min={1}
            value={fields.quantity}
            onChange={(e) =>
              onChange({
                quantity: Math.max(1, Number.parseInt(e.target.value) || 1),
              })
            }
            className="w-full px-3 py-2 bg-secondary/40 border border-border/50 rounded text-sm text-foreground focus:border-primary/60 focus:outline-none transition-smooth"
            data-ocid="platform-draft.eb-quantity.input"
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="eb-shipping-cost"
          className="text-xs font-semibold text-muted-foreground mb-1.5 block"
        >
          Shipping Cost
        </label>
        <input
          id="eb-shipping-cost"
          type="text"
          value={fields.shippingCost ?? ""}
          onChange={(e) =>
            onChange({ shippingCost: e.target.value || undefined })
          }
          placeholder="$0.00 (Free)"
          className="w-full px-3 py-2 bg-secondary/40 border border-border/50 rounded text-sm text-foreground focus:border-primary/60 focus:outline-none transition-smooth"
          data-ocid="platform-draft.eb-shipping-cost.input"
        />
      </div>
    </div>
  );
}

function PoshmarkForm({
  fields,
  onChange,
}: {
  fields: PoshmarkDraftFields;
  onChange: (f: Partial<PoshmarkDraftFields>) => void;
}) {
  return (
    <div className="space-y-4">
      <CharCountInput
        id="po-title"
        label="Title"
        value={fields.title}
        onChange={(v) => onChange({ title: v })}
        max={141}
        required
        data-ocid="platform-draft.po-title.input"
      />
      <CharCountTextarea
        id="po-desc"
        label="Description"
        value={fields.description}
        onChange={(v) => onChange({ description: v })}
        max={2000}
        data-ocid="platform-draft.po-description.textarea"
      />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="po-price"
            className="text-xs font-semibold text-muted-foreground mb-1.5 block"
          >
            Price
          </label>
          <input
            id="po-price"
            type="text"
            value={fields.price ?? ""}
            onChange={(e) => onChange({ price: e.target.value || undefined })}
            placeholder="$0.00"
            className="w-full px-3 py-2 bg-secondary/40 border border-border/50 rounded text-sm text-foreground focus:border-primary/60 focus:outline-none transition-smooth"
            data-ocid="platform-draft.po-price.input"
          />
        </div>
        <div>
          <label
            htmlFor="po-brand"
            className="text-xs font-semibold text-muted-foreground mb-1.5 block"
          >
            Brand{" "}
            <span className="text-muted-foreground/60">(recommended)</span>
          </label>
          <input
            id="po-brand"
            type="text"
            value={fields.brand ?? ""}
            onChange={(e) => onChange({ brand: e.target.value || undefined })}
            placeholder="e.g. Lululemon"
            className="w-full px-3 py-2 bg-secondary/40 border border-border/50 rounded text-sm text-foreground focus:border-primary/60 focus:outline-none transition-smooth"
            data-ocid="platform-draft.po-brand.input"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="po-size"
            className="text-xs font-semibold text-muted-foreground mb-1.5 block"
          >
            Size
          </label>
          <input
            id="po-size"
            type="text"
            value={fields.size ?? ""}
            onChange={(e) => onChange({ size: e.target.value || undefined })}
            placeholder="XS, S, M, L, XL, etc."
            className="w-full px-3 py-2 bg-secondary/40 border border-border/50 rounded text-sm text-foreground focus:border-primary/60 focus:outline-none transition-smooth"
            data-ocid="platform-draft.po-size.input"
          />
        </div>
        <div>
          <label
            htmlFor="po-category"
            className="text-xs font-semibold text-muted-foreground mb-1.5 block"
          >
            Category
          </label>
          <input
            id="po-category"
            type="text"
            value={fields.category ?? ""}
            onChange={(e) =>
              onChange({ category: e.target.value || undefined })
            }
            placeholder="e.g. Women's Tops"
            className="w-full px-3 py-2 bg-secondary/40 border border-border/50 rounded text-sm text-foreground focus:border-primary/60 focus:outline-none transition-smooth"
            data-ocid="platform-draft.po-category.input"
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="po-condition"
          className="text-xs font-semibold text-muted-foreground mb-1.5 block"
        >
          Condition
        </label>
        <input
          id="po-condition"
          type="text"
          value={fields.condition ?? ""}
          onChange={(e) => onChange({ condition: e.target.value || undefined })}
          placeholder="New with tags, Good condition, etc."
          className="w-full px-3 py-2 bg-secondary/40 border border-border/50 rounded text-sm text-foreground focus:border-primary/60 focus:outline-none transition-smooth"
          data-ocid="platform-draft.po-condition.input"
        />
      </div>
    </div>
  );
}

function DepopForm({
  fields,
  onChange,
}: {
  fields: DepopDraftFields;
  onChange: (f: Partial<DepopDraftFields>) => void;
}) {
  return (
    <div className="space-y-4">
      <CharCountInput
        id="dp-title"
        label="Title"
        value={fields.title}
        onChange={(v) => onChange({ title: v })}
        max={70}
        warnAt={60}
        required
        data-ocid="platform-draft.dp-title.input"
      />
      <CharCountTextarea
        id="dp-desc"
        label="Description"
        value={fields.description}
        onChange={(v) => onChange({ description: v })}
        max={500}
        rows={3}
        data-ocid="platform-draft.dp-description.textarea"
      />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="dp-price"
            className="text-xs font-semibold text-muted-foreground mb-1.5 block"
          >
            Price
          </label>
          <input
            id="dp-price"
            type="text"
            value={fields.price ?? ""}
            onChange={(e) => onChange({ price: e.target.value || undefined })}
            placeholder="$0.00"
            className="w-full px-3 py-2 bg-secondary/40 border border-border/50 rounded text-sm text-foreground focus:border-primary/60 focus:outline-none transition-smooth"
            data-ocid="platform-draft.dp-price.input"
          />
        </div>
        <div>
          <label
            htmlFor="dp-brand"
            className="text-xs font-semibold text-muted-foreground mb-1.5 block"
          >
            Brand
          </label>
          <input
            id="dp-brand"
            type="text"
            value={fields.brand ?? ""}
            onChange={(e) => onChange({ brand: e.target.value || undefined })}
            placeholder="e.g. Supreme"
            className="w-full px-3 py-2 bg-secondary/40 border border-border/50 rounded text-sm text-foreground focus:border-primary/60 focus:outline-none transition-smooth"
            data-ocid="platform-draft.dp-brand.input"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="dp-condition"
            className="text-xs font-semibold text-muted-foreground mb-1.5 block"
          >
            Condition
          </label>
          <input
            id="dp-condition"
            type="text"
            value={fields.condition ?? ""}
            onChange={(e) =>
              onChange({ condition: e.target.value || undefined })
            }
            placeholder="New, Good, Worn…"
            className="w-full px-3 py-2 bg-secondary/40 border border-border/50 rounded text-sm text-foreground focus:border-primary/60 focus:outline-none transition-smooth"
            data-ocid="platform-draft.dp-condition.input"
          />
        </div>
        <div>
          <label
            htmlFor="dp-size"
            className="text-xs font-semibold text-muted-foreground mb-1.5 block"
          >
            Size
          </label>
          <input
            id="dp-size"
            type="text"
            value={fields.size ?? ""}
            onChange={(e) => onChange({ size: e.target.value || undefined })}
            placeholder="XS, S, M, L…"
            className="w-full px-3 py-2 bg-secondary/40 border border-border/50 rounded text-sm text-foreground focus:border-primary/60 focus:outline-none transition-smooth"
            data-ocid="platform-draft.dp-size.input"
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="dp-category"
          className="text-xs font-semibold text-muted-foreground mb-1.5 block"
        >
          Category
        </label>
        <input
          id="dp-category"
          type="text"
          value={fields.category ?? ""}
          onChange={(e) => onChange({ category: e.target.value || undefined })}
          placeholder="e.g. Streetwear"
          className="w-full px-3 py-2 bg-secondary/40 border border-border/50 rounded text-sm text-foreground focus:border-primary/60 focus:outline-none transition-smooth"
          data-ocid="platform-draft.dp-category.input"
        />
      </div>
    </div>
  );
}

function EtsyForm({
  fields,
  onChange,
}: {
  fields: EtsyDraftFields;
  onChange: (f: Partial<EtsyDraftFields>) => void;
}) {
  const [tagInput, setTagInput] = useState("");

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && fields.tags.length < 13) {
      onChange({ tags: [...fields.tags, trimmed] });
      setTagInput("");
    }
  };
  const removeTag = (idx: number) =>
    onChange({ tags: fields.tags.filter((_, i) => i !== idx) });

  return (
    <div className="space-y-4">
      <CharCountInput
        id="et-title"
        label="Title"
        value={fields.title}
        onChange={(v) => onChange({ title: v })}
        max={140}
        required
        data-ocid="platform-draft.et-title.input"
      />
      <CharCountTextarea
        id="et-desc"
        label="Description"
        value={fields.description}
        onChange={(v) => onChange({ description: v })}
        max={10000}
        rows={5}
        data-ocid="platform-draft.et-description.textarea"
      />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="et-price"
            className="text-xs font-semibold text-muted-foreground mb-1.5 block"
          >
            Price
          </label>
          <input
            id="et-price"
            type="text"
            value={fields.price ?? ""}
            onChange={(e) => onChange({ price: e.target.value || undefined })}
            placeholder="$0.00"
            className="w-full px-3 py-2 bg-secondary/40 border border-border/50 rounded text-sm text-foreground focus:border-primary/60 focus:outline-none transition-smooth"
            data-ocid="platform-draft.et-price.input"
          />
        </div>
        <div>
          <label
            htmlFor="et-category"
            className="text-xs font-semibold text-muted-foreground mb-1.5 block"
          >
            Category
          </label>
          <input
            id="et-category"
            type="text"
            value={fields.category ?? ""}
            onChange={(e) =>
              onChange({ category: e.target.value || undefined })
            }
            placeholder="e.g. Handmade"
            className="w-full px-3 py-2 bg-secondary/40 border border-border/50 rounded text-sm text-foreground focus:border-primary/60 focus:outline-none transition-smooth"
            data-ocid="platform-draft.et-category.input"
          />
        </div>
      </div>
      <div>
        <div className="text-xs font-semibold text-muted-foreground mb-1.5 flex items-center justify-between">
          <span>Tags</span>
          <span
            className={`tabular-nums ${fields.tags.length >= 13 ? "text-destructive" : "text-muted-foreground/60"}`}
          >
            {fields.tags.length}/13
          </span>
        </div>
        {fields.tags.length < 13 && (
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
              placeholder="Add a tag…"
              className="flex-1 px-3 py-2 bg-secondary/40 border border-border/50 rounded text-sm text-foreground focus:border-primary/60 focus:outline-none transition-smooth"
              data-ocid="platform-draft.et-tag.input"
            />
            <button
              type="button"
              onClick={addTag}
              disabled={!tagInput.trim()}
              className="px-3 py-2 bg-primary/20 hover:bg-primary/30 border border-primary/40 rounded text-sm font-semibold text-primary disabled:opacity-40 transition-smooth"
              data-ocid="platform-draft.et-tag.add_button"
            >
              Add
            </button>
          </div>
        )}
        <div className="flex flex-wrap gap-1.5">
          {fields.tags.map((tag, idx) => (
            <div
              key={tag}
              className="flex items-center gap-1 px-2.5 py-1 bg-primary/15 border border-primary/30 rounded-full text-xs text-primary"
              data-ocid={`platform-draft.et-tag.item.${idx + 1}`}
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(idx)}
                className="hover:text-destructive transition-colors"
                aria-label={`Remove tag ${tag}`}
                data-ocid={`platform-draft.et-tag.item.${idx + 1}.delete_button`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground/60 mt-1.5">
          Up to 13 tags — used for Etsy search
        </p>
      </div>
    </div>
  );
}

// ─── Completeness bar ─────────────────────────────────────────────────────────

function CompletenessBar({ percent }: { percent: number }) {
  const color =
    percent > 80
      ? "bg-green-500"
      : percent >= 50
        ? "bg-accent"
        : "bg-destructive";
  const label =
    percent > 80
      ? "text-green-400"
      : percent >= 50
        ? "text-accent"
        : "text-destructive";
  return (
    <div className="px-5 pt-2 pb-3 border-b border-border/30">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-muted-foreground">
          Draft completeness
        </span>
        <span className={`text-xs font-semibold tabular-nums ${label}`}>
          {percent}%
        </span>
      </div>
      <div className="h-1.5 bg-secondary/60 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

// ─── Confirm posted dialog ────────────────────────────────────────────────────

function ConfirmPostedDialog({
  platform,
  onConfirm,
  onCancel,
}: {
  platform: PlatformId;
  onConfirm: (url?: string) => void;
  onCancel: () => void;
}) {
  const [url, setUrl] = useState("");
  const meta = PLATFORM_META[platform];
  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4"
      data-ocid="platform-draft.confirm-posted.dialog"
    >
      <div className="bg-card border border-border/50 rounded-xl max-w-md w-full p-6 space-y-4">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-6 w-6 text-green-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-foreground">
              Confirm Manual Posting
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Confirm you've manually posted this listing to{" "}
              <span className="text-foreground font-semibold">
                {meta.icon} {meta.label}
              </span>
              . This logs the action — it does <em>not</em> publish
              automatically.
            </p>
          </div>
        </div>
        <div>
          <label
            htmlFor="posted-url"
            className="text-xs font-semibold text-muted-foreground mb-1.5 block"
          >
            Listing URL{" "}
            <span className="text-muted-foreground/50">(optional)</span>
          </label>
          <input
            id="posted-url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={`https://www.${platform}.com/listing/...`}
            className="w-full px-3 py-2 bg-secondary/40 border border-border/50 rounded text-sm text-foreground focus:border-primary/60 focus:outline-none transition-smooth"
            data-ocid="platform-draft.confirm-posted.url.input"
          />
        </div>
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-secondary/50 hover:bg-secondary/70 rounded text-sm font-semibold transition-smooth"
            data-ocid="platform-draft.confirm-posted.cancel_button"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(url || undefined)}
            className="flex-1 px-4 py-2 bg-green-700 hover:bg-green-600 rounded text-sm font-semibold text-foreground transition-smooth flex items-center justify-center gap-2"
            data-ocid="platform-draft.confirm-posted.confirm_button"
          >
            <CheckCircle2 className="h-4 w-4" />
            Confirm Posted
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main modal ───────────────────────────────────────────────────────────────

export function PlatformDraftModal({
  isOpen,
  onClose,
  listingId,
  platform,
  masterListing,
  existingDraft,
}: PlatformDraftModalProps) {
  const meta = PLATFORM_META[platform];
  const saveDraft = useSavePlatformDraft();
  const logPosting = useLogManualPosting();
  const { isMobile } = useDevice();
  const [showConfirmPosted, setShowConfirmPosted] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // ── Facebook state ──
  const [fbFields, setFbFields] = useState<FacebookDraftFields>(() => ({
    title: masterListing?.title.slice(0, 200) ?? "",
    description: masterListing?.description.slice(0, 5000) ?? "",
    price: masterListing?.price ?? undefined,
    condition: "good",
    localPickup: true,
    shipping: false,
  }));

  // ── Mercari state ──
  const [mcFields, setMcFields] = useState<MecariDraftFields>(() => ({
    title: masterListing?.title.slice(0, 80) ?? "",
    description: masterListing?.description.slice(0, 1000) ?? "",
    price: masterListing?.price ?? undefined,
    brand: "",
    condition: "good",
    category: masterListing?.category ?? undefined,
    shippingType: "normal",
  }));

  // ── eBay state ──
  const [ebFields, setEbFields] = useState<EbayDraftFields>(() => ({
    title: masterListing?.title.slice(0, 80) ?? "",
    description: masterListing?.description.slice(0, 4000) ?? "",
    price: masterListing?.price ?? undefined,
    category: masterListing?.category ?? undefined,
    condition: "good",
    quantity: 1,
  }));

  // ── Poshmark state ──
  const [poFields, setPoFields] = useState<PoshmarkDraftFields>(() => ({
    title: masterListing?.title.slice(0, 141) ?? "",
    description: masterListing?.description.slice(0, 2000) ?? "",
    price: masterListing?.price ?? undefined,
    category: masterListing?.category ?? undefined,
  }));

  // ── Depop state ──
  const [dpFields, setDpFields] = useState<DepopDraftFields>(() => ({
    title: masterListing?.title.slice(0, 70) ?? "",
    description: masterListing?.description.slice(0, 500) ?? "",
    price: masterListing?.price ?? undefined,
    category: masterListing?.category ?? undefined,
  }));

  // ── Etsy state ──
  const [etFields, setEtFields] = useState<EtsyDraftFields>(() => ({
    title: masterListing?.title.slice(0, 140) ?? "",
    description: masterListing?.description.slice(0, 10000) ?? "",
    price: masterListing?.price ?? undefined,
    category: masterListing?.category ?? undefined,
    tags: masterListing?.tags?.slice(0, 13) ?? [],
    materials: [],
    isSupply: false,
  }));

  // Override with saved draft values on open
  useEffect(() => {
    if (!isOpen || !existingDraft?.platformFields) return;
    const pf = existingDraft.platformFields;
    if (
      platform === "facebook" &&
      pf.facebook &&
      typeof pf.facebook === "object"
    ) {
      const f = pf.facebook as Record<string, unknown>;
      setFbFields((prev) => ({
        ...prev,
        title: (f.title as string) || prev.title,
        description: (f.description as string) || prev.description,
        price: (f.price as string) || prev.price,
        localPickup:
          typeof f.localPickup === "boolean" ? f.localPickup : prev.localPickup,
        shipping: typeof f.shipping === "boolean" ? f.shipping : prev.shipping,
      }));
    } else if (
      platform === "mercari" &&
      pf.mecari &&
      typeof pf.mecari === "object"
    ) {
      const f = pf.mecari as Record<string, unknown>;
      setMcFields((prev) => ({
        ...prev,
        title: (f.title as string) || prev.title,
        description: (f.description as string) || prev.description,
        price: (f.price as string) || prev.price,
        brand: (f.brand as string) || prev.brand,
        category: (f.category as string) || prev.category,
      }));
    }
    // Other platforms: add as needed
  }, [isOpen, platform, existingDraft]);

  if (!isOpen) return null;

  // ── Validation helpers ──
  const hasOverLimit = (() => {
    switch (platform) {
      case "facebook":
        return (
          fbFields.title.length > 200 || fbFields.description.length > 5000
        );
      case "mercari":
        return mcFields.title.length > 80 || mcFields.description.length > 1000;
      case "ebay":
        return ebFields.title.length > 80 || ebFields.description.length > 4000;
      case "poshmark":
        return (
          poFields.title.length > 141 || poFields.description.length > 2000
        );
      case "depop":
        return dpFields.title.length > 70 || dpFields.description.length > 500;
      case "etsy":
        return (
          etFields.title.length > 140 || etFields.description.length > 10000
        );
    }
  })();

  const hasMissingRequired = (() => {
    if (platform === "mercari") return !mcFields.brand.trim();
    return false;
  })();

  const canSave = !hasOverLimit;

  // ── Save handler ──
  const handleSave = () => {
    setSubmitAttempted(true);
    if (hasMissingRequired || hasOverLimit) return;

    const backendPlatform = platform; // normalization now happens inside useSavePlatformDraft

    saveDraft.mutate(
      {
        listingId,
        input: (() => {
          switch (platform) {
            case "facebook":
              return { platform: "facebook" as const, fields: fbFields };
            case "mercari":
              return { platform: "mercari" as const, fields: mcFields };
            case "ebay":
              return { platform: "ebay" as const, fields: ebFields };
            case "poshmark":
              return { platform: "poshmark" as const, fields: poFields };
            case "depop":
              return { platform: "depop" as const, fields: dpFields };
            case "etsy":
              return { platform: "etsy" as const, fields: etFields };
          }
        })(),
      },
      {
        onSuccess: () => {
          toast.success(`✅ Draft saved for ${meta.icon} ${meta.label}!`);
        },
      },
    );
    // satisfy ts — backendPlatform is used via input.platform, variable kept to avoid lint
    void backendPlatform;
  };

  // ── Log manual posting handler ──
  const handleConfirmPosted = (url?: string) => {
    setShowConfirmPosted(false);
    const backendPlatform: Parameters<typeof logPosting.mutate>[0]["platform"] =
      platform === "mercari" ? "mecari" : platform;
    logPosting.mutate(
      { listingId, platform: backendPlatform, remoteUrl: url },
      { onSuccess: onClose },
    );
  };

  return (
    <>
      <div
        role="presentation"
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
        data-ocid="platform-draft.dialog"
      >
        <div className="bg-card border border-border/40 rounded-xl max-w-2xl w-full overflow-hidden max-h-[90vh] flex flex-col">
          {/* Header */}
          <div
            className="px-5 py-4 flex items-center justify-between shrink-0"
            style={{
              background: `linear-gradient(135deg, ${meta.headerColor}30 0%, ${meta.headerColor}10 100%)`,
              borderBottom: `1px solid ${meta.headerColor}40`,
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{meta.icon}</span>
              <div>
                <h2 className="font-display text-sm font-bold text-foreground">
                  {meta.label}
                </h2>
                <p className="text-xs text-muted-foreground">Draft Editor</p>
              </div>
              {existingDraft?.isValid && (
                <div className="flex items-center gap-1 px-2 py-0.5 bg-green-500/15 border border-green-500/30 rounded-full text-xs text-green-400">
                  <CheckCircle2 className="h-3 w-3" />
                  Valid
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-smooth"
              data-ocid="platform-draft.close_button"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          {/* Completeness bar */}
          {existingDraft && (
            <CompletenessBar percent={existingDraft.completenessPercent} />
          )}

          {/* Scrollable form content */}
          <div className="overflow-y-auto flex-1 p-5">
            <div
              className={`rounded-lg p-4 border ${meta.borderColor} ${meta.bgColor} mb-5`}
            >
              <p className="text-xs text-muted-foreground">
                Fill in the fields below to prepare your draft for{" "}
                <strong className="text-foreground">{meta.label}</strong>. Use
                the Chrome extension to autofill this into the platform's form.
              </p>
            </div>

            {platform === "facebook" && (
              <FacebookForm
                fields={fbFields}
                onChange={(f) => setFbFields((prev) => ({ ...prev, ...f }))}
              />
            )}
            {platform === "mercari" && (
              <MercariForm
                fields={mcFields}
                onChange={(f) => setMcFields((prev) => ({ ...prev, ...f }))}
                masterTitle={masterListing?.title ?? ""}
              />
            )}
            {platform === "ebay" && (
              <EbayForm
                fields={ebFields}
                onChange={(f) => setEbFields((prev) => ({ ...prev, ...f }))}
              />
            )}
            {platform === "poshmark" && (
              <PoshmarkForm
                fields={poFields}
                onChange={(f) => setPoFields((prev) => ({ ...prev, ...f }))}
              />
            )}
            {platform === "depop" && (
              <DepopForm
                fields={dpFields}
                onChange={(f) => setDpFields((prev) => ({ ...prev, ...f }))}
              />
            )}
            {platform === "etsy" && (
              <EtsyForm
                fields={etFields}
                onChange={(f) => setEtFields((prev) => ({ ...prev, ...f }))}
              />
            )}

            {submitAttempted && hasMissingRequired && (
              <div
                className="mt-4 flex items-center gap-2 px-3 py-2 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive"
                data-ocid="platform-draft.error_state"
              >
                <AlertTriangle className="h-4 w-4 shrink-0" />
                Please fill in all required fields before saving.
              </div>
            )}
          </div>

          {/* Sticky footer */}
          <div className="px-5 py-4 border-t border-border/30 flex gap-3 shrink-0 bg-card flex-wrap">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-secondary/50 hover:bg-secondary/70 rounded-lg text-sm font-semibold transition-smooth"
              data-ocid="platform-draft.cancel_button"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!canSave || saveDraft.isPending}
              className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 disabled:opacity-40 rounded-lg text-sm font-semibold text-primary-foreground transition-smooth flex items-center justify-center gap-2"
              data-ocid="platform-draft.save_button"
            >
              {saveDraft.isPending ? "Saving…" : "Save Draft"}
            </button>

            {/* Mobile: Copy + Open App; Desktop: Mark as Posted */}
            {isMobile ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    const text = [
                      masterListing?.title,
                      masterListing?.price
                        ? `Price: ${masterListing.price}`
                        : null,
                    ]
                      .filter(Boolean)
                      .join(" · ");
                    navigator.clipboard
                      .writeText(text)
                      .then(() => {
                        toast.success("Listing copied to clipboard");
                      })
                      .catch(() => {
                        toast.error("Copy failed");
                      });
                  }}
                  className="px-4 py-2 bg-transparent hover:bg-primary/10 border border-primary/50 rounded-lg text-sm font-semibold text-primary transition-smooth flex items-center gap-2"
                  data-ocid="platform-draft.copy_listing.button"
                >
                  <Copy className="h-4 w-4" />
                  Copy Listing
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const appUrls: Record<string, string> = {
                      facebook:
                        "https://www.facebook.com/marketplace/create/item",
                      mercari: "https://www.mercari.com/sell/",
                      ebay: "https://www.ebay.com/sell",
                      poshmark: "https://poshmark.com/create-listing",
                      depop: "https://www.depop.com/sell/",
                      etsy: "https://www.etsy.com/sell",
                    };
                    window.open(
                      appUrls[platform] ?? "#",
                      "_blank",
                      "noopener,noreferrer",
                    );
                  }}
                  className="px-4 py-2 bg-transparent hover:bg-accent/10 border border-accent/50 rounded-lg text-sm font-semibold text-accent transition-smooth flex items-center gap-2"
                  data-ocid="platform-draft.open-app.button"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open {meta.label}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setShowConfirmPosted(true)}
                disabled={logPosting.isPending}
                className="px-4 py-2 bg-transparent hover:bg-green-500/10 border border-green-500/50 rounded-lg text-sm font-semibold text-green-400 transition-smooth flex items-center gap-2 disabled:opacity-40"
                data-ocid="platform-draft.mark-posted.open_modal_button"
              >
                <ExternalLink className="h-4 w-4" />
                {logPosting.isPending ? "Logging…" : "Mark as Posted"}
              </button>
            )}
          </div>
        </div>
      </div>

      {showConfirmPosted && (
        <ConfirmPostedDialog
          platform={platform}
          onConfirm={handleConfirmPosted}
          onCancel={() => setShowConfirmPosted(false)}
        />
      )}
    </>
  );
}
