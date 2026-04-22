// Copie Past-e — Content Bridge
// Runs on ALL pages at document_start.
// 1. Announces extension presence to the Copie Past-e app immediately.
// 2. Listens for SMART_POST messages from the app and forwards to background.
// 3. Listens for OCR scan requests and forwards to background Gemini worker.
// 4. Checks localStorage fallback for pending post data.
// 5. Re-announces on any ping from the app.
// NOTE: This bridge does not cache or store user identity, principal, or
//       session state. It only forwards messages between page and background.

(function () {
  const LOG = '[CP-Bridge]';

  // ── Announce presence immediately ───────────────────────────────────────────
  // Fires at document_start so the app can detect the extension as early as
  // possible. Also called in response to pings.
  function announce() {
    window.postMessage({ type: "COPIE_PASTE_EXT_PRESENT", hasOcr: true }, "*");
  }

  announce();

  // ── Listen for messages from the Copie Past-e app ───────────────────────────
  window.addEventListener("message", (event) => {
    if (!event.data || typeof event.data !== "object") return;

    // ── Respond to ping with presence announcement ───────────────────────────
    if (event.data.type === "COPIE_PASTE_PING") {
      announce();
      return;
    }

    // ── OCR request (COPIE_PASTE_OCR_REQUEST or COPIE_PASTE_OCR_SCAN) ────────
    if (
      event.data.type === "COPIE_PASTE_OCR_REQUEST" ||
      event.data.type === "COPIE_PASTE_OCR_SCAN"
    ) {
      const { imageBase64, requestId } = event.data;
      try {
        chrome.runtime.sendMessage(
          { type: "GEMINI_OCR_SCAN", imageBase64 },
          (response) => {
            window.postMessage({
              type: event.data.type === "COPIE_PASTE_OCR_SCAN"
                ? "COPIE_PASTE_OCR_RESULT"
                : "COPIE_PASTE_OCR_RESPONSE",
              requestId,
              ...(response || { error: "No response from background." }),
            }, "*");
          }
        );
      } catch (err) {
        console.warn(LOG, 'Failed to forward OCR request to background:', err);
        window.postMessage({
          type: event.data.type === "COPIE_PASTE_OCR_SCAN"
            ? "COPIE_PASTE_OCR_RESULT"
            : "COPIE_PASTE_OCR_RESPONSE",
          requestId,
          error: "Extension bridge error: " + err.message,
        }, "*");
      }
      return;
    }

    // ── Gemini API key sync from admin settings ───────────────────────────────
    if (event.data.type === "COPIE_PASTE_SET_GEMINI_KEY") {
      const { apiKey } = event.data;
      if (!apiKey) return;
      try {
        chrome.runtime.sendMessage(
          { type: "SET_GEMINI_API_KEY", key: apiKey },
          (response) => {
            window.postMessage({
              type: "COPIE_PASTE_SET_GEMINI_KEY_RESULT",
              success: !!(response && response.success),
            }, "*");
          }
        );
      } catch (err) {
        console.warn(LOG, 'Failed to forward SET_GEMINI_API_KEY to background:', err);
      }
      return;
    }

    // ── Smart Post forwarding ────────────────────────────────────────────────
    if (event.data.type === "COPIE_PASTE_SMART_POST") {
      const { platform, listing } = event.data;
      if (!platform || !listing) return;

      if (!listing.images || listing.images.length === 0) {
        console.warn(LOG, "COPIE_PASTE_SMART_POST: listing has no images.");
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
