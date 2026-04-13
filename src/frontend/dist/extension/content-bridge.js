// Copie Past-e — Content Bridge
// Runs on ALL pages at document_start.
// 1. Announces extension presence to the Copie Past-e app immediately.
// 2. Listens for SMART_POST messages from the app and forwards to background.
// 3. Listens for OCR scan requests and forwards to background Gemini worker.
// 4. Listens for SET_GEMINI_KEY requests and syncs to extension storage.
// 5. Checks localStorage fallback for pending post data.
// 6. Tracks connection status for popup display.
// 7. Re-announces on any ping from the app.

(function () {
  "use strict";

  const LOG = '[CP-Bridge]';

  // ── Announce presence immediately ───────────────────────────────────────────
  // Fires at document_start so the app can detect the extension as early as
  // possible. Also called in response to pings.
  function announce() {
    window.postMessage({ type: "COPIE_PASTE_EXT_PRESENT", hasOcr: true, version: "1.2.0" }, "*");
  }

  announce();

  // ── Update connection status in extension storage ───────────────────────────
  try {
    chrome.storage.local.set({
      ext_connected: true,
      lastSeen: Date.now(),
    });
  } catch (_) {
    // storage may be unavailable on some pages — safe to ignore
  }

  // ── Listen for messages from the Copie Past-e app ───────────────────────────
  window.addEventListener("message", (event) => {
    if (!event.data || typeof event.data !== "object") return;

    // ── Respond to ping with presence announcement ───────────────────────────
    if (event.data.type === "COPIE_PASTE_PING") {
      announce();
      return;
    }

    // ── New: SET_GEMINI_KEY sync from admin settings page ────────────────────
    if (event.data.type === "COPIE_PASTE_SET_GEMINI_KEY") {
      const { apiKey } = event.data;
      if (!apiKey) return;
      try {
        chrome.runtime.sendMessage(
          { type: "SET_GEMINI_API_KEY", apiKey },
          (response) => {
            window.postMessage({
              type: "COPIE_PASTE_SET_GEMINI_KEY_RESULT",
              success: response?.success ?? false,
              error: response?.error ?? undefined,
            }, "*");
          }
        );
      } catch (err) {
        console.warn(LOG, 'Failed to forward SET_GEMINI_API_KEY to background:', err);
      }
      return;
    }

    // ── New: OCR scan request from page (COPIE_PASTE_OCR_SCAN) ──────────────
    if (event.data.type === "COPIE_PASTE_OCR_SCAN") {
      const { imageBase64, requestId } = event.data;
      try {
        chrome.runtime.sendMessage(
          { type: "OCR_SCAN", imageBase64 },
          (response) => {
            window.postMessage({
              type: "COPIE_PASTE_OCR_RESULT",
              requestId,
              success: response?.success ?? false,
              data: response?.data ?? undefined,
              error: response?.error ?? undefined,
            }, "*");
          }
        );
      } catch (err) {
        console.warn(LOG, 'Failed to forward OCR_SCAN to background:', err);
        window.postMessage({
          type: "COPIE_PASTE_OCR_RESULT",
          requestId,
          success: false,
          error: 'Extension bridge error: ' + (err.message || String(err)),
        }, "*");
      }
      return;
    }

    // ── Legacy: Old OCR request type (COPIE_PASTE_OCR_REQUEST) ──────────────
    if (event.data.type === "COPIE_PASTE_OCR_REQUEST") {
      const { imageBase64, requestId } = event.data;
      try {
        chrome.runtime.sendMessage(
          { type: "GEMINI_OCR_SCAN", imageBase64 },
          (response) => {
            window.postMessage({
              type: "COPIE_PASTE_OCR_RESPONSE",
              requestId,
              ...response,
            }, "*");
          }
        );
      } catch (err) {
        console.warn(LOG, 'Failed to forward GEMINI_OCR_SCAN to background:', err);
      }
      return;
    }

    // ── Smart Post forwarding ────────────────────────────────────────────────
    if (event.data.type === "COPIE_PASTE_SMART_POST") {
      const { platform, listing } = event.data;
      if (!platform || !listing) return;

      // Validate image payload before forwarding
      if (!listing.images && !listing.photos) {
        console.warn(LOG, 'SMART_POST payload missing images:', listing.title);
      } else {
        const imgArr = listing.images || listing.photos;
        if (!imgArr || imgArr.length === 0) {
          console.warn(LOG, 'SMART_POST payload missing images:', listing.title);
        }
      }

      try {
        chrome.runtime.sendMessage({
          type: "SMART_POST",
          platform,
          listing,
        });
      } catch (err) {
        console.warn(LOG, "Failed to send SMART_POST to background:", err);
      }
      return;
    }
  });

  // ── localStorage fallback ───────────────────────────────────────────────────
  try {
    const raw = localStorage.getItem("copiepaste_pending_post");
    if (raw) {
      const data = JSON.parse(raw);
      if (data?.platform && data?.listing) {
        try {
          chrome.runtime.sendMessage({
            type: "SMART_POST",
            platform: data.platform,
            listing: data.listing,
          });
        } catch (err) {
          console.warn(LOG, "Failed to forward localStorage post:", err);
        }
        localStorage.removeItem("copiepaste_pending_post");
      }
    }
  } catch (_) {
    // localStorage may be unavailable — safe to ignore
  }
})();
