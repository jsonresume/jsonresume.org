/**
 * Characterization tests for the v1 report analytics aggregators.
 * All functions here are pure; fixtures model realistic feedback rows
 * (sentiment + created_at) and parsed job objects.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  computePipeline,
  computeTimeline,
  computeSalary,
  computeRemoteIndex,
  computeDealBreakers,
  computeSkillGaps,
  computeMomentum,
  computeTopCompanies,
  computeRecentActivity,
  findSecondLookJobs,
} from './analytics';

const fb = (sentiment, createdAt, extra = {}) => ({
  sentiment,
  created_at: createdAt,
  ...extra,
});

describe('computePipeline', () => {
  it('returns all-zero counts for empty feedback', () => {
    const out = computePipeline([]);
    expect(out).toEqual({
      totalJobs: 0,
      reviewed: 0,
      interested: 0,
      maybe: 0,
      applied: 0,
      notInterested: 0,
      dossiers: 0,
    });
  });

  it('tallies each sentiment bucket', () => {
    const feedback = [
      fb('interested', '2026-01-01'),
      fb('interested', '2026-01-02'),
      fb('maybe', '2026-01-03'),
      fb('applied', '2026-01-04'),
      fb('not_interested', '2026-01-05'),
      fb('dismissed', '2026-01-06'),
      fb('dossier', '2026-01-07'),
    ];
    const out = computePipeline(feedback);
    expect(out.totalJobs).toBe(7);
    expect(out.interested).toBe(2);
    expect(out.maybe).toBe(1);
    expect(out.applied).toBe(1);
    // not_interested + dismissed collapse into notInterested
    expect(out.notInterested).toBe(2);
    expect(out.dossiers).toBe(1);
    // reviewed = total - dossiers
    expect(out.reviewed).toBe(6);
  });

  it('ignores unknown sentiment values', () => {
    const out = computePipeline([fb('wishlist', '2026-01-01')]);
    expect(out.totalJobs).toBe(1);
    expect(out.interested).toBe(0);
    expect(out.reviewed).toBe(1);
  });
});

describe('computeTimeline', () => {
  afterEach(() => vi.useRealTimers());

  it('produces one bucket per day, sorted ascending', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-10T12:00:00Z'));
    const out = computeTimeline([], 5);
    expect(out).toHaveLength(5);
    for (let i = 1; i < out.length; i++) {
      expect(out[i].date >= out[i - 1].date).toBe(true);
    }
  });

  it('bins feedback into the matching day bucket', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-10T12:00:00Z'));
    const feedback = [
      fb('interested', '2026-01-10T01:00:00Z'),
      fb('maybe', '2026-01-10T02:00:00Z'),
      fb('applied', '2026-01-09T05:00:00Z'),
      fb('dismissed', '2026-01-09T06:00:00Z'),
    ];
    const out = computeTimeline(feedback, 7);
    const day10 = out.find((d) => d.date === '2026-01-10');
    const day09 = out.find((d) => d.date === '2026-01-09');
    expect(day10.interested).toBe(1);
    expect(day10.maybe).toBe(1);
    expect(day09.applied).toBe(1);
    expect(day09.notInterested).toBe(1);
  });

  it('drops feedback outside the window', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-10T12:00:00Z'));
    const feedback = [fb('interested', '2025-12-01T00:00:00Z')];
    const out = computeTimeline(feedback, 3);
    const totalInterested = out.reduce((s, d) => s + d.interested, 0);
    expect(totalInterested).toBe(0);
  });
});

describe('computeSalary', () => {
  it('returns zeroed percentiles when no salaries present', () => {
    const out = computeSalary([], []);
    expect(out.market).toEqual({ min: 0, p25: 0, p50: 0, p75: 0, max: 0 });
    expect(out.distribution).toHaveLength(7);
  });

  it('prefers salary_usd over the salary string', () => {
    const out = computeSalary([{ salary_usd: 100000, salary: '$5/hr' }], []);
    expect(out.market.min).toBe(100000);
  });

  it('parses k-notation from the salary string fallback', () => {
    const out = computeSalary([{ salary: '$120k-150k' }], []);
    // average of 120000 and 150000
    expect(out.market.min).toBe(135000);
  });

  it('averages raw dollar figures within sane bounds', () => {
    const out = computeSalary([{ salary: '$100,000 to $150,000' }], []);
    expect(out.market.min).toBe(125000);
  });

  it('computes percentiles across a market set', () => {
    const market = [
      { salary_usd: 50000 },
      { salary_usd: 100000 },
      { salary_usd: 150000 },
      { salary_usd: 200000 },
    ];
    const out = computeSalary(market, []);
    expect(out.market.min).toBe(50000);
    expect(out.market.max).toBe(200000);
    expect(out.market.p50).toBe(150000);
  });

  it('builds a distribution histogram across salary ranges', () => {
    const market = [
      { salary_usd: 40000 }, // 0-50k
      { salary_usd: 90000 }, // 80-120k
      { salary_usd: 130000 }, // 120-160k
      { salary_usd: 350000 }, // 300k+
    ];
    const out = computeSalary(market, []);
    const byRange = Object.fromEntries(
      out.distribution.map((d) => [d.range, d.market])
    );
    expect(byRange['$0k-$50k']).toBe(1);
    expect(byRange['$80k-$120k']).toBe(1);
    expect(byRange['$120k-$160k']).toBe(1);
    expect(byRange['$300k+']).toBe(1);
  });
});

describe('computeRemoteIndex', () => {
  it('buckets jobs into full / hybrid / none case-insensitively', () => {
    const market = [
      { remote: 'Full' },
      { remote: 'full' },
      { remote: 'Hybrid' },
      { remote: 'No' },
      { remote: null },
    ];
    const out = computeRemoteIndex(market, []);
    expect(out.market.full).toBe(2);
    expect(out.market.hybrid).toBe(1);
    // 'No' and null both fall into none
    expect(out.market.none).toBe(2);
  });

  it('tracks market and interested separately', () => {
    const out = computeRemoteIndex(
      [{ remote: 'Full' }],
      [{ remote: 'Hybrid' }]
    );
    expect(out.market.full).toBe(1);
    expect(out.interested.hybrid).toBe(1);
  });
});

describe('computeDealBreakers', () => {
  it('returns empty when either accepted or rejected is empty', () => {
    expect(computeDealBreakers([], [{ remote: 'No' }])).toEqual([]);
    expect(computeDealBreakers([{ remote: 'Full' }], [])).toEqual([]);
  });

  it('surfaces a feature value that diverges between accept and reject', () => {
    const accepted = [
      { remote: 'Full' },
      { remote: 'Full' },
      { remote: 'Full' },
    ];
    const rejected = [{ remote: 'No' }, { remote: 'No' }, { remote: 'No' }];
    const out = computeDealBreakers(accepted, rejected);
    const noRemote = out.find(
      (d) => d.feature === 'remote' && d.value === 'No'
    );
    expect(noRemote).toBeDefined();
    expect(noRemote.rejectRate).toBe(1);
    expect(noRemote.acceptRate).toBe(0);
    expect(noRemote.divergence).toBe(1);
  });

  it('derives "country" from location.countryCode', () => {
    const accepted = [{ location: { countryCode: 'US' } }];
    const rejected = [
      { location: { countryCode: 'IN' } },
      { location: { countryCode: 'IN' } },
    ];
    const out = computeDealBreakers(accepted, rejected);
    const inCountry = out.find(
      (d) => d.feature === 'country' && d.value === 'IN'
    );
    expect(inCountry).toBeDefined();
    expect(inCountry.divergence).toBeGreaterThan(0);
  });

  it('ignores divergences at or below the 0.05 threshold', () => {
    // identical distributions => zero divergence => filtered out
    const accepted = [{ type: 'Full-time' }, { type: 'Contract' }];
    const rejected = [{ type: 'Full-time' }, { type: 'Contract' }];
    expect(computeDealBreakers(accepted, rejected)).toEqual([]);
  });
});

describe('computeSkillGaps', () => {
  it('lists the most demanded market skills', () => {
    const market = [
      { skills: [{ name: 'React' }] },
      { skills: [{ name: 'React' }] },
      { skills: [{ name: 'Go' }] },
    ];
    const out = computeSkillGaps(market, [], []);
    expect(out.topDemanded[0]).toEqual({ skill: 'react', count: 2 });
  });

  it('reports interested-job skills the user lacks as gaps', () => {
    const interested = [
      { skills: [{ name: 'Rust' }] },
      { skills: [{ name: 'Rust' }] },
    ];
    const out = computeSkillGaps([], interested, ['react']);
    const rustGap = out.gaps.find((g) => g.skill === 'rust');
    expect(rustGap).toBeDefined();
    expect(rustGap.count).toBe(2);
  });

  it('excludes skills the user already has from gaps', () => {
    const interested = [{ skills: [{ name: 'React' }] }];
    const out = computeSkillGaps([], interested, ['react']);
    expect(out.gaps.find((g) => g.skill === 'react')).toBeUndefined();
  });

  it('echoes back the userSkills passed in', () => {
    const out = computeSkillGaps([], [], ['react', 'node.js']);
    expect(out.userSkills).toEqual(['react', 'node.js']);
  });
});

describe('computeMomentum', () => {
  afterEach(() => vi.useRealTimers());

  it('labels acceleration when this week outpaces last week', () => {
    vi.useFakeTimers();
    const now = new Date('2026-06-15T12:00:00Z');
    vi.setSystemTime(now);
    const feedback = [
      fb('interested', '2026-06-14T00:00:00Z'),
      fb('interested', '2026-06-13T00:00:00Z'),
      fb('maybe', '2026-06-12T00:00:00Z'),
      // last week: one item ~10 days ago
      fb('applied', '2026-06-05T00:00:00Z'),
    ];
    const out = computeMomentum(feedback);
    expect(out.reviewsThisWeek).toBe(3);
    expect(out.reviewsLastWeek).toBe(1);
    expect(out.label).toBe('accelerating');
    expect(out.score).toBeGreaterThan(20);
  });

  it('excludes dossier sentiment from momentum', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-15T12:00:00Z'));
    const feedback = [
      fb('dossier', '2026-06-14T00:00:00Z'),
      fb('dossier', '2026-06-13T00:00:00Z'),
    ];
    const out = computeMomentum(feedback);
    expect(out.reviewsThisWeek).toBe(0);
  });

  it('clamps the score into [-100, 100]', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-15T12:00:00Z'));
    const feedback = Array.from({ length: 50 }, () =>
      fb('interested', '2026-06-14T00:00:00Z')
    );
    const out = computeMomentum(feedback);
    expect(out.score).toBeLessThanOrEqual(100);
    expect(out.score).toBeGreaterThanOrEqual(-100);
  });
});

describe('computeTopCompanies', () => {
  it('ranks companies by review count, capped at 10', () => {
    const feedback = [
      fb('interested', '2026-01-01', { job_company: 'Acme' }),
      fb('maybe', '2026-01-02', { job_company: 'Acme' }),
      fb('applied', '2026-01-03', { job_company: 'Globex' }),
    ];
    const out = computeTopCompanies(feedback);
    expect(out[0].company).toBe('Acme');
    expect(out[0].count).toBe(2);
  });

  it('reports the dominant sentiment per company', () => {
    const feedback = [
      fb('interested', '2026-01-01', { job_company: 'Acme' }),
      fb('interested', '2026-01-02', { job_company: 'Acme' }),
      fb('maybe', '2026-01-03', { job_company: 'Acme' }),
    ];
    const out = computeTopCompanies(feedback);
    expect(out[0].sentiment).toBe('interested');
  });

  it('runs company names through truncCompany', () => {
    const feedback = [
      fb('interested', '2026-01-01', { job_company: 'Acme, Inc' }),
    ];
    const out = computeTopCompanies(feedback);
    expect(out[0].company).toBe('Acme');
  });
});

describe('computeRecentActivity', () => {
  it('excludes dossier rows and sorts newest first', () => {
    const feedback = [
      fb('interested', '2026-01-01T00:00:00Z', {
        job_company: 'Acme',
        job_title: 'Eng',
      }),
      fb('maybe', '2026-01-05T00:00:00Z', {
        job_company: 'Globex',
        job_title: 'Dev',
      }),
      fb('dossier', '2026-01-09T00:00:00Z', { job_company: 'Hidden' }),
    ];
    const out = computeRecentActivity(feedback);
    expect(out).toHaveLength(2);
    expect(out[0].company).toBe('Globex'); // newest non-dossier
    expect(out.find((a) => a.company === 'Hidden')).toBeUndefined();
  });

  it('defaults a missing title to "Unknown"', () => {
    const out = computeRecentActivity([
      fb('interested', '2026-01-01T00:00:00Z', { job_company: 'Acme' }),
    ]);
    expect(out[0].title).toBe('Unknown');
  });

  it('caps output at 20 items', () => {
    const feedback = Array.from({ length: 30 }, (_, i) =>
      fb(
        'interested',
        `2026-01-${String((i % 28) + 1).padStart(2, '0')}T00:00:00Z`,
        {
          job_company: `Co${i}`,
        }
      )
    );
    expect(computeRecentActivity(feedback)).toHaveLength(20);
  });
});

describe('findSecondLookJobs', () => {
  it('returns empty when interested or rejected is empty', () => {
    expect(findSecondLookJobs([], [{ skills: [] }], [])).toEqual([]);
    expect(findSecondLookJobs([{ skills: [] }], [], [])).toEqual([]);
  });

  it('surfaces rejected jobs that share skills with interested jobs', () => {
    const interested = [{ skills: [{ name: 'React' }, { name: 'Go' }] }];
    const rejected = [
      { id: 1, title: 'A', skills: [{ name: 'React' }] }, // overlap 1
      { id: 2, title: 'B', skills: [{ name: 'COBOL' }] }, // overlap 0
    ];
    const out = findSecondLookJobs(rejected, interested, []);
    expect(out).toHaveLength(1);
    expect(out[0].id).toBe(1);
  });

  it('strips the internal _overlap field from results', () => {
    const interested = [{ skills: [{ name: 'React' }] }];
    const rejected = [{ id: 1, skills: [{ name: 'React' }] }];
    const out = findSecondLookJobs(rejected, interested, []);
    expect(out[0]._overlap).toBeUndefined();
  });

  it('sorts by descending overlap and caps at 5', () => {
    const interested = [
      { skills: [{ name: 'React' }, { name: 'Go' }, { name: 'AWS' }] },
    ];
    const rejected = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      skills: [{ name: 'React' }],
    }));
    // give one job a higher overlap
    rejected[3].skills = [{ name: 'React' }, { name: 'Go' }, { name: 'AWS' }];
    const out = findSecondLookJobs(rejected, interested, []);
    expect(out).toHaveLength(5);
    expect(out[0].id).toBe(3);
  });
});
