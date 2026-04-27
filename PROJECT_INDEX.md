# habit.io — Project Index

**Live:** https://habitio.rafal-sladek.com/ | **Repo:** https://github.com/RafalSladek/habitio  
**Type:** Offline-first PWA habit tracker — vanilla JS, no build step, deployed via GitHub Pages  
**Version:** `v2.9` — localStorage key `habitio_v9`, SW cache `habitio_v9` (always in sync)

---

## Source Files

| File | Lines | Purpose |
|------|------:|---------|
| `index.html` | 330 | App shell, markup, `<picture>` hero, non-blocking font load |
| `app.js` | 2814 | All application logic |
| `styles.css` | 2300 | All styles, CSS custom properties |
| `i18n.js` | 6289 | 20-language translations — `T` object, `t()`, `DN()`, `MN()` |
| `suggestions.js` | 138 | Habit suggestion data with demographic scoring |
| `sw.js` | 128 | Service worker — network-first app shell + offline cache |
| `manifest.json` | — | PWA manifest |
| `worker/feedback.js` | — | Cloudflare Worker — feedback → GitHub Issues + AI coach proxy |

---

## Data Model

```
localStorage key: habitio_v9
{
  habits:    Habit[]            // ordered list
  checks:    { [date]: { [id]: true } }
  diary:     { [date]: DiaryEntry }
  profile:   { name, age, ageGroup, sex }
  lang:      string             // ISO code
  kitsDismissed: { [id]: true }
  consentAnalytics: null|true|false
  aiCoach:   CoachState
}
```

**Habit shape:** `{ id, name, emoji, cadence, morning, source, createdAt }`  
**Cadence types:** `daily` | `specific_days` (days[]) | `x_per` (count + week/month)  
**Age groups:** `teen(13–17)`, `young(18–29)`, `adult(30–49)`, `mid(50–64)`, `senior(65+)`  
**Sex values:** `"male"` | `"female"` | `"prefer"`

---

## app.js — Function Reference

### Analytics (GA4, lazy-loaded, consent-gated)
| Function | Line | Purpose |
|----------|-----:|---------|
| `ensureAnalyticsStub()` | 29 | Create gtag stub before script loads |
| `ensureAnalyticsBootstrap()` | 42 | One-time GA4 config with consent denied |
| `loadAnalyticsScript()` | 55 | Lazy inject GA4 `<script>` |
| `applyAnalyticsConsent(granted)` | 80 | Update consent mode + load if granted |
| `clearAnalyticsCookies()` | 87 | Remove `_ga*` cookies across domains |
| `queueAnalyticsCall()` | 111 | Queue pending event |
| `updateUserProperties()` | 122 | Set GA4 user dimensions |
| `trackEvent(name, params)` | 130 | Fire GA4 event |
| `trackPageView(pageTitle, pageLocation)` | 140 | GA4 page view |
| `setConsent(granted)` | 147 | Save + apply consent, re-render settings |

### State & Persistence
| Function | Line | Purpose |
|----------|-----:|---------|
| `save()` | 622 | `JSON.stringify(state)` → `habitio_v9` |
| `load()` | 625 | Load state + migrate from older version keys |
| `uid()` | 597 | `crypto.randomUUID()` with fallback |

### Date Utilities
| Function | Line | Purpose |
|----------|-----:|---------|
| `fmt(d)` | 677 | `toISOString().slice(0,10)` — UTC date key |
| `getMon(d)` | 683 | Monday of the week containing `d` |
| `addD(d, n)` | 690 | Add `n` days |
| `isToday(d)` | 695 | Compare against today |
| `sameDay(a, b)` | 698 | Date equality |
| `dIdx(d)` | 701 | Day index (0 = Mon) |

### Habit Logic
| Function | Line | Purpose |
|----------|-----:|---------|
| `isScheduled(h, date)` | 705 | Check if habit is due on given date |
| `cadenceLabel(c)` | 711 | Human-readable cadence string |
| `periodProg(h, date)` | 718 | Checks in current period / target |
| `getStreak(id)` | 737 | Current streak in days |
| `getFormationPhase(h)` | 549 | 66-day arc phase: learning/building/forming/formed |
| `getSuggestions()` | 515 | Ranked habit suggestions for user profile |
| `sugPriority(nameKey, profile)` | 818 | Score suggestion by age/sex match |
| `scoreFor(val, flag)` | 814 | Numeric score helper |

### Rendering
| Function | Line | Purpose |
|----------|-----:|---------|
| `render()` | 930 | Top-level render dispatch |
| `renderWeekNav()` | 939 | Week header + navigation |
| `renderDays()` | 954 | Day column headers |
| `renderProgress()` | 983 | Progress bar + motivation |
| `renderHabits()` | 1101 | Full habit list |
| `buildHabitHtml(h, ch)` | 1012 | Single habit row HTML |
| `renderSuggestions()` | 1362 | Suggestion list in modal |
| `renderEmojiPicker()` | 1418 | Emoji grid in modal |
| `renderCadence()` | 1435 | Cadence type chips |
| `renderCadDetail()` | 1459 | Day/frequency picker detail |
| `renderDiary()` | 1570 | Journal multi-step view |
| `renderStats()` | 2135 | Full statistics view |
| `renderSettings()` | 2327 | Settings panel |
| `renderCoachPanel()` | 2028 | AI coach panel |
| `renderCoachResultCard()` | 1999 | Coach response card |

### Onboarding
| Function | Line | Purpose |
|----------|-----:|---------|
| `showWelcome()` | 1199 | Show welcome screen |
| `renderAgeChips()` | 572 | Age group selection chips |
| `setAgeGroup(k)` | 585 | Select age group |
| `setSex(val)` | 1271 | Select sex |
| `validateWelcomeForm()` | 590 | Enable/disable go button |
| `finishWelcome()` | 1278 | Save profile, dismiss welcome |
| `setWelcomeLang(l)` | 1257 | Switch language during onboarding |

### Habit CRUD
| Function | Line | Purpose |
|----------|-----:|---------|
| `openAddModal(hid)` | 1291 | Open add/edit modal (`hid=null` → add) |
| `closeAddModal()` | 1334 | Close + reset modal state |
| `updateModalDoneState()` | 1344 | Enable/disable Save button |
| `saveHabit()` | 1508 | Create or update habit |
| `delHabit(id)` | 2577 | Delete habit + all checks |
| `toggleHabit(id)` | 1159 | Toggle check for selected date |
| `changeWeek(dir)` | 1191 | ±1 week navigation |

### Cadence Modal Controls
| Function | Line | Purpose |
|----------|-----:|---------|
| `toggleModalMorning()` | 557 | Toggle morning flag |
| `pickEmoji(el, e)` | 1430 | Select emoji |
| `setCadType(tp)` | 1455 | Set cadence type chip |
| `togDay(i)` | 1498 | Toggle specific weekday |
| `setFP(p)` | 1504 | Set frequency period (week/month) |

### Diary (Journal)
| Function | Line | Purpose |
|----------|-----:|---------|
| `calcDiaryStep()` | 1564 | Determine current diary step |
| `diaryStepGo(dir)` | 1699 | Navigate diary steps |
| `changeDiaryDay(dir)` | 1704 | Navigate diary days |
| `addFromDiary(nameKey, emoji)` | 1711 | Add habit suggested in diary |
| `saveDiary(k, field, val)` | 1727 | Save diary entry field |
| `hasDiaryContent(entry)` | 1865 | Check if entry has content |
| `getTrackedDayCount()` | 1869 | Count days with diary content |

### Import / Export
| Function | Line | Purpose |
|----------|-----:|---------|
| `openImportModal()` | 1740 | Open import dialog |
| `closeImportModal()` | 1758 | Close import dialog |
| `toggleImpOpt(k)` | 1761 | Toggle habits/tracking import options |
| `applyImportData(d)` | 1769 | Merge imported JSON into state |
| `doImport()` | 1818 | Read file, parse, apply |
| `exportData()` | 1834 | Serialize + download JSON |

### Statistics
| Function | Line | Purpose |
|----------|-----:|---------|
| `calcHabitStats(h)` | 2083 | Per-habit stats (streak, rate, best) |
| `calcBestStreak(hs)` | 2102 | Best ever streak across checks |
| `buildHeatmapHtml()` | 2114 | 12-week activity heatmap |
| `calcProgressWindow(days)` | 1846 | Rolling N-day completion rate |

### AI Coach
| Function | Line | Purpose |
|----------|-----:|---------|
| `defaultCoachState()` | 602 | Initial coach state object |
| `getCoachDeviceId()` | 612 | Persistent device ID (separate key) |
| `isCoachUnlocked()` | 1883 | Check unlock conditions |
| `getCoachDiarySummary()` | 1887 | Format diary entries for LLM |
| `coachLanguageLabel(code)` | 1911 | Language code → display name |
| `buildCoachPayload(focus)` | 1929 | Assemble `/coach` POST body |
| `formatCoachTimestamp(iso)` | 1987 | ISO → human-readable |
| `setCoachDiaryPreference(checked)` | 2513 | Toggle diary inclusion |

### Affiliate / Monetization
| Constant/Function | Line | Purpose |
|-------------------|-----:|---------|
| `AMZ_TAG` | 237 | Amazon tag `habitio-21` |
| `HABIT_KITS` | 371 | Curated product kit definitions |
| `ATOMIC_HABITS` | 342 | Atomic Habits book product |
| `KINDLE_UNLIMITED` | 349 | Kindle Unlimited subscription |
| `KINDLE_PW` | 356 | Kindle Paperwhite product |
| `AUDIBLE` | 363 | Audible subscription |
| `getHabitFact(h, date)` | 334 | Daily motivational fact per habit |
| `getHabitKit(h)` | 468 | Get product kit for habit type |
| `dismissKit(id)` | 472 | Dismiss kit card permanently |

### UI / Navigation
| Function | Line | Purpose |
|----------|-----:|---------|
| `switchPage(p)` | 2620 | Router: tracker / diary / stats / settings |
| `setFabVisible(show)` | 2617 | Show/hide FAB |
| `applyLang()` | 756 | Apply `data-i18n` translations to DOM |
| `changeLang(l)` | 2609 | Save language + re-render |
| `getGreeting()` | 763 | Time-based greeting string |
| `showMotivation(pct)` | 775 | Motivational message by completion % |
| `showTip(btn, msg)` | 2641 | Show tooltip |
| `hideTip()` | 2657 | Hide tooltip |
| `tipBtn(key)` | 2661 | Render info button with tooltip |
| `showToast(m)` | 2669 | Brief toast notification |
| `esc(s)` | 2675 | HTML-escape string |
| `shareApp()` | 2067 | Web Share API / clipboard fallback |
| `setFeedbackStar(n)` | 2470 | Star rating selection |
| `showConsentBannerIfNeeded()` | 2692 | Show GDPR consent banner |
| `initPullToRefresh()` | 2736 | Touch pull-to-refresh gesture |
| `resetData()` | 2592 | Factory reset (clears localStorage) |

---

## Key Constants (app.js)

| Constant | Value | Purpose |
|----------|-------|---------|
| `APP_VERSION` | `"v2.9"` | Display version |
| `WORKER_BASE_URL` | `https://habitio-feedback.rafal-sladek.workers.dev` | CF Worker base |
| `FEEDBACK_WORKER_URL` | `WORKER_BASE_URL` | Feedback endpoint |
| `COACH_WORKER_URL` | `WORKER_BASE_URL + "/coach"` | Coach endpoint |
| `COACH_DEVICE_KEY` | `"habitio_ai_device"` | Separate localStorage key for device ID |
| `GA_MEASUREMENT_ID` | `"G-V9TJW7N2VY"` | GA4 property |
| `AMZ_TAG` | `"habitio-21"` | Amazon Associates tag |
| `AGE_GROUPS` | array[5] | `teen/young/adult/mid/senior` |
| `EMOJIS` | array | Available habit emojis |
| `HABIT_FACTS` | array | Daily habit facts |
| `QUOTES` | array | Motivational quotes |
| `HABIT_KITS` | array | Affiliate kit definitions |

---

## i18n.js

**Languages (20):** en, de, pl, pt, ru, fr, hi, uk, ar, sq, sr, bar + more  
**API:**
- `T` — object keyed by language code, each value is full translation map
- `t(key)` — lookup key in `T[state.lang]`, fallback to `T.en`
- `DN()` — localized day names array
- `MN()` — localized month names array

---

## Service Worker (sw.js)

**Cache name:** `habitio_v9` (must match localStorage key)  
**Strategy:**
- Network-first for app shell: `index.html`, `app.js`, `i18n.js`, `suggestions.js`, `styles.css`, manifest, core icons
- Stale-while-revalidate for other same-origin assets
- Offline fallback from cache when network unavailable

---

## Cloudflare Worker (worker/feedback.js)

**Routes:**
- `POST /` — validate + create GitHub Issue (feedback)
- `POST /coach` — rate-limited LLM proxy via Cloudflare AI

**Config:**
- Model: `@cf/meta/llama-3.1-8b-instruct-fast`
- Default budget: 5 requests/day, 4500 estimated tokens/day per device
- CORS whitelist: `habitio.rafal-sladek.com`, `rafalsladek.github.io`, `localhost:3000`
- Secrets: `GITHUB_TOKEN` (Cloudflare), `CLOUDFLARE_API_TOKEN` (GitHub repo secret for CI)

**Manual deploy:** `cd worker && npx wrangler deploy`

---

## Tests (Playwright)

**Config:** `playwright.config.js` — baseURL `http://localhost:3000`, served via `npx serve`  
**Projects:** Desktop Chromium | Pixel 5 Chromium | Tablet Firefox | iPhone 12 Safari

| Spec | Lines | Coverage |
|------|------:|---------|
| `analytics.spec.js` | 190 | GA4 consent, events, lazy load |
| `coach.spec.js` | 193 | AI coach panel, budget, diary |
| `consent.spec.js` | 96 | Consent banner flow |
| `feedback.spec.js` | 99 | Feedback widget, star rating |
| `flows.spec.js` | 94 | Core user flows (add, check, week nav) |
| `formation.spec.js` | 81 | 66-day habit formation arc |
| `i18n.spec.js` | 62 | Translations key coverage |
| `import-export.spec.js` | 219 | JSON import/export, merge options |
| `lang-switch.spec.js` | 41 | Language switching |
| `onboarding.spec.js` | 58 | Welcome flow, profile setup |
| `ptr.spec.js` | 102 | Pull-to-refresh gesture |
| `seo.spec.js` | 75 | Meta tags, sitemap, canonical |
| `settings.spec.js` | 34 | Settings page interactions |
| `sw.spec.js` | 177 | Service worker, offline, cache |

**Test helpers (`tests/test-helpers.js`):**
- `createState(overrides)` — build test state
- `openClearedApp(page)` — navigate + clear storage
- `resetToDefaultState(page, overrides)` — seed known state
- `completeOnboarding(page, name)` — fill + submit welcome
- `seedHabit(page, daysOld, checkedDaysBack)` — seed single habit via v2 migration
- `addSuggestedHabit(page, name)` — add via suggestion UI
- `spyOnGtag(page)` — intercept dataLayer calls
- `seedConsented(page, extra)` — seed state with consent=true
- `goToSettings(page)` — navigate to settings

---

## CI/CD (.github/workflows/ci.yml)

**Trigger:** push/PR to `main`

```
test (4×) ──┬── test-summary ──┬── deploy (GitHub Pages)
            ├── sonar          │
            └── deploy-worker  └── pagespeed (Lighthouse CI)
```

| Job | Key steps |
|-----|-----------|
| `test` | Matrix: 4 browsers, Playwright, upload lcov + reports |
| `test-summary` | Aggregate badge JSON from 4 coverage artifacts |
| `sonar` | Merge lcov, SonarCloud scan + quality gate |
| `deploy-worker` | `wrangler deploy` to Cloudflare (main only) |
| `deploy` | Generate badges, inject `BUILD_SHA`, deploy to GitHub Pages, tag + release |
| `pagespeed` | Lighthouse CI against live URL, 3 runs |

---

## Version Bump Checklist

When changing any source file, bump version in **3 places**:
1. `localStorage` key in `save()` / `load()` in `app.js` (e.g. `habitio_v9` → `habitio_v10`)
2. `CACHE` in `sw.js` (same value)
3. `APP_VERSION` in `app.js` (e.g. `"v2.9"` → `"v2.10"`)

Always add a migration read in `load()` for the old key — never lose user data.

---

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/generate-badges.js` | Generate SVG badge endpoints |
| `scripts/take-screenshots.js` | Playwright screenshot automation |
| `scripts/generate-gif.js` | Animated GIF generation |
| `scripts/update-pagespeed.js` | Update PageSpeed badge data |
| `scripts/setup.sh` / `setup.ps1` | Dev environment setup |

---

## Quality Gates

- **SonarCloud:** quality gate must pass before deploy
- **Coverage:** ≥ 80% on new code (blocking)
- **Exclusions** (`sonar-project.properties`): `tests/**`, `scripts/**`, `worker/**`, `sw.js`, `manifest.json`, CPD skip on `suggestions.js` + `i18n.js`
- **Format:** `yarn format` (Prettier) required before commit
- **Lighthouse budget:** `.github/lighthouse-budget.json`
