// @ts-check
const { test, expect } = require('@playwright/test');

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

  test('onboarding sets personalised greeting', async ({ page }) => {
    await page.locator('#welcome-name').fill('Test');
    await page.getByRole('button', { name: "Let's go!" }).click();

    await expect(page.getByRole('heading', { name: 'habit.io' })).toBeVisible();
    await expect(page.locator('text=Test')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Welcome to habit.io' })).not.toBeVisible();
  });

  test.describe('after onboarding', () => {
    test.beforeEach(async ({ page }) => {
      await page.locator('#welcome-name').fill('Test');
      await page.getByRole('button', { name: "Let's go!" }).click();
    });

    test('add habit panel opens on + click', async ({ page }) => {
      await page.getByRole('button', { name: '+' }).click();
      await expect(page.getByRole('heading', { name: 'New Habit' })).toBeVisible();
      await expect(page.getByText('Health & Body')).toBeVisible();
      await expect(page.getByText('Mind & Focus')).toBeVisible();
      await expect(page.getByText('Productivity')).toBeVisible();
    });

    test('add habit from suggestions list', async ({ page }) => {
      await page.getByRole('button', { name: '+' }).click();

      // Click the + button in the row containing "Drink 2L Water"
      await page.locator('.suggestion-item', { hasText: 'Drink 2L Water' }).getByText('+').click();
      await page.getByRole('button', { name: 'Cancel' }).click();

      await expect(page.locator('.habit-name', { hasText: 'Drink 2L Water' })).toBeVisible();
    });

    test('check off a habit updates progress to 100%', async ({ page }) => {
      await page.getByRole('button', { name: '+' }).click();
      await page.locator('.suggestion-item', { hasText: 'Drink 2L Water' }).getByText('+').click();
      await page.getByRole('button', { name: 'Cancel' }).click();

      await page.locator('.habit-check').click();

      await expect(page.locator('#ring-text')).toHaveText('100%');
    });

    test('journal tab shows all four prompts', async ({ page }) => {
      await page.getByRole('button', { name: '✎ Journal' }).click();

      await expect(page.getByRole('heading', { name: 'Journal' })).toBeVisible();
      await expect(page.getByText('What I am grateful for today')).toBeVisible();
      await expect(page.getByText(/Affirmations/)).toBeVisible();
      await expect(page.getByText('3 good things today')).toBeVisible();
      await expect(page.getByText(/make this day even better/)).toBeVisible();
    });

    test('stats tab shows key metrics', async ({ page }) => {
      // Add a habit so stats sections are populated
      await page.getByRole('button', { name: '+' }).click();
      await page.locator('.suggestion-item', { hasText: 'Drink 2L Water' }).getByText('+').click();
      await page.getByRole('button', { name: 'Cancel' }).click();

      await page.getByRole('button', { name: '◔ Stats' }).click();

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
  });
});
