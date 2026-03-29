// @ts-check
const { test: base, expect } = require("@playwright/test");
const fs = require("node:fs");
const path = require("node:path");

const test = base.extend({
  coverageRecorder: [
    async ({ page }, use) => {
      if (page.coverage) await page.coverage.startJSCoverage({ resetOnNavigation: false });
      await use();
      if (!page.coverage) return;

      const entries = await page.coverage.stopJSCoverage();
      const outDir = path.join(__dirname, "..", ".nyc_output");
      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(
        path.join(outDir, `cov-${Date.now()}-${Math.random().toString(36).slice(2)}.json`),
        JSON.stringify(entries)
      );
    },
    { auto: true },
  ],
});

function createState(overrides = {}) {
  const baseState = {
    habits: [],
    checks: {},
    diary: {},
    profile: { name: "", age: "", sex: "male" },
    lang: "en",
    kitsDismissed: {},
    consentAnalytics: false,
  };

  return {
    ...baseState,
    ...overrides,
    profile: {
      ...baseState.profile,
      ...overrides.profile,
    },
  };
}

/** @param {import('@playwright/test').Page} page */
async function openClearedApp(page) {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
}

/**
 * @param {import('@playwright/test').Page} page
 * @param {Record<string, unknown>} [overrides]
 */
async function resetToDefaultState(page, overrides = {}) {
  await page.goto("/");
  await page.evaluate((state) => {
    localStorage.clear();
    localStorage.setItem("habitio_v5", JSON.stringify(state));
  }, createState(overrides));
  await page.reload();
  await page.waitForLoadState("domcontentloaded");
}

/**
 * @param {import('@playwright/test').Page} page
 * @param {string} [name]
 */
async function completeOnboarding(page, name = "Test") {
  await page.locator("#welcome-name").fill(name);
  await page.locator(".age-chip[onclick*=\"'adult'\"]").click();
  await page.locator("#sex-male").click();
  await page.getByRole("button", { name: "Let's go!" }).click();
}

/**
 * @param {import('@playwright/test').Page} page
 * @param {number} daysOld
 * @param {number} [checkedDaysBack]
 */
async function seedHabit(page, daysOld, checkedDaysBack = 0) {
  await page.evaluate(
    ({ daysOld, checkedDaysBack }) => {
      localStorage.removeItem("habitio_v5");
      const id = "test-habit-001";

      const created = new Date();
      created.setDate(created.getDate() - daysOld);
      const createdAt = created.toISOString().slice(0, 10);

      /** @type {Record<string, Record<string, boolean>>} */
      const checks = {};
      for (let i = 0; i < checkedDaysBack; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        checks[key] = { [id]: true };
      }

      localStorage.setItem(
        "habitio_v2",
        JSON.stringify({
          profile: { name: "Test", age: 30, ageGroup: "adult", sex: "m" },
          lang: "en",
          habits: [
            {
              id,
              name: "Drink 2L Water",
              emoji: "💧",
              cadence: { type: "daily" },
              morning: false,
              source: "suggested",
              createdAt,
            },
          ],
          checks,
          diary: {},
          consentAnalytics: false,
        })
      );
    },
    { daysOld, checkedDaysBack }
  );

  await page.reload();
  await page.waitForLoadState("domcontentloaded");
}

/**
 * @param {import('@playwright/test').Page} page
 * @param {string} [name]
 */
async function addSuggestedHabit(page, name = "Drink 2L Water") {
  await page.locator("#fab-add").click();
  await page.locator(".suggestion-item", { hasText: name }).getByText("+").click();
  await page.locator("#modal-done-bar").click();
}

/**
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<() => Promise<any[]>>}
 */
async function spyOnGtag(page) {
  await page.addInitScript(() => {
    /** @type {any[]} */
    globalThis.__gtagCalls = [];

    let dataLayerRef;
    const origPush = Array.prototype.push;

    /**
     * @param {any[]} arr
     */
    function installSpy(arr) {
      arr.push = function () {
        const item = arguments[0];
        if (item && typeof item === "object") {
          try {
            globalThis.__gtagCalls.push(Array.from(item));
          } catch (e) {
            // Ignore malformed analytics payloads in the spy.
            console.debug("spy push error", e);
          }
        }
        return origPush.apply(this, arguments);
      };
    }

    Object.defineProperty(globalThis, "dataLayer", {
      configurable: true,
      get() {
        return dataLayerRef;
      },
      set(arr) {
        dataLayerRef = arr;
        if (arr) installSpy(arr);
      },
    });
  });

  return () => page.evaluate(() => (globalThis.__gtagCalls || []).slice());
}

/**
 * @param {import('@playwright/test').Page} page
 * @param {Record<string, unknown>} [extra]
 */
async function seedConsented(page, extra = {}) {
  await page.evaluate(
    (state) => {
      localStorage.setItem("habitio_v5", JSON.stringify(state));
    },
    createState({
      profile: { name: "Test", age: "25", ageGroup: "young", sex: "male" },
      consentAnalytics: true,
      ...extra,
    })
  );
  await page.reload();
  await page.waitForLoadState("domcontentloaded");
  await expect(page.locator("#fab-add")).toBeVisible();
}

/** @param {import('@playwright/test').Page} page */
async function goToSettings(page) {
  await page.getByRole("button", { name: /Settings/ }).click();
  await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
}

module.exports = {
  test,
  expect,
  createState,
  openClearedApp,
  resetToDefaultState,
  completeOnboarding,
  seedHabit,
  addSuggestedHabit,
  spyOnGtag,
  seedConsented,
  goToSettings,
};
