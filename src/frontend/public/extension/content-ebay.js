// Copie Past-e Smart Post — eBay Content Script v1.0.0
// Runs on: https://www.ebay.com/sell/*
// Reads pending listing from storage and auto-fills the React-controlled form.
// Fill order: Title → Description → Price → Quantity → Shipping Cost → Condition → Category
// Per-field try/catch prevents one failure from blocking remaining fields.
// ✅ MANUAL POSTING ONLY — form is NEVER submitted automatically

(() => {
  const LOG = "[Copie Past-e eBay]";
  const POLL_INTERVAL = 500;
  const POLL_TIMEOUT = 20000;
  const FIELD_TIMEOUT = 8000;

  const CONFIG = {
    PLATFORM: "ebay",
    MAX_TITLE_LENGTH: 80,
    MAX_DESC_LENGTH: 4000,
    DEBUG: false,
  };

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const log = (msg, data) => {
    if (CONFIG.DEBUG) console.log(LOG, msg, data || "");
  };

  // ── Category mapping ─────────────────────────────────────────────────────────
  const CATEGORY_MAP = {
    "Appliances":           "Appliances",
    "Automotive":           "eBay Motors",
    "Baby & Kids":          "Baby",
    "Books & Magazines":    "Books & Magazines",
    "Clothing & Shoes":     "Clothing, Shoes & Accessories",
    "Collectibles":         "Collectibles",
    "Electronics & Media":  "Consumer Electronics",
    "Furniture":            "Furniture",
    "Home & Garden":        "Home & Garden",
    "Jewelry & Accessories":"Jewelry & Watches",
    "Tools & Machinery":    "Tools & Workshop Equipment",
    "Office Supplies":      "Business & Industrial",
    "Services":             null,
  };

  // ── Condition mapping ────────────────────────────────────────────────────────
  const CONDITION_MAP = {
    "New":                 "New",
    "Used - Good":         "Good",
    "Used -- Good":        "Good",
    "Used - Fair":         "Acceptable",
    "Used -- Fair":        "Acceptable",
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
      borderBottom: "3px solid #e53238", color: "#ffffff",
      padding: "12px 20px", fontFamily: "system-ui, sans-serif",
      fontSize: "14px", display: "flex",
      justifyContent: "space-between", alignItems: "center",
      boxShadow: "0 2px 20px rgba(229, 50, 56, 0.25)",
    });
    const msg = document.createElement("span");
    if (!failedFields || failedFields.length === 0) {
      msg.innerHTML = `<span style="color:#e53238;font-weight:bold">⚡ Copie Past-e</span> — All fields filled. Review and click <strong>List Item</strong>.`;
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
    const mapped = CATEGORY_MAP[rawCategory];
    if (mapped === null) return true;
    const target = mapped || rawCategory;

    const trigger = findFirst([
      'input[placeholder*="category" i]',
      'input[aria-label*="category" i]',
      'button[data-testid*="category"]',
      'select[name*="category" i]',
    ]);
    if (!trigger) { console.warn(LOG, "Category trigger not found"); return false; }

    if (trigger.tagName === "SELECT") {
      const opts = Array.from(trigger.options);
      const match = opts.find(o =>
        o.text.toLowerCase().includes(target.toLowerCase()) ||
        target.toLowerCase().includes(o.text.toLowerCase())
      );
      if (match) { trigger.value = match.value; trigger.dispatchEvent(new Event("change", { bubbles: true })); return true; }
      return false;
    }

    fillInput(trigger, target);
    await sleep(600);
    const opts = document.querySelectorAll('[role="option"], [role="menuitem"], li[role="option"]');
    for (const opt of opts) {
      const text = opt.textContent.trim();
      if (text.toLowerCase().includes(target.toLowerCase()) || target.toLowerCase().includes(text.toLowerCase())) {
        opt.click(); return true;
      }
    }
    return false;
  }

  // ── Fill condition ─────────────────────────────────────────────────────────────

  async function fillCondition(rawCondition) {
    if (!rawCondition) return false;
    const mapped = CONDITION_MAP[rawCondition] || rawCondition;

    const trigger = findFirst([
      'select[name*="condition" i]',
      'button[aria-label*="condition" i]',
      '[data-testid*="condition"]',
      'select[id*="condition" i]',
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
    const fields = (data.platformFields?.ebay) || data;
    const failed = [];

    // ── 1. Title ───────────────────────────────────────────────────────────────
    try {
      const titleEl = await pollForElementPromise([
        'input#gh-ac',
        'input[placeholder*="Title"]',
        'input[data-testid*="title"]',
        'input[name="Title"]',
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
          'textarea[placeholder*="Description"]',
          'textarea[name="Description"]',
          '#description-editor',
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
          // Try iframe (eBay uses an iframe for the rich text description editor)
          try {
            const iframe = document.querySelector("iframe");
            const iframeBody = iframe?.contentDocument?.querySelector("body");
            if (iframeBody) {
              fillContentEditable(iframeBody, descValue);
              log("✅ Description filled (iframe)");
            } else {
              failed.push("Description");
              log("⚠️ Description selector not found");
            }
          } catch (iframeErr) {
            failed.push("Description");
            log("⚠️ Description iframe access failed", iframeErr.message);
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
        'input[placeholder*="Price"]',
        'input[name="StartPrice"]',
        'input[data-testid*="price"]',
        'input[aria-label*="price" i]',
        'input[id*="price" i]',
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

    // ── 4. Quantity ────────────────────────────────────────────────────────────
    try {
      if (fields.quantity !== undefined && fields.quantity !== null) {
        const qtyEl = await pollForElementPromise([
          'input[placeholder*="Quantity"]',
          'input[name="Quantity"]',
          'input[data-testid*="quantity"]',
          'input[aria-label*="quantity" i]',
          'input[id*="quantity" i]',
        ]);
        if (qtyEl) {
          fillInput(qtyEl, String(fields.quantity));
          log("✅ Quantity filled");
        } else {
          log("⚠️ Quantity selector not found");
          // Quantity is optional — no push to failed
        }
      }
    } catch (err) {
      console.warn(LOG, "Error filling Quantity:", err.message);
    }
    await sleep(500);

    // ── 5. Shipping cost ───────────────────────────────────────────────────────
    try {
      if (fields.shippingCost) {
        const shippingEl = await pollForElementPromise([
          'input[placeholder*="Shipping"]',
          'input[name="ShippingCost"]',
          'input[aria-label*="shipping cost" i]',
          'input[data-testid*="shipping"]',
          'input[id*="shipping" i]',
        ]);
        if (shippingEl) {
          const numeric = String(fields.shippingCost).replace(/[^0-9.]/g, "");
          fillInput(shippingEl, numeric);
          log("✅ Shipping cost filled");
        } else {
          log("⚠️ Shipping cost selector not found");
        }
      }
    } catch (err) {
      console.warn(LOG, "Error filling Shipping cost:", err.message);
    }
    await sleep(500);

    // ── 6. Condition ───────────────────────────────────────────────────────────
    try {
      if (fields.condition) {
        const ok = await fillCondition(fields.condition);
        if (!ok) {
          failed.push("Condition");
          log("⚠️ Condition could not be set");
        } else {
          log("✅ Condition filled");
        }
      }
    } catch (err) {
      console.warn(LOG, "Error filling Condition:", err.message);
      failed.push("Condition");
    }
    await sleep(500);

    // ── 7. Category (best effort) ──────────────────────────────────────────────
    try {
      if (fields.category) {
        const ok = await fillCategory(fields.category);
        if (!ok && fields.category !== "Services") {
          log("⚠️ Category could not be set");
          // Category is best-effort on eBay (complex nested picker)
        } else {
          log("✅ Category filled");
        }
      }
    } catch (err) {
      console.warn(LOG, "Error filling Category:", err.message);
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
      log(`Post is for: ${listing.platform} — not eBay, exiting.`);
      return;
    }
    console.log(LOG, "Pending post:", listing.title);
    pollForElement(
      [
        'input#gh-ac',
        'input[placeholder*="Title"]',
        'input[data-testid*="title"]',
        'input[name="Title"]',
        'textarea[name="Description"]',
      ],
      () => autofill(listing),
      POLL_TIMEOUT
    );
  });

  log("eBay content script loaded");
})();
