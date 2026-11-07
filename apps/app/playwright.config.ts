import { defineConfig, devices } from '@playwright/test';

/**
 * Whole flows in a browser against the dev server, on its in-memory
 * database (DATABASE_URL is cleared, so nothing real is touched). Its own
 * port, so turbo can run every app's e2e suite at once.
 */
const PORT = 5299;

export default defineConfig({
  testDir: './e2e',
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 1 : 0,
  workers: 1,
  timeout: 180_000,
  // The dev server compiles a page on its first visit: allow for it.
  expect: { timeout: 30_000 },
  reporter: process.env['CI'] ? 'github' : 'list',
  use: { baseURL: `http://localhost:${PORT}`, trace: 'retain-on-failure' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `env -u DATABASE_URL PORT=${PORT} node scripts/dev.ts`,
    url: `http://localhost:${PORT}/start`,
    reuseExistingServer: !process.env['CI'],
    timeout: 180_000,
  },
});
