/**
 * Copie Past-e — Etsy Content Script v1.4.0
 *
 * Full field mapping for Etsy create/edit listing form.
 * Fields: title (140), price, description (rich-text/textarea), tags (13 max),
 * materials (required, comma-separated), category (typeahead), who_made,
 * when_made, is_supply, quantity, SKU, processing_time, shipping_profile,
 * weight + weight_unit, is_personalized, photos.
 * Manual trigger only — NEVER calls form.submit().
 * Requires utils.js loaded before this file.
 */

'use strict';

(function () {
  const PLATFORM = 'etsy';
  const MAX_TITLE = 140;
  const MAX_TAGS  = 13;
  const {
    setField, setSelect, setCheckbox, waitForElement,
    truncate, logAutofill, dispatchEvents, clickElement,
  } = window.CopieUtils;

  const results = { filled: 0, failed: 0, total: 0, log: [] };

  function track(field, value, ok) {
    results.total++;
    if (ok) results.filled++; else results.failed++;
    results.log.push({ field, status: ok ? `filled: "${String(value).slice(0,40)}"` : 'FAILED', ok });
    logAutofill(PLATFORM, field, value, ok);
  }

  // ── Field Fillers ─────────────────────────────────────────────────────────

  function fillTitle(title) {
    if (!title) return;
    const val = truncate(title, MAX_TITLE);
    const ok = setField([
      'input[name="title"]',
      '#listing-title-input',
      'input[id*="listing-title" i]',
      'input[aria-label*="listing title" i]',
      'input[placeholder*="title" i]',
    ], val);
    track('title', val, ok);
  }

  function fillPrice(price) {
    if (!price && price !== 0) return;
    const numeric = String(price).replace(/[^0-9.]/g, '');
    const ok = setField([
      'input[name="price"]',
      'input[id*="price" i]',
      'input[aria-label*="price" i]',
      'input[placeholder*="price" i]',
    ], numeric);
    track('price', numeric, ok);
  }

  function fillDescription(desc) {
    if (!desc) return;
    // Etsy uses either a rich-text editor or a plain textarea
    let ok = setField([
      'textarea[name="description"]',
      'textarea[id*="description" i]',
      'textarea[aria-label*="description" i]',
      'textarea[placeholder*="describe" i]',
    ], desc);
    if (!ok) {
      // Rich text editor fallback (ProseMirror/draft-js)
      const editor = document.querySelector([
        '[contenteditable="true"][class*="description"]',
        '[contenteditable="true"][aria-label*="description" i]',
        '.public-DraftEditor-content',
        '[data-contents]',
      ].join(','));
      if (editor) {
        editor.focus();
        document.execCommand('selectAll', false, null);
        document.execCommand('insertText', false, desc);
        dispatchEvents(editor);
        ok = true;
      }
    }
    track('description', desc, ok);
  }

  /**
   * Inject tags into Etsy's tag input. Etsy allows max 13 tags.
   * Tags can be entered individually (Enter or comma-separated).
   */
  function fillTags(tags) {
    if (!tags || !tags.length) return;
    const limited = tags.slice(0, MAX_TAGS);

    // Modern Etsy uses a tag chip input
    const tagInput = document.querySelector([
      'input[name="tags"]',
      'input[id*="tag" i]',
      'input[aria-label*="tag" i]',
      'input[placeholder*="tag" i]',
    ].join(','));

    if (!tagInput) { track('tags', `${limited.length} tags`, false); return; }

    let added = 0;
    for (const tag of limited) {
      const cleanTag = String(tag).replace(/,/g, ' ').trim().slice(0, 20);
      if (!cleanTag) continue;
      tagInput.focus();
      // Use nativeInputValueSetter for React
      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value');
      if (nativeSetter && nativeSetter.set) nativeSetter.set.call(tagInput, cleanTag);
      else tagInput.value = cleanTag;
      dispatchEvents(tagInput);
      // Etsy confirms tags with Enter or comma
      tagInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true }));
      tagInput.dispatchEvent(new KeyboardEvent('keyup',   { key: 'Enter', keyCode: 13, bubbles: true }));
      added++;
    }
    track('tags', `${added}/${MAX_TAGS}`, added > 0);
  }

  /**
   * Fill the "Materials" field (required on Etsy).
   * Comma-separated: 'cotton, polyester, wool'
   */
  function fillMaterials(materials) {
    if (!materials) return;
    const matStr = Array.isArray(materials) ? materials.join(', ') : String(materials);

    // Try individual material tag inputs first
    const matInput = document.querySelector([
      'input[name="materials"]',
      'input[id*="material" i]',
      'input[aria-label*="material" i]',
      'input[placeholder*="material" i]',
    ].join(','));

    if (matInput) {
      const parts = matStr.split(',').map(s => s.trim()).filter(Boolean).slice(0, 13);
      let added = 0;
      for (const part of parts) {
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value');
        if (nativeSetter && nativeSetter.set) nativeSetter.set.call(matInput, part);
        else matInput.value = part;
        dispatchEvents(matInput);
        matInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true }));
        matInput.dispatchEvent(new KeyboardEvent('keyup',   { key: 'Enter', keyCode: 13, bubbles: true }));
        added++;
      }
      track('materials', matStr, added > 0);
    } else {
      // Try textarea fallback
      const ok = setField([
        'textarea[name="materials"]',
        'textarea[aria-label*="material" i]',
      ], matStr);
      track('materials', matStr, ok);
    }
  }

  function fillWhoMade(whoMade) {
    if (!whoMade) return;
    const ok = setSelect([
      'select[name="whoMade"]',
      'select[name="who_made"]',
      'select[id*="whoMade" i]',
      'select[aria-label*="who made" i]',
    ], whoMade);
    track('who_made', whoMade, ok);
  }

  function fillWhenMade(whenMade) {
    if (!whenMade) return;
    const ok = setSelect([
      'select[name="whenMade"]',
      'select[name="when_made"]',
      'select[id*="whenMade" i]',
      'select[aria-label*="when was it made" i]',
      'select[aria-label*="when made" i]',
    ], whenMade);
    track('when_made', whenMade, ok);
  }

  function fillIsSupply(isSupply) {
    if (isSupply == null) return;
    const ok = setCheckbox([
      'input[name="isSupply"]',
      'input[name="is_supply"]',
      'input[id*="supply" i]',
      'input[aria-label*="supply" i]',
    ], Boolean(isSupply));
    track('is_supply', isSupply, ok);
  }

  function fillQuantity(quantity) {
    if (!quantity && quantity !== 0) return;
    const ok = setField([
      'input[name="quantity"]',
      'input[id*="quantity" i]',
      'input[aria-label*="quantity" i]',
      'input[placeholder*="quantity" i]',
    ], String(quantity));
    track('quantity', quantity, ok);
  }

  function fillSku(sku) {
    if (!sku) return;
    const ok = setField([
      'input[name="sku"]',
      'input[id*="sku" i]',
      'input[aria-label*="sku" i]',
      'input[placeholder*="sku" i]',
    ], sku);
    track('sku', sku, ok);
  }

  function fillProcessingTime(processingTime) {
    if (!processingTime) return;
    const ok = setSelect([
      'select[name="processingTime"]',
      'select[name="processing_time"]',
      'select[id*="processingTime" i]',
      'select[aria-label*="processing time" i]',
    ], processingTime);
    track('processing_time', processingTime, ok);
  }

  function fillShippingProfile(profile) {
    if (!profile) return;
    const ok = setSelect([
      'select[name="shippingProfile"]',
      'select[name="shipping_profile"]',
      'select[id*="shipping-profile" i]',
      'select[aria-label*="shipping profile" i]',
      'select[aria-label*="shipping template" i]',
    ], profile);
    track('shipping_profile', profile, ok);
  }

  function fillWeight(weight, weightUnit) {
    if (weightUnit) {
      const ok = setSelect([
        'select[name="weightUnit"]',
        'select[name="weight_unit"]',
        'select[id*="weight-unit" i]',
      ], weightUnit);
      track('weight_unit', weightUnit, ok);
    }
    if (weight != null) {
      const ok = setField([
        'input[name="weight"]',
        'input[id*="weight" i]',
        'input[aria-label*="weight" i]',
      ], String(weight));
      track('weight', weight, ok);
    }
  }

  function fillIsPersonalized(isPersonalized) {
    if (isPersonalized == null) return;
    // Etsy personalization is often a toggle
    if (Boolean(isPersonalized)) {
      let ok = setCheckbox([
        'input[name="isPersonalized"]',
        'input[name="is_personalized"]',
      ], true);
      if (!ok) {
        // Try clicking a toggle
        const toggle = document.querySelector('[aria-label*="personalization" i], [class*="personalization"] button');
        if (toggle) { toggle.click(); ok = true; }
      }
      track('is_personalized', isPersonalized, ok);
    }
  }

  function fillCategory(category) {
    if (!category) return;
    const catInput = document.querySelector([
      'input[aria-label*="type of item" i]',
      'input[aria-label*="category" i]',
      'input[id*="category" i]',
      'input[placeholder*="category" i]',
    ].join(','));
    if (catInput) {
      catInput.focus();
      catInput.value = category;
      dispatchEvents(catInput);
      setTimeout(() => {
        const opt = document.querySelector('[role="option"]');
        if (opt) { opt.click(); track('category', category, true); }
        else track('category', category, false);
      }, 800);
    } else {
      const ok = setSelect(['select[name*="category" i]', 'select[id*="category" i]'], category);
      track('category', category, ok);
    }
  }

  function logPhotos(photos) {
    const count = Array.isArray(photos) ? photos.length : 0;
    if (count > 0) console.info(`[CopiePaste:etsy] 📷 ${count} photo(s) — upload manually.`);
    track('photos', `${count} (manual)`, true);
  }

  // ── Main Autofill ─────────────────────────────────────────────────────────

  async function autofill(draft) {
    console.group('[CopiePaste:etsy] Starting autofill');

    const fields = (draft.platformFields && draft.platformFields.etsy)
      ? draft.platformFields.etsy
      : (draft.etsy || draft);

    await waitForElement(
      'input[name="title"], #listing-title-input, input[aria-label*="title" i]',
      8000
    );

    fillTitle(fields.title || draft.title);
    fillPrice(fields.price || draft.price);
    fillDescription(fields.description || draft.description);
    fillTags(fields.tags || draft.tags || []);
    fillMaterials(fields.materials || draft.materials);
    fillCategory(fields.category || draft.category);
    fillWhoMade(fields.whoMade || fields.who_made);
    fillWhenMade(fields.whenMade || fields.when_made);
    fillIsSupply(fields.isSupply || fields.is_supply);
    fillQuantity(fields.quantity ?? draft.quantity);
    fillSku(fields.sku || draft.sku);
    fillProcessingTime(fields.processingTime || fields.processing_time);
    fillShippingProfile(fields.shippingProfile || fields.shipping_profile);
    fillWeight(fields.weight, fields.weightUnit || fields.weight_unit);
    fillIsPersonalized(fields.isPersonalized || fields.is_personalized);
    logPhotos(fields.photos || draft.photos || []);

    console.groupEnd();

    const summary = `✅ ${results.filled} filled | ❌ ${results.failed} failed | Total: ${results.total}`;
    console.info(`[CopiePaste:etsy] ${summary}`);
    console.warn('[CopiePaste:etsy] ⛔ MANUAL SUBMIT REQUIRED — extension does NOT submit forms.');

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
      console.error('[CopiePaste:etsy] Autofill error:', err);
      sendResponse({ success: false, error: err.message });
    });
    return true;
  });

  // ── COPIE_AUTOFILL window.postMessage listener ────────────────────────────
  window.addEventListener('message', (event) => {
    if (!event.data) return;
    if (event.data.type !== 'COPIE_AUTOFILL') return;
    if (event.data.platform !== PLATFORM) return;
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

  console.log('[CopiePaste:etsy] Content script v1.4.0 loaded. Awaiting TRIGGER_AUTOFILL / COPIE_AUTOFILL.');
})();
