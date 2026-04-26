/**
 * Copie Past-e — eBay Content Script v1.4.0
 *
 * Full field mapping for eBay "Sell your item" form.
 * Fields: title (80), price, description (CKEditor/textarea), category,
 * conditionId (1000=New…7000=Parts), brand, model, UPC, MPN, color,
 * size, material, country of manufacture, quantity, location, photos.
 * Manual trigger only — NEVER calls form.submit().
 * Requires utils.js loaded before this file.
 */

'use strict';

(function () {
  const PLATFORM = 'ebay';
  const MAX_TITLE = 80;
  const {
    setField, setSelect, setContentEditable, waitForElement,
    truncate, logAutofill, dispatchEvents, clickElement,
  } = window.CopieUtils;

  const results = { filled: 0, failed: 0, total: 0, log: [] };

  function track(field, value, ok) {
    results.total++;
    if (ok) results.filled++; else results.failed++;
    results.log.push({ field, status: ok ? `filled: "${String(value).slice(0,40)}"` : 'FAILED', ok });
    logAutofill(PLATFORM, field, value, ok);
  }

  // ── eBay Condition IDs ────────────────────────────────────────────────────
  // 1000=New, 1500=New Other, 2000=Cert.Refurb, 2500=Seller Refurb,
  // 3000=Used, 4000=Very Good, 5000=Good, 6000=Acceptable, 7000=For parts

  const CONDITION_ID_MAP = {
    'new':                    '1000',
    'new other':              '1500',
    'new_other':              '1500',
    'certified refurbished':  '2000',
    'seller refurbished':     '2500',
    'used':                   '3000',
    'very good':              '4000',
    'very_good':              '4000',
    'good':                   '5000',
    'acceptable':             '6000',
    'for parts':              '7000',
    'for_parts':              '7000',
  };

  // ── Item Specifics Helper ─────────────────────────────────────────────────

  /**
   * Fill an "Item Specifics" field by label text (eBay new listing flow).
   * eBay renders these as labelled input rows.
   */
  function fillItemSpecific(labelText, value) {
    if (!value) return false;
    try {
      // Find a label/th that matches the text, then find sibling input
      const labels = document.querySelectorAll(
        'label, .field-name, th, [class*="label"], [class*="itemSpecific"] span'
      );
      for (const label of labels) {
        if (label.textContent.trim().toLowerCase() === labelText.toLowerCase()) {
          // Try sibling input
          const parent = label.closest('tr, .field-row, .item-specific-row, [class*="row"]');
          if (parent) {
            const input = parent.querySelector('input, select, textarea');
            if (input) {
              if (input.tagName === 'SELECT') {
                setSelect([], value); // won't match — use direct
                for (const opt of input.options) {
                  if (opt.value.toLowerCase() === String(value).toLowerCase()
                   || opt.text.toLowerCase()  === String(value).toLowerCase()) {
                    input.value = opt.value;
                    dispatchEvents(input);
                    return true;
                  }
                }
              } else {
                const nativeSetter = Object.getOwnPropertyDescriptor(
                  window.HTMLInputElement.prototype, 'value'
                );
                if (nativeSetter && nativeSetter.set) nativeSetter.set.call(input, value);
                else input.value = value;
                dispatchEvents(input);
                return true;
              }
            }
          }
        }
      }
    } catch (e) {
      console.warn('[CopiePaste:ebay] fillItemSpecific error:', e);
    }
    return false;
  }

  // ── Field Fillers ─────────────────────────────────────────────────────────

  function fillTitle(title) {
    if (!title) return;
    const val = truncate(title, MAX_TITLE);
    const ok = setField([
      'input#gh-ac',
      'input[name="Title"]',
      '#TITLE input',
      'input[id*="title" i]',
      'input[aria-label*="listing title" i]',
      'input[placeholder*="title" i]',
    ], val);
    track('title', val, ok);
  }

  function fillPrice(price) {
    if (!price && price !== 0) return;
    const numeric = String(price).replace(/[^0-9.]/g, '');
    const ok = setField([
      'input[id*="BuyItNowPrice" i]',
      'input[name*="price" i]',
      'input[aria-label*="buy it now" i]',
      'input[aria-label*="price" i]',
      '#PRICE input',
      'input[placeholder*="price" i]',
    ], numeric);
    track('price', numeric, ok);
  }

  function fillDescription(desc) {
    if (!desc) return;
    // eBay uses CKEditor (iframe) or a plain textarea
    let ok = false;

    // Try CKEditor iframe
    try {
      const iframes = document.querySelectorAll('iframe[id*="descriptioneditor" i], iframe[title*="description" i]');
      for (const iframe of iframes) {
        const iDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (iDoc && iDoc.body && iDoc.body.isContentEditable) {
          iDoc.body.innerHTML = '';
          iDoc.body.focus();
          document.execCommand('insertText', false, desc);
          ok = true;
          break;
        }
      }
    } catch (e) { /* cross-origin guard */ }

    // Fallback to contenteditable or textarea
    if (!ok) {
      ok = setContentEditable([
        '[id*="description" i][contenteditable]',
        '.cke_editable',
        '[data-editor-id*="description"]',
      ], desc);
    }
    if (!ok) {
      ok = setField([
        'textarea[name*="description" i]',
        'textarea[id*="description" i]',
        'textarea[aria-label*="description" i]',
      ], desc);
    }
    track('description', desc, ok);
  }

  function fillCondition(conditionId) {
    if (conditionId == null) return;
    const mapped = CONDITION_ID_MAP[String(conditionId).toLowerCase()] || String(conditionId);
    // eBay renders condition as a select or button group
    let ok = setSelect([
      'select[id*="conditionId" i]',
      'select[id*="condition" i]',
      'select[name*="condition" i]',
      '#CONDITION select',
    ], mapped);
    if (!ok) {
      // Try hidden input injection (SPA rendering)
      const hiddenInput = document.querySelector('input[name*="conditionId" i]');
      if (hiddenInput) {
        hiddenInput.value = mapped;
        dispatchEvents(hiddenInput);
        ok = true;
      }
    }
    track('conditionId', mapped, ok);
  }

  function fillBrand(brand) {
    if (!brand) return;
    const ok = fillItemSpecific('Brand', brand)
      || setField([
        'input[aria-label*="brand" i]',
        'input[placeholder*="brand" i]',
        '#BRAND input',
      ], brand);
    track('brand', brand, ok);
  }

  function fillModel(model) {
    if (!model) return;
    const ok = fillItemSpecific('Model', model);
    track('model', model, ok);
  }

  function fillUpc(upc) {
    if (!upc) return;
    const ok = fillItemSpecific('UPC', upc)
      || setField([
        'input[aria-label*="upc" i]',
        'input[name*="upc" i]',
        '#UPC input',
      ], upc);
    track('upc', upc, ok);
  }

  function fillMpn(mpn) {
    if (!mpn) return;
    const ok = fillItemSpecific('MPN', mpn)
      || fillItemSpecific('Manufacturer Part Number', mpn)
      || setField(['input[aria-label*="mpn" i]', 'input[name*="mpn" i]'], mpn);
    track('mpn', mpn, ok);
  }

  function fillColor(color) {
    if (!color) return;
    const ok = fillItemSpecific('Color', color)
      || fillItemSpecific('Colour', color);
    track('color', color, ok);
  }

  function fillSize(size) {
    if (!size) return;
    const ok = fillItemSpecific('Size', size)
      || fillItemSpecific('Size Type', size);
    track('size', size, ok);
  }

  function fillMaterial(material) {
    if (!material) return;
    const ok = fillItemSpecific('Material', material);
    track('material', material, ok);
  }

  function fillCountryOfManufacture(country) {
    if (!country) return;
    const ok = fillItemSpecific('Country/Region of Manufacture', country)
      || fillItemSpecific('Country of Manufacture', country)
      || setSelect([
        'select[id*="countryOfManufacture" i]',
        'select[name*="country" i]',
      ], country);
    track('country_of_manufacture', country, ok);
  }

  function fillQuantity(quantity) {
    if (!quantity && quantity !== 0) return;
    const ok = setField([
      'input[name*="quantity" i]',
      'input[id*="quantity" i]',
      'input[aria-label*="quantity" i]',
      '#QUANTITY input',
    ], String(quantity));
    track('quantity', quantity, ok);
  }

  function fillLocation(location) {
    if (!location) return;
    const ok = setField([
      'input[name*="location" i]',
      'input[id*="location" i]',
      'input[aria-label*="item location" i]',
      '#ITEM_LOCATION input',
    ], location);
    track('location', location, ok);
  }

  function fillCategory(category) {
    if (!category) return;
    // eBay category is usually selected via a breadcrumb tree — try text match
    const catInput = document.querySelector([
      'input[aria-label*="category" i]',
      'input[id*="category" i]',
      '#CATEGORY input',
    ].join(','));
    if (catInput) {
      catInput.focus();
      catInput.value = category;
      dispatchEvents(catInput);
      setTimeout(() => {
        const opt = document.querySelector('[role="option"]');
        if (opt) opt.click();
        track('category', category, !!opt);
      }, 800);
    } else {
      const ok = setSelect(['select[name*="category" i]', 'select[id*="category" i]'], category);
      track('category', category, ok);
    }
  }

  function logPhotos(photos) {
    const count = Array.isArray(photos) ? photos.length : 0;
    if (count > 0) console.info(`[CopiePaste:ebay] 📷 ${count} photo(s) — upload manually.`);
    track('photos', `${count} (manual)`, true);
  }

  // ── Main Autofill ─────────────────────────────────────────────────────────

  async function autofill(draft) {
    console.group('[CopiePaste:ebay] Starting autofill');

    const fields = (draft.platformFields && draft.platformFields.ebay)
      ? draft.platformFields.ebay
      : (draft.ebay || draft);

    await waitForElement(
      'input[name="Title"], #TITLE input, input[aria-label*="title" i]',
      8000
    );

    fillTitle(fields.title || draft.title);
    fillPrice(fields.price || draft.price);
    fillDescription(fields.description || draft.description);
    fillCondition(fields.conditionId || fields.condition || draft.condition);
    fillCategory(fields.category || draft.category);
    fillBrand(fields.brand || draft.brand);
    fillModel(fields.model);
    fillUpc(fields.upc);
    fillMpn(fields.mpn);
    fillColor(fields.color);
    fillSize(fields.size);
    fillMaterial(fields.material);
    fillCountryOfManufacture(fields.countryOfManufacture || fields.country_of_manufacture);
    fillQuantity(fields.quantity);
    fillLocation(fields.location || draft.location);
    logPhotos(fields.photos || draft.photos || []);

    console.groupEnd();

    const summary = `✅ ${results.filled} filled | ❌ ${results.failed} failed | Total: ${results.total}`;
    console.info(`[CopiePaste:ebay] ${summary}`);
    console.warn('[CopiePaste:ebay] ⛔ MANUAL SUBMIT REQUIRED — extension does NOT submit forms.');

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
      console.error('[CopiePaste:ebay] Autofill error:', err);
      sendResponse({ success: false, error: err.message });
    });
    return true;
  });

  console.log('[CopiePaste:ebay] Content script v1.4.0 loaded. Awaiting TRIGGER_AUTOFILL.');
})();
