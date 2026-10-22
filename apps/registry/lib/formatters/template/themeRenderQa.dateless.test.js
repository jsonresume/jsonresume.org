import { describe, it, expect, vi } from 'vitest';
import { THEMES } from './themeConfig';
import { completeResume } from '@jsonresume/sample-data';
import { HANDLEBARS_THEMES, findArtifacts } from './themeRenderQa';

/**
 * Every date in JSON Resume is optional (#322): people leave dates out to
 * avoid age discrimination, and a missing endDate means "present". Themes
 * must render such entries without "Invalid Date", "undefined" or "NaN".
 *
 * Renders every registered theme with the complete fixture minus all dates.
 */

// External npm themes maintained outside this repo that currently fail;
// fixes belong upstream. Remove an entry once its theme is fixed.
const KNOWN_UPSTREAM_FAILURES = {
  elegant: 'renders "undefined" for missing dates',
  even: 'renders "Invalid Date" for missing dates',
};

const DATE_KEYS = new Set(['startDate', 'endDate', 'date', 'releaseDate']);
const withoutDates = (value) => {
  if (Array.isArray(value)) return value.map(withoutDates);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => !DATE_KEYS.has(key))
      .map(([key, v]) => [key, withoutDates(v)])
  );
};

const datelessResume = withoutDates(completeResume);
const handlebars = new Set(HANDLEBARS_THEMES);
const themes = Object.keys(THEMES).filter(
  (name) => !(name in KNOWN_UPSTREAM_FAILURES)
);

describe('all registered themes render a resume without dates', () => {
  it('the fixture really has no dates', () => {
    expect(JSON.stringify(datelessResume)).not.toMatch(
      /"(startDate|endDate|date|releaseDate)"/
    );
  });

  for (const name of themes) {
    it(`renders "${name}" without date artifacts`, async () => {
      // Handlebars themes share global state, so load them in isolation
      if (handlebars.has(name)) vi.resetModules();
      const { format } = await import('./format');
      const { content } = await format(datelessResume, { theme: name });
      expect(findArtifacts(content), name).toEqual([]);
    });
  }
});
