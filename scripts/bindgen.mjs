#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { accessSync, constants } from "node:fs";
import { resolve } from "node:path";

const repoRoot = resolve(new URL("..", import.meta.url).pathname);
const didFile = resolve(repoRoot, "src/backend/dist/backend.did");
const outDir = resolve(repoRoot, "src/frontend/src");

const fallbackFiles = [
  resolve(outDir, "backend.ts"),
  resolve(outDir, "declarations/backend.did.d.ts"),
  resolve(outDir, "declarations/backend.did.js"),
];

const exists = (file) => {
  try {
    accessSync(file, constants.F_OK | constants.R_OK);
    return true;
  } catch {
    return false;
  }
};

const hasAllFallbacks = fallbackFiles.every(exists);

const args = [
  "--did-file",
  didFile,
  "--out-dir",
  outDir,
  "--actor-interface-file",
  "--force",
];

const run = (command, commandArgs = []) =>
  spawnSync(command, commandArgs, {
    cwd: repoRoot,
    stdio: "inherit",
  });

const localBindgen = resolve(repoRoot, "node_modules/.bin/caffeine-bindgen");
if (exists(localBindgen)) {
  const localResult = run(localBindgen, args);
  if (localResult.status === 0) process.exit(0);
}

const fallbackResult = run("npx", ["--yes", "@caffeinelabs/bindgen", ...args]);
if (fallbackResult.status === 0) {
  process.exit(0);
}

if (hasAllFallbacks) {
  console.warn(
    "[bindgen] Skipping generation because bindgen binary is unavailable. Using checked-in generated bindings.",
  );
  process.exit(0);
}

console.error(
  "[bindgen] Failed to generate bindings and no fallback generated files were found in src/frontend/src.",
);
process.exit(1);
