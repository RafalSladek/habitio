# habit.io — Claude Instructions

## Project Overview

**habit.io** is an offline-first PWA habit tracker. Single-page app with no build step.

**Live app:** https://rafalsladek.github.io/habitio/
**Repo:** https://github.com/RafalSladek/habitio
**Deployed via:** GitHub Pages from `main` branch, root `/`

## Architecture

Files are split for clarity; no build step required:

| File | Purpose |
|---|---|
| `index.html` | App shell and markup (~240 lines) |
| `styles.css` | All styles |
| `app.js` | All application logic |
| `suggestions.js` | Habit suggestion data with demographic scoring |
| `sw.js` | Service worker — full offline caching (cache name: `habitio_v4`) |
| `manifest.json` | PWA manifest |
| `icons/` | Favicon, app icons (16, 32, 192, 512px + SVG), hero-onboarding.webp/png |

## Data Storage

All user data is stored **client-side only**:

- API: `localStorage`
- Key: `habitio_v4`
- Format: JSON-serialized state object: `{ habits[], checks{}, diary{}, profile{name,age,ageGroup,sex}, lang }`
- No backend, no sync, no accounts

Export/import via JSON file is the only cross-device migration path. Do not introduce a backend unless explicitly requested.

## Key Implementation Details

- **Habit IDs**: `crypto.randomUUID()` via `uid()` function (with fallback)
- **Age groups**: `AGE_GROUPS = [{key,age}]` — stores both `profile.ageGroup` (key) and `profile.age` (representative int) for backward compat with `getSuggestions()` which uses `parseInt(profile.age)`
- **Date formatting**: `fmt(d)` uses `toISOString().slice(0,10)` (UTC-based)
- **i18n**: `STRINGS` object with `en`/`de`/`pl` keys; `t(key)` helper; language stored in `state.lang`
- **Formation arc**: 66-day science-backed journey shown as phase emoji per habit
- **Morning routine**: habits tagged `morning:true` grouped at top

## CI / CD

GitHub Actions (`.github/workflows/playwright.yml`):
- `test` job: Playwright e2e tests (Desktop Chrome + Pixel 5 mobile + iPad tablet)
- `deploy` job: deploys to GitHub Pages only if `test` passes (`needs: test`)
- `pagespeed` job: Lighthouse CI after deploy (budget: `.github/lighthouse-budget.json`)
- `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true` env set workflow-wide (avoids Node 20 deprecation warnings)

## Performance / Accessibility Notes

- Google Fonts loaded **non-blocking** (preconnect + preload with `onload` swap) — do not revert to blocking `<link rel="stylesheet">`
- Hero image uses `<picture>` with WebP source + PNG fallback; WebP generated via `ffmpeg`
- `--text-muted` CSS var must stay at `#7878a0` or lighter (contrast 5.3:1 vs dark bg) — do not go darker
- No `user-scalable=no` in viewport — do not add it back

## Development Notes

- No build tooling — edit files directly, changes are immediately deployable
- Deploy by pushing to `main` (GitHub Pages auto-builds from GitHub Actions)
- Do not use `git push --force` on main
- To run tests locally: `yarn test` (starts local server via `npx serve`)
- To convert images to WebP: `ffmpeg -i input.png -c:v libwebp -quality 82 output.webp`

## Service Worker & Caching

The SW uses **stale-while-revalidate** for all same-origin app shell files (`app.js`, `styles.css`, `index.html`, etc.):
- Cache is served immediately (fast, works offline)
- Network fetch always runs in background to refresh the cache
- Result: users see the new version on the **next** page load after a deploy (one reload lag)

**SW cache name must always match the localStorage key** (`CACHE` in `sw.js` = `habitio_v4`).
- When the localStorage key is bumped (e.g. `habitio_v4` → `habitio_v5`), update `CACHE` in `sw.js` to the same value
- This keeps a single version number across both systems — one bump covers both the data schema migration and the asset cache bust
- Without bumping, users who haven't visited since the last SW version change will keep getting old cached files

**Why not instant updates?**
GitHub Pages sets `Cache-Control: max-age=600` (10 min) — nothing can be done about that.
Without asset fingerprinting (e.g. `app.a1b2c3.js`) there is no way to achieve zero-reload updates. One reload is the best achievable without a build tool.

## Data Migration

When bumping the localStorage version key (e.g. `habitio_v4` → `habitio_v5`), always implement a migration layer in `app.js` that:
1. Reads any older version keys on startup
2. Migrates the data shape to the new format
3. Saves under the new key and deletes the old one

Never change the storage key without migration — users must not lose their habits, checks, diary entries, or profile.

## Pre-Commit Checklist

**Always do all of these before committing:**

1. **Run tests**: `yarn test` — all projects (Desktop, Mobile, Tablet) must pass
2. **Update screenshots**: if any UI change was made (layout, colours, new screens, copy), retake **all** affected screenshots in `docs/` using Playwright and include them in the same commit. Canonical set:
   - Mobile 393×852: `screenshot-onboarding.png`, `screenshot-tracker.png`, `screenshot-add-habit.png`, `screenshot-journal.png`, `screenshot-journal-summary.png`, `screenshot-stats.png`, `screenshot-settings.png`
   - Desktop 1280×800: `desktop-preview.png`, `desktop-stats.png`, `desktop-journal.png`, `desktop-settings.png`, `desktop-modal.png`
   - Tablet: `tablet-preview.png`
3. **Visual screenshot review**: after retaking screenshots, **read each affected image** using the Read tool and visually verify:
   - Overlays (modals, consent banner, FAB) are correctly positioned and not bleeding outside their intended area
   - Desktop layout: consent banner is centered in the content column (not full-width, not left-aligned); sidebar nav items are compact (not stretched); modal does not show FAB behind it
   - Mobile layout: modal covers full width; FAB is hidden when modal is open
   - No unexpected elements visible (e.g. glow from hidden components, z-index leaks)
   Fix any issues found before proceeding to commit.
4. **Check PageSpeed**: download the latest Lighthouse artifact from the most recent CI run (`gh run download <run-id> --name lighthouse-results --dir /tmp/lh-results`) and verify no new audit regressions before committing
5. **Bump version key**: if `app.js`, `styles.css`, `suggestions.js`, or `index.html` changed, increment the version in both `app.js` localStorage key and `CACHE` in `sw.js` to the same value (e.g. both `habitio_v4` → `habitio_v5`), and add a migration read in `load()` for the old key
