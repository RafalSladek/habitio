# habit.io --- Full Application Architecture

## 1. What It Is

A **zero-dependency, offline-first Progressive Web App** for habit tracking. No React, no Vue, no build step --- pure vanilla HTML/CSS/JS served directly from GitHub Pages.

---

## 2. Architecture --- "No Build" Philosophy

```
index.html          -> App shell + meta tags + structured data
+-- styles.css      -> All styles (dark-only theme, CSS variables)
+-- i18n.js         -> Translation object (12 languages, ~200 keys each)
+-- suggestions.js  -> Habit suggestion data with demographic scoring
+-- app.js          -> All application logic (~2,700 lines)
+-- sw.js           -> Service worker (offline caching)
+-- manifest.json   -> PWA manifest (standalone, portrait)
+-- worker/
    +-- feedback.js -> Cloudflare Worker (feedback + AI coach API)
```

There is **no bundler, no transpiler, no framework**. Files are edited directly and deployed by pushing to `main`. This is a deliberate architectural choice --- it keeps the project simple, fast to iterate, and eliminates build tooling complexity.

---

## 3. State Management Pattern

**Centralized mutable state** persisted to `localStorage`:

```javascript
let state = {
  habits: [],        // Array of habit objects
  checks: {},        // { "2026-04-03": { "habit-uuid": true } }
  diary: {},         // { "2026-04-03": { grateful, affirm, good, better } }
  profile: { name, age, ageGroup, sex },
  lang: "en",
  consentAnalytics: null  // null = not asked, true/false = decided
};
```

- **Persistence**: `localStorage.setItem("habitio_v9", JSON.stringify(state))`
- **Migration chain**: On load, checks keys v2 through v8 and migrates data shape forward --- users never lose data across schema changes
- **Rendering**: State changes trigger imperative re-renders (build HTML strings, set `innerHTML`). No virtual DOM, no reactive bindings.

---

## 4. Key Patterns

### Page-Based SPA (No Router)

Four pages (`tracker`, `diary`, `stats`, `settings`) toggled via CSS class `.page.active`. A bottom nav bar switches pages. No URL routing --- the entire app lives at one URL.

### Habit Data Model

```javascript
{
  id: crypto.randomUUID(),   // uid() with fallback
  name: "Meditate",
  emoji: "...",
  cadence: {
    type: "daily" | "specific_days" | "x_per",
    days: [1,3,5],           // for specific_days (Mon/Wed/Fri)
    count: 3, period: "week" // for x_per
  },
  morning: true,             // grouped at top of tracker
  source: "suggested" | "custom",
  createdAt: "2026-04-03"
}
```

### 66-Day Formation Arc

Based on habit formation science. Each habit progresses through four phases calculated from `createdAt`:

| Phase    | Days  |
|----------|-------|
| Learning | 0-19  |
| Building | 20-49 |
| Forming  | 50-65 |
| Formed   | 66+   |

### Evidence-Based Suggestion Scoring

`sugPriority()` scores habit suggestions using age band (teen/young/adult/mid/senior) and sex. Scores are grounded in published research --- e.g., strength training scores higher for 50+, screen-time habits score higher for teen girls. Sources cited in code comments.

### Morning Routine Grouping

Habits flagged `morning: true` are visually separated and grouped at the top of the tracker list.

---

## 5. Internationalization (i18n)

A single `T` object in `i18n.js` holds all translations for **12 languages**: en, de, pl, pt, ru, fr, hi, uk, ar, sq, sr, bar (Bavarian).

```javascript
t("nav_today")  // -> looks up T[state.lang]["nav_today"]
```

HTML elements use `data-t="key"` attributes for automatic translation. Motivational messages are arrays for random selection. Interpolation uses simple `{n}` replacement.

---

## 6. Offline-First with Service Worker

`sw.js` uses **network-first** for app shell assets and **stale-while-revalidate** for other same-origin assets:

1. **Install**: Pre-caches the core HTML, CSS, JS, manifest, and icon assets
2. **Fetch (app shell)**: Tries the network first so deploys show up on the first reload, then falls back to cache offline
3. **Fetch (other same-origin assets)**: Serves cache immediately and refreshes in background
4. **Activate**: Cleans up old cache versions

User data lives in `localStorage` (not the SW cache), so it is always available offline. The cache name (`habitio_v9`) is kept in sync with the localStorage key --- bumping one bumps both.

**Trade-off**: Users still need a reload to pick up new code that was deployed after the page was already open. Without a build step and asset fingerprinting, first reload is the best achievable behavior.

---

## 7. Privacy-First Analytics

GA4 is **not loaded by default**. It is lazy-loaded from `app.js` only after explicit user consent:

- Consent stored in `state.consentAnalytics` (null/true/false)
- On denial: all GA cookies are cleared
- Events tracked: habit completions, journal writes, coach usage, imports/exports
- Device-scoped properties: age_group, sex, ui_language

---

## 8. Cloudflare Worker Backend

The only server-side component --- a Cloudflare Worker at `worker/feedback.js`:

- **Feedback endpoint** (`POST /`): Creates GitHub issues from in-app feedback
- **AI Coach endpoint** (`POST /coach`): Sends habit/journal summary to Cloudflare Workers AI, returns personalized coaching
- **Rate limiting**: 5 requests/day per device, ~4500 tokens/day
- **CORS**: Validates origin against allowed list

---

## 9. Styling Approach

**Always-dark theme** using CSS custom properties:

| Variable    | Value     | Purpose          |
|-------------|-----------|------------------|
| `--bg`      | `#0a0a0f` | Background       |
| `--surface` | `#131320` | Card surfaces    |
| `--accent`  | `#6c5ce7` | Primary purple   |
| `--success` | `#00cec9` | Completion cyan  |
| `--danger`  | `#e17055` | Warnings         |

- **Mobile-first**: 480px max-width, safe-area-inset padding for notch/home indicator
- **Font**: DM Sans (body) + DM Mono (data/numbers)
- **Animations**: `checkPop` spring animation on habit completion, smooth transitions
- **Layout**: Flexbox + CSS Grid, no layout library

---

## 10. Testing Strategy

**Playwright E2E tests** across 3 device profiles (Desktop Chrome, Pixel 5, iPad):

- 9 spec files covering: onboarding, habit flows, formation phases, coach, analytics consent, feedback, import/export, settings
- Test helpers for DRY state setup (`seedHabit()`, `completeOnboarding()`, `mockGoogleAnalytics()`)
- Coverage via v8-to-istanbul

---

## 11. CI/CD Pipeline

GitHub Actions (`ci.yml`) with 5 jobs:

```
push to main
  +-- test (Playwright e2e)
  |   +-- sonar (SonarCloud quality gate)
  |       +-- deploy (GitHub Pages + auto-tag + release notes)
  |           +-- pagespeed (Lighthouse CI on both URLs)
  +-- deploy-worker (Cloudflare Workers)
```

Auto-generates sequential deploy tags (`deploy-001`, `deploy-002`, ...) with changelog from git log.

---

## 12. Design Decisions

| Decision                         | Why                                                  |
|----------------------------------|------------------------------------------------------|
| No framework                     | Simplicity, no build step, instant deploys           |
| No backend (except worker)       | Privacy, offline-first, zero ops                     |
| localStorage over IndexedDB      | Simpler API, sufficient for habit data               |
| Network-first app shell          | Fresh deploys appear on first reload while staying offline-capable |
| Evidence-based suggestions       | Differentiation --- not just random habits           |
| 66-day formation arc             | Science-backed motivation mechanic                   |
| 12 languages                     | Broad accessibility without a library                |
| Dark-only theme                  | Simpler CSS, matches habit-tracking UX patterns      |
| Consent-gated analytics          | GDPR compliance, privacy respect                     |

The core philosophy: **do one thing well with zero dependencies**, stay offline-capable, respect user privacy, and ground habit science in real research.
