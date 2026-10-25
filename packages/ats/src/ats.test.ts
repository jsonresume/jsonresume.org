import resume from '@jsonresume/sample-data/complete-resume.json';
import { describe, expect, it } from 'vitest';
import { checkAts, issuesOf, statusOf } from './index';

describe('checkAts', () => {
  it('scores a complete resume highly, out of 100', () => {
    const report = checkAts(resume);
    expect(report.checks.reduce((n, c) => n + c.max, 0)).toBe(100);
    expect(report.score).toBeGreaterThanOrEqual(85);
    expect(['Excellent', 'Good']).toContain(report.rating);
  });

  it('copes with nothing at all, putting the worst first', () => {
    for (const input of [null, 'nope', [], {}]) {
      const report = checkAts(input);
      expect(report.score).toBeLessThan(15);
      expect(report.rating).toBe('Needs work');
      expect(issuesOf(report)[0]?.severity).toBe('critical');
    }
  });

  it('points at the fields to fix', () => {
    const report = checkAts({
      basics: { name: 'Ada', email: 'not-an-email', label: 'Engineer' },
      work: [
        { name: 'Engines', position: 'Analyst', startDate: 'May 1843' },
        { position: 'Writer', startDate: '1850-01', endDate: '1840' },
      ],
      skills: [{ name: 'Maths', keywords: ['Analysis'] }],
    });
    const fields = issuesOf(report).map((i) => i.field);
    expect(fields).toContain('basics.email');
    expect(fields).toContain('work[0].startDate');
    expect(fields).toContain('work[1]');
    const dates = report.checks.find((c) => c.id === 'dates');
    expect(dates && statusOf(dates)).toBe('fail');
    expect(
      issuesOf(report).find((i) => i.field === 'work[1]')?.message
    ).toContain('Job 2 has no company');
  });

  it('compares dates at the precision both have', () => {
    const report = checkAts({
      work: [{ name: 'A', startDate: '2015-09', endDate: '2015' }],
    });
    expect(issuesOf(report).map((i) => i.message)).not.toContain(
      'A ends before it starts'
    );
  });

  it('never gives full marks to a check with something to fix', () => {
    const report = checkAts({
      work: [
        ...Array.from({ length: 9 }, (_, i) => ({
          name: `Co ${i}`,
          position: 'Dev',
          startDate: '2020',
          summary: 'x',
        })),
        { name: 'Various', position: 'Dev', summary: 'x' },
      ],
    });
    const work = report.checks.find((c) => c.id === 'experience');
    expect(work?.issues).toHaveLength(1);
    expect(work?.score).toBeLessThan(25);
  });

  it('never scores a check below zero or above its maximum', () => {
    const work = Array.from({ length: 12 }, () => ({ startDate: 'soon' }));
    for (const c of checkAts({ work }).checks) {
      expect(c.score).toBeGreaterThanOrEqual(0);
      expect(c.score).toBeLessThanOrEqual(c.max);
    }
  });
});
