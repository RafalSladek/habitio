# Feature Plan: Mood Tracking + Stats Coach Panel

Add daily mood tracking to journal flow, visualize 7-day mood trends in Stats view, relocate AI coach panel from Journal to Stats for better context, and make suggestion lists collapsible to improve UX.

**Target Version:** v2.10  
**Storage Schema:** habitio_v10  
**Estimated Tasks:** 46 steps across 8 phases

---

## Phase 1: Data Model & Migration

### Storage Schema Changes
- [ ] Add `mood` field to diary entries (`state.diary[date].mood` = 1-5 integer scale)
- [ ] Extract storage version constant (`STORAGE_VERSION = "habitio_v10"`) at top of [app.js](app.js)
- [ ] Bump version in 3 places (blocking requirement):
  - [ ] [app.js:1](app.js#L1): `APP_VERSION = "v2.10"`
  - [ ] [app.js:623](app.js#L623): `localStorage.setItem("habitio_v10", ...)`
  - [ ] [sw.js:1](sw.js#L1): `CACHE = "habitio_v10"`
- [ ] Add migration logic in `load()` ([app.js:628](app.js#L628)):
  ```javascript
  const raw = localStorage.getItem("habitio_v10") ||
              localStorage.getItem("habitio_v9") || ...
  // After loading old version, save to v10 and cleanup
  ```
- [ ] Update i18n keys for mood prompts (20 languages)

**Dependencies:** None (foundational work)

---

## Phase 2: Mood UI in Diary

### Add Mood Step to Journal Flow
- [ ] Update `DIARY_FIELDS` ([app.js:1561](app.js#L1561)): `["grateful", "affirm", "good", "better", "mood"]`
- [ ] Add mood icon to `DIARY_ICONS`: `mood: "😊"` (or use emoji picker pattern)
- [ ] Create mood scale UI in `renderDiary()` ([app.js:1653-1697](app.js#L1653-L1697)):
  - [ ] 5 large emoji buttons (😢 😕 😐 🙂 😄) instead of textarea
  - [ ] Active state styling (scale 1.2×, border accent)
  - [ ] Tap to select, auto-advance to next step
- [ ] Update `saveDiary()` ([app.js:1711](app.js#L1711)) to handle mood integer value
- [ ] Add mood tooltip with science context (emotional awareness benefits)

**Dependencies:** Phase 1 complete (schema exists)

---

## Phase 3: Mood Visualization in Stats

### 7-Day Bar Graph
- [ ] Create `buildMoodChartHtml()` helper (after [app.js:2133](app.js#L2133)):
  - [ ] Loop last 7 days (today → -6 days)
  - [ ] Read `state.diary[fmt(d)].mood` (1-5 scale)
  - [ ] Generate vertical bars with height = mood × 20% (5 → 100%)
  - [ ] Color thresholds: green (5), purple (4), orange (3), red (1-2)
  - [ ] Day labels (Mon/Tue/... using `DN(d.getDay())`)
- [ ] Insert mood card in `renderStats()` ([app.js:2323](app.js#L2323)) after Formation card:
  ```html
  <div class="stat-card">
    <div class="stat-card-title">{t("mood_7day")}</div>
    <div class="stat-card-sub">{t("mood_sub")}</div>
    <div class="mood-chart">{buildMoodChartHtml()}</div>
  </div>
  ```
- [ ] Add CSS for `.mood-chart`, `.mood-bar-container`, `.mood-bar`, `.mood-label` in [styles.css](styles.css)
  - [ ] 7-column grid layout (7px gap)
  - [ ] Flex column bars (justify-content: flex-end)
  - [ ] 80px max height for bars
  - [ ] 11px day labels below bars

**Dependencies:** Phase 2 complete (mood data exists)  
**Reference:** Heatmap pattern at [app.js:2117-2133](app.js#L2117-L2133)

---

## Phase 4: Relocate Coach Panel to Stats

### Move from Journal Summary to Stats Tab
- [ ] Remove `renderCoachPanel()` call from `renderDiary()` ([app.js:1646](app.js#L1646))
- [ ] Add coach card in `renderStats()` after mood chart (line ~2323):
  ```javascript
  '<div class="stat-card coach-panel">' +
    renderCoachPanel() +
  '</div>'
  ```
- [ ] Update `renderCoachPanel()` ([app.js:2028-2069](app.js#L2028-L2069)):
  - [ ] Remove `.coach-panel-journal` class (Stats uses `.stat-card` styling)
  - [ ] Keep 3-day unlock logic
  - [ ] Keep diary inclusion checkbox
- [ ] Update coach i18n keys if context changed (e.g., "Reflect on your week" vs "Reflect on today")

**Dependencies:** None (can be parallel with Phase 3)

---

## Phase 5: Collapsible Suggestion Sections

### Make Add Habit Modal Sections Expandable
- [ ] Identify suggestion categories in modal (likely rendered in `renderHabitModal()` or FAB handler)
- [ ] Wrap each category's `.suggestion-item` list in collapsible container:
  ```html
  <div class="category-header" onclick="toggleCategory('health')">
    💪 Health & Body <span class="toggle-icon">▼</span>
  </div>
  <div class="category-items" id="cat-health" style="max-height: 5000px;">
    <!-- suggestion buttons -->
  </div>
  ```
- [ ] Add CSS transition in [styles.css](styles.css):
  ```css
  .category-items {
    max-height: 5000px;
    overflow: hidden;
    transition: max-height 0.3s ease;
  }
  .category-items.collapsed { max-height: 0; }
  ```
- [ ] Add `toggleCategory(id)` function:
  ```javascript
  function toggleCategory(id) {
    const el = document.getElementById('cat-' + id);
    el.classList.toggle('collapsed');
    // Update toggle icon ▼ ↔ ▶
  }
  ```
- [ ] Persist expansion state in `localStorage` (optional enhancement)

**Dependencies:** None (independent feature)

---

## Phase 6: Test Updates

### Fix Breaking Changes (7 tests affected)

**Coach Panel Tests** ([tests/coach.spec.js](tests/coach.spec.js)) — 5 tests:
- [ ] Update `openJournalSummary()` helper → `openCoachPanel()`:
  ```javascript
  async function openCoachPanel(page) {
    await page.getByRole("button", { name: /Stats/ }).click();
    await page.locator("#coach-focus").scrollIntoViewIfNeeded(); // mobile viewports
  }
  ```
- [ ] Update all 5 coach tests (lines 54, 60, 94, 145, 171):
  - [ ] "coach reflection appears..." (line 54)
  - [ ] "coach reflection stays locked..." (line 60)
  - [ ] "posts compact summary..." (line 94)
  - [ ] "includes recent journal entries..." (line 145)
  - [ ] "shows toast when daily limit..." (line 171)

**Suggestion Click Tests** ([tests/flows.spec.js](tests/flows.spec.js), [tests/analytics.spec.js](tests/analytics.spec.js)) — 2 tests:
- [ ] Update `addSuggestedHabit()` helper ([test-helpers.js:151](tests/test-helpers.js#L151)):
  ```javascript
  async function addSuggestedHabit(page, name, category = "Health & Body") {
    await page.locator("#fab-add").click();
    
    // Expand category if collapsed
    const header = page.locator(".category-header", { hasText: category });
    if (await header.count() > 0) {
      const isCollapsed = await header.evaluate(el => 
        el.nextElementSibling.classList.contains('collapsed')
      );
      if (isCollapsed) await header.click();
    }
    
    await page.locator(".suggestion-item", { hasText: name }).click({ force: true });
    await page.locator("#modal-done-bar").click();
  }
  ```
- [ ] Fix "add habit from suggestions" ([flows.spec.js:24](tests/flows.spec.js#L24))
- [ ] Fix "habit_add event fired" ([analytics.spec.js:125](tests/analytics.spec.js#L125))

**Version Assertion Tests:**
- [ ] Update version checks to expect `v2.10` (if any tests validate `APP_VERSION`)

**Mobile Viewport Tests (iPhone 12 Safari, Pixel 5):**
- [ ] Add `scrollIntoViewIfNeeded()` for coach panel in Stats (tall page)
- [ ] Add `force: true` to clicks on collapsed overflow containers (if needed)

**Dependencies:** Phases 2-5 complete (features implemented)

---

## Phase 7: Analytics & i18n

### Translations for 20 Languages
- [ ] Add i18n keys to [i18n.js](i18n.js):
  - [ ] `mood_prompt`: "How do you feel today?"
  - [ ] `mood_tooltip`: "Research shows daily mood tracking..."
  - [ ] `mood_7day`: "Mood Trends"
  - [ ] `mood_sub`: "Your emotional patterns over the past week"
  - [ ] Update `tip_diary_mood` science tooltip
- [ ] Translate all keys for 20 locales (en, de, pl, es, fr, it, pt, ru, zh, ja, ko, ar, hi, nl, sv, no, da, fi, cs, tr)

### GA4 Event Tracking
- [ ] Track mood selection: `trackEvent("mood_logged", { value: 1-5, date: k })`
- [ ] Track coach panel view in Stats: `trackEvent("coach_stats_view")`
- [ ] Track suggestion section toggle: `trackEvent("category_toggle", { category, expanded })`

**Dependencies:** Phases 2-5 complete  
**Parallel with:** Phase 6 (can run concurrently)

---

## Phase 8: Verification & Polish

### Manual Testing Checklist
- [ ] Desktop (1280×720):
  - [ ] Complete 5-step diary flow (4 PERMA + mood)
  - [ ] Mood selection UI works (tap emoji, auto-advance)
  - [ ] Navigate to Stats → see 7-day mood graph
  - [ ] Coach panel visible in Stats (not Journal)
  - [ ] Collapsible categories in Add Habit modal
- [ ] Mobile (Pixel 5 393×851):
  - [ ] Same flows as desktop
  - [ ] Coach panel scrollable on Stats tab
  - [ ] Collapsed categories don't overflow
- [ ] Tablet (768×1024):
  - [ ] Hybrid layout works
  - [ ] Mood graph readable
- [ ] iPhone 12 Safari (390×844):
  - [ ] No click event failures (force: true applied)
  - [ ] Smooth animations on category toggle

### Automated Test Verification
- [ ] `yarn test` — all 4 browser projects pass:
  - [ ] Desktop Chromium
  - [ ] Pixel 5 Chromium
  - [ ] Tablet Firefox
  - [ ] iPhone 12 Safari
- [ ] `yarn format` — Prettier check passes
- [ ] `sonar-scanner` — Quality Gate passes (no new bugs/smells)

### Screenshot Updates
- [ ] Retake affected screenshots in [docs/](docs):
  - [ ] Mobile: `screenshot-journal.png` (mood step)
  - [ ] Mobile: `screenshot-journal-summary.png` (no coach panel)
  - [ ] Mobile: `screenshot-stats.png` (coach + mood graph)
  - [ ] Mobile: `screenshot-add-habit.png` (collapsible categories)
  - [ ] Desktop: `desktop-stats.png` (coach + mood)
  - [ ] Desktop: `desktop-modal.png` (collapsible categories)

### Documentation Updates
- [ ] Update `CLAUDE.md`:
  - [ ] Diary fields: 4 → 5 (add mood)
  - [ ] Coach panel location change
  - [ ] Version v2.10 references
- [ ] Update `README.md` if feature warrants mention
- [ ] Update `.github/copilot-instructions.md` with version bump

**Dependencies:** All phases complete

---

## Relevant Files

- [app.js](app.js) — All logic changes (diary, stats, coach, storage)
  - Lines 1-10: Version constants
  - Lines 1561-1697: Diary rendering
  - Lines 2028-2069: Coach panel
  - Lines 2135-2323: Stats rendering
  - Lines 623, 628: Storage save/load
- [sw.js](sw.js) — Cache version update (line 1)
- [styles.css](styles.css) — Mood chart CSS, collapsible categories
- [i18n.js](i18n.js) — 20-language translations
- [tests/coach.spec.js](tests/coach.spec.js) — 5 breaking tests
- [tests/flows.spec.js](tests/flows.spec.js) — 1 breaking test (line 24)
- [tests/analytics.spec.js](tests/analytics.spec.js) — 1 breaking test (line 125)
- [tests/test-helpers.js](tests/test-helpers.js) — Helper function updates (line 151)

---

## Decisions & Assumptions

1. **Mood scale:** 1-5 integer (not 1-10) for simplicity — maps to 5 emoji faces
2. **Graph visualization:** Vertical bars (not line chart) to match heatmap aesthetic
3. **Coach context:** Stats tab provides weekly overview context (better for reflection than single-day journal)
4. **Migration strategy:** No data loss — read old versions, write new version, cleanup old keys
5. **Category defaults:** All categories start expanded (opt-in collapse for power users)
6. **Mobile scrolling:** Coach panel in Stats requires `scrollIntoViewIfNeeded()` for short viewports
7. **Test strategy:** Use `force: true` sparingly (only for overflow:hidden conflicts, not as default)

---

## Out of Scope (Explicitly Excluded)

- Mood analytics/insights beyond 7-day graph (future: monthly trends, correlations with habits)
- Voice notes for diary entries (keeps text-only for now)
- Custom mood emoji picker (uses fixed 5 emojis)
- Export mood data separately (covered by existing import/export)
- Coach panel customization (stays fixed in Stats)

---

## Risk Mitigation

- **Test breakage:** Phase 6 addresses all known test failures proactively (5 coach + 2 suggestions = 7 tests)
- **Safari click issues:** Phase 6 applies `force: true` only where overflow:hidden blocks clicks
- **Migration failures:** Phase 1 preserves backward compatibility (reads v9→v8→v7...)
- **i18n coverage:** Phase 7 ensures 100% key parity across all 20 languages (prevents runtime errors)
- **Performance:** Mood graph renders 7 elements (negligible), collapsible CSS uses GPU-accelerated transforms

---

## Success Criteria

✅ All 46 steps completed  
✅ `yarn test` passes on all 4 browser projects  
✅ `sonar-scanner` Quality Gate passes  
✅ Version bumped to v2.10 in 3 places  
✅ Screenshots updated and visually verified  
✅ No user data loss after migration  
✅ Coach panel functional in Stats tab  
✅ 7-day mood graph renders correctly  
✅ Suggestion categories collapsible
