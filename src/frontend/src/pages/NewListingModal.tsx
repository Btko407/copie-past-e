import { createActor } from "@/backend";
import type { CreateListingArgs, Platform__1 } from "@/backend.d.ts";
import { Button } from "@/components/ui/button";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, X } from "lucide-react";
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

const PLATFORM_CONFIG: Record<
  PlatformChoice,
  {
    label: string;
    emoji: string;
    color: string;
    borderActive: string;
    borderHover: string;
    badge: string;
  }
> = {
  facebook: {
    label: "Facebook Marketplace",
    emoji: "📘",
    color: "text-blue-300",
    borderActive: "border-blue-500",
    borderHover: "hover:border-blue-400",
    badge: "bg-blue-900/30 border-blue-500/60",
  },
  mecari: {
    label: "Mercari",
    emoji: "🏯",
    color: "text-pink-300",
    borderActive: "border-pink-500",
    borderHover: "hover:border-pink-400",
    badge: "bg-pink-900/30 border-pink-500/60",
  },
};

function toPlatformVariant(platform: PlatformChoice): Platform__1 {
  // Platform__1 enum: facebook = "facebook", mecari = "mecari"
  return platform === "facebook"
    ? ("facebook" as Platform__1)
    : ("mecari" as Platform__1);
}

export function NewListingModal({ isOpen, onClose }: NewListingModalProps) {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();

  const [step, setStep] = useState<Step>("platform");
  const [selectedPlatform, setSelectedPlatform] =
    useState<PlatformChoice | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");

  function resetForm() {
    setStep("platform");
    setSelectedPlatform(null);
    setTitle("");
    setDescription("");
    setPrice("");
    setCategory("");
  }

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!actor || !selectedPlatform) throw new Error("Platform not selected");
      const args: CreateListingArgs = {
        title: title.trim(),
        description: description.trim(),
        price: price.trim() || undefined,
        sourceUrl: undefined,
        category: category.trim() || undefined,
        tierLevel: undefined,
        platform: toPlatformVariant(selectedPlatform),
        fbCondition: undefined,
        fbLocalPickup: undefined,
        fbShipping: undefined,
        mecariBrand: undefined,
        mecariCondition: undefined,
        mecariDeliveryDays: undefined,
        mecariShippingType: undefined,
      };
      return (actor as ActorAny).createListing(args);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      toast.success("✅ Listing created", {
        description: `New ${selectedPlatform === "facebook" ? "Facebook Marketplace" : "Mercari"} listing added to your archive`,
      });
      resetForm();
      onClose();
    },
    onError: (err) =>
      toast.error(
        err instanceof Error ? err.message : "Failed to create listing",
      ),
  });

  if (!isOpen) return null;

  const canCreate = !!actor && !isFetching && title.trim().length > 0;
  const cfg = selectedPlatform ? PLATFORM_CONFIG[selectedPlatform] : null;

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
        className="w-full max-w-md rounded-xl border border-blue-500/50 bg-gray-900 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        data-ocid="new-listing-modal"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-600 px-5 py-4 flex items-center justify-between">
          <h2 className="font-display text-sm font-bold tracking-wider text-white uppercase">
            Create New Listing
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded transition-colors"
            aria-label="Close"
            data-ocid="new-listing-modal.close_button"
          >
            <X className="h-4 w-4 text-white" />
          </button>
        </div>

        <div className="p-5">
          {step === "platform" ? (
            /* ── Step 1: Platform selection ── */
            <div
              className="space-y-4"
              data-ocid="new-listing-modal.platform_step"
            >
              <p className="text-sm text-gray-400">
                Select the platform you want to list on:
              </p>
              <div className="space-y-3">
                {(["facebook", "mecari"] as const).map((platform) => {
                  const p = PLATFORM_CONFIG[platform];
                  return (
                    <button
                      key={platform}
                      type="button"
                      onClick={() => {
                        setSelectedPlatform(platform);
                        setStep("details");
                      }}
                      className={`w-full p-4 rounded-lg border-2 ${p.badge} ${p.borderActive} ${p.borderHover} text-left transition-all duration-200 hover:scale-[1.01]`}
                      data-ocid={`new-listing-modal.platform.${platform}.button`}
                    >
                      <div
                        className={`text-base font-bold ${p.color} font-display`}
                      >
                        {p.emoji} {p.label}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5 font-mono">
                        {platform === "facebook"
                          ? "List items for local sale & pickup"
                          : "Sell items online, nationwide shipping"}
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
                <div className="flex items-center gap-2 pb-4 border-b border-gray-700">
                  <span className="text-xl">{cfg.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">
                      Listing for
                    </p>
                    <p
                      className={`font-bold text-sm font-display ${cfg.color}`}
                    >
                      {cfg.label}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep("platform")}
                    className="text-xs px-2.5 py-1 bg-gray-700 hover:bg-gray-600 rounded text-gray-300 font-mono transition-colors"
                    data-ocid="new-listing-modal.change_platform.button"
                  >
                    Change
                  </button>
                </div>
              )}

              <input
                type="text"
                placeholder="Item title *"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-600 font-mono"
                data-ocid="new-listing-modal.title.input"
              />

              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-600 font-mono resize-none"
                data-ocid="new-listing-modal.description.textarea"
              />

              <input
                type="text"
                placeholder="Price (e.g. $25)"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-600 font-mono"
                data-ocid="new-listing-modal.price.input"
              />

              <input
                type="text"
                placeholder="Category (optional)"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-600 font-mono"
                data-ocid="new-listing-modal.category.input"
              />

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800 font-mono text-xs"
                  onClick={() => setStep("platform")}
                  disabled={createMutation.isPending}
                  data-ocid="new-listing-modal.back.button"
                >
                  Back
                </Button>
                <Button
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white font-mono text-xs font-bold gap-1.5"
                  onClick={() => createMutation.mutate()}
                  disabled={!canCreate || createMutation.isPending}
                  data-ocid="new-listing-modal.submit_button"
                >
                  {createMutation.isPending ? (
                    <>Creating…</>
                  ) : (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Create
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
