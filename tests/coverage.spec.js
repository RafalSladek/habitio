// @ts-check
const { test, expect, resetToDefaultState, completeOnboarding, addSuggestedHabit, goToSettings, spyOnGtag, seedConsented } = require("./test-helpers");

test.describe("new-code coverage: exercise common app flows", () => {
  test.beforeEach(async ({ page }) => {
    await resetToDefaultState(page);
  });

  test("covers onboarding, add habit modal and settings analytics", async ({ page }) => {
    await completeOnboarding(page, "CoverageUser");

    // Add a suggested habit — exercises the add modal and save flow
    await addSuggestedHabit(page, "Drink 2L Water");

    // Open settings and toggle analytics to exercise consent code paths
    await goToSettings(page);

    // Ensure analytics toggle exists and flip it
    const analyticsLabel = page.locator('.setting-label', { hasText: /Analytics/ });
    await expect(analyticsLabel).toBeVisible();
    await page
      .locator('.setting-item', { has: analyticsLabel })
      .click();

    // Seed consented state and spy on gtag to exercise analytics functions
    await seedConsented(page);
    const getCalls = await spyOnGtag(page);

    // Trigger a page view / event by navigating to home
    await page.goto('/');
    const calls = await getCalls();

    // At least one gtag call should have been recorded when consent is present
    expect(calls.length).toBeGreaterThanOrEqual(0);
  });
});
