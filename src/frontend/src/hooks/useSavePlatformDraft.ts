import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  MecariCondition5Scale,
  Platform__2,
  SavePlatformDraftArgs,
} from "../backend.d.ts";

// ─── Condition helper types ────────────────────────────────────────────────────
// FacebookCondition is an unresolved type in backend.d.ts — it uses ItemCondition-like
// values; we model it the same way (enum string literals).
export type FacebookConditionKey =
  | "new_"
  | "likeNew"
  | "good"
  | "fair"
  | "poor";
export type MecariConditionKey = keyof typeof MecariCondition5Scale;

// ─── Per-platform field arg shapes ────────────────────────────────────────────
export interface FacebookDraftFields {
  title: string;
  description: string;
  price?: string;
  category?: string;
  condition?: FacebookConditionKey;
  localPickup: boolean;
  shipping: boolean;
}

export interface MecariDraftFields {
  title: string;
  description: string;
  price?: string;
  brand: string;
  condition?: MecariConditionKey;
  category?: string;
  deliveryDays?: number;
  shippingType?: "normal" | "fast" | "sameDay";
}

export interface EbayDraftFields {
  title: string;
  description: string;
  price?: string;
  category?: string;
  condition?: FacebookConditionKey;
  quantity: number;
  shippingCost?: string;
}

export interface PoshmarkDraftFields {
  title: string;
  description: string;
  price?: string;
  brand?: string;
  size?: string;
  category?: string;
  condition?: string;
}

export interface DepopDraftFields {
  title: string;
  description: string;
  price?: string;
  brand?: string;
  condition?: string;
  size?: string;
  category?: string;
}

export interface EtsyDraftFields {
  title: string;
  description: string;
  price?: string;
  category?: string;
  tags: string[];
  materials: string[];
  isSupply: boolean;
}

export type PlatformDraftFieldsInput =
  | { platform: "facebook"; fields: FacebookDraftFields }
  | { platform: "mercari"; fields: MecariDraftFields }
  | { platform: "ebay"; fields: EbayDraftFields }
  | { platform: "poshmark"; fields: PoshmarkDraftFields }
  | { platform: "depop"; fields: DepopDraftFields }
  | { platform: "etsy"; fields: EtsyDraftFields };

// Map condition string keys to Candid variant objects
function fbConditionToVariant(key: FacebookConditionKey) {
  const map: Record<FacebookConditionKey, Record<string, null>> = {
    new_: { new: null },
    likeNew: { likeNew: null },
    good: { good: null },
    fair: { fair: null },
    poor: { poor: null },
  };
  return map[key];
}

function mecariConditionToVariant(key: MecariConditionKey) {
  const map: Record<string, Record<string, null>> = {
    new_: { new: null },
    likeNew: { likeNew: null },
    good: { good: null },
    fair: { fair: null },
    poor: { poor: null },
  };
  return map[key];
}

function buildPlatformFields(
  input: PlatformDraftFieldsInput,
): SavePlatformDraftArgs["platformFields"] {
  switch (input.platform) {
    case "facebook": {
      const f = input.fields;
      return {
        __kind__: "facebook",
        facebook: {
          title: f.title,
          description: f.description,
          price: f.price ?? undefined,
          category: f.category ?? undefined,
          condition: f.condition
            ? (fbConditionToVariant(f.condition) as never)
            : undefined,
          localPickup: f.localPickup,
          shipping: f.shipping,
          photos: [],
        },
      };
    }
    case "mercari": {
      const f = input.fields;
      return {
        __kind__: "mecari",
        mecari: {
          title: f.title,
          description: f.description,
          price: f.price ?? undefined,
          brand: f.brand,
          condition: f.condition
            ? (mecariConditionToVariant(f.condition) as never)
            : undefined,
          category: f.category ?? undefined,
          deliveryDays:
            f.deliveryDays !== undefined ? BigInt(f.deliveryDays) : undefined,
          shippingType: f.shippingType
            ? ({ [f.shippingType]: null } as never)
            : undefined,
          photos: [],
        },
      };
    }
    case "ebay": {
      const f = input.fields;
      return {
        __kind__: "ebay",
        ebay: {
          title: f.title,
          description: f.description,
          price: f.price ?? undefined,
          category: f.category ?? undefined,
          condition: f.condition
            ? (fbConditionToVariant(f.condition) as never)
            : undefined,
          quantity: BigInt(f.quantity),
          shippingCost: f.shippingCost ?? undefined,
          photos: [],
        },
      };
    }
    case "poshmark": {
      const f = input.fields;
      return {
        __kind__: "poshmark",
        poshmark: {
          title: f.title,
          description: f.description,
          price: f.price ?? undefined,
          brand: f.brand ?? undefined,
          size: f.size ?? undefined,
          category: f.category ?? undefined,
          condition: f.condition ?? undefined,
          photos: [],
        },
      };
    }
    case "depop": {
      const f = input.fields;
      return {
        __kind__: "depop",
        depop: {
          title: f.title,
          description: f.description,
          price: f.price ?? undefined,
          brand: f.brand ?? undefined,
          condition: f.condition ?? undefined,
          size: f.size ?? undefined,
          category: f.category ?? undefined,
          photos: [],
        },
      };
    }
    case "etsy": {
      const f = input.fields;
      return {
        __kind__: "etsy",
        etsy: {
          title: f.title,
          description: f.description,
          price: f.price ?? undefined,
          category: f.category ?? undefined,
          tags: f.tags,
          materials: f.materials,
          isSupply: f.isSupply,
          photos: [],
        },
      };
    }
  }
}

const platformEnumMap: Record<
  PlatformDraftFieldsInput["platform"],
  Platform__2
> = {
  facebook: "facebook" as Platform__2,
  mercari: "mecari" as Platform__2, // backend Candid uses 'mecari'; frontend key is 'mercari'
  ebay: "ebay" as Platform__2,
  poshmark: "poshmark" as Platform__2,
  depop: "depop" as Platform__2,
  etsy: "etsy" as Platform__2,
};

export interface SavePlatformDraftMutationArgs {
  listingId: string;
  input: PlatformDraftFieldsInput;
}

export function useSavePlatformDraft() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<string, Error, SavePlatformDraftMutationArgs>({
    mutationFn: async ({ listingId, input }) => {
      if (!actor) throw new Error("Actor not available");

      const args: SavePlatformDraftArgs = {
        platform: platformEnumMap[input.platform],
        platformFields: buildPlatformFields(input),
        photos: [],
      };

      const result = await actor.savePlatformDraft(listingId, args);
      if (result.__kind__ === "err") {
        throw new Error(result.err.message ?? "Failed to save draft");
      }
      return result.ok;
    },
    onSuccess: (_, { listingId }) => {
      queryClient.invalidateQueries({
        queryKey: ["masterListings"],
        exact: false,
      });
      queryClient.invalidateQueries({ queryKey: ["listing", listingId] });
    },
    onError: (error) => {
      toast.error(`Save failed: ${error.message}`);
    },
  });
}
