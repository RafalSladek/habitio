// @ts-check
const {
  test,
  expect,
  STORAGE_VERSION,
  resetToDefaultState,
  completeOnboarding,
} = require("./test-helpers");

/**
 * Grant notification permission by mocking the Notification API.
 * @param {import('@playwright/test').Page} page
 */
async function grantNotificationPermission(page) {
  await page.addInitScript(() => {
    class MockNotification {
      static get permission() {
        return "granted";
      }
      static requestPermission() {
        return Promise.resolve("granted");
      }
    }
    Object.defineProperty(globalThis, "Notification", {
      value: MockNotification,
      writable: true,
      configurable: true,
    });
  });
}

test.describe("daily reminders", () => {
  test.beforeEach(async ({ page }) => {
    await grantNotificationPermission(page);
    await resetToDefaultState(page);
    await completeOnboarding(page, "Test");
    await page.getByRole("button", { name: "⚙ Settings" }).click();
  });

  test("reminder section visible in settings", async ({ page }) => {
    await expect(page.locator(".settings-title", { hasText: "Reminders" })).toBeVisible();
    await expect(page.locator(".setting-label", { hasText: /Daily reminder/i })).toBeVisible();
  });

  test("reminder toggle enables and shows time picker", async ({ page }) => {
    await expect(page.locator(".setting-label", { hasText: "Daily reminder: Off" })).toBeVisible();
    await page
      .locator(".setting-item", {
        has: page.locator(".setting-label", { hasText: /Daily reminder/i }),
      })
      .first()
      .click();
    await expect(page.locator(".setting-label", { hasText: "Daily reminder: On" })).toBeVisible();
    await expect(page.locator('input[type="time"]')).toBeVisible();
  });

  test("reminder toggle disables on second click", async ({ page }) => {
    await page
      .locator(".setting-item", {
        has: page.locator(".setting-label", { hasText: /Daily reminder/i }),
      })
      .first()
      .click();
    await expect(page.locator(".setting-label", { hasText: "Daily reminder: On" })).toBeVisible();
    await page
      .locator(".setting-item", {
        has: page.locator(".setting-label", { hasText: /Daily reminder/i }),
      })
      .first()
      .click();
    await expect(page.locator(".setting-label", { hasText: "Daily reminder: Off" })).toBeVisible();
  });

  test("reminder time picker updates time and persists", async ({ page }) => {
    await page
      .locator(".setting-item", {
        has: page.locator(".setting-label", { hasText: /Daily reminder/i }),
      })
      .first()
      .click();
    const timePicker = page.locator('input[type="time"]');
    await timePicker.fill("09:30");
    await timePicker.dispatchEvent("change");
    const saved = await page.evaluate((key) => {
      const s = JSON.parse(localStorage.getItem(key) || "{}");
      return s.reminder?.time;
    }, STORAGE_VERSION);
    expect(saved).toBe("09:30");
  });

  test("reminder enabled state persists across reload", async ({ page }) => {
    await page
      .locator(".setting-item", {
        has: page.locator(".setting-label", { hasText: /Daily reminder/i }),
      })
      .first()
      .click();
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: "⚙ Settings" }).click();
    await expect(page.locator(".setting-label", { hasText: "Daily reminder: On" })).toBeVisible();
  });
});

test.describe("reminder error paths", () => {
  test("toggleReminder shows alert when Notification API is unavailable", async ({ page }) => {
    await page.addInitScript(() => {
      delete globalThis.Notification;
    });
    await resetToDefaultState(page);
    await completeOnboarding(page, "Test");
    await page.getByRole("button", { name: "⚙ Settings" }).click();
    page.on("dialog", (d) => d.dismiss());
    await page
      .locator(".setting-item", {
        has: page.locator(".setting-label", { hasText: /Daily reminder/i }),
      })
      .first()
      .click();
    await expect(page.locator(".setting-label", { hasText: "Daily reminder: Off" })).toBeVisible();
  });

  test("toggleReminder shows alert when permission is denied", async ({ page }) => {
    await page.addInitScript(() => {
      class DeniedNotification {
        static get permission() {
          return "denied";
        }
        static requestPermission() {
          return Promise.resolve("denied");
        }
      }
      Object.defineProperty(globalThis, "Notification", {
        value: DeniedNotification,
        writable: true,
        configurable: true,
      });
    });
    await resetToDefaultState(page);
    await completeOnboarding(page, "Test");
    await page.getByRole("button", { name: "⚙ Settings" }).click();
    page.on("dialog", (d) => d.dismiss());
    await page
      .locator(".setting-item", {
        has: page.locator(".setting-label", { hasText: /Daily reminder/i }),
      })
      .first()
      .click();
    await expect(page.locator(".setting-label", { hasText: "Daily reminder: Off" })).toBeVisible();
  });

  test("showHabitReminder sends notification via direct Notification API when SW unavailable", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      globalThis.__notifFired = false;
      function TrackingNotif() {
        globalThis.__notifFired = true;
      }
      TrackingNotif.permission = "granted";
      TrackingNotif.requestPermission = () => Promise.resolve("granted");
      Object.defineProperty(globalThis, "Notification", {
        value: TrackingNotif,
        writable: true,
        configurable: true,
      });
    });
    await resetToDefaultState(page);
    await completeOnboarding(page, "Test");
    await page.evaluate(() => {
      Object.defineProperty(navigator, "serviceWorker", { value: {}, configurable: true });
      localStorage.removeItem("habitio_last_reminder");
      showHabitReminder();
    });
    const fired = await page.evaluate(() => globalThis.__notifFired);
    expect(fired).toBe(true);
  });
});
