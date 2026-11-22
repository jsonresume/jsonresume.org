import { createRequire } from 'node:module';
import { Validator } from 'jsonschema';
import { describe, expect, it } from 'vitest';
import { toJobDocument } from './jobDocument';
import { posting } from './test/fixtures';

const jobSchema: unknown = createRequire(import.meta.url)(
  '@jsonresume/schema/job-schema.json'
);
const valid = (doc: unknown) =>
  new Validator().validate(doc, jobSchema as object).valid;
const row = (overrides: Parameters<typeof posting>[0] = {}) => ({
  id: 42,
  posting: posting(overrides),
  postedAt: new Date('2026-11-03T10:00:00Z'),
  months: 1,
});
const url = 'https://jsonresume.org/jobs/42';

describe('toJobDocument (#353)', () => {
  it('writes a valid job-schema document with display text and facets', () => {
    const doc = toJobDocument(row({ salary: '€70–90k' }), url);
    expect(valid(doc)).toBe(true);
    expect(doc).toMatchObject({
      title: 'Software Engineer',
      company: 'Acme',
      type: 'Full-time',
      date: '2026-11-03',
      location: { city: 'Berlin', countryCode: 'DE' },
      remote: 'Hybrid',
      salary: '€70–90k',
      experience: 'Senior',
      facets: {
        remoteScope: 'hybrid',
        seniority: 'senior',
        employmentType: 'full_time',
        visaSponsorship: 'unspecified',
        salaryProvenance: 'stated',
      },
      skills: [{ name: 'TypeScript', keywords: ['React'] }],
      meta: { canonical: url, lastModified: '2026-11-03T10:00:00.000Z' },
    });
  });

  it('leaves out what the post does not say, and the derived USD pay', () => {
    const doc = toJobDocument(
      row({
        company: 'unspecified',
        city: null,
        countryCode: null,
        remote: 'unspecified',
        seniority: 'unspecified',
        employmentType: 'unspecified',
        salaryMin: 120000,
        salaryMax: 150000,
      }),
      url
    );
    expect(valid(doc)).toBe(true);
    for (const key of ['company', 'location', 'remote', 'experience', 'type'])
      expect(doc).not.toHaveProperty(key);
    expect(doc).not.toHaveProperty('compensation');
    expect(doc.facets.remoteScope).toBe('unspecified');
  });

  it('links the post, how to apply and the company site', () => {
    const html =
      'Acme | Berlin | <a href="https:&#x2F;&#x2F;acme.com" rel="nofollow">https:&#x2F;&#x2F;acme.com</a><p>Hi';
    const doc = toJobDocument(
      row({ apply: 'https://acme.com/jobs/1' }),
      url,
      html
    );
    expect(valid(doc)).toBe(true);
    expect(doc).toMatchObject({
      url: 'https://news.ycombinator.com/item?id=42',
      apply: { url: 'https://acme.com/jobs/1' },
      companyUrl: 'https://acme.com',
    });
    const bare = toJobDocument(row(), url);
    expect(bare).not.toHaveProperty('apply');
    expect(bare).not.toHaveProperty('companyUrl');
  });

  it('marks pay absent when the post gives none', () => {
    expect(toJobDocument(row(), url).facets.salaryProvenance).toBe('absent');
  });
});
