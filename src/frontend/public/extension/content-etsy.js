// Copie Past-e Smart Post — Etsy Content Script v1.0.0
// Runs on: https://www.etsy.com/your/listings/create
// Reads pending listing from storage and auto-fills the React-controlled form.
// Fill order: Title → Description → Price → Tags (one at a time, Enter key)
// Per-field try/catch prevents one failure from blocking remaining fields.
// ✅ MANUAL POSTING ONLY — form is NEVER submitted automatically

(() => {
  const LOG = "[Copie Past-e Etsy]";
  const POLL_INTERVAL = 500;
  const POLL_TIMEOUT = 20000;
  const FIELD_TIMEOUT = 8000;

  const CONFIG = {
    PLATFORM: "etsy",
    MAX_TITLE_LENGTH: 140,
    MAX_DESC_LENGTH: 10000,
    MAX_TAGS: 13,  // Etsy allows max 13 tags
    DEBUG: false,
  };

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const log = (msg, data) => {
    if (CONFIG.DEBUG) console.log(LOG, msg, data || "");
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
      borderBottom: "3px solid #f56400", color: "#ffffff",
      padding: "12px 20px", fontFamily: "system-ui, sans-serif",
      fontSize: "14px", display: "flex",
      justifyContent: "space-between", alignItems: "center",
      boxShadow: "0 2px 20px rgba(245, 100, 0, 0.25)",
    });
    const msg = document.createElement("span");
    if (!failedFields || failedFields.length === 0) {
      msg.innerHTML = `<span style="color:#f56400;font-weight:bold">⚡ Copie Past-e</span> — All fields filled. Review and click <strong>Publish</strong>.`;
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

  // ── Fill tags (Etsy one-at-a-time with Enter) ─────────────────────────────────

  async function fillTags(tags) {
    if (!tags || tags.length === 0) return;

    const tagEl = await pollForElementPromise([
      'input[placeholder*="tag"]',
      'input[name="tags"]',
      'input[data-testid*="tag"]',
      'input[aria-label*="tag" i]',
      'input[id*="tag" i]',
    ]);

    if (!tagEl) {
      log("⚠️ Tag input selector not found");
      return;
    }

    // Limit to Etsy's max 13 tags
    const tagsToAdd = tags.slice(0, CONFIG.MAX_TAGS);
    let addedCount = 0;

    for (const tag of tagsToAdd) {
      try {
        if (!tag || !tag.trim()) continue;

        // Focus and type tag using React-compatible setter
        tagEl.focus();
        fillInput(tagEl, tag.trim());
        await sleep(150);

        // Simulate pressing Enter to confirm the tag
        tagEl.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", code: "Enter", keyCode: 13, bubbles: true }));
        tagEl.dispatchEvent(new KeyboardEvent("keyup",   { key: "Enter", code: "Enter", keyCode: 13, bubbles: true }));

        // Also try comma as Etsy sometimes uses comma-separated input
        tagEl.dispatchEvent(new KeyboardEvent("keydown", { key: ",", code: "Comma", keyCode: 188, bubbles: true }));

        addedCount++;
        // Wait between tags to avoid overwhelming the form
        await sleep(300);
      } catch (tagErr) {
        console.warn(LOG, `Error adding tag "${tag}":`, tagErr.message);
      }
    }

    log(`✅ Tags filled (${addedCount} of ${tagsToAdd.length} added)`);
  }

  // ── Fill category ─────────────────────────────────────────────────────────────

  async function fillCategory(rawCategory) {
    if (!rawCategory) return false;

    const trigger = findFirst([
      '[data-testid*="category"] button',
      'button[aria-label*="category" i]',
      'select[name*="category" i]',
      'input[placeholder*="category" i]',
    ]);
    if (!trigger) { console.warn(LOG, "Category trigger not found"); return false; }

    if (trigger.tagName === "SELECT") {
      const opts = Array.from(trigger.options);
      const match = opts.find(o =>
        o.text.toLowerCase().includes(rawCategory.toLowerCase()) ||
        rawCategory.toLowerCase().includes(o.text.toLowerCase())
      );
      if (match) { trigger.value = match.value; trigger.dispatchEvent(new Event("change", { bubbles: true })); return true; }
      return false;
    }

    trigger.click();
    await sleep(700);
    const opts = document.querySelectorAll('[role="option"], [role="menuitem"], li');
    for (const opt of opts) {
      const text = opt.textContent.trim();
      if (text.toLowerCase().includes(rawCategory.toLowerCase()) || rawCategory.toLowerCase().includes(text.toLowerCase())) {
        opt.click(); return true;
      }
    }
    document.body.click();
    return false;
  }

  // ── Main fill logic ──────────────────────────────────────────────────────────

  async function autofill(data) {
    const fields = (data.platformFields?.etsy) || data;
    const failed = [];

    // ── 1. Title ───────────────────────────────────────────────────────────────
    try {
      const titleEl = await pollForElementPromise([
        'input[name="title"]',
        'input[placeholder*="Title"]',
        '#title',
        'input[data-testid*="title"]',
        'input[aria-label*="title" i]',
      ]);
      if (titleEl && fields.title) {
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

    // ── 2. Description ─────────────────────────────────────────────────────────
    try {
      const descValue = fields.description ? String(fields.description).substring(0, CONFIG.MAX_DESC_LENGTH) : null;
      if (descValue) {
        const descEl = await pollForElementPromise([
          'textarea[name="description"]',
          'textarea[placeholder*="Description"]',
          '#description',
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
          // Try contenteditable rich text editor
          const ce = findFirst(['[contenteditable="true"][aria-label*="description" i]', '[contenteditable="true"]']);
          if (ce) {
            fillContentEditable(ce, descValue);
            log("✅ Description filled (contenteditable)");
          } else {
            failed.push("Description");
            log("⚠️ Description selector not found");
          }
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
        'input[name="price"]',
        'input[placeholder*="Price"]',
        '#price',
        'input[data-testid*="price"]',
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

    // ── 4. Category (best effort) ──────────────────────────────────────────────
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

    // ── 5. Tags (one-at-a-time, Enter per tag, max 13) ─────────────────────────
    try {
      if (fields.tags && Array.isArray(fields.tags) && fields.tags.length > 0) {
        await fillTags(fields.tags);
      }
    } catch (err) {
      console.warn(LOG, "Error filling Tags:", err.message);
      failed.push("Tags");
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
      log(`Post is for: ${listing.platform} — not Etsy, exiting.`);
      return;
    }
    console.log(LOG, "Pending post:", listing.title);
    pollForElement(
      [
        'input[name="title"]',
        'input[placeholder*="Title"]',
        '#title',
        'input[data-testid*="title"]',
      ],
      () => autofill(listing),
      POLL_TIMEOUT
    );
  });

  log("Etsy content script loaded");
})();
