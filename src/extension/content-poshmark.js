/**
 * Copie Past-e — Poshmark Content Script v1.4.0
 *
 * Full field mapping for Poshmark create/edit listing form.
 * Fields: title (141), description (2000), price, original price,
 * brand (required, typeahead), size (required, enum), color primary+secondary,
 * condition (NWT/NWOT/NWD/Good/Fair), category (multi-level), tags (10),
 * SKU, photos.
 * Manual trigger only — NEVER calls form.submit().
 * Requires utils.js loaded before this file.
 */

'use strict';

(function () {
  const PLATFORM = 'poshmark';
  const MAX_TITLE = 141;
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

  // ── Poshmark condition map ────────────────────────────────────────────────

  const CONDITION_MAP = {
    'new':               'nwt',
    'new with tags':     'nwt',
    'new without tags':  'nwot',
    'new with defects':  'nwd',
    'good':              'good',
    'fair':              'fair',
    'poor':              'poor',
    'excellent':         'good',
    'like new':          'nwot',
  };

  // Poshmark size values — apparel
  const POSHMARK_SIZES = [
    'XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '0X', '1X', '2X', '3X', '4X',
    '00', '0', '2', '4', '6', '8', '10', '12', '14', '16', '18', '20',
    'One Size', 'Custom',
  ];

  // ── Field Fillers ─────────────────────────────────────────────────────────

  function fillTitle(title) {
    if (!title) return;
    const val = truncate(title, MAX_TITLE);
    const ok = setField([
      'input[name="title"]',
      '#listing-title',
      'input[id*="title" i]',
      'input[aria-label*="title" i]',
      'input[placeholder*="title" i]',
    ], val);
    track('title', val, ok);
  }

  function fillDescription(desc) {
    if (!desc) return;
    const ok = setField([
      'textarea[name="description"]',
      'textarea[id*="description" i]',
      'textarea[aria-label*="description" i]',
      'textarea[placeholder*="describe" i]',
    ], desc);
    track('description', desc, ok);
  }

  function fillPrice(price) {
    if (!price && price !== 0) return;
    const numeric = String(price).replace(/[^0-9.]/g, '');
    const ok = setField([
      'input[name="price"]',
      'input[id*="price" i]',
      'input[aria-label*="listing price" i]',
      'input[placeholder*="listing price" i]',
    ], numeric);
    track('price', numeric, ok);
  }

  function fillOriginalPrice(originalPrice) {
    if (!originalPrice && originalPrice !== 0) return;
    const numeric = String(originalPrice).replace(/[^0-9.]/g, '');
    const ok = setField([
      'input[name="originalPrice"]',
      'input[name="original_price"]',
      'input[id*="original" i]',
      'input[aria-label*="original" i]',
      'input[placeholder*="original" i]',
      'input[placeholder*="retail" i]',
    ], numeric);
    track('original_price', numeric, ok);
  }

  function fillBrand(brand) {
    if (!brand) return;
    // Poshmark brand can be a text input or a typeahead
    let ok = setField([
      'input[name="brand"]',
      'input[id*="brand" i]',
      'input[aria-label*="brand" i]',
      'input[placeholder*="brand" i]',
    ], brand);
    if (!ok) {
      // Try clicking a brand button/dropdown first
      clickElement('[aria-label*="brand" i], [id*="brand" i]');
      setTimeout(() => {
        const input = document.querySelector('input[placeholder*="brand" i]');
        if (input) {
          input.value = brand;
          dispatchEvents(input);
          ok = true;
        }
        track('brand', brand, ok);
      }, 600);
      return; // async path
    }
    track('brand', brand, ok);
  }

  function fillSize(size) {
    if (!size) return;
    let ok = setSelect([
      'select[name="size"]',
      'select[id*="size" i]',
      'select[aria-label*="size" i]',
    ], size);
    if (!ok) {
      // Try button/chip group
      const buttons = document.querySelectorAll('[class*="size"] button, [aria-label*="size"] button, [data-et-element*="size"]');
      for (const btn of buttons) {
        if (btn.textContent.trim().toUpperCase() === size.toUpperCase()) {
          btn.click();
          ok = true;
          break;
        }
      }
    }
    track('size', size, ok);
  }

  function fillColor(primaryColor, secondaryColor) {
    if (primaryColor) {
      const ok = setSelect([
        'select[name="color"]',
        'select[name="primaryColor"]',
        'select[id*="primary-color" i]',
        'select[aria-label*="primary color" i]',
        'select[aria-label*="color" i]',
      ], primaryColor);
      track('color', primaryColor, ok);
    }
    if (secondaryColor) {
      const ok = setSelect([
        'select[name="secondaryColor"]',
        'select[id*="secondary-color" i]',
        'select[aria-label*="secondary color" i]',
      ], secondaryColor);
      track('secondary_color', secondaryColor, ok);
    }
  }

  function fillCondition(condition) {
    if (!condition) return;
    const mapped = CONDITION_MAP[String(condition).toLowerCase()] || String(condition);
    let ok = setSelect([
      'select[name="condition"]',
      'select[id*="condition" i]',
      'select[aria-label*="condition" i]',
    ], mapped);
    if (!ok) {
      // Poshmark sometimes uses radio inputs or clickable tiles
      const radios = document.querySelectorAll('input[type="radio"][name*="condition"]');
      for (const r of radios) {
        if (r.value.toLowerCase() === mapped.toLowerCase()) {
          r.click();
          ok = true;
          break;
        }
      }
      if (!ok) {
        const tiles = document.querySelectorAll('[class*="condition-tag"], [data-et-element*="condition"]');
        for (const tile of tiles) {
          if (tile.textContent.toLowerCase().includes(mapped.toLowerCase().slice(0,4))) {
            tile.click();
            ok = true;
            break;
          }
        }
      }
    }
    track('condition', mapped, ok);
  }

  function fillCategory(category) {
    if (!category) return;
    // Poshmark multi-level: click primary, then subcategory
    const catButton = document.querySelector([
      '[aria-label*="category" i]',
      '[id*="category" i]',
      'button[class*="category"]',
    ].join(','));
    if (catButton) {
      catButton.click();
      setTimeout(() => {
        const options = document.querySelectorAll('[role="option"], [class*="category-item"], li');
        for (const opt of options) {
          if (opt.textContent.toLowerCase().includes(String(category).toLowerCase().slice(0,5))) {
            opt.click();
            track('category', category, true);
            return;
          }
        }
        track('category', category, false);
      }, 700);
    } else {
      const ok = setSelect(['select[name*="category" i]'], category);
      track('category', category, ok);
    }
  }

  function fillTags(tags) {
    if (!tags || !tags.length) return;
    const tagInput = document.querySelector([
      'input[name="tags"]',
      'input[id*="tag" i]',
      'input[placeholder*="style tag" i]',
      'input[aria-label*="tag" i]',
    ].join(','));
    if (!tagInput) { track('tags', tags, false); return; }
    let added = 0;
    for (const tag of tags.slice(0, 10)) {
      tagInput.value = String(tag).replace(/^#/, '');
      dispatchEvents(tagInput);
      tagInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true }));
      added++;
    }
    track('tags', `${added} tags`, added > 0);
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

  function logPhotos(photos) {
    const count = Array.isArray(photos) ? photos.length : 0;
    if (count > 0) console.info(`[CopiePaste:poshmark] 📷 ${count} photo(s) — upload manually.`);
    track('photos', `${count} (manual)`, true);
  }

  // ── Main Autofill ─────────────────────────────────────────────────────────

  async function autofill(draft) {
    console.group('[CopiePaste:poshmark] Starting autofill');

    const fields = (draft.platformFields && draft.platformFields.poshmark)
      ? draft.platformFields.poshmark
      : (draft.poshmark || draft);

    await waitForElement(
      'input[name="title"], #listing-title, input[aria-label*="title" i]',
      6000
    );

    fillTitle(fields.title || draft.title);
    fillDescription(fields.description || draft.description);
    fillPrice(fields.price || draft.price);
    fillOriginalPrice(fields.originalPrice || fields.original_price);
    fillBrand(fields.brand || draft.brand);
    fillSize(fields.size || draft.size);
    fillColor(
      fields.color || fields.primaryColor || draft.color,
      fields.secondaryColor || fields.secondary_color
    );
    fillCondition(fields.condition || draft.condition);
    fillCategory(fields.category || draft.category);
    fillTags(fields.tags || draft.tags || []);
    fillSku(fields.sku || draft.sku);
    logPhotos(fields.photos || draft.photos || []);

    console.groupEnd();

    const summary = `✅ ${results.filled} filled | ❌ ${results.failed} failed | Total: ${results.total}`;
    console.info(`[CopiePaste:poshmark] ${summary}`);
    console.warn('[CopiePaste:poshmark] ⛔ MANUAL SUBMIT REQUIRED — extension does NOT submit forms.');

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
      console.error('[CopiePaste:poshmark] Autofill error:', err);
      sendResponse({ success: false, error: err.message });
    });
    return true;
  });

  console.log('[CopiePaste:poshmark] Content script v1.4.0 loaded. Awaiting TRIGGER_AUTOFILL.');
})();
