/**
 * Client-side image download utility.
 *
 * This app is a Vite SPA — there is no server-side runtime for a true
 * proxy endpoint. This module implements the full download flow client-side:
 *
 *   iOS Safari  → fetch blob → navigator.share({ files }) → iOS share sheet
 *                 (user taps "Save Image" in the share sheet)
 *   Android /
 *   Desktop     → fetch blob → <a download> trigger → saves to Downloads/Gallery
 *   Fallback    → open image in new tab with "press and hold" instructions
 *
 * For "Download All Images", the caller loops through images with a delay
 * between each to avoid popup-blocker limits.
 */

export type DownloadResult =
  | { ok: true }
  | { ok: false; error: string; fallbackUrl?: string };

/**
 * Detect iOS Safari (including PWA / home-screen mode).
 */
function isIOSSafari(): boolean {
  const ua = navigator.userAgent;
  const isIOS =
    /iPad|iPhone|iPod/i.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  // Exclude Chrome on iOS — it doesn't support navigator.share for files
  const isChrome = /CriOS/i.test(ua);
  return isIOS && !isChrome;
}

/**
 * Fetch an image URL as a Blob. Returns null on failure.
 */
async function fetchImageBlob(imageUrl: string): Promise<Blob | null> {
  try {
    const res = await fetch(imageUrl, { mode: "cors" });
    if (!res.ok) return null;
    return await res.blob();
  } catch {
    return null;
  }
}

/**
 * Trigger an <a download> save. Works on Android Chrome and desktop.
 */
function triggerAnchorDownload(blob: Blob, filename: string): void {
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = filename;
  anchor.rel = "noopener noreferrer";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  // Keep alive long enough for the download to start
  setTimeout(() => URL.revokeObjectURL(objectUrl), 30_000);
}

/**
 * Download a single image to the device.
 *
 * - iOS Safari:         fetch → navigator.share({ files }) → share sheet
 * - Android / Desktop:  fetch → <a download>
 * - Fallback:           open in new tab
 *
 * @param imageUrl  Direct URL to the image.
 * @param filename  Desired local filename (default: listing-image.jpg).
 */
export async function downloadImageFromUrl(
  imageUrl: string,
  filename = "listing-image.jpg",
): Promise<DownloadResult> {
  const blob = await fetchImageBlob(imageUrl);

  if (!blob) {
    // Total fetch failure — open in new tab as last resort
    try {
      window.open(imageUrl, "_blank", "noopener noreferrer");
    } catch {
      // swallow
    }
    return {
      ok: false,
      error: "Failed to fetch image",
      fallbackUrl: imageUrl,
    };
  }

  // Build the File object for share / download
  const mimeType = blob.type.startsWith("image/") ? blob.type : "image/jpeg";
  const file = new File([blob], filename, { type: mimeType });

  // ── iOS Safari: use Web Share API for native "Save Image" ─────────────────
  if (isIOSSafari()) {
    if (
      typeof navigator.share === "function" &&
      typeof navigator.canShare === "function" &&
      navigator.canShare({ files: [file] })
    ) {
      try {
        await navigator.share({
          files: [file],
          title: "Save Image",
        });
        return { ok: true };
      } catch (err) {
        // User cancelled (AbortError) — treat as ok; anything else is fallback
        if (err instanceof Error && err.name === "AbortError") {
          return { ok: true };
        }
        // Fall through to new-tab fallback
      }
    }

    // iOS but navigator.share unavailable — open in new tab for long-press save
    try {
      window.open(imageUrl, "_blank", "noopener noreferrer");
    } catch {
      // swallow
    }
    return {
      ok: false,
      error: "Press and hold this image, then tap Save to Photos.",
      fallbackUrl: imageUrl,
    };
  }

  // ── Android Chrome / Desktop: <a download> ────────────────────────────────
  try {
    triggerAnchorDownload(blob, filename);
    return { ok: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Download failed";
    return { ok: false, error: msg, fallbackUrl: imageUrl };
  }
}
