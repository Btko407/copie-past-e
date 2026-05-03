/**
 * Copie Past-e — Detection Script v1.3.1
 *
 * Runs at document_start on the Copie Past-e web app domain ONLY.
 * Injects window.__COPIE_PASTE_INSTALLED__ = true so the React app
 * can detect the extension before any component mounts.
 *
 * Also sends a postMessage handshake so async-loading React apps
 * can detect the extension reactively without polling.
 *
 * DO NOT add any autofill logic here. This file has ONE job.
 */

(function () {
  'use strict';

  var VERSION = '1.3.1';

  // -- 1. Inject global detection flags immediately (before React mounts) --
  try {
    window.__COPIE_PASTE_INSTALLED__ = true;
    window.__COPIE_PASTE_VERSION__   = VERSION;
  } catch (e) {
    console.warn('[CopiePaste:detection] Could not set window flag:', e);
  }

  // -- 2. postMessage handshake for async-loaded React apps -----------------
  //   Fires immediately at document_start so apps that mount early catch it.
  //   Also fires again after DOMContentLoaded for apps that mount async.
  var CAPABILITIES = ['facebook', 'mercari', 'ebay', 'poshmark', 'depop', 'etsy'];

  function sendHandshake() {
    try {
      // New unified contract: COPIE_EXTENSION_READY with capabilities array
      window.postMessage(
        {
          source: 'copie-past-e-extension',
          type: 'COPIE_EXTENSION_READY',
          version: VERSION,
          capabilities: CAPABILITIES
        },
        '*'
      );
      // Backward compat: old EXTENSION_READY type for apps still listening for it
      window.postMessage(
        { source: 'copie-extension', type: 'EXTENSION_READY', version: VERSION },
        '*'
      );
    } catch (e) {
      console.warn('[CopiePaste:detection] postMessage failed:', e);
    }
  }

  // Fire now (document_start -- catches apps that listen before DOM is ready)
  sendHandshake();

  // Fire again after DOM is ready (catches React apps that mount async)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', sendHandshake, { once: true });
  } else {
    // DOM already ready -- fire after a brief tick so app listeners register
    setTimeout(sendHandshake, 100);
  }

  // -- 3. Legacy CustomEvent for apps that listen via document events --------
  function fireCustomEvent() {
    try {
      document.dispatchEvent(
        new CustomEvent('COPIE_PASTE_INSTALLED', {
          detail: { version: VERSION },
          bubbles: false,
          cancelable: false,
        })
      );
    } catch (e) {
      console.warn('[CopiePaste:detection] Could not dispatch CustomEvent:', e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fireCustomEvent, { once: true });
  } else {
    fireCustomEvent();
  }

  console.log('[CopiePaste:detection] Extension detected -- v' + VERSION + ' flags injected.');
})();
