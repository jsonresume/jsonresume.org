/**
 * Characterization tests for the pure helpers used by the report endpoint:
 * truncCompany, parseJobContent, extractUserSkills, normalizeSkill,
 * flattenJobSkills, skillMatches, and the EMPTY_REPORT shape. getSupabase()
 * is a thin client factory and is not unit-tested.
 */
import { describe, it, expect } from 'vitest';
import {
  truncCompany,
  parseJobContent,
  extractUserSkills,
  normalizeSkill,
  flattenJobSkills,
  skillMatches,
  EMPTY_REPORT,
} from './helpers';

describe('truncCompany', () => {
  it('returns "Unknown" for empty / nullish names', () => {
    expect(truncCompany('')).toBe('Unknown');
    expect(truncCompany(null)).toBe('Unknown');
    expect(truncCompany(undefined)).toBe('Unknown');
  });

  it('keeps a short clean company name intact', () => {
    expect(truncCompany('Acme')).toBe('Acme');
  });

  it('cuts a tagline off at the first period', () => {
    expect(truncCompany('Acme. The best widgets in town')).toBe('Acme');
  });

  it('cuts at the first comma', () => {
    expect(truncCompany('Acme, Inc')).toBe('Acme');
  });

  it('cuts at descriptive connectors like " is " / " builds "', () => {
    expect(truncCompany('Stripe is a payments company')).toBe('Stripe');
    expect(truncCompany('Vercel builds the frontend cloud')).toBe('Vercel');
    expect(truncCompany('Plaid provides banking APIs')).toBe('Plaid');
    expect(truncCompany('Notion turns notes into apps')).toBe('Notion');
  });

  it('truncates very long single-token names to 57 chars + ellipsis', () => {
    const long = 'A'.repeat(80);
    const out = truncCompany(long);
    expect(out).toHaveLength(60);
    expect(out.endsWith('...')).toBe(true);
    expect(out.slice(0, 57)).toBe('A'.repeat(57));
  });

  it('keeps a name exactly 60 chars without truncating', () => {
    const name = 'B'.repeat(60);
    expect(truncCompany(name)).toBe(name);
  });
});

describe('normalizeSkill', () => {
  it('lowercases and trims', () => {
    expect(normalizeSkill('  React  ')).toBe('react');
  });

  it.each([
    ['node', 'node.js'],
    ['nodejs', 'node.js'],
    ['React.js', 'react'],
    ['reactjs', 'react'],
    ['Vue.js', 'vue'],
    ['postgres', 'postgresql'],
    ['k8s', 'kubernetes'],
    ['TF', 'terraform'],
    ['JS', 'javascript'],
    ['es6', 'javascript'],
    ['ts', 'typescript'],
    ['py', 'python'],
    ['python3', 'python'],
    ['Go', 'golang'],
    ['cpp', 'c++'],
    ['csharp', 'c#'],
    ['gcp', 'google cloud'],
    ['Amazon Web Services', 'aws'],
    ['ci', 'ci/cd'],
    ['ml', 'machine learning'],
    ['REST API', 'rest'],
  ])('maps alias "%s" -> "%s"', (input, expected) => {
    expect(normalizeSkill(input)).toBe(expected);
  });

  it('passes through an unknown skill unchanged (lowercased)', () => {
    expect(normalizeSkill('Rust')).toBe('rust');
    expect(normalizeSkill('GraphQL')).toBe('graphql');
  });
});

describe('extractUserSkills', () => {
  it('returns empty array for a resume with no skills', () => {
    expect(extractUserSkills({})).toEqual([]);
    expect(extractUserSkills({ skills: [] })).toEqual([]);
  });

  it('collects skill names and keywords, normalized and deduped', () => {
    const resume = {
      skills: [
        { name: 'Node', keywords: ['nodejs', 'Express'] },
        { name: 'React.js', keywords: ['reactjs'] },
      ],
    };
    const out = extractUserSkills(resume);
    // node, nodejs both -> node.js; react.js, reactjs both -> react
    expect(out).toContain('node.js');
    expect(out).toContain('react');
    expect(out).toContain('express');
    // deduped
    expect(out.filter((s) => s === 'node.js')).toHaveLength(1);
    expect(out.filter((s) => s === 'react')).toHaveLength(1);
  });

  it('handles skills that have a name but no keywords', () => {
    const out = extractUserSkills({ skills: [{ name: 'Python' }] });
    expect(out).toEqual(['python']);
  });
});

describe('flattenJobSkills', () => {
  it('returns empty array when there are no skills', () => {
    expect(flattenJobSkills({})).toEqual([]);
    expect(flattenJobSkills({ skills: [] })).toEqual([]);
  });

  it('flattens object skills with name + keywords (normalized & deduped)', () => {
    const job = {
      skills: [
        { name: 'Backend', keywords: ['Node', 'Go'] },
        { name: 'Frontend', keywords: ['React.js'] },
      ],
    };
    const out = flattenJobSkills(job);
    expect(out).toContain('backend');
    expect(out).toContain('node.js');
    expect(out).toContain('golang');
    expect(out).toContain('react');
  });

  it('supports plain-string skills', () => {
    const out = flattenJobSkills({ skills: ['Python', 'k8s'] });
    expect(out).toContain('python');
    expect(out).toContain('kubernetes');
  });

  it('deduplicates skills that normalize to the same canonical form', () => {
    const job = { skills: [{ name: 'Node' }, { name: 'nodejs' }] };
    expect(flattenJobSkills(job)).toEqual(['node.js']);
  });
});

describe('skillMatches', () => {
  it('matches on exact membership', () => {
    const userSet = new Set(['react', 'node.js']);
    expect(skillMatches('react', userSet)).toBe(true);
  });

  it('matches when user skill contains the job skill (substring)', () => {
    const userSet = new Set(['rest apis']);
    expect(skillMatches('rest', userSet)).toBe(true);
  });

  it('matches when job skill contains a user skill (substring)', () => {
    const userSet = new Set(['ci/cd']);
    expect(skillMatches('ci/cd pipelines', userSet)).toBe(true);
  });

  it('returns false when there is no overlap', () => {
    const userSet = new Set(['react', 'node.js']);
    expect(skillMatches('rust', userSet)).toBe(false);
  });

  it('returns false against an empty user set', () => {
    expect(skillMatches('react', new Set())).toBe(false);
  });
});

describe('parseJobContent', () => {
  const makeJob = (content, extra = {}) => ({
    id: 1,
    gpt_content: JSON.stringify(content),
    salary_usd: 120000,
    posted_at: '2026-01-01',
    ...extra,
  });

  it('returns null when gpt_content is invalid JSON', () => {
    expect(parseJobContent({ id: 1, gpt_content: 'not json' })).toBeNull();
  });

  it('returns null when the parsed content has no title', () => {
    expect(parseJobContent(makeJob({ company: 'Acme' }))).toBeNull();
  });

  it('maps a well-formed job into the normalized shape', () => {
    const job = makeJob({
      title: 'Senior Engineer',
      company: 'Acme, Inc',
      remote: 'Full',
      experience: 'Senior',
      type: 'Full-time',
      salary: '$120k',
      skills: [{ name: 'React' }],
      location: { countryCode: 'US' },
      description: 'Build things',
    });
    const out = parseJobContent(job);
    expect(out.id).toBe(1);
    expect(out.title).toBe('Senior Engineer');
    // company is run through truncCompany
    expect(out.company).toBe('Acme');
    expect(out.remote).toBe('Full');
    expect(out.salary_usd).toBe(120000);
    expect(out.posted_at).toBe('2026-01-01');
    expect(out.skills).toEqual([{ name: 'React' }]);
  });

  it('defaults optional structured fields to null / empty array', () => {
    const out = parseJobContent(makeJob({ title: 'Eng', company: 'Acme' }));
    expect(out.salary_structured).toBeNull();
    expect(out.visa_sponsorship).toBeNull();
    expect(out.equity).toBeNull();
    expect(out.skills).toEqual([]);
  });
});

describe('EMPTY_REPORT', () => {
  it('exposes the full report shape with zeroed pipeline counts', () => {
    expect(EMPTY_REPORT.pipeline.totalJobs).toBe(0);
    expect(EMPTY_REPORT.momentum.label).toBe('no-data');
    expect(EMPTY_REPORT.salary).toEqual({
      market: null,
      interested: null,
      distribution: [],
    });
  });

  it('declares every top-level analytics section', () => {
    const keys = Object.keys(EMPTY_REPORT);
    for (const k of [
      'pipeline',
      'salary',
      'remoteIndex',
      'dealBreakers',
      'skills',
      'momentum',
      'topCompanies',
      'secondLook',
      'recentActivity',
      'antiResume',
      'skillAdjacency',
      'archetypes',
      'marketDrift',
      'readiness',
      'bestMatchSimilar',
    ]) {
      expect(keys).toContain(k);
    }
  });
});
