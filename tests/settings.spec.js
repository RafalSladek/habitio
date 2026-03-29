// @ts-check
const { test, expect, resetToDefaultState, completeOnboarding } = require("./test-helpers");

test.describe("share button and analytics toggle", () => {
  test.beforeEach(async ({ page }) => {
    await resetToDefaultState(page);
    await completeOnboarding(page, "Test");
  });

  test("settings shows Share habit.io button", async ({ page }) => {
    await page.getByRole("button", { name: "⚙ Settings" }).click();
    await expect(page.locator(".setting-label", { hasText: "Share habit.io" })).toBeVisible();
  });

  test("settings shows analytics toggle", async ({ page }) => {
    await page.getByRole("button", { name: "⚙ Settings" }).click();
    await expect(page.locator(".setting-label", { hasText: /Analytics/ })).toBeVisible();
  });

  test("analytics toggle flips between on and off", async ({ page }) => {
    await page.getByRole("button", { name: "⚙ Settings" }).click();
    const initialText = await page
      .locator(".setting-label", { hasText: /Analytics/ })
      .textContent();
    await page
      .locator(".setting-item", {
        has: page.locator(".setting-label", { hasText: /Analytics/ }),
      })
      .click();
    await expect(page.locator(".setting-label", { hasText: /Analytics/ })).not.toHaveText(
      initialText || ""
    );
  });
});
