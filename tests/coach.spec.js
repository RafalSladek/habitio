// @ts-check
const { test, expect, resetToDefaultState } = require("./test-helpers");

const COACH_URL = "https://habitio-feedback.kryptoroger.workers.dev/coach";

function dayOffset(days) {
  return new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
}

test.describe("ai coach", () => {
  test.beforeEach(async ({ page }) => {
    await page.route(COACH_URL, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          feedback: {
            encouragement: "You already have real momentum.",
            candid_feedback:
              "Your progress is solid, but you are relying too much on streak energy.",
            next_steps: [
              "Protect one easy win tomorrow morning.",
              "Shrink the hardest habit for two days.",
              "Review your week on Sunday evening.",
            ],
          },
          budget: {
            requestsUsed: 1,
            requestsLimit: 5,
            estimatedTokensUsed: 650,
            estimatedTokensLimit: 4500,
          },
          model: "@cf/meta/llama-3.1-8b-instruct-fast",
        }),
      });
    });

    await resetToDefaultState(page, {
      profile: { name: "Test", age: 30, ageGroup: "adult", sex: "male" },
      habits: [
        {
          id: "habit-1",
          name: "Walk 20 minutes",
          emoji: "🚶",
          cadence: { type: "daily" },
          morning: true,
          createdAt: dayOffset(25),
        },
        {
          id: "habit-2",
          name: "Read 10 pages",
          emoji: "📚",
          cadence: { type: "daily" },
          morning: false,
          createdAt: dayOffset(12),
        },
      ],
      checks: {
        [dayOffset(0)]: { "habit-1": true },
        [dayOffset(1)]: { "habit-1": true, "habit-2": true },
        [dayOffset(2)]: { "habit-1": true },
      },
      diary: {
        [dayOffset(0)]: {
          grateful: "Sunny walk before work.",
          affirm: "I can keep a simple routine.",
          good: "I finished my reading block.",
          better: "I want a calmer evening.",
        },
      },
    });

    await page.getByRole("button", { name: /Settings/ }).click();
  });

  test("ai coach section is visible in settings", async ({ page }) => {
    await expect(page.locator("#coach-focus")).toBeVisible();
    await expect(page.locator("#coach-include-diary")).toBeVisible();
    await expect(page.locator("#coach-submit")).toBeVisible();
  });

  test("posts a compact summary without diary entries by default", async ({ page }) => {
    let captured;
    await page.route(COACH_URL, async (route) => {
      captured = JSON.parse(route.request().postData() || "{}");
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          feedback: {
            encouragement: "Encouraging.",
            candid_feedback: "Candid.",
            next_steps: ["One", "Two", "Three"],
          },
          budget: {
            requestsUsed: 1,
            requestsLimit: 5,
            estimatedTokensUsed: 700,
            estimatedTokensLimit: 4500,
          },
          model: "@cf/meta/llama-3.1-8b-instruct-fast",
        }),
      });
    });

    await page.locator("#coach-focus").fill("Be especially candid about consistency.");
    await page.locator("#coach-submit").click();

    await expect(page.locator("#coach-result")).toBeVisible();
    expect(captured.focus).toContain("consistency");
    expect(captured.summary.reply_language).toBe("English");
    expect(captured.summary.habits).toHaveLength(2);
    expect(captured.summary.recent_journal).toHaveLength(0);
    expect(captured.summary.last_7_days.completed).toBeGreaterThan(0);
  });

  test("includes recent journal entries when requested", async ({ page }) => {
    let captured;
    await page.route(COACH_URL, async (route) => {
      captured = JSON.parse(route.request().postData() || "{}");
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          feedback: {
            encouragement: "Encouraging.",
            candid_feedback: "Candid.",
            next_steps: ["One"],
          },
          budget: {
            requestsUsed: 1,
            requestsLimit: 5,
            estimatedTokensUsed: 850,
            estimatedTokensLimit: 4500,
          },
          model: "@cf/meta/llama-3.1-8b-instruct-fast",
        }),
      });
    });

    await page.locator("#coach-include-diary").check();
    await page.locator("#coach-submit").click();

    expect(captured.summary.recent_journal).toHaveLength(1);
    expect(captured.summary.recent_journal[0].grateful).toContain("Sunny walk");
  });

  test("shows a toast when the worker budget is exhausted", async ({ page }) => {
    await page.route(COACH_URL, async (route) => {
      await route.fulfill({
        status: 429,
        contentType: "application/json",
        body: JSON.stringify({
          code: "daily_request_limit",
          budget: {
            requestsUsed: 5,
            requestsLimit: 5,
            estimatedTokensUsed: 4200,
            estimatedTokensLimit: 4500,
          },
        }),
      });
    });

    await page.locator("#coach-submit").click();

    await expect(page.locator(".toast")).toBeVisible();
    await expect(page.locator("#coach-submit")).toHaveText(/Ask AI Coach/i);
  });
});
