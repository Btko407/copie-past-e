import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Upload, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface NewListingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Platform = "facebook" | "mecari" | "ocr";
type Step = "platform" | "photos" | "details";

interface FormData {
  title: string;
  description: string;
  price: string;
  category: string;
  fbCondition: string;
  fbLocalPickup: boolean;
  fbShipping: boolean;
  mecariBrand: string;
  mecariCondition: string;
  mecariDeliveryDays: string;
  mecariShippingType: string;
  photos: File[];
}

export function NewListingModal({ isOpen, onClose }: NewListingModalProps) {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const actorReady = !!actor && !actorFetching;
  const queryClient = useQueryClient();
  const [step, setStep] = useState<Step>("platform");
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [formData, setFormData] = useState<FormData>({
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
    photos: [],
  });

  const createListingMutation = useMutation({
    mutationFn: async () => {
      if (!actorReady || !actor || !platform || platform === "ocr")
        throw new Error("Invalid platform");
      const platformObj =
        platform === "facebook" ? { facebook: null } : { mecari: null };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fbConditionMap: Record<string, any> = {
        new: { new: null },
        likeNew: { likeNew: null },
        good: { good: null },
        fair: { fair: null },
        poor: { poor: null },
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mecariConditionMap: Record<string, any> = {
        "1": { new: null },
        "2": { likeNew: null },
        "3": { good: null },
        "4": { fair: null },
        "5": { poor: null },
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return await (actor as any).createListing({
        title: formData.title,
        description: formData.description,
        price: formData.price || null,
        sourceUrl: null,
        category: formData.category || null,
        tierLevel: null,
        platform: platformObj,
        fbCondition:
          platform === "facebook" ? fbConditionMap[formData.fbCondition] : null,
        fbLocalPickup: platform === "facebook" ? formData.fbLocalPickup : null,
        fbShipping: platform === "facebook" ? formData.fbShipping : null,
        mecariBrand: platform === "mecari" ? formData.mecariBrand : null,
        mecariCondition:
          platform === "mecari"
            ? mecariConditionMap[formData.mecariCondition]
            : null,
        mecariDeliveryDays:
          platform === "mecari"
            ? Number.parseInt(formData.mecariDeliveryDays)
            : null,
        mecariShippingType:
          platform === "mecari" ? formData.mecariShippingType : null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      toast.success(
        `✅ ${platform === "facebook" ? "📘 Facebook" : "🏯 Mecari"} listing created!`,
      );
      resetForm();
      onClose();
    },
    onError: (error) => {
      toast.error(
        `Failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    },
  });

  const resetForm = () => {
    setStep("platform");
    setPlatform(null);
    setFormData({
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
      photos: [],
    });
  };

  const handleInputChange = (
    key: keyof FormData,
    value: string | boolean | File[],
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files) {
      const newPhotos = Array.from(files).slice(0, 12 - formData.photos.length);
      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, ...newPhotos],
      }));
    }
  };

  const removePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const canSubmit =
    formData.title.trim() &&
    (platform === "facebook" ||
      (platform === "mecari" && formData.mecariBrand.trim()));

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      data-ocid="new-listing.dialog"
    >
      <div className="bg-card border border-primary/30 rounded-lg max-w-2xl w-full overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/20 to-accent/20 p-4 flex items-center justify-between border-b border-primary/20 sticky top-0 bg-card z-10">
          <h2 className="text-lg font-bold text-primary">+ New Listing</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded transition-smooth"
            data-ocid="new-listing.close_button"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {step === "platform" ? (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                Choose which platform you want to list on:
              </p>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    setPlatform("facebook");
                    setStep("photos");
                  }}
                  className="w-full p-4 bg-blue-900/20 border-2 border-blue-500/50 hover:border-blue-400 rounded-lg text-left transition-smooth group"
                  data-ocid="new-listing.platform.facebook.button"
                >
                  <div className="text-lg font-bold text-blue-300 group-hover:text-blue-200">
                    📘 Facebook Marketplace
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    List items for local sale
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPlatform("mecari");
                    setStep("photos");
                  }}
                  className="w-full p-4 bg-pink-900/20 border-2 border-pink-500/50 hover:border-pink-400 rounded-lg text-left transition-smooth group"
                  data-ocid="new-listing.platform.mecari.button"
                >
                  <div className="text-lg font-bold text-pink-300 group-hover:text-pink-200">
                    🏯 Mercari
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    Sell items online worldwide
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPlatform("ocr");
                    toast.info("Smart OCR coming soon");
                  }}
                  className="w-full p-4 bg-purple-900/20 border-2 border-purple-500/30 hover:border-purple-400 rounded-lg text-left transition-smooth group opacity-50 cursor-not-allowed"
                  data-ocid="new-listing.platform.ocr.button"
                >
                  <div className="text-lg font-bold text-purple-300 group-hover:text-purple-200">
                    🤖 Smart OCR (Coming Soon)
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    AI-powered extraction from photos
                  </div>
                </button>
              </div>
            </>
          ) : step === "photos" ? (
            <>
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">
                  📷 Add Photos ({formData.photos.length}/12)
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {formData.photos.map((photo, idx) => (
                    <div
                      key={`${photo.name}-${photo.size}-${photo.lastModified}`}
                      className="relative aspect-square bg-gray-700 rounded overflow-hidden group"
                      data-ocid={`new-listing.photo.item.${idx + 1}`}
                    >
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Listing item ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(idx)}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        data-ocid={`new-listing.photo.item.${idx + 1}.delete_button`}
                      >
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </button>
                    </div>
                  ))}
                  {formData.photos.length < 12 && (
                    <label
                      className="aspect-square bg-secondary/30 border-2 border-dashed border-border/40 hover:border-border/60 rounded cursor-pointer flex items-center justify-center transition-smooth group"
                      data-ocid="new-listing.photo.upload_button"
                    >
                      <div className="text-center">
                        <Upload className="h-5 w-5 mx-auto text-muted-foreground group-hover:text-foreground transition-colors" />
                        <p className="text-xs text-muted-foreground mt-1">
                          Add
                        </p>
                      </div>
                      <input
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
                  {platform === "facebook"
                    ? "Add up to 12 photos (JPG, PNG)"
                    : "Add up to 12 photos. Mecari requires at least 1 photo"}
                </p>
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setStep("platform")}
                  className="flex-1 px-4 py-2 bg-secondary/50 hover:bg-secondary/70 rounded text-sm font-semibold text-foreground transition-smooth"
                  data-ocid="new-listing.photos.back_button"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep("details")}
                  className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 rounded text-sm font-semibold text-white transition-smooth"
                  data-ocid="new-listing.photos.next_button"
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Platform Header */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/40">
                <div>
                  <p className="text-xs text-muted-foreground">Listing for</p>
                  <p className="font-bold text-foreground">
                    {platform === "facebook"
                      ? "📘 Facebook Marketplace"
                      : "🏯 Mercari"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep("photos")}
                  className="text-xs px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-gray-300 transition-smooth"
                  data-ocid="new-listing.details.back_button"
                >
                  ← Back
                </button>
              </div>

              {/* Common Fields */}
              <div>
                <label
                  htmlFor="nl-title"
                  className="text-xs font-semibold text-gray-300 mb-2 block"
                >
                  Title * {formData.title.length}/
                  {platform === "facebook" ? 200 : 80}
                </label>
                <input
                  id="nl-title"
                  type="text"
                  placeholder="What are you selling?"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  maxLength={platform === "facebook" ? 200 : 80}
                  className="w-full px-3 py-2 bg-secondary/50 border border-red-500/40 rounded text-foreground text-sm focus:border-primary/60 focus:outline-none transition-smooth"
                  data-ocid="new-listing.title.input"
                />
              </div>

              <div>
                <label
                  htmlFor="nl-description"
                  className="text-xs font-semibold text-gray-300 mb-2 block"
                >
                  Description {formData.description.length}/
                  {platform === "facebook" ? 5000 : 1000}
                </label>
                <textarea
                  id="nl-description"
                  placeholder="Describe your item (5+ words)"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  maxLength={platform === "facebook" ? 5000 : 1000}
                  className="w-full px-3 py-2 bg-secondary/50 border border-border/60 rounded text-foreground text-sm focus:border-primary/60 focus:outline-none transition-smooth resize-none"
                  rows={3}
                  data-ocid="new-listing.description.textarea"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="nl-price"
                    className="text-xs font-semibold text-gray-300 mb-2 block"
                  >
                    Price
                  </label>
                  <input
                    id="nl-price"
                    type="text"
                    placeholder="$0.00"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    className="w-full px-3 py-2 bg-secondary/50 border border-border/60 rounded text-foreground text-sm focus:border-primary/60 focus:outline-none transition-smooth"
                    data-ocid="new-listing.price.input"
                  />
                </div>
                <div>
                  <label
                    htmlFor="nl-category"
                    className="text-xs font-semibold text-gray-300 mb-2 block"
                  >
                    Category
                  </label>
                  <input
                    id="nl-category"
                    type="text"
                    placeholder="Category"
                    value={formData.category}
                    onChange={(e) =>
                      handleInputChange("category", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-secondary/50 border border-border/60 rounded text-foreground text-sm focus:border-primary/60 focus:outline-none transition-smooth"
                    data-ocid="new-listing.category.input"
                  />
                </div>
              </div>

              {/* Facebook-Specific */}
              {platform === "facebook" && (
                <div className="space-y-3 p-3 bg-blue-900/10 border border-blue-500/20 rounded-lg">
                  <p className="text-xs font-semibold text-blue-300">
                    📘 Facebook Marketplace
                  </p>
                  <div>
                    <label
                      htmlFor="nl-fb-condition"
                      className="text-xs font-semibold text-gray-300 mb-2 block"
                    >
                      Condition
                    </label>
                    <select
                      id="nl-fb-condition"
                      value={formData.fbCondition}
                      onChange={(e) =>
                        handleInputChange("fbCondition", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-secondary/50 border border-border/60 rounded text-foreground text-sm focus:border-primary/60 focus:outline-none transition-smooth"
                      data-ocid="new-listing.fb-condition.select"
                    >
                      <option value="new">
                        🆕 New - New with tags (NWT), Unopened packaging, Unused
                      </option>
                      <option value="likeNew">
                        ✨ Like New - New without tags (NWOT), No signs of wear,
                        Unused
                      </option>
                      <option value="good">
                        👍 Good - Gently used, One / two minor flaws, Functional
                      </option>
                      <option value="fair">
                        👌 Fair - Used, functional, multiple minor flaws /
                        defects
                      </option>
                      <option value="poor">
                        🔧 Poor - Major flaws, may be damaged, for parts
                      </option>
                    </select>
                  </div>
                  <label
                    htmlFor="nl-fb-local-pickup"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      id="nl-fb-local-pickup"
                      type="checkbox"
                      checked={formData.fbLocalPickup}
                      onChange={(e) =>
                        handleInputChange("fbLocalPickup", e.target.checked)
                      }
                      className="w-4 h-4 rounded"
                      data-ocid="new-listing.fb-local-pickup.checkbox"
                    />
                    <span className="text-sm text-gray-300">
                      Local Pickup Available
                    </span>
                  </label>
                  <label
                    htmlFor="nl-fb-shipping"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      id="nl-fb-shipping"
                      type="checkbox"
                      checked={formData.fbShipping}
                      onChange={(e) =>
                        handleInputChange("fbShipping", e.target.checked)
                      }
                      className="w-4 h-4 rounded"
                      data-ocid="new-listing.fb-shipping.checkbox"
                    />
                    <span className="text-sm text-gray-300">Seller Ships</span>
                  </label>
                </div>
              )}

              {/* Mecari-Specific */}
              {platform === "mecari" && (
                <div className="space-y-3 p-3 bg-pink-900/10 border border-pink-500/20 rounded-lg">
                  <p className="text-xs font-semibold text-pink-300">
                    🏯 Mercari
                  </p>
                  <div>
                    <label
                      htmlFor="nl-mecari-brand"
                      className="text-xs font-semibold text-gray-300 mb-2 block"
                    >
                      Brand * (Required)
                    </label>
                    <input
                      id="nl-mecari-brand"
                      type="text"
                      placeholder="Select brand"
                      value={formData.mecariBrand}
                      onChange={(e) =>
                        handleInputChange("mecariBrand", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-secondary/50 border border-red-500/40 rounded text-foreground text-sm focus:border-primary/60 focus:outline-none transition-smooth"
                      data-ocid="new-listing.mecari-brand.input"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-300 mb-2">
                      Condition * (1-5 scale)
                    </p>
                    <div className="grid grid-cols-5 gap-2">
                      {[
                        { val: "1", label: "New", desc: "New with tags (NWT)" },
                        {
                          val: "2",
                          label: "Like New",
                          desc: "New without tags (NWOT)",
                        },
                        {
                          val: "3",
                          label: "Good",
                          desc: "Gently used, One / two minor flaws, Functional",
                        },
                        {
                          val: "4",
                          label: "Fair",
                          desc: "Used, functional, multiple flaws / defects",
                        },
                        {
                          val: "5",
                          label: "Poor",
                          desc: "Major flaws, may be damaged, for parts",
                        },
                      ].map(({ val, label, desc }) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() =>
                            handleInputChange("mecariCondition", val)
                          }
                          className={`p-2 rounded text-xs font-semibold transition-all ${
                            formData.mecariCondition === val
                              ? "bg-pink-600 text-white border-2 border-pink-400"
                              : "bg-secondary/50 text-gray-300 border border-border/40 hover:border-border/60"
                          }`}
                          title={desc}
                          data-ocid={`new-listing.mecari-condition.item.${val}`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="nl-mecari-delivery"
                      className="text-xs font-semibold text-gray-300 mb-2 block"
                    >
                      Delivery Days * (1-7)
                    </label>
                    <select
                      id="nl-mecari-delivery"
                      value={formData.mecariDeliveryDays}
                      onChange={(e) =>
                        handleInputChange("mecariDeliveryDays", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-secondary/50 border border-border/60 rounded text-foreground text-sm focus:border-primary/60 focus:outline-none transition-smooth"
                      data-ocid="new-listing.mecari-delivery-days.select"
                    >
                      {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                        <option key={d} value={d}>
                          {d} day{d > 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="nl-mecari-shipping"
                      className="text-xs font-semibold text-gray-300 mb-2 block"
                    >
                      Shipping Type
                    </label>
                    <select
                      id="nl-mecari-shipping"
                      value={formData.mecariShippingType}
                      onChange={(e) =>
                        handleInputChange("mecariShippingType", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-secondary/50 border border-border/60 rounded text-foreground text-sm focus:border-primary/60 focus:outline-none transition-smooth"
                      data-ocid="new-listing.mecari-shipping-type.select"
                    >
                      <option value="normal">📦 Normal (2-4 days)</option>
                      <option value="fast">🚀 Fast (1-2 days)</option>
                      <option value="same-day">⚡ Same Day</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Submit */}
              <div className="flex gap-2 pt-4 border-t border-border/40">
                <button
                  type="button"
                  onClick={() => setStep("photos")}
                  className="flex-1 px-4 py-2 bg-secondary/50 hover:bg-secondary/70 rounded text-sm font-semibold text-foreground transition-smooth"
                  data-ocid="new-listing.details.back_button"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => createListingMutation.mutate()}
                  disabled={!canSubmit || createListingMutation.isPending}
                  className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 disabled:bg-gray-600 rounded text-sm font-semibold text-white transition-smooth flex items-center justify-center gap-2"
                  data-ocid="new-listing.submit_button"
                >
                  {createListingMutation.isPending ? (
                    "Creating..."
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      List
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
