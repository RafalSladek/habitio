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
- [x] **SonarCloud security hotspots resolved** — all 10 hotspots reviewed: `Math.random()` × 4 marked SAFE (cosmetic/fallback use), SRI on dynamic CDN resources × 3 marked SAFE (Google Fonts / GTM can't have SRI), GitHub Actions SHA pinning × 3 fixed in code (pinned to full commit SHAs). Quality gate now passes.
- [x] **5 new languages** — Brazilian Portuguese (pt 🇧🇷), Russian (ru 🇷🇺), French (fr 🇫🇷), Hindi (hi 🇮🇳) added. All UI strings, motivational messages, tooltip copy, habit suggestions, day and month abbreviations fully translated. Language selector converted from chips to a compact native dropdown with flag emoji to accommodate 7 languages without layout overflow.
- [x] **5 more languages** — Ukrainian (uk 🇺🇦), Egyptian Arabic (ar 🇪🇬), Albanian (sq 🇦🇱), Serbian (sr 🇷🇸), Bavarian (bar 🏔️) added. Total now 12 languages. Language selectors updated in welcome screen and settings.
- [x] **"Prefer not to say" sex option** — third sex option added to onboarding and settings. Sex toggle restructured to a 2×1 grid (Male + Female on row 1, Prefer not to say full-width on row 2). `sex_prefer` translation key added to all 12 languages. `renderSettings()` updated to display the new option.
- [x] **Consent banner deferred past onboarding** — on first visit, consent banner no longer overlays the welcome modal. Banner is shown only after onboarding completes (`finishWelcome()` calls `showConsentBannerIfNeeded()`). Tests updated accordingly.
- [x] **Suggestion row 2-line layout** — habit suggestion cards in the add-habit modal now show name on top line and cadence + "★ for you" badge on the second line, preventing name text wrapping on narrow mobile screens.
- [x] **Expanded motivational messages** — 4–7 new messages added to each motivation tier (perfect/great/good/low) for more variety.
- [x] **Version bump habitio_v4 → v5** — localStorage key and SW cache name bumped; migration reads v4, v3, v2 and removes old keys on first load.
- [x] **Privacy-first GA4 (GTM removal)** — removed all inline GTM/gtag scripts from `index.html`. GA4 is now lazy-loaded from `app.js` only after the user grants consent. New functions: `ensureAnalyticsBootstrap()`, `loadAnalyticsScript()`, `applyAnalyticsConsent()`, `clearAnalyticsCookies()`, `queueAnalyticsCall()`, `trackPageView()`. Consent banner redesigned with i18n title, explanatory text, and settings note. All `gtag()` calls replaced with `trackEvent()`/`trackPageView()`/`queueAnalyticsCall()`. Cookies are cleared on decline.
- [x] **Version bump habitio_v5 → v6** — localStorage key and SW cache name bumped; migration reads v5 and removes old key on first load.
- [x] **Consent banner i18n** — 5 new keys (`consent_title`, `consent_text`, `consent_note`, `consent_accept`, `consent_decline`) added to all 12 languages. Banner buttons use translated text instead of hardcoded English.
- [x] **Test GA4 mock** — `mockGoogleAnalytics()` helper added to `test-helpers.js` to intercept gtag network requests in tests. All test storage references updated to `habitio_v6`.
- [x] **Service worker network-first fetch strategy** — SW changed from stale-while-revalidate to network-first for app shell (`index.html`, `app.js`, `i18n.js`, `suggestions.js`, `styles.css`, manifest, icons) to ensure fresh deploys are seen on first reload while maintaining offline fallback. Created `tests/sw.spec.js` with comprehensive service worker tests. Updated CLAUDE.md and docs to reflect the new caching strategy.

---

## Monetization & Affiliate Program Documentation (April 2026)

- [x] **Extract & document 68 habits** — Created `docs/habits.md` with all 68 habits, demographic scoring (5 age groups × 3 sex options = 70-row table), habit stacking guide, research summaries (7 sections with citations), motivational quotes (8 James Clear quotes), and 13 recommended books with reading level classifications.
- [x] **Separate affiliate links from habits reference** — Removed all affiliate links from `docs/habits.md` to create clean educational reference. Created `docs/affiliate.md` with professional B2B partnership table format (Price | Commission | Rules | Country | Ideas).
- [x] **Add "Ideas & Starting Points" column to affiliate.md** — Enhanced affiliate tables with 2–3 actionable startup tactics per habit showing country-specific partner availability. Completed for Health & Body (18 habits) and Mind & Focus (8 habits) with full affiliate link attribution by country. Remaining categories (Digital Detox, Relationships, Productivity, Micro Learning) use table format pending Ideas column completion.
- [x] **Document supported languages & identify affiliate gaps** — Extracted all 20 language codes from app.js LANGS object (lines 1215–1235). Created "Supported Languages & Markets" table documenting 19+ country markets across 4 continents. Performed affiliate partner coverage gap analysis categorizing countries into Full Coverage (8+), Partial (3–7), and Limited (1–2) tiers. Identified priority regions for expansion: Central/Eastern Europe (PL, RO, HR, RS, UA, RU, AL), Middle East (TR, EG), and regional varieties (bar, ca).
- [x] **Deep research report on global monetization trends** — Created `docs/deep-research-report.md` with comprehensive market analysis covering 5 countries (US, UK, Germany, India, Brazil) with evidence-based trend data. Included executive summary of freemium models, affiliate opportunities, and monetization priority scores (1–10). Documented per-country habit categories with affiliate programs, commission structures, and market evidence. Added affiliate funnel flowchart.
- [x] **Affiliate Strategy v1.0 with implementation guide** — Created `docs/affiliate-strategy.md` dated April 27, 2026. Documented MVP strategy with 5 Tier 1 partners: Amazon Associates (4–10%, easy), Babbel (€75/sub), Headspace ($15 CPA), eToro ($250 CPA), Rosetta Stone (12%). Included step-by-step instructions for creating affiliate links for each platform (with examples, URL patterns, dashboard workflows). Added link management best practices (disclosure requirements, UTM tracking, custom redirects). Provided 4-week implementation checklist and metrics to track (CTR, CR, RPC, top habits, country performance). Included future strategy expansion slots (v1.1, v2.0) with planned additions and review schedule.

---

## Mood Tracking Feature v2.10 (April 2026)

- [x] **Phase 1: Data model & migration** — Version bumped v9→v10. Added `mood` field to diary entries (1-5 integer scale). Migration reads v9, v8, v7 and removes old keys on first load. `APP_VERSION = "v2.10"`, `STORAGE_VERSION = "habitio_v10"`, SW cache `habitio_v10`.
- [x] **Phase 2: Mood UI in diary** — Added mood tracking to the 3-step journal flow (`DIARY_FIELDS = ["grateful", "affirm", "good"]`). Mood is captured inside the "good" step via a range slider (1–5), while "better" remains an optional collapsible section. Updated `saveDiary()` to handle mood integer values. Added `tip_diary_mood` tooltip with emotional awareness science.
- [x] **Phase 3: Mood visualization in stats** — Created 7-day mood bar chart in Stats tab. `buildMoodChartHtml()` generates vertical bars (height = mood × 20%, max 100px). Color thresholds: green (5), purple (4), orange (3), red (1-2). Day labels use `DN()` helper. Chart displays after formation phase card.
- [x] **Phase 4: Coach panel relocation** — Moved AI coach panel from Journal summary to Stats tab for better weekly context. Removed `renderCoachPanel()` call from diary view. Added coach card to Stats after mood chart. Updated i18n key `coach_stats_view`.
- [x] **Phase 5: Collapsible suggestion categories** — Added clickable category headers with chevron icons to add-habit modal. Toggle expand/collapse with smooth animations (chevron rotate 0.25s, max-height transition). Track category state during modal session (resets on close). Display category name and item count. GA4 `category_toggle` event fires on toggle. Comprehensive Playwright tests added (3 test cases).
- [x] **Phase 6: Test fixes** — Fixed 5 coach tests by adding `renderStats()` helper and updating selectors. Fixed 2 suggestion tests (flows + analytics) by using correct modal selectors. All 330 functional tests passing on Desktop Chromium.
- [ ] **Phase 7: i18n coverage** — 6 mood keys added to English, German, Polish. **Remaining:** 17 languages need `diary_mood`, `diary_ph_mood`, `mood_7day`, `mood_sub`, `coach_stats_view`, `tip_diary_mood` keys (pt, ru, fr, hi, uk, ar, sq, sr, bar, es, it, ro, nl, tr, el, hr, ca).
- [ ] **Phase 8: Verification & polish** — Manual testing on 4 browsers (Desktop/Pixel 5/Tablet/iPhone 12). Retake screenshots: `screenshot-journal.png`, `screenshot-journal-summary.png`, `screenshot-stats.png`, `screenshot-add-habit.png`, `desktop-stats.png`, `desktop-modal.png`. Update `CLAUDE.md`, `README.md`, `.github/copilot-instructions.md`. Run `yarn test` + `sonar-scanner` + CI verification.

---

## In Progress / Planned

- [ ] **Complete "Ideas & Starting Points" columns** for Digital Detox (5 habits), Relationships (7 habits), Productivity (10 habits), Micro Learning (10 habits) in `docs/affiliate.md`
- [x] **Activate Amazon Associates affiliate links** — Registered Store ID: `habitio-21`. Added 6 live product links to docs/affiliate.md (The 5 AM Club, This Naked Mind, Why We Sleep, Deep Work, Blue Light Glasses, Bullet Journal) with direct ASIN-based affiliate URLs. Updated docs/affiliate-strategy.md with active partner tracking section.
- [ ] **Apply for Babbel affiliate program** — Register via Impact, receive affiliate ID, generate links for all language learning habits (target 6+ languages)
- [ ] **Apply for Rosetta Stone affiliate program** — Register via FlexOffers, create country-specific links (US, UK, DE, BR)
- [ ] **Register for Headspace CPA program** — Receive $15/trial confirmation, add to Mind & Focus + Sleep habit sections
- [ ] **Apply for eToro high-value CPA program** — Secure $250/acquisition terms, create dedicated finance content landing page
- [ ] **Set up link tracking & analytics** — Implement UTM parameters, custom redirects at habitio.rafal-sladek.com/go/* for cleaner tracking
- [ ] **Affiliate disclosure footer** — Add standardized affiliate disclosure to all monetized habit pages
- [ ] **Track MVP performance** — Monitor CTR, CR, revenue per click by partner/habit/country for 90 days (review July 27, 2026)
- [ ] **Identify regional partners** — Research and reach out to India-specific (Flipkart, BYJU'S, HealthifyMe), Germany-specific (IKEA.de, KoRo), Brazil-specific (Mercado Libre, Magazine Luiza, Hotmart) affiliate programs
- [ ] **Strategy v1.1 expansion** — Post-MVP (July 2026), add 3–5 regional partners based on performance data
