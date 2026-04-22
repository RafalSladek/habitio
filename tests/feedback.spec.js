// @ts-check
const { test, expect, resetToDefaultState } = require("./test-helpers");

const WORKER_URL = "https://habitio-feedback.rafal-sladek.workers.dev";
const WORKER_ROUTE = "**habitio-feedback.rafal-sladek.workers.dev**";

test.describe("feedback form", () => {
  /** @type {Array<Record<string, any>>} */
  let feedbackRequests = [];

  test.beforeEach(async ({ page }) => {
    feedbackRequests = [];

    // Intercept worker requests so tests run offline and don't create real issues
    await page.route(WORKER_ROUTE, async (route) => {
      const payload = route.request().postData();
      if (payload) feedbackRequests.push(JSON.parse(payload));
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({ url: "https://github.com/RafalSladek/habitio/issues/1", number: 1 }),
      });
    });
    await resetToDefaultState(page, {
      profile: { name: "Test", age: 30, ageGroup: "adult", sex: "male" },
    });
    await page.getByRole("button", { name: /Settings/ }).click();
  });

  test("feedback section is visible in settings", async ({ page }) => {
    await expect(page.locator("#feedback-type")).toBeVisible();
    await expect(page.locator("#feedback-msg")).toBeVisible();
    await expect(page.locator("#feedback-submit")).toBeVisible();
  });

  test("star rating renders 5 buttons", async ({ page }) => {
    const stars = page.locator("#feedback-stars button");
    await expect(stars).toHaveCount(5);
  });

  test("clicking a star highlights it and lower stars", async ({ page }) => {
    await page.locator('#feedback-stars button[data-star="3"]').click();
    const stars = page.locator("#feedback-stars button");
    await expect(stars.nth(0)).toHaveCSS("opacity", "1");
    await expect(stars.nth(1)).toHaveCSS("opacity", "1");
    await expect(stars.nth(2)).toHaveCSS("opacity", "1");
    await expect(stars.nth(3)).toHaveCSS("opacity", "0.25");
    await expect(stars.nth(4)).toHaveCSS("opacity", "0.25");
  });

  test("shows toast when message is too short", async ({ page }) => {
    await page.locator("#feedback-msg").fill("short");
    await page.locator("#feedback-submit").click();
    await expect(page.locator(".toast")).toBeVisible();
  });

  test("submits and shows success toast", async ({ page }) => {
    await page.locator("#feedback-type").selectOption("bug");
    await page.locator('#feedback-stars button[data-star="4"]').click();
    await page.locator("#feedback-msg").fill("This is a test bug report with enough characters.");
    await page.locator("#feedback-submit").click();
    await expect(page.locator(".toast")).toBeVisible();
    // textarea cleared after success
    await expect(page.locator("#feedback-msg")).toHaveValue("");
  });

  test("POSTs correct payload to worker", async ({ page }, testInfo) => {
    // Skip on iPhone 12 due to route interception issues on smaller viewports
    if (testInfo.project.name === "iPhone 12") {
      testInfo.skip();
    }

    await page.locator("#feedback-type").selectOption("wish");
    await page.locator('#feedback-stars button[data-star="5"]').click();
    await page.locator("#feedback-msg").fill("I wish there was a dark mode option for the app.");
    await page.locator("#feedback-submit").click();

    await expect(page.locator(".toast")).toBeVisible();
    await expect.poll(() => feedbackRequests.length, { timeout: 15000 }).toBe(1);

    const [captured] = feedbackRequests;
    expect(captured.type).toBe("wish");
    expect(captured.rating).toBe(5);
    expect(captured.message).toContain("dark mode");
    expect(captured.version).toBeTruthy();
    expect(captured.lang).toBe("en");
  });

  test("shows error toast when worker returns error", async ({ page }) => {
    await page.unroute(WORKER_ROUTE);
    await page.route(WORKER_ROUTE, async (route) => {
      await route.fulfill({ status: 502, body: "Bad Gateway" });
    });

    await page.locator("#feedback-msg").fill("This is a test message that should fail to send.");
    await page.locator("#feedback-submit").click();
    await expect(page.locator(".toast")).toBeVisible();
  });
});
