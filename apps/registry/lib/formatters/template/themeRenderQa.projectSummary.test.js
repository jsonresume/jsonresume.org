import { describe, it, expect } from 'vitest';
import { THEMES } from './themeConfig';
import { completeResume } from '@jsonresume/sample-data';
import { HANDLEBARS_THEMES } from './themeRenderQa';

/**
 * projects[].summary replaces its deprecated alias description (#296). A
 * theme that shows a project's description must show the same text when the
 * resume uses summary instead (format.js applies withProjectSummaries).
 */

const MARKER = 'Project summary sentinel 296';
const withDescription = {
  ...completeResume,
  projects: completeResume.projects.map((p) => ({ ...p, description: MARKER })),
};
const withSummary = {
  ...completeResume,
  projects: completeResume.projects.map(({ description, ...p }) => ({
    ...p,
    summary: MARKER,
  })),
};
// Handlebars themes share global helper state and can't be rendered twice in
// one file reliably; the normalizer is theme-agnostic (format.js), so the
// ESM/JSX themes cover it.
const handlebars = new Set(HANDLEBARS_THEMES);
const themes = Object.keys(THEMES).filter((name) => !handlebars.has(name));

describe('themes render projects[].summary like description', () => {
  for (const name of themes) {
    it(`"${name}"`, async () => {
      const render = async (resume) => {
        const { format } = await import('./format');
        return (await format(resume, { theme: name })).content;
      };
      const before = await render(withDescription);
      if (!before.includes(MARKER)) return; // theme doesn't show project text
      const after = await render(withSummary);
      expect(after, name).toContain(MARKER);
    });
  }
});
