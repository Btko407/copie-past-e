/**
 * Download a single image using a direct URL.
 * Uses an anchor tag with the download attribute for desktop browsers.
 * For iOS Safari, opens the image in a new tab since anchor download is blocked.
 */
export function downloadImage(
  imageUrl: string,
  filename = "listing-image.jpg",
): void {
  if (isIOSSafari()) {
    window.open(imageUrl, "_blank");
  } else {
    const anchor = document.createElement("a");
    anchor.href = imageUrl;
    anchor.download = filename;
    anchor.rel = "noopener noreferrer";
    anchor.target = "_blank";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }
}

/**
 * Detect iOS Safari (iPhone/iPad) — these need window.open instead of anchor download.
 */
export function isIOSSafari(): boolean {
  const ua = navigator.userAgent;
  const isIOS =
    /iPad|iPhone|iPod/i.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  return isIOS;
}

/**
 * Download multiple images in sequence with a delay between each
 * to prevent browser throttling.
 * - iOS Safari: opens each image in a new tab with 600ms delay.
 *   Shows a banner instructing the user to "Tap and hold → Save to Photos".
 * - Other: uses anchor tag download with 400ms delay.
 */
export async function downloadAllImages(
  images: { url: string; filename?: string }[],
  onProgress?: (current: number, total: number) => void,
  delayMs = 400,
): Promise<void> {
  const ios = isIOSSafari();
  const delay = ios ? 600 : delayMs;

  for (let i = 0; i < images.length; i++) {
    const { url, filename } = images[i];

    if (ios) {
      // iOS Safari cannot trigger file downloads — open original image in new tab
      window.open(url, "_blank");
    } else {
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename ?? `listing-image-${i + 1}.jpg`;
      anchor.rel = "noopener noreferrer";
      anchor.target = "_blank";
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    }

    onProgress?.(i + 1, images.length);
    if (i < images.length - 1) {
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}
