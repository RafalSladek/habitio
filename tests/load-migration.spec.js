// @ts-check
const { test, expect } = require("./test-helpers");

const OLD_KEY = "habitio_v9";
const NEW_KEY = "habitio_v11";

/** Ensure `load()` migrates old state keys into the current storage key */
test("migrates old storage key into new key on load", async ({ page }) => {
  // seed an old-format state under OLD_KEY
  await page.goto('/');
  await page.evaluate(({ oldKey }) => {
    localStorage.clear();
    localStorage.setItem(oldKey, JSON.stringify({
      habits: [
        { id: 'migrate-1', name: 'Migrated Habit', emoji: '🔥', cadence: { type: 'daily' }, createdAt: new Date().toISOString().slice(0,10) }
      ],
      profile: { name: 'Legacy', age: 30, sex: 'male' }
    }));
  }, { oldKey: OLD_KEY });

  // Reload app to let `load()` run migration
  await page.reload({ waitUntil: 'domcontentloaded' });

  // Expect new storage key to exist
  const hasNew = await page.evaluate((k) => !!localStorage.getItem(k), NEW_KEY);
  expect(hasNew).toBeTruthy();

  // And the migrated habit should appear in localStorage under the new key
  const migrated = await page.evaluate((k) => {
    const s = JSON.parse(localStorage.getItem(k) || '{}');
    return Array.isArray(s.habits) && s.habits.some(h=>h.id === 'migrate-1');
  }, NEW_KEY);
  expect(migrated).toBeTruthy();
});
