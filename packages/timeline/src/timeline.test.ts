import resume from '@jsonresume/sample-data/complete-resume.json';
import { describe, expect, it } from 'vitest';
import { duration, monthYear, when } from './dates';
import { toTimeline } from './timeline';

describe('toTimeline', () => {
  it('puts everything dated in order, current roles first', () => {
    const t = toTimeline(resume, 'sample', '2026-10-25');
    expect(t.name).toBe(resume.basics.name);
    expect(t.items[0]?.current).toBe(true);
    expect(new Set(t.items.map((i) => i.kind))).toEqual(
      new Set(
        [
          'work',
          'education',
          'project',
          'award',
          'publication',
          'volunteer',
          'certificate',
        ].filter((k) => t.items.some((i) => i.kind === k))
      )
    );
    const ends = t.items
      .filter((i) => !i.current)
      .map((i) => i.end ?? i.start ?? '');
    expect(ends).toEqual([...ends].sort().reverse());
    expect(t.yearsWorking).toBeGreaterThan(0);
  });

  it('copes with a sparse resume', () => {
    const t = toTimeline(
      {
        work: [
          { name: 'Engines', position: 'Analyst', startDate: '1842-05' },
          { name: 'Looms', startDate: 'later' },
          'junk',
        ],
        education: [{ institution: 'Home', area: 'Maths', endDate: '1835' }],
      },
      'ada',
      '1850-01-01'
    );
    expect(t.name).toBe('ada');
    expect(t.items.map((i) => [i.title, i.at, i.current])).toEqual([
      ['Analyst', 'Engines', true],
      ['Maths', 'Home', false],
      ['Looms', null, false],
    ]);
    expect(t.yearsWorking).toBe(8);
  });
});

describe('dates', () => {
  it('reads as people write them', () => {
    expect(monthYear('2021-05-01')).toBe('May 2021');
    expect(monthYear('2019')).toBe('2019');
    expect(duration('2021-05', '2021-05')).toBe('1 mo');
    expect(duration('2019-01', '2021-03')).toBe('2 yrs 3 mos');
    const job = {
      kind: 'work' as const,
      title: 'x',
      at: null,
      summary: null,
      highlights: [],
    };
    expect(
      when({ ...job, start: '2021-05', end: null, current: true }, '2026-10')
    ).toBe('May 2021 – present · 5 yrs 6 mos');
    expect(
      when({ ...job, start: '2019', end: '2021', current: false }, '2026-10')
    ).toBe('2019 – 2021');
    expect(
      when({ ...job, start: '2020-02', end: null, current: false }, '2026-10')
    ).toBe('Feb 2020');
  });
});
