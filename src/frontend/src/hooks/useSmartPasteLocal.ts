/**
 * useSmartPasteLocal — client-side listing text parser.
 * Parses pasted text from Facebook Marketplace, OfferUp, or any listing
 * into structured fields. No backend call needed — fully client-side.
 */

import { useState } from "react";
import type { ParsedListingResult } from "../types";

export interface SmartPasteState {
  parsedData: ParsedListingResult | null;
  isLoading: boolean;
  error: string | null;
}

export interface UseSmartPasteReturn extends SmartPasteState {
  parse: (text: string) => Promise<ParsedListingResult>;
  reset: () => void;
}

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  Electronics: [
    "phone",
    "laptop",
    "computer",
    "tv",
    "monitor",
    "tablet",
    "ipad",
    "iphone",
    "android",
    "samsung",
    "apple",
    "xbox",
    "playstation",
    "nintendo",
    "camera",
    "speaker",
    "headphone",
    "airpod",
    "keyboard",
    "mouse",
    "printer",
    "router",
    "gaming",
    "console",
    "charger",
    "cable",
    "electronic",
    "device",
    "tech",
  ],
  Furniture: [
    "sofa",
    "couch",
    "chair",
    "table",
    "desk",
    "bed",
    "dresser",
    "bookshelf",
    "shelf",
    "cabinet",
    "drawer",
    "furniture",
    "ottoman",
    "recliner",
    "mattress",
    "nightstand",
    "wardrobe",
    "bench",
    "stool",
  ],
  Decor: [
    "lamp",
    "rug",
    "art",
    "painting",
    "picture",
    "frame",
    "vase",
    "curtain",
    "mirror",
    "plant",
    "decor",
    "decoration",
    "candle",
    "pillow",
    "throw",
    "wall",
    "vintage",
    "antique",
  ],
  Cars: [
    "car",
    "truck",
    "suv",
    "van",
    "vehicle",
    "auto",
    "honda",
    "toyota",
    "ford",
    "chevy",
    "chevrolet",
    "bmw",
    "mercedes",
    "jeep",
    "dodge",
    "nissan",
    "hyundai",
    "kia",
    "miles",
    "mileage",
    "engine",
    "transmission",
    "sedan",
    "pickup",
    "delorean",
  ],
  Appliances: [
    "washer",
    "dryer",
    "fridge",
    "refrigerator",
    "dishwasher",
    "microwave",
    "oven",
    "stove",
    "blender",
    "vacuum",
    "appliance",
    "freezer",
    "air conditioner",
    "ac unit",
    "heater",
    "fan",
    "toaster",
    "coffee maker",
  ],
  Clothes: [
    "shirt",
    "pants",
    "jeans",
    "dress",
    "jacket",
    "coat",
    "shoes",
    "boots",
    "sneakers",
    "hoodie",
    "sweater",
    "shorts",
    "skirt",
    "clothing",
    "clothes",
    "outfit",
    "wear",
    "size",
    "brand",
    "fashion",
    "handbag",
    "purse",
    "hat",
    "cap",
  ],
};

function guessCategory(text: string): string {
  const lower = text.toLowerCase();
  let bestCat = "";
  let bestScore = 0;

  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const score = keywords.filter((kw) => lower.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      bestCat = cat;
    }
  }

  return bestScore > 0 ? bestCat : "";
}

function extractPrice(text: string): string {
  const patterns = [
    /\$\s*([0-9,]+(?:\.[0-9]{1,2})?)/,
    /([0-9,]+(?:\.[0-9]{1,2})?)\s*(?:dollars?|usd)/i,
    /price[:\s]+\$?\s*([0-9,]+(?:\.[0-9]{1,2})?)/i,
    /asking[:\s]+\$?\s*([0-9,]+(?:\.[0-9]{1,2})?)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1].replace(/,/g, "");
  }

  if (/\bfree\b/i.test(text)) return "Free";
  return "";
}

const SKIP_PREFIXES = [
  "price:",
  "description:",
  "category:",
  "condition:",
  "seller:",
  "location:",
  "posted",
  "listed",
  "facebook",
  "offerup",
  "marketplace",
  "share",
  "save",
  "message",
  "http",
];

function extractTitle(lines: string[]): string {
  for (const line of lines.slice(0, 6)) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const lowerTrimmed = trimmed.toLowerCase();
    if (SKIP_PREFIXES.some((p) => lowerTrimmed.startsWith(p))) continue;

    const titleMatch = trimmed.match(/^(?:title|name|item)[:\s]+(.+)/i);
    if (titleMatch) return titleMatch[1].trim();

    if (trimmed.length >= 3 && trimmed.length <= 120 && !/^\$/.test(trimmed)) {
      return trimmed;
    }
  }
  return "";
}

function extractDescription(
  text: string,
  title: string,
  price: string,
): string {
  let desc = text;

  if (title) desc = desc.replace(title, "").trim();

  if (price && price !== "Free") {
    const escaped = price.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    desc = desc.replace(new RegExp(`\\$?\\s*${escaped}`, "gi"), "").trim();
  }

  // Strip boilerplate patterns
  desc = desc
    .replace(
      /^(message|share|save|report|more options?|see more|show more|hide|follow|like|comment).*/gim,
      "",
    )
    .replace(
      /^(posted|listed|sold|available|pending|price firm|obo|or best offer).*/gim,
      "",
    )
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/^(seller|buyer|location|category|condition)[:\s].*/gim, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return desc;
}

/** Parses raw pasted listing text into structured fields. All fields may be empty. */
export function parseListingText(rawText: string): ParsedListingResult {
  const text = rawText.trim();
  const lines = text.split(/\r?\n/);

  const title = extractTitle(lines);
  const price = extractPrice(text);
  const category = guessCategory(text);
  const description = extractDescription(text, title, price);

  return {
    title: title || undefined,
    price: price || undefined,
    description: description || undefined,
    category: category || undefined,
  };
}

export function useSmartPaste(): UseSmartPasteReturn {
  const [state, setState] = useState<SmartPasteState>({
    parsedData: null,
    isLoading: false,
    error: null,
  });

  async function parse(text: string): Promise<ParsedListingResult> {
    setState({ parsedData: null, isLoading: true, error: null });
    // Small delay to allow animation to start before state update
    await new Promise<void>((resolve) => setTimeout(resolve, 80));
    const result = parseListingText(text);
    setState({ parsedData: result, isLoading: false, error: null });
    return result;
  }

  function reset() {
    setState({ parsedData: null, isLoading: false, error: null });
  }

  return { ...state, parse, reset };
}
