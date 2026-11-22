// @ts-check
const { test, expect } = require('@playwright/test');

// The page loads thomasdavis's gist from GitHub. Fork PRs get every secret
// as an empty string, so the lookup is anonymous and the shared runner's
// rate limit fails it; the workflow's own token can't read gists.
const credentials = Boolean(
  process.env.AUTH_GITHUB_ID || process.env.GITHUB_TOKEN
);

test('renders resume for username', async ({ page }) => {
  test.skip(!credentials, 'needs GitHub credentials, which fork PRs lack');
  await page.goto('http://localhost:3000/thomasdavis');

  // Check that the page contains the user's name in the content
  await expect(page.locator('body')).toContainText('Thomas Davis');
});
