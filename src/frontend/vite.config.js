import { fileURLToPath, URL } from "url";
import { execSync } from "child_process";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import environment from "vite-plugin-environment";

function zipExtensionPlugin() {
  return {
    name: "zip-extension",
    closeBundle() {
      if (this.environment?.mode !== "build" && process.env.NODE_ENV !== "production") {
        // Skip during dev server
        return;
      }
      try {
        execSync("node ../../scripts/zip-extension.mjs", { stdio: "inherit" });
        console.log("\x1b[32m✓ Extension zipped → public/copie-past-e.zip\x1b[0m");
      } catch (err) {
        console.warn("\x1b[33m⚠ zip-extension: failed to build extension zip —", err.message, "\x1b[0m");
      }
    },
  };
}

const ii_url =
  process.env.DFX_NETWORK === "local"
    ? `http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:8081/`
    : `https://identity.internetcomputer.org/`;

process.env.II_URL = process.env.II_URL || ii_url;
process.env.STORAGE_GATEWAY_URL =
  process.env.STORAGE_GATEWAY_URL || "https://blob.caffeine.ai";

export default defineConfig(({ command }) => ({
  logLevel: "error",
  build: {
    emptyOutDir: true,
    sourcemap: false,
    minify: false,
  },
  css: {
    postcss: "./postcss.config.js",
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:4943",
        changeOrigin: true,
      },
    },
  },
  plugins: [
    environment("all", { prefix: "CANISTER_" }),
    environment("all", { prefix: "DFX_" }),
    environment(["II_URL"]),
    environment(["STORAGE_GATEWAY_URL"]),
    react(),
    command === "build" ? zipExtensionPlugin() : null,
  ].filter(Boolean),
  resolve: {
    alias: [
      {
        find: "declarations",
        replacement: fileURLToPath(new URL("../declarations", import.meta.url)),
      },
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
    ],
    dedupe: ["@dfinity/agent"]
  },
}));
