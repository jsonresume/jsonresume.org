import { Effect } from 'effect';
import { describe, expect, it } from 'vitest';
import { withoutEmptyImages } from './empty-images.ts';
import { withoutInvalidDates } from './invalid-dates.ts';
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

  it('moves a list of languages written in basics to the languages section', () => {
    const shaped = withSchemaShapes({
      basics: {
        name: 'Ada',
        languages: [{ language: 'French', fluency: 'Native' }],
      },
    });
    expect(shaped['languages']).toEqual([
      { language: 'French', fluency: 'Native' },
    ]);
    expect(shaped['basics']).not.toHaveProperty('languages');
    const text = withSchemaShapes({
      basics: { name: 'Ada', languages: 'English, French' },
    });
    expect(text['basics']).toMatchObject({ languages: 'English, French' });
  });

  it('reads awards written with name and issuer, and never says undefined', () => {
    const shaped = withSchemaShapes({
      basics: { name: 'Ada' },
      awards: [
        { name: 'Annual Award', issuer: 'The Institute' },
        { awarder: 'Company', summary: 'Two years running' },
      ],
    });
    expect(shaped['awards']).toEqual([
      {
        name: 'Annual Award',
        issuer: 'The Institute',
        title: 'Annual Award',
        awarder: 'The Institute',
      },
      { awarder: 'Company', summary: 'Two years running', title: '' },
    ]);
  });

  it('takes dates a theme could not read out of its HTML', () => {
    const none = '<div><time datetime="">Invalid Date</time> – Present</div>';
    expect(withoutInvalidDates(none)).toBe('<div></div>');
    const endOnly =
      '<div><time datetime="">Invalid Date</time> – <time datetime="2006-01-01">Jan 2006</time></div>';
    expect(withoutInvalidDates(endOnly)).toBe(
      '<div><time datetime="2006-01-01">Jan 2006</time></div>'
    );
  });

  it('takes images with no source out of the HTML', () => {
    expect(
      withoutEmptyImages('<p><img src= alt="avatar" class="a" /></p>')
    ).toBe('<p></p>');
    expect(withoutEmptyImages('<p><img src="" alt="avatar" /></p>')).toBe(
      '<p></p>'
    );
    expect(withoutEmptyImages("<p><img alt='x' src=''></p>")).toBe('<p></p>');
    const kept = '<img src="a.jpg" alt=""><img data-src="" src=b.png>';
    expect(withoutEmptyImages(kept)).toBe(kept);
  });

  it('reads a photo written as an object (Reactive Resume) as its URL', () => {
    const shaped = withSchemaShapes({
      basics: {
        name: 'Ada',
        picture: { url: 'https://x.test/ada.png', size: 64 },
        image: { url: '', size: 64 },
        photo: 'https://x.test/kept.png',
      },
    });
    expect(shaped['basics']).toMatchObject({
      picture: 'https://x.test/ada.png',
      photo: 'https://x.test/kept.png',
    });
    expect(shaped['basics']).not.toHaveProperty('image');
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
