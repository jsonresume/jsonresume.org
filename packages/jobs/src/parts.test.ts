import { Option } from 'effect';
import { describe, expect, it } from 'vitest';
import { companyKey, repostFamilies } from './families';
import { fromLegacy } from './legacy';
import { embeddingText } from './posting';
import { postParagraphs } from './postText';
import { resumeText } from './resumeText';
import { posting, wordVector } from './test/fixtures';
import { fromBytes, toBytes } from './vectors';

describe('postParagraphs', () => {
  it('reads HN comment HTML as text, keeping full link URLs', () => {
    expect(
      postParagraphs(
        'Acme | REMOTE (US) | $150k<p>We&#x27;re hiring &amp; growing: <a href="https:&#x2F;&#x2F;acme.com&#x2F;jobs" rel="nofollow">https:&#x2F;&#x2F;acme.com&#x2F;...</a><p><i>no recruiters</i>'
      )
    ).toEqual([
      'Acme | REMOTE (US) | $150k',
      "We're hiring & growing: https://acme.com/jobs",
      'no recruiters',
    ]);
  });
});

describe('fromLegacy', () => {
  it("maps the registry's parsed JSON, trusting only stated salaries", () => {
    const legacy = JSON.stringify({
      title: 'Software Developer',
      company: 'Odoo',
      location: { city: null, countryCode: 'BE', region: 'Belgium' },
      remote: 'Hybrid',
      salary: '€60k',
      salary_structured: { min: 65000, max: 65000 },
      visa_sponsorship: 'Yes',
      skills: [{ name: 'Python', keywords: ['ORM'] }, { name: null }],
      responsibilities: ['Build apps', null],
      application: 'https://odoo.com/jobs',
      facets: {
        remote_scope: 'hybrid',
        seniority: 'unspecified',
        salary_provenance: 'inferred',
        employment_type: 'full_time',
      },
    });
    expect(Option.getOrThrow(fromLegacy(legacy))).toMatchObject({
      title: 'Software Developer',
      countryCode: 'BE',
      remote: 'hybrid',
      employmentType: 'full_time',
      salary: '€60k',
      salaryMin: null,
      visa: 'yes',
      skills: [{ name: 'Python', keywords: ['ORM'] }],
      responsibilities: ['Build apps'],
      apply: 'https://odoo.com/jobs',
    });
  });

  it('has nothing for failed or untitled rows', () => {
    expect(Option.isNone(fromLegacy('FAILED'))).toBe(true);
    expect(Option.isNone(fromLegacy('{"company":"Acme"}'))).toBe(true);
  });
});

describe('repostFamilies', () => {
  const at = (month: number) => new Date(Date.UTC(2026, month, 2));
  const same = wordVector('backend engineer go postgres');
  it('joins one company’s near-identical posts across months', () => {
    const families = repostFamilies([
      { id: 1, company: 'Acme Inc.', postedAt: at(7), vector: same },
      { id: 2, company: 'ACME', postedAt: at(8), vector: same },
      { id: 3, company: 'Acme', postedAt: at(9), vector: same },
      {
        id: 4,
        company: 'Acme',
        postedAt: at(9),
        vector: wordVector('sales lead'),
      },
      { id: 5, company: 'Other', postedAt: at(9), vector: same },
    ]);
    expect(families.map((f) => [f.id, f.familyId, f.months])).toEqual([
      [1, 1, 3],
      [2, 1, 3],
      [3, 1, 3],
      [4, 4, 1],
      [5, 5, 1],
    ]);
  });

  it('normalizes company names', () => {
    expect(companyKey('Acme, Inc. (YC W24)')).toBe('acme');
  });
});

it('embeds the parsed fields, not prose about them', () => {
  const text = embeddingText(
    posting({ remote: 'remote_region', remoteRegions: ['US'] })
  );
  expect(text).toContain('Software Engineer at Acme');
  expect(text).toContain('Remote: US');
  expect(text).toContain('TypeScript: React');
});

it('reads a resume as text to match against', () => {
  expect(
    resumeText({
      basics: { label: 'Engineer', email: 'a@b.c', location: { city: 'Oslo' } },
      skills: [{ name: 'Go', keywords: ['gRPC'] }],
      work: [{ position: 'Lead', name: 'Acme', highlights: ['Shipped'] }],
    })
  ).toBe('Engineer\nGo: gRPC\nLead at Acme\nShipped');
});

it('stores vectors as bytes and back', () => {
  const v = wordVector('a b c');
  expect(fromBytes(toBytes(v))).toEqual(v);
});
