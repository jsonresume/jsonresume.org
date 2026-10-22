import { describe, it, expect, vi } from 'vitest';
import { THEMES } from './themeConfig';
import { completeResume } from '@jsonresume/sample-data';
import { HANDLEBARS_THEMES, findArtifacts } from './themeRenderQa';

/**
 * Entry locations may be structured objects (#323). The registry formats them
 * to strings before rendering (withStringLocations), so every theme, including
 * external ones written for string locations, must render them as text.
 */

const location = { city: 'Lisbon', region: 'Lisboa', countryCode: 'PT' };
const withObjectLocations = {
  ...completeResume,
  work: (completeResume.work || []).map((w) => ({ ...w, location })),
  volunteer: (completeResume.volunteer || []).map((v) => ({ ...v, location })),
  education: (completeResume.education || []).map((e) => ({ ...e, location })),
};
const handlebars = new Set(HANDLEBARS_THEMES);

describe('all registered themes render structured entry locations', () => {
  for (const name of Object.keys(THEMES)) {
    it(`renders "${name}" without [object Object]`, async () => {
      if (handlebars.has(name)) vi.resetModules();
      const { format } = await import('./format');
      const { content } = await format(withObjectLocations, { theme: name });
      expect(findArtifacts(content), name).not.toContain('[object Object]');
    });
  }

  // reference is in-repo; even is an external npm theme
  for (const theme of ['reference', 'even']) {
    it(`shows the formatted location text in "${theme}"`, async () => {
      const { format } = await import('./format');
      const { content } = await format(withObjectLocations, { theme });
      expect(content).toContain('Lisbon, Lisboa, PT');
    });
  }
});
