import { describe, expect, it } from 'vitest';
import { titleOf, toSummary } from './summary';
import { posting } from './test/fixtures';

describe('a job as listed', () => {
  it('names a post without a title, rather than showing the placeholder', () => {
    const row = (title: string) => ({
      id: 1,
      posting: posting({ title }),
      postedAt: new Date('2026-11-01T00:00:00Z'),
      months: 1,
    });
    expect(titleOf(posting({ title: 'unspecified' }))).toBe('');
    expect(toSummary(row('')).title).toBe('Open roles');
    expect(toSummary(row(' Staff Engineer ')).title).toBe('Staff Engineer');
  });
});
