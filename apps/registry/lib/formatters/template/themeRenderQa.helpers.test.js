import { describe, it, expect } from 'vitest';
import {
  findArtifacts,
  sectionCoverage,
  SECTION_SENTINELS,
  BASELINE_SECTIONS,
  HANDLEBARS_THEMES,
} from './themeRenderQa';

/**
 * Direct unit tests for the PURE helpers in themeRenderQa.js. The existing
 * themeRenderQa.test.js / .handlebars.test.js suites only exercise these
 * helpers indirectly via assertThemeRender() over real theme output. These
 * tests pin down findArtifacts() and sectionCoverage() in isolation so a
 * regression in the artifact regexes or the OR-of-sentinels coverage logic is
 * caught directly, not as a confusing downstream theme-gate failure.
 */

describe('findArtifacts', () => {
  it('returns an empty array for clean HTML', () => {
    expect(findArtifacts('<p>Hello World</p>')).toEqual([]);
  });

  it('detects literal "[object Object]"', () => {
    expect(findArtifacts('before [object Object] after')).toEqual([
      '[object Object]',
    ]);
  });

  it('detects a standalone "undefined" word', () => {
    expect(findArtifacts('the value is undefined here')).toEqual(['undefined']);
  });

  it('detects a standalone "NaN" word', () => {
    expect(findArtifacts('total NaN items')).toEqual(['NaN']);
  });

  it('does NOT match "undefined" inside a larger word (word boundary)', () => {
    expect(findArtifacts('undefinedBehavior')).toEqual([]);
    expect(findArtifacts('myUndefinedThing')).toEqual([]);
  });

  it('does NOT match "NaN" inside a larger word (word boundary)', () => {
    expect(findArtifacts('Banana')).toEqual([]);
    expect(findArtifacts('NaNoTechnology')).toEqual([]);
  });

  it('reports all distinct artifacts present, in declaration order', () => {
    expect(findArtifacts('[object Object] undefined NaN')).toEqual([
      '[object Object]',
      'undefined',
      'NaN',
    ]);
  });

  it('reports a subset when only some artifacts are present', () => {
    expect(findArtifacts('value NaN and [object Object]')).toEqual([
      '[object Object]',
      'NaN',
    ]);
  });

  it('returns empty for an empty string', () => {
    expect(findArtifacts('')).toEqual([]);
  });
});

describe('sectionCoverage', () => {
  it('reports a key for every section in SECTION_SENTINELS', () => {
    const cov = sectionCoverage('whatever');
    expect(Object.keys(cov).sort()).toEqual(
      Object.keys(SECTION_SENTINELS).sort()
    );
  });

  it('marks all sections false for empty HTML', () => {
    const cov = sectionCoverage('');
    expect(Object.values(cov).every((v) => v === false)).toBe(true);
  });

  it('marks a section covered when any single sentinel appears', () => {
    const cov = sectionCoverage('... PostgreSQL ...');
    expect(cov.skills).toBe(true);
    // skills has exactly one sentinel; unrelated sections stay false.
    expect(cov.work).toBe(false);
    expect(cov.awards).toBe(false);
  });

  it('treats sentinels as an OR set (alternate sentinel still covers)', () => {
    // work sentinels: ['Senior Software Engineer', 'microservices architecture serving']
    const cov1 = sectionCoverage('Senior Software Engineer');
    const cov2 = sectionCoverage('microservices architecture serving');
    expect(cov1.work).toBe(true);
    expect(cov2.work).toBe(true);
  });

  it('marks multiple independent sections from combined HTML', () => {
    const cov = sectionCoverage(
      'Jane Developer worked at things; PostgreSQL; Spanish'
    );
    expect(cov.basics).toBe(true);
    expect(cov.skills).toBe(true);
    expect(cov.languages).toBe(true);
    expect(cov.publications).toBe(false);
  });

  it('returns boolean values for every section', () => {
    const cov = sectionCoverage('Jane Developer');
    for (const v of Object.values(cov)) {
      expect(typeof v).toBe('boolean');
    }
  });
});

describe('themeRenderQa configuration constants', () => {
  it('BASELINE_SECTIONS are all defined in SECTION_SENTINELS', () => {
    for (const section of BASELINE_SECTIONS) {
      expect(SECTION_SENTINELS[section]).toBeDefined();
      expect(Array.isArray(SECTION_SENTINELS[section])).toBe(true);
      expect(SECTION_SENTINELS[section].length).toBeGreaterThan(0);
    }
  });

  it('every section has at least one non-empty sentinel string', () => {
    for (const [section, sentinels] of Object.entries(SECTION_SENTINELS)) {
      expect(Array.isArray(sentinels), `${section} sentinels not array`).toBe(
        true
      );
      expect(sentinels.length).toBeGreaterThan(0);
      for (const s of sentinels) {
        expect(typeof s).toBe('string');
        expect(s.length).toBeGreaterThan(0);
      }
    }
  });

  it('BASELINE_SECTIONS contains the core resume sections', () => {
    expect(BASELINE_SECTIONS).toEqual(
      expect.arrayContaining(['basics', 'work', 'education', 'skills'])
    );
  });

  it('HANDLEBARS_THEMES is a non-empty list of theme slugs', () => {
    expect(Array.isArray(HANDLEBARS_THEMES)).toBe(true);
    expect(HANDLEBARS_THEMES.length).toBeGreaterThan(0);
    for (const name of HANDLEBARS_THEMES) {
      expect(typeof name).toBe('string');
    }
    expect(HANDLEBARS_THEMES).toContain('macchiato');
  });
});
