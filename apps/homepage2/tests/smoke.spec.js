// @ts-check
const { test, expect } = require('@playwright/test');

test('home page loads with title and hero', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle('JSON Resume');
  await expect(
    page.getByRole('heading', { level: 1, name: 'JSON Resume' })
  ).toBeVisible();
});

test('themes gallery renders at least one theme card', async ({ page }) => {
  await page.goto('/themes');

  await expect(
    page.getByRole('heading', { level: 1, name: 'Themes' })
  ).toBeVisible();

  // Each theme card renders a "Preview theme" link.
  await expect(
    page.getByRole('link', { name: 'Preview theme' }).first()
  ).toBeVisible();
});
