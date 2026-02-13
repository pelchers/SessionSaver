import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 45_000,
  retries: 0,
  use: {
    headless: true,
    viewport: { width: 1365, height: 900 },
    baseURL: "http://127.0.0.1:4173"
  },
  webServer: {
    command: "npm run dev -- --host 127.0.0.1 --port 4173 --strictPort",
    url: "http://127.0.0.1:4173/src/options/index.html",
    reuseExistingServer: true,
    timeout: 90_000
  }
});
