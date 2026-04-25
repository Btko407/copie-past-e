// Copie Past-e Smart Post — Facebook Marketplace Content Script v1.3.0
// Runs on: https://www.facebook.com/marketplace/create/*
// Reads pending listing from storage and auto-fills the React-controlled form.
// Fill order: Category → Title → Price → Condition → Description → Brand → Images
//
// ⛔ MANUAL-ONLY MANDATE: This script NEVER calls form.submit(), button.click(),
//    or dispatches any submission-related event. The user must manually click Post.

(() => {

  // ── Configuration ─────────────────────────────────────────────────────────────
  const CONFIG = {
    DEBUG: false,            // Set true in development for verbose logging
    PLATFORM: "facebook",
    POLL_INTERVAL: 500,
    POLL_TIMEOUT: 15000,
    FIELD_TIMEOUT: 6000,
    MAX_TITLE_LENGTH: 200,
    MAX_DESCRIPTION_LENGTH: 5000,
    MAX_IMAGES: 5,
  };

  const LOG = "[Copie Past-e FB]";

  function log(...args) {
    if (CONFIG.DEBUG) console.log(LOG, ...args);
  }

  function warn(...args) {
    console.warn(LOG, ...args);
  }

  // ── Sleep helper ─────────────────────────────────────────────────────────────
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // ── Category mapping ─────────────────────────────────────────────────────────
  const CATEGORY_MAP = {
    "Appliances": "Appliances",
    "Automotive": "Vehicles",
    "Baby & Kids": "Baby & Kids",
    "Books & Magazines": "Books, Movies & Music",
    "Clothing & Shoes": "Clothing & Shoes",
    "Collectibles": "Collectibles",
    "Electronics & Media": "Electronics",
    "Furniture": "Furniture",
    "Home & Garden": "Home & Garden",
    "Jewelry & Accessories": "Jewelry & Accessories",
    "Tools & Machinery": "Tools",
    "Office Supplies": "Office Supplies",
    "Services": null, // skip — not a valid FB Marketplace category
  };

  // ── Condition mapping ────────────────────────────────────────────────────────
  const CONDITION_MAP = {
    "New": "New",
    "Used — Good": "Good",
    "Used -- Good": "Good",
    "Used — Fair": "Fair",
    "Used -- Fair": "Fair",
    "Used — Normal Wear": "Good",
    "Used -- Normal Wear": "Good",
    // Platform draft variant keys
    "new_": "New",
    "likeNew": "New",
    "good": "Good",
    "fair": "Fair",
    "poor": "Fair",
  };

  // ── React input helpers ──────────────────────────────────────────────────────

  /** Set value on a React-controlled <input> using the native setter pattern. */
  function setInputValue(element, value) {
    try {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value"
      ).set;
      nativeInputValueSetter.call(element, value);
    } catch (_) {
      element.value = value;
    }
    element.dispatchEvent(new Event("input", { bubbles: true }));
    element.dispatchEvent(new Event("change", { bubbles: true }));
  }

  /** Set value on a React-controlled <textarea> using the native setter pattern. */
  function setTextareaValue(element, value) {
    try {
      const nativeTextareaValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        "value"
      ).set;
      nativeTextareaValueSetter.call(element, value);
    } catch (_) {
      element.value = value;
    }
    element.dispatchEvent(new Event("input", { bubbles: true }));
    element.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function fillContentEditable(element, value) {
    element.focus();
    try {
      document.execCommand("selectAll", false, null);
      document.execCommand("insertText", false, value);
    } catch (_) {
      element.textContent = value;
      element.dispatchEvent(new Event("input", { bubbles: true }));
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

  // ── Poll helpers ──────────────────────────────────────────────────────────────

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
      borderBottom: "3px solid #00d4ff",
      color: "#ffffff",
      padding: "12px 20px",
      fontFamily: "system-ui, -apple-system, sans-serif",
      fontSize: "14px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0 2px 20px rgba(0, 212, 255, 0.25)",
    });

    const message = document.createElement("span");
    if (!failedFields || failedFields.length === 0) {
      message.innerHTML =
        '<span style="color:#00d4ff;font-weight:bold">⚡ Copie Past-e</span> — All fields filled. Review and click <strong>Post</strong>.';
    } else {
      message.innerHTML =
        `<span style="color:#ffaa00;font-weight:bold">⚠️ Copie Past-e</span> — Could not fill: <strong style="color:#ffaa00">${failedFields.join(", ")}</strong>`;
    }

    const dismiss = document.createElement("button");
    dismiss.textContent = "×";
    Object.assign(dismiss.style, {
      background: "none",
      border: "none",
      color: "#aaa",
      fontSize: "20px",
      cursor: "pointer",
      padding: "0 4px",
      lineHeight: "1",
      marginLeft: "16px",
      flexShrink: "0",
    });
    dismiss.setAttribute("aria-label", "Dismiss");
    dismiss.addEventListener("click", () => {
      banner.remove();
      document.body.style.marginTop = "";
    });

    banner.appendChild(message);
    banner.appendChild(dismiss);
    document.body.insertBefore(banner, document.body.firstChild);
    document.body.style.marginTop = `${banner.offsetHeight}px`;
  }

  // ── Image upload ──────────────────────────────────────────────────────────────

  async function uploadImages(images) {
    if (!images || images.length === 0) return;

    const fileInputSelectors = [
      'input[type="file"][accept*="image"]',
      'input[type="file"]',
      '[data-testid*="photo"] input[type="file"]',
      '[aria-label*="photo" i] input[type="file"]',
      '[aria-label*="image" i] input[type="file"]',
    ];

    let fileInput = findFirst(fileInputSelectors);
    if (!fileInput) {
      fileInput = await pollForElementPromise(fileInputSelectors, 10000);
    }

    if (!fileInput) {
      warn("Could not locate file upload input.");
      return;
    }

    const dt = new DataTransfer();
    for (let i = 0; i < Math.min(images.length, CONFIG.MAX_IMAGES); i++) {
      try {
        const src = images[i];
        let blob;
        if (src.startsWith("data:")) {
          const [header, b64] = src.split(",");
          const mimeMatch = header.match(/:(.*?);/);
          const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
          const binary = atob(b64);
          const bytes = new Uint8Array(binary.length);
          for (let j = 0; j < binary.length; j++) bytes[j] = binary.charCodeAt(j);
          blob = new Blob([bytes], { type: mime });
        } else {
          const resp = await fetch(src);
          if (!resp.ok) throw new Error(`HTTP ${resp.status} for ${src}`);
          blob = await resp.blob();
        }
        dt.items.add(new File([blob], `listing-photo-${i + 1}.jpg`, { type: "image/jpeg" }));
        log(`Image ${i + 1} converted OK`);
      } catch (err) {
        warn(`Failed to convert image ${i}:`, err.message);
      }
    }

    if (dt.files.length > 0) {
      fileInput.files = dt.files;
      fileInput.dispatchEvent(new Event("input", { bubbles: true }));
      fileInput.dispatchEvent(new Event("change", { bubbles: true }));
      log(`${dt.files.length} image(s) attached to file input`);
    } else {
      warn("No images could be converted for upload.");
    }
  }

  // ── Fill category ─────────────────────────────────────────────────────────────

  async function fillCategory(rawCategory) {
    if (!rawCategory) return false;

    const fbCategory = CATEGORY_MAP[rawCategory];
    if (fbCategory === null) {
      log("Category 'Services' — skipping category fill.");
      return true;
    }
    const target = fbCategory || rawCategory;

    const catTrigger = await pollForElementPromise([
      '[aria-label*="category" i]',
      '[placeholder*="category" i]',
      'select[name*="category" i]',
      'div[role="combobox"][aria-label*="category" i]',
    ], CONFIG.FIELD_TIMEOUT);

    if (!catTrigger) {
      warn("Category trigger not found");
      return false;
    }

    if (catTrigger.tagName === "SELECT") {
      const options = Array.from(catTrigger.options);
      const match = options.find(
        (o) =>
          o.text.toLowerCase().includes(target.toLowerCase()) ||
          target.toLowerCase().includes(o.text.toLowerCase())
      );
      if (match) {
        catTrigger.value = match.value;
        catTrigger.dispatchEvent(new Event("change", { bubbles: true }));
        log("Category set via SELECT:", match.text);
        return true;
      }
      return false;
    }

    catTrigger.click();
    await sleep(600);

    const options = document.querySelectorAll('[role="option"], [role="menuitem"], li[role="option"]');
    for (const opt of options) {
      const text = opt.textContent.trim().toLowerCase();
      if (
        text.includes(target.toLowerCase()) ||
        target.toLowerCase().includes(text)
      ) {
        opt.click();
        log("Category set via dropdown:", opt.textContent.trim());
        return true;
      }
    }

    warn("No matching category option found for:", target);
    return false;
  }

  // ── Fill condition ────────────────────────────────────────────────────────────

  async function fillCondition(rawCondition) {
    if (!rawCondition) return false;

    const fbCondition = CONDITION_MAP[rawCondition] || rawCondition;

    const condTrigger = await pollForElementPromise([
      '[aria-label*="condition" i]',
      'select[name*="condition" i]',
      'div[role="combobox"][aria-label*="condition" i]',
      '[placeholder*="condition" i]',
    ], CONFIG.FIELD_TIMEOUT);

    if (!condTrigger) {
      warn("Condition trigger not found");
      return false;
    }

    if (condTrigger.tagName === "SELECT") {
      const options = Array.from(condTrigger.options);
      const match = options.find(
        (o) =>
          o.text.toLowerCase().includes(fbCondition.toLowerCase()) ||
          fbCondition.toLowerCase().includes(o.text.toLowerCase())
      );
      if (match) {
        condTrigger.value = match.value;
        condTrigger.dispatchEvent(new Event("change", { bubbles: true }));
        log("Condition set via SELECT:", match.text);
        return true;
      }
      return false;
    }

    condTrigger.click();
    await sleep(600);

    const options = document.querySelectorAll('[role="option"], [role="menuitem"], li[role="option"]');
    for (const opt of options) {
      const text = opt.textContent.trim().toLowerCase();
      if (
        text.includes(fbCondition.toLowerCase()) ||
        fbCondition.toLowerCase().includes(text)
      ) {
        opt.click();
        log("Condition set via dropdown:", opt.textContent.trim());
        return true;
      }
    }

    warn("No matching condition option found for:", fbCondition);
    return false;
  }

  // ── Main fill logic ───────────────────────────────────────────────────────────
  //
  // ⛔ NO form.submit() / NO button.click() / NO submit events — EVER.
  //    User must manually review and click the platform's "Post" button.

  async function fillForm(listing) {
    const failedFields = [];
    let fieldsAttempted = 0;
    let fieldsSuccessful = 0;

    log("Starting autofill for listing:", listing.title);

    // ── 1. Category ────────────────────────────────────────────────────────────
    if (listing.category) {
      fieldsAttempted++;
      try {
        const ok = await fillCategory(listing.category);
        if (ok) {
          fieldsSuccessful++;
          log("✅ Category filled");
        } else if (listing.category !== "Services") {
          failedFields.push("Category");
          warn("❌ Category failed");
        }
      } catch (err) {
        warn("Error filling Category:", err.message);
        failedFields.push("Category");
      }
      await sleep(500);
    }

    // ── 2. Title ───────────────────────────────────────────────────────────────
    if (listing.title) {
      fieldsAttempted++;
      try {
        const titleEl = await pollForElementPromise([
          'input[aria-label="Title"]',
          'input[aria-label*="title" i]',
          'input[placeholder*="title" i]',
          'input[placeholder*="What are you selling" i]',
          'input[name="title"]',
          'input[data-testid*="title"]',
          'input[type="text"]:first-of-type',
        ], CONFIG.FIELD_TIMEOUT);

        if (titleEl) {
          const titleValue = listing.title.substring(0, CONFIG.MAX_TITLE_LENGTH);
          setInputValue(titleEl, titleValue);
          fieldsSuccessful++;
          log(`✅ Title filled: ${titleValue.substring(0, 40)}...`);
        } else {
          failedFields.push("Title");
          warn("❌ Title input not found");
        }
      } catch (err) {
        warn("Error filling Title:", err.message);
        failedFields.push("Title");
      }
      await sleep(500);
    }

    // ── 3. Price ───────────────────────────────────────────────────────────────
    if (listing.price) {
      fieldsAttempted++;
      try {
        const priceEl = await pollForElementPromise([
          'input[aria-label="Price"]',
          'input[aria-label*="price" i]',
          'input[placeholder*="price" i]',
          'input[data-testid*="price"]',
          'input[name="price"]',
          'input[type="number"]',
        ], CONFIG.FIELD_TIMEOUT);

        if (priceEl) {
          const numericPrice = String(listing.price).replace(/[^0-9.]/g, "");
          setInputValue(priceEl, numericPrice);
          fieldsSuccessful++;
          log("✅ Price filled:", numericPrice);
        } else {
          failedFields.push("Price");
          warn("❌ Price input not found");
        }
      } catch (err) {
        warn("Error filling Price:", err.message);
        failedFields.push("Price");
      }
      await sleep(500);
    }

    // ── 4. Condition ───────────────────────────────────────────────────────────
    if (listing.condition) {
      fieldsAttempted++;
      try {
        const ok = await fillCondition(listing.condition);
        if (ok) {
          fieldsSuccessful++;
          log("✅ Condition filled");
        } else {
          failedFields.push("Condition");
          warn("❌ Condition failed");
        }
      } catch (err) {
        warn("Error filling Condition:", err.message);
        failedFields.push("Condition");
      }
      await sleep(500);
    }

    // ── 5. Description ─────────────────────────────────────────────────────────
    if (listing.description) {
      fieldsAttempted++;
      try {
        const descEl = await pollForElementPromise([
          'textarea[aria-label="Description"]',
          'textarea[aria-label*="description" i]',
          'textarea[placeholder*="description" i]',
          'textarea[placeholder*="Describe" i]',
          'textarea[data-testid*="description"]',
          'textarea[name="description"]',
          'div[contenteditable="true"]',
        ], CONFIG.FIELD_TIMEOUT);

        if (descEl) {
          const descValue = listing.description.substring(0, CONFIG.MAX_DESCRIPTION_LENGTH);
          if (descEl.tagName === "TEXTAREA") {
            setTextareaValue(descEl, descValue);
          } else {
            fillContentEditable(descEl, descValue);
          }
          fieldsSuccessful++;
          log("✅ Description filled");
        } else {
          failedFields.push("Description");
          warn("❌ Description textarea not found");
        }
      } catch (err) {
        warn("Error filling Description:", err.message);
        failedFields.push("Description");
      }
      await sleep(500);
    }

    // ── 6. Brand (best-effort, no failure recorded) ────────────────────────────
    if (listing.brand) {
      try {
        const brandEl = await pollForElementPromise([
          'input[aria-label*="brand" i]',
          'input[placeholder*="brand" i]',
          'input[name*="brand" i]',
          'input[data-testid*="brand"]',
        ], CONFIG.FIELD_TIMEOUT);
        if (brandEl) {
          setInputValue(brandEl, listing.brand);
          log("✅ Brand filled (best-effort)");
        } else {
          log("ℹ️ Brand field not present on this Facebook form (best-effort)");
        }
      } catch (err) {
        warn("Error filling Brand (best-effort):", err.message);
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
    showBanner(failedFields);

    const success = failedFields.length === 0;
    log(`Autofill complete. Attempted: ${fieldsAttempted}, Successful: ${fieldsSuccessful}, Failed: ${failedFields.length}`);

    // Report result to extension background/popup
    try {
      chrome.runtime.sendMessage({
        action: "autofillComplete",
        platform: CONFIG.PLATFORM,
        success,
        fieldsAttempted,
        fieldsSuccessful,
        failedFields,
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
      log("No pending post — exiting.");
      return;
    }
    if (listing.platform && listing.platform !== CONFIG.PLATFORM) {
      log("Post is for:", listing.platform, "— not Facebook, exiting.");
      return;
    }

    log("Pending post found:", listing.title);

    // Wait for form to mount, then fill
    pollForElement(
      [
        'input[aria-label="Title"]',
        'input[aria-label*="title" i]',
        'input[placeholder*="title" i]',
        'input[placeholder*="What are you selling" i]',
        'input[name="title"]',
        'input[type="text"]',
      ],
      () => fillForm(listing),
      CONFIG.POLL_TIMEOUT
    );
  });

  log("Content script loaded — manual-only autofill active.");
})();
