// @ts-check
const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",
  workers: process.env.CI ? 4 : 8,
  timeout: 20000,
  reporter: process.env.CI
    ? [["html", { open: "never" }], ["list"], ["json", { outputFile: "test-results-summary.json" }]]
    : [["list"], ["json", { outputFile: "test-results-summary.json" }]],
  globalTeardown: "./tests/global-teardown.js",
  use: {
    baseURL: "http://localhost:3000",
    headless: true,
    video: "retain-on-failure",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npx serve . -p 3000 -s",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 10000,
  },
  projects: [
    {
      name: "Desktop Chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "Pixel 5 Chromium",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "Tablet Firefox",
      use: {
        ...devices["Desktop Firefox"],
        viewport: { width: 768, height: 1024 },
      },
    },
    {
      name: "iPhone 12 Safari",
      use: { ...devices["iPhone 12"] },
      retries: 2,
    },
  ],
});
