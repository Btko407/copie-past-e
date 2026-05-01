/**
 * zip-extension.mjs
 * Bundles src/extension/ into src/frontend/public/copie-past-e.zip
 * Uses only Node.js built-ins + child_process (system zip command).
 * Run from any directory — all paths are resolved relative to this file.
 */

import { execSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const EXTENSION_DIR = resolve(ROOT, "src", "extension");
const PUBLIC_DIR = resolve(ROOT, "src", "frontend", "public");
const ZIP_PATH = resolve(PUBLIC_DIR, "copie-past-e.zip");

// ── Preflight checks ────────────────────────────────────────────────────────
if (!existsSync(EXTENSION_DIR)) {
  console.error(`ERROR: Extension source directory not found: ${EXTENSION_DIR}`);
  process.exit(1);
}

// ── Ensure public/ exists ───────────────────────────────────────────────────
if (!existsSync(PUBLIC_DIR)) {
  mkdirSync(PUBLIC_DIR, { recursive: true });
  console.log(`Created directory: ${PUBLIC_DIR}`);
}

// ── Remove stale zip before re-creating (reproducibility) ──────────────────
if (existsSync(ZIP_PATH)) {
  try {
    execSync(`rm -f "${ZIP_PATH}"`);
  } catch {
    // non-fatal — zip -r will overwrite anyway
  }
}

// ── Build the zip ───────────────────────────────────────────────────────────
try {
  // Run zip from inside the extension directory so paths inside the archive
  // are relative (e.g. manifest.json, not src/extension/manifest.json).
  execSync(`zip -r "${ZIP_PATH}" .`, {
    cwd: EXTENSION_DIR,
    stdio: "pipe",
  });
  console.log("Extension zipped to public/copie-past-e.zip");
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`ERROR: Failed to zip extension — ${message}`);
  process.exit(1);
}
