/**
 * Tests for the pure job-row filters — the 2026-07 ranking-eval fixes:
 * word-boundary keyword matching and fail-closed min_salary.
 */
import { describe, it, expect } from 'vitest';
import {
  jobSearchText,
  buildKeywordPredicate,
  buildJobFilter,
} from './filters';
import { weightedBlend } from './vectorMath';

const job = (over = {}) => ({
  title: 'Senior AI Engineer',
  company: 'Acme',
  location: 'Remote',
  description: 'We maintain a large platform and build LLM agents.',
  skills: [{ name: 'TypeScript', keywords: ['React', 'Node'] }],
  qualifications: ['5+ years'],
  responsibilities: ['Ship features'],
  remote: 'Full',
  salary_usd: null,
  state: null,
  ...over,
});

describe('buildKeywordPredicate', () => {
  it('matches whole words only for plain queries', () => {
    const p = buildKeywordPredicate('ai');
    expect(p(job())).toBe(true); // "AI" in title
    expect(
      p(
        job({ title: 'Backend Dev', description: 'maintain available domains' })
      )
    ).toBe(false); // "ai" only inside words
  });

  it('is case-insensitive', () => {
    expect(buildKeywordPredicate('typescript')(job())).toBe(true);
  });

  it('matches multi-word phrases across whitespace', () => {
    expect(buildKeywordPredicate('ai engineer')(job())).toBe(true);
    expect(buildKeywordPredicate('rust engineer')(job())).toBe(false);
  });

  it('falls back to substring for symbol queries like c++ and .net', () => {
    const cpp = job({ description: 'Modern C++ codebase' });
    expect(buildKeywordPredicate('c++')(cpp)).toBe(true);
    const dotnet = job({ description: 'Legacy .NET WebForms app' });
    expect(buildKeywordPredicate('.net')(dotnet)).toBe(true);
    expect(buildKeywordPredicate('.net')(job())).toBe(false);
  });

  it('empty query matches everything', () => {
    expect(buildKeywordPredicate('')(job())).toBe(true);
    expect(buildKeywordPredicate(undefined)(job())).toBe(true);
  });

  it('does not match JSON structure (keys/urls are not searched)', () => {
    // "salary" is a JSON key on every row but not part of this job's text
    expect(buildKeywordPredicate('salary')(job())).toBe(false);
  });
});

describe('buildJobFilter min_salary', () => {
  it('fails closed on unknown salary by default', () => {
    const f = buildJobFilter({ minSalary: 150 });
    expect(f(job({ salary_usd: null }))).toBe(false);
    expect(f(job({ salary_usd: 200000 }))).toBe(true);
    expect(f(job({ salary_usd: 100000 }))).toBe(false);
  });

  it('includes unknown salaries when opted in', () => {
    const f = buildJobFilter({ minSalary: 150, includeUnknownSalary: true });
    expect(f(job({ salary_usd: null }))).toBe(true);
    expect(f(job({ salary_usd: 100000 }))).toBe(false);
  });

  it('no minSalary → unknown salaries pass', () => {
    const f = buildJobFilter({});
    expect(f(job({ salary_usd: null }))).toBe(true);
  });
});

describe('buildJobFilter remote + hidden states', () => {
  it('remote requires remote === Full', () => {
    const f = buildJobFilter({ remote: true });
    expect(f(job({ remote: 'Full' }))).toBe(true);
    expect(f(job({ remote: 'Hybrid' }))).toBe(false);
    expect(f(job({ remote: undefined }))).toBe(false);
  });

  it('hides not_interested/dismissed only when a stateMap is present', () => {
    const withMap = buildJobFilter({ stateMap: {} });
    expect(withMap(job({ state: 'not_interested' }))).toBe(false);
    expect(withMap(job({ state: 'interested' }))).toBe(true);
    const noMap = buildJobFilter({});
    expect(noMap(job({ state: 'not_interested' }))).toBe(true);
  });
});

describe('jobSearchText', () => {
  it('includes skills names and keywords', () => {
    const text = jobSearchText(job());
    expect(text).toContain('typescript');
    expect(text).toContain('react');
  });
});

describe('weightedBlend', () => {
  it('blends and normalizes', () => {
    const out = weightedBlend([
      [[1, 0], 0.5],
      [[0, 1], 0.5],
    ]);
    const magnitude = Math.sqrt(out[0] ** 2 + out[1] ** 2);
    expect(magnitude).toBeCloseTo(1, 10);
    expect(out[0]).toBeCloseTo(out[1], 10);
  });

  it('skips empty vectors and returns null when none usable', () => {
    expect(weightedBlend([[null, 0.5]])).toBeNull();
    const out = weightedBlend([
      [null, 0.5],
      [[3, 4], 0.5],
    ]);
    expect(out[0]).toBeCloseTo(0.6, 10);
  });
});
