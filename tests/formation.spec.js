// @ts-check
const { test, expect, resetToDefaultState, seedHabit } = require("./test-helpers");

test.describe("formation arc", () => {
  test.beforeEach(async ({ page }) => {
    await resetToDefaultState(page);
  });

  test("shows Learning phase for a habit created 5 days ago", async ({ page }) => {
    await seedHabit(page, 5);
    const tag = page.locator(".phase-tag.phase-learning");
    await expect(tag).toBeVisible();
    await expect(tag).toContainText("Learning");
    await expect(tag).toContainText("5d");
  });

  test("shows Building phase for a habit created 25 days ago", async ({ page }) => {
    await seedHabit(page, 25);
    const tag = page.locator(".phase-tag.phase-building");
    await expect(tag).toBeVisible();
    await expect(tag).toContainText("Building");
    await expect(tag).toContainText("25d");
  });

  test("shows Forming phase for a habit created 55 days ago", async ({ page }) => {
    await seedHabit(page, 55);
    const tag = page.locator(".phase-tag.phase-forming");
    await expect(tag).toBeVisible();
    await expect(tag).toContainText("Forming");
    await expect(tag).toContainText("55d");
  });

  test("shows Formed phase for a habit created 70 days ago", async ({ page }) => {
    await seedHabit(page, 70);
    const tag = page.locator(".phase-tag.phase-formed");
    await expect(tag).toBeVisible();
    await expect(tag).toContainText("Formed");
    await expect(tag).toContainText("70d");
  });

  test("formation progress bar reaches 100% at 66+ days in Stats", async ({ page }) => {
    await seedHabit(page, 70);
    await page.getByRole("button", { name: "📊 Stats" }).click();
    await expect(page.locator('.stat-bar-fill[style*="width:100%"]')).toBeVisible();
  });

  test("formation progress bar is partial before 66 days in Stats", async ({ page }) => {
    await seedHabit(page, 33);
    await page.getByRole("button", { name: "📊 Stats" }).click();
    const bar = page
      .locator(".stat-card", { hasText: "Formation Journey" })
      .locator(".stat-bar-fill");
    await expect(bar).toBeVisible();
    const style = await bar.getAttribute("style");
    expect(style).toContain("width:50%");
  });

  test("streak counter shows 65 consecutive days checked", async ({ page }) => {
    await seedHabit(page, 70, 65);
    const streakTag = page.locator(".habit-meta").getByText(/65d 🔥/);
    await expect(streakTag).toBeVisible();
  });

  test("streak resets to 0 when yesterday was not checked", async ({ page }) => {
    await seedHabit(page, 70, 1);
    const streakTag = page.locator(".habit-meta").getByText(/1d 🔥/);
    await expect(streakTag).toBeVisible();
  });

  test("phase transitions correctly at boundary day 20", async ({ page }) => {
    await seedHabit(page, 20);
    await expect(page.locator(".phase-tag.phase-building")).toBeVisible();
    await expect(page.locator(".phase-tag.phase-learning")).not.toBeVisible();
  });

  test("phase transitions correctly at boundary day 66", async ({ page }) => {
    await seedHabit(page, 66);
    await expect(page.locator(".phase-tag.phase-formed")).toBeVisible();
    await expect(page.locator(".phase-tag.phase-forming")).not.toBeVisible();
  });
});
