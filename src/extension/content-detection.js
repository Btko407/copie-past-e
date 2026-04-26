/**
 * Copie Past-e — Detection Script
 *
 * Runs at document_start on the Copie Past-e web app domain ONLY.
 * Injects window.__COPIE_PASTE_INSTALLED__ = true so the React app
 * can detect the extension before any component mounts.
 *
 * Also dispatches a CustomEvent for apps that listen reactively.
 *
 * DO NOT add any autofill logic here. This file has ONE job.
 */

(function () {
  'use strict';

  // Inject the global detection flag immediately — available before React mounts
  try {
    window.__COPIE_PASTE_INSTALLED__ = true;
    window.__COPIE_PASTE_VERSION__   = '1.4.0';
  } catch (e) {
    // Rare: window not accessible in some sandboxed contexts — non-fatal
    console.warn('[CopiePaste:detection] Could not set window flag:', e);
  }

  // Dispatch a CustomEvent so the app can reactively respond without polling
  // document_start: document may not have a body yet, so target document itself
  function fireEvent() {
    try {
      document.dispatchEvent(
        new CustomEvent('COPIE_PASTE_INSTALLED', {
          detail: { version: '1.4.0' },
          bubbles: false,
          cancelable: false,
        })
      );
    } catch (e) {
      console.warn('[CopiePaste:detection] Could not dispatch event:', e);
    }
  }

  // If document is already interactive/complete, fire now; otherwise wait for DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fireEvent, { once: true });
  } else {
    fireEvent();
  }

  console.log('[CopiePaste:detection] Extension detected — v1.4.0 flag injected.');
})();
