/**
 * useScraper.ts — Legacy compatibility shim.
 * The URL scraper has been replaced with Smart Paste.
 * This file re-exports from useSmartPaste so any remaining imports still work.
 */

export {
  useSmartPaste as useScraper,
  parseListingText,
} from "./useSmartPasteLocal";

/** Always returns false — URL scraping is no longer supported. */
export function isSupportedMarketplaceUrl(_url: string): boolean {
  return false;
}
