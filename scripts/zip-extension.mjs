#!/usr/bin/env node
/**
 * zip-extension.mjs
 * Generates a real installable Chrome extension ZIP from src/extension/
 * Output: src/frontend/public/copie-paste-extension-v{version}.zip
 *
 * The archive has a top-level folder: copie-paste-extension/
 * Script fails loudly if any required file is missing or ZIP creation fails.
 * Run from any directory — all paths are resolved relative to this file.
 *
 * Uses JSZip (pure JS) since zip CLI may not be present in all environments.
 */

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const EXTENSION_SRC = path.resolve(ROOT, "src", "extension");
const PUBLIC_DIR = path.resolve(ROOT, "src", "frontend", "public");

// ── Required files (relative to src/extension/) ────────────────────────────
const REQUIRED_FILES = [
  "manifest.json",
  "background.js",
  "content-detection.js",
  "content-facebook.js",
  "content-mercari.js",
  "content-ebay.js",
  "content-poshmark.js",
  "content-depop.js",
  "content-etsy.js",
  "popup.html",
  "popup.js",
  "popup.css",
  "utils.js",
  "icons/icon-16.png",
  "icons/icon-48.png",
  "icons/icon-128.png",
  "README.txt",
];

// ── Helpers ─────────────────────────────────────────────────────────────────
function fail(msg) {
  console.error(`\n✗ ${msg}`);
  process.exit(1);
}

// Recursively walk a directory and return all file paths relative to it
function walkDir(dir, base = dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkDir(full, base));
    } else {
      results.push(path.relative(base, full));
    }
  }
  return results;
}

// ── Step 1: Verify extension source directory ───────────────────────────────
if (!fs.existsSync(EXTENSION_SRC)) {
  fail(`Extension source directory not found: ${EXTENSION_SRC}`);
}

// ── Step 2: Read version from manifest.json ─────────────────────────────────
const manifestPath = path.join(EXTENSION_SRC, "manifest.json");
let version;
try {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
  version = manifest.version;
  if (!version) throw new Error("'version' field is missing or empty");
} catch (err) {
  fail(`Cannot read version from manifest.json — ${err.message}`);
}

console.log(`\n◆ Copie Past-e extension v${version} — building ZIP`);

// ── Step 3: Validate all required files are present ─────────────────────────
console.log("  Checking required files...");
const missing = [];
for (const file of REQUIRED_FILES) {
  const full = path.join(EXTENSION_SRC, file);
  if (!fs.existsSync(full)) {
    missing.push(file);
    console.error(`  ✗ MISSING: ${file}`);
  } else {
    console.log(`  ✓ ${file}`);
  }
}
if (missing.length > 0) {
  for (const f of missing) {
    console.error(`ERROR: Missing required extension file: ${f}`);
  }
  process.exit(1);
}

// ── Step 4: Load JSZip via CJS require (resolves through pnpm symlinks) ────────
console.log("\n  Loading JSZip...");

// createRequire from the frontend package.json so pnpm resolves jszip there
const frontendRequire = createRequire(
  path.resolve(ROOT, "src", "frontend", "package.json")
);

let JSZip;
try {
  JSZip = frontendRequire("jszip");
} catch {
  // Fall back to root node_modules
  try {
    const rootRequire = createRequire(path.resolve(ROOT, "package.json"));
    JSZip = rootRequire("jszip");
  } catch {
    fail(
      "JSZip not found. Run `pnpm install` in src/frontend/ first (jszip is a dependency)."
    );
  }
}

console.log("  JSZip loaded.");

// ── Step 5: Build ZIP in memory ─────────────────────────────────────────────
console.log(`  Building ZIP archive...`);

const zip = new JSZip();
const allFiles = walkDir(EXTENSION_SRC);

for (const relPath of allFiles) {
  const fullPath = path.join(EXTENSION_SRC, relPath);
  // Store under copie-paste-extension/ top-level folder (use forward slashes)
  const zipEntry = `copie-paste-extension/${relPath.split(path.sep).join("/")}`;
  const content = fs.readFileSync(fullPath);
  zip.file(zipEntry, content);
}

// ── Step 6: Ensure output directory exists ──────────────────────────────────
fs.mkdirSync(PUBLIC_DIR, { recursive: true });

const ZIP_FILENAME = `copie-paste-extension-v${version}.zip`;
const ZIP_PATH = path.join(PUBLIC_DIR, ZIP_FILENAME);

// Remove old ZIP if exists
if (fs.existsSync(ZIP_PATH)) fs.rmSync(ZIP_PATH);

// Also clean up the legacy copie-past-e.zip so old download links 404 cleanly
const LEGACY_ZIP = path.join(PUBLIC_DIR, "copie-past-e.zip");
if (fs.existsSync(LEGACY_ZIP)) {
  fs.rmSync(LEGACY_ZIP);
  console.log("  ✓ Removed legacy copie-past-e.zip");
}

// ── Step 7: Write ZIP to disk ────────────────────────────────────────────────
console.log(`  Writing ${ZIP_FILENAME}...`);
const zipBuffer = await zip.generateAsync({
  type: "nodebuffer",
  compression: "DEFLATE",
  compressionOptions: { level: 6 },
});
fs.writeFileSync(ZIP_PATH, zipBuffer);

// ── Step 8: Validate the output ──────────────────────────────────────────────
if (!fs.existsSync(ZIP_PATH)) {
  fail("ZIP file was not created.");
}

const stats = fs.statSync(ZIP_PATH);
if (stats.size < 1024) {
  fail(
    `ZIP file is suspiciously small (${stats.size} bytes). Expected a real archive > 1 KB.`
  );
}

// Verify first 4 bytes are PK\x03\x04 (ZIP local file header magic)
const fd = fs.openSync(ZIP_PATH, "r");
const magic = Buffer.alloc(4);
fs.readSync(fd, magic, 0, 4, 0);
fs.closeSync(fd);
if (magic[0] !== 0x50 || magic[1] !== 0x4b || magic[2] !== 0x03 || magic[3] !== 0x04) {
  fs.rmSync(ZIP_PATH);
  fail(
    `ERROR: ZIP output appears to be HTML, not a valid archive (magic bytes: ${magic.toString("hex")})`
  );
}

// ── Done ─────────────────────────────────────────────────────────────────────
const sizeKb = (stats.size / 1024).toFixed(1);
console.log(`\nZIP generated successfully: ${ZIP_FILENAME}`);
console.log(`  Size: ${stats.size} bytes / ${sizeKb} KB`);
console.log(`  Path: ${ZIP_PATH}\n`);
