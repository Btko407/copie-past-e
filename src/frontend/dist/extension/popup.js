// Copie Past-e — Extension Popup v1.3
// Manual-Only Autofill. ZERO auto-submit logic ever.

// ── Platform map ────────────────────────────────────────────────────────────

const PLATFORM_MAP = {
  'facebook.com': { name: 'Facebook Marketplace', icon: '📘', id: 'facebook' },
  'mercari.com':  { name: 'Mercari',              icon: '🛒', id: 'mercari'  },
  'ebay.com':     { name: 'eBay',                 icon: '🔨', id: 'ebay'     },
  'poshmark.com': { name: 'Poshmark',             icon: '👗', id: 'poshmark' },
  'depop.com':    { name: 'Depop',                icon: '🎨', id: 'depop'    },
  'etsy.com':     { name: 'Etsy',                 icon: '🛍', id: 'etsy'     },
};

// ── DOM refs ────────────────────────────────────────────────────────────────

const headerDot        = document.getElementById('header-dot');
const statusBanner     = document.getElementById('status-banner');
const platformDisplay  = document.getElementById('platform-display');
const platformNameEl   = document.getElementById('platform-name');
const autofillBtn      = document.getElementById('autofill-btn');
const completenessWrap = document.getElementById('completeness-wrap');
const completenessPct  = document.getElementById('completeness-pct');
const completenessFill = document.getElementById('completeness-fill');

// ── Gemini key UI (unchanged) ────────────────────────────────────────────────

chrome.runtime.sendMessage({ type: 'GET_GEMINI_KEY' }, (response) => {
  const status = document.getElementById('gemini-key-status');
  if (!status) return;
  if (response?.key) {
    status.textContent = 'API key saved ✓';
    status.style.color = '#39d353';
  } else {
    status.textContent = 'No API key saved';
    status.style.color = '#ffd60a';
  }
});

document.getElementById('save-gemini-key').addEventListener('click', () => {
  const input = document.getElementById('gemini-key-input');
  const key   = input.value.trim();
  if (!key) return;
  chrome.runtime.sendMessage({ type: 'SAVE_GEMINI_KEY', key }, (response) => {
    const status = document.getElementById('gemini-key-status');
    if (response?.success) {
      status.textContent = 'API key saved ✓';
      status.style.color = '#39d353';
      input.value = '';
    }
  });
});

// ── Connection status (legacy ext_connected check) ───────────────────────────

const CONNECTED_WINDOW_MS = 5 * 60 * 1000;

chrome.storage.local.get(['ext_connected', 'lastSeen'], (result) => {
  const { ext_connected, lastSeen } = result;
  const isRecent = lastSeen && (Date.now() - lastSeen < CONNECTED_WINDOW_MS);
  if (ext_connected && isRecent) {
    headerDot.classList.add('connected');
  }
});

// ── Main logic ───────────────────────────────────────────────────────────────

let detectedPlatform = null;

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const tabUrl = tab?.url ?? '';

    // Detect platform
    for (const [domain, info] of Object.entries(PLATFORM_MAP)) {
      if (tabUrl.includes(domain)) {
        detectedPlatform = info;
        break;
      }
    }

    if (detectedPlatform) {
      // Highlight matching list item
      const listItem = document.getElementById(`platform-${detectedPlatform.id}`);
      if (listItem) listItem.classList.add('active');

      // Update platform display
      platformDisplay.classList.add('active');
      platformNameEl.textContent = `${detectedPlatform.icon} ${detectedPlatform.name}`;

      // Update status
      statusBanner.textContent = `✅ Ready — ${detectedPlatform.name} detected`;
      statusBanner.classList.add('ready');

      // Enable autofill button
      autofillBtn.disabled = false;

      // Load draft + show completeness bar
      const storageKey = `draft_${detectedPlatform.id}`;
      chrome.storage.local.get(storageKey, (result) => {
        const draft = result[storageKey];
        if (draft) {
          const pct = typeof draft.completenessPercent === 'number'
            ? draft.completenessPercent
            : 100;
          completenessPct.textContent  = `${pct}%`;
          completenessFill.style.width = `${pct}%`;
          completenessWrap.classList.add('visible');
        }
      });

    } else {
      // Not a supported marketplace
      statusBanner.textContent = '❌ Not a supported marketplace';
      statusBanner.classList.add('error');
      platformNameEl.textContent = 'Unsupported — navigate to a marketplace';
      autofillBtn.disabled = true;
    }

  } catch (err) {
    statusBanner.textContent = `❌ Error: ${err.message}`;
    statusBanner.classList.add('error');
    autofillBtn.disabled = true;
  }
});

// ── Autofill button ──────────────────────────────────────────────────────────

autofillBtn.addEventListener('click', async () => {
  if (!detectedPlatform) return;

  autofillBtn.disabled    = true;
  autofillBtn.textContent = '⏳ Autofilling…';

  const storageKey = `draft_${detectedPlatform.id}`;

  chrome.storage.local.get(storageKey, async (result) => {
    const draft = result[storageKey];

    if (!draft) {
      autofillBtn.textContent  = '❌ No draft found — save one from Copie Past-e';
      autofillBtn.disabled     = false;
      statusBanner.textContent = `❌ No draft found for ${detectedPlatform.name}`;
      statusBanner.className   = 'status-banner error';
      return;
    }

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      chrome.tabs.sendMessage(
        tab.id,
        { action: 'autofill', platform: detectedPlatform.id, data: draft },
        (_response) => {
          if (chrome.runtime.lastError) {
            const errMsg = chrome.runtime.lastError.message ?? 'Unknown error';
            autofillBtn.textContent  = '❌ Error — reload page and try again';
            autofillBtn.disabled     = false;
            statusBanner.textContent = `❌ ${errMsg}`;
            statusBanner.className   = 'status-banner error';
          } else {
            autofillBtn.textContent  = '✅ Done! Review and submit manually.';
            statusBanner.textContent = '✅ Form filled — review and submit manually';
            statusBanner.className   = 'status-banner ready';
            // Re-enable after 4s so user can run again if needed
            setTimeout(() => {
              autofillBtn.textContent = '🔄 Autofill This Form';
              autofillBtn.disabled    = false;
            }, 4000);
          }
        }
      );
    } catch (err) {
      autofillBtn.textContent  = '❌ Error — reload page and try again';
      autofillBtn.disabled     = false;
      statusBanner.textContent = `❌ ${err.message}`;
      statusBanner.className   = 'status-banner error';
    }
  });
});
