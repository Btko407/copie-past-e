import {
  ItemCondition,
  Platform__1,
  Platform__2,
  createActor,
} from "@/backend";
import type { CreateListingArgs } from "@/backend.d.ts";
import { Button } from "@/components/ui/button";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Listing } from "../backend";
import { ListingStatus } from "../backend";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ActorAny = any;

interface NewListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Called immediately when user clicks Save — before backend responds */
  onOptimisticAdd?: (listing: Listing) => void;
  /** Called on backend error with the optimistic listing id to remove it */
  onOptimisticRollback?: (tempId: bigint) => void;
}

type PlatformChoice =
  | "facebook"
  | "mecari"
  | "ebay"
  | "poshmark"
  | "depop"
  | "etsy";
type Step = "platform" | "details";

interface FormData {
  title: string;
  description: string;
  price: string;
  // Facebook
  fbCondition: string;
  fbLocalPickup: boolean;
  fbShipping: boolean;
  fbLocation: string;
  // Mecari
  mecariBrand: string;
  mecariCondition: string;
  mecariDeliveryDays: string;
  mecariShippingType: string;
  // eBay
  ebayCategory: string;
  ebayItemCondition: string;
  ebayBrand: string;
  ebayShippingOption: string;
  // Poshmark
  poshmarkBrand: string;
  poshmarkSize: string;
  poshmarkCategory: string;
  // Depop
  depopBrand: string;
  depopCondition: string;
  depopCategory: string;
  // Etsy
  etsyMaterials: string;
  etsyTags: string;
  etsyCategory: string;
}

const DEFAULT_FORM: FormData = {
  title: "",
  description: "",
  price: "",
  fbCondition: "good",
  fbLocalPickup: true,
  fbShipping: false,
  fbLocation: "",
  mecariBrand: "",
  mecariCondition: "3",
  mecariDeliveryDays: "3",
  mecariShippingType: "normal",
  ebayCategory: "",
  ebayItemCondition: "New",
  ebayBrand: "",
  ebayShippingOption: "free",
  poshmarkBrand: "",
  poshmarkSize: "",
  poshmarkCategory: "",
  depopBrand: "",
  depopCondition: "Good",
  depopCategory: "",
  etsyMaterials: "",
  etsyTags: "",
  etsyCategory: "",
};

interface PlatformMeta {
  label: string;
  emoji: string;
  color: string;
  titleMax: number;
  descMax: number;
  tagline: string;
  requiredNote: string;
  headingColor: string;
  sectionBg: string;
  sectionBorder: string;
  cardBg: string;
}

const PLATFORM_CONFIG: Record<PlatformChoice, PlatformMeta> = {
  facebook: {
    label: "Facebook Marketplace",
    emoji: "📘",
    color: "#1877F2",
    titleMax: 200,
    descMax: 5000,
    tagline: "List items for local sale & pickup",
    requiredNote: "Title, Description",
    headingColor: "text-blue-300",
    sectionBg: "bg-blue-950/20",
    sectionBorder: "border-blue-500/25",
    cardBg: "bg-blue-900/20",
  },
  mecari: {
    label: "Mercari",
    emoji: "🏯",
    color: "#fb3f4c",
    titleMax: 80,
    descMax: 1000,
    tagline: "Sell items online, nationwide shipping",
    requiredNote: "Title, Brand, Condition",
    headingColor: "text-pink-300",
    sectionBg: "bg-pink-950/20",
    sectionBorder: "border-pink-500/25",
    cardBg: "bg-pink-900/20",
  },
  ebay: {
    label: "eBay",
    emoji: "🔨",
    color: "#e53238",
    titleMax: 80,
    descMax: 500,
    tagline: "Auction or fixed-price global sales",
    requiredNote: "Title, Category, Condition",
    headingColor: "text-red-300",
    sectionBg: "bg-red-950/20",
    sectionBorder: "border-red-500/25",
    cardBg: "bg-red-900/20",
  },
  poshmark: {
    label: "Poshmark",
    emoji: "👗",
    color: "#961e1e",
    titleMax: 141,
    descMax: 1500,
    tagline: "Fashion resale for clothing & accessories",
    requiredNote: "Title, Brand, Size",
    headingColor: "text-rose-300",
    sectionBg: "bg-rose-950/20",
    sectionBorder: "border-rose-500/25",
    cardBg: "bg-rose-900/20",
  },
  depop: {
    label: "Depop",
    emoji: "🎨",
    color: "#ff5000",
    titleMax: 70,
    descMax: 1000,
    tagline: "Vintage, streetwear & unique fashion",
    requiredNote: "Title, Condition",
    headingColor: "text-orange-300",
    sectionBg: "bg-orange-950/20",
    sectionBorder: "border-orange-500/25",
    cardBg: "bg-orange-900/20",
  },
  etsy: {
    label: "Etsy",
    emoji: "🛍️",
    color: "#f1641e",
    titleMax: 140,
    descMax: 5000,
    tagline: "Handmade, vintage & craft marketplace",
    requiredNote: "Title, Category, Tags",
    headingColor: "text-amber-300",
    sectionBg: "bg-amber-950/20",
    sectionBorder: "border-amber-500/25",
    cardBg: "bg-amber-900/20",
  },
};

const PLATFORMS = Object.keys(PLATFORM_CONFIG) as PlatformChoice[];

// ─── Optimistic helpers ───────────────────────────────────────────────────────

let tempIdCounter = -1n;
function nextTempId(): bigint {
  const id = tempIdCounter;
  tempIdCounter -= 1n;
  return id;
}

function buildOptimisticListing(
  tempId: bigint,
  form: FormData,
  platform: PlatformChoice,
): Listing {
  return {
    id: tempId,
    status: ListingStatus.active,
    tierLevel: 1n,
    title: form.title,
    description: form.description,
    price: form.price.trim() || undefined,
    platform: undefined, // platform variant not needed for display
    favorited: false,
    pinned: false,
    archivedManually: false,
    userId: null as unknown as Listing["userId"],
    createdAt: BigInt(Date.now()) * 1_000_000n,
    expirationDate: BigInt(Date.now() + 30 * 24 * 60 * 60 * 1000) * 1_000_000n,
    mecariBrand:
      platform === "mecari" ? form.mecariBrand.trim() || undefined : undefined,
  };
}

function mapFbCondition(val: string): ItemCondition {
  const map: Record<string, ItemCondition> = {
    new: ItemCondition.new_,
    likeNew: ItemCondition.likeNew,
    good: ItemCondition.good,
    fair: ItemCondition.fair,
    poor: ItemCondition.poor,
  };
  return map[val] ?? ItemCondition.good;
}

function mapMecariCondition(val: string): ItemCondition {
  const map: Record<string, ItemCondition> = {
    "1": ItemCondition.new_,
    "2": ItemCondition.likeNew,
    "3": ItemCondition.good,
    "4": ItemCondition.fair,
    "5": ItemCondition.poor,
  };
  return map[val] ?? ItemCondition.good;
}

function mapEbayCondition(val: string): ItemCondition {
  const map: Record<string, ItemCondition> = {
    New: ItemCondition.new_,
    Used: ItemCondition.good,
    "For parts or not working": ItemCondition.poor,
  };
  return map[val] ?? ItemCondition.good;
}

function mapDepopCondition(val: string): ItemCondition {
  const map: Record<string, ItemCondition> = {
    New: ItemCondition.new_,
    "Like New": ItemCondition.likeNew,
    Good: ItemCondition.good,
    Fair: ItemCondition.fair,
  };
  return map[val] ?? ItemCondition.good;
}

const INPUT_CLASS =
  "w-full px-3 py-2 bg-secondary/50 border border-border/60 rounded text-foreground text-sm focus:border-primary/60 focus:outline-none transition-smooth font-mono placeholder:text-muted-foreground/60";

const SELECT_CLASS =
  "w-full px-3 py-2 bg-secondary/50 border border-border/60 rounded text-foreground text-sm focus:border-primary/60 focus:outline-none transition-smooth";

function CharCounter({
  current,
  max,
}: {
  current: number;
  max: number;
}) {
  const ratio = current / max;
  const nearLimit = ratio > 0.85;
  return (
    <div
      className={`text-[10px] font-mono mt-1 text-right ${
        nearLimit ? "text-destructive" : "text-muted-foreground/60"
      }`}
    >
      {current}/{max}
    </div>
  );
}

function FieldLabel({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-xs font-semibold text-muted-foreground font-mono mb-1.5 block"
    >
      {children}{" "}
      {required && <span className="text-destructive">* Required</span>}
    </label>
  );
}

export function NewListingModal({
  isOpen,
  onClose,
  onOptimisticAdd,
  onOptimisticRollback,
}: NewListingModalProps) {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();

  const [step, setStep] = useState<Step>("platform");
  const [platform, setPlatform] = useState<PlatformChoice | null>(null);
  const [form, setForm] = useState<FormData>(DEFAULT_FORM);

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function resetForm() {
    setStep("platform");
    setPlatform(null);
    setForm(DEFAULT_FORM);
  }

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!actor || !platform) throw new Error("Platform not selected");

      const isFbMecari = platform === "facebook" || platform === "mecari";

      if (isFbMecari) {
        const args: CreateListingArgs = {
          title: form.title.trim(),
          description: form.description.trim(),
          price: form.price.trim() || undefined,
          sourceUrl: undefined,
          category: undefined,
          tierLevel: undefined,
          platform:
            platform === "facebook" ? Platform__1.facebook : Platform__1.mecari,
          fbCondition:
            platform === "facebook"
              ? mapFbCondition(form.fbCondition)
              : undefined,
          fbLocalPickup:
            platform === "facebook" ? form.fbLocalPickup : undefined,
          fbShipping: platform === "facebook" ? form.fbShipping : undefined,
          mecariBrand:
            platform === "mecari"
              ? form.mecariBrand.trim() || undefined
              : undefined,
          mecariCondition:
            platform === "mecari"
              ? mapMecariCondition(form.mecariCondition)
              : undefined,
          mecariDeliveryDays:
            platform === "mecari"
              ? BigInt(Number.parseInt(form.mecariDeliveryDays, 10))
              : undefined,
          mecariShippingType:
            platform === "mecari" ? form.mecariShippingType : undefined,
        };
        return (actor as ActorAny).createListing(args);
      }

      // New platforms use the universal listing API via ActorAny
      const universalPayload: Record<string, unknown> = {
        title: form.title.trim(),
        description: form.description.trim(),
        price: form.price.trim() || undefined,
        platform: Platform__2[platform as keyof typeof Platform__2],
      };

      if (platform === "ebay") {
        universalPayload.category = form.ebayCategory.trim() || undefined;
        universalPayload.condition = mapEbayCondition(form.ebayItemCondition);
        universalPayload.brand = form.ebayBrand.trim() || undefined;
        universalPayload.shippingOption = form.ebayShippingOption;
      } else if (platform === "poshmark") {
        universalPayload.brand = form.poshmarkBrand.trim() || undefined;
        universalPayload.size = form.poshmarkSize.trim() || undefined;
        universalPayload.category = form.poshmarkCategory.trim() || undefined;
      } else if (platform === "depop") {
        universalPayload.brand = form.depopBrand.trim() || undefined;
        universalPayload.condition = mapDepopCondition(form.depopCondition);
        universalPayload.category = form.depopCategory.trim() || undefined;
      } else if (platform === "etsy") {
        universalPayload.materials = form.etsyMaterials.trim() || undefined;
        universalPayload.tags = form.etsyTags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
          .slice(0, 13);
        universalPayload.category = form.etsyCategory.trim() || undefined;
      }

      return (actor as ActorAny).createListing(universalPayload);
    },
    onMutate: () => {
      // ─── OPTIMISTIC UPDATE ────────────────────────────────────────────────
      if (!platform) return { tempId: null };
      const tempId = nextTempId();
      const optimistic = buildOptimisticListing(tempId, form, platform);
      onOptimisticAdd?.(optimistic);
      // Close + reset immediately for snappy UX
      resetForm();
      onClose();
      return { tempId };
    },
    onSuccess: (_, __, context) => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      const cfg = PLATFORM_CONFIG[platform ?? "facebook"];
      toast.success(`✅ ${cfg.emoji} ${cfg.label} listing created!`);
      void context;
    },
    onError: (err, _, context) => {
      if (context?.tempId !== null && context?.tempId !== undefined) {
        onOptimisticRollback?.(context.tempId);
      }
      toast.error(
        err instanceof Error ? err.message : "Failed to create listing",
      );
    },
  });

  const canSubmit = (() => {
    if (!actor || isFetching) return false;
    if (form.title.trim().length === 0) return false;
    if (platform === "mecari" && !form.mecariBrand.trim()) return false;
    if (platform === "poshmark" && !form.poshmarkBrand.trim()) return false;
    return true;
  })();

  if (!isOpen) return null;

  const cfg = platform ? PLATFORM_CONFIG[platform] : null;
  const titleMax = cfg?.titleMax ?? 200;
  const descMax = cfg?.descMax ?? 5000;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      role="presentation"
      data-ocid="new-listing-modal-backdrop"
    >
      <div
        className="w-full max-w-lg rounded-xl border border-primary/30 bg-card overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        data-ocid="new-listing-modal"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/20 to-accent/20 px-5 py-4 flex items-center justify-between border-b border-primary/20 sticky top-0 bg-card z-10">
          <h2 className="font-display text-sm font-bold tracking-wider text-primary uppercase text-glow-blue">
            + New Listing
          </h2>
          <button
            type="button"
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="p-1 hover:bg-secondary/60 rounded transition-smooth"
            aria-label="Close"
            data-ocid="new-listing-modal.close_button"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        <div className="p-5">
          {step === "platform" ? (
            /* ── Step 1: Platform selection ── */
            <div
              className="space-y-4"
              data-ocid="new-listing-modal.platform_step"
            >
              <p className="text-xs text-muted-foreground font-mono">
                Choose which platform you want to list on:
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {PLATFORMS.map((p) => {
                  const pc = PLATFORM_CONFIG[p];
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        setPlatform(p);
                        setStep("details");
                      }}
                      className={`p-3 ${pc.cardBg} border-2 ${pc.sectionBorder} rounded-lg text-left transition-smooth hover:scale-[1.02] hover:border-opacity-80`}
                      style={{
                        ["--tw-ring-color" as string]: pc.color,
                      }}
                      data-ocid={`new-listing-modal.platform.${p}.button`}
                    >
                      <div
                        className={`text-sm font-bold font-display ${pc.headingColor}`}
                      >
                        {pc.emoji} {pc.label}
                      </div>
                      <div className="text-[10px] text-muted-foreground font-mono mt-1 leading-tight">
                        {pc.tagline}
                      </div>
                      <div className="text-[9px] text-muted-foreground/50 font-mono mt-1.5 flex items-center gap-1">
                        <span
                          className="px-1 py-0.5 rounded"
                          style={{
                            background: `${pc.color}22`,
                            color: pc.color,
                          }}
                        >
                          {pc.titleMax} char title
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* ── Step 2: Listing details ── */
            <div
              className="space-y-4"
              data-ocid="new-listing-modal.details_step"
            >
              {/* Platform header */}
              {cfg && (
                <div className="flex items-center gap-2 pb-4 border-b border-border/40">
                  <span className="text-xl">{cfg.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
                      Listing for
                    </p>
                    <p
                      className={`font-bold text-sm font-display ${cfg.headingColor}`}
                    >
                      {cfg.label}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep("platform")}
                    className="text-xs px-2.5 py-1 bg-secondary/50 hover:bg-secondary/80 rounded text-muted-foreground font-mono transition-smooth"
                    data-ocid="new-listing-modal.change_platform.button"
                  >
                    ← Change
                  </button>
                </div>
              )}

              {/* Title */}
              <div>
                <FieldLabel htmlFor="nlm-title">Title</FieldLabel>
                <input
                  id="nlm-title"
                  type="text"
                  placeholder="Item title"
                  value={form.title}
                  onChange={(e) =>
                    set("title", e.target.value.slice(0, titleMax))
                  }
                  maxLength={titleMax}
                  className={INPUT_CLASS}
                  data-ocid="new-listing-modal.title.input"
                />
                <CharCounter current={form.title.length} max={titleMax} />
              </div>

              {/* Description */}
              <div>
                <FieldLabel htmlFor="nlm-desc">Description</FieldLabel>
                <textarea
                  id="nlm-desc"
                  placeholder="Item description..."
                  value={form.description}
                  onChange={(e) =>
                    set("description", e.target.value.slice(0, descMax))
                  }
                  maxLength={descMax}
                  rows={3}
                  className={`${INPUT_CLASS} resize-none`}
                  data-ocid="new-listing-modal.description.textarea"
                />
                <CharCounter current={form.description.length} max={descMax} />
              </div>

              {/* Price */}
              <div>
                <FieldLabel htmlFor="nlm-price">Price</FieldLabel>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-sm">
                    $
                  </span>
                  <input
                    id="nlm-price"
                    type="text"
                    placeholder="0.00"
                    value={form.price}
                    onChange={(e) => set("price", e.target.value)}
                    className={`${INPUT_CLASS} pl-7`}
                    data-ocid="new-listing-modal.price.input"
                  />
                </div>
              </div>

              {/* ── Facebook-specific ── */}
              {platform === "facebook" && (
                <div
                  className={`space-y-3 p-3 border rounded-lg ${cfg?.sectionBg} ${cfg?.sectionBorder}`}
                  data-ocid="new-listing-modal.facebook_section"
                >
                  <p
                    className={`text-xs font-semibold font-display tracking-wide ${cfg?.headingColor}`}
                  >
                    📘 Facebook Marketplace Options
                  </p>
                  <div>
                    <FieldLabel htmlFor="nlm-fb-condition">
                      Condition
                    </FieldLabel>
                    <select
                      id="nlm-fb-condition"
                      value={form.fbCondition}
                      onChange={(e) => set("fbCondition", e.target.value)}
                      className={SELECT_CLASS}
                      data-ocid="new-listing-modal.fb_condition.select"
                    >
                      <option value="new">🆕 New</option>
                      <option value="likeNew">✨ Like New</option>
                      <option value="good">👍 Good</option>
                      <option value="fair">👌 Fair</option>
                      <option value="poor">🔧 Poor</option>
                    </select>
                  </div>
                  <div>
                    <FieldLabel htmlFor="nlm-fb-location">Location</FieldLabel>
                    <input
                      id="nlm-fb-location"
                      type="text"
                      placeholder="City, State"
                      value={form.fbLocation}
                      onChange={(e) => set("fbLocation", e.target.value)}
                      className={INPUT_CLASS}
                      data-ocid="new-listing-modal.fb_location.input"
                    />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={form.fbLocalPickup}
                      onChange={(e) => set("fbLocalPickup", e.target.checked)}
                      className="w-4 h-4 rounded border border-border/60 accent-primary"
                      data-ocid="new-listing-modal.fb_local_pickup.checkbox"
                    />
                    <span className="text-sm text-foreground font-mono">
                      Local Pickup Available
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={form.fbShipping}
                      onChange={(e) => set("fbShipping", e.target.checked)}
                      className="w-4 h-4 rounded border border-border/60 accent-primary"
                      data-ocid="new-listing-modal.fb_shipping.checkbox"
                    />
                    <span className="text-sm text-foreground font-mono">
                      Seller Ships
                    </span>
                  </label>
                </div>
              )}

              {/* ── Mecari-specific ── */}
              {platform === "mecari" && (
                <div
                  className={`space-y-3 p-3 border rounded-lg ${cfg?.sectionBg} ${cfg?.sectionBorder}`}
                  data-ocid="new-listing-modal.mecari_section"
                >
                  <p
                    className={`text-xs font-semibold font-display tracking-wide ${cfg?.headingColor}`}
                  >
                    🏯 Mercari Options
                  </p>
                  <div>
                    <FieldLabel htmlFor="nlm-mecari-brand" required>
                      Brand
                    </FieldLabel>
                    <input
                      id="nlm-mecari-brand"
                      type="text"
                      placeholder="Brand name"
                      value={form.mecariBrand}
                      onChange={(e) => set("mecariBrand", e.target.value)}
                      className={`${INPUT_CLASS} ${!form.mecariBrand.trim() ? "border-destructive/40" : ""}`}
                      data-ocid="new-listing-modal.mecari_brand.input"
                    />
                  </div>
                  <div>
                    <FieldLabel htmlFor="nlm-mecari-condition">
                      Condition (1–5 scale)
                    </FieldLabel>
                    <select
                      id="nlm-mecari-condition"
                      value={form.mecariCondition}
                      onChange={(e) => set("mecariCondition", e.target.value)}
                      className={SELECT_CLASS}
                      data-ocid="new-listing-modal.mecari_condition.select"
                    >
                      <option value="1">1 — New</option>
                      <option value="2">2 — Like New</option>
                      <option value="3">3 — Good</option>
                      <option value="4">4 — Fair</option>
                      <option value="5">5 — Poor</option>
                    </select>
                  </div>
                  <div>
                    <FieldLabel htmlFor="nlm-mecari-shipping">
                      Shipping Type
                    </FieldLabel>
                    <select
                      id="nlm-mecari-shipping"
                      value={form.mecariShippingType}
                      onChange={(e) =>
                        set("mecariShippingType", e.target.value)
                      }
                      className={SELECT_CLASS}
                      data-ocid="new-listing-modal.mecari_shipping.select"
                    >
                      <option value="normal">📦 Normal (2–4 days)</option>
                      <option value="fast">🚀 Fast (1–2 days)</option>
                      <option value="same-day">⚡ Same Day</option>
                    </select>
                  </div>
                  <div>
                    <FieldLabel htmlFor="nlm-mecari-delivery">
                      Delivery Days
                    </FieldLabel>
                    <select
                      id="nlm-mecari-delivery"
                      value={form.mecariDeliveryDays}
                      onChange={(e) =>
                        set("mecariDeliveryDays", e.target.value)
                      }
                      className={SELECT_CLASS}
                      data-ocid="new-listing-modal.mecari_delivery.select"
                    >
                      {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                        <option key={d} value={String(d)}>
                          {d} day{d > 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* ── eBay-specific ── */}
              {platform === "ebay" && (
                <div
                  className={`space-y-3 p-3 border rounded-lg ${cfg?.sectionBg} ${cfg?.sectionBorder}`}
                  data-ocid="new-listing-modal.ebay_section"
                >
                  <p
                    className={`text-xs font-semibold font-display tracking-wide ${cfg?.headingColor}`}
                  >
                    🔨 eBay Options
                  </p>
                  <div>
                    <FieldLabel htmlFor="nlm-ebay-category">
                      Category
                    </FieldLabel>
                    <input
                      id="nlm-ebay-category"
                      type="text"
                      placeholder="e.g. Electronics, Clothing"
                      value={form.ebayCategory}
                      onChange={(e) => set("ebayCategory", e.target.value)}
                      className={INPUT_CLASS}
                      data-ocid="new-listing-modal.ebay_category.input"
                    />
                  </div>
                  <div>
                    <FieldLabel htmlFor="nlm-ebay-condition">
                      Item Condition
                    </FieldLabel>
                    <select
                      id="nlm-ebay-condition"
                      value={form.ebayItemCondition}
                      onChange={(e) => set("ebayItemCondition", e.target.value)}
                      className={SELECT_CLASS}
                      data-ocid="new-listing-modal.ebay_condition.select"
                    >
                      <option value="New">🆕 New</option>
                      <option value="Used">🔄 Used</option>
                      <option value="For parts or not working">
                        🔧 For parts or not working
                      </option>
                    </select>
                  </div>
                  <div>
                    <FieldLabel htmlFor="nlm-ebay-brand">Brand</FieldLabel>
                    <input
                      id="nlm-ebay-brand"
                      type="text"
                      placeholder="Brand name"
                      value={form.ebayBrand}
                      onChange={(e) => set("ebayBrand", e.target.value)}
                      className={INPUT_CLASS}
                      data-ocid="new-listing-modal.ebay_brand.input"
                    />
                  </div>
                  <div>
                    <FieldLabel htmlFor="nlm-ebay-shipping">
                      Shipping Option
                    </FieldLabel>
                    <select
                      id="nlm-ebay-shipping"
                      value={form.ebayShippingOption}
                      onChange={(e) =>
                        set("ebayShippingOption", e.target.value)
                      }
                      className={SELECT_CLASS}
                      data-ocid="new-listing-modal.ebay_shipping.select"
                    >
                      <option value="free">🆓 Free Shipping</option>
                      <option value="calculated">📐 Calculated Shipping</option>
                      <option value="local">📍 Local Pickup Only</option>
                    </select>
                  </div>
                </div>
              )}

              {/* ── Poshmark-specific ── */}
              {platform === "poshmark" && (
                <div
                  className={`space-y-3 p-3 border rounded-lg ${cfg?.sectionBg} ${cfg?.sectionBorder}`}
                  data-ocid="new-listing-modal.poshmark_section"
                >
                  <p
                    className={`text-xs font-semibold font-display tracking-wide ${cfg?.headingColor}`}
                  >
                    👗 Poshmark Options
                  </p>
                  <div>
                    <FieldLabel htmlFor="nlm-poshmark-brand" required>
                      Brand
                    </FieldLabel>
                    <input
                      id="nlm-poshmark-brand"
                      type="text"
                      placeholder="e.g. Nike, Levi's, Zara"
                      value={form.poshmarkBrand}
                      onChange={(e) => set("poshmarkBrand", e.target.value)}
                      className={`${INPUT_CLASS} ${!form.poshmarkBrand.trim() ? "border-destructive/40" : ""}`}
                      data-ocid="new-listing-modal.poshmark_brand.input"
                    />
                  </div>
                  <div>
                    <FieldLabel htmlFor="nlm-poshmark-size">Size</FieldLabel>
                    <input
                      id="nlm-poshmark-size"
                      type="text"
                      placeholder="e.g. M, 8, One Size, 32x30"
                      value={form.poshmarkSize}
                      onChange={(e) => set("poshmarkSize", e.target.value)}
                      className={INPUT_CLASS}
                      data-ocid="new-listing-modal.poshmark_size.input"
                    />
                  </div>
                  <div>
                    <FieldLabel htmlFor="nlm-poshmark-category">
                      Category
                    </FieldLabel>
                    <input
                      id="nlm-poshmark-category"
                      type="text"
                      placeholder="e.g. Women's Tops, Men's Shoes"
                      value={form.poshmarkCategory}
                      onChange={(e) => set("poshmarkCategory", e.target.value)}
                      className={INPUT_CLASS}
                      data-ocid="new-listing-modal.poshmark_category.input"
                    />
                  </div>
                </div>
              )}

              {/* ── Depop-specific ── */}
              {platform === "depop" && (
                <div
                  className={`space-y-3 p-3 border rounded-lg ${cfg?.sectionBg} ${cfg?.sectionBorder}`}
                  data-ocid="new-listing-modal.depop_section"
                >
                  <p
                    className={`text-xs font-semibold font-display tracking-wide ${cfg?.headingColor}`}
                  >
                    🎨 Depop Options
                  </p>
                  <div>
                    <FieldLabel htmlFor="nlm-depop-brand">Brand</FieldLabel>
                    <input
                      id="nlm-depop-brand"
                      type="text"
                      placeholder="Brand name"
                      value={form.depopBrand}
                      onChange={(e) => set("depopBrand", e.target.value)}
                      className={INPUT_CLASS}
                      data-ocid="new-listing-modal.depop_brand.input"
                    />
                  </div>
                  <div>
                    <FieldLabel htmlFor="nlm-depop-condition">
                      Condition
                    </FieldLabel>
                    <select
                      id="nlm-depop-condition"
                      value={form.depopCondition}
                      onChange={(e) => set("depopCondition", e.target.value)}
                      className={SELECT_CLASS}
                      data-ocid="new-listing-modal.depop_condition.select"
                    >
                      <option value="New">🆕 New</option>
                      <option value="Like New">✨ Like New</option>
                      <option value="Good">👍 Good</option>
                      <option value="Fair">👌 Fair</option>
                    </select>
                  </div>
                  <div>
                    <FieldLabel htmlFor="nlm-depop-category">
                      Category
                    </FieldLabel>
                    <input
                      id="nlm-depop-category"
                      type="text"
                      placeholder="e.g. Tops, Shoes, Accessories"
                      value={form.depopCategory}
                      onChange={(e) => set("depopCategory", e.target.value)}
                      className={INPUT_CLASS}
                      data-ocid="new-listing-modal.depop_category.input"
                    />
                  </div>
                </div>
              )}

              {/* ── Etsy-specific ── */}
              {platform === "etsy" && (
                <div
                  className={`space-y-3 p-3 border rounded-lg ${cfg?.sectionBg} ${cfg?.sectionBorder}`}
                  data-ocid="new-listing-modal.etsy_section"
                >
                  <p
                    className={`text-xs font-semibold font-display tracking-wide ${cfg?.headingColor}`}
                  >
                    🛍️ Etsy Options
                  </p>
                  <div>
                    <FieldLabel htmlFor="nlm-etsy-category">
                      Category
                    </FieldLabel>
                    <input
                      id="nlm-etsy-category"
                      type="text"
                      placeholder="e.g. Clothing, Home Décor, Jewelry"
                      value={form.etsyCategory}
                      onChange={(e) => set("etsyCategory", e.target.value)}
                      className={INPUT_CLASS}
                      data-ocid="new-listing-modal.etsy_category.input"
                    />
                  </div>
                  <div>
                    <FieldLabel htmlFor="nlm-etsy-materials">
                      Materials
                    </FieldLabel>
                    <input
                      id="nlm-etsy-materials"
                      type="text"
                      placeholder="e.g. Cotton, Polyester, Silver"
                      value={form.etsyMaterials}
                      onChange={(e) => set("etsyMaterials", e.target.value)}
                      className={INPUT_CLASS}
                      data-ocid="new-listing-modal.etsy_materials.input"
                    />
                  </div>
                  <div>
                    <FieldLabel htmlFor="nlm-etsy-tags">Tags</FieldLabel>
                    <input
                      id="nlm-etsy-tags"
                      type="text"
                      placeholder="vintage, handmade, gift (max 13, comma-separated)"
                      value={form.etsyTags}
                      onChange={(e) => set("etsyTags", e.target.value)}
                      className={INPUT_CLASS}
                      data-ocid="new-listing-modal.etsy_tags.input"
                    />
                    <div className="text-[10px] text-muted-foreground/50 font-mono mt-1">
                      {
                        form.etsyTags
                          .split(",")
                          .map((t) => t.trim())
                          .filter(Boolean).length
                      }{" "}
                      / 13 tags
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-border/40">
                <Button
                  variant="outline"
                  className="flex-1 font-mono text-xs border-border/60 hover:bg-secondary/60"
                  onClick={() => setStep("platform")}
                  disabled={createMutation.isPending}
                  data-ocid="new-listing-modal.back.button"
                >
                  ← Back
                </Button>
                <Button
                  className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 font-display font-bold text-xs gap-1.5"
                  onClick={() => createMutation.mutate()}
                  disabled={!canSubmit || createMutation.isPending}
                  data-ocid="new-listing-modal.submit_button"
                >
                  {createMutation.isPending ? (
                    <span
                      className="flex items-center gap-1.5"
                      data-ocid="new-listing-modal.loading_state"
                    >
                      <span className="animate-spin inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full" />
                      Creating…
                    </span>
                  ) : (
                    <>
                      <Plus className="h-3.5 w-3.5" />
                      Create Listing
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
