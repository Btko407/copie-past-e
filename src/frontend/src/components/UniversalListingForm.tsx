import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, CheckCircle2, Trash2, Upload, X, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { createActor } from "../backend";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UniversalListingFormProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  title: string;
  description: string;
  price: string;
  category: string;
  condition: string;
  brand: string;
  quantity: number;
  photos: File[];
  platforms: {
    facebook: boolean;
    mecari: boolean;
    ebay: boolean;
    poshmark: boolean;
    depop: boolean;
    etsy: boolean;
  };
  basePrice: string;
  priceMarkupPercent: string;
  platformPrices: Record<string, string>;
  scheduleType: "immediate" | "scheduled" | "batch";
  scheduledTime: string;
  batchSize: number;
  fbLocalPickup: boolean;
  fbShipping: boolean;
  mecariDeliveryDays: string;
  mecariShippingType: string;
}

type WizardStep =
  | "platforms"
  | "details"
  | "photos"
  | "pricing"
  | "schedule"
  | "review";

// ─── Constants ────────────────────────────────────────────────────────────────

const PLATFORMS = [
  { id: "facebook", emoji: "📘", label: "Facebook Marketplace" },
  { id: "mecari", emoji: "🏯", label: "Mercari" },
  { id: "ebay", emoji: "🔨", label: "eBay" },
  { id: "poshmark", emoji: "👜", label: "Poshmark" },
  { id: "depop", emoji: "🎨", label: "Depop" },
  { id: "etsy", emoji: "🛍️", label: "Etsy" },
] as const;

const PLATFORM_CAPABILITIES: Record<
  string,
  { maxPhotos: number; maxTitleLength: number; maxDescriptionLength: number }
> = {
  facebook: { maxPhotos: 10, maxTitleLength: 200, maxDescriptionLength: 5000 },
  mecari: { maxPhotos: 12, maxTitleLength: 80, maxDescriptionLength: 1000 },
  ebay: { maxPhotos: 12, maxTitleLength: 80, maxDescriptionLength: 4000 },
  poshmark: { maxPhotos: 11, maxTitleLength: 141, maxDescriptionLength: 2000 },
  depop: { maxPhotos: 12, maxTitleLength: 70, maxDescriptionLength: 500 },
  etsy: { maxPhotos: 10, maxTitleLength: 140, maxDescriptionLength: 10000 },
};

const STEP_ORDER: WizardStep[] = [
  "platforms",
  "details",
  "photos",
  "pricing",
  "schedule",
  "review",
];

const CONDITIONS = [
  { value: "new", label: "🆕 New" },
  { value: "likeNew", label: "✨ Like New" },
  { value: "good", label: "👍 Good" },
  { value: "fair", label: "👌 Fair" },
  { value: "poor", label: "🔧 Poor" },
];

const INITIAL_FORM: FormData = {
  title: "",
  description: "",
  price: "",
  category: "",
  condition: "good",
  brand: "",
  quantity: 1,
  photos: [],
  platforms: {
    facebook: true,
    mecari: false,
    ebay: false,
    poshmark: false,
    depop: false,
    etsy: false,
  },
  basePrice: "",
  priceMarkupPercent: "0",
  platformPrices: {},
  scheduleType: "immediate",
  scheduledTime: "",
  batchSize: 5,
  fbLocalPickup: true,
  fbShipping: false,
  mecariDeliveryDays: "3",
  mecariShippingType: "normal",
};

// ─── Shared style helpers ─────────────────────────────────────────────────────

const inputCls =
  "w-full px-3 py-2 bg-secondary/50 border border-border/60 rounded text-foreground text-sm focus:outline-none focus:border-primary/60 transition-colors";

const labelCls = "block text-xs font-semibold text-muted-foreground mb-1.5";

// ─── Component ────────────────────────────────────────────────────────────────

export function UniversalListingForm({
  isOpen,
  onClose,
}: UniversalListingFormProps) {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  const [step, setStep] = useState<WizardStep>("platforms");
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);

  const selectedPlatforms = (
    Object.entries(formData.platforms) as [
      keyof FormData["platforms"],
      boolean,
    ][]
  )
    .filter(([, enabled]) => enabled)
    .map(([id]) => id as string);

  // ── Validation ───────────────────────────────────────────────────────────
  const canProceed: Record<WizardStep, boolean> = {
    platforms: selectedPlatforms.length > 0,
    details:
      formData.title.trim().length > 0 &&
      formData.description.trim().length > 0,
    photos: formData.photos.length > 0,
    pricing: (formData.basePrice || formData.price).trim().length > 0,
    schedule: true,
    review: true,
  };

  // ── Helpers ──────────────────────────────────────────────────────────────
  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  function togglePlatform(id: string) {
    setFormData((prev) => ({
      ...prev,
      platforms: {
        ...prev.platforms,
        [id]: !prev.platforms[id as keyof FormData["platforms"]],
      },
    }));
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.currentTarget.files;
    if (!files) return;
    const maxPhotos = selectedPlatforms.reduce(
      (max, p) => Math.max(max, PLATFORM_CAPABILITIES[p]?.maxPhotos ?? 12),
      0,
    );
    const remaining = maxPhotos - formData.photos.length;
    const added = Array.from(files).slice(0, remaining);
    setFormData((prev) => ({ ...prev, photos: [...prev.photos, ...added] }));
    e.currentTarget.value = "";
  }

  function removePhoto(idx: number) {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== idx),
    }));
  }

  function resetForm() {
    setStep("platforms");
    setFormData(INITIAL_FORM);
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  const stepIndex = STEP_ORDER.indexOf(step);

  // ── Mutation ─────────────────────────────────────────────────────────────
  const mutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      if (selectedPlatforms.length === 0)
        throw new Error("Select at least one platform");

      const price = formData.basePrice || formData.price;
      const markupNum = Number.parseFloat(formData.priceMarkupPercent);
      const platformPricesEntries = Object.entries(
        formData.platformPrices,
      ).filter(([, v]) => v.trim().length > 0) as [string, string][];

      return await (
        actor as unknown as Record<
          string,
          (...args: unknown[]) => Promise<unknown>
        >
      ).createUniversalListing(
        formData.title,
        formData.description,
        price,
        formData.category ? [formData.category] : [],
        formData.condition,
        formData.brand ? [formData.brand] : [],
        formData.quantity,
        selectedPlatforms,
        {
          basePrice: price,
          priceMarkupPercent:
            !Number.isNaN(markupNum) && markupNum > 0 ? [markupNum] : [],
          platformPrices: platformPricesEntries,
          autoRepricing: false,
        },
        formData.scheduleType === "scheduled" && formData.scheduledTime
          ? [
              {
                type: { scheduled: null },
                scheduledTime: [
                  BigInt(
                    new Date(formData.scheduledTime).getTime() * 1_000_000,
                  ),
                ],
                batchSize: [],
              },
            ]
          : formData.scheduleType === "batch"
            ? [
                {
                  type: { batch: null },
                  scheduledTime: [],
                  batchSize: [formData.batchSize],
                },
              ]
            : [{ type: { immediate: null }, scheduledTime: [], batchSize: [] }],
        {
          facebook: selectedPlatforms.includes("facebook")
            ? [
                {
                  localPickup: formData.fbLocalPickup,
                  shipping: formData.fbShipping,
                },
              ]
            : [],
          mecari: selectedPlatforms.includes("mecari")
            ? [
                {
                  deliveryDays: BigInt(
                    Number.parseInt(formData.mecariDeliveryDays, 10) || 3,
                  ),
                  shippingType: formData.mecariShippingType,
                },
              ]
            : [],
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["universalListings"] });
      toast.success("🚀 Universal listing created!", {
        description: `Publishing to ${selectedPlatforms.length} platform${selectedPlatforms.length > 1 ? "s" : ""}`,
      });
      resetForm();
      onClose();
    },
    onError: (err) => {
      toast.error(
        `Failed: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    },
  });

  if (!isOpen) return null;

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      data-ocid="universal-listing.dialog"
    >
      <div className="bg-card border border-primary/30 rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-xl">
        {/* ── Header ── */}
        <div className="bg-gradient-to-r from-primary/20 to-accent/20 px-5 py-4 flex items-center justify-between border-b border-primary/20 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <Zap className="h-5 w-5 text-primary shrink-0" />
            <h2 className="text-base font-bold text-primary font-display truncate">
              Universal Cross-Listing
            </h2>
            <span className="text-xs text-muted-foreground shrink-0">
              {stepIndex + 1}/{STEP_ORDER.length}
            </span>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1 hover:bg-foreground/10 rounded transition-colors ml-2 shrink-0"
            aria-label="Close"
            data-ocid="universal-listing.close_button"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* ── Step progress bar ── */}
        <div className="flex gap-1 px-5 pt-3 shrink-0">
          {STEP_ORDER.map((s, i) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i <= stepIndex ? "bg-primary" : "bg-border/60"
              }`}
            />
          ))}
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* STEP 1 — Platform Selection */}
          {step === "platforms" && (
            <>
              <p className="text-sm text-muted-foreground">
                Choose platforms to list on — one form, multiple marketplaces.
              </p>
              <div
                className="grid grid-cols-2 sm:grid-cols-3 gap-3"
                data-ocid="universal-listing.platform.list"
              >
                {PLATFORMS.map((p) => {
                  const active =
                    formData.platforms[p.id as keyof FormData["platforms"]];
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => togglePlatform(p.id)}
                      data-ocid={`universal-listing.platform.${p.id}`}
                      className={`relative p-4 rounded-lg border-2 transition-all text-left ${
                        active
                          ? "border-primary bg-primary/10"
                          : "border-border/40 bg-secondary/20 hover:border-border/70"
                      }`}
                    >
                      <div className="text-2xl mb-1">{p.emoji}</div>
                      <div
                        className={`text-xs font-semibold ${active ? "text-primary" : "text-muted-foreground"}`}
                      >
                        {p.label}
                      </div>
                      {active && (
                        <CheckCircle2 className="absolute top-2 right-2 h-4 w-4 text-primary" />
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* STEP 2 — Item Details */}
          {step === "details" && (
            <>
              <div>
                <label htmlFor="ul-title" className={labelCls}>
                  Title *{" "}
                  <span className="font-normal opacity-60">
                    ({formData.title.length}/200)
                  </span>
                </label>
                <input
                  id="ul-title"
                  type="text"
                  placeholder="What are you selling?"
                  value={formData.title}
                  onChange={(e) => update("title", e.target.value)}
                  maxLength={200}
                  className={inputCls}
                  data-ocid="universal-listing.title.input"
                />
              </div>

              <div>
                <label htmlFor="ul-description" className={labelCls}>
                  Description *{" "}
                  <span className="font-normal opacity-60">
                    ({formData.description.length}/1000)
                  </span>
                </label>
                <textarea
                  id="ul-description"
                  placeholder="Describe your item in detail…"
                  value={formData.description}
                  onChange={(e) => update("description", e.target.value)}
                  maxLength={1000}
                  rows={4}
                  className={`${inputCls} resize-none`}
                  data-ocid="universal-listing.description.textarea"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="ul-price" className={labelCls}>
                    Price *
                  </label>
                  <input
                    id="ul-price"
                    type="text"
                    placeholder="$0.00"
                    value={formData.price}
                    onChange={(e) => update("price", e.target.value)}
                    className={inputCls}
                    data-ocid="universal-listing.price.input"
                  />
                </div>
                <div>
                  <label htmlFor="ul-quantity" className={labelCls}>
                    Quantity
                  </label>
                  <input
                    id="ul-quantity"
                    type="number"
                    min={1}
                    value={formData.quantity}
                    onChange={(e) =>
                      update(
                        "quantity",
                        Number.parseInt(e.target.value, 10) || 1,
                      )
                    }
                    className={inputCls}
                    data-ocid="universal-listing.quantity.input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="ul-category" className={labelCls}>
                    Category
                  </label>
                  <input
                    id="ul-category"
                    type="text"
                    placeholder="e.g. Clothing"
                    value={formData.category}
                    onChange={(e) => update("category", e.target.value)}
                    className={inputCls}
                    data-ocid="universal-listing.category.input"
                  />
                </div>
                <div>
                  <label htmlFor="ul-brand" className={labelCls}>
                    Brand
                  </label>
                  <input
                    id="ul-brand"
                    type="text"
                    placeholder="e.g. Nike"
                    value={formData.brand}
                    onChange={(e) => update("brand", e.target.value)}
                    className={inputCls}
                    data-ocid="universal-listing.brand.input"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="ul-condition" className={labelCls}>
                  Condition
                </label>
                <select
                  id="ul-condition"
                  value={formData.condition}
                  onChange={(e) => update("condition", e.target.value)}
                  className={inputCls}
                  data-ocid="universal-listing.condition.select"
                >
                  {CONDITIONS.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* STEP 3 — Photos */}
          {step === "photos" && (
            <>
              <h3 className="font-semibold text-foreground">
                📷 Photos{" "}
                <span className="text-sm text-muted-foreground font-normal">
                  ({formData.photos.length}/12)
                </span>
              </h3>

              <div
                className="grid grid-cols-3 sm:grid-cols-4 gap-2"
                data-ocid="universal-listing.photos.list"
              >
                {formData.photos.map((photo, idx) => (
                  <div
                    key={`photo-${photo.name}-${photo.lastModified}`}
                    className="relative aspect-square bg-muted rounded overflow-hidden group"
                    data-ocid={`universal-listing.photos.item.${idx + 1}`}
                  >
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Listing item ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(idx)}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      aria-label={`Remove item ${idx + 1}`}
                      data-ocid={`universal-listing.photos.delete_button.${idx + 1}`}
                    >
                      <Trash2 className="h-5 w-5 text-destructive-foreground" />
                    </button>
                  </div>
                ))}

                {formData.photos.length < 12 && (
                  <label
                    htmlFor="ul-photo-upload"
                    className="aspect-square bg-secondary/20 border-2 border-dashed border-border/40 rounded cursor-pointer flex flex-col items-center justify-center hover:border-primary/40 transition-colors group"
                    data-ocid="universal-listing.photos.upload_button"
                  >
                    <Upload className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-xs text-muted-foreground mt-1">
                      Add
                    </span>
                    <input
                      id="ul-photo-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <p className="text-xs text-muted-foreground">
                💡 Tip: Upload 6–12 high-quality files for best visibility
                across all platforms.
              </p>
            </>
          )}

          {/* STEP 4 — Pricing Strategy */}
          {step === "pricing" && (
            <div className="space-y-4 p-4 bg-accent/5 border border-accent/20 rounded-lg">
              <h3 className="font-semibold text-foreground">
                💰 Pricing Strategy
              </h3>

              <div>
                <label htmlFor="ul-base-price" className={labelCls}>
                  Base Price * (used for all platforms unless overridden)
                </label>
                <input
                  id="ul-base-price"
                  type="text"
                  placeholder={formData.price || "$0.00"}
                  value={formData.basePrice}
                  onChange={(e) => update("basePrice", e.target.value)}
                  className={inputCls}
                  data-ocid="universal-listing.base_price.input"
                />
              </div>

              <div>
                <label htmlFor="ul-markup" className={labelCls}>
                  Markup % (applies to all platforms)
                </label>
                <input
                  id="ul-markup"
                  type="number"
                  placeholder="0"
                  value={formData.priceMarkupPercent}
                  onChange={(e) => update("priceMarkupPercent", e.target.value)}
                  className={inputCls}
                  data-ocid="universal-listing.markup.input"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  💡 Example: Base $100 + 15% = $115 on all platforms
                </p>
              </div>

              {selectedPlatforms.length > 0 && (
                <div className="border-t border-border/40 pt-3 space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground">
                    Platform-specific prices (optional overrides):
                  </p>
                  {selectedPlatforms.map((pid) => {
                    const p = PLATFORMS.find((x) => x.id === pid);
                    const inputId = `ul-platform-price-${pid}`;
                    return (
                      <div key={pid}>
                        <label htmlFor={inputId} className={labelCls}>
                          {p?.emoji} {p?.label}
                        </label>
                        <input
                          id={inputId}
                          type="text"
                          placeholder="Leave blank to use base price"
                          value={formData.platformPrices[pid] ?? ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              platformPrices: {
                                ...prev.platformPrices,
                                [pid]: e.target.value,
                              },
                            }))
                          }
                          className={inputCls}
                          data-ocid={`universal-listing.platform_price.${pid}.input`}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* STEP 5 — Schedule */}
          {step === "schedule" && (
            <div className="space-y-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                When to Publish
              </h3>

              <div className="space-y-3">
                {(
                  [
                    { value: "immediate", label: "🚀 Publish Immediately" },
                    { value: "scheduled", label: "📅 Schedule for Later" },
                    { value: "batch", label: "📊 Batch Publishing" },
                  ] as const
                ).map((opt) => (
                  <div key={opt.value}>
                    <label
                      htmlFor={`ul-schedule-${opt.value}`}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        id={`ul-schedule-${opt.value}`}
                        type="radio"
                        checked={formData.scheduleType === opt.value}
                        onChange={() => update("scheduleType", opt.value)}
                        className="w-4 h-4 accent-primary"
                        data-ocid={`universal-listing.schedule.${opt.value}`}
                      />
                      <span className="text-sm text-foreground">
                        {opt.label}
                      </span>
                    </label>

                    {opt.value === "scheduled" &&
                      formData.scheduleType === "scheduled" && (
                        <div className="ml-6 mt-2">
                          <label
                            htmlFor="ul-scheduled-time"
                            className={labelCls}
                          >
                            Publish date &amp; time
                          </label>
                          <input
                            id="ul-scheduled-time"
                            type="datetime-local"
                            value={formData.scheduledTime}
                            onChange={(e) =>
                              update("scheduledTime", e.target.value)
                            }
                            className={`${inputCls} text-xs`}
                            data-ocid="universal-listing.scheduled_time.input"
                          />
                        </div>
                      )}

                    {opt.value === "batch" &&
                      formData.scheduleType === "batch" && (
                        <div className="ml-6 mt-2">
                          <label htmlFor="ul-batch-size" className={labelCls}>
                            Items per batch
                          </label>
                          <input
                            id="ul-batch-size"
                            type="number"
                            min={1}
                            max={20}
                            value={formData.batchSize}
                            onChange={(e) =>
                              update(
                                "batchSize",
                                Number.parseInt(e.target.value, 10) || 1,
                              )
                            }
                            className={`${inputCls} w-24`}
                            data-ocid="universal-listing.batch_size.input"
                          />
                        </div>
                      )}
                  </div>
                ))}
              </div>

              <p className="text-xs text-muted-foreground">
                💡 Batch publishing posts {formData.batchSize} items daily to
                avoid spam detection.
              </p>
            </div>
          )}

          {/* STEP 6 — Review */}
          {step === "review" && (
            <div className="space-y-4">
              <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg space-y-2">
                <p className="text-sm font-semibold text-primary">
                  📋 Review Before Publishing
                </p>
                <dl className="space-y-1 text-xs">
                  {(
                    [
                      ["Title", formData.title],
                      ["Price", formData.basePrice || formData.price],
                      [
                        "Condition",
                        CONDITIONS.find((c) => c.value === formData.condition)
                          ?.label ?? formData.condition,
                      ],
                      ["Quantity", String(formData.quantity)],
                      [
                        "Files",
                        `${formData.photos.length} file${formData.photos.length !== 1 ? "s" : ""}`,
                      ],
                      [
                        "Platforms",
                        selectedPlatforms
                          .map(
                            (pid) => PLATFORMS.find((p) => p.id === pid)?.emoji,
                          )
                          .join(" "),
                      ],
                      [
                        "Schedule",
                        formData.scheduleType === "immediate"
                          ? "Publish now"
                          : formData.scheduleType === "scheduled" &&
                              formData.scheduledTime
                            ? new Date(formData.scheduledTime).toLocaleString()
                            : `${formData.batchSize} items/day (batch)`,
                      ],
                    ] as [string, string][]
                  ).map(([key, val]) => (
                    <div key={key} className="flex gap-2">
                      <dt className="text-muted-foreground w-20 shrink-0">
                        {key}:
                      </dt>
                      <dd className="text-foreground break-words min-w-0">
                        {val}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div
                className="flex items-center gap-2 p-3 bg-card border border-border/40 rounded-lg text-xs text-muted-foreground"
                data-ocid="universal-listing.review.success_state"
              >
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                <span>
                  Ready to publish to{" "}
                  <span className="text-foreground font-semibold">
                    {selectedPlatforms.length} platform
                    {selectedPlatforms.length > 1 ? "s" : ""}
                  </span>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer / Navigation ── */}
        <div className="px-5 py-4 border-t border-border/40 flex gap-2 shrink-0">
          {step !== "platforms" ? (
            <button
              type="button"
              onClick={() => setStep(STEP_ORDER[stepIndex - 1])}
              className="flex-1 px-4 py-2 bg-secondary/50 hover:bg-secondary/70 rounded text-sm font-semibold transition-colors"
              data-ocid="universal-listing.back_button"
            >
              Back
            </button>
          ) : (
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 bg-secondary/50 hover:bg-secondary/70 rounded text-sm font-semibold transition-colors"
              data-ocid="universal-listing.cancel_button"
            >
              Cancel
            </button>
          )}

          {step !== "review" ? (
            <button
              type="button"
              onClick={() => setStep(STEP_ORDER[stepIndex + 1])}
              disabled={!canProceed[step]}
              className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed rounded text-sm font-semibold text-primary-foreground transition-colors"
              data-ocid="universal-listing.next_button"
            >
              {step === "platforms"
                ? `Next (${selectedPlatforms.length} selected)`
                : "Next"}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => mutation.mutate()}
              disabled={mutation.isPending}
              className="flex-1 px-4 py-2 bg-accent hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed rounded text-sm font-semibold text-accent-foreground flex items-center justify-center gap-2 transition-colors"
              data-ocid="universal-listing.submit_button"
            >
              {mutation.isPending ? (
                <span className="animate-pulse">Publishing…</span>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  Publish to {selectedPlatforms.length} Platform
                  {selectedPlatforms.length > 1 ? "s" : ""}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
