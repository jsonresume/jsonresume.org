import { describe, expect, it } from 'vitest';
import { toEntry } from './listing';
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
