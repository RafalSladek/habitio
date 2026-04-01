# habit.io — Claude Instructions

## Project Overview

**habit.io** is an offline-first PWA habit tracker. Single-page app with no build step.

**Live app:** https://habitio.rafal-sladek.com/ (mirror: https://rafalsladek.github.io/habitio/)
**Repo:** https://github.com/RafalSladek/habitio
**Deployed via:** GitHub Pages from `main` branch, root `/`

## Architecture

Files are split for clarity; no build step required:

| File | Purpose |
|---|---|
| `index.html` | App shell and markup (~240 lines) |
| `styles.css` | All styles |
| `i18n.js` | All translations (`T` object, 12 languages) + `t()`, `DN()`, `MN()` helpers |
| `app.js` | All application logic (~1 800 lines) |
| `suggestions.js` | Habit suggestion data with demographic scoring |
| `sw.js` | Service worker — full offline caching (cache name: `habitio_v7`) |
| `manifest.json` | PWA manifest |
| `icons/` | Favicon, app icons (16, 32, 192, 512px + SVG), hero-onboarding.webp/png |

## Data Storage

All user data is stored **client-side only**:

- API: `localStorage`
- Key: `habitio_v7`
- Format: JSON-serialized state object: `{ habits[], checks{}, diary{}, profile{name,age,ageGroup,sex}, lang, kitsDismissed{}, consentAnalytics }`
- No backend, no sync, no accounts

Export/import via JSON file is the only cross-device migration path. Do not introduce a backend unless explicitly requested.

## Key Implementation Details

- **Habit IDs**: `crypto.randomUUID()` via `uid()` function (with fallback)
- **Age groups**: `AGE_GROUPS = [{key,age}]` — stores both `profile.ageGroup` (key) and `profile.age` (representative int) for backward compat with `getSuggestions()` which uses `parseInt(profile.age)`
- **Date formatting**: `fmt(d)` uses `toISOString().slice(0,10)` (UTC-based)
- **i18n**: `T` object in `i18n.js` with `en`/`de`/`pl`/`pt`/`ru`/`fr`/`hi`/`uk`/`ar`/`sq`/`sr`/`bar` keys; `t(key)` helper; language stored in `state.lang`
- **Sex options**: `profile.sex` can be `"male"`, `"female"`, or `"prefer"` (prefer not to say)
- **Formation arc**: 66-day science-backed journey shown as phase emoji per habit
- **Morning routine**: habits tagged `morning:true` grouped at top
- **Analytics (privacy-first)**: GA4 script is **not** loaded in `index.html`. It is lazy-loaded from `app.js` only after the user grants consent. GTM has been removed entirely. Key functions: `ensureAnalyticsBootstrap()`, `loadAnalyticsScript()`, `applyAnalyticsConsent()`, `clearAnalyticsCookies()`, `queueAnalyticsCall()`, `trackEvent()`, `trackPageView()`, `updateUserProperties()`. Consent stored in `state.consentAnalytics` (null/true/false).

## CI / CD

GitHub Actions (`.github/workflows/ci.yml`):
- `test` job: Playwright e2e tests (Desktop Chrome + Pixel 5 mobile + iPad tablet)
- `sonar` job: SonarCloud quality gate (needs: test)
- `deploy` job: deploys to GitHub Pages only if `test` + `sonar` pass
- `deploy-worker` job: deploys `worker/feedback.js` to Cloudflare Workers (needs: test, main only); requires `CLOUDFLARE_API_TOKEN` secret in GitHub repo settings
- `pagespeed` job: Lighthouse CI after deploy (budget: `.github/lighthouse-budget.json`)
- `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true` env set workflow-wide (avoids Node 20 deprecation warnings)

### Cloudflare Worker — Feedback Backend

- **Source**: `worker/feedback.js` + `worker/wrangler.toml`
- **Live URL**: `https://habitio-feedback.kryptoroger.workers.dev`
- **Secret**: `GITHUB_TOKEN` stored in Cloudflare (fine-grained PAT, Issues: Read & Write on this repo only)
- **No cache** — stateless compute, no invalidation needed after deploy
- **Manual deploy**: `cd worker && npx wrangler deploy`
- **Set/rotate token**: `cd worker && npx wrangler secret put GITHUB_TOKEN`
- **GitHub secret required**: add `CLOUDFLARE_API_TOKEN` (Cloudflare dashboard → My Profile → API Tokens → create token with *Cloudflare Workers Scripts: Edit* permission) to repo secrets for CI auto-deploy

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

**SW cache name must always match the localStorage key** (`CACHE` in `sw.js` = `habitio_v7`).
- When the localStorage key is bumped (e.g. `habitio_v7` → `habitio_v8`), update `CACHE` in `sw.js` to the same value
- This keeps a single version number across both systems — one bump covers both the data schema migration and the asset cache bust
- Without bumping, users who haven't visited since the last SW version change will keep getting old cached files

**Why not instant updates?**
GitHub Pages sets `Cache-Control: max-age=600` (10 min) — nothing can be done about that.
Without asset fingerprinting (e.g. `app.a1b2c3.js`) there is no way to achieve zero-reload updates. One reload is the best achievable without a build tool.

## Data Migration

When bumping the localStorage version key (e.g. `habitio_v7` → `habitio_v8`), always implement a migration layer in `app.js` that:
1. Reads any older version keys on startup
2. Migrates the data shape to the new format
3. Saves under the new key and deletes the old one

Never change the storage key without migration — users must not lose their habits, checks, diary entries, or profile.

## Code Quality — Non-Negotiable

**Quality is not optional. All generated code MUST pass SonarCloud before pushing.**

1. **Verify with sonar-scanner** — run `sonar-scanner` after every code change. The `SONAR_TOKEN` will be exported in the session.
2. **Check the Quality Gate** — after scanning, use the SonarQube MCP tools to check the Quality Gate status, or read the scanner output directly.
3. **Fix all issues immediately** — if SonarCloud reports bugs or code smells, fix them and re-scan. Do NOT push until issues are resolved.
4. **Low coverage = blocking** — if a failed Quality Gate is caused by insufficient test coverage, generate the required unit/e2e tests. This is a blocking issue.
5. **Only recommend pushing when the Quality Gate PASSES.**

## Pre-Commit Checklist

**Always do all of these before committing:**

1. **Format code**: `yarn format` — run Prettier on all source files before committing. Use `yarn format:check` to verify without writing.
2. **Run tests**: `yarn test` — all projects (Desktop, Mobile, Tablet) must pass
3. **Update screenshots**: if any UI change was made (layout, colours, new screens, copy), retake **all** affected screenshots in `docs/` using Playwright and include them in the same commit. Canonical set:
   - Mobile 393×852: `screenshot-onboarding.png`, `screenshot-tracker.png`, `screenshot-add-habit.png`, `screenshot-journal.png`, `screenshot-journal-summary.png`, `screenshot-stats.png`, `screenshot-settings.png`
   - Desktop 1280×800: `desktop-preview.png`, `desktop-stats.png`, `desktop-journal.png`, `desktop-settings.png`, `desktop-modal.png`
   - Tablet: `tablet-preview.png`
4. **Visual screenshot review**: after retaking screenshots, **read each affected image** using the Read tool and visually verify:
   - Overlays (modals, consent banner, FAB) are correctly positioned and not bleeding outside their intended area
   - Desktop layout: consent banner is centered in the content column (not full-width, not left-aligned); sidebar nav items are compact (not stretched); modal does not show FAB behind it
   - Mobile layout: modal covers full width; FAB is hidden when modal is open
   - No unexpected elements visible (e.g. glow from hidden components, z-index leaks)
   Fix any issues found before proceeding to commit.
5. **Check PageSpeed**: download the latest Lighthouse artifact from the most recent CI run (`gh run download <run-id> --name lighthouse-results --dir /tmp/lh-results`) and verify no new audit regressions before committing
6. **Bump version key**: if `app.js`, `styles.css`, `suggestions.js`, `i18n.js`, or `index.html` changed, increment the version in both `app.js` localStorage key and `CACHE` in `sw.js` to the same value (e.g. both `habitio_v7` → `habitio_v8`), and add a migration read in `load()` for the old key
7. **Update `TODO.md`**: add any new tasks completed in this session to `TODO.md` and include it in the same commit as the code changes
8. **Update docs**: if the architecture, file list, i18n languages, or any dev instructions changed, update `CLAUDE.md` and `README.md` in the same commit
