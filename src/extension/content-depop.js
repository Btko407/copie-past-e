/**
 * Copie Past-e — Depop Content Script v1.4.0
 *
 * Full field mapping for Depop sell item form.
 * Fields: title (70), price, description (500), category (multi-level),
 * brand, size (XXS–XXXL + shoe sizes + one-size), color (chip select),
 * condition (Brand New/Like New/Excellent/Good/Fair), hashtags (10 max), photos.
 * Manual trigger only — NEVER calls form.submit().
 * Requires utils.js loaded before this file.
 */

'use strict';

(function () {
  const PLATFORM = 'depop';
  const MAX_TITLE = 70;
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

  // ── Depop condition map ───────────────────────────────────────────────────

  const CONDITION_MAP = {
    'new':        'Brand New',
    'brand new':  'Brand New',
    'like new':   'Like New',
    'like_new':   'Like New',
    'excellent':  'Excellent',
    'good':       'Good',
    'fair':       'Fair',
  };

  // ── Field Fillers ─────────────────────────────────────────────────────────

  function fillTitle(title) {
    if (!title) return;
    const val = truncate(title, MAX_TITLE);
    const ok = setField([
      'input[name="title"]',
      'input[id*="title" i]',
      'input[aria-label*="title" i]',
      'input[placeholder*="item name" i]',
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
    const ok = setField([
      'textarea[name="description"]',
      'textarea[id*="description" i]',
      'textarea[aria-label*="description" i]',
      'textarea[placeholder*="describe" i]',
    ], desc);
    track('description', desc, ok);
  }

  function fillCategory(category) {
    if (!category) return;
    // Depop multi-level category — click trigger then find option
    const catTrigger = document.querySelector([
      '[aria-label*="category" i]',
      'button[id*="category" i]',
      '[class*="CategorySelect"]',
      'input[placeholder*="category" i]',
    ].join(','));

    if (catTrigger) {
      catTrigger.click();
      setTimeout(() => {
        const options = document.querySelectorAll('[role="option"], [class*="categoryOption"], li[class*="option"]');
        for (const opt of options) {
          if (opt.textContent.toLowerCase().includes(String(category).toLowerCase().slice(0,5))) {
            opt.click();
            track('category', category, true);
            return;
          }
        }
        // Try typing in an input if it appeared
        const input = document.querySelector('input[placeholder*="search" i], input[placeholder*="category" i]');
        if (input) {
          input.value = category;
          dispatchEvents(input);
        }
        track('category', category, false);
      }, 700);
    } else {
      const ok = setSelect(['select[name*="category" i]', 'select[id*="category" i]'], category);
      track('category', category, ok);
    }
  }

  function fillBrand(brand) {
    if (!brand) return;
    const ok = setField([
      'input[name="brand"]',
      'input[id*="brand" i]',
      'input[aria-label*="brand" i]',
      'input[placeholder*="brand" i]',
    ], brand);
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
      // Depop uses button chips for sizes
      const chips = document.querySelectorAll('[class*="SizeButton"], [class*="sizeOption"], [data-testid*="size"]');
      for (const chip of chips) {
        if (chip.textContent.trim().toUpperCase() === size.toUpperCase()) {
          chip.click();
          ok = true;
          break;
        }
      }
    }
    track('size', size, ok);
  }

  function fillColor(color) {
    if (!color) return;
    let ok = setSelect([
      'select[name="color"]',
      'select[id*="color" i]',
      'select[aria-label*="color" i]',
    ], color);
    if (!ok) {
      // Depop color chips
      const chips = document.querySelectorAll('[class*="ColorButton"], [class*="colorOption"], [aria-label*="color"]');
      for (const chip of chips) {
        const label = chip.getAttribute('aria-label') || chip.textContent;
        if (label && label.toLowerCase().includes(String(color).toLowerCase().slice(0,4))) {
          chip.click();
          ok = true;
          break;
        }
      }
    }
    track('color', color, ok);
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
      const radios = document.querySelectorAll('input[type="radio"][name*="condition"]');
      for (const r of radios) {
        const label = document.querySelector(`label[for="${r.id}"]`);
        const labelText = label ? label.textContent.trim() : r.value;
        if (labelText.toLowerCase().includes(mapped.toLowerCase().slice(0,4))) {
          r.click();
          ok = true;
          break;
        }
      }
    }
    if (!ok) {
      const tiles = document.querySelectorAll('[class*="condition"]');
      for (const tile of tiles) {
        if (tile.textContent.toLowerCase().includes(mapped.toLowerCase().slice(0,4))) {
          tile.click();
          ok = true;
          break;
        }
      }
    }
    track('condition', mapped, ok);
  }

  function fillTags(tags) {
    if (!tags || !tags.length) return;
    const tagInput = document.querySelector([
      'input[name="tags"]',
      'input[id*="tag" i]',
      'input[placeholder*="#" ]',
      'input[placeholder*="hashtag" i]',
      'input[aria-label*="tag" i]',
    ].join(','));
    if (!tagInput) { track('tags', tags, false); return; }
    let added = 0;
    for (const tag of tags.slice(0, 10)) {
      const cleanTag = String(tag).replace(/^#/, '');
      tagInput.value = `#${cleanTag}`;
      dispatchEvents(tagInput);
      tagInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true }));
      tagInput.dispatchEvent(new KeyboardEvent('keyup',  { key: 'Enter', keyCode: 13, bubbles: true }));
      added++;
    }
    track('tags', `${added} hashtags`, added > 0);
  }

  function logPhotos(photos) {
    const count = Array.isArray(photos) ? photos.length : 0;
    if (count > 0) console.info(`[CopiePaste:depop] 📷 ${count} photo(s) — upload manually.`);
    track('photos', `${count} (manual)`, true);
  }

  // ── Main Autofill ─────────────────────────────────────────────────────────

  async function autofill(draft) {
    console.group('[CopiePaste:depop] Starting autofill');

    const fields = (draft.platformFields && draft.platformFields.depop)
      ? draft.platformFields.depop
      : (draft.depop || draft);

    await waitForElement(
      'input[name="title"], input[aria-label*="title" i], input[placeholder*="item name" i]',
      6000
    );

    fillTitle(fields.title || draft.title);
    fillPrice(fields.price || draft.price);
    fillDescription(fields.description || draft.description);
    fillCategory(fields.category || draft.category);
    fillBrand(fields.brand || draft.brand);
    fillSize(fields.size || draft.size);
    fillColor(fields.color || draft.color);
    fillCondition(fields.condition || draft.condition);
    fillTags(fields.tags || draft.tags || []);
    logPhotos(fields.photos || draft.photos || []);

    console.groupEnd();

    const summary = `✅ ${results.filled} filled | ❌ ${results.failed} failed | Total: ${results.total}`;
    console.info(`[CopiePaste:depop] ${summary}`);
    console.warn('[CopiePaste:depop] ⛔ MANUAL SUBMIT REQUIRED — extension does NOT submit forms.');

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
      console.error('[CopiePaste:depop] Autofill error:', err);
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

  console.log('[CopiePaste:depop] Content script v1.4.0 loaded. Awaiting TRIGGER_AUTOFILL / COPIE_AUTOFILL.');
})();
