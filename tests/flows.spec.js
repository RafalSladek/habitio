// @ts-check
const {
  test,
  expect,
  resetToDefaultState,
  completeOnboarding,
  addSuggestedHabit,
} = require("./test-helpers");

test.describe("after onboarding", () => {
  test.beforeEach(async ({ page }) => {
    await resetToDefaultState(page);
    await completeOnboarding(page, "Test");
  });

  test("add habit panel opens on + click", async ({ page }) => {
    await page.locator("#fab-add").click();
    await expect(page.getByRole("heading", { name: "New Habit" })).toBeVisible();
    await expect(page.getByText("Health & Body")).toBeVisible();
    await expect(page.getByText("Mind & Focus")).toBeVisible();
    await expect(page.getByText("Productivity")).toBeVisible();
  });

  test("add habit from suggestions list", async ({ page }) => {
    await addSuggestedHabit(page);
    await expect(page.locator(".habit-name", { hasText: "Drink 2L Water" })).toBeVisible();
  });

  test("first habit shows CTA prompt", async ({ page }) => {
    await addSuggestedHabit(page);
    await expect(page.locator(".first-habit-cta")).toBeVisible();
  });

  test("check off a habit updates progress to 100%", async ({ page }) => {
    await addSuggestedHabit(page);
    await page.locator(".habit-check").click();
    await expect(page.locator("#ring-text")).toHaveText("100%");
  });

  test("journal tab shows step-by-step prompts", async ({ page }) => {
    await page.getByRole("button", { name: "📖 Journal" }).click();

    await expect(page.getByRole("heading", { name: "Journal" })).toBeVisible();
    await expect(page.getByText("What I am grateful for today")).toBeVisible();
    await expect(page.getByRole("button", { name: /Next/i })).toBeVisible();

    await page.getByRole("button", { name: /Next/i }).click();
    await expect(page.getByText(/Affirmations/)).toBeVisible();

    await page.getByRole("button", { name: /Next/i }).click();
    await expect(page.getByText(/3 good things/i)).toBeVisible();
    
    // Mood slider should be present on same page as "3 good things"
    await expect(page.getByText(/How do you feel today/i)).toBeVisible();
    await expect(page.locator(".mood-slider")).toBeVisible();
    
    // Select mood < 5 to see expandable "better" field
    const slider = page.locator(".mood-slider");
    await slider.evaluate((el) => {
      el.value = "3";
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
    });
    
    // Expandable "better" section should appear
    await expect(page.locator(".diary-better-expand")).toBeVisible();
    
    // Click to expand it
    await page.locator(".diary-better-header").click();
    
    // Better textarea should be visible
    await expect(page.locator("#d_better")).toBeVisible();
  });

  test("stats tab shows key metrics", async ({ page }) => {
    await addSuggestedHabit(page);
    await page.getByRole("button", { name: "📊 Stats" }).click();

    await expect(page.getByRole("heading", { name: "Stats" })).toBeVisible();
    await expect(page.getByText("This Week")).toBeVisible();
    await expect(page.getByText("Best Streak")).toBeVisible();
    await expect(page.getByText("Last 28 Days")).toBeVisible();
    await expect(page.getByText("Habit Performance · 30 Days")).toBeVisible();
  });

  test("settings tab shows profile, habits, data and about sections", async ({ page }) => {
    await page.getByRole("button", { name: "⚙ Settings" }).click();

    await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
    await expect(page.getByText("Profile", { exact: true })).toBeVisible();
    await expect(page.getByText("Data", { exact: true })).toBeVisible();
    await expect(page.getByText("Export Backup")).toBeVisible();
    await expect(page.getByText("Import Backup")).toBeVisible();
    await expect(page.getByText("Reset All Data")).toBeVisible();
    await expect(page.getByText("habit.io v2.10")).toBeVisible();
  });

  test("settings shows saved profile", async ({ page }) => {
    await page.getByRole("button", { name: "⚙ Settings" }).click();
    await expect(page.locator(".setting-label", { hasText: "Test" })).toBeVisible();
  });

  test("settings habits section has + button to add habit", async ({ page }) => {
    await page.getByRole("button", { name: "⚙ Settings" }).click();
    await page
      .locator(".settings-title")
      .filter({ hasText: "Habits" })
      .getByRole("button", { name: "+" })
      .click();
    await expect(page.getByRole("heading", { name: "New Habit" })).toBeVisible();
  });
});
