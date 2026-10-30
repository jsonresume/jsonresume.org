import { describe, expect, it } from 'vitest';
import { fitLimit, resumeLevel } from './level';
import { finish, retrieve, type OpenJob } from './ranking';
import { posting } from './test/fixtures';
import type { Posting } from './posting';

const now = Date.parse('2026-10-30T00:00:00Z');

describe("a resume's level", () => {
  it('reads it from titles, then from years of work', () => {
    const work = (position: string, startDate: string) => ({
      work: [{ position, startDate }],
    });
    expect(resumeLevel(work('CTO', '2024-01-01'), now)).toBe('staff_plus');
    expect(resumeLevel(work('Developer', '2011-01-01'), now)).toBe(
      'staff_plus'
    );
    expect(resumeLevel(work('Senior Engineer', '2024-01-01'), now)).toBe(
      'senior'
    );
    expect(resumeLevel(work('Developer', '2023-06-01'), now)).toBe('mid');
    expect(resumeLevel({}, now)).toBe('junior');
  });
});

describe('what caps a fit', () => {
  it('caps roles below their level, low pay, and offices it can’t place', () => {
    const job = (p: Partial<Posting>) =>
      posting({ remote: 'remote_global', ...p });
    expect(
      fitLimit(job({ seniority: 'senior' }), 'staff_plus', 'yes').cap
    ).toBe(100);
    expect(fitLimit(job({ seniority: 'mid' }), 'staff_plus', 'yes')).toEqual({
      cap: 55,
      notes: ['a mid-level role'],
    });
    expect(fitLimit(job({ seniority: 'junior' }), 'senior', 'yes').cap).toBe(
      30
    );
    expect(
      fitLimit(job({ salaryMax: 90_000 }), 'staff_plus', 'yes').notes
    ).toEqual(['pay below your level']);
    expect(fitLimit(job({ salaryMax: 90_000 }), 'senior', 'yes').cap).toBe(100);
    expect(
      fitLimit(
        posting({ remote: 'onsite', countryCode: null }),
        'mid',
        'unclear'
      ).cap
    ).toBe(50);
  });
});

const open = (id: number, p: Partial<Posting>, x: number): OpenJob => {
  const vector = new Float32Array([x, Math.sqrt(1 - x * x)]);
  return {
    row: { id, posting: posting(p), postedAt: new Date(now), months: 1 },
    vector,
    text: '',
  };
};

describe('ranking', () => {
  const resume = new Float32Array([1, 0]);
  const jobs = [
    open(1, { company: 'Close', remote: 'remote_global' }, 0.6),
    open(
      2,
      { company: 'US Only', remote: 'remote_region', remoteRegions: ['US'] },
      0.64
    ),
    open(
      3,
      {
        company: 'Cheap',
        remote: 'remote_global',
        seniority: 'mid',
        salaryMax: 60_000,
      },
      0.62
    ),
    open(4, { company: 'Close', remote: 'remote_global' }, 0.5),
  ];

  it('leaves out what they can’t take, and ranks by the model’s fit, capped', () => {
    const retrieved = retrieve(jobs, resume, resume, 'AU');
    expect(retrieved.map((r) => r.job.row.id)).toEqual([3, 1, 4]);
    const fits = new Map([
      [
        1,
        { score: 90, role: 'Agents engineer', why: 'Builds agent harnesses' },
      ],
      [3, { score: 95, role: 'Full stack', why: 'Same stack' }],
      [4, { score: 70, role: 'Platform', why: 'Infra' }],
    ]);
    const ranked = finish(retrieved, fits, 'staff_plus', new Map());
    expect(ranked.map((r) => [r.row.id, r.score])).toEqual([
      [1, 90],
      [4, 70],
      [3, 40],
    ]);
    expect(ranked[0]).toMatchObject({
      role: 'Agents engineer',
      eligible: 'yes',
    });
    expect(ranked[2]?.limits).toEqual([
      'a mid-level role',
      'pay below your level',
    ]);
  });

  it('shows a role posted twice once, unless it was marked', () => {
    const one = open(1, { company: 'Close', remote: 'remote_global' }, 0.6);
    const twice = [one, { ...one, row: { ...one.row, id: 5 } }];
    const retrieved = retrieve(twice, resume, resume, 'AU');
    expect(finish(retrieved, new Map(), 'senior', new Map())).toHaveLength(1);
    expect(
      finish(retrieved, new Map(), 'senior', new Map([[5, 'applied' as const]]))
    ).toHaveLength(2);
  });
});
