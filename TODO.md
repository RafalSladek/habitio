# habit.io — Project Todo / Changelog

> Updated with every task. Commit this file alongside each change.

## Done

- [x] **Age/sex-based habit suggestions** — `suggestions.js` revamped with 5 age bands (teen/young/adult/mid/senior) and per-sex scoring. 9 new habits added (strength, balance, sunlight, protein, no-late-eat, breathwork, brain game, volunteer, savings).
- [x] **Nav icons** — Journal changed to 📖 (open book), Stats to 📊 (bar chart).
- [x] **FAB hides when add-modal opens** — `openAddModal()` removes `visible` class; `closeAddModal()` restores it.
- [x] **Desktop sidebar nav** — `flex: none` + smaller icon size; tabs no longer stretch to fill 25 % of viewport height.
- [x] **Consent banner desktop centering** — centered in content column via `calc()` overrides placed after base styles (cascade fix).
- [x] **GA4 user properties** — `age_group`, `sex`, `ui_language` set via `gtag('set', 'user_properties')` on consent accept, welcome finish, and language change.
- [x] **SPA page_view tracking** — `switchPage()` fires a `page_view` event per sub-page (Today / Journal / Stats / Settings).
- [x] **SW clone bug fix** — `res.clone()` moved before `caches.open()` async hop to prevent "body already used" error.
- [x] **GA4 tracking tests** — 21 Playwright tests using a `dataLayer` spy (via `addInitScript` + `defineProperty` setter) that captures all `gtag()` calls without network interception.
- [x] **`addSuggestion()` tracking** — suggestions clicked in the add-modal now fire `habit_add` event (previously only `saveHabit()` did).
- [x] **Settings habit hover glow** — `.habit-edit-item` gets fade-in/out background + inset purple glow on hover; deeper glow on active.
- [x] **Editable profile card** — Profile row in Settings is now clickable; opens the welcome/onboarding modal pre-filled with current name, age, sex, and language. `›` chevron added as affordance.
- [x] **Export / import tests** — 15 Playwright tests covering: download filename + content, import modal open/cancel, merge deduplication, invalid JSON error toast, round-trip export→re-import.
- [x] **SonarCloud integration** — `sonar-project.properties`, V8 coverage collection in `test.beforeEach`/`afterEach`, `tests/global-teardown.js` converts coverage to `coverage/lcov.info`, `playwright.config.js` wired to teardown, CI workflow step added. `SONAR_TOKEN` configured as GH secret and env variable.
- [x] **Mobile modal full-width fix** — removed `justify-content: center` from `.modal-overlay` base styles (mobile); it stays only in the desktop breakpoint. Bottom sheet now stretches edge-to-edge on mobile with no side margins.
- [x] **SonarCloud issues fixed** — empty catch block now logs a warning; `const t` in `getMon()` renamed to `const date` (shadowed translation `t()`); local `const isToday` renamed to `isTodaySelected` (shadowed global `isToday()`); `JSON.stringify(s.cadence)` in HTML attribute wrapped with `esc()`. CI action migrated from deprecated `sonarcloud-github-action@master` to `sonarqube-scan-action@v5`. Workflow permissions moved from workflow level to job level (S8264/S8233).
- [x] **CI workflow renamed + quality gate** — `playwright.yml` → `ci.yml`, workflow name updated to "CI / CD". Added `sonarqube-quality-gate-action@v1` step after the scan; build fails if SonarCloud quality gate does not pass.
