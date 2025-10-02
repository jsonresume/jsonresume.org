// @ts-check
const { test, expect } = require('@playwright/test');

test('renders resume for username', async ({ page }) => {
  await page.goto('http://localhost:3000/thomasdavis');

  // Check that the page contains the user's name in the content
  await expect(page.locator('body')).toContainText('Thomas Davis');
});
