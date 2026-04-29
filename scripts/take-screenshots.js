// take-screenshots.js — generates all canonical docs/ screenshots for habit.io
// Usage: node scripts/take-screenshots.js
// Requires a running server at http://localhost:3000

const { chromium } = require("playwright");
const path = require("path");

const BASE_URL = "http://localhost:3000";
const DOCS_DIR = path.join(__dirname, "..", "docs");
const STORAGE_VERSION = "habitio_v10";

// The app uses toISOString().slice(0,10) for date keys (UTC-based).
// We must use the same UTC date so diary/checks align with "today" in the app.
function utcToday() {
  return new Date().toISOString().slice(0, 10);
}
function utcDaysAgo(n) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

const TODAY = utcToday();
const D1 = utcDaysAgo(1);
const D2 = utcDaysAgo(2);
const D3 = utcDaysAgo(3);
const D4 = utcDaysAgo(4);
const D5 = utcDaysAgo(5);
const D6 = utcDaysAgo(6);

// Simple seeded PRNG (mulberry32) for deterministic screenshot data
function seededRng(seed) {
  let s = seed | 0;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Generate checks for a habit over N days with a success rate
function generateChecks(habitId, daysBack, successRate = 0.8) {
  // Seed from habitId for reproducible screenshots
  const seed = habitId.split("").reduce((a, c) => a + c.codePointAt(0), 0);
  const rng = seededRng(seed);
  const checks = {};
  for (let i = 0; i <= daysBack; i++) {
    if (rng() < successRate) {
      const date = utcDaysAgo(i);
      if (!checks[date]) checks[date] = {};
      checks[date][habitId] = true;
    }
  }
  return checks;
}

// Merge multiple check objects
function mergeChecks(...checkObjects) {
  return checkObjects.reduce((acc, obj) => {
    Object.keys(obj).forEach((date) => {
      acc[date] = { ...(acc[date] || {}), ...obj[date] };
    });
    return acc;
  }, {});
}

const SEED_STATE = {
  habits: [
    {
      id: "h1",
      name: "Morning Workout",
      emoji: "💪",
      cadence: { type: "daily" },
      morning: true,
      source: "suggested",
      createdAt: utcDaysAgo(85), // ✨ Mastered (75+ checks over ~85 days)
    },
    {
      id: "h2",
      name: "Drink 2L Water",
      emoji: "💧",
      cadence: { type: "daily" },
      morning: false,
      source: "suggested",
      createdAt: utcDaysAgo(45), // ⚡ Power (35 checks over ~45 days)
    },
    {
      id: "h3",
      name: "Read 30 min",
      emoji: "📚",
      cadence: { type: "daily" },
      morning: false,
      source: "suggested",
      createdAt: utcDaysAgo(20), // 🔨 Building (15 checks over ~20 days)
    },
    {
      id: "h4",
      name: "Meditate",
      emoji: "🧘",
      cadence: { type: "specific_days", days: [1, 2, 3, 4, 5] },
      morning: true,
      source: "custom",
      createdAt: utcDaysAgo(7), // 🌱 Seedling (5 checks over ~7 days)
    },
  ],
  checks: mergeChecks(
    generateChecks("h1", 85, 0.9), // Very consistent
    generateChecks("h2", 45, 0.75), // Good but not perfect
    generateChecks("h3", 20, 0.7), // Building momentum
    generateChecks("h4", 7, 0.65) // Just starting
  ),
  diary: {
    [TODAY]: {
      grateful: "Beautiful sunrise, productive meeting, family dinner",
      affirm: "I am capable, I am focused, I am growing stronger every day",
      good: "Completed workout, finished project milestone, called mom",
      mood: "4",
      better: "Get 8 hours of sleep tonight",
    },
    [D1]: {
      grateful: "Good coffee, finished book, nice weather",
      affirm: "I am resilient and adaptable",
      good: "Morning run, healthy meals, quality time with kids",
      mood: "5",
    },
    [D2]: {
      grateful: "Progress on goals, supportive friends, health",
      affirm: "I trust the process",
      good: "Meditated 20 minutes, cooked healthy dinner, read 40 pages",
      mood: "3",
      better: "Take a break from screens after 9pm",
    },
    [D3]: {
      grateful: "Peaceful morning, good workout, inspiring podcast",
      affirm: "I am exactly where I need to be",
      good: "Hit all habits, great conversation, solved tough problem",
      mood: "4",
      better: "Drink more water throughout the day",
    },
    [D4]: {
      grateful: "Learning opportunities, warm home, creativity",
      affirm: "I embrace challenges as growth",
      good: "Learned new skill, helped colleague, organized workspace",
      mood: "2",
      better: "Set clearer boundaries with work time",
    },
    [D5]: {
      grateful: "Restful sleep, sunshine, laughter with friends",
      affirm: "I am present and mindful",
      good: "Long walk in nature, journaling, stretched 15 min",
      mood: "4",
      better: "Plan weekend activities in advance",
    },
    [D6]: {
      grateful: "New insights, delicious meal, music",
      affirm: "I am worthy of my goals",
      good: "Early morning routine, creative project, connected with mentor",
      mood: "5",
    },
  },
  profile: { name: "Alex", age: "32", ageGroup: "adult", sex: "male" },
  lang: "en",
  kitsDismissed: {},
  consentAnalytics: true, // Dismissed - won't show banner except for consent screenshots
};

async function seedState(page, state) {
  await page.evaluate(
    ([key, value]) => {
      localStorage.setItem(key, JSON.stringify(value));
    },
    [STORAGE_VERSION, state]
  );
}

async function loadWithState(page, state) {
  // Go to page, set state, reload
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  if (state) {
    await seedState(page, state);
  } else {
    await page.evaluate((key) => localStorage.removeItem(key), STORAGE_VERSION);
  }
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(600);
}

async function main() {
  const browser = await chromium.launch({ headless: true });

  try {
    // ─── MOBILE SCREENSHOTS (393×852) ─────────────────────────────────────────
    console.log("\n── Mobile 393×852 ──");

    const mobileCtx = await browser.newContext({
      viewport: { width: 393, height: 852 },
      deviceScaleFactor: 2,
    });
    const mobile = await mobileCtx.newPage();

    // 1. Onboarding — fresh state (no localStorage) — welcome modal shows
    console.log("  screenshot-onboarding.png");
    await loadWithState(mobile, null);
    // welcome-modal gets class "show" when app detects no profile
    await mobile.waitForSelector("#welcome-modal.show", { timeout: 3000 }).catch(() => {});
    await mobile.waitForTimeout(400);
    await mobile.screenshot({ path: path.join(DOCS_DIR, "screenshot-onboarding.png") });

    // 2. Tracker — seeded state, Today tab, full page
    console.log("  screenshot-tracker.png");
    await loadWithState(mobile, SEED_STATE);
    await mobile.waitForSelector("#habits-list", { timeout: 3000 }).catch(() => {});
    await mobile.waitForTimeout(400);
    await mobile.screenshot({ path: path.join(DOCS_DIR, "screenshot-tracker.png"), fullPage: true });

    // 3. Add-habit modal open — 1 habit seeded so FAB is visible, modal scrolled to CTA
    console.log("  screenshot-add-habit.png");
    const stateOneHabit = { ...SEED_STATE, habits: [SEED_STATE.habits[0]] };
    await loadWithState(mobile, stateOneHabit);
    await mobile.click("#fab-add");
    await mobile.waitForSelector("#add-modal.show", { timeout: 3000 }).catch(() => {});
    await mobile.waitForTimeout(400);
    // Scroll the modal to the bottom so the Save CTA button is visible
    await mobile.evaluate(() => {
      const modal = document.querySelector("#add-modal .modal");
      if (modal) modal.scrollTop = modal.scrollHeight;
    });
    await mobile.waitForTimeout(300);
    await mobile.screenshot({ path: path.join(DOCS_DIR, "screenshot-add-habit.png") });

    // 4. Journal — show first step (grateful)
    console.log("  screenshot-journal.png");
    const stateNoDiary = { ...SEED_STATE, diary: {} };
    await loadWithState(mobile, stateNoDiary);
    await mobile.locator(".nav-tab").nth(1).click();
    await mobile.waitForTimeout(600);
    await mobile.screenshot({ path: path.join(DOCS_DIR, "screenshot-journal.png") });

    // 5. Stats page — scroll to show all graphs
    console.log("  screenshot-stats.png");
    await loadWithState(mobile, SEED_STATE);
    await mobile.locator(".nav-tab").nth(2).click();
    await mobile.waitForTimeout(800);
    // Scroll down to show mood trends and other charts
    await mobile.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await mobile.waitForTimeout(400);
    await mobile.screenshot({ path: path.join(DOCS_DIR, "screenshot-stats.png"), fullPage: true });

    // 6. Settings page — full page capture
    console.log("  screenshot-settings.png");
    await loadWithState(mobile, SEED_STATE);
    await mobile.locator(".nav-tab").nth(3).click();
    await mobile.waitForTimeout(600);
    await mobile.screenshot({ path: path.join(DOCS_DIR, "screenshot-settings.png"), fullPage: true });

    await mobileCtx.close();

    // ─── DESKTOP SCREENSHOTS (1280×800) ───────────────────────────────────────
    console.log("\n── Desktop 1280×800 ──");

    const desktopCtx = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 1,
    });
    const desktop = await desktopCtx.newPage();

    // 8. Desktop tracker — full page
    console.log("  desktop-preview.png");
    await loadWithState(desktop, SEED_STATE);
    await desktop.waitForSelector("#habits-list", { timeout: 3000 }).catch(() => {});
    await desktop.waitForTimeout(400);
    await desktop.screenshot({ path: path.join(DOCS_DIR, "desktop-preview.png"), fullPage: true });

    // 9. Desktop stats — scroll to show all graphs
    console.log("  desktop-stats.png");
    await loadWithState(desktop, SEED_STATE);
    await desktop.locator(".nav-tab").nth(2).click();
    await desktop.waitForTimeout(800);
    // Scroll down to show mood trends and other charts
    await desktop.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await desktop.waitForTimeout(400);
    await desktop.screenshot({ path: path.join(DOCS_DIR, "desktop-stats.png"), fullPage: true });

    // 10. Desktop journal (step 1, no diary)
    console.log("  desktop-journal.png");
    await loadWithState(desktop, { ...SEED_STATE, diary: {} });
    await desktop.locator(".nav-tab").nth(1).click();
    await desktop.waitForTimeout(800);
    await desktop.screenshot({ path: path.join(DOCS_DIR, "desktop-journal.png") });

    // 11. Desktop settings — full page capture
    console.log("  desktop-settings.png");
    await loadWithState(desktop, SEED_STATE);
    await desktop.locator(".nav-tab").nth(3).click();
    await desktop.waitForTimeout(600);
    await desktop.screenshot({ path: path.join(DOCS_DIR, "desktop-settings.png"), fullPage: true });

    // 12. Desktop modal (add habit open)
    console.log("  desktop-modal.png");
    await loadWithState(desktop, SEED_STATE);
    await desktop.click("#fab-add");
    await desktop.waitForTimeout(600);
    await desktop.screenshot({ path: path.join(DOCS_DIR, "desktop-modal.png") });

    await desktopCtx.close();

    // ─── TABLET SCREENSHOT (820×1180) ─────────────────────────────────────────
    console.log("\n── Tablet 820×1180 ──");

    const tabletCtx = await browser.newContext({
      viewport: { width: 820, height: 1180 },
      deviceScaleFactor: 2,
    });
    const tablet = await tabletCtx.newPage();

    // 13. Tablet tracker — full page
    console.log("  tablet-preview.png");
    await loadWithState(tablet, SEED_STATE);
    await tablet.waitForSelector("#habits-list", { timeout: 3000 }).catch(() => {});
    await tablet.waitForTimeout(400);
    await tablet.screenshot({ path: path.join(DOCS_DIR, "tablet-preview.png"), fullPage: true });

    await tabletCtx.close();

    console.log("\n✅ All 13 screenshots saved to docs/");
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error("Screenshot script failed:", err);
  process.exit(1);
});
