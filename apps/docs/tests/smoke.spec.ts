import { test, expect } from '@playwright/test';

test('docs landing renders the Fumadocs shell and a heading', async ({
  page,
}) => {
  await page.goto('/docs');

  // Fumadocs nav renders the configured site title as a home link.
  await expect(
    page.getByRole('link', { name: 'Docwright' }).first()
  ).toBeVisible();

  await expect(
    page.getByRole('heading', { name: 'Documentation' }).first()
  ).toBeVisible();
});

test('deep doc page loads its content heading', async ({ page }) => {
  await page.goto('/docs/001-overview');

  await expect(
    page.getByRole('heading', { name: 'Overview' }).first()
  ).toBeVisible();
});
