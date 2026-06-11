# Graph Report - .  (2026-06-11)

## Corpus Check
- 102 files · ~185,052 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 642 nodes · 925 edges · 91 communities (52 shown, 39 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 78 edges (avg confidence: 0.82)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Playwright Test Suite|Playwright Test Suite]]
- [[_COMMUNITY_App Core Logic|App Core Logic]]
- [[_COMMUNITY_Package Configuration|Package Configuration]]
- [[_COMMUNITY_Stats & Mood Rendering|Stats & Mood Rendering]]
- [[_COMMUNITY_CICD & Architecture|CI/CD & Architecture]]
- [[_COMMUNITY_Analytics & Settings|Analytics & Settings]]
- [[_COMMUNITY_Screenshot Generation|Screenshot Generation]]
- [[_COMMUNITY_Cloudflare AI Worker|Cloudflare AI Worker]]
- [[_COMMUNITY_Habit Rendering & Heatmap|Habit Rendering & Heatmap]]
- [[_COMMUNITY_Data Management & Diary|Data Management & Diary]]
- [[_COMMUNITY_Badge Generation|Badge Generation]]
- [[_COMMUNITY_Pagespeed Monitoring|Pagespeed Monitoring]]
- [[_COMMUNITY_Diary & Progress UI|Diary & Progress UI]]
- [[_COMMUNITY_PWA Manifest|PWA Manifest]]
- [[_COMMUNITY_Desktop Stats Screenshots|Desktop Stats Screenshots]]
- [[_COMMUNITY_i18n Fix Scripts|i18n Fix Scripts]]
- [[_COMMUNITY_GIF Generation|GIF Generation]]
- [[_COMMUNITY_Desktop Preview Screenshots|Desktop Preview Screenshots]]
- [[_COMMUNITY_Tablet Layout Screenshots|Tablet Layout Screenshots]]
- [[_COMMUNITY_Mood i18n Scripts|Mood i18n Scripts]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_Community 63|Community 63]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 66|Community 66]]
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 68|Community 68]]
- [[_COMMUNITY_Community 69|Community 69]]
- [[_COMMUNITY_Community 70|Community 70]]
- [[_COMMUNITY_Community 71|Community 71]]
- [[_COMMUNITY_Community 72|Community 72]]
- [[_COMMUNITY_Community 73|Community 73]]
- [[_COMMUNITY_Community 74|Community 74]]
- [[_COMMUNITY_Community 75|Community 75]]
- [[_COMMUNITY_Community 76|Community 76]]
- [[_COMMUNITY_Community 77|Community 77]]
- [[_COMMUNITY_Community 78|Community 78]]
- [[_COMMUNITY_Community 79|Community 79]]
- [[_COMMUNITY_Community 80|Community 80]]
- [[_COMMUNITY_Community 81|Community 81]]
- [[_COMMUNITY_Community 82|Community 82]]
- [[_COMMUNITY_Community 83|Community 83]]
- [[_COMMUNITY_Community 84|Community 84]]
- [[_COMMUNITY_Community 85|Community 85]]
- [[_COMMUNITY_Community 86|Community 86]]
- [[_COMMUNITY_Community 87|Community 87]]
- [[_COMMUNITY_Community 88|Community 88]]
- [[_COMMUNITY_Community 90|Community 90]]

## God Nodes (most connected - your core abstractions)
1. `T` - 39 edges
2. `fmt()` - 23 edges
3. `test` - 19 edges
4. `save()` - 18 edges
5. `resetToDefaultState()` - 18 edges
6. `render()` - 16 edges
7. `trackEvent()` - 12 edges
8. `addD()` - 12 edges
9. `renderStats()` - 12 edges
10. `completeOnboarding()` - 12 edges

## Surprising Connections (you probably didn't know these)
- `CLAUDE.md Project Documentation` --semantically_similar_to--> `README Project Overview`  [INFERRED] [semantically similar]
  CLAUDE.md → README.md
- `cadenceLabel()` --calls--> `T`  [INFERRED]
  app.js → i18n.js
- `getGreeting()` --calls--> `T`  [INFERRED]
  app.js → i18n.js
- `showMotivation()` --calls--> `T`  [INFERRED]
  app.js → i18n.js
- `renderWeekNav()` --calls--> `MN()`  [INFERRED]
  app.js → i18n.js

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Version Sync Constraint (STORAGE_VERSION, CACHE, APP_VERSION, test constants)** — claude_md_version_bump, concept_storage_version, claude_md_pre_commit_checklist [EXTRACTED 1.00]
- **Marketing Asset Pipeline (Screenshots, GIF, Landing Page)** — marketing_skill_md, marketing_landing_page_spec, readme_project_overview [INFERRED 0.85]
- **CI Quality Gate Flow (Test + Sonar + Deploy)** — ci_yml_test_matrix, ci_yml_sonar_gate, ci_yml_github_pages_deploy [EXTRACTED 1.00]

## Communities (91 total, 39 thin omitted)

### Community 0 - "Playwright Test Suite"
Cohesion: 0.06
Nodes (38): { test, expect, resetToDefaultState, completeOnboarding }, {
  test,
  expect,
  STORAGE_VERSION,
  createState,
  openClearedApp,
  spyOnGtag,
  seedConsented,
}, { test, expect, resetToDefaultState }, { test, expect, STORAGE_VERSION, resetToDefaultState }, { test, expect, resetToDefaultState, completeOnboarding, addSuggestedHabit, goToSettings, spyOnGtag, seedConsented }, { test, expect, resetToDefaultState }, {
  test,
  expect,
  resetToDefaultState,
  completeOnboarding,
  addSuggestedHabit,
}, { test, expect, resetToDefaultState, seedHabit } (+30 more)

### Community 1 - "App Core Logic"
Cohesion: 0.05
Nodes (33): AGE_GROUPS, applyDataMigration(), ATOMIC_HABITS, AUDIBLE, buildCoachPayload(), calcProgressWindow(), cleanupOldStorageKeys(), coachLanguageLabel() (+25 more)

### Community 2 - "Package Configuration"
Cohesion: 0.06
Nodes (31): author, bugs, url, description, devDependencies, istanbul-lib-coverage, istanbul-lib-report, istanbul-reports (+23 more)

### Community 3 - "Stats & Mood Rendering"
Cohesion: 0.13
Nodes (28): buildMoodChartHtml(), buildMoodSliderHTML(), calcBestStreak(), checkForUpdate(), esc(), formatCoachTimestamp(), getSuggestions(), getTrackedDayCount() (+20 more)

### Community 4 - "CI/CD & Architecture"
Cohesion: 0.08
Nodes (26): Architecture Documentation, Cloudflare Worker Deploy Job, GitHub Pages Deploy Job, Lighthouse CI Pagespeed Check, CI Pipeline (test + sonar + deploy + pagespeed), SonarCloud Quality Gate (blocking), 4-Browser Test Matrix (Desktop/Mobile/Tablet/iPhone), No Build Step / No Bundler Architecture (+18 more)

### Community 5 - "Analytics & Settings"
Cohesion: 0.14
Nodes (22): applyAnalyticsConsent(), changeLang(), clearAnalyticsCookies(), delHabit(), dismissKit(), ensureAnalyticsBootstrap(), ensureAnalyticsStub(), finishWelcome() (+14 more)

### Community 6 - "Screenshot Generation"
Cohesion: 0.12
Nodes (17): { chromium }, D1, D2, D3, D4, D5, D6, DOCS_DIR (+9 more)

### Community 7 - "Cloudflare AI Worker"
Cohesion: 0.20
Nodes (18): ALLOWED_ORIGINS, budgetCache, budgetKey(), coachLanguageLabel(), corsHeaders(), estimateTokensFromText(), fetch(), getCoachConfig() (+10 more)

### Community 8 - "Habit Rendering & Heatmap"
Cohesion: 0.20
Nodes (18): addD(), buildHabitHtml(), buildHeatmapHtml(), cadenceLabel(), calcHabitStats(), changeWeek(), fmt(), getFormationPhase() (+10 more)

### Community 9 - "Data Management & Diary"
Cohesion: 0.18
Nodes (17): addFromDiary(), addSuggestion(), applyImportData(), applyLang(), closeAddModal(), closeImportModal(), exportData(), getGreeting() (+9 more)

### Community 10 - "Badge Generation"
Cohesion: 0.13
Nodes (13): { execSync }, fs, isIgnored(), normalizeForMatch(), outputDir, outputFile, overallBadge, path (+5 more)

### Community 11 - "Pagespeed Monitoring"
Cohesion: 0.12
Nodes (14): after, { execSync }, files, fs, keep, match, os, path (+6 more)

### Community 12 - "Diary & Progress UI"
Cohesion: 0.20
Nodes (13): buildDiaryDateNav(), dIdx(), isToday(), renderCadDetail(), renderProgress(), setFP(), showMotivation(), togDay() (+5 more)

### Community 13 - "PWA Manifest"
Cohesion: 0.15
Nodes (12): background_color, description, display, icons, id, name, orientation, scope (+4 more)

### Community 14 - "Desktop Stats Screenshots"
Cohesion: 0.27
Nodes (10): Best Streak Card, Coach Reflection Panel, Formation Journey 66 Days Panel, Total Habits Count Card, Habit Performance 30 Days Panel, Last 28 Days Heatmap, Mood Trends Last 7 Days Panel, Desktop Sidebar Navigation (+2 more)

### Community 15 - "i18n Fix Scripts"
Cohesion: 0.20
Nodes (9): content, englishKeys, fs, languageSections, lines, moodKeys, path, sandbox (+1 more)

### Community 16 - "GIF Generation"
Cohesion: 0.20
Nodes (9): CONCAT_FILE, DOCS_DIR, { execSync }, FRAMES, fs, lines, OUTPUT, path (+1 more)

### Community 17 - "Desktop Preview Screenshots"
Cohesion: 0.22
Nodes (9): Fitness Kit Suggestion Panel (Strava, Audible), Desktop Today/Tracker View, Meditate Habit Card (Learning 7d), Mindfulness Kit Suggestion Panel (Calm), Morning Routine Section, Morning Workout Habit Card (Formed 85d), 100% Daily Progress Ring, Desktop Sidebar Navigation (+1 more)

### Community 18 - "Tablet Layout Screenshots"
Cohesion: 0.22
Nodes (9): Drink 2L Water (Restarting 41d, checked), Fitness Kit (Strava + Audible suggestions), Hydration Kit (WaterMinder suggestion), Meditate Habit (Learning 7d, checked), Mindfulness Kit (Calm + Atomic Habits), Morning Workout (Focused 61d, checked), 100% Progress Ring (4/4), Tablet Sidebar Navigation (+1 more)

### Community 19 - "Mood i18n Scripts"
Cohesion: 0.22
Nodes (8): content, fs, languages, lines, moodKeys, moodValues, sandbox, vm

### Community 20 - "Community 20"
Cohesion: 0.25
Nodes (8): { chromium }, DOCS_DIR, frameScreenshot(), fs, main(), MOBILE_FRAMES, OUT_DIR, path

### Community 21 - "Community 21"
Cohesion: 0.29
Nodes (8): buildDiaryProgress(), calcDiaryStep(), changeDiaryDay(), diaryStepGo(), renderDiary(), renderDiarySummary(), setFabVisible(), switchPage()

### Community 22 - "Community 22"
Cohesion: 0.25
Nodes (8): BDNF Science Tip (Cotman & Berchtold), Fitness Kit Suggestion Panel (Strava, Audible), Good Morning Greeting (Alex), Meditate Habit (Specific Days, Learning, checked), Morning Routine Section, Morning Workout Habit (Flame phase, checked), 100% Daily Progress Ring (4/4), Mobile Tracker / Today View

### Community 23 - "Community 23"
Cohesion: 0.25
Nodes (7): content, englishKeys, fs, missingByLanguage, moodKeys, sandbox, vm

### Community 24 - "Community 24"
Cohesion: 0.29
Nodes (7): Add Habit Submit Button, Habit Cadence Selector, Emoji Icon Picker Grid, Habit Name Text Input, James Clear Motivational Quote, Morning Routine Toggle Option, New Habit Modal Dialog

### Community 25 - "Community 25"
Cohesion: 0.29
Nodes (7): Cadence Selector (Daily/Specific Days/X times), Emoji Icon Picker Grid (3x8), Add Habit Modal Screen (Mobile), Morning Routine Toggle, Habit Name Text Input, Quick Start Ideas (6 Categories), Add Habit Purple Submit Button

### Community 26 - "Community 26"
Cohesion: 0.29
Nodes (7): Age Group Selector, Analytics Consent Banner, Onboarding Hero Illustration, Let's Go CTA Button, User Name Input Field, Onboarding Screen (Mobile), Sex Selector (Male/Female/Prefer)

### Community 27 - "Community 27"
Cohesion: 0.29
Nodes (6): content, file, fs, languages, newKeyLines, path

### Community 28 - "Community 28"
Cohesion: 0.29
Nodes (4): fs, path, { test, expect }, vm

### Community 29 - "Community 29"
Cohesion: 0.67
Nodes (6): renderAgeChips(), setAgeGroup(), setSex(), setWelcomeLang(), showWelcome(), validateWelcomeForm()

### Community 30 - "Community 30"
Cohesion: 0.40
Nodes (6): Journal Date Navigation, Gratitude Journal Prompt, Desktop Journal View, Journal Next CTA Button, Desktop Sidebar Navigation, Journal Multi-line Text Input

### Community 31 - "Community 31"
Cohesion: 0.33
Nodes (6): Settings Data Section (Export/Import/Reset), Settings Habits List (4 habits), Language Selector Dropdown (GB English), Settings Profile Section (Alex, 32, Male, GB English), Desktop Settings View, Desktop Sidebar Navigation

### Community 32 - "Community 32"
Cohesion: 0.53
Nodes (6): Age Groups (13-17, 18-29, 30-49, 50-64, 65+), GA4 Analytics Consent Banner (Decline/Allow), Before/After Hero Illustration, Let's Go CTA Button, User Journey Onboarding Flow (Animated GIF), Profile Personalization Form (Name, Age, Sex)

### Community 33 - "Community 33"
Cohesion: 0.33
Nodes (5): content, fs, i18nPath, path, translations

### Community 34 - "Community 34"
Cohesion: 0.33
Nodes (5): fs, path, sandbox, source, vm

### Community 35 - "Community 35"
Cohesion: 0.33
Nodes (5): fs, path, REQUIRED_KEYS, { test, expect }, vm

### Community 36 - "Community 36"
Cohesion: 0.40
Nodes (5): Settings About Section (v2.11, Build dev), Reminders Section (Daily On, 08:00), Reset All Data Button, Desktop Settings with Reminder (v2.11), Desktop Sidebar Navigation

### Community 37 - "Community 37"
Cohesion: 0.60
Nodes (5): Best Streak Card (6 days), 28-Day Heatmap Grid, 30-Day Habit Performance Bars, Mobile Stats View, Weekly Completion Rate (67%)

### Community 38 - "Community 38"
Cohesion: 0.50
Nodes (5): After State (Happy Purple Figure, Celebration), Before State (Dejected Figure, Rain), Onboarding Hero Illustration (Before/After), Progress Arc with Habit Icons (Exercise, Checkbox, Reading, Meditation), Tagline: Small habits. Extraordinary life.

### Community 39 - "Community 39"
Cohesion: 0.50
Nodes (5): After State — Joyful character, stars, positive emojis, Before State — Sedentary figure, phone, rain cloud, Habit Progression Arc (run, check, read, meditate icons), Onboarding Hero Image (WebP format), Tagline: Small habits. Extraordinary life.

### Community 40 - "Community 40"
Cohesion: 0.40
Nodes (4): fs, lines, newKeys, targetLanguages

### Community 42 - "Community 42"
Cohesion: 0.50
Nodes (4): Bottom Navigation Bar (Journal Active), Journal Date Navigation, Mobile Journal View, Journal Reflection Prompts

### Community 43 - "Community 43"
Cohesion: 0.50
Nodes (4): Edit Reflection Button, Habits Worth Trying Suggestions Panel, 3/3 Prompts Answered Confirmation, Journal Reflection Complete State

### Community 44 - "Community 44"
Cohesion: 0.50
Nodes (4): Data Section (Export/Import/Reset All), Habits List Section (4 habits with delete), Profile Section (Alex, 32, Male, GB English), Mobile Settings Screen

### Community 45 - "Community 45"
Cohesion: 0.50
Nodes (4): Let's Go CTA Button, Name Input Field, Onboarding Screen with Language Dropdown Open, Language Dropdown (GB English Open)

### Community 46 - "Community 46"
Cohesion: 0.50
Nodes (4): Settings Data Section (Export/Import/Reset), Language Selection Dropdown, Settings Profile Section, Settings Screen with Language Selection

### Community 47 - "Community 47"
Cohesion: 0.50
Nodes (4): About Section (v2.11, Analytics Off), Feedback Section (Bug Report Form), Reminders Section (Daily Reminder: Off), Settings Screen — Daily Reminder Off (v2.11)

### Community 48 - "Community 48"
Cohesion: 0.50
Nodes (4): About Section (v2.11, Analytics Off), Feedback Section (Bug Report Form), Reminders Section (Daily On, Time 08:00), Settings Screen — Daily Reminder On (08:00)

### Community 49 - "Community 49"
Cohesion: 0.50
Nodes (3): fs, src, translations

### Community 50 - "Community 50"
Cohesion: 0.50
Nodes (3): fs, src, translations

### Community 51 - "Community 51"
Cohesion: 0.50
Nodes (3): content, fs, replacements

## Knowledge Gaps
- **335 isolated node(s):** `{ chromium }`, `fs`, `path`, `DOCS_DIR`, `OUT_DIR` (+330 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **39 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `fetch()` connect `Cloudflare AI Worker` to `Data Management & Diary`, `Stats & Mood Rendering`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Why does `requestCoachFeedback()` connect `Stats & Mood Rendering` to `App Core Logic`, `Analytics & Settings`, `Data Management & Diary`, `Cloudflare AI Worker`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **Why does `T` connect `Stats & Mood Rendering` to `App Core Logic`, `Analytics & Settings`, `Habit Rendering & Heatmap`, `Data Management & Diary`, `Diary & Progress UI`, `Community 21`, `Community 29`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._
- **Are the 38 inferred relationships involving `T` (e.g. with `addFromDiary()` and `applyImportData()`) actually correct?**
  _`T` has 38 INFERRED edges - model-reasoned connections that need verification._
- **What connects `{ chromium }`, `fs`, `path` to the rest of the system?**
  _337 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Playwright Test Suite` be split into smaller, more focused modules?**
  _Cohesion score 0.06346153846153846 - nodes in this community are weakly interconnected._
- **Should `App Core Logic` be split into smaller, more focused modules?**
  _Cohesion score 0.05053191489361702 - nodes in this community are weakly interconnected._