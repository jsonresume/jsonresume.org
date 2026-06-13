import { describe, it, expect } from 'vitest';
import { THEMES } from './themeConfig';
import { format } from './format';
import completeResume from '../../../../../packages/test-fixtures/complete-resume.json';
import {
  HANDLEBARS_THEMES,
  assertThemeRender,
  BASELINE_SECTIONS,
} from './themeRenderQa';

/**
 * PERMANENT GATE: every registered theme must render the complete fixture
 * without crashing or leaking raw artifacts, and must cover a baseline set of
 * sections. See themeRenderQa.js for the rationale and references #275 / #360.
 *
 * themeConfig.js (THEMES) is the single source of truth for registered themes,
 * so newly added themes are automatically covered by this gate.
 *
 * Handlebars-based themes share a global Handlebars singleton and are tested
 * in themeRenderQa.handlebars.test.js (separate file => vitest module
 * isolation) to avoid cross-theme helper pollution that only occurs inside a
 * shared test worker (production fresh-requires them from a clean cache).
 */

const handlebars = new Set(HANDLEBARS_THEMES);
const themeNames = Object.keys(THEMES).filter((name) => !handlebars.has(name));

describe('all registered themes render the complete fixture', () => {
  it('has registered themes to test', () => {
    expect(themeNames.length).toBeGreaterThan(0);
  });

  // HARD regression gate: one assertion per theme.
  const coverageMap = {};
  for (const name of themeNames) {
    it(`renders "${name}" without crashing or raw artifacts`, async () => {
      const { content } = await format(completeResume, { theme: name });
      coverageMap[name] = assertThemeRender(expect, name, content);
    });
  }

  // SNAPSHOT (not a hard fail): the fuller per-theme/per-section coverage map.
  // Themes legitimately omit niche sections by design, so we do NOT fail on
  // partial coverage here; instead any DROP shows up as a snapshot diff in PRs.
  // Run with -u to intentionally update after adding/removing themes.
  it('matches the recorded section-coverage snapshot', async () => {
    for (const name of themeNames) {
      if (!coverageMap[name]) {
        const { content } = await format(completeResume, { theme: name });
        coverageMap[name] = assertThemeRender(expect, name, content);
      }
    }
    const ordered = Object.fromEntries(
      Object.keys(coverageMap)
        .sort()
        .map((k) => [k, coverageMap[k]])
    );
    expect(ordered).toMatchSnapshot();
  });

  it('documents the hard coverage baseline', () => {
    expect(BASELINE_SECTIONS).toEqual([
      'basics',
      'work',
      'education',
      'skills',
    ]);
  });
});
