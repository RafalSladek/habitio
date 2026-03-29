// @ts-check
const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",
  workers: process.env.CI ? 4 : undefined,
  timeout: 30000,
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
      name: "Desktop Chrome",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "Tablet",
      use: {
        ...devices["Desktop Firefox"],
        viewport: { width: 768, height: 1024 },
      },
    },
  ],
});
