// @ts-check
const { test, expect, createState, openClearedApp, goToSettings } = require("./test-helpers");

/**
 * @param {import('@playwright/test').Page} page
 */
async function seedAndGoToSettings(page) {
  await page.evaluate(
    (state) => {
      localStorage.setItem("habitio_v5", JSON.stringify(state));
    },
    createState({
      habits: [
        {
          id: "h1",
          name: "Drink Water",
          emoji: "💧",
          cadence: { type: "daily" },
          createdAt: "2024-01-01",
        },
        {
          id: "h2",
          name: "Read",
          emoji: "📖",
          cadence: { type: "daily" },
          createdAt: "2024-01-01",
        },
      ],
      checks: { "2024-01-15": { h1: true } },
      diary: { "2024-01-15": { mood: 4 } },
      profile: { name: "Test", age: "30", ageGroup: "adult", sex: "male" },
    })
  );

  await page.reload();
  await page.waitForLoadState("domcontentloaded");
  await goToSettings(page);
}

test.describe("export / import", () => {
  test.beforeEach(async ({ page }) => {
    await openClearedApp(page);
  });

  test("export downloads a JSON file containing current habits and checks", async ({ page }) => {
    await seedAndGoToSettings(page);
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page
        .locator(".setting-item", {
          has: page.locator(".setting-label", { hasText: /Export/ }),
        })
        .click(),
    ]);

    expect(download.suggestedFilename()).toMatch(/^habitio_backup_\d{4}-\d{2}-\d{2}\.json$/);

    const stream = await download.createReadStream();
    /** @type {Buffer[]} */
    const chunks = [];
    for await (const chunk of stream) chunks.push(/** @type {Buffer} */ (chunk));

    const json = JSON.parse(Buffer.concat(chunks).toString());
    expect(json.habits).toHaveLength(2);
    expect(json.habits.map((habit) => habit.name)).toContain("Drink Water");
    expect(json.checks["2024-01-15"].h1).toBe(true);
  });

  test("import modal opens showing habits and tracking options", async ({ page }) => {
    await seedAndGoToSettings(page);
    await page
      .locator(".setting-item", {
        has: page.locator(".setting-label", { hasText: /Import/ }),
      })
      .click();

    await expect(page.locator("#import-modal")).toHaveClass(/show/);
    await expect(page.locator("#import-options")).toContainText("Habits");
    await expect(page.locator("#import-options")).toContainText("Tracking");

    await page
      .locator("#import-modal")
      .getByRole("button", { name: /Cancel/ })
      .click();
    await expect(page.locator("#import-modal")).not.toHaveClass(/show/);
  });

  test("import merges new habits and skips duplicates", async ({ page }) => {
    await seedAndGoToSettings(page);
    const importData = {
      habits: [
        {
          id: "hA",
          name: "Drink Water",
          emoji: "💧",
          cadence: { type: "daily" },
          createdAt: "2024-01-01",
        },
        {
          id: "hB",
          name: "Meditate",
          emoji: "🧘",
          cadence: { type: "daily" },
          createdAt: "2024-06-01",
        },
      ],
      checks: {},
      diary: {},
      profile: { name: "Test", age: "30", ageGroup: "adult", sex: "male" },
      lang: "en",
      kitsDismissed: {},
      consentAnalytics: false,
    };

    await page
      .locator(".setting-item", {
        has: page.locator(".setting-label", { hasText: /Import/ }),
      })
      .click();

    const [fileChooser] = await Promise.all([
      page.waitForEvent("filechooser"),
      page.locator("#import-go-btn").click(),
    ]);

    await fileChooser.setFiles([
      {
        name: "backup.json",
        mimeType: "application/json",
        buffer: Buffer.from(JSON.stringify(importData)),
      },
    ]);

    await expect(page.locator("#import-modal")).not.toHaveClass(/show/);
    const state = await page.evaluate(() => JSON.parse(localStorage.getItem("habitio_v5") || "{}"));

    expect(state.habits).toHaveLength(3);
    expect(state.habits.map((habit) => habit.name)).toContain("Meditate");
    expect(state.habits.filter((habit) => habit.name === "Drink Water")).toHaveLength(1);
  });

  test("import with invalid JSON shows error toast", async ({ page }) => {
    await seedAndGoToSettings(page);
    await page
      .locator(".setting-item", {
        has: page.locator(".setting-label", { hasText: /Import/ }),
      })
      .click();

    const [fileChooser] = await Promise.all([
      page.waitForEvent("filechooser"),
      page.locator("#import-go-btn").click(),
    ]);

    await fileChooser.setFiles([
      {
        name: "bad.json",
        mimeType: "application/json",
        buffer: Buffer.from("not valid json {{{"),
      },
    ]);

    await expect(page.locator("#toast.show")).toBeVisible();
  });

  test("exported file can be re-imported (round-trip)", async ({ page }) => {
    await seedAndGoToSettings(page);

    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page
        .locator(".setting-item", {
          has: page.locator(".setting-label", { hasText: /Export/ }),
        })
        .click(),
    ]);

    const stream = await download.createReadStream();
    /** @type {Buffer[]} */
    const chunks = [];
    for await (const chunk of stream) chunks.push(/** @type {Buffer} */ (chunk));
    const exportedBuffer = Buffer.concat(chunks);

    await page.evaluate(
      (state) => {
        localStorage.setItem("habitio_v5", JSON.stringify(state));
      },
      createState({
        profile: { name: "Test", age: "30", ageGroup: "adult", sex: "male" },
      })
    );

    await page.reload();
    await page.waitForLoadState("domcontentloaded");
    await goToSettings(page);
    await page
      .locator(".setting-item", {
        has: page.locator(".setting-label", { hasText: /Import/ }),
      })
      .click();

    const [fileChooser] = await Promise.all([
      page.waitForEvent("filechooser"),
      page.locator("#import-go-btn").click(),
    ]);

    await fileChooser.setFiles([
      {
        name: "exported.json",
        mimeType: "application/json",
        buffer: exportedBuffer,
      },
    ]);

    await expect(page.locator("#import-modal")).not.toHaveClass(/show/);
    const state = await page.evaluate(() => JSON.parse(localStorage.getItem("habitio_v5") || "{}"));
    expect(state.habits).toHaveLength(2);
    expect(state.habits.map((habit) => habit.name)).toContain("Drink Water");
    expect(Object.values(state.checks["2024-01-15"] || {}).some((value) => value)).toBe(true);
  });
});
