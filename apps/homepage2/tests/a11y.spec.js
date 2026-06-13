// @ts-check
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

/**
 * Accessibility smoke test.
 *
 * Runs axe-core against the homepage and fails the build only on CRITICAL
 * violations, so genuine regressions (e.g. an unlabelled control or a broken
 * landmark) are caught without blocking on the per-theme color-contrast and
 * design-level findings tracked separately in the a11y audit.
 *
 * Scope is intentionally narrow (home page, critical-only) — widen it as more
 * surfaces are remediated.
 */
test('homepage has no critical accessibility violations', async ({ page }) => {
  await page.goto('/');

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();

  const critical = results.violations.filter((v) => v.impact === 'critical');

  // Helpful output when something fails in CI.
  if (critical.length > 0) {
    console.error(
      'Critical a11y violations:\n' +
        critical
          .map((v) => `  - ${v.id} (${v.nodes.length}): ${v.help}`)
          .join('\n')
    );
  }

  expect(critical).toEqual([]);
});
