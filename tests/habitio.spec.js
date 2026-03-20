// @ts-check
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// ── V8 coverage collection for SonarCloud LCOV report ──────────────
// Runs in Chromium only (page.coverage is null in other browsers).
test.beforeEach(async ({ page }) => {
  if (page.coverage) await page.coverage.startJSCoverage({ resetOnNavigation: false });
});
test.afterEach(async ({ page }) => {
  if (!page.coverage) return;
  const entries = await page.coverage.stopJSCoverage();
  const outDir = path.join(__dirname, '..', '.nyc_output');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
    path.join(outDir, `cov-${Date.now()}-${Math.random().toString(36).slice(2)}.json`),
    JSON.stringify(entries)
  );
});

/** @param {import('@playwright/test').Page} page */
async function completeOnboarding(page, name = 'Test') {
  await page.locator('#welcome-name').fill(name);
  await page.locator('.age-chip[onclick*="\'adult\'"]').click();
  await page.locator('#sex-male').click();
  await page.getByRole('button', { name: "Let's go!" }).click();
}

/**
 * Seed localStorage with a single habit whose createdAt is `daysOld` days ago,
 * optionally with `checkedDaysBack` consecutive daily checks ending today.
 */
async function seedHabit(/** @type {import('@playwright/test').Page} */ page, /** @type {number} */ daysOld, checkedDaysBack = 0) {
  await page.evaluate((/** @type {{daysOld: number, checkedDaysBack: number}} */ { daysOld, checkedDaysBack }) => {
    // Remove any pre-seeded v5 so load() will read and migrate from habitio_v2
    localStorage.removeItem('habitio_v5');
    const id = 'test-habit-001';

    // createdAt as YYYY-MM-DD string (same format as fmt() in app.js)
    const created = new Date();
    created.setDate(created.getDate() - daysOld);
    const createdAt = created.toISOString().slice(0, 10);

    // Build checks object: consecutive days from today going back
    /** @type {Record<string, Record<string, boolean>>} */ const checks = {};
    for (let i = 0; i < checkedDaysBack; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      checks[key] = { [id]: true };
    }

    localStorage.setItem('habitio_v2', JSON.stringify({
      profile: { name: 'Test', age: 30, ageGroup: 'adult', sex: 'm' },
      lang: 'en',
      habits: [{
        id,
        name: 'Drink 2L Water',
        emoji: '💧',
        cadence: { type: 'daily' },
        morning: false,
        source: 'suggested',
        createdAt,
      }],
      checks,
      diary: {},
      consentAnalytics: false,
    }));
  }, { daysOld, checkedDaysBack });

  await page.reload();
  await page.waitForLoadState('domcontentloaded');
}

test.describe('habit.io', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
      // Pre-set a valid state so the consent banner doesn't appear in non-consent tests.
      // Must include habits:[] so load() accepts it (checks d && d.habits).
      localStorage.setItem('habitio_v5', JSON.stringify({
        habits: [], checks: {}, diary: {},
        profile: { name: '', age: '', sex: 'male' },
        lang: 'en', kitsDismissed: {},
        consentAnalytics: false,
      }));
    });
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
  });

  test('page loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle('habit.io');
  });

  test('onboarding modal appears on first visit', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Welcome to habit.io' })).toBeVisible();
    await expect(page.getByRole('button', { name: "Let's go!" })).toBeVisible();
  });

  test('onboarding shows age group chips', async ({ page }) => {
    await expect(page.locator('.age-chip', { hasText: '13–17' })).toBeVisible();
    await expect(page.locator('.age-chip', { hasText: '18–29' })).toBeVisible();
    await expect(page.locator('.age-chip[onclick*="\'adult\'"]')).toBeVisible();
    await expect(page.locator('.age-chip', { hasText: '50–64' })).toBeVisible();
    await expect(page.locator('.age-chip', { hasText: '65+' })).toBeVisible();
  });

  test('onboarding age chip selection highlights correctly', async ({ page }) => {
    await page.locator('.age-chip', { hasText: '18–29' }).click();
    await expect(page.locator('.age-chip.selected')).toHaveText('18–29');
  });

  test('onboarding shows language dropdown with all languages', async ({ page }) => {
    const sel = page.locator('.lang-select').first();
    await expect(sel).toBeVisible();
    await expect(sel.locator('option[value="en"]')).toHaveCount(1);
    await expect(sel.locator('option[value="de"]')).toHaveCount(1);
    await expect(sel.locator('option[value="pl"]')).toHaveCount(1);
    await expect(sel.locator('option[value="pt"]')).toHaveCount(1);
    await expect(sel.locator('option[value="fr"]')).toHaveCount(1);
    await expect(sel.locator('option[value="ru"]')).toHaveCount(1);
    await expect(sel.locator('option[value="hi"]')).toHaveCount(1);
  });

  test('onboarding sets personalised greeting', async ({ page }) => {
    await completeOnboarding(page, 'Test');

    await expect(page).toHaveTitle('habit.io');
    await expect(page.locator('text=Test')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Welcome to habit.io' })).not.toBeVisible();
  });

  test.describe('after onboarding', () => {
    test.beforeEach(async ({ page }) => {
      await completeOnboarding(page, 'Test');
    });

    test('add habit panel opens on + click', async ({ page }) => {
      await page.locator('#fab-add').click();
      await expect(page.getByRole('heading', { name: 'New Habit' })).toBeVisible();
      await expect(page.getByText('Health & Body')).toBeVisible();
      await expect(page.getByText('Mind & Focus')).toBeVisible();
      await expect(page.getByText('Productivity')).toBeVisible();
    });

    test('add habit from suggestions list', async ({ page }) => {
      await page.locator('#fab-add').click();
      await page.locator('.suggestion-item', { hasText: 'Drink 2L Water' }).getByText('+').click();
      await page.locator('#modal-done-bar').click();

      await expect(page.locator('.habit-name', { hasText: 'Drink 2L Water' })).toBeVisible();
    });

    test('first habit shows CTA prompt', async ({ page }) => {
      await page.locator('#fab-add').click();
      await page.locator('.suggestion-item', { hasText: 'Drink 2L Water' }).getByText('+').click();
      await page.locator('#modal-done-bar').click();

      await expect(page.locator('.first-habit-cta')).toBeVisible();
    });

    test('check off a habit updates progress to 100%', async ({ page }) => {
      await page.locator('#fab-add').click();
      await page.locator('.suggestion-item', { hasText: 'Drink 2L Water' }).getByText('+').click();
      await page.locator('#modal-done-bar').click();

      await page.locator('.habit-check').click();

      await expect(page.locator('#ring-text')).toHaveText('100%');
    });

    test('journal tab shows step-by-step prompts', async ({ page }) => {
      await page.getByRole('button', { name: '📖 Journal' }).click();

      await expect(page.getByRole('heading', { name: 'Journal' })).toBeVisible();
      // Step 1: gratitude
      await expect(page.getByText('What I am grateful for today')).toBeVisible();
      await expect(page.getByRole('button', { name: /Next/i })).toBeVisible();
      // Advance to step 2
      await page.getByRole('button', { name: /Next/i }).click();
      await expect(page.getByText(/Affirmations/)).toBeVisible();
      // Advance to step 3
      await page.getByRole('button', { name: /Next/i }).click();
      await expect(page.getByText(/3 good things/i)).toBeVisible();
      // Advance to step 4
      await page.getByRole('button', { name: /Next/i }).click();
      await expect(page.getByText(/make this day even better/)).toBeVisible();
    });

    test('stats tab shows key metrics', async ({ page }) => {
      await page.locator('#fab-add').click();
      await page.locator('.suggestion-item', { hasText: 'Drink 2L Water' }).getByText('+').click();
      await page.locator('#modal-done-bar').click();

      await page.getByRole('button', { name: '📊 Stats' }).click();

      await expect(page.getByRole('heading', { name: 'Stats' })).toBeVisible();
      await expect(page.getByText('This Week')).toBeVisible();
      await expect(page.getByText('Best Streak')).toBeVisible();
      await expect(page.getByText('Last 28 Days')).toBeVisible();
      await expect(page.getByText('Habit Performance · 30 Days')).toBeVisible();
    });

    test('settings tab shows profile, habits, data and about sections', async ({ page }) => {
      await page.getByRole('button', { name: '⚙ Settings' }).click();

      await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
      await expect(page.getByText('Profile', { exact: true })).toBeVisible();
      await expect(page.getByText('Data', { exact: true })).toBeVisible();
      await expect(page.getByText('Export Backup')).toBeVisible();
      await expect(page.getByText('Import Backup')).toBeVisible();
      await expect(page.getByText('Reset All Data')).toBeVisible();
      await expect(page.getByText('habit.io v2.0')).toBeVisible();
    });

    test('settings shows saved profile', async ({ page }) => {
      await page.getByRole('button', { name: '⚙ Settings' }).click();
      await expect(page.locator('.setting-label', { hasText: 'Test' })).toBeVisible();
    });

    test('settings habits section has + button to add habit', async ({ page }) => {
      await page.getByRole('button', { name: '⚙ Settings' }).click();
      await page.locator('.settings-title').filter({ hasText: 'Habits' }).getByRole('button', { name: '+' }).click();
      await expect(page.getByRole('heading', { name: 'New Habit' })).toBeVisible();
    });
  });

  test.describe('formation arc', () => {
    // Phase thresholds (from app.js getFormationPhase):
    //   0–19 days  → 🌱 Learning
    //  20–49 days  → 🔨 Building
    //  50–65 days  → ⚡ Forming
    //  66+  days   → ✨ Formed

    test('shows Learning phase for a habit created 5 days ago', async ({ page }) => {
      await seedHabit(page, 5);
      const tag = page.locator('.phase-tag.phase-learning');
      await expect(tag).toBeVisible();
      await expect(tag).toContainText('Learning');
      await expect(tag).toContainText('5d');
    });

    test('shows Building phase for a habit created 25 days ago', async ({ page }) => {
      await seedHabit(page, 25);
      const tag = page.locator('.phase-tag.phase-building');
      await expect(tag).toBeVisible();
      await expect(tag).toContainText('Building');
      await expect(tag).toContainText('25d');
    });

    test('shows Forming phase for a habit created 55 days ago', async ({ page }) => {
      await seedHabit(page, 55);
      const tag = page.locator('.phase-tag.phase-forming');
      await expect(tag).toBeVisible();
      await expect(tag).toContainText('Forming');
      await expect(tag).toContainText('55d');
    });

    test('shows Formed phase for a habit created 70 days ago', async ({ page }) => {
      await seedHabit(page, 70);
      const tag = page.locator('.phase-tag.phase-formed');
      await expect(tag).toBeVisible();
      await expect(tag).toContainText('Formed');
      await expect(tag).toContainText('70d');
    });

    test('formation progress bar reaches 100% at 66+ days in Stats', async ({ page }) => {
      await seedHabit(page, 70);
      await page.getByRole('button', { name: '📊 Stats' }).click();
      await expect(page.locator('.stat-bar-fill[style*="width:100%"]')).toBeVisible();
    });

    test('formation progress bar is partial before 66 days in Stats', async ({ page }) => {
      await seedHabit(page, 33); // 33/66 = 50%
      await page.getByRole('button', { name: '📊 Stats' }).click();
      const bar = page.locator('.stat-card', { hasText: 'Formation Journey' }).locator('.stat-bar-fill');
      await expect(bar).toBeVisible();
      const style = await bar.getAttribute('style');
      expect(style).toContain('width:50%');
    });

    test('streak counter shows 65 consecutive days checked', async ({ page }) => {
      await seedHabit(page, 70, 65); // habit is 70d old, checked last 65 days
      const streakTag = page.locator('.habit-meta').getByText(/65d 🔥/);
      await expect(streakTag).toBeVisible();
    });

    test('streak resets to 0 when yesterday was not checked', async ({ page }) => {
      // Seed with only today checked (gap yesterday)
      await seedHabit(page, 70, 1);
      // Streak should be 1 (only today)
      const streakTag = page.locator('.habit-meta').getByText(/1d 🔥/);
      await expect(streakTag).toBeVisible();
    });

    test('phase transitions correctly at boundary day 20', async ({ page }) => {
      await seedHabit(page, 20);
      await expect(page.locator('.phase-tag.phase-building')).toBeVisible();
      await expect(page.locator('.phase-tag.phase-learning')).not.toBeVisible();
    });

    test('phase transitions correctly at boundary day 66', async ({ page }) => {
      await seedHabit(page, 66);
      await expect(page.locator('.phase-tag.phase-formed')).toBeVisible();
      await expect(page.locator('.phase-tag.phase-forming')).not.toBeVisible();
    });
  });

  test.describe('consent banner', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.evaluate(() => {
        localStorage.clear();
        // Set a named profile so the welcome modal doesn't appear.
        // consentAnalytics: null means the banner should show.
        localStorage.setItem('habitio_v5', JSON.stringify({
          habits: [], checks: {}, diary: {},
          profile: { name: 'Test', age: 30, ageGroup: 'adult', sex: 'male' },
          lang: 'en', kitsDismissed: {},
          consentAnalytics: null,
        }));
      });
      await page.reload();
      await page.waitForLoadState('domcontentloaded');
    });

    test('consent banner appears on first visit before consent is set', async ({ page }) => {
      await expect(page.locator('.consent-banner')).toBeVisible();
      await expect(page.locator('.consent-btn.accept')).toBeVisible();
      await expect(page.locator('.consent-btn.decline')).toBeVisible();
    });

    test('accepting consent hides the banner', async ({ page }) => {
      await page.locator('.consent-btn.accept').click();
      await expect(page.locator('.consent-banner')).not.toBeVisible();
    });

    test('declining consent hides the banner', async ({ page }) => {
      await page.locator('.consent-btn.decline').click();
      await expect(page.locator('.consent-banner')).not.toBeVisible();
    });

    test('consent banner does not reappear after choice is made', async ({ page }) => {
      await page.locator('.consent-btn.decline').click();
      await page.reload();
      await page.waitForLoadState('domcontentloaded');
      await expect(page.locator('.consent-banner')).not.toBeVisible();
    });

    test('accepting consent saves consentAnalytics:true to localStorage', async ({ page }) => {
      await page.locator('.consent-btn.accept').click();
      const saved = await page.evaluate(() => {
        const raw = localStorage.getItem('habitio_v5');
        return raw ? JSON.parse(raw) : null;
      });
      expect(saved?.consentAnalytics).toBe(true);
    });

    test('declining consent saves consentAnalytics:false to localStorage', async ({ page }) => {
      await page.locator('.consent-btn.decline').click();
      const saved = await page.evaluate(() => {
        const raw = localStorage.getItem('habitio_v5');
        return raw ? JSON.parse(raw) : null;
      });
      expect(saved?.consentAnalytics).toBe(false);
    });

    test('no console errors when accepting consent', async ({ page }) => {
      /** @type {string[]} */
      const errors = [];
      page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
      page.on('pageerror', err => errors.push(err.message));
      await page.locator('.consent-btn.accept').click();
      await page.waitForTimeout(300);
      // Ignore known localhost-only noise: GA cookie domain mismatch, gtag, favicon
      const realErrors = errors.filter(e =>
        !e.includes('gtag') && !e.includes('favicon') &&
        !e.includes('_ga') && !e.includes('Cookie') && !e.includes('cookie')
      );
      expect(realErrors).toHaveLength(0);
    });

    test('desktop consent banner is centered in content column', async ({ page }) => {
      // Only meaningful on desktop viewport; skip on mobile/tablet
      const vw = await page.evaluate(() => window.innerWidth);
      if (vw < 900) return;
      const banner = await page.locator('.consent-banner').boundingBox();
      expect(banner).not.toBeNull();
      if (!banner) return;
      // Banner should not overlap the sidebar (200px on 900px+, 240px on 1200px+)
      const sidebarWidth = vw >= 1200 ? 240 : 200;
      expect(banner.x).toBeGreaterThan(sidebarWidth);
      // Banner should be horizontally centered in the content column (within 20px tolerance)
      const contentCenter = sidebarWidth + (vw - sidebarWidth) / 2;
      const bannerCenter = banner.x + banner.width / 2;
      expect(Math.abs(bannerCenter - contentCenter)).toBeLessThan(20);
    });
  });

  test.describe('share button and analytics toggle', () => {
    test.beforeEach(async ({ page }) => {
      await completeOnboarding(page, 'Test');
    });

    test('settings shows Share habit.io button', async ({ page }) => {
      await page.getByRole('button', { name: '⚙ Settings' }).click();
      await expect(page.locator('.setting-label', { hasText: 'Share habit.io' })).toBeVisible();
    });

    test('settings shows analytics toggle', async ({ page }) => {
      await page.getByRole('button', { name: '⚙ Settings' }).click();
      await expect(page.locator('.setting-label', { hasText: /Analytics/ })).toBeVisible();
    });

    test('analytics toggle flips between on and off', async ({ page }) => {
      await page.getByRole('button', { name: '⚙ Settings' }).click();
      const initialText = await page.locator('.setting-label', { hasText: /Analytics/ }).textContent();
      await page.locator('.setting-item', {
        has: page.locator('.setting-label', { hasText: /Analytics/ }),
      }).click();
      await expect(page.locator('.setting-label', { hasText: /Analytics/ })).not.toHaveText(initialText || '');
    });
  });

  // ─────────────────────────────────────────────────────────────────
  // GA4 event tracking
  // Spies on window.dataLayer to verify gtag() calls without relying
  // on network interception (sendBeacon bypasses page.route()).
  // ─────────────────────────────────────────────────────────────────
  test.describe('GA4 event tracking', () => {
    /**
     * Install a dataLayer spy via addInitScript (runs before page scripts).
     * Returns a helper that reads captured gtag() call arrays from the page.
     * Each entry is an array of the arguments passed to gtag(), e.g.
     *   ['event', 'page_view', { page_title: '...' }]
     *   ['set', 'user_properties', { age_group: 'young', ... }]
     * @param {import('@playwright/test').Page} page
     */
    async function spyOnGtag(page) {
      await page.addInitScript(() => {
        /** @type {any} */ (window).__gtagCalls = [];
        // Use a property descriptor to intercept when the inline script assigns
        // `window.dataLayer = window.dataLayer || []`. We let the real array be
        // created naturally, then install a push spy on it. This avoids pre-seeding
        // a non-standard array that can confuse the gtag.js initialisation check.
        let _dl = /** @type {any} */ (undefined);
        const origPush = Array.prototype.push;
        function installSpy(/** @type {any} */ arr) {
          arr.push = function () {
            const item = arguments[0];
            if (item && typeof item === 'object') {
              try { /** @type {any} */ (window).__gtagCalls.push(Array.from(/** @type {any} */ (item))); } catch (_) { /* ignore */ }
            }
            return origPush.apply(this, /** @type {any} */ (arguments));
          };
        }
        Object.defineProperty(window, 'dataLayer', {
          configurable: true,
          get() { return _dl; },
          set(arr) { _dl = arr; if (arr) installSpy(arr); },
        });
      });
      return () => page.evaluate(() => (/** @type {any} */ (window).__gtagCalls || []).slice());
    }

    /** Seed a consented state and reload so GA fires on load.
     * @param {import('@playwright/test').Page} page
     * @param {Record<string,unknown>} [extra]
     */
    async function seedConsented(page, extra = {}) {
      await page.evaluate((/** @type {Record<string,unknown>} */ extra) => {
        localStorage.setItem('habitio_v5', JSON.stringify(Object.assign({
          habits: [], checks: {}, diary: {},
          profile: { name: 'Test', age: '25', ageGroup: 'young', sex: 'male' },
          lang: 'en', kitsDismissed: {},
          consentAnalytics: true,
        }, extra)));
      }, extra);
      await page.reload();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(300);
    }

    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.evaluate(() => localStorage.clear());
    });

    test('no GA events fired before consent', async ({ page }) => {
      const getCalls = await spyOnGtag(page);
      // Fresh visit — consent not yet given
      await page.reload();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(500);
      /** @type {any[]} */ const calls = await getCalls();
      const events = calls.filter(c => c[0] === 'event');
      expect(events).toHaveLength(0);
    });

    test('page_view fired after accepting consent', async ({ page }) => {
      const getCalls = await spyOnGtag(page);
      await page.evaluate(() => {
        localStorage.setItem('habitio_v5', JSON.stringify({
          habits: [], checks: {}, diary: {},
          profile: { name: 'Test', age: 30, ageGroup: 'adult', sex: 'male' },
          lang: 'en', kitsDismissed: {},
          consentAnalytics: null,
        }));
      });
      await page.reload();
      await page.waitForLoadState('domcontentloaded');
      await page.locator('.consent-btn.accept').click();
      await page.waitForTimeout(300);
      /** @type {any[]} */ const calls = await getCalls();
      const pageViews = calls.filter(c => c[0] === 'event' && c[1] === 'page_view');
      expect(pageViews.length).toBeGreaterThanOrEqual(1);
    });

    test('page_view fired on SPA navigation', async ({ page }) => {
      const getCalls = await spyOnGtag(page);
      await seedConsented(page);
      const before = (await getCalls()).length;
      await page.getByRole('button', { name: /Journal/ }).click();
      await page.waitForTimeout(200);
      /** @type {any[]} */ const calls = await getCalls();
      const navPageViews = calls.slice(before).filter(c =>
        c[0] === 'event' && c[1] === 'page_view' &&
        c[2] && typeof c[2].page_title === 'string' && c[2].page_title.includes('Journal')
      );
      expect(navPageViews.length).toBeGreaterThanOrEqual(1);
    });

    test('user properties set with age_group, sex, ui_language', async ({ page }) => {
      const getCalls = await spyOnGtag(page);
      await seedConsented(page);
      /** @type {any[]} */ const calls = await getCalls();
      const userPropCall = calls.find(c =>
        c[0] === 'set' && c[1] === 'user_properties' &&
        c[2] && c[2].age_group === 'young'
      );
      expect(userPropCall).toBeDefined();
      if (userPropCall) {
        expect(userPropCall[2].sex).toBe('male');
        expect(userPropCall[2].ui_language).toBe('en');
      }
    });

    test('habit_add event fired when a habit is added', async ({ page }) => {
      const getCalls = await spyOnGtag(page);
      await seedConsented(page);
      const before = (await getCalls()).length;
      await page.locator('#fab-add').click();
      await page.waitForTimeout(300);
      await page.locator('.suggestion-item').first().click();
      await page.waitForTimeout(300);
      /** @type {any[]} */ const calls = await getCalls();
      const addEvent = calls.slice(before).find(c => c[0] === 'event' && c[1] === 'habit_add');
      expect(addEvent).toBeDefined();
    });

    test('habit_complete event fired when a habit is checked', async ({ page }) => {
      const getCalls = await spyOnGtag(page);
      await seedConsented(page, {
        habits: [{ id: 'h1', name: 'Test Habit', emoji: '🎯',
          cadence: { type: 'daily' }, createdAt: new Date().toISOString().slice(0, 10) }],
      });
      const before = (await getCalls()).length;
      await page.locator('.habit-card').first().click();
      await page.waitForTimeout(200);
      /** @type {any[]} */ const calls = await getCalls();
      const completeEvent = calls.slice(before).find(c => c[0] === 'event' && c[1] === 'habit_complete');
      expect(completeEvent).toBeDefined();
    });

    test('no GA events fired after declining consent', async ({ page }) => {
      const getCalls = await spyOnGtag(page);
      // Seed a named profile so the welcome modal doesn't block navigation,
      // but leave consentAnalytics: null so the consent banner appears.
      await page.evaluate(() => {
        localStorage.setItem('habitio_v5', JSON.stringify({
          habits: [], checks: {}, diary: {},
          profile: { name: 'Test', age: '25', ageGroup: 'young', sex: 'male' },
          lang: 'en', kitsDismissed: {},
          consentAnalytics: null,
        }));
      });
      await page.reload();
      await page.waitForLoadState('domcontentloaded');
      await page.locator('.consent-btn.decline').click();
      await page.waitForTimeout(300);
      const before = (await getCalls()).length;
      await page.getByRole('button', { name: /Stats/ }).click();
      await page.waitForTimeout(200);
      /** @type {any[]} */ const calls = await getCalls();
      const newEvents = calls.slice(before).filter(c => c[0] === 'event');
      expect(newEvents).toHaveLength(0);
    });
  });

  // ─────────────────────────────────────────────────────────────────
  // Export / Import
  // ─────────────────────────────────────────────────────────────────
  test.describe('export / import', () => {
    /** Seed two habits + one check and navigate to Settings. */
    async function seedAndGoToSettings(/** @type {import('@playwright/test').Page} */ page) {
      await page.evaluate(() => {
        localStorage.setItem('habitio_v5', JSON.stringify({
          habits: [
            { id: 'h1', name: 'Drink Water', emoji: '💧', cadence: { type: 'daily' }, createdAt: '2024-01-01' },
            { id: 'h2', name: 'Read', emoji: '📖', cadence: { type: 'daily' }, createdAt: '2024-01-01' },
          ],
          checks: { '2024-01-15': { h1: true } },
          diary: { '2024-01-15': { mood: 4 } },
          profile: { name: 'Test', age: '30', ageGroup: 'adult', sex: 'male' },
          lang: 'en', kitsDismissed: {}, consentAnalytics: false,
        }));
      });
      await page.reload();
      await page.waitForLoadState('domcontentloaded');
      await page.getByRole('button', { name: /Settings/ }).click();
      await page.waitForTimeout(200);
    }

    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.evaluate(() => localStorage.clear());
    });

    test('export downloads a JSON file containing current habits and checks', async ({ page }) => {
      await seedAndGoToSettings(page);
      const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.locator('.setting-item', {
          has: page.locator('.setting-label', { hasText: /Export/ }),
        }).click(),
      ]);
      expect(download.suggestedFilename()).toMatch(/^habitio_backup_\d{4}-\d{2}-\d{2}\.json$/);
      const stream = await download.createReadStream();
      /** @type {Buffer[]} */ const chunks = [];
      for await (const chunk of stream) chunks.push(/** @type {Buffer} */ (chunk));
      const json = JSON.parse(Buffer.concat(chunks).toString());
      expect(json.habits).toHaveLength(2);
      expect(json.habits.map((/** @type {any} */ h) => h.name)).toContain('Drink Water');
      expect(json.checks['2024-01-15'].h1).toBe(true);
    });

    test('import modal opens showing habits and tracking options', async ({ page }) => {
      await seedAndGoToSettings(page);
      await page.locator('.setting-item', {
        has: page.locator('.setting-label', { hasText: /Import/ }),
      }).click();
      await expect(page.locator('#import-modal')).toHaveClass(/show/);
      await expect(page.locator('#import-options')).toContainText('Habits');
      await expect(page.locator('#import-options')).toContainText('Tracking');
      // Cancel closes the modal
      await page.locator('#import-modal').getByRole('button', { name: /Cancel/ }).click();
      await expect(page.locator('#import-modal')).not.toHaveClass(/show/);
    });

    test('import merges new habits and skips duplicates', async ({ page }) => {
      await seedAndGoToSettings(page);
      // "Drink Water" already exists — should not be duplicated.
      // "Meditate" is new — should be added.
      const importData = {
        habits: [
          { id: 'hA', name: 'Drink Water', emoji: '💧', cadence: { type: 'daily' }, createdAt: '2024-01-01' },
          { id: 'hB', name: 'Meditate',    emoji: '🧘', cadence: { type: 'daily' }, createdAt: '2024-06-01' },
        ],
        checks: {}, diary: {},
        profile: { name: 'Test', age: '30', ageGroup: 'adult', sex: 'male' },
        lang: 'en', kitsDismissed: {}, consentAnalytics: false,
      };
      await page.locator('.setting-item', {
        has: page.locator('.setting-label', { hasText: /Import/ }),
      }).click();
      const [fileChooser] = await Promise.all([
        page.waitForEvent('filechooser'),
        page.locator('#import-go-btn').click(),
      ]);
      await fileChooser.setFiles([{
        name: 'backup.json',
        mimeType: 'application/json',
        buffer: Buffer.from(JSON.stringify(importData)),
      }]);
      await expect(page.locator('#import-modal')).not.toHaveClass(/show/);
      const state = await page.evaluate(() => JSON.parse(localStorage.getItem('habitio_v5') || '{}'));
      // 2 original + 1 new (Meditate); Drink Water not duplicated
      expect(state.habits).toHaveLength(3);
      expect(state.habits.map((/** @type {any} */ h) => h.name)).toContain('Meditate');
      expect(state.habits.filter((/** @type {any} */ h) => h.name === 'Drink Water')).toHaveLength(1);
    });

    test('import with invalid JSON shows error toast', async ({ page }) => {
      await seedAndGoToSettings(page);
      await page.locator('.setting-item', {
        has: page.locator('.setting-label', { hasText: /Import/ }),
      }).click();
      const [fileChooser] = await Promise.all([
        page.waitForEvent('filechooser'),
        page.locator('#import-go-btn').click(),
      ]);
      await fileChooser.setFiles([{
        name: 'bad.json',
        mimeType: 'application/json',
        buffer: Buffer.from('not valid json {{{'),
      }]);
      await expect(page.locator('#toast.show')).toBeVisible();
    });

    test('exported file can be re-imported (round-trip)', async ({ page }) => {
      await seedAndGoToSettings(page);
      // Export
      const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.locator('.setting-item', {
          has: page.locator('.setting-label', { hasText: /Export/ }),
        }).click(),
      ]);
      const stream = await download.createReadStream();
      /** @type {Buffer[]} */ const chunks = [];
      for await (const chunk of stream) chunks.push(/** @type {Buffer} */ (chunk));
      const exportedBuffer = Buffer.concat(chunks);

      // Reset to a named profile (no welcome modal) then re-import
      await page.evaluate(() => {
        localStorage.setItem('habitio_v5', JSON.stringify({
          habits: [], checks: {}, diary: {},
          profile: { name: 'Test', age: '30', ageGroup: 'adult', sex: 'male' },
          lang: 'en', kitsDismissed: {}, consentAnalytics: false,
        }));
      });
      await page.reload();
      await page.waitForLoadState('domcontentloaded');
      await page.getByRole('button', { name: /Settings/ }).click();
      await page.waitForTimeout(200);
      await page.locator('.setting-item', {
        has: page.locator('.setting-label', { hasText: /Import/ }),
      }).click();
      const [fileChooser] = await Promise.all([
        page.waitForEvent('filechooser'),
        page.locator('#import-go-btn').click(),
      ]);
      await fileChooser.setFiles([{
        name: 'exported.json',
        mimeType: 'application/json',
        buffer: exportedBuffer,
      }]);
      await expect(page.locator('#import-modal')).not.toHaveClass(/show/);
      const state = await page.evaluate(() => JSON.parse(localStorage.getItem('habitio_v5') || '{}'));
      expect(state.habits).toHaveLength(2);
      expect(state.habits.map((/** @type {any} */ h) => h.name)).toContain('Drink Water');
      // Checks are re-mapped to new habit IDs on import — verify the day has at least one check
      expect(Object.values(state.checks['2024-01-15'] || {}).some(v => v)).toBe(true);
    });
  });
});
