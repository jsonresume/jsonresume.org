import { Effect } from 'effect';
import { describe, expect, it } from 'vitest';
import { regionCode, withRegionCodes } from './regions.ts';
import { renderTheme, themeSlugs } from './render.ts';
import { withSchemaShapes } from './shapes.ts';

/** Every shape found stopping a hosted page or dropping a section (2026-11-18). */
const messy = {
  basics: {
    label: 'Engineer',
    location: { city: 'Farmington', countryCode: 'USA' },
    profiles: [{ url: 'https://github.com/ada' }, {}],
  },
  work: [
    {
      name: 'Acme',
      position: 'Engineer',
      highlights: [
        { name: 'Infusion pump', description: 'Built its firmware' },
        'Plain highlight',
      ],
    },
  ],
  skills: { backend: ['Node.js', 'Postgres'], frontend: ['React'] },
  references: 'Available upon request.',
  awards: { title: 'Best paper', awarder: 'ACM' },
  interests: { posts: [{ url: '/feed' }], skills: [{ kind: 'x' }] },
};

/** Ratings as numbers (a 1-5 scale) or lists (2026-11-24, elegant failed). */
const rated = {
  basics: { name: 'Ada', label: 'Engineer' },
  skills: [
    { name: 'Android', level: 5, keywords: ['Kotlin'] },
    { name: 'Go', level: ['senior'] },
  ],
  languages: [{ language: 'Polish', fluency: 5 }],
};

describe('schema shapes', () => {
  const fixed = withSchemaShapes(messy);

  it('reads ratings as text, and drops one that isn’t', () => {
    const shaped = withSchemaShapes(rated);
    expect(shaped['skills']).toEqual([
      { name: 'Android', level: '5', keywords: ['Kotlin'] },
      { name: 'Go' },
    ]);
    expect(shaped['languages']).toEqual([{ language: 'Polish', fluency: '5' }]);
  });

  it('names profiles from their address and drops empty ones', () => {
    expect(fixed['basics']).toMatchObject({
      name: '',
      profiles: [{ url: 'https://github.com/ada', network: 'GitHub' }],
    });
  });

  it('reads entries in highlights as text', () => {
    expect(fixed['work']).toMatchObject([
      {
        highlights: ['Infusion pump: Built its firmware', 'Plain highlight'],
      },
    ]);
  });

  it('turns a map of skills into groups, a sentence into a reference, one entry into a list', () => {
    expect(fixed['skills']).toEqual([
      { name: 'backend', keywords: ['Node.js', 'Postgres'] },
      { name: 'frontend', keywords: ['React'] },
    ]);
    expect(fixed['references']).toEqual([
      { name: '', reference: 'Available upon request.' },
    ]);
    expect(fixed['awards']).toEqual([{ title: 'Best paper', awarder: 'ACM' }]);
    // Not an entry: renders as nothing rather than stopping the page.
    expect(fixed['interests']).toEqual([]);
  });

  it.each(themeSlugs)(
    'renders %s with them',
    { timeout: 30_000 },
    async (theme) => {
      for (const resume of [messy, rated]) {
        const html = await Effect.runPromise(renderTheme(theme, resume));
        expect(html).toMatch(/<meta[^>]+charset/i);
      }
    }
  );
});

describe('country codes', () => {
  it('reads codes, names and the usual abbreviations', () => {
    expect(regionCode('us')).toBe('US');
    expect(regionCode('USA')).toBe('US');
    expect(regionCode('India')).toBe('IN');
    expect(regionCode('Poland (Open to relocation)')).toBe('PL');
    expect(regionCode('Deutschland')).toBe('DE');
    expect(regionCode('XQ')).toBeUndefined();
    expect(regionCode('Planet Earth')).toBeUndefined();
  });

  it('gives themes that read codes a code, keeping what no code fits as the region', () => {
    const at = (countryCode: string) =>
      withRegionCodes('even', {
        basics: { location: { city: 'X', countryCode } },
      })['basics'];
    expect(at('USA')).toEqual({ location: { city: 'X', countryCode: 'US' } });
    expect(at('Planet Earth')).toEqual({
      location: { city: 'X', region: 'Planet Earth' },
    });
    // Other themes print what was written.
    expect(
      withRegionCodes('elegant', {
        basics: { location: { countryCode: 'USA' } },
      })
    ).toEqual({ basics: { location: { countryCode: 'USA' } } });
  });
});
