// Copie Past-e Smart Post — Depop Content Script v1.0.0
// Runs on: https://www.depop.com/products/create/
// Reads pending listing from storage and auto-fills the React-controlled form.
// Fill order: Title → Description → Price → Brand → Size → Category → Condition
// CRITICAL: Depop has a strict 70-char title limit and 500-char description limit.
// Per-field try/catch prevents one failure from blocking remaining fields.
// ✅ MANUAL POSTING ONLY — form is NEVER submitted automatically

(() => {
  const LOG = "[Copie Past-e Depop]";
  const POLL_INTERVAL = 500;
  const POLL_TIMEOUT = 20000;
  const FIELD_TIMEOUT = 8000;

  const CONFIG = {
    PLATFORM: "depop",
    MAX_TITLE_LENGTH: 70,  // CRITICAL: strict 70-char limit
    MAX_DESC_LENGTH: 500,
    DEBUG: false,
  };

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const log = (msg, data) => {
    if (CONFIG.DEBUG) console.log(LOG, msg, data || "");
  };

  // ── Condition mapping ────────────────────────────────────────────────────────
  const CONDITION_MAP = {
    "New":                 "New with tags",
    "Used - Good":         "Good",
    "Used -- Good":        "Good",
    "Used - Fair":         "Fair",
    "Used -- Fair":        "Fair",
    "Used - Normal Wear":  "Good",
    "Used -- Normal Wear": "Good",
  };

  // ── React-friendly native setter helpers ─────────────────────────────────────

  function fillInput(el, value) {
    try {
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype, "value"
      ).set;
      setter.call(el, value);
    } catch (_) { el.value = value; }
    el.dispatchEvent(new Event("input",  { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function fillTextarea(el, value) {
    try {
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype, "value"
      ).set;
      setter.call(el, value);
    } catch (_) { el.value = value; }
    el.dispatchEvent(new Event("input",  { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function fillContentEditable(el, value) {
    el.focus();
    try {
      document.execCommand("selectAll", false, null);
      document.execCommand("insertText", false, value);
    } catch (_) {
      el.textContent = value;
      el.dispatchEvent(new Event("input", { bubbles: true }));
    }
  }

  // ── Selector helpers ──────────────────────────────────────────────────────────

  function findFirst(selectors) {
    for (const sel of selectors) {
      try {
        const el = document.querySelector(sel);
        if (el) return el;
      } catch (_) {}
    }
    return null;
  }

  function pollForElement(selectors, onFound, timeoutMs) {
    const start = Date.now();
    const interval = setInterval(() => {
      const el = findFirst(selectors);
      if (el) { clearInterval(interval); onFound(el); return; }
      if (Date.now() - start > timeoutMs) {
        clearInterval(interval);
        console.warn(LOG, "Timed out waiting for:", selectors);
      }
    }, POLL_INTERVAL);
  }

  function pollForElementPromise(selectors, timeoutMs = FIELD_TIMEOUT) {
    return new Promise((resolve) => {
      const start = Date.now();
      const interval = setInterval(() => {
        const el = findFirst(selectors);
        if (el) { clearInterval(interval); resolve(el); return; }
        if (Date.now() - start > timeoutMs) { clearInterval(interval); resolve(null); }
      }, POLL_INTERVAL);
    });
  }

  // ── Banner ────────────────────────────────────────────────────────────────────

  function showBanner(failedFields) {
    const existing = document.getElementById("copie-paste-banner");
    if (existing) existing.remove();
    const banner = document.createElement("div");
    banner.id = "copie-paste-banner";
    Object.assign(banner.style, {
      position: "fixed", top: "0", left: "0", right: "0",
      zIndex: "999999", background: "#0a0a1a",
      borderBottom: "3px solid #ff2950", color: "#ffffff",
      padding: "12px 20px", fontFamily: "system-ui, sans-serif",
      fontSize: "14px", display: "flex",
      justifyContent: "space-between", alignItems: "center",
      boxShadow: "0 2px 20px rgba(255, 41, 80, 0.25)",
    });
    const msg = document.createElement("span");
    if (!failedFields || failedFields.length === 0) {
      msg.innerHTML = `<span style="color:#ff2950;font-weight:bold">⚡ Copie Past-e</span> — All fields filled. Review and click <strong>Post</strong>.`;
    } else {
      msg.innerHTML = `<span style="color:#ffaa00;font-weight:bold">⚠️ Copie Past-e</span> — Could not fill: <strong style="color:#ffaa00">${failedFields.join(", ")}</strong>`;
    }
    const x = document.createElement("button");
    x.textContent = "×";
    Object.assign(x.style, { background: "none", border: "none", color: "#aaa", fontSize: "20px", cursor: "pointer", marginLeft: "16px" });
    x.addEventListener("click", () => { banner.remove(); document.body.style.marginTop = ""; });
    banner.appendChild(msg);
    banner.appendChild(x);
    document.body.insertBefore(banner, document.body.firstChild);
    document.body.style.marginTop = `${banner.offsetHeight}px`;
  }

  // ── Fill category ─────────────────────────────────────────────────────────────

  async function fillCategory(rawCategory) {
    if (!rawCategory) return false;

    const trigger = findFirst([
      '[data-testid*="category"] button',
      'button[aria-label*="category" i]',
      'select[name*="category" i]',
      'button[data-testid="category-picker"]',
    ]);
    if (!trigger) { console.warn(LOG, "Category trigger not found"); return false; }

    trigger.click();
    await sleep(700);

    const opts = document.querySelectorAll('[role="option"], [role="menuitem"], li');
    for (const opt of opts) {
      const text = opt.textContent.trim();
      if (
        text.toLowerCase().includes(rawCategory.toLowerCase()) ||
        rawCategory.toLowerCase().includes(text.toLowerCase())
      ) {
        opt.click();
        return true;
      }
    }
    document.body.click();
    return false;
  }

  // ── Fill condition ─────────────────────────────────────────────────────────────

  async function fillCondition(rawCondition) {
    if (!rawCondition) return false;
    const mapped = CONDITION_MAP[rawCondition] || rawCondition;

    const trigger = findFirst([
      '[data-testid*="condition"] button',
      'button[aria-label*="condition" i]',
      'select[name*="condition" i]',
    ]);
    if (!trigger) { console.warn(LOG, "Condition trigger not found"); return false; }

    if (trigger.tagName === "SELECT") {
      const opts = Array.from(trigger.options);
      const match = opts.find(o =>
        o.text.toLowerCase().includes(mapped.toLowerCase()) ||
        mapped.toLowerCase().includes(o.text.toLowerCase())
      );
      if (match) { trigger.value = match.value; trigger.dispatchEvent(new Event("change", { bubbles: true })); return true; }
      return false;
    }

    trigger.click();
    await sleep(600);
    const opts = document.querySelectorAll('[role="option"], [role="menuitem"], li');
    for (const opt of opts) {
      const text = opt.textContent.trim();
      if (text.toLowerCase().includes(mapped.toLowerCase()) || mapped.toLowerCase().includes(text.toLowerCase())) {
        opt.click(); return true;
      }
    }
    document.body.click();
    return false;
  }

  // ── Main fill logic ──────────────────────────────────────────────────────────

  async function autofill(data) {
    const fields = (data.platformFields?.depop) || data;
    const failed = [];

    // ── 1. Title (CRITICAL: 70-char strict limit) ──────────────────────────────
    try {
      const titleEl = await pollForElementPromise([
        'input[placeholder*="Title"]',
        'input[name="title"]',
        '[data-testid*="title"] input',
        'input[aria-label*="Title"]',
        'input[aria-label*="title" i]',
      ]);
      if (titleEl && fields.title) {
        // CRITICAL: Depop has strict 70-char limit — always truncate
        fillInput(titleEl, String(fields.title).substring(0, CONFIG.MAX_TITLE_LENGTH));
        log("✅ Title filled");
      } else if (fields.title) {
        failed.push("Title");
        log("⚠️ Title selector not found");
      }
    } catch (err) {
      console.warn(LOG, "Error filling Title:", err.message);
      failed.push("Title");
    }
    await sleep(500);

    // ── 2. Description (500-char limit) ────────────────────────────────────────
    try {
      const descValue = fields.description ? String(fields.description).substring(0, CONFIG.MAX_DESC_LENGTH) : null;
      if (descValue) {
        const descEl = await pollForElementPromise([
          'textarea[placeholder*="Describe"]',
          'textarea[name="description"]',
          '[data-testid*="description"] textarea',
          'textarea[aria-label*="description" i]',
        ]);
        if (descEl) {
          if (descEl.tagName === "TEXTAREA") {
            fillTextarea(descEl, descValue);
          } else {
            fillContentEditable(descEl, descValue);
          }
          log("✅ Description filled");
        } else {
          failed.push("Description");
          log("⚠️ Description selector not found");
        }
      }
    } catch (err) {
      console.warn(LOG, "Error filling Description:", err.message);
      failed.push("Description");
    }
    await sleep(500);

    // ── 3. Price ───────────────────────────────────────────────────────────────
    try {
      const priceEl = await pollForElementPromise([
        'input[placeholder*="Price"]',
        'input[name="price"]',
        '[data-testid*="price"] input',
        'input[aria-label*="price" i]',
      ]);
      if (priceEl && fields.price) {
        const numeric = String(fields.price).replace(/[^0-9.]/g, "");
        fillInput(priceEl, numeric);
        log("✅ Price filled");
      } else if (fields.price) {
        failed.push("Price");
        log("⚠️ Price selector not found");
      }
    } catch (err) {
      console.warn(LOG, "Error filling Price:", err.message);
      failed.push("Price");
    }
    await sleep(500);

    // ── 4. Brand ───────────────────────────────────────────────────────────────
    try {
      if (fields.brand) {
        const brandEl = await pollForElementPromise([
          'input[placeholder*="Brand"]',
          'input[name="brand"]',
          '[data-testid*="brand"] input',
          'input[aria-label*="brand" i]',
        ]);
        if (brandEl) {
          fillInput(brandEl, String(fields.brand));
          await sleep(400);
          // Click first suggestion if autocomplete appears
          const suggestion = document.querySelector('[role="option"], [data-testid*="brand-suggestion"]');
          if (suggestion) suggestion.click();
          log("✅ Brand filled");
        } else {
          log("⚠️ Brand selector not found");
          // Brand is optional — no push to failed
        }
      }
    } catch (err) {
      console.warn(LOG, "Error filling Brand:", err.message);
    }
    await sleep(500);

    // ── 5. Size ────────────────────────────────────────────────────────────────
    try {
      if (fields.size) {
        const sizeEl = await pollForElementPromise([
          'input[placeholder*="Size"]',
          'button[data-testid*="size"]',
          '[data-testid*="size"] button',
          'input[aria-label*="size" i]',
        ]);
        if (sizeEl) {
          if (sizeEl.tagName === "INPUT") {
            fillInput(sizeEl, String(fields.size));
          } else {
            sizeEl.click();
            await sleep(600);
            const opts = document.querySelectorAll('[role="option"], [role="menuitem"], li');
            for (const opt of opts) {
              const text = opt.textContent.trim();
              if (text.toLowerCase() === String(fields.size).toLowerCase()) {
                opt.click(); break;
              }
            }
          }
          log("✅ Size filled");
        } else {
          log("⚠️ Size selector not found");
          // Size is optional — no push to failed
        }
      }
    } catch (err) {
      console.warn(LOG, "Error filling Size:", err.message);
    }
    await sleep(500);

    // ── 6. Category (best effort) ──────────────────────────────────────────────
    try {
      if (fields.category) {
        const ok = await fillCategory(fields.category);
        if (!ok) {
          log("⚠️ Category could not be set");
        } else {
          log("✅ Category filled");
        }
      }
    } catch (err) {
      console.warn(LOG, "Error filling Category:", err.message);
    }
    await sleep(500);

    // ── 7. Condition (best effort) ─────────────────────────────────────────────
    try {
      if (fields.condition) {
        const ok = await fillCondition(fields.condition);
        if (!ok) {
          log("⚠️ Condition could not be set");
        } else {
          log("✅ Condition filled");
        }
      }
    } catch (err) {
      console.warn(LOG, "Error filling Condition:", err.message);
    }

    // ✅ MANUAL POSTING ONLY — form is NEVER submitted automatically
    chrome.storage.local.remove("pendingPost");
    showBanner(failed);

    chrome.runtime.sendMessage({
      action: "autofillComplete",
      platform: CONFIG.PLATFORM,
      success: true,
      failedFields: failed,
    });
  }

  // ── Message listener ──────────────────────────────────────────────────────────

  chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    if (request.action === "autofill" && request.platform === CONFIG.PLATFORM) {
      autofill(request.data);
      sendResponse({ received: true });
    } else if (request.action === "isReady") {
      sendResponse({ ready: true, platform: CONFIG.PLATFORM });
    }
  });

  // ── Boot (storage-based flow) ─────────────────────────────────────────────────

  chrome.storage.local.get("pendingPost", (result) => {
    const listing = result.pendingPost;
    if (!listing) { log("No pending post — exiting."); return; }
    if (listing.platform && listing.platform !== CONFIG.PLATFORM) {
      log(`Post is for: ${listing.platform} — not Depop, exiting.`);
      return;
    }
    console.log(LOG, "Pending post:", listing.title);
    pollForElement(
      [
        'input[placeholder*="Title"]',
        'input[name="title"]',
        '[data-testid*="title"] input',
        'input[aria-label*="Title"]',
      ],
      () => autofill(listing),
      POLL_TIMEOUT
    );
  });

  log("Depop content script loaded");
})();
