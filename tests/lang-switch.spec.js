// @ts-check
const { test, expect, resetToDefaultState, completeOnboarding } = require("./test-helpers");

test.describe("language switching", () => {
  test.beforeEach(async ({ page }) => {
    await resetToDefaultState(page);
    await completeOnboarding(page, "Test");
  });

  const NEW_LANGS = [
    { code: "es", nav: "Hoy" },
    { code: "it", nav: "Oggi" },
    { code: "ro", nav: "Azi" },
    { code: "nl", nav: "Vandaag" },
    { code: "tr", nav: "Bugün" },
    { code: "el", nav: "Σήμερα" },
    { code: "hr", nav: "Danas" },
    { code: "ca", nav: "Avui" },
  ];

  for (const { code, nav } of NEW_LANGS) {
    test(`switching to ${code} translates nav`, async ({ page }) => {
      await page.getByRole("button", { name: /Settings/ }).click();
      await page.locator("#settings-content .lang-select").selectOption(code);
      await expect(page.getByRole("button", { name: nav })).toBeVisible();
    });
  }

  test("settings language selector is native dropdown", async ({ page }) => {
    await page.getByRole("button", { name: /Settings/ }).click();
    const sel = page.locator("#settings-content .lang-select");
    await expect(sel).toBeVisible();
    await expect(sel).toHaveAttribute("onchange");
  });

  test("lang persists after reload", async ({ page }) => {
    await page.getByRole("button", { name: /Settings/ }).click();
    await page.locator("#settings-content .lang-select").selectOption("es");
    await page.goto(page.url(), { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("button", { name: "Hoy" })).toBeVisible();
  });
});
