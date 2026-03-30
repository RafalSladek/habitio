# habit.io — Copilot Instructions

## Project Overview

**habit.io** is an offline-first PWA habit tracker with no build step. All files are edited directly and deployed as-is.

- **Live app:** https://habitio.rafal-sladek.com/ (mirror: https://rafalsladek.github.io/habitio/)
- **Deploy:** Push to `main` → GitHub Actions tests → auto-deploy to GitHub Pages
- **Languages:** 12 languages supported in i18n.js

## Build, Test, and Lint Commands

```bash
# Install dependencies (includes Playwright)
yarn install
npx playwright install chromium

# Run all tests (Desktop Chrome + Pixel 5 Mobile + Tablet)
yarn test

# Run tests in UI mode for debugging
yarn test:ui

# View last test report
yarn test:report

# Format code (Prettier)
yarn format          # Format all files
yarn format:check    # Check formatting without writing

# Run SonarCloud analysis (requires SONAR_TOKEN env var)
sonar-scanner
```

### Running a Single Test

```bash
# Run specific test file
npx playwright test tests/habitio.spec.js

# Run specific test by name
npx playwright test -g "should complete onboarding"

# Run specific project (Desktop/Mobile/Tablet)
npx playwright test --project="Mobile Chrome"
```

### Local Development Server

No build step — serve files directly:

```bash
npx serve . -p 3000
# Open http://localhost:3000
```

## Architecture

### File Structure

| File | Purpose | Lines |
|------|---------|-------|
| `index.html` | App shell and markup | ~278 |
| `app.js` | All application logic | ~2,084 |
| `styles.css` | All styles (single file) | ~2,138 |
| `i18n.js` | Translations for 12 languages | ~2,883 |
| `suggestions.js` | Habit suggestions with demographic scoring | ~500 |
| `sw.js` | Service worker (stale-while-revalidate caching) | ~50 |

**Key point:** No transpilation, no bundling, no modules. All JS is vanilla ES6+ that runs directly in browsers.

## CI / CD

GitHub Actions (`.github/workflows/ci.yml`):
- `test` job: Playwright e2e tests (Desktop Chrome + Pixel 5 mobile + Tablet 768×1024)
- `sonar` job: SonarCloud analysis with Quality Gate check
- `deploy` job: deploys to GitHub Pages only if both `test` and `sonar` pass (`needs: [test, sonar]`)
- `pagespeed` job: Lighthouse CI after deploy (3 runs, budget: `.github/lighthouse-budget.json`)
- `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true` env set workflow-wide

### Data Storage

- **API:** `localStorage` only (no backend, no database)
- **Storage key:** `habitio_v6` (bump when schema changes)
- **Format:** JSON object: `{ habits[], checks{}, diary{}, profile{name,age,ageGroup,sex}, lang, kitsDismissed{}, consentAnalytics }`
- **IDs:** `crypto.randomUUID()` via `uid()` helper

**Migration:** When bumping version (e.g., `habitio_v6` → `habitio_v7`), always implement migration in `app.js` that reads old key, transforms data, saves to new key, and deletes old key.

### Service Worker & Cache Versioning

**CRITICAL:** The SW cache name (`CACHE` in `sw.js`) MUST match the localStorage key.

When bumping `habitio_v6` → `habitio_v7`:
1. Update localStorage key in `app.js`
2. Update `CACHE` in `sw.js` to the same value
3. Add migration logic in `load()` to read old version

This keeps a single version number across both systems. One bump covers data migration + cache bust.

### Key Functions & Patterns

- `fmt(d)` — date to `YYYY-MM-DD` string (UTC-based, via `toISOString().slice(0,10)`)
- `uid()` — generates habit IDs via `crypto.randomUUID()`
- `t(key)` — i18n helper, returns translation from `T[state.lang][key]`
- `DN(index)` — day name helper (Sun=0)
- `MN(index)` — month name helper (Jan=0)
- `AGE_GROUPS` — array of `{key, age}` objects; stores both `profile.ageGroup` (string) and `profile.age` (int) for backward compat

### Habit Formation Science & Analytics

- **66-day journey:** Habits show phase emoji (🌱 → 🔨 → ⚡ → ✨) based on check count
- **Morning routine:** Habits with `morning: true` are grouped at top
- **Personalisation:** Suggestions ranked by age group (teen/young-adult/adult/midlife/senior) and sex
- **Analytics:** Privacy-first GA4 (G-V9TJW7N2VY) — GA4 script is **not** loaded in `index.html`. It is lazy-loaded from `app.js` only after the user grants consent. GTM has been removed entirely.
  - Consent stored in `state.consentAnalytics` (null/true/false)
  - Key functions: `ensureAnalyticsBootstrap()`, `loadAnalyticsScript()`, `applyAnalyticsConsent()`, `clearAnalyticsCookies()`, `queueAnalyticsCall()`, `trackEvent()`, `trackPageView()`, `updateUserProperties()`

## Conventions

### Versioning & Deployment

1. **Version bumping:** If `app.js`, `styles.css`, `i18n.js`, `suggestions.js`, or `index.html` changes:
   - Increment version in BOTH `app.js` localStorage key AND `CACHE` in `sw.js`
   - Add migration logic in `load()` to read old version

2. **Screenshot updates:** When UI changes:
   - Retake ALL affected screenshots in `docs/` using Playwright
   - Mobile (393×852): `screenshot-onboarding.png`, `screenshot-tracker.png`, `screenshot-add-habit.png`, `screenshot-journal.png`, `screenshot-journal-summary.png`, `screenshot-stats.png`, `screenshot-settings.png`
   - Desktop (1280×800): `desktop-preview.png`, `desktop-stats.png`, `desktop-journal.png`, `desktop-settings.png`, `desktop-modal.png`
   - Tablet: `tablet-preview.png`
   - **Visually verify:** Check that modals, consent banner, FAB are positioned correctly; no z-index leaks

3. **Never force-push to `main`**

### Pre-Commit Checklist

**Always run these before committing:**

1. `yarn format` — format code with Prettier
2. `yarn test` — all Playwright tests must pass (Desktop, Mobile, Tablet)
3. `sonar-scanner` — verify SonarCloud Quality Gate passes (requires `SONAR_TOKEN` env var)
4. Update screenshots if UI changed (see above)
5. Update `TODO.md` with completed tasks
6. **Check AI assistant instructions:** Review if `CLAUDE.md` and `.github/copilot-instructions.md` need updates based on your changes:
   - Architecture changes (new files, new patterns, removed features)
   - Storage schema changes (new state fields, version bumps)
   - New languages added to i18n
   - CI/CD workflow changes
   - New conventions or patterns introduced
   - Line counts significantly changed (10%+ growth)
6. Update `README.md` and `CLAUDE.md` if architecture/file list/languages changed

### Performance & Accessibility

- **Google Fonts:** Non-blocking load (preconnect + preload with `onload` swap) — do NOT revert to blocking `<link rel="stylesheet">`
- **Hero image:** Uses `<picture>` with WebP source + PNG fallback
- **Contrast:** `--text-muted` CSS var must stay `#7878a0` or lighter (WCAG AA contrast 5.3:1 vs dark bg) — do NOT go darker
- **Viewport:** Do NOT add `user-scalable=no`

### Code Quality

**SonarCloud Quality Gate is blocking.** All code changes must pass before pushing.

1. Run `sonar-scanner` after code changes
2. Fix all bugs, code smells, and security issues
3. If coverage is insufficient, add tests
4. Only push when Quality Gate passes

### Test Patterns

Playwright tests use:
- `completeOnboarding(page, name)` — helper to skip onboarding
- `seedHabit(page, daysOld, checkedDaysBack)` — seeds localStorage with test data
- V8 coverage collection for SonarCloud LCOV report (Chromium only)

Tests run on 3 projects:
- Desktop Chrome (1280×720)
- Mobile Chrome (Pixel 5, 393×851)
- Tablet (768×1024)

## Common Pitfalls

1. **Forgetting to bump SW cache:** When localStorage version changes, SW cache must also change
2. **Breaking migrations:** Never change storage key without migration logic — users will lose data
3. **Blocking fonts:** Google Fonts must use non-blocking load pattern
4. **Missing screenshots:** UI changes require updating screenshots in `docs/`
5. **Skipping Quality Gate:** Do NOT push if SonarCloud fails
6. **Wrong date format:** Always use `fmt(d)` for dates, not manual string formatting
