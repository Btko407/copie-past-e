# Copie Past-e — Integration Health Report

_Last updated: build following V31 audit_

---

## Architecture Overview

- **Platform:** Internet Computer (ICP) — Motoko canister + React/TypeScript frontend.
- **No Node.js server.** No Supabase. No external database. All state lives in canister
  memory (enhanced orthogonal persistence — no `stable` keyword needed in modern Motoko).
- **No webhooks.** The canister cannot receive inbound HTTP requests. Stripe payment
  verification is polling-based: canister creates a session → user pays → frontend calls
  `verifyAndGrantPayment` → canister polls Stripe GET endpoint to confirm.
- **All persistent config** (Stripe keys, Price IDs, Gemini API key, site URL, maintenance
  mode) is stored in the `appConfig : Map<Text, ConfigEntry>` collection. Nothing in
  environment variables; nothing lost on redeploy.

---

## Build Pipeline

```
1. cd src/backend && mops build        → produces src/backend/dist/backend.did
2. cd <root>       && pnpm bindgen     → generates src/frontend/src/backend.ts + backend.d.ts
3. cd src/frontend && pnpm build       → bundles the frontend
```

### Important ordering constraint

`bindgen` **requires** `backend.did` to exist first. If the DID is missing, `caffeine-bindgen`
will produce empty or broken declarations, causing silent runtime failures. Always run
`mops build` before `pnpm bindgen`.

> **Note:** The root `package.json` bindgen script is managed by the platform (protected file)
> and currently has no pre-flight DID existence check. Until that check is added, ensure
> `mops build` has completed successfully before running `pnpm bindgen`.

---

## HTTP Outcall Requirements

Every call from a canister to an external API consumes cycles and goes through ICP's consensus
mechanism by default. Both constraints must be addressed per call.

### Cycles amounts (minimum, tested values)

| Call type                    | Minimum cycles       |
|------------------------------|----------------------|
| Gemini OCR scan (POST+image) | 100 000 000 000 (100 B) |
| Gemini test connection       | 10 000 000 000 (10 B)  |
| Stripe POST (create session) | 49 140 000 000 (49 B)  |
| Stripe GET (verify/account)  | 20 949 972 000 (21 B)  |

Cycles are attached with the `(with cycles = N)` syntax before the `await` expression.

### Non-replicated outcalls (`is_replicated = ?false`)

Gemini and Stripe return non-deterministic responses (timestamps, request IDs, token counts).
Setting `is_replicated = ?false` routes the call through a single replica, bypassing the
consensus requirement. Without this flag all 13 replicas independently call the API and ICP
rejects the response because the results differ.

Apply `is_replicated = ?false` to **all** Gemini and Stripe outcalls.

### Transform functions

When `is_replicated` is not available or as a defence-in-depth measure, transform functions
strip all non-deterministic fields before consensus is attempted. Every transform must set
`headers = []` — response headers always differ between replicas.

---

## Fixed Issues (Audit Trail)

| # | Issue | Fix | File(s) |
|---|-------|-----|---------|
| 1 | Cycles too low (0–2 B) on all outcalls | Set to correct values (100 B OCR, 49 B Stripe POST, 21 B Stripe GET) | `mixins/ocr-api.mo`, `mixins/stripe-checkout-api.mo` |
| 2 | `is_replicated = null` on all Gemini/Stripe calls | Changed to `?false` on all 5 HTTP outcalls | `mixins/ocr-api.mo`, `mixins/stripe-checkout-api.mo` |
| 3 | Stripe/Gemini config stored in env vars / memory | Moved to `appConfig` stable Map; written by `adminSetStripeKeys`, `adminSetGeminiKey` | `mixins/config-api.mo` |
| 4 | Webhook code present (architecturally impossible on ICP) | Removed all webhook endpoints and references; replaced with polling via `verifyAndGrantPayment` | `mixins/stripe-checkout-api.mo` |
| 5 | Hardcoded redirect URLs (`past-e-jev.caffeine.xyz`) | Added `site_base_url` appConfig key; `adminSetSiteBaseUrl` / `getSiteBaseUrl`; hardcoded URL kept as fallback default | `mixins/config-api.mo`, `mixins/stripe-checkout-api.mo` |
| 6 | Bindgen silent failures when `backend.did` missing | Task documented; `package.json` is a platform-protected file — add pre-flight check manually if the platform unlocks it | `package.json` (blocked) |

---

## Remaining Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| `pnpm bindgen` runs before `mops build` | Medium | Always run `mops build` first; document in CI |
| Canister runs out of cycles | High | Monitor via `getCanisterCyclesBalance` query in admin Debugger; top up before it drops below 1 T |
| Gemini model returns larger responses than `max_response_bytes` | Low | Current cap is 10 KB; increase if OCR starts truncating large images |
| Stripe API IPv4 reachability | Low | ICP now auto-routes IPv4 through SOCKS proxy; `is_replicated = ?false` bypasses consensus anyway |
| `siteBaseUrl` not set after deploy | Low | Hardcoded fallback to `past-e-jev.caffeine.xyz` keeps existing deployments working |

---

## Future Maintainer Notes

1. **Never overwrite stable state with empty values on upgrade.** The `appConfig` Map and all
   other collections persist across upgrades automatically (enhanced orthogonal persistence).
   Do not add `preupgrade`/`postupgrade` hooks that clear or reset them.

2. **Before adding a new HTTPS outcall**, calculate the cycle requirement using ICP's formula
   and call `Cycles.add(N)` immediately before the `await`. Set `is_replicated = ?false` for
   any API that returns non-deterministic responses. Add a transform function that strips all
   headers and unstable body fields.

3. **No webhooks — ever.** ICP canisters cannot receive inbound HTTP requests. Any payment
   event processing must be triggered by the frontend calling a canister update method which
   then polls the payment provider.

4. **Config changes via admin panel only.** All keys are written to `appConfig` via the typed
   setter functions (`adminSetStripeKeys`, `adminSetStripePrices`, `adminSetGeminiKey`,
   `adminSetSiteBaseUrl`). Never hardcode API keys or URLs in `.mo` source files except as
   fallback defaults.

5. **`mops build` → `pnpm bindgen` ordering is mandatory.** The DID file produced by
   `mops build` is the source of truth for the TypeScript actor bindings. Stale or missing
   bindings cause silent runtime failures, not compile errors.
