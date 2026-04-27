# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**habit.io** — offline-first PWA habit tracker. Vanilla JS, no build step. Edit files directly.

- **Live:** https://habitio.rafal-sladek.com/
- **Deploy:** push `main` → GitHub Actions → GitHub Pages
- **Version:** `v2.9` (localStorage key `habitio_v9`, SW cache `habitio_v9` — always in sync)
- **Full function/line reference:** `PROJECT_INDEX.md`

## Commands

```bash
# Local dev server
npx serve . -p 3000

# Tests — all 4 browser projects
yarn test

# Single test file or by name
npx playwright test tests/analytics.spec.js
npx playwright test -g "should complete onboarding"

# Single browser project
npx playwright test --project="Pixel 5 Chromium"
npx playwright test --project="Tablet Firefox"
npx playwright test --project="iPhone 12 Safari"

# Interactive debug
yarn test:ui
npx playwright test --headed

# Format
yarn format          # write
yarn format:check    # verify only

# SonarCloud (requires SONAR_TOKEN env var)
sonar-scanner

# Worker deploy
cd worker && npx wrangler deploy
cd worker && npx wrangler secret put GITHUB_TOKEN
```

## Model Routing

Use the `model-router` skill when unsure. Quick reference for this project's common tasks:

| Task | Model | Why |
|------|-------|-----|
| `yarn test` / run Playwright | **Haiku** | Pass/fail — mechanical execution |
| `yarn format` / `format:check` | **Haiku** | Deterministic, no judgment needed |
| `sonar-scanner` (run only) | **Haiku** | Mechanical scan execution |
| Fix SonarCloud bugs/smells | **Sonnet** | Requires code quality judgment |
| Security hotspot review | **Sonnet** | Security implications need reasoning |
| Version bump (3 places) | **Haiku** | Find-and-replace across known files |
| `gh run watch` / CI status | **Haiku** | Mechanical wait + report |
| `wrangler deploy` | **Haiku** | Mechanical deploy |
| Update `TODO.md` | **Haiku** | Append completed tasks |
| Debug failing test | **Sonnet** | Root cause requires reasoning |
| New feature / refactor | **Sonnet** | Architecture + correctness decisions |
| Update `CLAUDE.md` / `README.md` | **Sonnet** | Requires architecture understanding |
| Add a new language | **Sonnet** | 100% key parity + all touch-points |
| Write new tests | **Haiku** if happy-path; **Sonnet** if edge cases need business logic |

Commands: `claude --model claude-haiku-4-5-20251001` / `claude --model claude-sonnet-4-6`

## Architecture

No transpilation, no bundling, no modules. All JS is vanilla ES6+ served directly.

| File | Lines | Purpose |
|------|------:|---------|
| `index.html` | 330 | App shell, `<picture>` hero, non-blocking font load |
| `app.js` | 2814 | All application logic |
| `styles.css` | 2300 | All styles |
| `i18n.js` | 6289 | 20-language `T` object + `t()`, `DN()`, `MN()` helpers |
| `suggestions.js` | 138 | Habit suggestions with demographic scoring |
| `sw.js` | 128 | Service worker — network-first app shell + offline fallback |
| `worker/feedback.js` | — | Cloudflare Worker: feedback → GitHub Issues + AI coach proxy |

## Data Model

```
localStorage key: habitio_v9
{
  habits:            Habit[]
  checks:            { [YYYY-MM-DD]: { [habitId]: true } }
  diary:             { [YYYY-MM-DD]: DiaryEntry }
  profile:           { name, age, ageGroup, sex }
  lang:              string
  kitsDismissed:     { [kitId]: true }
  consentAnalytics:  null | true | false
  aiCoach:           { includeDiary, lastFocus, lastFeedback, lastBudget, lastModel, lastRequestedAt }
}
```

- **Habit IDs:** `uid()` → `crypto.randomUUID()` with fallback
- **Dates:** always `fmt(d)` → `toISOString().slice(0,10)` (UTC-based — never use local date methods)
- **Age groups:** `AGE_GROUPS` stores both `profile.ageGroup` (key string) and `profile.age` (representative int) — `getSuggestions()` uses `parseInt(profile.age)`
- **Sex values:** `"male"` | `"female"` | `"prefer"`
- **Cadence types:** `daily` | `specific_days` (+ `days[]`) | `x_per` (+ `count`, `period: week|month`)
- **Coach device ID:** stored separately in `localStorage` under `COACH_DEVICE_KEY = "habitio_ai_device"` — not part of main state

## Version Bump — 3 Places, Always Together

When `app.js`, `styles.css`, `suggestions.js`, `i18n.js`, or `index.html` changes:

1. localStorage key in `save()` and `load()` in `app.js` (e.g. `habitio_v9` → `habitio_v10`)
2. `CACHE` in `sw.js` (same value)
3. `APP_VERSION` in `app.js` → `"v2.10"` (minor version = schema number)

Always add a migration read in `load()` for the old key — never drop user data.

## Service Worker

Network-first for app shell files (`index.html`, `app.js`, `i18n.js`, `suggestions.js`, `styles.css`, manifest, core icons). Stale-while-revalidate for other same-origin assets.

GitHub Pages sets `Cache-Control: max-age=600` — first reload is the best achievable update guarantee without asset fingerprinting.

## Analytics (GA4 — privacy-first)

GA4 script is **not** in `index.html`. Lazy-loaded from `app.js` only after consent. GTM removed entirely.

- Consent: `state.consentAnalytics` (`null` = unasked, `true` = granted, `false` = denied)
- Bootstrap with consent denied → load script only if granted → update consent mode
- Key functions: `ensureAnalyticsBootstrap()`, `loadAnalyticsScript()`, `applyAnalyticsConsent()`, `clearAnalyticsCookies()`, `trackEvent()`, `trackPageView()`, `updateUserProperties()`

Do not load GA4 script unconditionally or reintroduce GTM.

## Cloudflare Worker

- **Live URL:** `https://habitio-feedback.rafal-sladek.workers.dev`
- Routes: `POST /` (feedback → GitHub Issue), `POST /coach` (Cloudflare AI LLM proxy)
- Coach budget: 5 req/day, 4500 estimated tokens/day per device (env-configurable)
- Model: `@cf/meta/llama-3.1-8b-instruct-fast`
- CORS whitelist: `habitio.rafal-sladek.com`, `rafalsladek.github.io`, `localhost:3000`
- Secrets: `GITHUB_TOKEN` in Cloudflare; `CLOUDFLARE_API_TOKEN` in GitHub repo secrets

## CI/CD

```
test (4 browsers) ──┬── test-summary ──┬── deploy (GitHub Pages)
                    ├── sonar          │
                    └── deploy-worker  └── pagespeed (Lighthouse CI)
```

- `test`: matrix of 4 browser projects, uploads lcov + Playwright report artifacts
- `sonar`: merges lcov from all 4, SonarCloud scan + quality gate (blocking)
- `deploy`: generates badges, injects `BUILD_SHA`, deploys Pages, creates release tag
- `pagespeed`: Lighthouse CI against live URL (3 runs, budget: `.github/lighthouse-budget.json`)

## Code Quality — Blocking

SonarCloud Quality Gate must pass before pushing.

1. `sonar-scanner` after every code change
2. Fix all bugs/smells immediately — do not push with open issues
3. Coverage < 80% on new code: add file to `SOURCE_FILES` in `tests/global-teardown.js` or add tests
4. Security hotspot: use `mcp__sonarqube__change_security_hotspot_status` to mark SAFE with justification
5. New files: check `sonar-project.properties` — scripts/fixtures/configs/docs go in `sonar.exclusions`; app source files must not

## Pre-Commit Checklist

1. `yarn format` — Prettier on all source files
2. `yarn test` — all 4 projects must pass
3. `sonar-scanner` — Quality Gate must pass
4. Version bump (3 places) if any source file changed
5. Retake affected screenshots in `docs/` if UI changed (see canonical set below); visually verify each
6. `gh run watch` after push — CI must pass before declaring done
7. Update `TODO.md` with completed tasks
8. Update `CLAUDE.md` + `README.md` if architecture/languages/instructions changed

**Screenshot canonical set:**
- Mobile 393×852: `screenshot-onboarding.png`, `screenshot-tracker.png`, `screenshot-add-habit.png`, `screenshot-journal.png`, `screenshot-journal-summary.png`, `screenshot-stats.png`, `screenshot-settings.png`
- Desktop 1280×800: `desktop-preview.png`, `desktop-stats.png`, `desktop-journal.png`, `desktop-settings.png`, `desktop-modal.png`
- Tablet: `tablet-preview.png`

**Visual checks:** consent banner centered in content column (not full-width); sidebar nav compact; modal hides FAB; no z-index leaks.

**Amend vs new commit:** amend only for direct fix to the immediately preceding unpushed commit (format pass, forgotten file, typo). New commit when change has independent meaning or previous commit is already pushed.

## Post-Push CI Check (Mandatory)

```bash
gh run watch $(gh run list --limit 1 --json databaseId -q '.[0].databaseId')
```

If SonarCloud fails: `gh run view <run-id> --log 2>&1 | grep -A 20 "<step-name>"`

## Performance / Accessibility Constraints

- Google Fonts: non-blocking (`preconnect` + `preload` with `onload` swap) — do not revert to blocking `<link>`
- Hero image: `<picture>` with WebP source + PNG fallback; convert via `ffmpeg -i input.png -c:v libwebp -quality 82 output.webp`
- `--text-muted` CSS var must stay `#7878a0` or lighter (5.3:1 contrast vs dark bg)
- Do not add `user-scalable=no` to viewport

## Adding a New Language

1. Copy `en` object in `i18n.js`, rename to language code — 100% key parity required, missing keys break functionality
2. Add `{ key: "es", name: "🇪🇸 Español" }` to `LANGUAGES` array in `app.js` (alphabetical within region group)
3. Add `<xhtml:link rel="alternate" hreflang="es" .../>` to `sitemap.xml` (alphabetical by hreflang)
4. Update language count in `CLAUDE.md`, `README.md`, `.github/copilot-instructions.md`
5. No storage schema change needed, but bump version if new UI copy was added
