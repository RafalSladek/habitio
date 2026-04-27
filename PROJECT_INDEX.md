# Project Index: habit.io

Generated: 2026-04-27

## Project Structure

```
habitio/
├── index.html          # App shell (~278 lines)
├── app.js              # All app logic (~2,700 lines)
├── styles.css          # All styles, dark-only theme (~2,138 lines)
├── i18n.js             # Translations — 20 languages (~2,883 lines)
├── suggestions.js      # Habit suggestion data + demographic scoring (~500 lines)
├── sw.js               # Service worker — network-first + offline fallback
├── manifest.json       # PWA manifest
├── playwright.config.js
├── package.json
├── sonar-project.properties
├── worker/
│   ├── feedback.js     # Cloudflare Worker — feedback + AI coach endpoints
│   └── wrangler.toml
├── tests/
│   ├── test-helpers.js # Shared fixtures and helpers
│   ├── global-teardown.js # Coverage report generation
│   └── *.spec.js       # 14 spec files (see Tests section)
├── scripts/
│   ├── take-screenshots.js
│   ├── generate-badges.js
│   └── generate-gif.js
├── docs/
│   └── architecture.md # Detailed architecture doc
└── icons/              # 16/32/192/512px + SVG + hero WebP/PNG
```

## Entry Points

- **App**: `index.html` — loads styles.css, i18n.js, suggestions.js, app.js (no bundler)
- **Service Worker**: `sw.js` — registered by app.js on load
- **Tests**: `npx playwright test` — runs 4 browser projects
- **Worker**: `worker/feedback.js` — Cloudflare Worker, deployed via wrangler

## Core Modules

### app.js
- Central state object: `let state = { habits[], checks{}, diary{}, profile{}, lang, consentAnalytics, aiCoach{} }`
- Storage key: `habitio_v10` (must match `CACHE` in sw.js and `STORAGE_VERSION` in test-helpers.js)
- `APP_VERSION`: `"v2.10"` (format: `v2.<schema>`)
- Key functions: `save()`, `load()`, `render()`, `fmt(d)`, `uid()`, `t(key)`, `DN(i)`, `MN(i)`
- Analytics: `ensureAnalyticsBootstrap()`, `loadAnalyticsScript()`, `applyAnalyticsConsent()`, `trackEvent()`, `trackPageView()`
- Pages: `tracker`, `diary`, `stats`, `settings` — toggled via CSS `.page.active`
- Habit cadence types: `"daily"` | `"specific_days"` | `"x_per"`
- 66-day formation phases: Learning (0-19d) → Building (20-49d) → Forming (50-65d) → Formed (66+d)

### i18n.js
- `T` object with 20 language keys: `en de pl pt ru fr hi uk ar sq sr bar es it ro nl tr el hr ca`
- `t(key)` → `T[state.lang][key]`
- HTML elements use `data-t="key"` for auto-translation
- Motivational messages are arrays (random selection); interpolation via `{n}` replacement

### suggestions.js
- `sugPriority(suggestion, profile)` — scores suggestions by age group + sex
- Age bands: `teen` / `young-adult` / `adult` / `midlife` / `senior`

### sw.js
- Cache name must match localStorage key (`habitio_v10`)
- App shell: network-first (index.html, app.js, i18n.js, suggestions.js, styles.css, manifest, icons)
- Other same-origin assets: stale-while-revalidate

### worker/feedback.js
- `POST /` — creates GitHub issue from in-app feedback
- `POST /coach` — Cloudflare Workers AI coaching (rate-limited: 5 req/day per device)
- CORS validates against allowed origins

## Configuration

- `sonar-project.properties` — SonarCloud project config (exclusions: node_modules, docs, tests, scripts, worker)
- `playwright.config.js` — 4 browser projects: Desktop Chromium (1280×720), Pixel 5 Chromium, Tablet Firefox (768×1024), iPhone 12 Safari
- `worker/wrangler.toml` — Cloudflare Worker config
- `.github/workflows/ci.yml` — CI pipeline: test → sonar → deploy → pagespeed; deploy-worker (main only)

## Tests

14 spec files + helpers:

| File | Coverage area |
|------|---------------|
| `onboarding.spec.js` | First-run onboarding flow |
| `flows.spec.js` | Core habit CRUD flows |
| `formation.spec.js` | 66-day phase progression |
| `coach.spec.js` | AI coach feature |
| `analytics.spec.js` | GA4 consent and event tracking |
| `consent.spec.js` | Analytics consent banner |
| `feedback.spec.js` | In-app feedback submission |
| `import-export.spec.js` | JSON backup/restore |
| `settings.spec.js` | Settings page |
| `i18n.spec.js` | Translation completeness |
| `lang-switch.spec.js` | Runtime language switching |
| `seo.spec.js` | Meta tags, sitemap |
| `sw.spec.js` | Service worker caching |
| `ptr.spec.js` | Pull-to-refresh behavior |
| `test-helpers.js` | Shared fixtures |
| `global-teardown.js` | v8 coverage → LCOV conversion |

**Key test helpers** (all exported from `test-helpers.js`):
- `completeOnboarding(page, name?)` — fills onboarding form
- `seedHabit(page, daysOld, checkedDaysBack?)` — seeds localStorage with v2 habit (migrations handle upgrade)
- `resetToDefaultState(page, overrides?)` — sets clean state at `habitio_v10`
- `seedConsented(page, extra?)` — state with analytics consent = true
- `mockGoogleAnalytics(page)` — stubs GA4 network calls
- `addSuggestedHabit(page, name?)` — clicks through suggestion modal
- `spyOnGtag(page)` — intercepts dataLayer pushes
- `goToSettings(page)` — navigates to settings page
- `STORAGE_VERSION` — current storage key constant (`"habitio_v10"`)

## Key Dependencies

- `@playwright/test` ^1.59.1 — E2E testing (4 browser projects)
- `prettier` ^3.8.3 — code formatting
- `v8-to-istanbul` — coverage conversion for SonarCloud
- `istanbul-lib-coverage/report/reports` — LCOV report generation

## Quick Start

```bash
yarn install
npx playwright install chromium

# Serve locally
npx serve . -p 3000

# Run all tests
yarn test

# Run specific test
npx playwright test -g "test name" --headed

# Format
yarn format

# SonarCloud scan (requires SONAR_TOKEN)
sonar-scanner
```

## Version Bump Checklist

When changing `app.js`, `styles.css`, `i18n.js`, `suggestions.js`, or `index.html`:

1. Increment storage key in `app.js` `save()`/`load()` (e.g. `habitio_v10` → `habitio_v11`)
2. Update `CACHE` in `sw.js` to match
3. Update `APP_VERSION` in `app.js` (e.g. `"v2.10"` → `"v2.11"`)
4. Update `STORAGE_VERSION` in `tests/test-helpers.js`
5. Add migration read in `load()` for old key
