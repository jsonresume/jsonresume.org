import { describe, expect, it } from 'vitest';
import { directionOf, noPreferences } from './preferences';

describe('directionOf', () => {
  const stated = { ...noPreferences, direction: 'Climate tech, backend' };

  it('is the direction they stated, over anything in the resume', () => {
    expect(directionOf(stated, { objective: 'Frontend lead' })).toBe(
      'Climate tech, backend'
    );
  });

  it("is the resume's objective when they stated none", () => {
    expect(
      directionOf(noPreferences, {
        objective: '  Seeking a senior backend role in climate tech ',
      })
    ).toBe('Seeking a senior backend role in climate tech');
    expect(
      directionOf(noPreferences, { objective: 'x'.repeat(600) })
    ).toHaveLength(500);
  });

  it('is empty without either', () => {
    expect(directionOf(noPreferences, { basics: { name: 'Ada' } })).toBe('');
    expect(directionOf(noPreferences, { objective: 42 })).toBe('');
    expect(directionOf(noPreferences, null)).toBe('');
    expect(directionOf(noPreferences, [])).toBe('');
  });
});
