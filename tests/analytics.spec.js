// @ts-check
const {
  test,
  expect,
  createState,
  openClearedApp,
  spyOnGtag,
  seedConsented,
} = require("./test-helpers");

test.describe("GA4 event tracking", () => {
  async function waitForTrackedCall(getCalls, predicate) {
    await expect.poll(async () => (await getCalls()).some(predicate)).toBe(true);
  }

  test.beforeEach(async ({ page }) => {
    await openClearedApp(page);
  });

  test("no GA events fired before consent", async ({ page }) => {
    const getCalls = await spyOnGtag(page);
    await page.evaluate(
      (state) => {
        localStorage.setItem("habitio_v5", JSON.stringify(state));
      },
      createState({
        profile: { name: "Test", age: "25", ageGroup: "young", sex: "male" },
        consentAnalytics: null,
      })
    );
    await page.reload();
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator(".consent-banner")).toBeVisible();

    const calls = await getCalls();
    const events = calls.filter((call) => call[0] === "event");
    expect(events).toHaveLength(0);
  });

  test("page_view fired after accepting consent", async ({ page }) => {
    const getCalls = await spyOnGtag(page);
    await page.evaluate(
      (state) => {
        localStorage.setItem("habitio_v5", JSON.stringify(state));
      },
      createState({
        profile: { name: "Test", age: 30, ageGroup: "adult", sex: "male" },
        consentAnalytics: null,
      })
    );

    await page.reload();
    await page.waitForLoadState("domcontentloaded");
    await page.locator(".consent-btn.accept").click();
    await waitForTrackedCall(getCalls, (call) => call[0] === "event" && call[1] === "page_view");

    const calls = await getCalls();
    const pageViews = calls.filter((call) => call[0] === "event" && call[1] === "page_view");
    expect(pageViews.length).toBeGreaterThanOrEqual(1);
  });

  test("page_view fired on SPA navigation", async ({ page }) => {
    const getCalls = await spyOnGtag(page);
    await seedConsented(page);
    const before = (await getCalls()).length;

    await page.getByRole("button", { name: /Journal/ }).click();
    await expect(page.getByRole("heading", { name: "Journal" })).toBeVisible();
    await waitForTrackedCall(
      getCalls,
      (call) =>
        call[0] === "event" &&
        call[1] === "page_view" &&
        call[2] &&
        typeof call[2].page_title === "string" &&
        call[2].page_title.includes("Journal")
    );

    const calls = await getCalls();
    const navPageViews = calls
      .slice(before)
      .filter(
        (call) =>
          call[0] === "event" &&
          call[1] === "page_view" &&
          call[2] &&
          typeof call[2].page_title === "string" &&
          call[2].page_title.includes("Journal")
      );
    expect(navPageViews.length).toBeGreaterThanOrEqual(1);
  });

  test("user properties set with age_group, sex, ui_language", async ({ page }) => {
    const getCalls = await spyOnGtag(page);
    await seedConsented(page);
    await waitForTrackedCall(
      getCalls,
      (call) =>
        call[0] === "set" &&
        call[1] === "user_properties" &&
        call[2] &&
        call[2].age_group === "young"
    );

    const calls = await getCalls();
    const userPropCall = calls.find(
      (call) =>
        call[0] === "set" &&
        call[1] === "user_properties" &&
        call[2] &&
        call[2].age_group === "young"
    );
    expect(userPropCall).toBeDefined();
    if (userPropCall) {
      expect(userPropCall[2].sex).toBe("male");
      expect(userPropCall[2].ui_language).toBe("en");
    }
  });

  test("habit_add event fired when a habit is added", async ({ page }) => {
    const getCalls = await spyOnGtag(page);
    await seedConsented(page);
    const before = (await getCalls()).length;

    await page.locator("#fab-add").click();
    await expect(page.locator(".suggestion-item").first()).toBeVisible();
    await page.locator(".suggestion-item").first().click();
    await waitForTrackedCall(getCalls, (call) => call[0] === "event" && call[1] === "habit_add");

    const calls = await getCalls();
    const addEvent = calls
      .slice(before)
      .find((call) => call[0] === "event" && call[1] === "habit_add");
    expect(addEvent).toBeDefined();
  });

  test("habit_complete event fired when a habit is checked", async ({ page }) => {
    const getCalls = await spyOnGtag(page);
    await seedConsented(page, {
      habits: [
        {
          id: "h1",
          name: "Test Habit",
          emoji: "🎯",
          cadence: { type: "daily" },
          createdAt: new Date().toISOString().slice(0, 10),
        },
      ],
    });
    const before = (await getCalls()).length;

    await page.locator(".habit-card").first().click();
    await waitForTrackedCall(
      getCalls,
      (call) => call[0] === "event" && call[1] === "habit_complete"
    );

    const calls = await getCalls();
    const completeEvent = calls
      .slice(before)
      .find((call) => call[0] === "event" && call[1] === "habit_complete");
    expect(completeEvent).toBeDefined();
  });

  test("no GA events fired after declining consent", async ({ page }) => {
    const getCalls = await spyOnGtag(page);
    await page.evaluate(
      (state) => {
        localStorage.setItem("habitio_v5", JSON.stringify(state));
      },
      createState({
        profile: { name: "Test", age: "25", ageGroup: "young", sex: "male" },
        consentAnalytics: null,
      })
    );

    await page.reload();
    await page.waitForLoadState("domcontentloaded");
    await page.locator(".consent-btn.decline").click();
    await expect(page.locator(".consent-banner")).not.toBeVisible();
    const before = (await getCalls()).length;

    await page.getByRole("button", { name: /Stats/ }).click();
    await expect(page.getByRole("heading", { name: "Stats" })).toBeVisible();

    const calls = await getCalls();
    const newEvents = calls.slice(before).filter((call) => call[0] === "event");
    expect(newEvents).toHaveLength(0);
  });
});
