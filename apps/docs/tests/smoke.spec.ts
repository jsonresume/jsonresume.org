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
  await page
    .getByRole('link', { name: 'Hosting and downloads' })
    .first()
    .click();

  await expect(page).toHaveURL(/\/docs\/guides\/registry/);
  await expect(
    page.getByRole('heading', { name: 'Hosting and downloads' }).first()
  ).toBeVisible();
});

// The export has no server: search reads the index written at build time.
// Under next dev the index is built on the first search, which takes a while.
test('search finds a guide', async ({ page }) => {
  await page.goto('/docs');
  await page
    .getByRole('button', { name: /Search/ })
    .first()
    .click();
  await page.getByRole('dialog').getByRole('textbox').fill('docx');

  await expect(
    page.getByRole('dialog').getByText('Hosting and downloads').first()
  ).toBeVisible({ timeout: 30_000 });
});
