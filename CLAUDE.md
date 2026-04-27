# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# habit.io — Claude Instructions

## Project Overview

**habit.io** is an offline-first PWA habit tracker. Single-page app with no build step.

**Live app:** https://habitio.rafal-sladek.com/
**Repo:** https://github.com/RafalSladek/habitio
**Deployed via:** GitHub Pages from `main` branch, root `/`

## Architecture

Files are split for clarity; no build step required:

| File             | Purpose                                                                                      |
| ---------------- | -------------------------------------------------------------------------------------------- |
| `index.html`     | App shell and markup (~240 lines)                                                            |
| `styles.css`     | All styles                                                                                   |
| `i18n.js`        | All translations (`T` object, 20 languages) + `t()`, `DN()`, `MN()` helpers                  |
| `app.js`         | All application logic (~2 700 lines)                                                         |
| `suggestions.js` | Habit suggestion data with demographic scoring                                               |
| `sw.js`          | Service worker — network-first app shell + offline cache fallback (cache name: `habitio_v10`) |
| `manifest.json`  | PWA manifest                                                                                 |
| `icons/`         | Favicon, app icons (16, 32, 192, 512px + SVG), hero-onboarding.webp/png                      |

## Data Storage

All user data is stored **client-side only**:

- API: `localStorage`
- Key: `habitio_v10`
- Format: JSON-serialized state object: `{ habits[], checks{}, diary{}, profile{name,age,ageGroup,sex}, lang, kitsDismissed{}, consentAnalytics, aiCoach{} }`
- No backend, no sync, no accounts

Export/import via JSON file is the only cross-device migration path. Do not introduce a backend unless explicitly requested.

## Key Implementation Details

- **Habit IDs**: `crypto.randomUUID()` via `uid()` function (with fallback)
- **Age groups**: `AGE_GROUPS = [{key,age}]` — stores both `profile.ageGroup` (key) and `profile.age` (representative int) for backward compat with `getSuggestions()` which uses `parseInt(profile.age)`
- **Date formatting**: `fmt(d)` uses `toISOString().slice(0,10)` (UTC-based)
- **i18n**: `T` object in `i18n.js` with 20 language keys: `en`/`de`/`pl`/`pt`/`ru`/`fr`/`hi`/`uk`/`ar`/`sq`/`sr`/`bar`/`es`/`it`/`ro`/`nl`/`tr`/`el`/`hr`/`ca`; `t(key)` helper; language stored in `state.lang`
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
- **Endpoints**: `POST /` (creates GitHub issue from feedback) · `POST /coach` (Cloudflare Workers AI coaching, rate-limited 5 req/day per device)
- **Secret**: `GITHUB_TOKEN` stored in Cloudflare (fine-grained PAT, Issues: Read & Write on this repo only)
- **No cache** — stateless compute, no invalidation needed after deploy
- **Manual deploy**: `cd worker && npx wrangler deploy`
- **Set/rotate token**: `cd worker && npx wrangler secret put GITHUB_TOKEN`
- **GitHub secret required**: add `CLOUDFLARE_API_TOKEN` (Cloudflare dashboard → My Profile → API Tokens → create token with _Cloudflare Workers Scripts: Edit_ permission) to repo secrets for CI auto-deploy

## Performance / Accessibility Notes

- Google Fonts loaded **non-blocking** (preconnect + preload with `onload` swap) — do not revert to blocking `<link rel="stylesheet">`
- Hero image uses `<picture>` with WebP source + PNG fallback; WebP generated via `ffmpeg`
- `--text-muted` CSS var must stay at `#7878a0` or lighter (contrast 5.3:1 vs dark bg) — do not go darker
- No `user-scalable=no` in viewport — do not add it back

## Development Notes

- No build tooling — edit files directly, changes are immediately deployable
- Deploy by pushing to `main` (GitHub Pages auto-builds from GitHub Actions)
- Do not use `git push --force` on main
- To convert images to WebP: `ffmpeg -i input.png -c:v libwebp -quality 82 output.webp`

### Setup

```bash
yarn install
npx playwright install chromium
```

### Local Dev Server

```bash
npx serve . -p 3000
# Open http://localhost:3000
```

### Running Tests

**Workflow (efficient testing without watching output):**

1. Start test suite in background:
   ```bash
   yarn test 2>&1 | tee test-output.log
   ```
   - Tests run with all projects (Desktop, Mobile, Tablet, iPhone)
   - Do NOT watch the terminal while tests execute

2. After tests complete, check the summary in test output:
   ```powershell
   # Show failed tests (marked with ✘)
   Get-Content test-output.log | Select-String "✘"
   
   # Show skipped tests (marked with -)  
   Get-Content test-output.log | Select-String "^  -"
   ```
   - This quickly identifies which tests are broken or skipped
   - Skipped tests may indicate environment/timing issues

3. For any failing test, run it individually to debug:
   ```bash
   npx playwright test -g "test name" --headed
   ```

4. Fix the issue and re-run tests

**For running specific tests:**
```bash
# Run specific test file
npx playwright test tests/habitio.spec.js

# Run tests matching a pattern
npx playwright test -g "should complete onboarding"

# Run specific project (by browser engine)
npx playwright test --project="Pixel 5 Chromium"
npx playwright test --project="Tablet Firefox"
npx playwright test --project="iPhone 12 Safari"
```

**For detailed debugging:**
```bash
# Run in headed mode (see browser)
npx playwright test --headed

# Run with UI mode (interactive debugging)
yarn test:ui

# View last HTML test report
yarn test:report
```

**Test helpers** (in `tests/test-helpers.js`):
- `completeOnboarding(page, name)` — skips onboarding flow
- `seedHabit(page, daysOld, checkedDaysBack)` — seeds localStorage with test habit data
- `mockGoogleAnalytics(page)` — stubs GA4 for consent tests

## Service Worker & Caching

The SW uses **network-first** for same-origin app shell files (`index.html`, `app.js`, `i18n.js`, `suggestions.js`, `styles.css`, manifest, and core icons):

- When online, the latest deployed file is returned on the first reload
- When offline, the cached shell is used so the app still works
- Other same-origin assets still use stale-while-revalidate for a good offline/perf balance

**SW cache name must always match the localStorage key** (`CACHE` in `sw.js` = `habitio_v10`).

- When the localStorage key is bumped (e.g. `habitio_v10` → `habitio_v10`), update `CACHE` in `sw.js` to the same value
- This keeps a single version number across both systems — one bump covers both the data schema migration and the asset cache bust
- Without bumping, users who haven't visited since the last SW version change will keep getting old cached files

**Why not instant no-reload updates?**
GitHub Pages sets `Cache-Control: max-age=600` (10 min) — nothing can be done about that.
Without asset fingerprinting (e.g. `app.a1b2c3.js`) there is no way to guarantee truly live updates in an already-open tab. First reload is the best achievable without a build tool.

## Data Migration

When bumping the localStorage version key (e.g. `habitio_v10` → `habitio_v10`), always implement a migration layer in `app.js` that:

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
6. **New files → SonarCloud exclusion check** — for every new file added, decide whether it should be scanned or excluded. Check `sonar-project.properties` and add the file/pattern to `sonar.exclusions` if it is: a script (`scripts/**`), test fixture, generated output, tooling config, docs asset, or any file that is not application source code. Application source files (`app.js`, `styles.css`, `i18n.js`, `index.html`, etc.) must remain included.

## Adding New Language Support

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

5. **Test thoroughly**:
   - Manually switch to the new language in the app (Settings → Language)
   - Verify all UI elements render correctly (no text overflow, emoji displays properly)
   - Check that habit suggestions work with the new language
   - Verify translations are contextually appropriate (test on mobile, tablet, and desktop)
   - Test language persistence across page reloads (localStorage saves selection)

6. **Update documentation**:
   - Update `CLAUDE.md` to list the new language count (e.g., "12 languages" → "13 languages")
   - Update `README.md` if language count is mentioned
   - Update `.github/copilot-instructions.md` if it references language count

7. **Commit with version bump**:
   - No localStorage schema change needed — just new translation strings
   - However, if new UI copy was added, may need version bump for cache invalidation
   - Run `yarn test` to ensure all tests still pass with the new language
   - Run `sonar-scanner` to verify code quality

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
6. **Bump version key**: if `app.js`, `styles.css`, `suggestions.js`, `i18n.js`, or `index.html` changed, increment the version in **three places** to keep them in sync:
   - `localStorage` key in `save()` and `load()` in `app.js` (e.g. `habitio_v7` → `habitio_v8`)
   - `CACHE` in `sw.js` (same value)
   - `APP_VERSION` in `app.js` — follows `v2.<schema>` format, so `"v2.7"` → `"v2.8"`
   - Add a migration read in `load()` for the old key
   - The minor version always equals the data schema number (e.g. storage `v8` → display `v2.8`)
7. **New files → SonarCloud exclusion check**: for every new file added in this commit, verify whether it belongs in `sonar.exclusions` in `sonar-project.properties`. Scripts, fixtures, generated output, tooling configs, and docs assets must be excluded; application source files must not be.
8. **Amend vs new commit**: if the staged changes are a direct fix or addendum to the immediately preceding commit (e.g. a format pass, a forgotten file, a typo fix), amend that commit instead of creating a new one — `git commit --amend`. Create a new commit when the change has independent meaning or the previous commit is already pushed and shared.
9. **Update `TODO.md`**: add any new tasks completed in this session to `TODO.md` and include it in the same commit as the code changes
10. **Update docs**: if the architecture, file list, i18n languages, or any dev instructions changed, update `CLAUDE.md` and `README.md` in the same commit

## Post-Push: CI Build Check (MANDATORY)

**After every `git push`, wait for the CI build to finish and verify it passes before declaring the task done.**

```bash
# Watch the run until it completes (Ctrl-C safe — just polls)
gh run watch $(gh run list --limit 1 --json databaseId -q '.[0].databaseId')

# Then inspect results (optional — check GitHub Actions UI instead)
gh run view $(gh run list --limit 1 --json databaseId -q '.[0].databaseId') --json jobs
```

**If any job fails:**

1. Read the failure log: `gh run view <run-id> --log 2>&1 | grep -A 20 "<failed-step-name>"`
2. For SonarCloud Quality Gate failures — check which condition failed:
   - **Coverage < 80% on new code**: identify uncovered file via `mcp__sonarqube__search_files_by_coverage` + `mcp__sonarqube__get_file_coverage_details`, then either add the file to `SOURCE_FILES` in `tests/global-teardown.js` or add tests that exercise the new code
   - **Security hotspot unreviewed**: use `mcp__sonarqube__change_security_hotspot_status` to mark SAFE with justification
   - **Bugs/smells**: fix in code, re-run `yarn test`, push fix
3. Fix and push. Repeat CI check until all jobs pass.
