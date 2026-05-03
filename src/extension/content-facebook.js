/**
 * Copie Past-e — Facebook Marketplace Content Script v1.4.0
 *
 * Full field mapping for Facebook Marketplace create/edit listing.
 * Fields: title (200), price, description (5000), category (combobox),
 * condition (New/Used levels), location, availability, tags (20 max), photos.
 * Manual trigger only — NEVER calls form.submit().
 * Requires utils.js loaded before this file.
 */

'use strict';

(function () {
  const PLATFORM = 'facebook';
  const MAX_TITLE = 200;
  const { setField, setSelect, setCheckbox, waitForElement, truncate, logAutofill, dispatchEvents } = window.CopieUtils;

  // ── Autofill Result Tracker ────────────────────────────────────────────────

  const results = { filled: 0, failed: 0, total: 0, log: [] };

  function track(field, value, ok) {
    results.total++;
    if (ok) results.filled++; else results.failed++;
    results.log.push({ field, status: ok ? `filled: "${String(value).slice(0,40)}"` : 'FAILED', ok });
    logAutofill(PLATFORM, field, value, ok);
  }

  // ── Field Setters ─────────────────────────────────────────────────────────

  function fillTitle(title) {
    if (!title) return;
    const val = truncate(title, MAX_TITLE);
    const ok = setField([
      'input[name="title"]',
      '[data-testid="marketplace-listing-title"] input',
      '[data-testid="marketplace-listing-title"]',
      'input[aria-label*="title" i]',
      'input[placeholder*="title" i]',
    ], val);
    track('title', val, ok);
  }

  function fillPrice(price) {
    if (!price && price !== 0) return;
    const numeric = String(price).replace(/[^0-9.]/g, '');
    const ok = setField([
      'input[name="price"]',
      '[data-testid="marketplace-price-input"] input',
      '[data-testid="marketplace-price-input"]',
      'input[aria-label*="price" i]',
      'input[placeholder*="price" i]',
    ], numeric);
    track('price', numeric, ok);
  }

  function fillDescription(desc) {
    if (!desc) return;
    const ok = setField([
      'textarea[name="description"]',
      '[data-testid="marketplace-listing-description"] textarea',
      '[data-testid="marketplace-listing-description"]',
      'textarea[aria-label*="description" i]',
      'textarea[placeholder*="description" i]',
    ], desc);
    track('description', desc, ok);
  }

  function fillCategory(category) {
    if (!category) return;
    // Facebook uses a combobox or searchable dropdown
    const catInput = document.querySelector([
      'input[aria-label*="category" i]',
      '[data-testid*="category"] input',
      'input[placeholder*="category" i]',
    ].join(','));
    if (catInput) {
      catInput.focus();
      catInput.value = category;
      dispatchEvents(catInput);
      // Wait briefly for dropdown then click first matching option
      setTimeout(() => {
        const option = document.querySelector('[role="option"]');
        if (option && option.textContent.toLowerCase().includes(category.toLowerCase().slice(0, 5))) {
          option.click();
          track('category', category, true);
        } else {
          track('category', category, false);
        }
      }, 800);
    } else {
      const ok = setSelect([
        'select[name="category"]',
        'select[aria-label*="category" i]',
      ], category);
      track('category', category, ok);
    }
  }

  function fillCondition(condition) {
    if (!condition) return;
    // FB condition values: New, Used - Like New, Used - Good, Used - Fair
    const conditionMap = {
      'new':          'New',
      'like new':     'Used - Like New',
      'like_new':     'Used - Like New',
      'good':         'Used - Good',
      'fair':         'Used - Fair',
      'poor':         'Used - Fair',
    };
    const mapped = conditionMap[String(condition).toLowerCase()] || condition;
    const ok = setSelect([
      'select[name="condition"]',
      '[aria-label*="condition" i] select',
      'select[aria-label*="condition" i]',
    ], mapped);
    // Try radio/button approach if select fails
    if (!ok) {
      const buttons = document.querySelectorAll('[role="radio"], [role="option"]');
      let found = false;
      for (const btn of buttons) {
        if (btn.textContent.trim().toLowerCase().includes(mapped.toLowerCase())) {
          btn.click();
          found = true;
          break;
        }
      }
      track('condition', mapped, found);
    } else {
      track('condition', mapped, ok);
    }
  }

  function fillLocation(location) {
    if (!location) return;
    const ok = setField([
      'input[name="location"]',
      'input[aria-label*="location" i]',
      'input[aria-label*="city" i]',
      'input[placeholder*="city" i]',
      'input[placeholder*="zip" i]',
    ], location);
    track('location', location, ok);
  }

  function fillAvailability(availability) {
    if (!availability) return;
    const ok = setSelect([
      'select[name="availability"]',
      '[aria-label*="availability" i] select',
    ], availability);
    track('availability', availability, ok);
  }

  function fillTags(tags) {
    if (!tags || !tags.length) return;
    const tagInput = document.querySelector([
      'input[name="tags"]',
      'input[aria-label*="tag" i]',
      'input[placeholder*="tag" i]',
    ].join(','));
    if (!tagInput) { track('tags', tags, false); return; }
    let added = 0;
    for (const tag of tags.slice(0, 20)) {
      tagInput.focus();
      tagInput.value = String(tag);
      dispatchEvents(tagInput);
      // Simulate Enter to add tag
      tagInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true }));
      tagInput.dispatchEvent(new KeyboardEvent('keyup',  { key: 'Enter', keyCode: 13, bubbles: true }));
      added++;
    }
    track('tags', `${added} tags`, added > 0);
  }

  function logPhotos(photos) {
    const count = Array.isArray(photos) ? photos.length : 0;
    // Cannot inject files programmatically — inform user
    if (count > 0) {
      console.info(`[CopiePaste:facebook] 📷 ${count} photo(s) in draft. Please upload manually via the photo picker.`);
    }
    track('photos', `${count} photos (manual upload required)`, true);
  }

  // ── Main Autofill ─────────────────────────────────────────────────────────

  async function autofill(draft) {
    console.group('[CopiePaste:facebook] Starting autofill');

    // Extract fields — support both flat draft and nested platformFields shape
    const fields = (draft.platformFields && draft.platformFields.facebook)
      ? draft.platformFields.facebook
      : (draft.facebook || draft);

    await waitForElement('input[name="title"], input[aria-label*="title" i], [data-testid="marketplace-listing-title"]', 6000);

    fillTitle(fields.title || draft.title);
    fillPrice(fields.price || draft.price);
    fillDescription(fields.description || draft.description);
    fillCategory(fields.category || draft.category);
    fillCondition(fields.condition || draft.condition);
    fillLocation(fields.location || draft.location);
    fillAvailability(fields.availability);
    fillTags(fields.tags || draft.tags || []);
    logPhotos(fields.photos || draft.photos || []);

    console.groupEnd();

    const summary = `✅ ${results.filled} filled | ❌ ${results.failed} failed | Total: ${results.total}`;
    console.info(`[CopiePaste:facebook] ${summary}`);
    console.warn('[CopiePaste:facebook] ⛔ MANUAL SUBMIT REQUIRED — extension does NOT submit forms.');

    return {
      success: results.failed === 0,
      filled:  results.filled,
      failed:  results.failed,
      total:   results.total,
      log:     results.log,
    };
  }

  // ── Message Listener ─────────────────────────────────────────────────────
  // Handles both action:'TRIGGER_AUTOFILL' and type:'TRIGGER_AUTOFILL' for compatibility

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    const trigger = message && (message.action || message.type);
    if (trigger !== 'TRIGGER_AUTOFILL') return false;
    // Reset counters for each invocation
    results.filled = 0; results.failed = 0; results.total = 0; results.log = [];

    const draft = message.draft;
    if (!draft) {
      sendResponse({ success: false, error: 'No draft provided' });
      return false;
    }

    autofill(draft).then(sendResponse).catch((err) => {
      console.error('[CopiePaste:facebook] Autofill error:', err);
      sendResponse({ success: false, error: err.message });
    });
    return true; // async
  });

  // ── COPIE_AUTOFILL window.postMessage listener (new unified contract) ────
  // Fires when the web app sends { type:'COPIE_AUTOFILL', platform:'facebook', payload }
  // Returns a COPIE_AUTOFILL_RESULT message to the page.
  window.addEventListener('message', (event) => {
    if (!event.data) return;
    if (event.data.type !== 'COPIE_AUTOFILL') return;
    if (event.data.platform !== PLATFORM) return;
    // Reset counters for each invocation
    results.filled = 0; results.failed = 0; results.total = 0; results.log = [];

    const payload = event.data.payload || {};
    autofill(payload).then((res) => {
      window.postMessage({
        source: 'copie-past-e-extension',
        type: 'COPIE_AUTOFILL_RESULT',
        ok: res.success,
        platform: PLATFORM,
        filled: res.log.filter((l) => l.ok).map((l) => l.field),
        failed: res.log.filter((l) => !l.ok).map((l) => l.field),
        warnings: [],
      }, '*');
    }).catch((err) => {
      window.postMessage({
        source: 'copie-past-e-extension',
        type: 'COPIE_AUTOFILL_RESULT',
        ok: false,
        platform: PLATFORM,
        filled: [],
        failed: ['autofill_error'],
        warnings: [err.message],
      }, '*');
    });
  });

  console.log('[CopiePaste:facebook] Content script v1.4.0 loaded. Awaiting TRIGGER_AUTOFILL / COPIE_AUTOFILL.');
})();
