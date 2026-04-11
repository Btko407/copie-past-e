import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { ParsedListingResult } from "../types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ActorAny = any;

/**
 * Parses pasted listing text (from Facebook Marketplace, OfferUp, etc.)
 * into structured listing fields via the backend parsePastedText method.
 */
export function useSmartPaste() {
  const { actor } = useActor(createActor);

  return useMutation<ParsedListingResult, Error, string>({
    mutationFn: async (pastedText: string): Promise<ParsedListingResult> => {
      if (!actor) throw new Error("Actor not ready");

      // Try backend parser first
      try {
        const result = await (actor as ActorAny).parsePastedText(pastedText);
        if (result && typeof result === "object") {
          // Handle both direct result and Result<ok, err> patterns
          const data = "ok" in result ? result.ok : result;
          return {
            title: data.title?.[0] ?? data.title ?? undefined,
            price: data.price?.[0] ?? data.price ?? undefined,
            description: data.description?.[0] ?? data.description ?? undefined,
            category: data.category?.[0] ?? data.category ?? undefined,
          };
        }
      } catch {
        // Fall through to client-side parsing
      }

      // Client-side fallback parser for common marketplace formats
      return parseListingTextLocally(pastedText);
    },
  });
}

// ─── Client-side text parser ──────────────────────────────────────────────────

function parseListingTextLocally(text: string): ParsedListingResult {
  const lines = text
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  let title: string | undefined;
  let price: string | undefined;
  let description: string | undefined;
  let category: string | undefined;

  // Price detection: $X, $X.XX, $X,XXX patterns
  const priceRegex = /\$[\d,]+(?:\.\d{2})?/;

  // Facebook Marketplace format: title is usually first non-empty line
  // Price is often on second line or contains "$"
  for (const line of lines) {
    if (!title && line.length > 2 && !priceRegex.test(line)) {
      title = line;
    } else if (!price && priceRegex.test(line)) {
      const match = line.match(priceRegex);
      if (match) price = match[0];
    }
  }

  // Description: everything after title and price lines
  const descLines: string[] = [];
  let pastHeader = false;
  for (const line of lines) {
    if (!pastHeader && (line === title || priceRegex.test(line))) {
      pastHeader = true;
      continue;
    }
    if (pastHeader) descLines.push(line);
  }
  if (descLines.length > 0) {
    description = descLines.join("\n").trim();
  }

  // Category inference from keywords
  category = inferCategory(text);

  return { title, price, description, category };
}

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  Electronics: [
    "phone",
    "laptop",
    "computer",
    "iphone",
    "samsung",
    "tv",
    "television",
    "tablet",
    "ipad",
    "monitor",
    "keyboard",
    "headphone",
    "speaker",
    "camera",
  ],
  Vehicles: [
    "car",
    "truck",
    "suv",
    "van",
    "motorcycle",
    "bike",
    "vehicle",
    "auto",
    "miles",
    "mileage",
    "engine",
    "transmission",
  ],
  Furniture: [
    "sofa",
    "couch",
    "chair",
    "table",
    "desk",
    "bed",
    "dresser",
    "cabinet",
    "bookshelf",
    "wardrobe",
    "mattress",
    "furniture",
  ],
  Clothing: [
    "shirt",
    "pants",
    "shoes",
    "dress",
    "jacket",
    "coat",
    "jeans",
    "size",
    "clothing",
    "fashion",
    "wear",
    "sneakers",
  ],
  "Home & Garden": [
    "garden",
    "plant",
    "lawnmower",
    "tool",
    "appliance",
    "washer",
    "dryer",
    "refrigerator",
    "kitchen",
    "grill",
    "outdoor",
  ],
  "Toys & Games": [
    "toy",
    "game",
    "lego",
    "doll",
    "action figure",
    "board game",
    "playstation",
    "xbox",
    "nintendo",
    "console",
  ],
  "Sports & Outdoors": [
    "bike",
    "bicycle",
    "kayak",
    "tent",
    "hiking",
    "sports",
    "golf",
    "gym",
    "workout",
    "fitness",
    "skateboard",
  ],
};

function inferCategory(text: string): string | undefined {
  const lower = text.toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) return cat;
  }
  return undefined;
}
