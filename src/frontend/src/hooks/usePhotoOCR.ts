/**
 * usePhotoOCR — Calls the canister backend's ocrScanImage() function.
 *
 * Flow:
 *  1. Accept an image File
 *  2. Resize to max 1024px via Canvas API, convert to JPEG, base64 encode
 *  3. Call backend.ocrScanImage(base64String)
 *  4. Return parsed OcrResult
 *
 * Error handling:
 *  - All backend errors are surfaced verbatim (including cycles errors).
 *  - Never swallows the real reason for failure.
 */

import { useActor } from "@caffeineai/core-infrastructure";
import { useState } from "react";
import { createActor } from "../backend";
import type { OcrResult } from "../backend.d";
import type { ParsedListingResult } from "../types";

// ── Extended result type ───────────────────────────────────────────────────────

export interface PhotoOCRResult extends ParsedListingResult {
  condition?: string;
  brand?: string;
  /** Set when extraction partially or fully succeeded */
  error?: string;
}

/** On failure, returns { error: "message" } (all other fields absent). Never returns null. */
export interface UsePhotoOCRReturn {
  extractFromImage: (file: File) => Promise<PhotoOCRResult>;
  isProcessing: boolean;
  error: string | null;
  reset: () => void;
}

// ── Valid values from the app's category/condition constants ──────────────────

const VALID_CATEGORIES = [
  "Appliances",
  "Automotive",
  "Baby & Kids",
  "Books & Magazines",
  "Clothing & Shoes",
  "Collectibles",
  "Electronics & Media",
  "Furniture",
  "Home & Garden",
  "Jewelry & Accessories",
  "Tools & Machinery",
  "Office Supplies",
  "Services",
] as const;

// Note: the app uses em-dash (—) not double-hyphen
const VALID_CONDITIONS = [
  "New",
  "Used — Good",
  "Used — Fair",
  "Used — Normal Wear",
] as const;

// Map common AI variations to the app's canonical condition strings
const CONDITION_MAP: Record<string, string> = {
  new: "New",
  "used — good": "Used — Good",
  "used - good": "Used — Good",
  "used--good": "Used — Good",
  "used -- good": "Used — Good",
  good: "Used — Good",
  "like new": "Used — Good",
  "used — fair": "Used — Fair",
  "used - fair": "Used — Fair",
  "used--fair": "Used — Fair",
  "used -- fair": "Used — Fair",
  fair: "Used — Fair",
  "used — normal wear": "Used — Normal Wear",
  "used - normal wear": "Used — Normal Wear",
  "used--normal wear": "Used — Normal Wear",
  "used -- normal wear": "Used — Normal Wear",
  "normal wear": "Used — Normal Wear",
  worn: "Used — Normal Wear",
  used: "Used — Normal Wear",
  acceptable: "Used — Fair",
};

function normaliseCategory(raw: string): string {
  if (!raw) return "";
  const trimmed = raw.trim();
  const exact = VALID_CATEGORIES.find(
    (c) => c.toLowerCase() === trimmed.toLowerCase(),
  );
  if (exact) return exact;
  const lower = trimmed.toLowerCase();
  if (
    lower.includes("electron") ||
    lower.includes("media") ||
    lower.includes("phone") ||
    lower.includes("computer") ||
    lower.includes("tech")
  )
    return "Electronics & Media";
  if (
    lower.includes("appli") ||
    lower.includes("washer") ||
    lower.includes("fridge") ||
    lower.includes("microwave")
  )
    return "Appliances";
  if (
    lower.includes("auto") ||
    lower.includes("car") ||
    lower.includes("truck") ||
    lower.includes("vehicle")
  )
    return "Automotive";
  if (
    lower.includes("baby") ||
    lower.includes("kid") ||
    lower.includes("child") ||
    lower.includes("toy")
  )
    return "Baby & Kids";
  if (
    lower.includes("book") ||
    lower.includes("magazine") ||
    lower.includes("novel")
  )
    return "Books & Magazines";
  if (
    lower.includes("cloth") ||
    lower.includes("shoe") ||
    lower.includes("fashion") ||
    lower.includes("wear") ||
    lower.includes("apparel")
  )
    return "Clothing & Shoes";
  if (
    lower.includes("collect") ||
    lower.includes("antique") ||
    lower.includes("art") ||
    lower.includes("card")
  )
    return "Collectibles";
  if (
    lower.includes("furni") ||
    lower.includes("sofa") ||
    lower.includes("couch") ||
    lower.includes("chair") ||
    lower.includes("table") ||
    lower.includes("desk") ||
    lower.includes("bed")
  )
    return "Furniture";
  if (
    lower.includes("garden") ||
    lower.includes("home") ||
    lower.includes("decor")
  )
    return "Home & Garden";
  if (
    lower.includes("jewel") ||
    lower.includes("watch") ||
    lower.includes("accessory") ||
    lower.includes("accessories") ||
    lower.includes("bag")
  )
    return "Jewelry & Accessories";
  if (
    lower.includes("tool") ||
    lower.includes("machinery") ||
    lower.includes("equipment") ||
    lower.includes("mower")
  )
    return "Tools & Machinery";
  if (
    lower.includes("office") ||
    lower.includes("supply") ||
    lower.includes("supplies") ||
    lower.includes("printer")
  )
    return "Office Supplies";
  if (lower.includes("service")) return "Services";
  return "";
}

function normaliseCondition(raw: string): string {
  if (!raw) return "";
  const lower = raw.trim().toLowerCase();
  if (CONDITION_MAP[lower]) return CONDITION_MAP[lower];
  const exact = VALID_CONDITIONS.find((c) => c.toLowerCase() === lower);
  if (exact) return exact;
  if (lower.includes("new")) return "New";
  if (lower.includes("good")) return "Used — Good";
  if (lower.includes("fair")) return "Used — Fair";
  if (lower.includes("normal") || lower.includes("wear"))
    return "Used — Normal Wear";
  return "";
}

// ── Image resizing via Canvas API ─────────────────────────────────────────────

async function resizeImageToBase64(file: File, maxPx = 1024): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const { width, height } = img;
      const scale = Math.min(1, maxPx / Math.max(width, height));
      const w = Math.round(width * scale);
      const h = Math.round(height * scale);

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas 2D context unavailable"));
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      // Export as JPEG (base64, strip the data: prefix)
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
      // strip "data:image/jpeg;base64," prefix — backend wants raw base64
      const base64 = dataUrl.split(",")[1] ?? "";
      resolve(base64);
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to load image for resizing"));
    };
    img.src = objectUrl;
  });
}

// ── Safely extract OcrResult from any response shape ─────────────────────────

type OcrBackendResponse =
  | { __kind__: "ok"; ok: OcrResult }
  | { __kind__: "err"; err: string }
  | OcrResult;

function parseOcrResponse(raw: OcrBackendResponse): {
  data: OcrResult | null;
  error: string | null;
} {
  // Variant result: { __kind__: "ok", ok: {...} } or { __kind__: "err", err: "..." }
  if (raw && typeof raw === "object" && "__kind__" in raw) {
    if (raw.__kind__ === "ok") {
      return { data: raw.ok as OcrResult, error: null };
    }
    if (raw.__kind__ === "err") {
      // Surface the full error text from the backend verbatim — this includes
      // cycles errors like "http_request request sent with 0 cycles, but X required"
      return { data: null, error: raw.err as string };
    }
  }
  // Direct object (backend returned OcrResult without variant wrapper)
  if (raw && typeof raw === "object" && "title" in raw) {
    return { data: raw as OcrResult, error: null };
  }
  return { data: null, error: "Unexpected response shape from OCR backend" };
}

/** Returns a user-friendly prefix for known error types */
function formatOcrError(raw: string): string {
  // Cycles errors — these are backend/platform resource errors, not key errors
  if (raw.includes("cycles") || raw.includes("http_request")) {
    return `OCR scan failed: ${raw}`;
  }
  // Rate limit
  if (raw.includes("429") || raw.toLowerCase().includes("quota")) {
    return `OCR rate limit reached — try again in a minute. (${raw})`;
  }
  // Auth / key errors
  if (raw.includes("403") || raw.toLowerCase().includes("api key")) {
    return `OCR API key error — check your Gemini key in admin Settings. (${raw})`;
  }
  // Not configured
  if (
    raw.toLowerCase().includes("not configured") ||
    raw.toLowerCase().includes("api key not")
  ) {
    return raw;
  }
  return raw;
}

// ── Main hook ─────────────────────────────────────────────────────────────────

export function usePhotoOCR(): UsePhotoOCRReturn {
  const { actor, isFetching } = useActor(createActor);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function extractFromImage(file: File): Promise<PhotoOCRResult> {
    setIsProcessing(true);
    setError(null);

    const fail = (msg: string): PhotoOCRResult => {
      const formatted = formatOcrError(msg);
      setError(formatted);
      return { error: formatted };
    };

    try {
      // Step 1: Resize and encode to base64 (strip data-URL prefix)
      const base64 = await resizeImageToBase64(file, 1024);

      if (!actor || isFetching) {
        return fail("Backend not ready. Please try again in a moment.");
      }

      // Step 2: Call canister backend — signature: ocrScanImage(imageBase64: string)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const raw = await (
        actor as unknown as {
          ocrScanImage: (b: string) => Promise<OcrBackendResponse>;
        }
      ).ocrScanImage(base64);

      // Debug log so we can see exactly what the backend returned
      console.log("[OCR] Backend response:", JSON.stringify(raw));

      // Step 3: Normalise the response shape
      const { data, error: backendError } = parseOcrResponse(raw);

      if (backendError || !data) {
        return fail(
          backendError ?? "OCR returned no data. Try a clearer screenshot.",
        );
      }

      // Step 4: Check if all fields are empty (no text found in image)
      const allEmpty =
        !data.title &&
        !data.price &&
        !data.description &&
        !data.category &&
        !data.condition &&
        !data.brand;

      if (allEmpty) {
        return fail(
          "No listing text found in this image. Try a screenshot that shows the full listing.",
        );
      }

      // Step 5: Normalise category and condition to app canonical values
      const category = normaliseCategory(data.category ?? "");
      const condition = normaliseCondition(data.condition ?? "");
      // Strip any currency symbols from price — form prepends $ itself
      const rawPrice = (data.price ?? "").replace(/[^0-9.,]/g, "").trim();

      return {
        title: data.title?.trim() || undefined,
        price: rawPrice || undefined,
        description: data.description?.trim() || undefined,
        category: category || undefined,
        condition: condition || undefined,
        brand: data.brand?.trim() || undefined,
      };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to process image";
      return fail(message);
    } finally {
      setIsProcessing(false);
    }
  }

  function reset() {
    setError(null);
  }

  return { extractFromImage, isProcessing, error, reset };
}
