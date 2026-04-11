// Copie Past-e Smart Post — Facebook Marketplace Content Script
// Runs on: https://www.facebook.com/marketplace/create/*
// Reads pending listing from storage and auto-fills the React-controlled form.
// Fill order: Category → Title → Price → Condition → Description → Images
// Waits 500ms between each field fill.

"use strict";

(function () {
  const LOG = "[Copie Past-e FB]";
  const POLL_INTERVAL = 500;
  const POLL_TIMEOUT = 15000;

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
    "Services": null, // skip
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
  };

  // ── React input helpers ──────────────────────────────────────────────────────

  function fillReactInput(element, value) {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value"
    ).set;
    nativeInputValueSetter.call(element, value);
    element.dispatchEvent(new Event("input", { bubbles: true }));
    element.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function fillReactTextarea(element, value) {
    const nativeValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype,
      "value"
    ).set;
    nativeValueSetter.call(element, value);
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
      const el = document.querySelector(sel);
      if (el) return el;
    }
    return null;
  }

  // ── Poll for element ──────────────────────────────────────────────────────────

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
        console.warn(LOG, "Timed out waiting for:", selectors);
      }
    }, POLL_INTERVAL);
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
        '<span style="color:#00d4ff;font-weight:bold">⚡ Copie Past-e</span> — All fields filled by Copie Past-e. Review and click <strong>Post</strong>.';
    } else {
      message.innerHTML =
        '<span style="color:#ffaa00;font-weight:bold">⚠️ Copie Past-e</span> — Some fields could not be filled. Please check: ' +
        '<strong style="color:#ffaa00">' +
        failedFields.join(", ") +
        "</strong>";
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
    document.body.style.marginTop = banner.offsetHeight + "px";
  }

  // ── Image upload ──────────────────────────────────────────────────────────────

  async function uploadImages(images) {
    if (!images || images.length === 0) return;
    const fileInput = findFirst([
      'input[type="file"][accept*="image"]',
      'input[type="file"]',
    ]);
    if (!fileInput) {
      console.warn(LOG, "No file input found for images");
      return;
    }

    const files = [];
    for (const url of images.slice(0, 5)) {
      try {
        const resp = await fetch(url);
        const blob = await resp.blob();
        const ext = blob.type === "image/png" ? "png" : "jpg";
        files.push(new File([blob], `listing-image.${ext}`, { type: blob.type || "image/jpeg" }));
        await sleep(300);
      } catch (err) {
        console.warn(LOG, "Failed to fetch image:", url, err);
      }
    }

    if (files.length > 0) {
      const dt = new DataTransfer();
      for (const f of files) dt.items.add(f);
      fileInput.files = dt.files;
      fileInput.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }

  // ── Fill category ─────────────────────────────────────────────────────────────

  async function fillCategory(rawCategory) {
    if (!rawCategory) return false;

    // Map to Facebook category name; null means skip
    const fbCategory = CATEGORY_MAP[rawCategory];
    if (fbCategory === null) {
      console.log(LOG, "Category 'Services' — skipping category fill.");
      return true; // treated as success (intentional skip)
    }
    const target = fbCategory || rawCategory;

    const catTrigger = findFirst([
      '[aria-label*="category" i]',
      '[placeholder*="category" i]',
      'select[name*="category" i]',
      'div[role="combobox"][aria-label*="category" i]',
    ]);
    if (!catTrigger) {
      console.warn(LOG, "Category trigger not found");
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
        return true;
      }
      return false;
    }

    // Click to open dropdown
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
        return true;
      }
    }

    console.warn(LOG, "No matching category option found for:", target);
    return false;
  }

  // ── Fill condition ────────────────────────────────────────────────────────────

  async function fillCondition(rawCondition) {
    if (!rawCondition) return false;

    const fbCondition = CONDITION_MAP[rawCondition] || rawCondition;

    const condTrigger = findFirst([
      '[aria-label*="condition" i]',
      'select[name*="condition" i]',
      'div[role="combobox"][aria-label*="condition" i]',
      '[placeholder*="condition" i]',
    ]);
    if (!condTrigger) {
      console.warn(LOG, "Condition trigger not found");
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
        return true;
      }
    }

    console.warn(LOG, "No matching condition option found for:", fbCondition);
    return false;
  }

  // ── Main fill logic (sequential, 500ms between fields) ───────────────────────

  async function fillForm(listing) {
    const failedFields = [];

    // ── 1. Category ────────────────────────────────────────────────────────────
    if (listing.category) {
      const ok = await fillCategory(listing.category);
      if (!ok && listing.category !== "Services") failedFields.push("Category");
    }
    await sleep(500);

    // ── 2. Title ───────────────────────────────────────────────────────────────
    const titleEl = findFirst([
      'input[aria-label="Title"]',
      'input[aria-label*="title" i]',
      'input[placeholder*="title" i]',
      'input[name="title"]',
      'input[type="text"]:first-of-type',
    ]);
    if (titleEl && listing.title) {
      fillReactInput(titleEl, listing.title);
    } else if (listing.title) {
      failedFields.push("Title");
    }
    await sleep(500);

    // ── 3. Price ───────────────────────────────────────────────────────────────
    const priceEl = findFirst([
      'input[aria-label="Price"]',
      'input[aria-label*="price" i]',
      'input[placeholder*="price" i]',
      'input[name="price"]',
      'input[type="number"]',
    ]);
    if (priceEl && listing.price) {
      // Ensure numeric only (no $ symbol)
      const numericPrice = String(listing.price).replace(/[^0-9.]/g, "");
      fillReactInput(priceEl, numericPrice);
    } else if (listing.price) {
      failedFields.push("Price");
    }
    await sleep(500);

    // ── 4. Condition ───────────────────────────────────────────────────────────
    if (listing.condition) {
      const ok = await fillCondition(listing.condition);
      if (!ok) failedFields.push("Condition");
    }
    await sleep(500);

    // ── 5. Description ─────────────────────────────────────────────────────────
    const descEl = findFirst([
      'textarea[aria-label="Description"]',
      'textarea[aria-label*="description" i]',
      'textarea[placeholder*="description" i]',
      'textarea[name="description"]',
      'div[contenteditable="true"]',
    ]);
    if (descEl && listing.description) {
      if (descEl.tagName === "TEXTAREA") {
        fillReactTextarea(descEl, listing.description);
      } else {
        fillContentEditable(descEl, listing.description);
      }
    } else if (listing.description) {
      failedFields.push("Description");
    }
    await sleep(500);

    // ── 6. Images ──────────────────────────────────────────────────────────────
    if (listing.images && listing.images.length > 0) {
      await uploadImages(listing.images).catch((err) =>
        console.warn(LOG, "Image upload error:", err)
      );
    }

    // Clear storage and show banner
    chrome.storage.local.remove("pendingPost");
    showBanner(failedFields);
  }

  // ── Boot ──────────────────────────────────────────────────────────────────────

  chrome.storage.local.get("pendingPost", (result) => {
    const listing = result.pendingPost;
    if (!listing) {
      console.log(LOG, "No pending post — exiting.");
      return;
    }

    console.log(LOG, "Pending post found:", listing.title);

    // Wait for form to load (poll for title input)
    pollForElement(
      [
        'input[aria-label="Title"]',
        'input[aria-label*="title" i]',
        'input[placeholder*="title" i]',
        'input[name="title"]',
        'input[type="text"]',
      ],
      () => fillForm(listing),
      POLL_TIMEOUT
    );
  });
})();
