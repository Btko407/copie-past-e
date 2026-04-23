import { ItemCondition, Platform__1, createActor } from "@/backend";
import type { CreateListingArgs } from "@/backend.d.ts";
import { Button } from "@/components/ui/button";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ActorAny = any;

interface NewListingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type PlatformChoice = "facebook" | "mecari";
type Step = "platform" | "details";

interface FormData {
  title: string;
  description: string;
  price: string;
  category: string;
  // Facebook specific
  fbCondition: string;
  fbLocalPickup: boolean;
  fbShipping: boolean;
  // Mecari specific
  mecariBrand: string;
  mecariCondition: string;
  mecariDeliveryDays: string;
  mecariShippingType: string;
}

const DEFAULT_FORM: FormData = {
  title: "",
  description: "",
  price: "",
  category: "",
  fbCondition: "good",
  fbLocalPickup: true,
  fbShipping: false,
  mecariBrand: "",
  mecariCondition: "3",
  mecariDeliveryDays: "3",
  mecariShippingType: "normal",
};

const PLATFORM_CONFIG = {
  facebook: {
    label: "Facebook Marketplace",
    emoji: "📘",
    titleMax: 200,
    descMax: 5000,
    headingClass: "text-blue-300",
    sectionClass: "bg-blue-900/10 border-blue-500/20",
    borderActive: "border-blue-500/50",
    borderHover: "hover:border-blue-400",
    bgCard: "bg-blue-900/20",
  },
  mecari: {
    label: "Mercari",
    emoji: "🏯",
    titleMax: 80,
    descMax: 1000,
    headingClass: "text-pink-300",
    sectionClass: "bg-pink-900/10 border-pink-500/20",
    borderActive: "border-pink-500/50",
    borderHover: "hover:border-pink-400",
    bgCard: "bg-pink-900/20",
  },
} as const;

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

const INPUT_CLASS =
  "w-full px-3 py-2 bg-secondary/50 border border-border/60 rounded text-foreground text-sm focus:border-primary/60 focus:outline-none transition-smooth font-mono placeholder:text-muted-foreground/60";

const SELECT_CLASS =
  "w-full px-3 py-2 bg-secondary/50 border border-border/60 rounded text-foreground text-sm focus:border-primary/60 focus:outline-none transition-smooth";

export function NewListingModal({ isOpen, onClose }: NewListingModalProps) {
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

      const args: CreateListingArgs = {
        title: form.title.trim(),
        description: form.description.trim(),
        price: form.price.trim() || undefined,
        sourceUrl: undefined,
        category: form.category.trim() || undefined,
        tierLevel: undefined,
        platform:
          platform === "facebook" ? Platform__1.facebook : Platform__1.mecari,
        // Facebook-specific
        fbCondition:
          platform === "facebook"
            ? mapFbCondition(form.fbCondition)
            : undefined,
        fbLocalPickup: platform === "facebook" ? form.fbLocalPickup : undefined,
        fbShipping: platform === "facebook" ? form.fbShipping : undefined,
        // Mecari-specific
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
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      const cfg = PLATFORM_CONFIG[platform!];
      toast.success(`✅ ${cfg.emoji} ${cfg.label} listing created!`);
      resetForm();
      onClose();
    },
    onError: (err) =>
      toast.error(
        err instanceof Error ? err.message : "Failed to create listing",
      ),
  });

  const canSubmit =
    !!actor &&
    !isFetching &&
    form.title.trim().length > 0 &&
    (platform === "facebook" ||
      (platform === "mecari" && form.mecariBrand.trim().length > 0));

  if (!isOpen) return null;

  const cfg = platform ? PLATFORM_CONFIG[platform] : null;
  const titleMax = cfg?.titleMax ?? 200;
  const descMax = cfg?.descMax ?? 5000;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      role="presentation"
      data-ocid="new-listing-modal-backdrop"
    >
      <div
        className="w-full max-w-md rounded-xl border border-primary/30 bg-card overflow-hidden max-h-[90vh] overflow-y-auto"
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
              <div className="space-y-3">
                {(["facebook", "mecari"] as const).map((p) => {
                  const pc = PLATFORM_CONFIG[p];
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        setPlatform(p);
                        setStep("details");
                      }}
                      className={`w-full p-4 ${pc.bgCard} border-2 ${pc.borderActive} ${pc.borderHover} rounded-lg text-left transition-smooth group hover:scale-[1.01]`}
                      data-ocid={`new-listing-modal.platform.${p}.button`}
                    >
                      <div
                        className={`text-base font-bold font-display ${pc.headingClass}`}
                      >
                        {pc.emoji} {pc.label}
                      </div>
                      <div className="text-xs text-muted-foreground font-mono mt-1">
                        {p === "facebook"
                          ? "List items for local sale & pickup"
                          : "Sell items online, nationwide shipping"}
                      </div>
                      <div className="text-[10px] text-muted-foreground/60 font-mono mt-1.5">
                        Required:{" "}
                        {p === "facebook"
                          ? "Title, Description"
                          : "Title, Brand, Condition"}
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
              {/* Platform header with Change button */}
              {cfg && (
                <div className="flex items-center gap-2 pb-4 border-b border-border/40">
                  <span className="text-xl">{cfg.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
                      Listing for
                    </p>
                    <p
                      className={`font-bold text-sm font-display ${cfg.headingClass}`}
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
                    Change
                  </button>
                </div>
              )}

              {/* Title */}
              <div>
                <label
                  htmlFor="nlm-title"
                  className="text-xs font-semibold text-muted-foreground font-mono mb-1.5 block"
                >
                  Title *
                </label>
                <input
                  id="nlm-title"
                  type="text"
                  placeholder="Item title"
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  maxLength={titleMax}
                  className={INPUT_CLASS}
                  data-ocid="new-listing-modal.title.input"
                />
                <div className="text-[10px] text-muted-foreground/60 font-mono mt-1 text-right">
                  {form.title.length}/{titleMax}
                </div>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="nlm-desc"
                  className="text-xs font-semibold text-muted-foreground font-mono mb-1.5 block"
                >
                  Description
                </label>
                <textarea
                  id="nlm-desc"
                  placeholder="Item description..."
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  maxLength={descMax}
                  rows={3}
                  className={`${INPUT_CLASS} resize-none`}
                  data-ocid="new-listing-modal.description.textarea"
                />
                <div className="text-[10px] text-muted-foreground/60 font-mono mt-1 text-right">
                  {form.description.length}/{descMax}
                </div>
              </div>

              {/* Price + Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="nlm-price"
                    className="text-xs font-semibold text-muted-foreground font-mono mb-1.5 block"
                  >
                    Price
                  </label>
                  <input
                    id="nlm-price"
                    type="text"
                    placeholder="$0.00"
                    value={form.price}
                    onChange={(e) => set("price", e.target.value)}
                    className={INPUT_CLASS}
                    data-ocid="new-listing-modal.price.input"
                  />
                </div>
                <div>
                  <label
                    htmlFor="nlm-category"
                    className="text-xs font-semibold text-muted-foreground font-mono mb-1.5 block"
                  >
                    Category
                  </label>
                  <input
                    id="nlm-category"
                    type="text"
                    placeholder="Category"
                    value={form.category}
                    onChange={(e) => set("category", e.target.value)}
                    className={INPUT_CLASS}
                    data-ocid="new-listing-modal.category.input"
                  />
                </div>
              </div>

              {/* ── Facebook-specific ── */}
              {platform === "facebook" && (
                <div
                  className={`space-y-3 p-3 border rounded-lg ${PLATFORM_CONFIG.facebook.sectionClass}`}
                  data-ocid="new-listing-modal.facebook_section"
                >
                  <p className="text-xs font-semibold font-display text-blue-300 tracking-wide">
                    📘 Facebook Marketplace Options
                  </p>

                  <div>
                    <label
                      htmlFor="nlm-fb-condition"
                      className="text-xs font-semibold text-muted-foreground font-mono mb-1.5 block"
                    >
                      Condition
                    </label>
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
                  className={`space-y-3 p-3 border rounded-lg ${PLATFORM_CONFIG.mecari.sectionClass}`}
                  data-ocid="new-listing-modal.mecari_section"
                >
                  <p className="text-xs font-semibold font-display text-pink-300 tracking-wide">
                    🏯 Mercari Options
                  </p>

                  <div>
                    <label
                      htmlFor="nlm-mecari-brand"
                      className="text-xs font-semibold text-muted-foreground font-mono mb-1.5 block"
                    >
                      Brand <span className="text-destructive">* Required</span>
                    </label>
                    <input
                      id="nlm-mecari-brand"
                      type="text"
                      placeholder="Brand name"
                      value={form.mecariBrand}
                      onChange={(e) => set("mecariBrand", e.target.value)}
                      className={`${INPUT_CLASS} ${
                        !form.mecariBrand.trim() ? "border-destructive/40" : ""
                      }`}
                      data-ocid="new-listing-modal.mecari_brand.input"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="nlm-mecari-condition"
                      className="text-xs font-semibold text-muted-foreground font-mono mb-1.5 block"
                    >
                      Condition (1–5 scale)
                    </label>
                    <select
                      id="nlm-mecari-condition"
                      value={form.mecariCondition}
                      onChange={(e) => set("mecariCondition", e.target.value)}
                      className={SELECT_CLASS}
                      data-ocid="new-listing-modal.mecari_condition.select"
                    >
                      <option value="1">1️⃣ New</option>
                      <option value="2">2️⃣ Like New</option>
                      <option value="3">3️⃣ Good</option>
                      <option value="4">4️⃣ Fair</option>
                      <option value="5">5️⃣ Poor</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="nlm-mecari-delivery"
                      className="text-xs font-semibold text-muted-foreground font-mono mb-1.5 block"
                    >
                      Delivery Days (1–7)
                    </label>
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

                  <div>
                    <label
                      htmlFor="nlm-mecari-shipping"
                      className="text-xs font-semibold text-muted-foreground font-mono mb-1.5 block"
                    >
                      Shipping Type
                    </label>
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
                  Back
                </Button>
                <Button
                  className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 font-display font-bold text-xs gap-1.5 glow-yellow-sm"
                  onClick={() => createMutation.mutate()}
                  disabled={!canSubmit || createMutation.isPending}
                  data-ocid="new-listing-modal.submit_button"
                >
                  {createMutation.isPending ? (
                    "Creating…"
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
