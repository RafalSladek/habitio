// @ts-check
const { test, expect, resetToDefaultState, completeOnboarding } = require("./test-helpers");

test.describe("Open Add Modal", () => {
  test.beforeEach(async ({ page }) => {
    await resetToDefaultState(page);
    await completeOnboarding(page, "ModalTester");
  });

  test("fab opens add modal and modal can be closed", async ({ page }) => {
    // Open add modal
    await page.locator('#fab-add').click();
    // Modal done bar should be visible (modal opened)
    await expect(page.locator('#modal-done-bar')).toBeVisible();

    // Close modal via done bar
    await page.locator('#modal-done-bar').click();
    await expect(page.locator('#modal-done-bar')).toBeHidden();
  });
});
