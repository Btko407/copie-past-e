/**
 * Copie Past-e — Mercari Content Script v1.4.0
 *
 * Full field mapping for Mercari new/edit listing form.
 * Fields: title (80), price, description (1000), brand, condition (1-5),
 * shipping payer, shipping method, category (multi-level), tags (10 max), photos.
 * Manual trigger only — NEVER calls form.submit().
 * Requires utils.js loaded before this file.
 */

'use strict';

(function () {
  const PLATFORM = 'mercari';
  const MAX_TITLE = 80;
  const {
    setField, setSelect, waitForElement, truncate,
    logAutofill, dispatchEvents, clickElement,
  } = window.CopieUtils;

  const results = { filled: 0, failed: 0, total: 0, log: [] };

  function track(field, value, ok) {
    results.total++;
    if (ok) results.filled++; else results.failed++;
    results.log.push({ field, status: ok ? `filled: "${String(value).slice(0,40)}"` : 'FAILED', ok });
    logAutofill(PLATFORM, field, value, ok);
  }

  // ── Mercari condition map: 1=New, 2=Like New, 3=Good, 4=Fair, 5=Poor ─────

  const CONDITION_MAP = {
    'new':        '1',
    'like new':   '2',
    'like_new':   '2',
    'good':       '3',
    'fair':       '4',
    'poor':       '5',
    '1': '1', '2': '2', '3': '3', '4': '4', '5': '5',
  };

  function fillTitle(title) {
    if (!title) return;
    const val = truncate(title, MAX_TITLE);
    const ok = setField([
      'input[name="name"]',
      '[data-testid="item-name-input"] input',
      '[data-testid="item-name-input"]',
      'input[aria-label*="name" i]',
      'input[placeholder*="name" i]',
      'input[placeholder*="title" i]',
    ], val);
    track('title', val, ok);
  }

  function fillPrice(price) {
    if (!price && price !== 0) return;
    const numeric = String(price).replace(/[^0-9.]/g, '');
    const ok = setField([
      'input[name="price"]',
      'input[aria-label*="price" i]',
      'input[placeholder*="price" i]',
    ], numeric);
    track('price', numeric, ok);
  }

  function fillDescription(desc) {
    if (!desc) return;
    const ok = setField([
      'textarea[name="description"]',
      'textarea[aria-label*="description" i]',
      'textarea[placeholder*="description" i]',
    ], desc);
    track('description', desc, ok);
  }

  function fillBrand(brand) {
    if (!brand) return;
    const ok = setField([
      'input[name="brand"]',
      'input[aria-label*="brand" i]',
      'input[placeholder*="brand" i]',
    ], brand);
    if (!ok) {
      // Some Mercari versions use a button that opens a brand picker
      clickElement('[data-testid*="brand"]');
      setTimeout(() => {
        const input = document.querySelector('input[placeholder*="brand" i]');
        if (input) {
          input.value = brand;
          dispatchEvents(input);
          track('brand', brand, true);
        } else {
          track('brand', brand, false);
        }
      }, 600);
    } else {
      track('brand', brand, ok);
    }
  }

  function fillCondition(condition) {
    if (condition == null) return;
    const mapped = CONDITION_MAP[String(condition).toLowerCase()] || String(condition);
    // Mercari uses radio buttons with value 1–5
    const radios = document.querySelectorAll('input[type="radio"][name*="condition"], input[type="radio"][value]');
    let found = false;
    for (const r of radios) {
      if (r.value === mapped) {
        r.checked = true;
        dispatchEvents(r);
        found = true;
        break;
      }
    }
    if (!found) {
      // Try select fallback
      const ok = setSelect([
        'select[name="condition"]',
        'select[aria-label*="condition" i]',
      ], mapped);
      found = ok;
    }
    track('condition', mapped, found);
  }

  function fillShippingPayer(payer) {
    if (!payer) return;
    const ok = setSelect([
      'select[name="shippingPayer"]',
      'select[name="shipping_payer"]',
      'select[aria-label*="shipping payer" i]',
      'select[aria-label*="who pays" i]',
    ], payer);
    track('shipping_payer', payer, ok);
  }

  function fillShippingMethod(method) {
    if (!method) return;
    const ok = setSelect([
      'select[name="shippingMethod"]',
      'select[name="shipping_method"]',
      'select[aria-label*="shipping method" i]',
      'select[aria-label*="shipping carrier" i]',
    ], method);
    track('shipping_method', method, ok);
  }

  function fillCategory(category) {
    if (!category) return;
    // Mercari has a multi-level category tree — attempt top-level match
    const catButton = document.querySelector([
      '[data-testid*="category"]',
      'button[aria-label*="category" i]',
      '[aria-label*="category" i]',
    ].join(','));
    if (catButton) {
      catButton.click();
      setTimeout(() => {
        // Try to find a matching option in the opened panel
        const options = document.querySelectorAll('[role="option"], [data-testid*="category-item"]');
        for (const opt of options) {
          if (opt.textContent.toLowerCase().includes(String(category).toLowerCase().slice(0, 6))) {
            opt.click();
            track('category', category, true);
            return;
          }
        }
        track('category', category, false);
      }, 800);
    } else {
      const ok = setSelect(['select[name="category"]'], category);
      track('category', category, ok);
    }
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
    for (const tag of tags.slice(0, 10)) {
      tagInput.value = String(tag);
      dispatchEvents(tagInput);
      tagInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true }));
      added++;
    }
    track('tags', `${added} tags`, added > 0);
  }

  function logPhotos(photos) {
    const count = Array.isArray(photos) ? photos.length : 0;
    if (count > 0) console.info(`[CopiePaste:mercari] 📷 ${count} photo(s) — upload manually.`);
    track('photos', `${count} (manual)`, true);
  }

  // ── Main Autofill ─────────────────────────────────────────────────────────

  async function autofill(draft) {
    console.group('[CopiePaste:mercari] Starting autofill');

    const fields = (draft.platformFields && draft.platformFields.mecari)
      ? draft.platformFields.mecari
      : (draft.mecari || draft.mercari || draft);

    await waitForElement('input[name="name"], input[placeholder*="name" i]', 6000);

    fillTitle(fields.title || draft.title);
    fillPrice(fields.price || draft.price);
    fillDescription(fields.description || draft.description);
    fillBrand(fields.brand || draft.mecariBrand || draft.brand);
    fillCondition(fields.condition || draft.mecariCondition || draft.condition);
    fillShippingPayer(fields.shippingPayer || fields.shipping_payer);
    fillShippingMethod(fields.shippingMethod || fields.shipping_method || draft.mecariShippingType);
    fillCategory(fields.category || draft.category);
    fillTags(fields.tags || draft.tags || []);
    logPhotos(fields.photos || draft.photos || []);

    console.groupEnd();

    const summary = `✅ ${results.filled} filled | ❌ ${results.failed} failed | Total: ${results.total}`;
    console.info(`[CopiePaste:mercari] ${summary}`);
    console.warn('[CopiePaste:mercari] ⛔ MANUAL SUBMIT REQUIRED — extension does NOT submit forms.');

    return {
      success: results.failed === 0,
      filled:  results.filled,
      failed:  results.failed,
      total:   results.total,
      log:     results.log,
    };
  }

  // ── Message Listener ─────────────────────────────────────────────────────
  // Handles both action:'TRIGGER_AUTOFILL' and type:'TRIGGER_AUTOFILL'

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    const trigger = message && (message.action || message.type);
    if (trigger !== 'TRIGGER_AUTOFILL') return false;
    results.filled = 0; results.failed = 0; results.total = 0; results.log = [];

    const draft = message.draft;
    if (!draft) { sendResponse({ success: false, error: 'No draft provided' }); return false; }

    autofill(draft).then(sendResponse).catch((err) => {
      console.error('[CopiePaste:mercari] Autofill error:', err);
      sendResponse({ success: false, error: err.message });
    });
    return true;
  });

  console.log('[CopiePaste:mercari] Content script v1.4.0 loaded. Awaiting TRIGGER_AUTOFILL.');
})();
