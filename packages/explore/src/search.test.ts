import { describe, expect, it } from 'vitest';
import { lastModifiedOf, toEntry } from './listing';
import { popularSkills } from './search';

const person = (username: string, keywords: string[]) =>
  toEntry({
    username,
    resume: { basics: { name: username }, skills: [{ name: 'All', keywords }] },
    updatedAt: null,
  });

describe('popularSkills', () => {
  it('shows each skill as most people write it, without compounds', () => {
    const all = [
      person('a', ['python', 'Go']),
      person('b', ['Python', 'JavaScript / TypeScript']),
      person('c', ['Python', 'JavaScript / TypeScript']),
    ].flatMap((e) => e ?? []);
    expect(popularSkills(all)).toEqual(['Python', 'Go']);
  });
});

describe('lastModifiedOf', () => {
  const now = Date.parse('2026-10-26T00:00:00Z');
  it('trusts a real date and nothing else', () => {
    expect(lastModifiedOf('2025-03-04', now)?.toISOString()).toBe(
      '2025-03-04T00:00:00.000Z'
    );
    expect(lastModifiedOf('2017-12-24T15:53:00', now)).toBeNull();
    expect(lastModifiedOf('2030-01-01', now)).toBeNull();
    expect(lastModifiedOf('soon', now)).toBeNull();
    expect(lastModifiedOf(undefined, now)).toBeNull();
  });
});
