// Copie Past-e Smart Post — Background Service Worker (Manifest V3)
// Version: 1.2.0
// Receives SMART_POST messages, saves listing data, opens marketplace tab.
// Supports Gemini OCR scan via GEMINI_OCR_SCAN handler.

"use strict";

// ── Marketplace URLs ────────────────────────────────────────────────────────

const PLATFORM_URLS = {
  facebook: "https://www.facebook.com/marketplace/create/item",
  mercari:  "https://www.mercari.com/sell/",
};

// ── onInstalled ─────────────────────────────────────────────────────────────

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    console.log("[Copie Past-e] Extension installed — Smart Post ready.");
  } else if (details.reason === "update") {
    console.log(`[Copie Past-e] Extension updated to v${chrome.runtime.getManifest().version}`);
  }
});

// ── Gemini API key storage ─────────────────────────────────────────────────

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
  // Also support SET_GEMINI_API_KEY variant (from admin settings page sync)
  if (msg.type === 'SET_GEMINI_API_KEY') {
    chrome.storage.local.set({ geminiApiKey: msg.key }, () => {
      sendResponse({ success: true });
    });
    return true;
  }
});

// ── Gemini OCR scan handler (GEMINI_OCR_SCAN) ───────────────────────────────

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type !== 'GEMINI_OCR_SCAN') return false;

  chrome.storage.local.get('geminiApiKey', async (result) => {
    const apiKey = result.geminiApiKey;
    if (!apiKey) {
      sendResponse({ error: 'Gemini API key not configured in extension.' });
      return;
    }

    if (!msg.imageBase64) {
      sendResponse({ error: 'No image data provided.' });
      return;
    }

    const prompt = `You are a marketplace listing data extractor.
      Analyze this listing image and extract the following fields.
      Return ONLY a valid JSON object with no markdown, no explanation:
      {
        "title": "the item name or listing title",
        "price": "numeric price only, no currency symbols",
        "description": "the full item description",
        "category": "exactly one of: Appliances, Automotive, Baby & Kids,
          Books & Magazines, Clothing & Shoes, Collectibles,
          Electronics & Media, Furniture, Home & Garden,
          Jewelry & Accessories, Tools & Machinery,
          Office Supplies, Services",
        "condition": "exactly one of: New, Used -- Good, Used -- Fair,
          Used -- Normal Wear, or empty string if not visible",
        "brand": "brand name if visible, or empty string"
      }
      Use empty string for any field not visible in the image.
      Never invent data not present in the image.`;

    try {
      const response = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=' + apiKey,
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
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

      // ── Robust JSON parsing with retry ─────────────────────────────────────
      function stripFences(text) {
        return text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
      }

      let parsed = null;
      let parseError = null;

      // Attempt 1: strip fences and parse
      try {
        parsed = JSON.parse(stripFences(rawText));
      } catch (e1) {
        parseError = e1;
        // Attempt 2: additional whitespace trim and retry
        try {
          parsed = JSON.parse(stripFences(rawText).replace(/\n/g, ' ').replace(/\r/g, ''));
        } catch (e2) {
          parseError = e2;
        }
      }

      if (!parsed) {
        console.warn('[Copie Past-e OCR] JSON parse failed:', parseError?.message, '| Raw:', rawText.slice(0, 200));
        sendResponse({ error: 'OCR failed: Could not parse response as JSON' });
        return;
      }

      // ── Normalize output — always emit all 6 fields ──────────────────────
      const normalized = {
        title:       String(parsed.title       || '').trim(),
        price:       String(parsed.price       || '').trim(),
        description: String(parsed.description || '').trim(),
        category:    String(parsed.category    || '').trim(),
        condition:   String(parsed.condition   || '').trim(),
        brand:       String(parsed.brand       || '').trim(),
      };

      // Validate at least one useful field was extracted
      const hasData = Object.values(normalized).some((v) => v.length > 0);
      if (!hasData) {
        sendResponse({ error: 'OCR returned no usable field data.' });
        return;
      }

      sendResponse({ success: true, data: normalized });

    } catch (err) {
      sendResponse({ error: 'OCR failed: ' + err.message });
    }
  });

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

  // Normalize: always use "images" key for Facebook content script
  const normalizedListing = { ...listing };
  if (!normalizedListing.images && normalizedListing.photos) {
    normalizedListing.images = normalizedListing.photos;
  }

  if (!normalizedListing.images || normalizedListing.images.length === 0) {
    console.warn("[Copie Past-e] SMART_POST: no images in payload — continuing without images.");
  }

  // Ensure all expected fields are present
  const payload = {
    title:       normalizedListing.title       || '',
    description: normalizedListing.description || '',
    price:       normalizedListing.price       || '',
    category:    normalizedListing.category    || '',
    condition:   normalizedListing.condition   || '',
    brand:       normalizedListing.brand       || '',
    images:      normalizedListing.images      || [],
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
