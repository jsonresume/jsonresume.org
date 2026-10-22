import { test, expect } from '@playwright/test';

test('docs landing renders the Fumadocs shell and a heading', async ({
  page,
}) => {
  await page.goto('/docs');

  // Fumadocs nav renders the configured site title as a home link.
  await expect(
    page.getByRole('link', { name: 'JSON Resume Docs' }).first()
  ).toBeVisible();

  await expect(
    page.getByRole('heading', { name: 'JSON Resume documentation' }).first()
  ).toBeVisible();
});

test('deep doc page loads its content heading', async ({ page }) => {
  await page.goto('/docs/001-overview');

  await expect(
    page.getByRole('heading', { name: 'Overview' }).first()
  ).toBeVisible();
});

test('user guides are reachable from the landing page', async ({ page }) => {
  await page.goto('/docs');
  await page.getByRole('link', { name: 'Registry' }).first().click();

  await expect(page).toHaveURL(/\/docs\/guides\/registry/);
  await expect(
    page.getByRole('heading', { name: 'Registry' }).first()
  ).toBeVisible();
});
