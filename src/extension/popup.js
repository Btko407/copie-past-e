/**
 * Copie Past-e — Popup Controller v1.4.0
 *
 * 1. Detects which marketplace the active tab is on.
 * 2. Loads any saved PlatformDraft from chrome.storage.local.
 * 3. "INJECT DATA" button sends TRIGGER_AUTOFILL to the content script.
 * 4. Shows spinner while injection is in progress.
 * 5. Shows success or error toast after injection completes.
 * 6. Displays platform name and draft completeness % prominently.
 */

'use strict';

const EXTENSION_VERSION = '1.4.0';

// ── Platform detection ────────────────────────────────────────────────────────

const PLATFORM_PATTERNS = [
  { id: 'facebook', label: 'FACEBOOK',  re: /facebook\.com\/marketplace/i },
  { id: 'mercari',  label: 'MERCARI',   re: /mercari\.com\/(sell|item\/edit)/i },
  { id: 'ebay',     label: 'EBAY',      re: /ebay\.com\/(sl\/sell|sell\/)/i },
  { id: 'poshmark', label: 'POSHMARK',  re: /poshmark\.com\/(create|edit)-listing/i },
  { id: 'depop',    label: 'DEPOP',     re: /depop\.com\/selling|selling\.depop\.com/i },
  { id: 'etsy',     label: 'ETSY',      re: /etsy\.com\/(listing\/new|listing\/.*\/edit|your\/shops)/i },
];

function detectPlatform(url) {
  if (!url) return null;
  for (const p of PLATFORM_PATTERNS) {
    if (p.re.test(url)) return p;
  }
  return null;
}

// ── DOM refs ──────────────────────────────────────────────────────────────────

const $platformDot       = document.getElementById('platform-dot');
const $platformName      = document.getElementById('platform-name');
const $platformBadge     = document.getElementById('platform-badge');
const $draftPanel        = document.getElementById('draft-panel');
const $noDraft           = document.getElementById('no-draft');
const $draftTitle        = document.getElementById('draft-title');
const $draftPrice        = document.getElementById('draft-price');
const $draftCondition    = document.getElementById('draft-condition');
const $draftCompleteness = document.getElementById('draft-completeness');
const $completenessBar   = document.getElementById('completeness-bar');
const $draftStatus       = document.getElementById('draft-status');
const $btnAutofill       = document.getElementById('btn-autofill');
const $btnSpinner        = document.getElementById('btn-spinner');
const $btnLabel          = document.getElementById('btn-label');
const $btnReload         = document.getElementById('btn-reload');
const $logArea           = document.getElementById('log-area');
const $logClear          = document.getElementById('log-clear');
const $updateBanner      = document.getElementById('update-banner');
const $updateLink        = document.getElementById('update-link');
const $summaryBar        = document.getElementById('summary-bar');
const $sumOk             = document.getElementById('sum-ok');
const $sumErr            = document.getElementById('sum-err');
const $toast             = document.getElementById('toast');
const $versionLabel      = document.getElementById('version-label');

// ── State ─────────────────────────────────────────────────────────────────────

let currentTab      = null;
let currentPlatform = null;
let currentDraft    = null;
let injecting       = false;

// ── Toast ─────────────────────────────────────────────────────────────────────

let toastTimer = null;

function showToast(msg, type = 'success') {
  if (!$toast) return;
  $toast.textContent = msg;
  $toast.className = `toast toast-${type} visible`;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    $toast.classList.remove('visible');
  }, type === 'error' ? 6000 : 4000);
}

// ── Logging ───────────────────────────────────────────────────────────────────

function addLog(msg, level = 'ok') {
  if (!$logArea) return;
  const now = new Date();
  const t = `${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
  const line = document.createElement('div');
  line.className = `log-line log-${level}`;
  line.innerHTML = `<span class="log-time">${t}</span><span class="log-msg">${msg}</span>`;
  $logArea.appendChild(line);
  $logArea.scrollTop = $logArea.scrollHeight;
}

if ($logClear) {
  $logClear.addEventListener('click', () => {
    $logArea.innerHTML = '';
    addLog('Log cleared.', 'info');
  });
}

// ── Spinner helpers ───────────────────────────────────────────────────────────

function setInjecting(state) {
  injecting = state;
  if (!$btnAutofill) return;
  $btnAutofill.disabled = state;
  if ($btnSpinner) $btnSpinner.style.display = state ? 'inline-block' : 'none';
  if ($btnLabel)   $btnLabel.textContent     = state ? 'INJECTING...' : 'INJECT DATA';
}

// ── Draft display ─────────────────────────────────────────────────────────────

function showDraft(draft) {
  if (!draft) {
    if ($draftPanel)   $draftPanel.style.display = 'none';
    if ($noDraft)      $noDraft.classList.add('visible');
    if ($btnAutofill)  $btnAutofill.disabled = true;
    return;
  }
  if ($noDraft)    $noDraft.classList.remove('visible');
  if ($draftPanel) $draftPanel.style.display = 'block';

  // Support both flat draft and nested platformFields shape
  const fields = draft.platformFields || draft;
  const platformId = draft.platform || currentPlatform?.id;
  const inner = (platformId && fields[platformId]) || fields;

  if ($draftTitle)        $draftTitle.textContent     = inner.title || draft.title || '(no title)';
  if ($draftPrice)        $draftPrice.textContent     = inner.price || draft.price || '—';
  if ($draftCondition) {
    const cond = inner.condition || inner.conditionId || inner.mecariCondition || '—';
    $draftCondition.textContent = String(cond);
  }

  const pct = draft.completenessPercent != null ? draft.completenessPercent : null;
  if ($draftCompleteness) $draftCompleteness.textContent = pct != null ? `${pct}%` : '—';
  if ($completenessBar)   $completenessBar.style.width   = pct != null ? `${Math.min(100, pct)}%` : '0%';
  if ($draftStatus)       $draftStatus.textContent       = draft.status || '—';

  if ($btnAutofill)  $btnAutofill.disabled = false;
  addLog(`Draft loaded: "${(inner.title || draft.title || '').slice(0, 40)}"`, 'ok');
}

// ── Platform UI ───────────────────────────────────────────────────────────────

function setPlatformUI(platform) {
  if (!platform) {
    if ($platformDot)   $platformDot.className   = 'inactive';
    if ($platformName)  $platformName.textContent = 'NOT DETECTED';
    if ($platformBadge) $platformBadge.textContent = '';
    addLog('No supported marketplace detected on this tab.', 'warn');
    return;
  }
  if ($platformDot)   $platformDot.className    = 'active';
  if ($platformName)  $platformName.textContent  = platform.label;
  if ($platformBadge) $platformBadge.textContent = platform.label;
  addLog(`Platform detected: ${platform.label}`, 'info');
}

// ── Load draft from storage ───────────────────────────────────────────────────

function loadDraft(platformId) {
  if (!platformId) { showDraft(null); return; }
  const keys = [`draft_${platformId}`, 'activeDraft'];
  chrome.storage.local.get(keys, (result) => {
    const draft = result[`draft_${platformId}`] || result.activeDraft || null;
    currentDraft = draft;
    showDraft(draft);
    if (!draft) addLog(`No draft found for ${platformId.toUpperCase()}.`, 'warn');
  });
}

// ── Autofill trigger ──────────────────────────────────────────────────────────

if ($btnAutofill) {
  $btnAutofill.addEventListener('click', () => {
    if (!currentTab || !currentPlatform || !currentDraft || injecting) {
      addLog('Cannot inject: missing tab, platform, or draft.', 'err');
      return;
    }

    setInjecting(true);
    if ($summaryBar) $summaryBar.classList.remove('visible');
    addLog(`Sending INJECT DATA to ${currentPlatform.label}...`, 'info');

    chrome.tabs.sendMessage(
      currentTab.id,
      { action: 'TRIGGER_AUTOFILL', draft: currentDraft },
      (response) => {
        setInjecting(false);

        if (chrome.runtime.lastError) {
          const errMsg = chrome.runtime.lastError.message;
          addLog(`Error: ${errMsg}`, 'err');
          addLog('Tip: Refresh the marketplace page and try again.', 'warn');
          showToast(`Injection failed: ${errMsg.slice(0, 60)}`, 'error');
          return;
        }
        if (!response) {
          addLog('No response from content script. Page may have reloaded.', 'warn');
          showToast('No response from page. Try refreshing.', 'error');
          return;
        }

        const ok  = response.filled  || 0;
        const err = response.failed  || 0;
        const tot = response.total   || 0;

        if ($summaryBar && (ok > 0 || err > 0)) {
          $summaryBar.classList.add('visible');
          if ($sumOk)  $sumOk.textContent  = `✓ ${ok} filled`;
          if ($sumErr) $sumErr.textContent = `✗ ${err} failed`;
        }

        if (response.success) {
          addLog(`✅ Injection complete: ${ok}/${tot} fields filled.`, 'ok');
          showToast(`✅ ${ok} field${ok !== 1 ? 's' : ''} injected into ${currentPlatform.label}!`, 'success');
        } else {
          addLog(`⚠ Injection partial: ${ok} filled, ${err} failed.`, 'warn');
          showToast(`⚠ Partial: ${ok} filled, ${err} failed. Check log.`, 'warn');
        }

        // Log individual field results if provided
        if (Array.isArray(response.log)) {
          response.log.forEach((entry) => {
            addLog(`  ${entry.field}: ${entry.status}`, entry.ok ? 'ok' : 'err');
          });
        }

        addLog('⚠ MANUAL SUBMIT REQUIRED — extension never submits forms.', 'warn');
      }
    );
  });
}

// ── Reload draft ──────────────────────────────────────────────────────────────

if ($btnReload) {
  $btnReload.addEventListener('click', () => {
    addLog('Reloading draft from storage...', 'info');
    if (currentPlatform) {
      loadDraft(currentPlatform.id);
    } else {
      addLog('No platform detected. Cannot reload.', 'warn');
    }
  });
}

// ── Version banner ────────────────────────────────────────────────────────────

function checkUpdateBanner() {
  chrome.storage.local.get(['versionInfo'], (result) => {
    const vi = result.versionInfo;
    if (vi && vi.isForceUpdate && vi.latestVersion !== EXTENSION_VERSION) {
      if ($updateBanner) $updateBanner.classList.add('visible');
      if ($updateLink) {
        $updateLink.textContent = `INSTALL v${vi.latestVersion}`;
      }
      addLog(`⚠ Update required: v${vi.latestVersion} available.`, 'err');
    }
  });
}

// ── Initialisation ────────────────────────────────────────────────────────────

async function init() {
  // Show current version
  if ($versionLabel) $versionLabel.textContent = `v${EXTENSION_VERSION}`;

  // Init spinner as hidden
  if ($btnSpinner) $btnSpinner.style.display = 'none';

  addLog(`Copie Past-e v${EXTENSION_VERSION} — initializing...`, 'info');

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    currentTab = tab;

    if (!tab || !tab.url) {
      addLog('Cannot read active tab URL.', 'warn');
      setPlatformUI(null);
      showDraft(null);
      return;
    }

    currentPlatform = detectPlatform(tab.url);
    setPlatformUI(currentPlatform);

    if (currentPlatform) {
      loadDraft(currentPlatform.id);
    } else {
      showDraft(null);
    }
  } catch (err) {
    addLog(`Init error: ${err.message}`, 'err');
  }

  checkUpdateBanner();
}

init();
