import { createRequire } from 'node:module';
import { Validator } from 'jsonschema';
import { describe, expect, it } from 'vitest';
import { companySlug, toCompanyDocument } from './companyDocument';
import { applyOf, homepageOf } from './postLinks';
import { posting } from './test/fixtures';

const companySchema: unknown = createRequire(import.meta.url)(
  '@jsonresume/schema/company-schema.json'
);
const valid = (doc: unknown) =>
  new Validator().validate(doc, companySchema as object).valid;

const header = (links: string) =>
  `Acme | Berlin | Full-time | ${links}<p>We build things.`;
const link = (href: string) =>
  `<a href="${href.replace(/\//g, '&#x2F;')}" rel="nofollow">${href}</a>`;

describe('homepageOf', () => {
  it('reads the front page the header links', () => {
    expect(homepageOf(header(link('https://acme.com/')))).toBe(
      'https://acme.com'
    );
    expect(homepageOf(header(link('https://www.acme.com')))).toBe(
      'https://www.acme.com'
    );
  });

  it('never guesses from an apply link, a job board or the body', () => {
    expect(homepageOf(header(link('https://acme.com/jobs/1')))).toBeUndefined();
    expect(
      homepageOf(header(link('https://jobs.lever.co/acme')))
    ).toBeUndefined();
    expect(homepageOf(header(link('https://github.com')))).toBeUndefined();
    expect(
      homepageOf(header(link('https://acme.com/?ref=hn')))
    ).toBeUndefined();
    expect(
      homepageOf(`Acme | Berlin<p>See ${link('https://acme.com')}`)
    ).toBeUndefined();
    expect(homepageOf('')).toBeUndefined();
  });

  it('takes the first front page when the header links several', () => {
    expect(
      homepageOf(
        header(`${link('https://acme.com/careers')} ${link('https://acme.io')}`)
      )
    ).toBe('https://acme.io');
  });
});

describe('applyOf', () => {
  it('sorts the parser text into url, email or instructions', () => {
    expect(applyOf('https://acme.com/apply')).toEqual({
      url: 'https://acme.com/apply',
    });
    expect(applyOf('mailto:jobs@acme.com')).toEqual({ email: 'jobs@acme.com' });
    expect(applyOf(' jobs@acme.com ')).toEqual({ email: 'jobs@acme.com' });
    expect(applyOf('Email jobs@acme.com with "HN"')).toEqual({
      instructions: 'Email jobs@acme.com with "HN"',
    });
    expect(applyOf(null)).toBeUndefined();
    expect(applyOf('  ')).toBeUndefined();
  });
});

describe('companySlug', () => {
  it('makes a URL segment from a name', () => {
    expect(companySlug('Acme, Inc.')).toBe('acme-inc');
    expect(companySlug('Café Zürich')).toBe('cafe-zurich');
    expect(companySlug('  ')).toBe('');
  });
});

const post = (
  overrides: Parameters<typeof posting>[0],
  html = '',
  postedAt = '2026-11-03T10:00:00Z'
) => ({
  row: {
    id: 1,
    posting: posting(overrides),
    postedAt: new Date(postedAt),
    months: 1,
  },
  html,
});
const canonical = 'https://jsonresume.org/api/companies/acme/document';

describe('toCompanyDocument', () => {
  it('states what the posts agree on, as a valid company document', () => {
    const doc = toCompanyDocument(
      [
        post(
          {
            remote: 'remote_global',
            skills: [
              { name: 'Go', keywords: [] },
              { name: 'TypeScript', keywords: [] },
            ],
          },
          header(link('https://acme.com')),
          '2026-11-05T00:00:00Z'
        ),
        post({ remote: 'remote_region', city: 'Lisbon', countryCode: 'PT' }),
      ],
      canonical
    );
    expect(valid(doc)).toBe(true);
    expect(doc).toEqual({
      $schema: expect.stringContaining('company-schema.json'),
      name: 'Acme',
      url: 'https://acme.com',
      remote: 'Full',
      locations: [
        { city: 'Berlin', countryCode: 'DE' },
        { city: 'Lisbon', countryCode: 'PT' },
      ],
      technologies: ['TypeScript', 'Go'],
      meta: { canonical, lastModified: '2026-11-05T00:00:00.000Z' },
    });
  });

  it('leaves out a remote policy the posts disagree on, and missing places', () => {
    const doc = toCompanyDocument(
      [
        post({ remote: 'onsite', city: null, countryCode: null, skills: [] }),
        post({ remote: 'hybrid', city: null, countryCode: null, skills: [] }),
      ],
      canonical
    );
    expect(valid(doc)).toBe(true);
    for (const key of ['remote', 'locations', 'technologies', 'url'])
      expect(doc).not.toHaveProperty(key);
  });
});
