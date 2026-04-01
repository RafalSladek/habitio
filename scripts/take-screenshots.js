// take-screenshots.js — generates all canonical docs/ screenshots for habit.io
// Usage: node scripts/take-screenshots.js
// Requires a running server at http://localhost:3000

const { chromium } = require('playwright');
const path = require('path');

const BASE_URL = 'http://localhost:3000';
const DOCS_DIR = path.join(__dirname, '..', 'docs');
const STORAGE_KEY = 'habitio_v9';

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

const SEED_STATE = {
  habits: [
    { id: 'h1', name: 'Morning Workout', emoji: '💪', cadence: { type: 'daily' }, morning: true, source: 'suggested', createdAt: '2026-01-10' },
    { id: 'h2', name: 'Drink 2L Water', emoji: '💧', cadence: { type: 'daily' }, morning: false, source: 'suggested', createdAt: '2026-01-10' },
    { id: 'h3', name: 'Read 30 min', emoji: '📚', cadence: { type: 'daily' }, morning: false, source: 'suggested', createdAt: '2026-02-01' },
    { id: 'h4', name: 'Meditate', emoji: '🧘', cadence: { type: 'specific_days', days: [1, 2, 3, 4, 5] }, morning: true, source: 'custom', createdAt: '2026-02-15' }
  ],
  checks: {
    [TODAY]: { h1: true, h2: true },
    [D1]:    { h1: true, h2: true, h3: true, h4: true },
    [D2]:    { h1: true, h3: true },
    [D3]:    { h1: true, h2: true, h3: true },
    [D4]:    { h2: true, h3: true, h4: true }
  },
  diary: {
    [TODAY]: {
      grateful: 'My morning coffee, sunshine, good health',
      affirm: 'I am resilient, I am growing every day',
      good: 'Finished a great workout, read 30 pages, called a friend',
      better: 'Sleep earlier tonight, plan meals for the week'
    }
  },
  profile: { name: 'Alex', age: '32', ageGroup: 'adult', sex: 'male' },
  lang: 'en',
  kitsDismissed: {},
  consentAnalytics: false
};

async function seedState(page, state) {
  await page.evaluate(([key, value]) => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [STORAGE_KEY, state]);
}

async function loadWithState(page, state) {
  // Go to page, set state, reload
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  if (state) {
    await seedState(page, state);
  } else {
    await page.evaluate((key) => localStorage.removeItem(key), STORAGE_KEY);
  }
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
}

async function main() {
  const browser = await chromium.launch({ headless: true });

  try {
    // ─── MOBILE SCREENSHOTS (393×852) ─────────────────────────────────────────
    console.log('\n── Mobile 393×852 ──');

    const mobileCtx = await browser.newContext({
      viewport: { width: 393, height: 852 },
      deviceScaleFactor: 2,
    });
    const mobile = await mobileCtx.newPage();

    // 1. Onboarding — fresh state (no localStorage) — welcome modal shows
    console.log('  screenshot-onboarding.png');
    await loadWithState(mobile, null);
    // welcome-modal gets class "show" when app detects no profile
    await mobile.waitForSelector('#welcome-modal.show', { timeout: 3000 }).catch(() => {});
    await mobile.waitForTimeout(400);
    await mobile.screenshot({ path: path.join(DOCS_DIR, 'screenshot-onboarding.png') });

    // 2. Tracker — seeded state, Today tab
    console.log('  screenshot-tracker.png');
    await loadWithState(mobile, SEED_STATE);
    // Today tab is first nav-tab and active by default
    await mobile.waitForSelector('#habits-list', { timeout: 3000 }).catch(() => {});
    await mobile.waitForTimeout(400);
    await mobile.screenshot({ path: path.join(DOCS_DIR, 'screenshot-tracker.png') });

    // 3. Add-habit modal open — 1 habit seeded so FAB is visible, modal scrolled to CTA
    console.log('  screenshot-add-habit.png');
    const stateOneHabit = { ...SEED_STATE, habits: [SEED_STATE.habits[0]] };
    await loadWithState(mobile, stateOneHabit);
    await mobile.click('#fab-add');
    await mobile.waitForSelector('#add-modal.show', { timeout: 3000 }).catch(() => {});
    await mobile.waitForTimeout(400);
    // Scroll the modal to the bottom so the Save CTA button is visible
    await mobile.evaluate(() => {
      const modal = document.querySelector('#add-modal .modal');
      if (modal) modal.scrollTop = modal.scrollHeight;
    });
    await mobile.waitForTimeout(300);
    await mobile.screenshot({ path: path.join(DOCS_DIR, 'screenshot-add-habit.png') });

    // 4. Journal step 1 (gratitude prompt) — no diary data today
    console.log('  screenshot-journal.png');
    const stateNoDiary = { ...SEED_STATE, diary: {} };
    await loadWithState(mobile, stateNoDiary);
    // Click Journal tab (second nav-tab)
    await mobile.locator('.nav-tab').nth(1).click();
    await mobile.waitForTimeout(600);
    await mobile.screenshot({ path: path.join(DOCS_DIR, 'screenshot-journal.png') });

    // 5. Journal summary — diary data pre-filled for today, so calcDiaryStep()
    //    returns 4 and the summary screen renders immediately on tab switch.
    console.log('  screenshot-journal-summary.png');
    await loadWithState(mobile, SEED_STATE);
    await mobile.locator('.nav-tab').nth(1).click();
    // Wait for the summary div that renders when all 4 diary fields are filled
    await mobile.waitForSelector('.diary-summary', { timeout: 4000 }).catch(() => {});
    await mobile.waitForTimeout(600);
    await mobile.screenshot({ path: path.join(DOCS_DIR, 'screenshot-journal-summary.png') });

    // 6. Stats page
    console.log('  screenshot-stats.png');
    await loadWithState(mobile, SEED_STATE);
    await mobile.locator('.nav-tab').nth(2).click();
    await mobile.waitForTimeout(800);
    await mobile.screenshot({ path: path.join(DOCS_DIR, 'screenshot-stats.png') });

    // 7. Settings page
    console.log('  screenshot-settings.png');
    await loadWithState(mobile, SEED_STATE);
    await mobile.locator('.nav-tab').nth(3).click();
    await mobile.waitForTimeout(600);
    await mobile.screenshot({ path: path.join(DOCS_DIR, 'screenshot-settings.png') });

    // 8. Consent banner — seeded with consentAnalytics: null so the banner appears
    console.log('  screenshot-consent.png');
    const stateConsent = { ...SEED_STATE, consentAnalytics: null };
    await loadWithState(mobile, stateConsent);
    await mobile.waitForSelector('.consent-banner', { timeout: 3000 }).catch(() => {});
    await mobile.waitForTimeout(400);
    await mobile.screenshot({ path: path.join(DOCS_DIR, 'screenshot-consent.png') });

    await mobileCtx.close();

    // ─── DESKTOP SCREENSHOTS (1280×800) ───────────────────────────────────────
    console.log('\n── Desktop 1280×800 ──');

    const desktopCtx = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 1,
    });
    const desktop = await desktopCtx.newPage();

    // 8. Desktop tracker
    console.log('  desktop-preview.png');
    await loadWithState(desktop, SEED_STATE);
    await desktop.waitForSelector('#habits-list', { timeout: 3000 }).catch(() => {});
    await desktop.waitForTimeout(400);
    await desktop.screenshot({ path: path.join(DOCS_DIR, 'desktop-preview.png') });

    // 9. Desktop stats
    console.log('  desktop-stats.png');
    await loadWithState(desktop, SEED_STATE);
    await desktop.locator('.nav-tab').nth(2).click();
    await desktop.waitForTimeout(800);
    await desktop.screenshot({ path: path.join(DOCS_DIR, 'desktop-stats.png') });

    // 10. Desktop journal (step 1, no diary)
    console.log('  desktop-journal.png');
    await loadWithState(desktop, { ...SEED_STATE, diary: {} });
    await desktop.locator('.nav-tab').nth(1).click();
    await desktop.waitForTimeout(800);
    await desktop.screenshot({ path: path.join(DOCS_DIR, 'desktop-journal.png') });

    // 11. Desktop settings
    console.log('  desktop-settings.png');
    await loadWithState(desktop, SEED_STATE);
    await desktop.locator('.nav-tab').nth(3).click();
    await desktop.waitForTimeout(600);
    await desktop.screenshot({ path: path.join(DOCS_DIR, 'desktop-settings.png') });

    // 12. Desktop modal (add habit open)
    console.log('  desktop-modal.png');
    await loadWithState(desktop, SEED_STATE);
    await desktop.click('#fab-add');
    await desktop.waitForTimeout(600);
    await desktop.screenshot({ path: path.join(DOCS_DIR, 'desktop-modal.png') });

    // 13. Desktop consent banner
    console.log('  desktop-consent.png');
    const desktopConsent = { ...SEED_STATE, consentAnalytics: null };
    await loadWithState(desktop, desktopConsent);
    await desktop.waitForSelector('.consent-banner', { timeout: 3000 }).catch(() => {});
    await desktop.waitForTimeout(400);
    await desktop.screenshot({ path: path.join(DOCS_DIR, 'desktop-consent.png') });

    await desktopCtx.close();

    // ─── TABLET SCREENSHOT (820×1180) ─────────────────────────────────────────
    console.log('\n── Tablet 820×1180 ──');

    const tabletCtx = await browser.newContext({
      viewport: { width: 820, height: 1180 },
      deviceScaleFactor: 2,
    });
    const tablet = await tabletCtx.newPage();

    // 13. Tablet tracker
    console.log('  tablet-preview.png');
    await loadWithState(tablet, SEED_STATE);
    await tablet.waitForSelector('#habits-list', { timeout: 3000 }).catch(() => {});
    await tablet.waitForTimeout(400);
    await tablet.screenshot({ path: path.join(DOCS_DIR, 'tablet-preview.png') });

    await tabletCtx.close();

    console.log('\n✅ All 15 screenshots saved to docs/');
  } finally {
    await browser.close();
  }
}

main().catch(err => {
  console.error('Screenshot script failed:', err);
  process.exit(1);
});
