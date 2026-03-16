// @ts-check
const { test, expect } = require('@playwright/test');

/** @param {import('@playwright/test').Page} page */
async function completeOnboarding(page, name = 'Test') {
  await page.locator('#welcome-name').fill(name);
  await page.locator('.age-chip[onclick*="\'adult\'"]').click();
  await page.getByRole('button', { name: "Let's go!" }).click();
}

/**
 * Seed localStorage with a single habit whose createdAt is `daysOld` days ago,
 * optionally with `checkedDaysBack` consecutive daily checks ending today.
 */
async function seedHabit(page, daysOld, checkedDaysBack = 0) {
  await page.evaluate(({ daysOld, checkedDaysBack }) => {
    const id = 'test-habit-001';

    // createdAt as YYYY-MM-DD string (same format as fmt() in app.js)
    const created = new Date();
    created.setDate(created.getDate() - daysOld);
    const createdAt = created.toISOString().slice(0, 10);

    // Build checks object: consecutive days from today going back
    const checks = {};
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
    }));
  }, { daysOld, checkedDaysBack });

  await page.reload();
  await page.waitForLoadState('domcontentloaded');
}

test.describe('habit.io', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
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
    await expect(page.locator('.age-chip', { hasText: 'Teen' })).toBeVisible();
    await expect(page.locator('.age-chip', { hasText: 'Young Adult' })).toBeVisible();
    await expect(page.locator('.age-chip[onclick*="\'adult\'"]')).toBeVisible();
    await expect(page.locator('.age-chip', { hasText: 'Midlife' })).toBeVisible();
    await expect(page.locator('.age-chip', { hasText: 'Senior' })).toBeVisible();
  });

  test('onboarding age chip selection highlights correctly', async ({ page }) => {
    await page.locator('.age-chip', { hasText: 'Young Adult' }).click();
    await expect(page.locator('.age-chip.selected')).toHaveText(/Young Adult/);
  });

  test('onboarding shows language chips with flags', async ({ page }) => {
    await expect(page.locator('.lang-chip', { hasText: '🇬🇧' })).toBeVisible();
    await expect(page.locator('.lang-chip', { hasText: '🇩🇪' })).toBeVisible();
    await expect(page.locator('.lang-chip', { hasText: '🇵🇱' })).toBeVisible();
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
      await page.locator('.header').getByRole('button', { name: '+' }).click();
      await expect(page.getByRole('heading', { name: 'New Habit' })).toBeVisible();
      await expect(page.getByText('Health & Body')).toBeVisible();
      await expect(page.getByText('Mind & Focus')).toBeVisible();
      await expect(page.getByText('Productivity')).toBeVisible();
    });

    test('add habit from suggestions list', async ({ page }) => {
      await page.locator('.header').getByRole('button', { name: '+' }).click();
      await page.locator('.suggestion-item', { hasText: 'Drink 2L Water' }).getByText('+').click();
      await page.getByRole('button', { name: 'Cancel' }).click();

      await expect(page.locator('.habit-name', { hasText: 'Drink 2L Water' })).toBeVisible();
    });

    test('first habit shows CTA prompt', async ({ page }) => {
      await page.locator('.header').getByRole('button', { name: '+' }).click();
      await page.locator('.suggestion-item', { hasText: 'Drink 2L Water' }).getByText('+').click();
      await page.getByRole('button', { name: 'Cancel' }).click();

      await expect(page.locator('.first-habit-cta')).toBeVisible();
    });

    test('check off a habit updates progress to 100%', async ({ page }) => {
      await page.locator('.header').getByRole('button', { name: '+' }).click();
      await page.locator('.suggestion-item', { hasText: 'Drink 2L Water' }).getByText('+').click();
      await page.getByRole('button', { name: 'Cancel' }).click();

      await page.locator('.habit-check').click();

      await expect(page.locator('#ring-text')).toHaveText('100%');
    });

    test('journal tab shows step-by-step prompts', async ({ page }) => {
      await page.getByRole('button', { name: '✎ Journal' }).click();

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
      await page.locator('.header').getByRole('button', { name: '+' }).click();
      await page.locator('.suggestion-item', { hasText: 'Drink 2L Water' }).getByText('+').click();
      await page.getByRole('button', { name: 'Cancel' }).click();

      await page.getByRole('button', { name: '◔ Stats' }).click();

      await expect(page.getByRole('heading', { name: 'Stats' })).toBeVisible();
      await expect(page.getByText('This Week')).toBeVisible();
      await expect(page.getByText('Best Streak')).toBeVisible();
      await expect(page.getByText('Last 28 Days')).toBeVisible();
      await expect(page.getByText('Habit Performance · 30 Days', { exact: true })).toBeVisible();
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
      await page.getByRole('button', { name: '◔ Stats' }).click();
      await expect(page.locator('.stat-bar-fill[style*="width:100%"]')).toBeVisible();
    });

    test('formation progress bar is partial before 66 days in Stats', async ({ page }) => {
      await seedHabit(page, 33); // 33/66 = 50%
      await page.getByRole('button', { name: '◔ Stats' }).click();
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
});
