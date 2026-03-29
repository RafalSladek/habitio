// @ts-check
const { test, expect, resetToDefaultState, completeOnboarding } = require("./test-helpers");

test.describe("onboarding", () => {
  test.beforeEach(async ({ page }) => {
    await resetToDefaultState(page);
  });

  test("page loads with correct title", async ({ page }) => {
    await expect(page).toHaveTitle("habit.io");
  });

  test("onboarding modal appears on first visit", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Welcome to habit.io" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Let's go!" })).toBeVisible();
  });

  test("onboarding shows age group chips", async ({ page }) => {
    await expect(page.locator(".age-chip", { hasText: "13–17" })).toBeVisible();
    await expect(page.locator(".age-chip", { hasText: "18–29" })).toBeVisible();
    await expect(page.locator(".age-chip[onclick*=\"'adult'\"]")).toBeVisible();
    await expect(page.locator(".age-chip", { hasText: "50–64" })).toBeVisible();
    await expect(page.locator(".age-chip", { hasText: "65+" })).toBeVisible();
  });

  test("onboarding age chip selection highlights correctly", async ({ page }) => {
    await page.locator(".age-chip", { hasText: "18–29" }).click();
    await expect(page.locator(".age-chip.selected")).toHaveText("18–29");
  });

  test("onboarding shows language dropdown with all languages", async ({ page }) => {
    const sel = page.locator(".lang-select").first();
    await expect(sel).toBeVisible();
    await expect(sel.locator('option[value="en"]')).toHaveCount(1);
    await expect(sel.locator('option[value="de"]')).toHaveCount(1);
    await expect(sel.locator('option[value="pl"]')).toHaveCount(1);
    await expect(sel.locator('option[value="pt"]')).toHaveCount(1);
    await expect(sel.locator('option[value="fr"]')).toHaveCount(1);
    await expect(sel.locator('option[value="ru"]')).toHaveCount(1);
    await expect(sel.locator('option[value="hi"]')).toHaveCount(1);
  });

  test("onboarding sets personalised greeting", async ({ page }) => {
    await completeOnboarding(page, "Test");

    await expect(page).toHaveTitle("habit.io");
    await expect(page.locator("text=Test")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Welcome to habit.io" })).not.toBeVisible();
  });
});
