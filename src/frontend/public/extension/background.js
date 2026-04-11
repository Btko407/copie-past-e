// Copie Past-e Smart Post — Background Service Worker (Manifest V3)
// Receives SMART_POST messages, saves listing data, opens marketplace tab.

"use strict";

// ── Marketplace URLs ────────────────────────────────────────────────────────

const PLATFORM_URLS = {
  facebook: "https://www.facebook.com/marketplace/create/item",
};

// ── onInstalled ─────────────────────────────────────────────────────────────

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    console.log("[Copie Past-e] Extension installed — Smart Post ready.");
  } else if (details.reason === "update") {
    console.log(`[Copie Past-e] Extension updated to v${chrome.runtime.getManifest().version}`);
  }
});

// ── Message handler ─────────────────────────────────────────────────────────

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type !== "SMART_POST") return false;

  const { platform, listing } = msg;

  if (!platform || !listing) {
    console.warn("[Copie Past-e] SMART_POST missing platform or listing data.");
    sendResponse({ success: false, error: "Missing platform or listing data" });
    return false;
  }

  const targetUrl = PLATFORM_URLS[platform];
  if (!targetUrl) {
    console.warn("[Copie Past-e] Unknown platform:", platform);
    sendResponse({ success: false, error: `Unknown platform: ${platform}` });
    return false;
  }

  // Save listing to storage for content script to pick up
  chrome.storage.local.set({ pendingPost: listing }, () => {
    if (chrome.runtime.lastError) {
      console.error("[Copie Past-e] Storage error:", chrome.runtime.lastError);
      sendResponse({ success: false, error: chrome.runtime.lastError.message });
      return;
    }

    // Open marketplace tab
    chrome.tabs.create({ url: targetUrl }, (tab) => {
      if (chrome.runtime.lastError) {
        console.error("[Copie Past-e] Tab create error:", chrome.runtime.lastError);
        sendResponse({ success: false, error: chrome.runtime.lastError.message });
      } else {
        console.log(`[Copie Past-e] Opened ${platform} tab (id: ${tab.id})`);
        sendResponse({ success: true, tabId: tab.id });
      }
    });
  });

  // Return true to keep message channel open for async sendResponse
  return true;
});
