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
| `sw.js` | Service worker — full offline caching (cache name: `habitio-v3`) |
| `manifest.json` | PWA manifest |
| `icons/` | Favicon, app icons (16, 32, 192, 512px + SVG), hero-onboarding.webp/png |

## Data Storage

All user data is stored **client-side only**:

- API: `localStorage`
- Key: `habitio_v2`
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
