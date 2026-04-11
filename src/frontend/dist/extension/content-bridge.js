// Copie Past-e — Content Bridge
// Runs on ALL pages at document_start.
// 1. Announces extension presence to the Copie Past-e app immediately.
// 2. Listens for SMART_POST messages from the app and forwards to background.
// 3. Checks localStorage fallback for pending post data.
// 4. Tracks connection status for popup display.
// 5. Re-announces on any ping from the app.

(function () {
  "use strict";

  // ── Announce presence immediately ───────────────────────────────────────────
  // Fires at document_start so the app can detect the extension as early as
  // possible. Also called in response to pings.
  function announce() {
    window.postMessage({ type: "COPIE_PASTE_EXT_PRESENT" }, "*");
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

    // Respond to ping with presence announcement
    if (event.data.type === "COPIE_PASTE_PING") {
      announce();
      return;
    }

    if (event.data.type !== "COPIE_PASTE_SMART_POST") return;

    const { platform, listing } = event.data;
    if (!platform || !listing) return;

    try {
      chrome.runtime.sendMessage({
        type: "SMART_POST",
        platform,
        listing,
      });
    } catch (err) {
      console.warn("[Copie Past-e] Failed to send SMART_POST to background:", err);
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
          console.warn("[Copie Past-e] Failed to forward localStorage post:", err);
        }
        localStorage.removeItem("copiepaste_pending_post");
      }
    }
  } catch (_) {
    // localStorage may be unavailable — safe to ignore
  }
})();
