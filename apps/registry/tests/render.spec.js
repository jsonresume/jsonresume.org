// @ts-check
const { test, expect } = require('@playwright/test');

test.skip('has title', async ({ page }) => {
  await page.goto('http://localhost:3002/thomasdavis');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Thomas Davis/);
});
