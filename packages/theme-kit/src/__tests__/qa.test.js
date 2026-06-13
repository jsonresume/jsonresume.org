import { describe, it, expect } from 'vitest';
import { completeResume } from '@jsonresume/sample-data';
import {
  findArtifacts,
  sectionCoverage,
  assertThemeRender,
  runThemeRenderQa,
  BASELINE_SECTIONS,
  SECTION_SENTINELS,
  HANDLEBARS_THEMES,
} from '../index.js';

// A minimal "good" HTML string that satisfies the baseline gate: it contains a
// section-distinct sentinel for each baseline section and no raw artifacts.
const GOOD_HTML = [
  '<h1>Jane Developer</h1>',
  '<p>Senior Software Engineer</p>',
  '<p>University of California, Berkeley</p>',
  '<li>PostgreSQL</li>',
].join('\n');

describe('findArtifacts', () => {
  it('returns no artifacts for clean HTML', () => {
    expect(findArtifacts(GOOD_HTML)).toEqual([]);
  });

  it('detects [object Object]', () => {
    expect(findArtifacts('<p>[object Object]</p>')).toEqual([
      '[object Object]',
    ]);
  });

  it('detects a bare "undefined" word', () => {
    expect(findArtifacts('<p>undefined</p>')).toEqual(['undefined']);
  });

  it('detects a bare "NaN" word', () => {
    expect(findArtifacts('<p>NaN years</p>')).toEqual(['NaN']);
  });

  it('does not flag "undefined"/"NaN" embedded inside larger words', () => {
    // \b boundaries mean substrings inside identifiers are not artifacts.
    expect(findArtifacts('<p>undefinedness</p>')).toEqual([]);
    expect(findArtifacts('<p>NaNny</p>')).toEqual([]);
  });

  it('lists multiple artifacts when several are present', () => {
    const out = findArtifacts('[object Object] undefined NaN');
    expect(out).toEqual(['[object Object]', 'undefined', 'NaN']);
  });
});

describe('sectionCoverage', () => {
  it('marks baseline sections present in good HTML', () => {
    const cov = sectionCoverage(GOOD_HTML);
    for (const section of BASELINE_SECTIONS) {
      expect(cov[section]).toBe(true);
    }
  });

  it('marks sections absent when no sentinel appears', () => {
    const cov = sectionCoverage('<h1>Nothing here</h1>');
    expect(cov.basics).toBe(false);
    expect(cov.work).toBe(false);
    expect(cov.education).toBe(false);
    expect(cov.skills).toBe(false);
  });

  it("matches on ANY of a section's sentinels (OR semantics)", () => {
    // basics has two sentinels; either one alone counts as covered.
    expect(sectionCoverage('Full Stack Software Engineer').basics).toBe(true);
    expect(sectionCoverage('Jane Developer').basics).toBe(true);
  });

  it('reports every section key from SECTION_SENTINELS', () => {
    const cov = sectionCoverage(GOOD_HTML);
    expect(Object.keys(cov).sort()).toEqual(
      Object.keys(SECTION_SENTINELS).sort()
    );
  });
});

describe('assertThemeRender', () => {
  it('passes for good HTML and returns the coverage map', () => {
    const cov = assertThemeRender(expect, 'good-theme', GOOD_HTML);
    expect(cov.basics).toBe(true);
  });

  it('fails when HTML is empty', () => {
    expect(() => assertThemeRender(expect, 'empty', '')).toThrow();
  });

  it('fails when a raw artifact leaks', () => {
    expect(() =>
      assertThemeRender(expect, 'artifact', GOOD_HTML + ' [object Object]')
    ).toThrow();
  });

  it('fails when a baseline section is missing', () => {
    // Drop the skills sentinel -> baseline gate should reject.
    const noSkills = GOOD_HTML.replace('<li>PostgreSQL</li>', '');
    expect(() => assertThemeRender(expect, 'no-skills', noSkills)).toThrow();
  });
});

describe('runThemeRenderQa', () => {
  it('runs a synchronous render against the default fixture', async () => {
    const render = (resume) =>
      [
        resume.basics.name,
        'Senior Software Engineer',
        'University of California, Berkeley',
        'PostgreSQL',
      ].join(' ');
    const cov = await runThemeRenderQa({ render, name: 'sync', expect });
    expect(cov.basics).toBe(true);
    expect(cov.work).toBe(true);
  });

  it('awaits an async render and accepts a custom fixture', async () => {
    const render = async () => GOOD_HTML;
    const cov = await runThemeRenderQa({
      render,
      name: 'async',
      expect,
      fixture: completeResume,
    });
    expect(cov.education).toBe(true);
  });

  it('surfaces a crashing render as a rejection', async () => {
    const render = () => {
      throw new Error('boom');
    };
    await expect(
      runThemeRenderQa({ render, name: 'boom', expect })
    ).rejects.toThrow('boom');
  });
});

describe('exported constants', () => {
  it('keeps the hard coverage baseline', () => {
    expect(BASELINE_SECTIONS).toEqual([
      'basics',
      'work',
      'education',
      'skills',
    ]);
  });

  it('lists the Handlebars themes', () => {
    expect(HANDLEBARS_THEMES).toContain('macchiato');
    expect(HANDLEBARS_THEMES).toContain('paper-plus-plus');
  });
});
