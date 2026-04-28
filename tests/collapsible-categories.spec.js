const { test, expect } = require("@playwright/test");
const { completeOnboarding } = require("./test-helpers");

test.describe("Collapsible Suggestion Categories", () => {
  test("should toggle category visibility when clicking header", async ({ page }) => {
    await page.goto("http://localhost:3000");
    await completeOnboarding(page, "Alex");

    // Open add-habit modal
    await page.click('[onclick="openAddModal()"]');
    await page.waitForSelector(".add-modal.show");

    // Wait for suggestions to render
    await page.waitForSelector(".suggestion-cat-header");

    // Get all category headers
    const headers = await page.$$(".suggestion-cat-header");
    expect(headers.length).toBeGreaterThan(0);

    // Get first category
    const firstHeader = headers[0];
    const catKey = await firstHeader.getAttribute("data-cat-key");

    // Check items are visible initially
    const itemsContainer = await page.$(`#cat-items-${catKey}`);
    const initialDisplay = await itemsContainer.evaluate((el) => el.style.display);
    expect(initialDisplay).not.toBe("none");

    // Click header to collapse
    await firstHeader.click();
    await page.waitForTimeout(400); // Wait for animation

    // Check items are hidden
    const collapsedDisplay = await itemsContainer.evaluate((el) => el.style.display);
    expect(collapsedDisplay).toBe("none");

    // Check chevron has collapsed class
    const chevron = await firstHeader.$(".cat-chevron");
    const hasCollapsed = await chevron.evaluate((el) => el.classList.contains("collapsed"));
    expect(hasCollapsed).toBe(true);

    // Click again to expand
    await firstHeader.click();
    await page.waitForTimeout(400);

    // Check items are visible again
    const expandedDisplay = await itemsContainer.evaluate((el) => el.style.display);
    expect(expandedDisplay).not.toBe("none");

    // Check chevron no longer has collapsed class
    const hasCollapsedAfter = await chevron.evaluate((el) => el.classList.contains("collapsed"));
    expect(hasCollapsedAfter).toBe(false);
  });

  test("should show category name and count", async ({ page }) => {
    await page.goto("http://localhost:3000");
    await completeOnboarding(page, "Alex");

    await page.click('[onclick="openAddModal()"]');
    await page.waitForSelector(".suggestion-cat-header");

    // Get first category header
    const header = await page.$(".suggestion-cat-header");
    const catName = await header.$eval(".cat-name", (el) => el.textContent);
    const catCount = await header.$eval(".cat-count", (el) => el.textContent);

    expect(catName).toBeTruthy();
    expect(catCount).toMatch(/\(\d+\)/); // Should be like "(18)"
  });

  test("should reset collapsed state when modal reopens", async ({ page }) => {
    await page.goto("http://localhost:3000");
    await completeOnboarding(page, "Alex");

    // Open modal
    await page.click('[onclick="openAddModal()"]');
    await page.waitForSelector(".suggestion-cat-header");

    // Collapse first category
    const firstHeader = await page.$(".suggestion-cat-header");
    await firstHeader.click();
    await page.waitForTimeout(400);

    // Close modal
    await page.click("#modal-cancel-btn");
    await page.waitForTimeout(300);

    // Reopen modal
    await page.click('[onclick="openAddModal()"]');
    await page.waitForSelector(".suggestion-cat-header");

    // Check first category is expanded again (state reset)
    const catKey = await (await page.$(".suggestion-cat-header")).getAttribute("data-cat-key");
    const itemsContainer = await page.$(`#cat-items-${catKey}`);
    const display = await itemsContainer.evaluate((el) => el.style.display);
    expect(display).not.toBe("none");
  });
});
