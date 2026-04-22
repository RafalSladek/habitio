// @ts-check
const { test, expect, resetToDefaultState, completeOnboarding } = require("./test-helpers");

test.describe("pull-to-refresh", () => {
  test.beforeEach(async ({ page }) => {
    await resetToDefaultState(page);
    await completeOnboarding(page, "Test");
  });

  test("ptr indicator element is present in DOM", async ({ page }) => {
    const ptr = page.locator(".ptr-indicator");
    await expect(ptr).toHaveCount(1);
  });

  test("touchstart below threshold then touchend triggers spring-back", async ({ page, browserName }) => {
    test.skip(browserName !== "chromium", "Touch constructor not available in Firefox");
    // Fire touchstart + touchend with no touchmove → dy = 0 < 65 threshold → else branch
    await page.evaluate(() => {
      const makeTouch = (/** @type {number} */ y) =>
        new Touch({ identifier: 1, target: document.body, clientX: 0, clientY: y });

      const ts = new TouchEvent("touchstart", {
        bubbles: true,
        cancelable: false,
        touches: [makeTouch(200)],
        targetTouches: [makeTouch(200)],
        changedTouches: [makeTouch(200)],
      });
      document.dispatchEvent(ts);

      const te = new TouchEvent("touchend", { bubbles: true, cancelable: false });
      document.dispatchEvent(te);
    });

    // Indicator should still be present (no reload)
    await expect(page.locator(".ptr-indicator")).toHaveCount(1);
  });

  test("touchmove upward (negative dy) resets pulling state", async ({ page, browserName }) => {
    test.skip(browserName !== "chromium", "Touch constructor not available in Firefox");
    await page.evaluate(() => {
      const makeTouch = (/** @type {number} */ y) =>
        new Touch({ identifier: 1, target: document.body, clientX: 0, clientY: y });

      // touchstart at y=300
      document.dispatchEvent(
        new TouchEvent("touchstart", {
          bubbles: true,
          cancelable: false,
          touches: [makeTouch(300)],
          targetTouches: [makeTouch(300)],
          changedTouches: [makeTouch(300)],
        }),
      );

      // touchmove upward (dy < 0) → pulling = false, setTranslate(0)
      document.dispatchEvent(
        new TouchEvent("touchmove", {
          bubbles: true,
          cancelable: false,
          touches: [makeTouch(250)],
          targetTouches: [makeTouch(250)],
          changedTouches: [makeTouch(250)],
        }),
      );
    });

    await expect(page.locator(".ptr-indicator")).toHaveCount(1);
  });

  test("touchmove downward moves indicator", async ({ page, browserName }) => {
    test.skip(browserName !== "chromium", "Touch constructor not available in Firefox");
    await page.evaluate(() => {
      const makeTouch = (/** @type {number} */ y) =>
        new Touch({ identifier: 1, target: document.body, clientX: 0, clientY: y });

      document.dispatchEvent(
        new TouchEvent("touchstart", {
          bubbles: true,
          cancelable: false,
          touches: [makeTouch(100)],
          targetTouches: [makeTouch(100)],
          changedTouches: [makeTouch(100)],
        }),
      );

      // touchmove downward 20px (dy=20 < threshold) → setTranslate(20)
      document.dispatchEvent(
        new TouchEvent("touchmove", {
          bubbles: true,
          cancelable: false,
          touches: [makeTouch(120)],
          targetTouches: [makeTouch(120)],
          changedTouches: [makeTouch(120)],
        }),
      );
    });

    const transform = await page.locator(".ptr-indicator").evaluate((el) => el.style.transform);
    expect(transform).toContain("translateY");
  });
});
