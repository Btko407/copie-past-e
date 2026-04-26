/**
 * Copie Past-e — Background Service Worker (Manifest V3) v1.4.0
 *
 * Responsibilities:
 *  1. On install/startup: check extension version against backend canister
 *  2. Show update badge/notification if force-update is required
 *  3. Route AUTOFILL_DRAFT messages from popup → active tab content script
 *  4. Persist the latest platform draft in chrome.storage.local
 *  5. Throttle version checks via chrome.storage.local timestamp
 */

'use strict';

const EXTENSION_VERSION  = '1.4.0';
const BACKEND_VERSION_URL = 'https://5wn4j-jiaaa-aaaag-at6ra-cai.icp0.io/api/extension/version';
const BADGE_COLOR_UPDATE  = '#ff4444';
const BADGE_COLOR_OK      = '#00ff41';
const CHECK_INTERVAL_MS   = 4 * 60 * 60 * 1000; // 4 hours

// ─── Version Check ────────────────────────────────────────────────────────────

async function checkExtensionVersion() {
  // Throttle: skip if last check was < CHECK_INTERVAL_MS ago
  try {
    const { lastVersionCheck } = await chrome.storage.local.get(['lastVersionCheck']);
    if (lastVersionCheck && Date.now() - lastVersionCheck < CHECK_INTERVAL_MS) {
      console.log('[CopiePaste:BG] Version check skipped — checked recently');
      return;
    }
  } catch (_) { /* storage error — proceed with check */ }

  try {
    const res = await fetch(BACKEND_VERSION_URL, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
      console.warn('[CopiePaste:BG] Version check HTTP error', res.status);
      return;
    }
    const data = await res.json();
    const { latestVersion, isForceUpdate, releaseNotes } = data;

    await chrome.storage.local.set({
      versionInfo: { latestVersion, isForceUpdate, releaseNotes, checkedAt: Date.now() },
      lastVersionCheck: Date.now(),
    });

    if (isForceUpdate && latestVersion !== EXTENSION_VERSION) {
      // Red UPD badge to clearly signal update required
      chrome.action.setBadgeText({ text: 'UPD' });
      chrome.action.setBadgeBackgroundColor({ color: BADGE_COLOR_UPDATE });
      chrome.action.setTitle({ title: `Copie Past-e — UPDATE REQUIRED (v${latestVersion})` });

      // Show system notification (only create if not already showing)
      chrome.notifications.create('update-required', {
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'Copie Past-e: Update Required',
        message: `v${latestVersion} is required. Open the extension popup to download the update.`,
        priority: 2,
      });
    } else {
      chrome.action.setBadgeText({ text: '' });
      chrome.action.setTitle({ title: 'Copie Past-e' });
    }
  } catch (err) {
    // Network unavailable or canister offline — non-fatal
    console.warn('[CopiePaste:BG] Version check failed:', err.message);
  }
}

// ─── Lifecycle ────────────────────────────────────────────────────────────────

chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('[CopiePaste:BG] Extension installed/updated:', details.reason, `v${EXTENSION_VERSION}`);
  // Clear throttle on install so we always check immediately after install/update
  await chrome.storage.local.remove('lastVersionCheck');
  await checkExtensionVersion();
});

chrome.runtime.onStartup.addListener(async () => {
  console.log('[CopiePaste:BG] Browser started — running version check');
  await checkExtensionVersion();
});

// Periodic version check using alarms (survives service worker sleep)
chrome.alarms.create('version-check', { periodInMinutes: 240 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'version-check') {
    checkExtensionVersion();
  }
});

// ─── Message Routing ──────────────────────────────────────────────────────────

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || !message.action) return false;

  switch (message.action) {

    // Popup → Background: store draft and forward to content script
    case 'AUTOFILL_DRAFT': {
      const { draft, tabId } = message;
      if (!draft || !tabId) {
        sendResponse({ success: false, error: 'Missing draft or tabId' });
        return false;
      }
      // Persist draft so content script can also read it directly
      chrome.storage.local.set({ [`draft_${draft.platform}`]: draft }, () => {
        // Forward trigger to the active content script
        chrome.tabs.sendMessage(
          tabId,
          { action: 'TRIGGER_AUTOFILL', draft },
          (response) => {
            if (chrome.runtime.lastError) {
              console.warn('[CopiePaste:BG] Tab message error:', chrome.runtime.lastError.message);
              sendResponse({ success: false, error: chrome.runtime.lastError.message });
            } else {
              sendResponse(response || { success: true });
            }
          }
        );
      });
      return true; // Keep channel open for async sendResponse
    }

    // Popup → Background: save draft to storage only (no autofill trigger)
    case 'SAVE_DRAFT': {
      const { draft } = message;
      if (!draft) {
        sendResponse({ success: false, error: 'No draft provided' });
        return false;
      }
      chrome.storage.local.set({ [`draft_${draft.platform}`]: draft }, () => {
        sendResponse({ success: true });
      });
      return true;
    }

    // Popup → Background: get stored version info
    case 'GET_VERSION_INFO': {
      chrome.storage.local.get(['versionInfo'], (result) => {
        sendResponse({
          currentVersion: EXTENSION_VERSION,
          versionInfo: result.versionInfo || null,
        });
      });
      return true;
    }

    // Popup → Background: force re-check version (bypasses throttle)
    case 'CHECK_VERSION': {
      chrome.storage.local.remove('lastVersionCheck', () => {
        checkExtensionVersion().then(() => {
          chrome.storage.local.get(['versionInfo'], (result) => {
            sendResponse({ success: true, versionInfo: result.versionInfo || null });
          });
        });
      });
      return true;
    }

    default:
      return false;
  }
});

// ─── Notification Interaction ─────────────────────────────────────────────────

chrome.notifications.onClicked.addListener((notificationId) => {
  if (notificationId === 'update-required') {
    // Open the extension setup/download page
    chrome.tabs.create({ url: chrome.runtime.getURL('popup.html') });
    chrome.notifications.clear(notificationId);
  }
});
