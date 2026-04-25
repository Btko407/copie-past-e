// Copie Past-e Smart Post — Mercari Content Script v1.3.0
// Runs on: https://www.mercari.com/sell/*
// Reads pending listing from storage and auto-fills the React-controlled form.
// Fill order: Title → Description → Price → Brand → Category → Condition → Images
//
// ⛔ MANUAL-ONLY MANDATE: This script NEVER calls form.submit(), button.click(),
//    or dispatches any submission-related event. The user must manually click List.

(() => {
  // ── Configuration ─────────────────────────────────────────────────────────────
  const CONFIG = {
    DEBUG: false,            // Set true in development for verbose logging
    PLATFORM: "mercari",
    POLL_INTERVAL: 500,
    POLL_TIMEOUT: 20000,
    FIELD_TIMEOUT: 6000,
    MAX_TITLE_LENGTH: 80,          // Mercari hard limit — truncate if over
    MAX_DESCRIPTION_LENGTH: 1000,  // Mercari hard limit — truncate if over
    MAX_IMAGES: 12,
  };

  const LOG = "[Copie Past-e Mercari]";

  function log(...args) {
    if (CONFIG.DEBUG) console.log(LOG, ...args);
  }

  function warn(...args) {
    console.warn(LOG, ...args);
  }

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // ── Category mapping ─────────────────────────────────────────────────────────
  const CATEGORY_MAP = {
    "Appliances":            "Home & Living",
    "Automotive":            "Vehicles & Parts",
    "Baby & Kids":           "Kids & Baby",
    "Books & Magazines":     "Books, Music & Games",
    "Clothing & Shoes":      "Clothing, Shoes & Accessories",
    "Collectibles":          "Collectibles",
    "Electronics & Media":   "Electronics",
    "Furniture":             "Home & Living",
    "Home & Garden":         "Home & Living",
    "Jewelry & Accessories": "Jewelry & Accessories",
    "Tools & Machinery":     "Home & Living",
    "Office Supplies":       "Office & Industrial",
    "Services":              null, // skip
  };

  // ── Condition mapping (Mercari 1-5 scale) ────────────────────────────────────
  // Input condition (string) → Mercari display label
  const CONDITION_MAP = {
    // Platform draft variant keys (from PlatformListingDraft)
    "new_":                "Like New",
    "likeNew":             "Like New",
    "good":                "Good",
    "fair":                "Fair",
    "poor":                "Poor",
    // Human-readable variants
    "New":                 "Like New",
    "Like New":            "Like New",
    "Used - Good":         "Good",
    "Used -- Good":        "Good",
    "Used - Fair":         "Fair",
    "Used -- Fair":        "Fair",
    "Used - Normal Wear":  "Good",
    "Used -- Normal Wear": "Good",
  };

  // ── React input helpers ──────────────────────────────────────────────────────

  /** Set value on a React-controlled <input> using the native setter pattern. */
  function setInputValue(el, value) {
    try {
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value"
      ).set;
      setter.call(el, value);
    } catch (_) {
      el.value = value;
    }
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  }

  /** Set value on a React-controlled <textarea> using the native setter pattern. */
  function setTextareaValue(el, value) {
    try {
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        "value"
      ).set;
      setter.call(el, value);
    } catch (_) {
      el.value = value;
    }
    el.dispatchEvent(new Event("input", { bubbles: true }));
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
      if (el) {
        clearInterval(interval);
        onFound(el);
        return;
      }
      if (Date.now() - start > timeoutMs) {
        clearInterval(interval);
        warn("Timed out waiting for:", selectors);
      }
    }, CONFIG.POLL_INTERVAL);
  }

  function pollForElementPromise(selectors, timeoutMs = CONFIG.POLL_TIMEOUT) {
    return new Promise((resolve) => {
      const start = Date.now();
      const interval = setInterval(() => {
        const el = findFirst(selectors);
        if (el) {
          clearInterval(interval);
          resolve(el);
          return;
        }
        if (Date.now() - start > timeoutMs) {
          clearInterval(interval);
          resolve(null);
        }
      }, CONFIG.POLL_INTERVAL);
    });
  }

  // ── Banner ────────────────────────────────────────────────────────────────────

  function showBanner(failedFields) {
    const existing = document.getElementById("copie-paste-banner");
    if (existing) existing.remove();

    const banner = document.createElement("div");
    banner.id = "copie-paste-banner";
    Object.assign(banner.style, {
      position: "fixed",
      top: "0",
      left: "0",
      right: "0",
      zIndex: "999999",
      background: "#0a0a1a",
      borderBottom: "3px solid #ff4d00",
      color: "#ffffff",
      padding: "12px 20px",
      fontFamily: "system-ui, sans-serif",
      fontSize: "14px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0 2px 20px rgba(255, 77, 0, 0.25)",
    });

    const msg = document.createElement("span");
    if (!failedFields || failedFields.length === 0) {
      msg.innerHTML =
        '<span style="color:#ff6633;font-weight:bold">⚡ Copie Past-e</span> — All fields filled. Review and click <strong>List</strong>.';
    } else {
      msg.innerHTML =
        `<span style="color:#ffaa00;font-weight:bold">⚠️ Copie Past-e</span> — Could not fill: <strong style="color:#ffaa00">${failedFields.join(", ")}</strong>`;
    }

    const x = document.createElement("button");
    x.textContent = "×";
    Object.assign(x.style, {
      background: "none",
      border: "none",
      color: "#aaa",
      fontSize: "20px",
      cursor: "pointer",
      marginLeft: "16px",
      flexShrink: "0",
    });
    x.setAttribute("aria-label", "Dismiss");
    x.addEventListener("click", () => {
      banner.remove();
      document.body.style.marginTop = "";
    });

    banner.appendChild(msg);
    banner.appendChild(x);
    document.body.insertBefore(banner, document.body.firstChild);
    document.body.style.marginTop = `${banner.offsetHeight}px`;
  }

  // ── Fill category ─────────────────────────────────────────────────────────────

  async function fillCategory(rawCategory) {
    if (!rawCategory) return false;

    const mapped = CATEGORY_MAP[rawCategory];
    if (mapped === null) {
      log("Category 'Services' — skipping.");
      return true;
    }
    const target = mapped || rawCategory;

    const trigger = findFirst([
      'button[data-testid*="category"]',
      'button[aria-label*="category" i]',
      '[data-testid="item-category-selector"]',
      'select[name="category"]',
    ]);

    if (!trigger) {
      warn("Category trigger not found");
      return false;
    }

    if (trigger.tagName === "SELECT") {
      const opts = Array.from(trigger.options);
      const match = opts.find(
        (o) =>
          o.text.toLowerCase().includes(target.toLowerCase()) ||
          target.toLowerCase().includes(o.text.toLowerCase())
      );
      if (match) {
        trigger.value = match.value;
        trigger.dispatchEvent(new Event("change", { bubbles: true }));
        log("Category set via SELECT:", match.text);
        return true;
      }
      return false;
    }

    trigger.click();
    await sleep(800);

    const opts = document.querySelectorAll(
      '[role="option"], [role="menuitem"], [data-testid*="category-option"], li'
    );
    for (const opt of opts) {
      const text = opt.textContent.trim();
      if (
        text.toLowerCase().includes(target.toLowerCase()) ||
        target.toLowerCase().includes(text.toLowerCase())
      ) {
        opt.click();
        log("Category set via dropdown:", text);
        return true;
      }
    }

    document.body.click(); // close dropdown without selection
    warn("No matching category option found for:", target);
    return false;
  }

  // ── Fill condition ────────────────────────────────────────────────────────────

  async function fillCondition(rawCondition) {
    if (!rawCondition) return false;

    const mapped = CONDITION_MAP[rawCondition] || rawCondition;

    const trigger = findFirst([
      'select[name*="condition" i]',
      'button[aria-label*="condition" i]',
      '[data-testid*="condition"]',
      'button[data-testid="item-condition-selector"]',
    ]);

    if (!trigger) {
      warn("Condition trigger not found");
      return false;
    }

    if (trigger.tagName === "SELECT") {
      const opts = Array.from(trigger.options);
      const match = opts.find(
        (o) =>
          o.text.toLowerCase().includes(mapped.toLowerCase()) ||
          mapped.toLowerCase().includes(o.text.toLowerCase())
      );
      if (match) {
        trigger.value = match.value;
        trigger.dispatchEvent(new Event("change", { bubbles: true }));
        log("Condition set via SELECT:", match.text);
        return true;
      }
      return false;
    }

    trigger.click();
    await sleep(600);

    const opts = document.querySelectorAll('[role="option"], [role="menuitem"], li');
    for (const opt of opts) {
      const text = opt.textContent.trim();
      if (
        text.toLowerCase().includes(mapped.toLowerCase()) ||
        mapped.toLowerCase().includes(text.toLowerCase())
      ) {
        opt.click();
        log("Condition set via dropdown:", text);
        return true;
      }
    }

    document.body.click();
    warn("No matching condition option found for:", mapped);
    return false;
  }

  // ── Image upload ──────────────────────────────────────────────────────────────

  async function uploadImages(images) {
    if (!images || images.length === 0) return;

    const fileInput = findFirst([
      'input[type="file"][accept*="image"]',
      'input[type="file"]',
    ]);

    if (!fileInput) {
      warn("No file input for images");
      return;
    }

    const files = [];
    for (const url of images.slice(0, CONFIG.MAX_IMAGES)) {
      try {
        let blob;
        if (url.startsWith("data:")) {
          const [header, b64] = url.split(",");
          const mimeMatch = header.match(/:(.*?);/);
          const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
          const binary = atob(b64);
          const bytes = new Uint8Array(binary.length);
          for (let j = 0; j < binary.length; j++) bytes[j] = binary.charCodeAt(j);
          blob = new Blob([bytes], { type: mime });
        } else {
          const resp = await fetch(url);
          if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
          blob = await resp.blob();
        }
        const ext = blob.type === "image/png" ? "png" : "jpg";
        files.push(new File([blob], `listing-image.${ext}`, { type: blob.type || "image/jpeg" }));
        await sleep(300);
        log(`Image converted: ${ext}`);
      } catch (err) {
        warn("Image fetch/convert failed:", err.message);
      }
    }

    if (files.length > 0) {
      const dt = new DataTransfer();
      for (const f of files) dt.items.add(f);
      fileInput.files = dt.files;
      fileInput.dispatchEvent(new Event("input", { bubbles: true }));
      fileInput.dispatchEvent(new Event("change", { bubbles: true }));
      log(`${files.length} image(s) attached`);
    } else {
      warn("No images could be prepared for upload.");
    }
  }

  // ── Main fill logic ───────────────────────────────────────────────────────────
  //
  // ⛔ NO form.submit() / NO button.click() / NO submit events — EVER.
  //    User must manually review and click the platform's "List" button.

  async function fillForm(listing) {
    const failed = [];
    let fieldsAttempted = 0;
    let fieldsSuccessful = 0;

    log("Starting autofill for listing:", listing.title);

    // ── 1. Title ─── MAX 80 chars for Mercari ─────────────────────────────────
    if (listing.title) {
      fieldsAttempted++;
      try {
        // ⚠️ IMPORTANT: Truncate to 80 chars — Mercari hard limit
        const titleValue = listing.title.substring(0, CONFIG.MAX_TITLE_LENGTH);

        const titleEl = await pollForElementPromise([
          'input[data-testid*="title"]',
          'input[placeholder*="Title" i]',
          'input[name="name"]',
          'input[aria-label*="title" i]',
          'input[placeholder*="What are you selling" i]',
          'input[placeholder*="item" i]',
          'input[data-testid*="item-name"]',
        ], CONFIG.FIELD_TIMEOUT);

        if (titleEl) {
          setInputValue(titleEl, titleValue);
          fieldsSuccessful++;
          log("✅ Title filled:", titleValue.substring(0, 40));
          if (listing.title.length > CONFIG.MAX_TITLE_LENGTH) {
            log(`ℹ️ Title truncated from ${listing.title.length} to ${CONFIG.MAX_TITLE_LENGTH} chars`);
          }
        } else {
          failed.push("Title");
          warn("❌ Title input not found");
        }
      } catch (err) {
        warn("Error filling Title:", err.message);
        failed.push("Title");
      }
      await sleep(500);
    }

    // ── 2. Description ─── MAX 1000 chars for Mercari ─────────────────────────
    if (listing.description) {
      fieldsAttempted++;
      try {
        // ⚠️ IMPORTANT: Truncate to 1000 chars — Mercari hard limit
        const descValue = listing.description.substring(0, CONFIG.MAX_DESCRIPTION_LENGTH);

        const descEl = await pollForElementPromise([
          'textarea[data-testid*="description"]',
          'textarea[placeholder*="description" i]',
          'textarea[name="description"]',
          'textarea[aria-label*="description" i]',
          '[data-testid*="description"] textarea',
          'textarea',
        ], CONFIG.FIELD_TIMEOUT);

        if (descEl) {
          setTextareaValue(descEl, descValue);
          fieldsSuccessful++;
          log("✅ Description filled");
          if (listing.description.length > CONFIG.MAX_DESCRIPTION_LENGTH) {
            log(`ℹ️ Description truncated from ${listing.description.length} to ${CONFIG.MAX_DESCRIPTION_LENGTH} chars`);
          }
        } else {
          // Try contenteditable fallback
          const ce = findFirst([
            '[contenteditable="true"]',
            '[aria-label*="description" i][contenteditable]',
          ]);
          if (ce) {
            fillContentEditable(ce, descValue);
            fieldsSuccessful++;
            log("✅ Description filled (contenteditable)");
          } else {
            failed.push("Description");
            warn("❌ Description field not found");
          }
        }
      } catch (err) {
        warn("Error filling Description:", err.message);
        failed.push("Description");
      }
      await sleep(500);
    }

    // ── 3. Price ───────────────────────────────────────────────────────────────
    if (listing.price) {
      fieldsAttempted++;
      try {
        const priceEl = await pollForElementPromise([
          'input[data-testid*="price"]',
          'input[placeholder*="Price" i]',
          'input[name="price"]',
          'input[aria-label*="price" i]',
          'input[type="number"]',
        ], CONFIG.FIELD_TIMEOUT);

        if (priceEl) {
          const numeric = String(listing.price).replace(/[^0-9.]/g, "");
          setInputValue(priceEl, numeric);
          fieldsSuccessful++;
          log("✅ Price filled:", numeric);
        } else {
          failed.push("Price");
          warn("❌ Price input not found");
        }
      } catch (err) {
        warn("Error filling Price:", err.message);
        failed.push("Price");
      }
      await sleep(500);
    }

    // ── 4. Brand (REQUIRED on Mercari) ────────────────────────────────────────
    if (listing.brand) {
      fieldsAttempted++;
      try {
        const brandEl = await pollForElementPromise([
          'input[placeholder*="brand" i]',
          'input[data-testid*="brand"]',
          'input[aria-label*="brand" i]',
          'input[name*="brand" i]',
        ], CONFIG.FIELD_TIMEOUT);

        if (brandEl) {
          setInputValue(brandEl, listing.brand);
          fieldsSuccessful++;
          log("✅ Brand filled:", listing.brand);
        } else {
          failed.push("Brand");
          warn("❌ Brand input not found (REQUIRED on Mercari)");
        }
      } catch (err) {
        warn("Error filling Brand:", err.message);
        failed.push("Brand");
      }
      await sleep(500);
    }

    // ── 5. Category ────────────────────────────────────────────────────────────
    if (listing.category) {
      fieldsAttempted++;
      try {
        const ok = await fillCategory(listing.category);
        if (ok) {
          fieldsSuccessful++;
          log("✅ Category filled");
        } else if (listing.category !== "Services") {
          failed.push("Category");
          warn("❌ Category failed");
        }
      } catch (err) {
        warn("Error filling Category:", err.message);
        failed.push("Category");
      }
      await sleep(500);
    }

    // ── 6. Condition (Mercari 1-5 scale) ──────────────────────────────────────
    if (listing.condition) {
      fieldsAttempted++;
      try {
        const ok = await fillCondition(listing.condition);
        if (ok) {
          fieldsSuccessful++;
          log("✅ Condition filled");
        } else {
          failed.push("Condition");
          warn("❌ Condition failed");
        }
      } catch (err) {
        warn("Error filling Condition:", err.message);
        failed.push("Condition");
      }
      await sleep(500);
    }

    // ── 7. Images ──────────────────────────────────────────────────────────────
    if (listing.images && listing.images.length > 0) {
      try {
        await uploadImages(listing.images);
        log("✅ Images upload attempted");
      } catch (err) {
        warn("Image upload error:", err.message);
      }
    }

    // ── Finish ─────────────────────────────────────────────────────────────────
    chrome.storage.local.remove("pendingPost");
    showBanner(failed);

    const success = failed.length === 0;
    log(`Autofill complete. Attempted: ${fieldsAttempted}, Successful: ${fieldsSuccessful}, Failed: ${failed.length}`);

    // Report result to extension background/popup
    try {
      chrome.runtime.sendMessage({
        action: "autofillComplete",
        platform: CONFIG.PLATFORM,
        success,
        fieldsAttempted,
        fieldsSuccessful,
        failedFields: failed,
      });
    } catch (_) {
      // Runtime may be unavailable if popup is closed — not an error
    }
  }

  // ── Message listener (popup → content script) ────────────────────────────────

  chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    if (request.action === "isReady") {
      sendResponse({ ready: true, platform: CONFIG.PLATFORM });
      return true;
    }

    if (request.action === "autofill" && request.platform === CONFIG.PLATFORM) {
      const listing = request.data;
      if (!listing) {
        sendResponse({ error: "No listing data provided" });
        return true;
      }
      fillForm(listing)
        .then(() => sendResponse({ received: true }))
        .catch((err) => sendResponse({ error: err.message }));
      return true; // keep channel open for async response
    }
  });

  // ── Boot (storage-based flow) ─────────────────────────────────────────────────

  chrome.storage.local.get("pendingPost", (result) => {
    const listing = result.pendingPost;
    if (!listing) {
      log("No pending post.");
      return;
    }
    if (listing.platform && listing.platform !== CONFIG.PLATFORM) {
      log("Post is for:", listing.platform, "— not Mercari, exiting.");
      return;
    }

    log("Pending post found:", listing.title);

    pollForElement(
      [
        'input[name="name"]',
        'input[placeholder*="What are you selling" i]',
        'input[aria-label*="title" i]',
        'input[data-testid*="title"]',
        'textarea[name="description"]',
      ],
      () => fillForm(listing),
      CONFIG.POLL_TIMEOUT
    );
  });

  log("Content script loaded — manual-only autofill active.");
})();
