/**
 * Characterization tests for the v2 report analytics:
 * anti-resume, skill adjacency, archetypes, market drift, readiness scores,
 * and best-match similarity. All functions are pure over parsed job objects.
 */
import { describe, it, expect } from 'vitest';
import {
  computeAntiResume,
  computeSkillAdjacency,
  computeArchetypes,
  computeMarketDrift,
  computeReadinessScores,
  computeBestMatchSimilar,
} from './analytics-v2';

const job = (overrides = {}) => ({
  id: Math.random(),
  title: 'Engineer',
  company: 'Acme',
  skills: [],
  ...overrides,
});

describe('computeAntiResume', () => {
  it('returns empty structure when there are no rejected jobs', () => {
    expect(computeAntiResume([job()], [])).toEqual({
      skills: [],
      attributes: [],
    });
  });

  it('flags skills over-represented in rejections as avoid skills', () => {
    const rejected = [
      job({ skills: [{ name: 'PHP' }] }),
      job({ skills: [{ name: 'PHP' }] }),
      job({ skills: [{ name: 'PHP' }] }),
    ];
    const interested = [job({ skills: [{ name: 'React' }] })];
    const out = computeAntiResume(interested, rejected);
    const php = out.skills.find((s) => s.skill === 'php');
    expect(php).toBeDefined();
    expect(php.rejCount).toBe(3);
    expect(php.intCount).toBe(0);
    expect(php.avoidScore).toBeGreaterThan(0.05);
  });

  it('flags attribute values (remote/experience/type) skewed toward rejection', () => {
    const rejected = [
      job({ remote: 'No' }),
      job({ remote: 'No' }),
      job({ remote: 'No' }),
    ];
    const interested = [job({ remote: 'Full' })];
    const out = computeAntiResume(interested, rejected);
    const attr = out.attributes.find(
      (a) => a.attribute === 'remote' && a.value === 'No'
    );
    expect(attr).toBeDefined();
    expect(attr.avoidScore).toBeGreaterThan(0.1);
  });

  it('does not flag skills present equally in both sets', () => {
    const rejected = [job({ skills: [{ name: 'React' }] })];
    const interested = [job({ skills: [{ name: 'React' }] })];
    const out = computeAntiResume(interested, rejected);
    expect(out.skills.find((s) => s.skill === 'react')).toBeUndefined();
  });
});

describe('computeSkillAdjacency', () => {
  it('recommends skills that co-occur with the user skills but they lack', () => {
    const market = [
      job({ skills: [{ name: 'React' }, { name: 'GraphQL' }] }),
      job({ skills: [{ name: 'React' }, { name: 'GraphQL' }] }),
    ];
    const out = computeSkillAdjacency(market, ['react']);
    const rec = out.find((r) => r.skill === 'graphql');
    expect(rec).toBeDefined();
    expect(rec.because).toBe('react');
    expect(rec.coCount).toBe(2);
  });

  it('does not recommend skills the user already has', () => {
    const market = [job({ skills: [{ name: 'React' }, { name: 'GraphQL' }] })];
    const out = computeSkillAdjacency(market, ['react', 'graphql']);
    expect(out).toEqual([]);
  });

  it('returns empty when no user skill appears in the market', () => {
    const market = [job({ skills: [{ name: 'COBOL' }, { name: 'Fortran' }] })];
    const out = computeSkillAdjacency(market, ['react']);
    expect(out).toEqual([]);
  });
});

describe('computeArchetypes', () => {
  it('returns empty when fewer than 3 interested jobs', () => {
    expect(computeArchetypes([job(), job()])).toEqual([]);
  });

  it('groups jobs sharing their top-3 skill signature', () => {
    const skills = [{ name: 'React' }, { name: 'Node' }, { name: 'AWS' }];
    const interested = [
      job({ title: 'A', skills }),
      job({ title: 'B', skills }),
      job({ title: 'C', skills }),
    ];
    const out = computeArchetypes(interested);
    expect(out.length).toBeGreaterThanOrEqual(1);
    expect(out[0].count).toBe(3);
    expect(out[0].titles).toContain('A');
  });

  it('drops groups with fewer than 2 jobs', () => {
    const interested = [
      job({ skills: [{ name: 'React' }, { name: 'Node' }, { name: 'AWS' }] }),
      job({ skills: [{ name: 'React' }, { name: 'Node' }, { name: 'AWS' }] }),
      job({ skills: [{ name: 'Rust' }, { name: 'WASM' }, { name: 'C++' }] }),
    ];
    const out = computeArchetypes(interested);
    // only the 2-job React/Node/AWS group survives
    expect(out).toHaveLength(1);
    expect(out[0].count).toBe(2);
  });
});

describe('computeMarketDrift', () => {
  it('returns empty trends when no jobs are provided', () => {
    expect(computeMarketDrift([])).toEqual({
      trends: [],
      growing: [],
      declining: [],
    });
  });

  it('returns trends but no growing/declining with a single week', () => {
    const jobs = [
      job({ posted_at: '2026-01-05', skills: [{ name: 'React' }] }), // a Monday
      job({ posted_at: '2026-01-06', skills: [{ name: 'Go' }] }),
    ];
    const out = computeMarketDrift(jobs);
    expect(out.trends.length).toBe(1);
    expect(out.growing).toEqual([]);
    expect(out.declining).toEqual([]);
  });

  it('detects skills growing and declining between first and last week', () => {
    const jobs = [
      // week 1: React absent, Go present
      job({ posted_at: '2026-01-05', skills: [{ name: 'Go' }] }),
      job({ posted_at: '2026-01-06', skills: [{ name: 'Go' }] }),
      // week 3: React present, Go absent
      job({ posted_at: '2026-01-19', skills: [{ name: 'React' }] }),
      job({ posted_at: '2026-01-20', skills: [{ name: 'React' }] }),
    ];
    const out = computeMarketDrift(jobs);
    expect(out.trends.length).toBeGreaterThanOrEqual(2);
    expect(out.growing.some((g) => g.skill === 'react')).toBe(true);
    expect(out.declining.some((d) => d.skill === 'golang')).toBe(true);
  });
});

describe('computeReadinessScores', () => {
  const resume = {
    work: [{ startDate: '2018-01-01', endDate: '2025-01-01' }], // ~7 yrs
    basics: { location: { countryCode: 'US' } },
  };
  const salaryStats = { market: { p25: 80000, p50: 120000, p75: 160000 } };

  it('returns one entry per interested job (capped at 8)', () => {
    const jobs = Array.from({ length: 12 }, (_, i) =>
      job({ id: i, skills: [{ name: 'React' }] })
    );
    const out = computeReadinessScores(jobs, ['react'], resume, salaryStats);
    expect(out).toHaveLength(8);
  });

  it('scores a full skill match at 100', () => {
    const jobs = [job({ skills: [{ name: 'React' }] })];
    const out = computeReadinessScores(jobs, ['react'], resume, salaryStats);
    expect(out[0].scores.skills).toBe(100);
    expect(out[0].matchedSkills).toContain('react');
  });

  it('lists missing skills the user lacks', () => {
    const jobs = [job({ skills: [{ name: 'React' }, { name: 'Rust' }] })];
    const out = computeReadinessScores(jobs, ['react'], resume, salaryStats);
    expect(out[0].missingSkills).toContain('rust');
    expect(out[0].scores.skills).toBe(50);
  });

  it('rewards a senior role for a candidate with 5+ years', () => {
    const jobs = [job({ experience: 'Senior', skills: [{ name: 'React' }] })];
    const out = computeReadinessScores(jobs, ['react'], resume, salaryStats);
    expect(out[0].scores.experience).toBe(100);
  });

  it('scores salary against market percentiles', () => {
    const jobs = [
      job({ salary_usd: 200000, skills: [{ name: 'React' }] }), // >= p75
    ];
    const out = computeReadinessScores(jobs, ['react'], resume, salaryStats);
    expect(out[0].scores.salary).toBe(95);
  });

  it('boosts remote=full location compatibility', () => {
    const jobs = [job({ remote: 'Full', skills: [{ name: 'React' }] })];
    const out = computeReadinessScores(jobs, ['react'], resume, salaryStats);
    expect(out[0].scores.location).toBe(95);
    expect(out[0].scores.remote).toBe(95);
  });

  it('computes overall as the mean of the six sub-scores', () => {
    const jobs = [job({ skills: [{ name: 'React' }] })];
    const out = computeReadinessScores(jobs, ['react'], resume, salaryStats);
    const s = out[0].scores;
    const mean = Math.round(
      (s.skills + s.experience + s.remote + s.salary + s.location + s.visa) / 6
    );
    expect(out[0].overall).toBe(mean);
  });
});

describe('computeBestMatchSimilar', () => {
  it('returns empty when there are no interested jobs', () => {
    const allJobs = Array.from({ length: 6 }, (_, i) => job({ id: i }));
    expect(computeBestMatchSimilar([], allJobs, [])).toEqual([]);
  });

  it('returns empty when there are fewer than 5 parsed jobs', () => {
    const interested = [job({ skills: [{ name: 'React' }] })];
    expect(computeBestMatchSimilar(interested, [job(), job()], [])).toEqual([]);
  });

  it('suggests unreviewed jobs that overlap >= 2 skills with liked jobs', () => {
    const interested = [
      job({
        id: 'liked',
        title: 'Liked',
        company: 'Likedco',
        skills: [{ name: 'React' }, { name: 'Node' }, { name: 'AWS' }],
      }),
    ];
    const allJobs = [
      job({ id: 1, skills: [{ name: 'React' }, { name: 'Node' }] }), // overlap 2
      job({ id: 2, skills: [{ name: 'COBOL' }] }), // overlap 0
      job({ id: 3, skills: [{ name: 'React' }] }), // overlap 1
      job({ id: 4, skills: [] }),
      job({ id: 5, skills: [] }),
    ];
    const out = computeBestMatchSimilar(interested, allJobs, []);
    expect(out.some((j) => j.id === 1)).toBe(true);
    expect(out.some((j) => j.id === 2)).toBe(false);
    expect(out.some((j) => j.id === 3)).toBe(false); // overlap 1 < 2
    const match = out.find((j) => j.id === 1);
    expect(match.similarTo).toEqual({ title: 'Liked', company: 'Likedco' });
  });

  it('excludes already-reviewed jobs by id', () => {
    const interested = [
      job({ skills: [{ name: 'React' }, { name: 'Node' }, { name: 'AWS' }] }),
    ];
    const allJobs = [
      job({ id: 1, skills: [{ name: 'React' }, { name: 'Node' }] }),
      job({ id: 2, skills: [{ name: 'React' }, { name: 'Node' }] }),
      job({ id: 3, skills: [] }),
      job({ id: 4, skills: [] }),
      job({ id: 5, skills: [] }),
    ];
    const out = computeBestMatchSimilar(interested, allJobs, [1]);
    expect(out.some((j) => j.id === 1)).toBe(false);
    expect(out.some((j) => j.id === 2)).toBe(true);
  });
});
