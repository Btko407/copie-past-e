#!/usr/bin/env bash
# bindgen-check.sh — Preflight guard for pnpm bindgen
#
# Verifies that src/backend/dist/backend.did exists and is non-empty before
# the caffeine-bindgen CLI runs. A missing or empty DID causes bindgen to
# silently produce broken/empty frontend declarations.
#
# Usage: called automatically by `pnpm bindgen` in root package.json
#        can also be run directly: bash scripts/bindgen-check.sh

set -euo pipefail

DID_PATH="src/backend/dist/backend.did"

if [ ! -f "$DID_PATH" ]; then
  echo ""
  echo "ERROR: $DID_PATH not found."
  echo ""
  echo "  The frontend declarations cannot be generated without a compiled backend DID."
  echo ""
  echo "  Fix: run the following commands first, then retry 'pnpm bindgen':"
  echo "    cd src/backend"
  echo "    mops install"
  echo "    mops build"
  echo ""
  exit 1
fi

DID_SIZE=$(wc -c < "$DID_PATH" | tr -d ' ')

if [ "$DID_SIZE" -eq 0 ]; then
  echo ""
  echo "ERROR: $DID_PATH exists but is empty (0 bytes)."
  echo ""
  echo "  An empty DID file will produce broken frontend declarations."
  echo ""
  echo "  Fix: rebuild the backend to regenerate the DID file:"
  echo "    cd src/backend"
  echo "    mops build"
  echo ""
  exit 1
fi

echo "✓ backend.did found ($DID_SIZE bytes) — proceeding with bindgen"
