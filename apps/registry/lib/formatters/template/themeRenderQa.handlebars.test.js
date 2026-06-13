import { describe, it, expect, vi } from 'vitest';
import { THEMES } from './themeConfig';
import completeResume from '../../../../../packages/test-fixtures/complete-resume.json';
import { HANDLEBARS_THEMES, assertThemeRender } from './themeRenderQa';

/**
 * PERMANENT GATE (Handlebars themes) — companion to themeRenderQa.test.js.
 *
 * Handlebars-based themes (macchiato, pumpkin, lucide, minyma,
 * paper-plus-plus) all require('handlebars') and register colliding global
 * helpers (e.g. formatDate) at module load. Inside a single vitest worker the
 * last-registered helper wins, which can make an unrelated theme throw
 * "Invalid date" — an artifact of the shared test process, NOT a production
 * bug (production fresh-requires the theme + handlebars from a clean cache via
 * format.js, and each renders correctly standalone).
 *
 * This file lives separately from the ESM suite (vitest isolates modules per
 * file) and calls vi.resetModules() before each render + imports format()
 * dynamically, so every Handlebars theme renders against a clean module graph.
 * The render + artifact + baseline-coverage assertions are exactly as HARD as
 * the ESM suite.
 *
 * References #275 / #360. See themeRenderQa.js for shared helpers/sentinels.
 */

// Only assert themes that are both registered AND Handlebars-based, so the
// list stays correct if a theme is removed from themeConfig.js.
const handlebarsThemes = HANDLEBARS_THEMES.filter((name) => name in THEMES);

describe('Handlebars themes render the complete fixture (module-isolated)', () => {
  it('has Handlebars themes to test', () => {
    expect(handlebarsThemes.length).toBeGreaterThan(0);
  });

  for (const name of handlebarsThemes) {
    it(`renders "${name}" without crashing or raw artifacts`, async () => {
      vi.resetModules();
      const { format } = await import('./format');
      const { content } = await format(completeResume, { theme: name });
      assertThemeRender(expect, name, content);
    });
  }
});
