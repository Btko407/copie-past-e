import { useCreateMasterListing } from "@/hooks/useCreateMasterListing";
import { usePhotoOCR } from "@/hooks/usePhotoOCR";
import type {
  DepopDraftFields,
  EbayDraftFields,
  EtsyDraftFields,
  FacebookDraftFields,
  MercariDraftFields,
  Platform,
  PoshmarkDraftFields,
} from "@/types/masterListing";
import {
  Brain,
  CheckCircle2,
  GripVertical,
  Loader2,
  Plus,
  ScanLine,
  Tag,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Types & Constants ────────────────────────────────────────────────────────

interface MasterListingFormProps {
  isOpen: boolean;
  onClose: () => void;
}

async function fileToUint8Array(file: File): Promise<Uint8Array> {
  const buffer = await file.arrayBuffer();
  return new Uint8Array(buffer);
}

const MAX_PHOTOS = 10;
const MAX_TAGS = 20;

const PLATFORMS: { value: Platform; label: string; icon: string }[] = [
  { value: "facebook", label: "Facebook", icon: "📘" },
  { value: "mercari", label: "Mercari", icon: "🛒" },
  { value: "ebay", label: "eBay", icon: "🔨" },
  { value: "poshmark", label: "Poshmark", icon: "👗" },
  { value: "depop", label: "Depop", icon: "🎨" },
  { value: "etsy", label: "Etsy", icon: "🛍" },
];

// ─── Field input helpers ──────────────────────────────────────────────────────

function FieldInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  required,
  maxLength,
  ocid,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  ocid?: string;
}) {
  const len = value.length;
  const counterClass =
    maxLength && len >= maxLength
      ? "text-destructive font-semibold"
      : maxLength && len >= maxLength * 0.9
        ? "text-accent"
        : "text-muted-foreground";
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="text-xs font-semibold text-foreground/80 uppercase tracking-widest"
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
        {maxLength && (
          <span className={`text-xs tabular-nums ${counterClass}`}>
            {len}/{maxLength}
          </span>
        )}
      </div>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-lg bg-background border border-input text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/60 transition-colors"
        data-ocid={ocid}
      />
    </div>
  );
}

function FieldSelect({
  id,
  label,
  value,
  onChange,
  options,
  required,
  ocid,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  ocid?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="text-xs font-semibold text-foreground/80 uppercase tracking-widest block"
      >
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/60 transition-colors"
        data-ocid={ocid}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function RadioGroup({
  label,
  value,
  onChange,
  options,
  ocid,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  ocid?: string;
}) {
  return (
    <div className="space-y-1.5">
      <span className="text-xs font-semibold text-foreground/80 uppercase tracking-widest block">
        {label}
      </span>
      <div className="flex flex-wrap gap-2" data-ocid={ocid}>
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
              value === o.value
                ? "bg-primary/20 border border-primary/60 text-primary"
                : "bg-secondary/40 border border-border/50 text-muted-foreground hover:border-primary/40"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Platform-specific field sections ────────────────────────────────────────

function FacebookFields({
  fields,
  onChange,
}: {
  fields: Partial<FacebookDraftFields>;
  onChange: (f: Partial<FacebookDraftFields>) => void;
}) {
  return (
    <div className="space-y-3 pt-1">
      <FieldSelect
        id="mlf-fb-condition"
        label="Condition"
        value={fields.condition ?? "used_good"}
        onChange={(v) =>
          onChange({ condition: v as FacebookDraftFields["condition"] })
        }
        options={[
          { value: "new", label: "New" },
          { value: "used_like_new", label: "Used — Like New" },
          { value: "used_good", label: "Used — Good" },
          { value: "used_fair", label: "Used — Fair" },
        ]}
        required
        ocid="master_listing_form.fb-condition.select"
      />
      <FieldInput
        id="mlf-fb-location"
        label="Location"
        value={fields.location ?? ""}
        onChange={(v) => onChange({ location: v })}
        placeholder="City, State or ZIP"
        required
        ocid="master_listing_form.fb-location.input"
      />
      <FieldInput
        id="mlf-fb-category"
        label="Category"
        value={fields.category ?? ""}
        onChange={(v) => onChange({ category: v })}
        placeholder="e.g. Electronics, Clothing…"
        required
        ocid="master_listing_form.fb-category.input"
      />
    </div>
  );
}

function MercariFields({
  fields,
  onChange,
}: {
  fields: Partial<MercariDraftFields>;
  onChange: (f: Partial<MercariDraftFields>) => void;
}) {
  return (
    <div className="space-y-3 pt-1">
      <FieldInput
        id="mlf-mc-brand"
        label="Brand"
        value={fields.brand ?? ""}
        onChange={(v) => onChange({ brand: v })}
        placeholder="e.g. Nike, Apple…"
        required
        ocid="master_listing_form.mc-brand.input"
      />
      <div className="space-y-1.5">
        <span className="text-xs font-semibold text-foreground/80 uppercase tracking-widest block">
          Condition<span className="text-destructive ml-1">*</span>
        </span>
        <div className="flex gap-2">
          {([1, 2, 3, 4, 5] as const).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onChange({ condition: n })}
              className={`flex-1 py-2 rounded text-xs font-bold transition-colors ${
                fields.condition === n
                  ? "bg-primary/20 border border-primary/60 text-primary"
                  : "bg-secondary/40 border border-border/50 text-muted-foreground hover:border-primary/40"
              }`}
              data-ocid={`master_listing_form.mc-condition-${n}.button`}
            >
              {n}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">1=New … 5=Poor</p>
      </div>
      <FieldSelect
        id="mlf-mc-shipping"
        label="Shipping Type"
        value={fields.shipping_type ?? "mercari_prepaid_label"}
        onChange={(v) => onChange({ shipping_type: v })}
        options={[
          { value: "mercari_prepaid_label", label: "Mercari Prepaid Label" },
          { value: "seller_arranges", label: "Seller Arranges" },
          { value: "bundled", label: "Bundled" },
        ]}
        required
        ocid="master_listing_form.mc-shipping.select"
      />
      <div className="space-y-1.5">
        <label
          htmlFor="mlf-mc-days"
          className="text-xs font-semibold text-foreground/80 uppercase tracking-widest block"
        >
          Delivery Days
        </label>
        <input
          id="mlf-mc-days"
          type="number"
          min={1}
          max={7}
          value={fields.delivery_days ?? 3}
          onChange={(e) =>
            onChange({
              delivery_days: Math.max(
                1,
                Math.min(7, Number(e.target.value) || 3),
              ),
            })
          }
          className="w-full px-3 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
          data-ocid="master_listing_form.mc-days.input"
        />
      </div>
    </div>
  );
}

function EbayFields({
  fields,
  onChange,
}: {
  fields: Partial<EbayDraftFields>;
  onChange: (f: Partial<EbayDraftFields>) => void;
}) {
  return (
    <div className="space-y-3 pt-1">
      <FieldSelect
        id="mlf-eb-condition"
        label="Condition ID"
        value={fields.condition_id ?? "3000"}
        onChange={(v) =>
          onChange({ condition_id: v as EbayDraftFields["condition_id"] })
        }
        options={[
          { value: "1000", label: "1000 — New" },
          { value: "1500", label: "1500 — New (other)" },
          { value: "2000", label: "2000 — Certified Refurbished" },
          { value: "2500", label: "2500 — Seller Refurbished" },
          { value: "3000", label: "3000 — Used" },
          { value: "4000", label: "4000 — Very Good" },
          { value: "5000", label: "5000 — Good" },
          { value: "6000", label: "6000 — Acceptable" },
          { value: "7000", label: "7000 — For Parts" },
        ]}
        required
        ocid="master_listing_form.eb-condition.select"
      />
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label
            htmlFor="mlf-eb-qty"
            className="text-xs font-semibold text-foreground/80 uppercase tracking-widest block"
          >
            Quantity<span className="text-destructive ml-1">*</span>
          </label>
          <input
            id="mlf-eb-qty"
            type="number"
            min={1}
            value={fields.quantity ?? 1}
            onChange={(e) =>
              onChange({ quantity: Math.max(1, Number(e.target.value) || 1) })
            }
            className="w-full px-3 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
            data-ocid="master_listing_form.eb-quantity.input"
          />
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor="mlf-eb-category"
            className="text-xs font-semibold text-foreground/80 uppercase tracking-widest block"
          >
            Category ID
          </label>
          <input
            id="mlf-eb-category"
            type="text"
            value={fields.category_id ?? ""}
            onChange={(e) => onChange({ category_id: e.target.value })}
            placeholder="e.g. 9355"
            className="w-full px-3 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
            data-ocid="master_listing_form.eb-category-id.input"
          />
        </div>
      </div>
      <RadioGroup
        label="Listing Type"
        value={fields.listing_type ?? "fixed_price"}
        onChange={(v) =>
          onChange({ listing_type: v as EbayDraftFields["listing_type"] })
        }
        options={[
          { value: "fixed_price", label: "Fixed Price" },
          { value: "auction", label: "Auction" },
        ]}
        ocid="master_listing_form.eb-listing-type.radio"
      />
    </div>
  );
}

function PoshmarkFields({
  fields,
  onChange,
}: {
  fields: Partial<PoshmarkDraftFields>;
  onChange: (f: Partial<PoshmarkDraftFields>) => void;
}) {
  return (
    <div className="space-y-3 pt-1">
      <div className="grid grid-cols-2 gap-3">
        <FieldInput
          id="mlf-po-brand"
          label="Brand"
          value={fields.brand ?? ""}
          onChange={(v) => onChange({ brand: v })}
          placeholder="e.g. Lululemon"
          required
          ocid="master_listing_form.po-brand.input"
        />
        <FieldInput
          id="mlf-po-size"
          label="Size"
          value={fields.size ?? ""}
          onChange={(v) => onChange({ size: v })}
          placeholder="XS, M, 8…"
          required
          ocid="master_listing_form.po-size.input"
        />
      </div>
      <RadioGroup
        label="Department"
        value={fields.department ?? "Women"}
        onChange={(v) => onChange({ department: v })}
        options={[
          { value: "Women", label: "Women" },
          { value: "Men", label: "Men" },
          { value: "Kids", label: "Kids" },
          { value: "Home", label: "Home" },
          { value: "Pets", label: "Pets" },
        ]}
        ocid="master_listing_form.po-department.radio"
      />
      <div className="grid grid-cols-2 gap-3">
        <FieldInput
          id="mlf-po-color"
          label="Color"
          value={fields.color ?? ""}
          onChange={(v) => onChange({ color: v })}
          placeholder="e.g. Navy Blue"
          required
          ocid="master_listing_form.po-color.input"
        />
        <FieldInput
          id="mlf-po-orig-price"
          label="Original Price"
          value={fields.original_price ?? ""}
          onChange={(v) => onChange({ original_price: v })}
          placeholder="$0.00"
          required
          ocid="master_listing_form.po-original-price.input"
        />
      </div>
    </div>
  );
}

function DepopFields({
  fields,
  onChange,
}: {
  fields: Partial<DepopDraftFields>;
  onChange: (f: Partial<DepopDraftFields>) => void;
}) {
  return (
    <div className="space-y-3 pt-1">
      <div className="grid grid-cols-2 gap-3">
        <FieldInput
          id="mlf-dp-brand"
          label="Brand"
          value={fields.brand ?? ""}
          onChange={(v) => onChange({ brand: v })}
          placeholder="e.g. Supreme"
          required
          ocid="master_listing_form.dp-brand.input"
        />
        <FieldInput
          id="mlf-dp-size"
          label="Size"
          value={fields.size ?? ""}
          onChange={(v) => onChange({ size: v })}
          placeholder="XS, M…"
          required
          ocid="master_listing_form.dp-size.input"
        />
      </div>
      <FieldSelect
        id="mlf-dp-condition"
        label="Condition"
        value={fields.condition ?? "Good"}
        onChange={(v) =>
          onChange({ condition: v as DepopDraftFields["condition"] })
        }
        options={[
          { value: "New with tags", label: "New with tags" },
          { value: "Like new", label: "Like new" },
          { value: "Good", label: "Good" },
          { value: "Fair", label: "Fair" },
          { value: "Poor", label: "Poor" },
        ]}
        required
        ocid="master_listing_form.dp-condition.select"
      />
      <div className="grid grid-cols-2 gap-3">
        <FieldInput
          id="mlf-dp-color"
          label="Color"
          value={fields.color ?? ""}
          onChange={(v) => onChange({ color: v })}
          placeholder="e.g. Black"
          required
          ocid="master_listing_form.dp-color.input"
        />
        <RadioGroup
          label="Gender"
          value={fields.gender ?? "Unisex"}
          onChange={(v) => onChange({ gender: v })}
          options={[
            { value: "Male", label: "M" },
            { value: "Female", label: "F" },
            { value: "Unisex", label: "U" },
          ]}
          ocid="master_listing_form.dp-gender.radio"
        />
      </div>
    </div>
  );
}

function EtsyFields({
  fields,
  onChange,
}: {
  fields: Partial<EtsyDraftFields>;
  onChange: (f: Partial<EtsyDraftFields>) => void;
}) {
  const [tagInput, setTagInput] = useState("");
  const tags = fields.tags ?? [];
  const materials = fields.materials ?? [];

  const addTag = () => {
    const t = tagInput.trim().slice(0, 20);
    if (t && !tags.includes(t) && tags.length < 13) {
      onChange({ tags: [...tags, t] });
      setTagInput("");
    }
  };

  return (
    <div className="space-y-3 pt-1">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-foreground/80 uppercase tracking-widest">
            Tags<span className="text-destructive ml-1">*</span>
          </span>
          <span
            className={`text-xs tabular-nums ${tags.length >= 13 ? "text-destructive" : "text-muted-foreground"}`}
          >
            {tags.length}/13
          </span>
        </div>
        {tags.length < 13 && (
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
              placeholder="Add a tag (max 20 chars)…"
              className="flex-1 px-3 py-2 rounded bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
              data-ocid="master_listing_form.etsy-tag.input"
            />
            <button
              type="button"
              onClick={addTag}
              disabled={!tagInput.trim()}
              className="px-3 py-2 bg-primary/20 border border-primary/40 text-primary rounded hover:bg-primary/30 disabled:opacity-40 transition-colors"
              data-ocid="master_listing_form.etsy-tag.add_button"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag, i) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-1 bg-primary/15 border border-primary/30 rounded-full text-xs text-primary"
              data-ocid={`master_listing_form.etsy-tag.item.${i + 1}`}
            >
              {tag}
              <button
                type="button"
                onClick={() =>
                  onChange({ tags: tags.filter((_, j) => j !== i) })
                }
                className="hover:text-destructive transition-colors"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>
      <FieldInput
        id="mlf-et-materials"
        label="Materials (comma-separated)"
        value={materials.join(", ")}
        onChange={(v) =>
          onChange({
            materials: v
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
          })
        }
        placeholder="cotton, silver, reclaimed wood…"
        ocid="master_listing_form.etsy-materials.input"
      />
      <RadioGroup
        label="Who Made"
        value={fields.who_made ?? "i_did"}
        onChange={(v) =>
          onChange({ who_made: v as EtsyDraftFields["who_made"] })
        }
        options={[
          { value: "i_did", label: "I did" },
          { value: "someone_else", label: "Someone else" },
          { value: "collective", label: "Collective" },
        ]}
        ocid="master_listing_form.etsy-who-made.radio"
      />
      <FieldSelect
        id="mlf-et-when-made"
        label="When Made"
        value={fields.when_made ?? "2020_2024"}
        onChange={(v) => onChange({ when_made: v })}
        options={[
          { value: "made_to_order", label: "Made to Order" },
          { value: "2020_2024", label: "2020–2024" },
          { value: "2010_2019", label: "2010–2019" },
          { value: "2001_2009", label: "2001–2009" },
          { value: "before_2001", label: "Before 2001" },
          { value: "2000_2003", label: "2000–2003" },
          { value: "1990s", label: "1990s" },
          { value: "1980s", label: "1980s" },
          { value: "1970s", label: "1970s" },
          { value: "1960s", label: "1960s" },
          { value: "1950s", label: "1950s" },
          { value: "1940s", label: "1940s" },
          { value: "1930s", label: "1930s" },
          { value: "1920s", label: "1920s" },
          { value: "1910s", label: "1910s" },
          { value: "1900s", label: "1900s" },
          { value: "1800s", label: "1800s" },
          { value: "1700s_or_earlier", label: "1700s or earlier" },
        ]}
        ocid="master_listing_form.etsy-when-made.select"
      />
      <label
        className="flex items-center gap-3 cursor-pointer select-none"
        data-ocid="master_listing_form.etsy-is-supply.checkbox"
      >
        <input
          type="checkbox"
          checked={fields.is_supply ?? false}
          onChange={(e) => onChange({ is_supply: e.target.checked })}
          className="w-4 h-4 rounded border border-input bg-background text-primary"
        />
        <span className="text-sm text-foreground">
          This is a craft supply or tool
        </span>
      </label>
    </div>
  );
}

// ─── OCR result preview ───────────────────────────────────────────────────────

interface OcrPreviewProps {
  ocrResult: {
    title?: string;
    price?: string;
    description?: string;
    category?: string;
    condition?: string;
    brand?: string;
    error?: string;
  };
  onAccept: () => void;
  onDismiss: () => void;
}

function OcrPreview({ ocrResult, onAccept, onDismiss }: OcrPreviewProps) {
  if (ocrResult.error) {
    return (
      <div
        className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-sm text-destructive flex items-start gap-2"
        data-ocid="master_listing_form.ocr.error_state"
      >
        <X className="w-4 h-4 shrink-0 mt-0.5" />
        <div>
          <strong>OCR Failed:</strong> {ocrResult.error}
          <button
            type="button"
            onClick={onDismiss}
            className="ml-2 underline text-destructive/80 hover:text-destructive text-xs"
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }
  const fields = [
    { key: "title", label: "Title", value: ocrResult.title },
    { key: "price", label: "Price", value: ocrResult.price },
    { key: "description", label: "Description", value: ocrResult.description },
    { key: "category", label: "Category", value: ocrResult.category },
    { key: "condition", label: "Condition", value: ocrResult.condition },
    { key: "brand", label: "Brand", value: ocrResult.brand },
  ].filter((f) => f.value);

  return (
    <div
      className="p-4 rounded-lg bg-primary/8 border border-primary/30 space-y-3"
      data-ocid="master_listing_form.ocr.success_state"
    >
      <div className="flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-green-400" />
        <span className="text-sm font-semibold text-green-400">
          OCR Scan Complete
        </span>
        <span className="ml-auto text-xs text-muted-foreground">
          {fields.length} fields found
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {fields.map((f) => (
          <div key={f.key} className="text-xs">
            <span className="text-muted-foreground uppercase tracking-wide">
              {f.label}:{" "}
            </span>
            <span className="text-foreground/90 font-medium">
              {String(f.value).slice(0, 60)}
              {String(f.value).length > 60 ? "…" : ""}
            </span>
          </div>
        ))}
      </div>
      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={onAccept}
          className="flex-1 px-3 py-2 bg-primary/20 border border-primary/40 text-primary rounded text-xs font-semibold hover:bg-primary/30 transition-colors"
          data-ocid="master_listing_form.ocr.accept_button"
        >
          Accept Fields
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className="px-3 py-2 bg-secondary/40 border border-border/50 text-muted-foreground rounded text-xs hover:bg-secondary/60 transition-colors"
          data-ocid="master_listing_form.ocr.dismiss_button"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function MasterListingForm({ isOpen, onClose }: MasterListingFormProps) {
  const mutation = useCreateMasterListing();
  const { extractFromImage, isProcessing: isOcrProcessing } = usePhotoOCR();

  // Core fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  // Photo gallery
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  // Platform fields
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(
    null,
  );
  const [fbFields, setFbFields] = useState<Partial<FacebookDraftFields>>({
    condition: "used_good",
    location: "",
    category: "",
  });
  const [mcFields, setMcFields] = useState<Partial<MercariDraftFields>>({
    brand: "",
    condition: 3,
    shipping_type: "mercari_prepaid_label",
    delivery_days: 3,
  });
  const [ebFields, setEbFields] = useState<Partial<EbayDraftFields>>({
    condition_id: "3000",
    quantity: 1,
    listing_type: "fixed_price",
  });
  const [poFields, setPoFields] = useState<Partial<PoshmarkDraftFields>>({
    brand: "",
    size: "",
    department: "Women",
    color: "",
    original_price: "",
  });
  const [dpFields, setDpFields] = useState<Partial<DepopDraftFields>>({
    brand: "",
    size: "",
    condition: "Good",
    color: "",
    gender: "Unisex",
  });
  const [etFields, setEtFields] = useState<Partial<EtsyDraftFields>>({
    tags: [],
    materials: [],
    who_made: "i_did",
    when_made: "2020_2024",
    is_supply: false,
  });

  // OCR
  const [ocrResult, setOcrResult] =
    useState<
      ReturnType<typeof usePhotoOCR>["error"] extends string
        ? never
        : Awaited<
            ReturnType<ReturnType<typeof usePhotoOCR>["extractFromImage"]>
          > | null
    >(null);
  const ocrFileRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const titleLen = title.length;
  const descLen = description.length;
  // Submit gate: only data validity — intentionally NO extension check.
  // Users must always be able to save to the canister regardless of whether
  // the autofill extension is installed (manual entry + OCR both work without it).
  const canSubmit =
    title.trim().length > 0 &&
    description.trim().length > 0 &&
    photos.length > 0 &&
    !mutation.isPending;

  const resetForm = useCallback(() => {
    setTitle("");
    setDescription("");
    setPrice("");
    setCategory("");
    setTags([]);
    setTagInput("");
    for (const url of photoPreviews) URL.revokeObjectURL(url);
    setPhotos([]);
    setPhotoPreviews([]);
    setSelectedPlatform(null);
    setOcrResult(null);
  }, [photoPreviews]);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Photo management
  const addPhotos = (files: FileList | File[]) => {
    const incoming = Array.from(files).filter((f) =>
      f.type.startsWith("image/"),
    );
    const remaining = MAX_PHOTOS - photos.length;
    const toAdd = incoming.slice(0, remaining);
    if (toAdd.length === 0) return;
    const newPreviews = toAdd.map((f) => URL.createObjectURL(f));
    setPhotos((prev) => [...prev, ...toAdd]);
    setPhotoPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removePhoto = (idx: number) => {
    URL.revokeObjectURL(photoPreviews[idx]);
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== idx));
    if (lightboxIdx === idx) setLightboxIdx(null);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addPhotos(e.target.files);
    e.target.value = "";
  };

  // Drag-and-drop reorder
  const handleDragStart = (idx: number) => setDragIndex(idx);
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDropOnPhoto = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault();
    setIsDragging(false);
    if (dragIndex === null || dragIndex === targetIdx) {
      setDragIndex(null);
      return;
    }
    const newPhotos = [...photos];
    const newPreviews = [...photoPreviews];
    const [pFile] = newPhotos.splice(dragIndex, 1);
    const [pUrl] = newPreviews.splice(dragIndex, 1);
    newPhotos.splice(targetIdx, 0, pFile);
    newPreviews.splice(targetIdx, 0, pUrl);
    setPhotos(newPhotos);
    setPhotoPreviews(newPreviews);
    setDragIndex(null);
  };
  const handleDropOnUpload = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) addPhotos(e.dataTransfer.files);
  };

  // Tags
  const addTag = () => {
    const t = tagInput.trim();
    if (!t || tags.includes(t) || tags.length >= MAX_TAGS) return;
    setTags((prev) => [...prev, t]);
    setTagInput("");
  };

  // OCR
  const handleOcrClick = () => ocrFileRef.current?.click();
  const handleOcrFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const result = await extractFromImage(file);
    setOcrResult(result);
  };
  const handleAcceptOcr = () => {
    if (!ocrResult) return;
    if (ocrResult.title) setTitle(ocrResult.title.slice(0, 200));
    if (ocrResult.price) setPrice(ocrResult.price);
    if (ocrResult.description)
      setDescription(ocrResult.description.slice(0, 5000));
    if (ocrResult.category) setCategory(ocrResult.category);
    setOcrResult(null);
    toast.success("OCR fields applied to form!");
  };

  // Submit
  const handleSubmit = async () => {
    if (!canSubmit) return;
    const photoBytes = await Promise.all(photos.map(fileToUint8Array));
    mutation.mutate(
      {
        title: title.trim(),
        description: description.trim(),
        price: price.trim() || null,
        category: category.trim() || null,
        tags,
        photos: photoBytes,
      },
      {
        onSuccess: () => {
          toast.success("Master listing created!", {
            description:
              "Use Edit Draft to prepare platform-specific versions.",
          });
          resetForm();
          onClose();
        },
      },
    );
  };

  if (!isOpen) return null;

  const titleCounterClass =
    titleLen >= 200
      ? "text-destructive font-semibold"
      : titleLen >= 180
        ? "text-accent"
        : "text-muted-foreground";
  const descCounterClass =
    descLen >= 5000
      ? "text-destructive font-semibold"
      : descLen >= 4500
        ? "text-accent"
        : "text-muted-foreground";

  return (
    <>
      <div
        className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
        data-ocid="master_listing_form.dialog"
      >
        <dialog
          open
          className="bg-card border border-primary/30 rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl p-0"
          aria-labelledby="ml-dialog-title"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-card border-b border-primary/20 rounded-t-xl">
            <div className="flex items-center gap-3">
              <span className="text-2xl" aria-hidden="true">
                📋
              </span>
              <div>
                <h2
                  id="ml-dialog-title"
                  className="font-display text-base font-bold text-primary tracking-wide"
                >
                  Create Master Listing
                </h2>
                <p className="text-xs text-muted-foreground">
                  One source of truth — prepare platform drafts after
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* OCR button */}
              <button
                type="button"
                onClick={handleOcrClick}
                disabled={isOcrProcessing}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/10 border border-accent/40 text-accent hover:bg-accent/20 text-xs font-semibold font-display tracking-wide disabled:opacity-50 transition-colors"
                data-ocid="master_listing_form.ocr.scan_button"
              >
                {isOcrProcessing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    SCANNING…
                  </>
                ) : (
                  <>
                    <ScanLine className="w-3.5 h-3.5" />
                    SCAN WITH AI
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="p-2 rounded-lg hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close dialog"
                data-ocid="master_listing_form.close_button"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
            {/* OCR result */}
            {ocrResult && (
              <OcrPreview
                ocrResult={ocrResult}
                onAccept={handleAcceptOcr}
                onDismiss={() => setOcrResult(null)}
              />
            )}

            {/* OCR loading */}
            {isOcrProcessing && (
              <div
                className="p-3 rounded-lg bg-accent/8 border border-accent/30 flex items-center gap-3 text-sm text-accent"
                data-ocid="master_listing_form.ocr.loading_state"
              >
                <Brain className="w-4 h-4 animate-pulse" />
                <span>
                  Scanning image with Gemini OCR… This may take a moment.
                </span>
              </div>
            )}

            {/* Platform selector */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-foreground/80 uppercase tracking-widest block">
                Target Platform{" "}
                <span className="text-muted-foreground font-normal normal-case">
                  (optional — adds platform-specific fields)
                </span>
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPlatform(null)}
                  className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${selectedPlatform === null ? "bg-secondary/60 border border-border text-foreground" : "bg-secondary/30 border border-border/40 text-muted-foreground hover:border-border/70"}`}
                  data-ocid="master_listing_form.platform-none.button"
                >
                  None
                </button>
                {PLATFORMS.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setSelectedPlatform(p.value)}
                    className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors flex items-center gap-1.5 ${selectedPlatform === p.value ? "bg-primary/20 border border-primary/60 text-primary" : "bg-secondary/30 border border-border/40 text-muted-foreground hover:border-primary/40"}`}
                    data-ocid={`master_listing_form.platform-${p.value}.button`}
                  >
                    <span>{p.icon}</span>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="ml-title"
                  className="text-xs font-semibold text-foreground/80 uppercase tracking-widest"
                >
                  Title <span className="text-destructive">*</span>
                </label>
                <span className={`text-xs tabular-nums ${titleCounterClass}`}>
                  {titleLen}/200
                </span>
              </div>
              <input
                id="ml-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={200}
                placeholder="What are you selling?"
                className="w-full px-3 py-2.5 rounded-lg bg-background border border-input text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/60 transition-colors"
                data-ocid="master_listing_form.title.input"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="ml-desc"
                  className="text-xs font-semibold text-foreground/80 uppercase tracking-widest"
                >
                  Description <span className="text-destructive">*</span>
                </label>
                <span className={`text-xs tabular-nums ${descCounterClass}`}>
                  {descLen}/5000
                </span>
              </div>
              <textarea
                id="ml-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={5000}
                rows={4}
                placeholder="Describe your item in detail…"
                className="w-full px-3 py-2.5 rounded-lg bg-background border border-input text-foreground placeholder:text-muted-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/60 transition-colors"
                data-ocid="master_listing_form.description.textarea"
              />
            </div>

            {/* Price + Category */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label
                  htmlFor="ml-price"
                  className="text-xs font-semibold text-foreground/80 uppercase tracking-widest block"
                >
                  Price
                </label>
                <input
                  id="ml-price"
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="$0.00"
                  className="w-full px-3 py-2.5 rounded-lg bg-background border border-input text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/60 transition-colors"
                  data-ocid="master_listing_form.price.input"
                />
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="ml-category"
                  className="text-xs font-semibold text-foreground/80 uppercase tracking-widest block"
                >
                  Category
                </label>
                <input
                  id="ml-category"
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Electronics, Clothing…"
                  className="w-full px-3 py-2.5 rounded-lg bg-background border border-input text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/60 transition-colors"
                  data-ocid="master_listing_form.category.input"
                />
              </div>
            </div>

            {/* Platform-specific fields */}
            {selectedPlatform && (
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-1">
                <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
                  {PLATFORMS.find((p) => p.value === selectedPlatform)?.icon}{" "}
                  {PLATFORMS.find((p) => p.value === selectedPlatform)?.label}{" "}
                  Fields
                </p>
                {selectedPlatform === "facebook" && (
                  <FacebookFields
                    fields={fbFields}
                    onChange={(f) => setFbFields((prev) => ({ ...prev, ...f }))}
                  />
                )}
                {selectedPlatform === "mercari" && (
                  <MercariFields
                    fields={mcFields}
                    onChange={(f) => setMcFields((prev) => ({ ...prev, ...f }))}
                  />
                )}
                {selectedPlatform === "ebay" && (
                  <EbayFields
                    fields={ebFields}
                    onChange={(f) => setEbFields((prev) => ({ ...prev, ...f }))}
                  />
                )}
                {selectedPlatform === "poshmark" && (
                  <PoshmarkFields
                    fields={poFields}
                    onChange={(f) => setPoFields((prev) => ({ ...prev, ...f }))}
                  />
                )}
                {selectedPlatform === "depop" && (
                  <DepopFields
                    fields={dpFields}
                    onChange={(f) => setDpFields((prev) => ({ ...prev, ...f }))}
                  />
                )}
                {selectedPlatform === "etsy" && (
                  <EtsyFields
                    fields={etFields}
                    onChange={(f) => setEtFields((prev) => ({ ...prev, ...f }))}
                  />
                )}
              </div>
            )}

            {/* Photo gallery manager */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground/80 uppercase tracking-widest">
                  Photos <span className="text-destructive">*</span>
                </span>
                <span className="text-xs text-muted-foreground tabular-nums font-mono">
                  {photos.length}/{MAX_PHOTOS}
                </span>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {photoPreviews.map((url, idx) => (
                  <div
                    key={`photo-${idx}-${photos[idx]?.name ?? idx}`}
                    draggable
                    onDragStart={() => handleDragStart(idx)}
                    onDragOver={(e) => handleDragOver(e)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDropOnPhoto(e, idx)}
                    className={`relative aspect-square rounded-lg overflow-hidden bg-muted group cursor-grab active:cursor-grabbing border-2 transition-colors ${dragIndex === idx ? "border-primary/60 opacity-50" : "border-transparent"}`}
                    data-ocid={`master_listing_form.photo.item.${idx + 1}`}
                  >
                    <button
                      type="button"
                      className="w-full h-full block p-0 border-0 bg-transparent"
                      onClick={() => setLightboxIdx(idx)}
                      aria-label={`Preview photo ${idx + 1}`}
                    >
                      <img
                        src={url}
                        alt={`Listing item ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                    {/* Drag handle */}
                    <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <GripVertical className="w-3.5 h-3.5 text-foreground/80 drop-shadow" />
                    </div>
                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => removePhoto(idx)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-destructive/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label={`Remove photo ${idx + 1}`}
                      data-ocid={`master_listing_form.photo.delete_button.${idx + 1}`}
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                    {/* Primary badge */}
                    {idx === 0 && (
                      <div className="absolute bottom-1 left-1 px-1 py-0.5 bg-primary/80 rounded text-[9px] font-mono text-primary-foreground">
                        MAIN
                      </div>
                    )}
                  </div>
                ))}

                {photos.length < MAX_PHOTOS && (
                  <button
                    type="button"
                    onDrop={handleDropOnUpload}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Add photos"
                    className={`aspect-square rounded-lg border-2 border-dashed cursor-pointer flex flex-col items-center justify-center gap-1 transition-colors select-none ${
                      isDragging
                        ? "border-primary bg-primary/10"
                        : "border-border/50 hover:border-primary/50 hover:bg-primary/5"
                    }`}
                    data-ocid="master_listing_form.photo.upload_button"
                  >
                    <Upload
                      className="h-4 w-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <span className="text-[9px] text-muted-foreground text-center leading-tight px-1">
                      Add
                    </span>
                  </button>
                )}
              </div>

              <p className="text-xs text-muted-foreground/60">
                Drag thumbnails to reorder · Click to preview · First photo is
                main image
              </p>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
                aria-label="Upload photos"
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <Tag
                  className="h-3.5 w-3.5 text-foreground/80"
                  aria-hidden="true"
                />
                <label
                  htmlFor="ml-tag-input"
                  className="text-xs font-semibold text-foreground/80 uppercase tracking-widest"
                >
                  Tags
                </label>
                <span className="text-muted-foreground text-xs font-normal normal-case">
                  (search keywords)
                </span>
              </div>
              <div className="flex gap-2">
                <input
                  id="ml-tag-input"
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="Add a keyword…"
                  className="flex-1 px-3 py-2 rounded-lg bg-background border border-input text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/60 transition-colors"
                  data-ocid="master_listing_form.tag.input"
                />
                <button
                  type="button"
                  onClick={addTag}
                  disabled={!tagInput.trim() || tags.length >= MAX_TAGS}
                  className="px-3 py-2 rounded-lg bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Add tag"
                  data-ocid="master_listing_form.tag.add_button"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag, idx) => (
                    <span
                      key={`tag-${tag}`}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-medium"
                      data-ocid={`master_listing_form.tag.item.${idx + 1}`}
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() =>
                          setTags((prev) => prev.filter((_, i) => i !== idx))
                        }
                        className="hover:text-destructive transition-colors leading-none"
                        aria-label={`Remove tag ${tag}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex gap-3 p-3 rounded-lg bg-primary/[0.08] border border-primary/20 text-xs text-primary/80">
              <span className="text-base shrink-0" aria-hidden="true">
                💡
              </span>
              <p>
                After creating your listing, use{" "}
                <strong className="text-primary">Edit Draft</strong> to prepare
                platform-specific versions for each marketplace.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-card border-t border-border/30 px-6 py-4 rounded-b-xl flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2.5 rounded-lg bg-muted/60 hover:bg-muted text-foreground text-sm font-medium transition-colors"
              data-ocid="master_listing_form.cancel_button"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="flex-1 px-4 py-2.5 rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground text-sm font-semibold font-display tracking-wide transition-colors flex items-center justify-center gap-2"
              data-ocid="master_listing_form.submit_button"
            >
              {mutation.isPending ? (
                <>
                  <Loader2
                    className="h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                  Creating…
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Create Master Listing
                </>
              )}
            </button>
          </div>
        </dialog>
      </div>

      {/* OCR file input */}
      <input
        ref={ocrFileRef}
        type="file"
        accept="image/*"
        onChange={handleOcrFile}
        className="hidden"
        aria-label="Upload image for OCR scan"
      />

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4"
          data-ocid="master_listing_form.photo.lightbox"
        >
          <button
            type="button"
            className="absolute inset-0 w-full h-full"
            onClick={() => setLightboxIdx(null)}
            aria-label="Close lightbox"
          />
          <button
            type="button"
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-card/80 flex items-center justify-center text-foreground hover:bg-card transition-colors"
            onClick={() => setLightboxIdx(null)}
            aria-label="Close preview"
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={photoPreviews[lightboxIdx]}
            alt={`Preview ${lightboxIdx + 1}`}
            className="relative z-10 max-w-full max-h-[85vh] rounded-lg shadow-2xl object-contain pointer-events-none"
          />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 font-mono text-xs text-muted-foreground bg-card/60 rounded px-3 py-1">
            {lightboxIdx + 1} / {photoPreviews.length}
          </div>
        </div>
      )}
    </>
  );
}
