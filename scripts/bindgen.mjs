import { execSync } from "child_process";
import fs from "fs";

console.log("Running mops build...");
execSync("mops build", { stdio: "inherit", cwd: process.cwd() });

if (!fs.existsSync("./src/backend/dist/backend.did")) {
  console.error("ERROR: backend.did missing. Build failed.");
  process.exit(1);
}

console.log("Generating bindings...");
execSync("pnpm bindgen", { stdio: "inherit" });

console.log("Build pipeline OK");
