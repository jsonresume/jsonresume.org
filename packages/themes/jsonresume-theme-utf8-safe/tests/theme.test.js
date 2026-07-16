import { describe, it, expect } from 'vitest';
import { runThemeRenderQa } from '@jsonresume/theme-kit';
import { completeResume } from '@jsonresume/sample-data';
import { render } from '../index.jsx';

/*
 * UTF-8 Safe render-QA — the exact gate the registry enforces across every
 * theme, dogfooded here via @jsonresume/theme-kit. runThemeRenderQa renders the
 * canonical every-section fixture from @jsonresume/sample-data through this
 * theme's render() and asserts:
 *   - render() returns non-empty HTML and does not throw,
 *   - no raw artifacts leak ([object Object] / undefined / NaN),
 *   - the baseline sections (basics / work / education / skills) all appear.
 *
 * Keep this test green as you redesign src/Resume.jsx — if it fails it almost
 * always traces back to one of the SSR-inline rules in src/Resume.jsx.
 */
describe('jsonresume-theme-utf8-safe', () => {
  it('passes the theme-kit render QA against the complete sample resume', async () => {
    await runThemeRenderQa({
      render,
      name: 'utf8-safe',
      expect,
      fixture: completeResume,
    });
  });

  it('renders a complete HTML document', () => {
    const html = render(completeResume);
    expect(html.startsWith('<!DOCTYPE html>')).toBe(true);
    expect(html).toContain('</html>');
    expect(html).toContain(completeResume.basics.name);
  });
});
