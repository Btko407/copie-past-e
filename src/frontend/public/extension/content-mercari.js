// Copie Past-e Smart Post — Mercari Content Script
// Runs on: https://www.mercari.com/sell/*
// Reads pending listing from storage and auto-fills the form.
// Fill order: Title → Description → Price → Category → Condition → Images

"use strict";

(function () {
  const LOG = "[Copie Past-e Mercari]";
  const POLL_INTERVAL = 500;
  const POLL_TIMEOUT = 20000;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const CATEGORY_MAP = {
    "Appliances":           "Home & Living",
    "Automotive":           "Vehicles & Parts",
    "Baby & Kids":          "Kids & Baby",
    "Books & Magazines":    "Books, Music & Games",
    "Clothing & Shoes":     "Clothing, Shoes & Accessories",
    "Collectibles":         "Collectibles",
    "Electronics & Media":  "Electronics",
    "Furniture":            "Home & Living",
    "Home & Garden":        "Home & Living",
    "Jewelry & Accessories":"Jewelry & Accessories",
    "Tools & Machinery":    "Home & Living",
    "Office Supplies":      "Office & Industrial",
    "Services":             null,
  };

  const CONDITION_MAP = {
    "New":                 "Like New",
    "Used - Good":         "Good",
    "Used -- Good":        "Good",
    "Used - Fair":         "Fair",
    "Used -- Fair":        "Fair",
    "Used - Normal Wear":  "Good",
    "Used -- Normal Wear": "Good",
  };

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

  function showBanner(failedFields) {
    const existing = document.getElementById("copie-paste-banner");
    if (existing) existing.remove();
    const banner = document.createElement("div");
    banner.id = "copie-paste-banner";
    Object.assign(banner.style, {
      position: "fixed", top: "0", left: "0", right: "0",
      zIndex: "999999", background: "#0a0a1a",
      borderBottom: "3px solid #ff4d00", color: "#ffffff",
      padding: "12px 20px", fontFamily: "system-ui, sans-serif",
      fontSize: "14px", display: "flex",
      justifyContent: "space-between", alignItems: "center",
      boxShadow: "0 2px 20px rgba(255, 77, 0, 0.25)",
    });
    const msg = document.createElement("span");
    if (!failedFields || failedFields.length === 0) {
      msg.innerHTML = '<span style="color:#ff6633;font-weight:bold">⚡ Copie Past-e</span> — All fields filled. Review and click <strong>List</strong>.';
    } else {
      msg.innerHTML = '<span style="color:#ffaa00;font-weight:bold">⚠️ Copie Past-e</span> — Could not fill: <strong style="color:#ffaa00">' + failedFields.join(", ") + "</strong>";
    }
    const x = document.createElement("button");
    x.textContent = "×";
    Object.assign(x.style, { background: "none", border: "none", color: "#aaa", fontSize: "20px", cursor: "pointer", marginLeft: "16px" });
    x.addEventListener("click", () => { banner.remove(); document.body.style.marginTop = ""; });
    banner.appendChild(msg);
    banner.appendChild(x);
    document.body.insertBefore(banner, document.body.firstChild);
    document.body.style.marginTop = banner.offsetHeight + "px";
  }

  async function fillCategory(rawCategory) {
    if (!rawCategory) return false;
    const mapped = CATEGORY_MAP[rawCategory];
    if (mapped === null) return true;
    const target = mapped || rawCategory;
    const trigger = findFirst([
      'button[data-testid*="category"]',
      'button[aria-label*="category" i]',
      '[data-testid="item-category-selector"]',
      'select[name="category"]',
    ]);
    if (!trigger) { console.warn(LOG, "Category trigger not found"); return false; }
    trigger.click();
    await sleep(800);
    const opts = document.querySelectorAll('[role="option"], [role="menuitem"], [data-testid*="category-option"], li');
    for (const opt of opts) {
      const text = opt.textContent.trim();
      if (text.toLowerCase().includes(target.toLowerCase()) || target.toLowerCase().includes(text.toLowerCase())) {
        opt.click(); return true;
      }
    }
    document.body.click();
    return false;
  }

  async function fillCondition(rawCondition) {
    if (!rawCondition) return false;
    const mapped = CONDITION_MAP[rawCondition] || rawCondition;
    const trigger = findFirst([
      'select[name*="condition" i]',
      'button[aria-label*="condition" i]',
      '[data-testid*="condition"]',
      'button[data-testid="item-condition-selector"]',
    ]);
    if (!trigger) { console.warn(LOG, "Condition trigger not found"); return false; }
    if (trigger.tagName === "SELECT") {
      const opts = Array.from(trigger.options);
      const match = opts.find(o => o.text.toLowerCase().includes(mapped.toLowerCase()) || mapped.toLowerCase().includes(o.text.toLowerCase()));
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

  async function uploadImages(images) {
    if (!images || images.length === 0) return;
    const fileInput = findFirst(['input[type="file"][accept*="image"]', 'input[type="file"]']);
    if (!fileInput) { console.warn(LOG, "No file input for images"); return; }
    const files = [];
    for (const url of images.slice(0, 5)) {
      try {
        const resp = await fetch(url);
        const blob = await resp.blob();
        const ext = blob.type === "image/png" ? "png" : "jpg";
        files.push(new File([blob], "listing-image." + ext, { type: blob.type || "image/jpeg" }));
        await sleep(300);
      } catch (err) { console.warn(LOG, "Image fetch failed:", url, err); }
    }
    if (files.length > 0) {
      const dt = new DataTransfer();
      for (const f of files) dt.items.add(f);
      fileInput.files = dt.files;
      fileInput.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }

  async function fillForm(listing) {
    const failed = [];

    // 1. Title
    const titleEl = findFirst([
      'input[name="name"]',
      'input[placeholder*="What are you selling" i]',
      'input[aria-label*="title" i]',
      'input[data-testid*="item-name"]',
      'input[placeholder*="item" i]',
    ]);
    if (titleEl && listing.title) { fillInput(titleEl, listing.title); }
    else if (listing.title) { failed.push("Title"); }
    await sleep(500);

    // 2. Description
    const descEl = findFirst([
      'textarea[name="description"]',
      'textarea[placeholder*="description" i]',
      'textarea[aria-label*="description" i]',
      '[data-testid*="description"] textarea',
      'textarea',
    ]);
    if (descEl && listing.description) { fillTextarea(descEl, listing.description); }
    else if (listing.description) {
      const ce = findFirst(['[contenteditable="true"]', '[aria-label*="description" i][contenteditable]']);
      if (ce) { fillContentEditable(ce, listing.description); }
      else { failed.push("Description"); }
    }
    await sleep(500);

    // 3. Price
    const priceEl = findFirst([
      'input[name="price"]',
      'input[placeholder*="price" i]',
      'input[aria-label*="price" i]',
      'input[type="number"]',
      'input[data-testid*="price"]',
    ]);
    if (priceEl && listing.price) {
      const numeric = String(listing.price).replace(/[^0-9.]/g, "");
      fillInput(priceEl, numeric);
    } else if (listing.price) { failed.push("Price"); }
    await sleep(500);

    // 4. Category
    if (listing.category) {
      const ok = await fillCategory(listing.category);
      if (!ok && listing.category !== "Services") failed.push("Category");
    }
    await sleep(500);

    // 5. Condition
    if (listing.condition) {
      const ok = await fillCondition(listing.condition);
      if (!ok) failed.push("Condition");
    }
    await sleep(500);

    // 6. Images
    if (listing.images && listing.images.length > 0) {
      await uploadImages(listing.images).catch(err => console.warn(LOG, "Image upload error:", err));
    }

    chrome.storage.local.remove("pendingPost");
    showBanner(failed);
  }

  chrome.storage.local.get("pendingPost", (result) => {
    const listing = result.pendingPost;
    if (!listing) { console.log(LOG, "No pending post."); return; }
    if (listing.platform && listing.platform !== "mercari") {
      console.log(LOG, "Post is for:", listing.platform, "— not Mercari, exiting.");
      return;
    }
    console.log(LOG, "Pending post:", listing.title);
    pollForElement(
      ['input[name="name"]', 'input[placeholder*="What are you selling" i]', 'input[aria-label*="title" i]', 'textarea[name="description"]'],
      () => fillForm(listing),
      POLL_TIMEOUT
    );
  });
})();
