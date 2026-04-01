// @ts-check
const { test, expect, resetToDefaultState } = require("./test-helpers");

test.describe("consent banner", () => {
  test.beforeEach(async ({ page }) => {
    await resetToDefaultState(page, {
      profile: { name: "Test", age: 30, ageGroup: "adult", sex: "male" },
      consentAnalytics: null,
    });
  });

  test("consent banner appears on first visit before consent is set", async ({ page }) => {
    await expect(page.locator(".consent-banner")).toBeVisible();
    await expect(page.locator(".consent-btn.accept")).toHaveText(/Allow analytics/i);
    await expect(page.locator(".consent-btn.decline")).toHaveText(/Decline/i);
  });

  test("accepting consent hides the banner", async ({ page }) => {
    await page.locator(".consent-btn.accept").click();
    await expect(page.locator(".consent-banner")).not.toBeVisible();
  });

  test("declining consent hides the banner", async ({ page }) => {
    await page.locator(".consent-btn.decline").click();
    await expect(page.locator(".consent-banner")).not.toBeVisible();
  });

  test("consent banner does not reappear after choice is made", async ({ page }) => {
    await page.locator(".consent-btn.decline").click();
    await page.reload();
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator(".consent-banner")).not.toBeVisible();
  });

  test("accepting consent saves consentAnalytics:true to localStorage", async ({ page }) => {
    await page.locator(".consent-btn.accept").click();
    const saved = await page.evaluate(() => {
      const raw = localStorage.getItem("habitio_v9");
      return raw ? JSON.parse(raw) : null;
    });
    expect(saved?.consentAnalytics).toBe(true);
  });

  test("declining consent saves consentAnalytics:false to localStorage", async ({ page }) => {
    await page.locator(".consent-btn.decline").click();
    const saved = await page.evaluate(() => {
      const raw = localStorage.getItem("habitio_v9");
      return raw ? JSON.parse(raw) : null;
    });
    expect(saved?.consentAnalytics).toBe(false);
  });

  test("no console errors when accepting consent", async ({ page }) => {
    /** @type {string[]} */
    const errors = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    page.on("pageerror", (err) => errors.push(err.message));

    await page.locator(".consent-btn.accept").click();
    await expect(page.locator(".consent-banner")).not.toBeVisible();

    const realErrors = errors.filter(
      (error) =>
        !error.includes("gtag") &&
        !error.includes("favicon") &&
        !error.includes("_ga") &&
        !error.includes("Cookie") &&
        !error.includes("cookie")
    );
    expect(realErrors).toHaveLength(0);
  });

  test("google tag script is only injected after consent is granted", async ({ page }) => {
    await expect(page.locator('script[src*="gtag/js?id="]')).toHaveCount(0);
    await page.locator(".consent-btn.accept").click();
    await expect(page.locator('script[src*="gtag/js?id="]')).toHaveCount(1);
  });

  test("desktop consent banner is centered in content column", async ({ page }) => {
    const vw = await page.evaluate(() => window.innerWidth);
    if (vw < 900) return;

    const banner = await page.locator(".consent-banner").boundingBox();
    expect(banner).not.toBeNull();
    if (!banner) return;

    const sidebarWidth = vw >= 1200 ? 240 : 200;
    expect(banner.x).toBeGreaterThan(sidebarWidth);

    const contentCenter = sidebarWidth + (vw - sidebarWidth) / 2;
    const bannerCenter = banner.x + banner.width / 2;
    expect(Math.abs(bannerCenter - contentCenter)).toBeLessThan(20);
  });
});
