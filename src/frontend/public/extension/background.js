// Copie Past-e Smart Post — Background Service Worker (Manifest V3)
// Version: 1.2.0
// Receives SMART_POST messages, saves listing data, opens marketplace tab.
// Supports Gemini OCR scan via OCR_SCAN and SET_GEMINI_API_KEY handlers.

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

// ── Gemini API key storage (legacy + new handlers) ─────────────────────────
// Kept for backward compat: SAVE_GEMINI_KEY / GET_GEMINI_KEY (old popup)
// New handlers: SET_GEMINI_API_KEY / (key stored under "gemini_api_key")

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  // ── New: SET_GEMINI_API_KEY (from content-bridge page message) ────────────
  if (msg.type === 'SET_GEMINI_API_KEY') {
    const key = msg.apiKey;
    if (!key || typeof key !== 'string') {
      sendResponse({ success: false, error: 'Invalid API key provided.' });
      return true;
    }
    chrome.storage.local.set({ gemini_api_key: key }, () => {
      if (chrome.runtime.lastError) {
        sendResponse({ success: false, error: chrome.runtime.lastError.message });
      } else {
        sendResponse({ success: true });
      }
    });
    return true;
  }

  // ── Legacy: SAVE_GEMINI_KEY (old popup.js) ────────────────────────────────
  if (msg.type === 'SAVE_GEMINI_KEY') {
    chrome.storage.local.set({ geminiApiKey: msg.key }, () => {
      sendResponse({ success: true });
    });
    return true;
  }

  // ── Legacy: GET_GEMINI_KEY (old popup.js) ─────────────────────────────────
  if (msg.type === 'GET_GEMINI_KEY') {
    chrome.storage.local.get('geminiApiKey', (result) => {
      sendResponse({ key: result.geminiApiKey || null });
    });
    return true;
  }
});

// ── Gemini OCR scan handler (new: OCR_SCAN) ─────────────────────────────────

const GEMINI_OCR_PROMPT = `You are a marketplace listing data extractor. Extract the following fields from this listing image and return ONLY a valid JSON object with no markdown or explanation: { "title": "item name", "price": "numeric only, no currency symbols", "description": "full item description", "category": "exactly one of: Appliances, Automotive, Baby & Kids, Books & Magazines, Clothing & Shoes, Collectibles, Electronics & Media, Furniture, Home & Garden, Jewelry & Accessories, Tools & Machinery, Office Supplies, Services", "condition": "exactly one of: New, Used -- Good, Used -- Fair, Used -- Normal Wear, or empty string", "brand": "brand name or empty string" }. Use empty string for any field not visible. Never invent data.`;

async function runGeminiOcr(imageBase64, sendResponse) {
  if (!imageBase64) {
    sendResponse({ success: false, error: 'No image data provided.' });
    return;
  }

  // Load key from new storage location first, fall back to legacy location
  chrome.storage.local.get(['gemini_api_key', 'geminiApiKey'], async (result) => {
    const apiKey = result.gemini_api_key || result.geminiApiKey || null;
    if (!apiKey) {
      sendResponse({
        success: false,
        error: 'Gemini API key not configured. Open the extension popup and paste your key.',
      });
      return;
    }

    try {
      const response = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=' + apiKey,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: GEMINI_OCR_PROMPT },
                { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } },
              ],
            }],
            generationConfig: { responseMimeType: 'application/json' },
          }),
        }
      );

      if (response.status === 429) {
        sendResponse({ success: false, error: 'Rate limit reached. Try again in 60 seconds.' });
        return;
      }
      if (response.status === 403) {
        sendResponse({ success: false, error: 'API key invalid or quota exceeded.' });
        return;
      }
      if (!response.ok) {
        sendResponse({ success: false, error: 'Gemini error: HTTP ' + response.status });
        return;
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const cleaned = text.replace(/```json|```/g, '').trim();

      let parsed;
      try {
        parsed = JSON.parse(cleaned);
      } catch (_) {
        sendResponse({ success: false, error: 'OCR response could not be parsed as JSON.' });
        return;
      }

      sendResponse({ success: true, data: parsed });
    } catch (err) {
      sendResponse({ success: false, error: 'OCR failed: ' + (err.message || String(err)) });
    }
  });
}

// New OCR_SCAN handler (from content-bridge COPIE_PASTE_OCR_SCAN)
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type !== 'OCR_SCAN') return false;
  runGeminiOcr(msg.imageBase64, sendResponse);
  return true; // keep channel open for async response
});

// ── Legacy: GEMINI_OCR_SCAN handler (old content-bridge / popup) ─────────────

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type !== 'GEMINI_OCR_SCAN') return false;
  runGeminiOcr(msg.imageBase64, sendResponse);
  return true;
});

// ── SMART_POST handler ───────────────────────────────────────────────────────

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

  // Defensive logging for missing images
  if (!listing.images && !listing.photos) {
    console.warn('[CP-Extension]', 'SMART_POST received with no images:', listing.title);
  } else {
    const imgArr = listing.images || listing.photos;
    if (!imgArr || imgArr.length === 0) {
      console.warn('[CP-Extension]', 'SMART_POST received with no images:', listing.title);
    }
  }

  // Normalize: always use "images" key for Facebook content script
  const normalizedListing = { ...listing };
  if (!normalizedListing.images && normalizedListing.photos) {
    normalizedListing.images = normalizedListing.photos;
  }

  // Ensure all expected fields are present
  const payload = {
    title: normalizedListing.title || '',
    description: normalizedListing.description || '',
    price: normalizedListing.price || '',
    category: normalizedListing.category || '',
    condition: normalizedListing.condition || '',
    brand: normalizedListing.brand || '',
    images: normalizedListing.images || [],
  };

  // Save listing to storage for content script to pick up
  chrome.storage.local.set({ pendingPost: payload }, () => {
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
