/**
 * Copie Past-e Extension — Shared Utilities
 * Defensive DOM helpers for React/Vue/SPA-compatible autofill.
 * All functions are null-safe and log failures without throwing.
 */

'use strict';

/**
 * Fire all framework-compatibility events on an element.
 * @param {Element} el
 */
function dispatchEvents(el) {
  if (!el) return;
  ['input', 'change', 'blur'].forEach((type) => {
    try {
      el.dispatchEvent(new Event(type, { bubbles: true, cancelable: true }));
    } catch (e) {
      // Non-fatal
    }
  });
}

/**
 * Set a text/number input or textarea value and fire React-compatible events.
 * @param {string|string[]} selectors  One or more CSS selectors, tried in order.
 * @param {string} value
 * @returns {boolean} true if a field was found and set
 */
function setField(selectors, value) {
  const list = Array.isArray(selectors) ? selectors : [selectors];
  for (const sel of list) {
    try {
      const el = document.querySelector(sel);
      if (!el) continue;
      // React synthetic event compatibility via nativeInputValueSetter
      const nativeSetter =
        Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value') ||
        Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value');
      if (nativeSetter && nativeSetter.set) {
        nativeSetter.set.call(el, value);
      } else {
        el.value = value;
      }
      dispatchEvents(el);
      return true;
    } catch (e) {
      console.warn('[CopiePaste] setField error for selector', sel, e);
    }
  }
  return false;
}

/**
 * Set a <select> element by value or visible text (case-insensitive).
 * @param {string|string[]} selectors
 * @param {string} value
 * @returns {boolean}
 */
function setSelect(selectors, value) {
  const list = Array.isArray(selectors) ? selectors : [selectors];
  for (const sel of list) {
    try {
      const el = document.querySelector(sel);
      if (!el || el.tagName !== 'SELECT') continue;
      const lower = String(value).toLowerCase();
      // Try exact value first
      for (const opt of el.options) {
        if (opt.value.toLowerCase() === lower || opt.text.toLowerCase() === lower) {
          el.value = opt.value;
          dispatchEvents(el);
          return true;
        }
      }
      // Partial text match fallback
      for (const opt of el.options) {
        if (opt.text.toLowerCase().includes(lower)) {
          el.value = opt.value;
          dispatchEvents(el);
          return true;
        }
      }
    } catch (e) {
      console.warn('[CopiePaste] setSelect error for selector', sel, e);
    }
  }
  return false;
}

/**
 * Set a checkbox to a specific checked state.
 * @param {string|string[]} selectors
 * @param {boolean} checked
 * @returns {boolean}
 */
function setCheckbox(selectors, checked) {
  const list = Array.isArray(selectors) ? selectors : [selectors];
  for (const sel of list) {
    try {
      const el = document.querySelector(sel);
      if (!el || el.type !== 'checkbox') continue;
      if (el.checked !== checked) {
        el.checked = checked;
        dispatchEvents(el);
      }
      return true;
    } catch (e) {
      console.warn('[CopiePaste] setCheckbox error for selector', sel, e);
    }
  }
  return false;
}

/**
 * Simulate character-by-character typing for SPA frameworks that need
 * keyboard events (e.g. contenteditable, ProseMirror).
 * @param {Element} el
 * @param {string} text
 */
function typeIntoField(el, text) {
  if (!el) return;
  try {
    el.focus();
    for (const char of String(text)) {
      el.dispatchEvent(new KeyboardEvent('keydown', { key: char, bubbles: true }));
      el.dispatchEvent(new KeyboardEvent('keypress', { key: char, bubbles: true }));
      if (el.isContentEditable) {
        document.execCommand('insertText', false, char);
      } else {
        el.value = (el.value || '') + char;
      }
      el.dispatchEvent(new KeyboardEvent('keyup', { key: char, bubbles: true }));
      el.dispatchEvent(new InputEvent('input', { data: char, bubbles: true }));
    }
    dispatchEvents(el);
  } catch (e) {
    console.warn('[CopiePaste] typeIntoField error', e);
  }
}

/**
 * Truncate text at a word boundary, never exceeding maxLen characters.
 * @param {string} text
 * @param {number} maxLen
 * @returns {string}
 */
function truncate(text, maxLen) {
  if (!text) return '';
  if (text.length <= maxLen) return text;
  const cut = text.lastIndexOf(' ', maxLen);
  return cut > 0 ? text.slice(0, cut) : text.slice(0, maxLen);
}

/**
 * Wait for a DOM element matching selector to appear, with timeout.
 * @param {string} selector
 * @param {number} [timeout=8000]
 * @returns {Promise<Element|null>}
 */
function waitForElement(selector, timeout = 8000) {
  return new Promise((resolve) => {
    const existing = document.querySelector(selector);
    if (existing) return resolve(existing);
    const start = Date.now();
    const observer = new MutationObserver(() => {
      const el = document.querySelector(selector);
      if (el) {
        observer.disconnect();
        resolve(el);
      } else if (Date.now() - start > timeout) {
        observer.disconnect();
        resolve(null);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    // Fallback timeout
    setTimeout(() => {
      observer.disconnect();
      resolve(document.querySelector(selector));
    }, timeout);
  });
}

/**
 * Structured console log for autofill events.
 * @param {string} platform
 * @param {string} field
 * @param {string} value
 * @param {boolean} success
 */
function logAutofill(platform, field, value, success) {
  const icon = success ? '✅' : '❌';
  const displayVal = String(value || '').slice(0, 60);
  console.log(`[CopiePaste:${platform}] ${icon} ${field}: "${displayVal}"`);
}

/**
 * Validate that a URL points to a supported image format.
 * @param {string} url
 * @returns {boolean}
 */
function validateImage(url) {
  if (!url || typeof url !== 'string') return false;
  return /\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?.*)?$/i.test(url);
}

/**
 * Click a button/element matching the selector (for triggering dropdowns etc).
 * Never used for form submit.
 * @param {string|string[]} selectors
 * @returns {boolean}
 */
function clickElement(selectors) {
  const list = Array.isArray(selectors) ? selectors : [selectors];
  for (const sel of list) {
    try {
      const el = document.querySelector(sel);
      if (!el) continue;
      el.click();
      return true;
    } catch (e) {
      console.warn('[CopiePaste] clickElement error for selector', sel, e);
    }
  }
  return false;
}

/**
 * Set a contenteditable element's text content and fire events.
 * @param {string|string[]} selectors
 * @param {string} value
 * @returns {boolean}
 */
function setContentEditable(selectors, value) {
  const list = Array.isArray(selectors) ? selectors : [selectors];
  for (const sel of list) {
    try {
      const el = document.querySelector(sel);
      if (!el || !el.isContentEditable) continue;
      el.focus();
      document.execCommand('selectAll', false, null);
      document.execCommand('insertText', false, value);
      dispatchEvents(el);
      return true;
    } catch (e) {
      console.warn('[CopiePaste] setContentEditable error for selector', sel, e);
    }
  }
  return false;
}

// Export for use by content scripts loaded in the same context
window.CopieUtils = {
  setField,
  setSelect,
  setCheckbox,
  typeIntoField,
  truncate,
  waitForElement,
  logAutofill,
  validateImage,
  clickElement,
  setContentEditable,
  dispatchEvents,
};
