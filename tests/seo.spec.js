// @ts-check
const { test, expect } = require("./test-helpers");

test.describe("Open Graph & Twitter Card meta tags", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  const OG_IMAGE = "https://habitio.rafal-sladek.com/docs/desktop-preview.png";
  const TITLE = "habit.io — habit tracker";
  const DESCRIPTION =
    "Improve your life with science-backed habits — personalised, private, and offline-first. No account needed.";

  test("og:type is website", async ({ page }) => {
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "website");
  });

  test("og:url matches canonical", async ({ page }) => {
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", canonical);
  });

  test("og:title", async ({ page }) => {
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", TITLE);
  });

  test("og:description", async ({ page }) => {
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
      "content",
      DESCRIPTION
    );
  });

  test("og:image is an absolute URL", async ({ page }) => {
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", OG_IMAGE);
  });

  test("og:image:width and og:image:height", async ({ page }) => {
    await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute("content", "1280");
    await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute("content", "800");
  });

  test("og:site_name", async ({ page }) => {
    await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute(
      "content",
      "habit.io"
    );
  });

  test("og:locale", async ({ page }) => {
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", "en_US");
  });

  test("twitter:card is summary_large_image", async ({ page }) => {
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image"
    );
  });

  test("twitter:title", async ({ page }) => {
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute("content", TITLE);
  });

  test("twitter:description", async ({ page }) => {
    await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute(
      "content",
      DESCRIPTION
    );
  });

  test("twitter:image", async ({ page }) => {
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute("content", OG_IMAGE);
  });
});
