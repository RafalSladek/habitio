# Cost Tracking for Cloudflare Workers AI Coach

**Date:** 2026-05-07
**Scope:** `worker/feedback.js` + `worker/wrangler.toml` + `app.js` (budget field path update)

## Goal

Track actual USD cost of Workers AI coach requests. Enforce a global monthly spending cap in addition to the existing per-device daily cap. Expose a protected admin endpoint to query totals.

## Storage — KV Namespace

Reuse the existing `COACH_BUDGETS` KV binding (currently commented out in `wrangler.toml` — needs to be created and un-commented).

### Key schema

| Key | Value | TTL |
|-----|-------|-----|
| `budget:device:{deviceId}:{YYYY-MM-DD}` | `{ requests, tokens_in, tokens_out }` | 2 days |
| `budget:global:{YYYY-MM}` | `{ requests, tokens_in, tokens_out, usd }` | 40 days |

The in-memory `budgetCache` Map is kept as a fallback for local dev when KV is not bound.

## Actual Token Extraction

After `env.AI.run()` succeeds, read actual usage from the response:

```js
const tokens_in  = result?.usage?.prompt_tokens     ?? estimatedPromptTokens;
const tokens_out = result?.usage?.completion_tokens ?? config.maxOutputTokens;
```

The `??` fallback preserves the estimate if the field is absent (defensive, not expected).

## USD Calculation

```js
cost_usd = (tokens_in  / 1_000_000 * config.priceInputPerM)
         + (tokens_out / 1_000_000 * config.priceOutputPerM)
```

### New env vars in `wrangler.toml`

```toml
COACH_PRICE_INPUT_PER_M  = "0.11"   # USD per 1M input tokens
COACH_PRICE_OUTPUT_PER_M = "0.19"   # USD per 1M output tokens
COACH_MONTHLY_BUDGET_USD = "2.00"   # Hard monthly cap in USD
```

Rates are tunable without redeploying (update via dashboard or wrangler.toml + redeploy).

## Enforcement Logic

Two independent checks at the start of `handleCoach`, in order:

### 1. Global monthly USD cap (new)

```
Read budget:global:{YYYY-MM}
If global.usd >= COACH_MONTHLY_BUDGET_USD → 429
```

Response body:
```json
{
  "error": "Monthly budget exceeded",
  "code": "monthly_budget_exceeded",
  "budget": {
    "device": { "requestsUsed": N, "requestsLimit": N, "tokensUsed": N, "tokensLimit": N },
    "global": { "usd": N, "capUsd": N }
  }
}
```

### 2. Per-device daily cap (existing, made persistent)

Existing checks unchanged in logic; now read/write to KV instead of in-memory Map.
Field rename: `estimatedTokens` → `tokens_in + tokens_out` (actual split tracked separately).
Env var rename: `COACH_MAX_DAILY_ESTIMATED_TOKENS` → `COACH_MAX_DAILY_TOKENS`.

## Admin Endpoint

```
GET /budget
Authorization: Bearer <ADMIN_SECRET>
```

### Response

```json
{
  "month": "2026-05",
  "global": { "requests": 47, "tokens_in": 18200, "tokens_out": 8100, "usd": 0.0035 },
  "cap_usd": 2.00,
  "remaining_usd": 1.9965
}
```

Optional: `?month=2026-04` to query a past month.

### Security

`ADMIN_SECRET` is a Wrangler secret (not a var): `wrangler secret put ADMIN_SECRET`.
If the binding is absent, the endpoint returns `503` — fails safe, never exposes data.
If the `Authorization` header is wrong or missing, returns `401`.

### CLI usage

```bash
curl -H "Authorization: Bearer <secret>" \
  https://habitio-feedback.rafal-sladek.workers.dev/budget
```

## Coach Response Changes

The `budget` field in the `200` coach response is restructured:

```json
{
  "feedback": { "encouragement": "...", "candid_feedback": "...", "next_steps": [...] },
  "budget": {
    "device": {
      "requestsUsed": 2,
      "requestsLimit": 5,
      "tokensUsed": 620,       // tokens_in + tokens_out combined
      "tokensLimit": 4500
    },
    "global": {
      "usd": 0.0035,
      "capUsd": 2.00
    }
  },
  "model": "@cf/meta/llama-3.2-3b-instruct"
}
```

### `app.js` impact

The app reads `budget.requestsUsed` and `budget.requestsLimit` from the coach response to render the usage indicator. These paths move to `budget.device.requestsUsed` / `budget.device.requestsLimit`. Requires a targeted update in `app.js`.

## Files Changed

| File | Change |
|------|--------|
| `worker/feedback.js` | Replace estimated token tracking with actual; add global monthly KV key; add USD calculation; add `GET /budget` route; restructure `budget` response field |
| `worker/wrangler.toml` | Un-comment `COACH_BUDGETS` KV binding; add `COACH_PRICE_INPUT_PER_M`, `COACH_PRICE_OUTPUT_PER_M`, `COACH_MONTHLY_BUDGET_USD` vars; rename `COACH_MAX_DAILY_ESTIMATED_TOKENS` → `COACH_MAX_DAILY_TOKENS` |
| `app.js` | Update budget field path: `budget.requestsUsed` → `budget.device.requestsUsed`, `budget.requestsLimit` → `budget.device.requestsLimit` |

## Out of Scope

- Per-request cost returned to client (only aggregate global USD is exposed)
- Alerting / notifications when approaching cap
- Analytics Engine integration
- Splitting feedback and coach into separate workers
