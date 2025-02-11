import { defineConfig } from '@playwright/test';

export default defineConfig({
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3001",
    timeout: 120000, // 2 minutos para que Nuxt levante
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: "http://localhost:3001",
    browserName: "firefox",
    headless: false,
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  testDir: "tests/e2e",
});
