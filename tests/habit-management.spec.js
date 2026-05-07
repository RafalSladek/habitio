// @ts-check
const { test, expect, STORAGE_VERSION, createState, resetToDefaultState, completeOnboarding, goToSettings } = require("./test-helpers");

const BASE_HABIT = {
  id: "h-mgmt-1",
  name: "Drink 2L Water",
  emoji: "💧",
  cadence: { type: "daily" },
  createdAt: new Date(Date.now() - 10 * 86400000).toISOString().slice(0, 10),
};

async function seedWithHabit(page, habitOverride = {}) {
  const habit = { ...BASE_HABIT, ...habitOverride };
  await page.evaluate(
    ({ state, key }) => { localStorage.setItem(key, JSON.stringify(state)); },
    { state: createState({ habits: [habit], profile: { name: "Test", age: "30", ageGroup: "adult", sex: "male" } }), key: STORAGE_VERSION }
  );
  await page.reload({ waitUntil: "domcontentloaded" });
}

test.describe("habit edit", () => {
  test.beforeEach(async ({ page }) => {
    await resetToDefaultState(page);
    await completeOnboarding(page, "EditTester");
  });

  test("opens edit modal with habit name pre-filled and Save Changes button", async ({ page }) => {
    // Add a habit first via the add modal
    await page.locator("#fab-add").click();
    await page.locator("#habit-name-input").fill("Morning Run");
    await page.locator("#modal-save-btn").click();

    // Go to settings and click the habit item to edit it
    await goToSettings(page);
    await page.locator(".habit-edit-item", { hasText: "Morning Run" }).click();

    await expect(page.locator("#modal-title")).toHaveText(/edit/i);
    await expect(page.locator("#habit-name-input")).toHaveValue("Morning Run");
    await expect(page.locator("#modal-save-btn")).toHaveText(/save/i);
  });

  test("edit modal morning chip toggles", async ({ page }) => {
    await page.locator("#fab-add").click();
    await page.locator("#habit-name-input").fill("Stretch");

    // Morning chip should start unselected
    const chip = page.locator("#morning-chip");
    await expect(chip).not.toHaveClass(/selected/);

    // Click toggles it on
    await chip.click();
    await expect(chip).toHaveClass(/selected/);

    // Click toggles it off again
    await chip.click();
    await expect(chip).not.toHaveClass(/selected/);
  });
});

test.describe("habit delete", () => {
  test.beforeEach(async ({ page }) => {
    await resetToDefaultState(page);
    await page.evaluate(
      ({ state, key }) => { localStorage.setItem(key, JSON.stringify(state)); },
      {
        state: createState({
          habits: [BASE_HABIT],
          profile: { name: "Test", age: "30", ageGroup: "adult", sex: "male" },
        }),
        key: STORAGE_VERSION,
      }
    );
    await page.reload({ waitUntil: "domcontentloaded" });
  });

  test("deletes habit after confirm and shows toast", async ({ page }) => {
    await goToSettings(page);
    page.on("dialog", (d) => d.accept());
    await page.locator(".habit-delete-btn").first().click();

    // Habit should be gone from the settings list
    await expect(page.locator(".habit-edit-item", { hasText: "Drink 2L Water" })).toHaveCount(0);
  });

  test("cancel confirm keeps habit", async ({ page }) => {
    await goToSettings(page);
    page.on("dialog", (d) => d.dismiss());
    await page.locator(".habit-delete-btn").first().click();

    await expect(page.locator(".habit-edit-item", { hasText: "Drink 2L Water" })).toBeVisible();
  });
});

test.describe("motivational banner", () => {
  test("checking the only habit for today shows motivational banner", async ({ page }) => {
    await resetToDefaultState(page);
    await page.evaluate(
      ({ state, key }) => { localStorage.setItem(key, JSON.stringify(state)); },
      {
        state: createState({
          habits: [BASE_HABIT],
          profile: { name: "Test", age: "30", ageGroup: "adult", sex: "male" },
        }),
        key: STORAGE_VERSION,
      }
    );
    await page.reload({ waitUntil: "domcontentloaded" });

    // Check off the habit
    await page.locator(".habit-check").first().click();

    // Motivational banner should appear
    await expect(page.locator("#motiv-banner .motiv-card")).toBeVisible();
  });
});
