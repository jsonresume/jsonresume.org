import axe from 'axe-core';

/**
 * Runs axe on a rendered container and returns violation ids. Color
 * contrast is skipped because jsdom does not compute styles; contrast is
 * checked against the tokens in tokens.test.ts instead.
 */
export async function axeViolations(container: Element): Promise<string[]> {
  const result = await axe.run(container, {
    rules: { 'color-contrast': { enabled: false }, region: { enabled: false } },
  });
  return result.violations.map((v) => `${v.id}: ${v.help}`);
}
