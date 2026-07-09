import { defineConfig, devices } from "@playwright/test";

/**
 * Four perspectives on the same garden:
 *  - chromium-desktop: full motion, 1440×900 — the flagship experience
 *  - chromium-reduced: prefers-reduced-motion — every word must still arrive
 *  - mobile-webkit: iPhone 13 — touch, no cursor effects, stacked layouts
 *  - tablet-chromium: 820×1180 — the md band between the breakpoints
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 2 : 4,
  reporter: [["list"], ["html", { open: "never" }]],
  timeout: 45_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: "http://localhost:4310",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "npm run start -- -p 4310",
    port: 4310,
    reuseExistingServer: true,
    timeout: 120_000,
  },
  projects: [
    {
      name: "chromium-desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: "chromium-reduced",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
        contextOptions: { reducedMotion: "reduce" },
      },
    },
    {
      name: "mobile-webkit",
      use: { ...devices["iPhone 13"] },
    },
    {
      name: "tablet-chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 820, height: 1180 },
        hasTouch: true,
      },
    },
  ],
});
