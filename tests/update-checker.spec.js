// @ts-check
const { test, expect, resetToDefaultState, completeOnboarding } = require("./test-helpers");

// Same length as "__BUILD_SHA__" (13 chars) keeps V8 coverage byte-offsets aligned on Chromium
const FAKE_SHA = "abc123def4567";
const OTHER_SHA = "newsha999abc00";

/**
 * Inject a minimal #update-row / #update-label / #update-action scaffold into
 * the live DOM so checkForUpdate() has elements to update. Works on all browsers
 * without depending on SHA injection or service-worker route interception.
 */
async function injectUpdateRowDOM(page) {
  await page.evaluate(() => {
    document.getElementById("update-row")?.remove();
    const row = document.createElement("div");
    row.id = "update-row";
    const label = document.createElement("span");
    label.id = "update-label";
    const action = document.createElement("span");
    action.id = "update-action";
    row.appendChild(label);
    row.appendChild(action);
    document.body.appendChild(row);
  });
}

async function goToSettings(page) {
  await resetToDefaultState(page);
  await completeOnboarding(page, "Test");
  await page.getByRole("button", { name: "⚙ Settings" }).click();
  await page.waitForTimeout(300);
}

// ── Live route tests (Chromium only — context.route does not intercept SW fetches in Firefox/WebKit) ──

test.describe("update checker — live route (SHA injection)", () => {
  // Coverage collection only runs on Chromium; these tests exist to hit the renderSettings branch
  // that checks BUILD_SHA. Firefox/WebKit cannot intercept SW-proxied fetches via context.route.
  test.skip(({ browserName }) => browserName !== "chromium", "SHA injection via context.route requires Chromium");

  test("shows checking state while fetch is pending", async ({ page }) => {
    // Use context.route so SW-proxied fetches are also intercepted on Chromium
    await page.context().route(/\/app\.js/, async (route) => {
      const url = route.request().url();
      if (url.includes("?_v=")) {
        return; // Never fulfill → stays "checking"
      }
      const response = await route.fetch();
      const body = await response.text();
      await route.fulfill({
        response,
        body: body.replace('const BUILD_SHA = "__BUILD_SHA__"', `const BUILD_SHA = "${FAKE_SHA}"`),
      });
    });

    await goToSettings(page);

    await expect(page.locator("#update-label")).toBeVisible();
    await expect(page.locator("#update-label")).toHaveText("Checking for updates…");
  });

  test("shows up to date when server SHA matches", async ({ page }) => {
    await page.context().route(/\/app\.js/, async (route) => {
      const url = route.request().url();
      if (url.includes("?_v=")) {
        await route.fulfill({
          status: 200,
          contentType: "application/javascript",
          body: `const BUILD_SHA = "${FAKE_SHA}";`,
        });
        return;
      }
      const response = await route.fetch();
      const body = await response.text();
      await route.fulfill({
        response,
        body: body.replace('const BUILD_SHA = "__BUILD_SHA__"', `const BUILD_SHA = "${FAKE_SHA}"`),
      });
    });

    await goToSettings(page);

    await expect(page.locator("#update-label")).toHaveText("Up to date", { timeout: 5000 });
    await expect(page.locator("#update-action")).toHaveText("✓");
  });

  test("shows update available when server SHA differs", async ({ page }) => {
    await page.context().route(/\/app\.js/, async (route) => {
      const url = route.request().url();
      if (url.includes("?_v=")) {
        await route.fulfill({
          status: 200,
          contentType: "application/javascript",
          body: `const BUILD_SHA = "${OTHER_SHA}";`,
        });
        return;
      }
      const response = await route.fetch();
      const body = await response.text();
      await route.fulfill({
        response,
        body: body.replace('const BUILD_SHA = "__BUILD_SHA__"', `const BUILD_SHA = "${FAKE_SHA}"`),
      });
    });

    await goToSettings(page);

    await expect(page.locator("#update-label")).toHaveText("Update available", { timeout: 5000 });
    await expect(page.locator("#update-action")).toHaveText("Update");
    await expect(page.locator("#update-row")).toHaveAttribute("onclick", "forceUpdate()");
  });

  test("hides update row when fetch returns error", async ({ page }) => {
    await page.context().route(/\/app\.js/, async (route) => {
      const url = route.request().url();
      if (url.includes("?_v=")) {
        await route.fulfill({ status: 500, body: "error" });
        return;
      }
      const response = await route.fetch();
      const body = await response.text();
      await route.fulfill({
        response,
        body: body.replace('const BUILD_SHA = "__BUILD_SHA__"', `const BUILD_SHA = "${FAKE_SHA}"`),
      });
    });

    await goToSettings(page);

    await expect(page.locator("#update-row")).toBeHidden({ timeout: 5000 });
  });
});

// ── Evaluate-based tests (all browsers; verify function logic directly) ─────────

test.describe("update checker — direct function calls", () => {
  test.beforeEach(async ({ page }) => {
    await goToSettings(page);
    await injectUpdateRowDOM(page);
  });

  test("checkForUpdate marks up-to-date when SHA matches", async ({ page }) => {
    const result = await page.evaluate(async () => {
      const origFetch = window.fetch;
      // Return the same SHA that app.js has ("__BUILD_SHA__" in dev)
      window.fetch = async (url) => {
        if (String(url).includes("?_v="))
          return new Response('const BUILD_SHA = "__BUILD_SHA__";', { status: 200 });
        return origFetch.call(window, url);
      };
      await window.checkForUpdate();
      window.fetch = origFetch;
      return {
        label: document.getElementById("update-label")?.textContent,
        action: document.getElementById("update-action")?.textContent,
      };
    });

    expect(result.label).toBe("Up to date");
    expect(result.action).toBe("✓");
  });

  test("checkForUpdate marks available when SHA differs", async ({ page }) => {
    const result = await page.evaluate(async () => {
      const origFetch = window.fetch;
      window.fetch = async (url) => {
        if (String(url).includes("?_v="))
          return new Response('const BUILD_SHA = "differentsha000";', { status: 200 });
        return origFetch.call(window, url);
      };
      await window.checkForUpdate();
      window.fetch = origFetch;
      const row = document.getElementById("update-row");
      return {
        label: document.getElementById("update-label")?.textContent,
        action: document.getElementById("update-action")?.textContent,
        onclick: row?.getAttribute("onclick"),
      };
    });

    expect(result.label).toBe("Update available");
    expect(result.action).toBe("Update");
    expect(result.onclick).toBe("forceUpdate()");
  });

  test("checkForUpdate hides row on fetch error", async ({ page }) => {
    const result = await page.evaluate(async () => {
      const origFetch = window.fetch;
      window.fetch = async (url) => {
        if (String(url).includes("?_v="))
          return new Response("error", { status: 500 });
        return origFetch.call(window, url);
      };
      await window.checkForUpdate();
      window.fetch = origFetch;
      return { hidden: document.getElementById("update-row")?.style.display === "none" };
    });

    expect(result.hidden).toBe(true);
  });

  test("forceUpdate clears caches and reloads page", async ({ page }) => {
    // forceUpdate is async: clears caches → unregisters SW → calls location.reload().
    // Arrow with braces returns undefined so evaluate resolves before the reload kills the context.
    const currentUrl = page.url();
    await Promise.all([
      page.waitForURL(currentUrl, { timeout: 10000 }),
      page.evaluate(() => { void window.forceUpdate(); }),
    ]);

    await expect(page.locator(".nav-tab").first()).toBeVisible();
  });
});
