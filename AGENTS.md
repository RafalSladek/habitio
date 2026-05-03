# habit.io — AI Agent Instructions

This file provides guidance to AI coding assistants (Claude, Copilot, Cursor, etc.) when working with code in this repository.

## Project Overview

**habit.io** is an offline-first PWA habit tracker with no build step. All files are edited directly and deployed as-is.

- **Live:** https://habitio.rafal-sladek.com/
- **Deploy:** push `main` → GitHub Actions → GitHub Pages
- **Version:** `v2.10` (localStorage key `habitio_v10`, SW cache `habitio_v10` — always in sync)
- **Languages:** 20 languages supported in i18n.js
- **Full function/line reference:** `PROJECT_INDEX.md`

## Commands

```bash
# Install dependencies (includes Playwright)
yarn install
npx playwright install chromium

# Local dev server
npx serve . -p 3000

# Tests — all 4 browser projects
yarn test

# Run tests in UI mode for debugging
yarn test:ui

# Single test file or by name
npx playwright test tests/analytics.spec.js
npx playwright test -g "should complete onboarding"

# Single browser project
npx playwright test --project="Pixel 5 Chromium"
npx playwright test --project="Tablet Firefox"
npx playwright test --project="iPhone 12 Safari"

# Format code (Prettier)
yarn format          # write
yarn format:check    # verify only

# Validate i18n key parity across all 20 languages
node scripts/validate-i18n.js

# SonarCloud analysis (requires SONAR_TOKEN env var)
sonar-scanner

# Regenerate docs screenshots / GIF / badges
yarn screenshots        # node scripts/take-screenshots.js (requires local server on :3000)
yarn gif                # node scripts/generate-gif.js (requires ffmpeg)
yarn badges:generate    # node scripts/generate-badges.js

# Update Lighthouse performance table in README.md
node scripts/update-pagespeed.js

# All-in-one pre-commit check (format:check + test)
yarn precommit

# Worker deploy
cd worker && npx wrangler whoami  # Verify account
cd worker && npx wrangler deploy
cd worker && npx wrangler secret put GITHUB_TOKEN
```

## Model Routing (Claude-specific)

Use the `model-router` skill when unsure. Quick reference for this project's common tasks:

| Task | Model | Why |
|------|-------|-----|
| `yarn test` / run Playwright | **Haiku** | Pass/fail — mechanical execution |
| `yarn format` / `format:check` | **Haiku** | Deterministic, no judgment needed |
| `sonar-scanner` (run only) | **Haiku** | Mechanical scan execution |
| Fix SonarCloud bugs/smells | **Sonnet** | Requires code quality judgment |
| Security hotspot review | **Sonnet** | Security implications need reasoning |
| Version bump (3 places + tests) | **Haiku** | Find-and-replace across known files |
| `gh run watch` / CI status | **Haiku** | Mechanical wait + report |
| `wrangler deploy` | **Haiku** | Mechanical deploy |
| Update `TODO.md` | **Haiku** | Append completed tasks |
| Debug failing test | **Sonnet** | Root cause requires reasoning |
| New feature / refactor | **Sonnet** | Architecture + correctness decisions |
| Update documentation | **Sonnet** | Requires architecture understanding |
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

**Key point:** No transpilation, no bundling, no modules. All JS is vanilla ES6+ that runs directly in browsers.

## Data Model

```
localStorage key: habitio_v10
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

**Key implementation details:**

- **Habit IDs:** `uid()` → `crypto.randomUUID()` with fallback
- **Dates:** always `fmt(d)` → `toISOString().slice(0,10)` (UTC-based — never use local date methods)
- **Age groups:** `AGE_GROUPS` stores both `profile.ageGroup` (key string) and `profile.age` (representative int) — `getSuggestions()` uses `parseInt(profile.age)`
- **Sex values:** `"male"` | `"female"` | `"prefer"`
- **Cadence types:** `daily` | `specific_days` (+ `days[]`) | `x_per` (+ `count`, `period: week|month`)
- **Coach device ID:** stored separately in `localStorage` under `COACH_DEVICE_KEY = "habitio_ai_device"` — not part of main state

**Key functions:**

- `fmt(d)` — date to `YYYY-MM-DD` string (UTC-based, via `toISOString().slice(0,10)`)
- `uid()` — generates habit IDs via `crypto.randomUUID()`
- `t(key)` — i18n helper, returns translation from `T[state.lang][key]`
- `DN(index)` — day name helper (Sun=0)
- `MN(index)` — month name helper (Jan=0)

## Version Bump — 3 Places, Always Together

When `app.js`, `styles.css`, `suggestions.js`, `i18n.js`, or `index.html` changes:

1. `STORAGE_VERSION` in `app.js` (e.g. `"habitio_v10"` → `"habitio_v11"`)
2. `CACHE` in `sw.js` (same value)
3. `APP_VERSION` in `app.js` → `"v2.11"` (minor version = schema number)

**CRITICAL:** The SW cache name (`CACHE` in `sw.js`) MUST match `STORAGE_VERSION` in `app.js`.

Always add a migration read in `load()` for the old key — never drop user data. This keeps a single version number across both systems.

### 4th Place — Test & Script Constants

The storage version is defined as a `STORAGE_VERSION` constant in these files (never hardcoded):
- `tests/test-helpers.js` — `STORAGE_VERSION` constant, exported for other test files
- `tests/sw.spec.js` — own `STORAGE_VERSION` constant (can't import from test-helpers)
- `scripts/take-screenshots.js` — own `STORAGE_VERSION` constant

After bumping, update the constant value in these 3 files:

```bash
# Find all occurrences
grep -rn "STORAGE_VERSION" tests/ scripts/take-screenshots.js

# Replace (PowerShell)
foreach ($f in @('tests/test-helpers.js','tests/sw.spec.js','scripts/take-screenshots.js')) {
  (Get-Content $f) -replace 'habitio_v10', 'habitio_v11' | Set-Content $f
}
```

**Always run `yarn test` after the replacement to confirm zero regressions.**

## Service Worker

Network-first for app shell files (`index.html`, `app.js`, `i18n.js`, `suggestions.js`, `styles.css`, manifest, core icons). Stale-while-revalidate for other same-origin assets.

GitHub Pages sets `Cache-Control: max-age=600` — first reload is the best achievable update guarantee without asset fingerprinting.

## Analytics (GA4 — Privacy-First)

GA4 script is **not** in `index.html`. Lazy-loaded from `app.js` only after consent. GTM removed entirely.

- Consent: `state.consentAnalytics` (`null` = unasked, `true` = granted, `false` = denied)
- Bootstrap with consent denied → load script only if granted → update consent mode
- Key functions: `ensureAnalyticsBootstrap()`, `loadAnalyticsScript()`, `applyAnalyticsConsent()`, `clearAnalyticsCookies()`, `trackEvent()`, `trackPageView()`, `updateUserProperties()`

Do not load GA4 script unconditionally or reintroduce GTM.

## Habit Formation Science

- **66-day journey:** Habits show phase emoji (🌱 → 🔨 → ⚡ → ✨) based on check count
- **Morning routine:** Habits with `morning: true` are grouped at top
- **Personalisation:** Suggestions ranked by age group (teen/young-adult/adult/midlife/senior) and sex

## Cloudflare Worker

- **Live URL:** `https://habitio-feedback.rafal-sladek.workers.dev`
- Routes: `POST /` (feedback → GitHub Issue), `POST /coach` (Cloudflare AI LLM proxy)
- Coach budget: 5 req/day, 4500 estimated tokens/day per device (env-configurable)
- Model: `@cf/meta/llama-3.1-8b-instruct-fast`
- CORS whitelist: `habitio.rafal-sladek.com`, `rafalsladek.github.io`, `localhost:3000`
- Secrets: `GITHUB_TOKEN` in Cloudflare; `CLOUDFLARE_API_TOKEN` in GitHub repo secrets
- **Test detection:** Worker automatically blocks Playwright test requests (via User-Agent + message patterns) to prevent creating GitHub issues during test runs

**Deploy worker manually:**

```bash
cd worker
npx wrangler whoami  # Verify account: rafal-sladek Account (ec54fc24baed2216d78fece71a99d28f)
npx wrangler deploy
```

**Account switching (if needed):**

```bash
npx wrangler logout
npx wrangler login  # Select rafal-sladek account in browser
```

**Automatic deployment:** GitHub Actions deploys the worker on every push to `main` via the `deploy-worker` job using `CLOUDFLARE_API_TOKEN` secret.

## CI/CD

```
test (4 browsers) ──┬── test-summary ──┬── deploy (GitHub Pages)
                    ├── sonar          │
                    └── deploy-worker  └── pagespeed (Lighthouse CI)
```

GitHub Actions (`.github/workflows/ci.yml`):
- `test`: matrix of 4 browser projects (Desktop Chromium 1280×720, Pixel 5 Chromium 393×851, Tablet Firefox 768×1024, iPhone 12 Safari 390×844), uploads lcov + Playwright report artifacts
- `sonar`: merges lcov from all 4, SonarCloud scan + quality gate (blocking)
- `deploy`: generates badges, injects `BUILD_SHA`, deploys Pages, creates release tag
- `deploy-worker`: deploys Cloudflare Worker
- `pagespeed`: Lighthouse CI against live URL (3 runs, budget: `.github/lighthouse-budget.json`)

## Code Quality — Blocking

SonarCloud Quality Gate must pass before pushing.

1. `sonar-scanner` after every code change
2. Fix all bugs/smells immediately — do not push with open issues
3. Coverage < 80% on new code: add file to `SOURCE_FILES` in `tests/global-teardown.js` or add tests
4. Security hotspot: use `mcp__sonarqube__change_security_hotspot_status` to mark SAFE with justification
5. New files: check `sonar-project.properties` — scripts/fixtures/configs/docs go in `sonar.exclusions`; app source files must not

## Pre-Commit Checklist

**Always run these before committing:**

1. `yarn format` — Prettier on all source files
2. `yarn test` — all 4 projects must pass (Desktop, Mobile, Tablet, iPhone)
3. `sonar-scanner` — Quality Gate must pass (requires `SONAR_TOKEN` env var)
4. Version bump (3 places + tests) if any source file changed
5. Retake affected screenshots in `docs/` if UI changed (see canonical set below); visually verify each
6. Update `TODO.md` with completed tasks
7. Update `AGENTS.md` + `README.md` if architecture/languages/instructions changed
8. `gh run watch` after push — CI must pass before declaring done

**Screenshot canonical set:**
- Mobile 393×852: `screenshot-onboarding.png`, `screenshot-tracker.png`, `screenshot-add-habit.png`, `screenshot-journal.png`, `screenshot-journal-summary.png`, `screenshot-stats.png`, `screenshot-settings.png`
- Desktop 1280×800: `desktop-preview.png`, `desktop-stats.png`, `desktop-journal.png`, `desktop-settings.png`, `desktop-modal.png`
- Tablet: `tablet-preview.png`

**Visual checks:** consent banner centered in content column (not full-width); sidebar nav compact; modal hides FAB; no z-index leaks.

**Amend vs new commit:** amend only for direct fix to the immediately preceding unpushed commit (format pass, forgotten file, typo). New commit when change has independent meaning or previous commit is already pushed.

## Post-Push CI Check (Mandatory)

**After every `git push`, wait for the CI build to finish and verify it passes before declaring the task done.**

```bash
gh run watch $(gh run list --limit 1 --json databaseId -q '.[0].databaseId')
```

**If the build fails:**
- Check the failed job logs in GitHub Actions UI
- For test failures: run `yarn test` locally, fix the issue, and re-push
- For SonarCloud Quality Gate failures: run `sonar-scanner` locally, fix issues, and re-push
- For deploy failures: check the CI logs for details and contact maintainer if needed

If SonarCloud fails: `gh run view <run-id> --log 2>&1 | grep -A 20 "<step-name>"`

## Performance / Accessibility Constraints

- **Google Fonts:** Non-blocking load (preconnect + preload with `onload` swap) — do NOT revert to blocking `<link rel="stylesheet">`
- **Hero image:** Uses `<picture>` with WebP source + PNG fallback; convert via `ffmpeg -i input.png -c:v libwebp -quality 82 output.webp`
- **Contrast:** `--text-muted` CSS var must stay `#7878a0` or lighter (WCAG AA contrast 5.3:1 vs dark bg) — do NOT go darker
- **Viewport:** Do NOT add `user-scalable=no`

## Adding a New Language

To add a new language (e.g., Spanish `es`):

1. **Add translation object to `i18n.js`**:
   - Copy the entire English (`en`) object as a template
   - Rename it to the language code (e.g., `es`)
   - Translate every key to the target language
   - Ensure 100% key parity with English — missing keys will break functionality
   - Update all motivational messages, habit suggestions, day/month abbreviations, and tooltips

2. **Update language selector in `app.js`**:
   - Find `const LANGUAGES = [...]` and add your language: `{ key: "es", name: "🇪🇸 Español" }`
   - Keep languages alphabetically ordered by name within their region grouping
   - Include flag emoji for visual recognition

3. **Update `sitemap.xml` for SEO**:
   - Add a new `<xhtml:link rel="alternate" hreflang="es" href="https://habitio.rafal-sladek.com/"/>` entry
   - Keep entries alphabetically ordered by hreflang code
   - This helps search engines understand language variants and improves SEO

4. **Update `manifest.json` if needed**:
   - Review the `name`, `short_name`, and `description` fields
   - If they're in English, consider adding localized versions if supported by the PWA spec, or leave as-is for universal recognition

5. **Validate key parity:**
   ```bash
   node scripts/validate-i18n.js
   ```
   Must output `✓ All languages have all keys!` before proceeding.

6. **Test thoroughly**:
   - Manually switch to the new language in the app (Settings → Language)
   - Verify all UI elements render correctly (no text overflow, emoji displays properly)
   - Check that habit suggestions work with the new language
   - Verify translations are contextually appropriate (test on mobile, tablet, and desktop)
   - Test language persistence across page reloads (localStorage saves selection)

7. **Update documentation**:
   - Update `AGENTS.md` to list the new language count (e.g., "20 languages" → "21 languages")
   - Update `README.md` if language count is mentioned

8. **Commit with version bump**:
   - No localStorage schema change needed — just new translation strings
   - However, if new UI copy was added, may need version bump for cache invalidation
   - Run `yarn test` to ensure all tests still pass with the new language
   - Run `sonar-scanner` to verify code quality

## Test Patterns

Playwright tests use:
- `completeOnboarding(page, name)` — helper to skip onboarding
- `seedHabit(page, daysOld, checkedDaysBack)` — seeds localStorage with test data
- V8 coverage collection for SonarCloud LCOV report (Chromium only)

Tests run on 4 projects:
- Desktop Chromium (1280×720)
- Pixel 5 Chromium (Pixel 5, 393×851)
- Tablet Firefox (768×1024)
- iPhone 12 Safari (390×844)

## Common Pitfalls

1. **Forgetting to bump SW cache:** When localStorage version changes, SW cache must also change
2. **Breaking migrations:** Never change storage key without migration logic — users will lose data
3. **Blocking fonts:** Google Fonts must use non-blocking load pattern
4. **Missing screenshots:** UI changes require updating screenshots in `docs/`
5. **Skipping Quality Gate:** Do NOT push if SonarCloud fails
6. **Wrong date format:** Always use `fmt(d)` for dates, not manual string formatting
7. **Never force-push to `main`**
