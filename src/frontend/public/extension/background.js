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

// ── Gemini API key storage ──────────────────────────────────────────────────

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === 'SAVE_GEMINI_KEY') {
    chrome.storage.local.set({ geminiApiKey: msg.key }, () => {
      sendResponse({ success: true });
    });
    return true;
  }
  if (msg.type === 'GET_GEMINI_KEY') {
    chrome.storage.local.get('geminiApiKey', (result) => {
      sendResponse({ key: result.geminiApiKey || null });
    });
    return true;
  }
});

// ── Gemini OCR scan handler ─────────────────────────────────────────────────

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type !== 'GEMINI_OCR_SCAN') return;

  chrome.storage.local.get('geminiApiKey', async (result) => {
    const apiKey = result.geminiApiKey;
    if (!apiKey) {
      sendResponse({ error: 'Gemini API key not configured in extension.' });
      return;
    }

    const prompt = `You are a marketplace listing data extractor.
Analyze this listing image and extract the following fields.
Return ONLY a valid JSON object with no markdown, no explanation:
{
  "title": "the item name or listing title",
  "price": "numeric price only, no currency symbols",
  "description": "the full item description",
  "category": "exactly one of: Appliances, Automotive, Baby & Kids, Books & Magazines, Clothing & Shoes, Collectibles, Electronics & Media, Furniture, Home & Garden, Jewelry & Accessories, Tools & Machinery, Office Supplies, Services",
  "condition": "exactly one of: New, Used -- Good, Used -- Fair, Used -- Normal Wear, or empty string if not visible",
  "brand": "brand name if visible, or empty string"
}
Use empty string for any field not visible in the image.
Never invent data not present in the image.`;

    try {
      const response = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: prompt },
                { inlineData: { mimeType: 'image/jpeg', data: msg.imageBase64 } }
              ]
            }],
            generationConfig: { responseMimeType: 'application/json' }
          })
        }
      );

      if (response.status === 429) {
        sendResponse({ error: 'Rate limit reached. Try again in 60 seconds.' });
        return;
      }
      if (response.status === 403) {
        sendResponse({ error: 'API key invalid or quota exceeded.' });
        return;
      }
      if (!response.ok) {
        sendResponse({ error: 'Gemini error: HTTP ' + response.status });
        return;
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const cleaned = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      sendResponse({ success: true, data: parsed });

    } catch (err) {
      sendResponse({ error: 'OCR failed: ' + err.message });
    }
  });

  return true; // keep message channel open for async response
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
