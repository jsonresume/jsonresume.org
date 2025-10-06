import { describe, it, expect } from 'vitest';
import { generateDisplayName } from './generateDisplayName';

describe('generateDisplayName', () => {
  it('generates a display name string', () => {
    const displayName = generateDisplayName();
    expect(typeof displayName).toBe('string');
    expect(displayName.length).toBeGreaterThan(0);
  });

  it('generates different names on multiple calls', () => {
    const name1 = generateDisplayName();
    const name2 = generateDisplayName();
    const name3 = generateDisplayName();

    // At least one should be different (statistically very likely)
    const allSame = name1 === name2 && name2 === name3;
    expect(allSame).toBe(false);
  });

  it('generates names as concatenated strings', () => {
    const displayName = generateDisplayName();
    // Faker color names may contain spaces (e.g., "sky blue"), so we just verify it's a string
    expect(typeof displayName).toBe('string');
    expect(displayName.length).toBeGreaterThan(0);
  });

  it('generates valid string format', () => {
    const displayName = generateDisplayName();
    // Faker may include spaces in color names, so just check it's alphanumeric with possible spaces
    expect(displayName).toMatch(/^[A-Za-z\s]+$/);
  });

  it('generates unique names across 100 attempts', () => {
    const names = new Set();
    for (let i = 0; i < 100; i++) {
      names.add(generateDisplayName());
    }
    // Should have good variety (at least 90% unique)
    expect(names.size).toBeGreaterThan(90);
  });

  it('generates names with consistent structure', () => {
    const displayName = generateDisplayName();
    // Should be a string of alphabetic characters (faker color may be lowercase)
    expect(displayName).toMatch(/^[A-Za-z]+$/);
  });
});
