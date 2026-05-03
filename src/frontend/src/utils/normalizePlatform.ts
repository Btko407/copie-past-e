import type { Platform } from "../types/masterListing";

const VALID_PLATFORMS: Platform[] = [
  "facebook",
  "mercari",
  "ebay",
  "poshmark",
  "depop",
  "etsy",
];

/**
 * Normalizes a raw platform value from any source (string literal, Candid
 * variant object, 'mecari' typo) into the canonical Platform type.
 *
 * Handles:
 *   - string literals: 'facebook', '#facebook', 'mecari' → 'mercari'
 *   - Candid variants: { facebook: null } → 'facebook'
 *   - anything else → null
 */
export function normalizePlatform(raw: unknown): Platform | null {
  let key = "";

  if (typeof raw === "string") {
    key = raw.replace(/^#/, "").toLowerCase().trim();
  } else if (raw !== null && typeof raw === "object") {
    // Candid variant: { facebook: null } or { mecari: null }
    const firstKey = Object.keys(raw as Record<string, unknown>)[0];
    if (firstKey) key = firstKey.toLowerCase().trim();
  } else {
    return null;
  }

  // Fix known Candid/backend spelling drift
  if (key === "mecari") key = "mercari";

  if ((VALID_PLATFORMS as string[]).includes(key)) {
    return key as Platform;
  }

  return null;
}

/**
 * Like normalizePlatform, but throws if the value cannot be resolved.
 * Use in places where a null result would be a programming error.
 */
export function assertPlatform(raw: unknown): Platform {
  const p = normalizePlatform(raw);
  if (p === null) {
    throw new Error(
      `assertPlatform: cannot resolve "${String(raw)}" to a valid Platform`,
    );
  }
  return p;
}
