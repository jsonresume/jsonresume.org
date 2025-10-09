import { describe, it, expect, vi } from 'vitest';
import { generateDisplayName } from './generateDisplayName';

// Mock faker
vi.mock('@faker-js/faker', () => ({
  faker: {
    person: {
      firstName: vi.fn(() => 'John'),
    },
    animal: {
      type: vi.fn(() => 'Dog'),
    },
    color: {
      human: vi.fn(() => 'Blue'),
    },
  },
}));

describe('generateDisplayName', () => {
  it('generates display name with format ColorFirstNameAnimal', () => {
    const name = generateDisplayName();

    expect(name).toBe('BlueJohnDog');
  });

  it('returns a string', () => {
    const name = generateDisplayName();

    expect(typeof name).toBe('string');
  });

  it('returns non-empty string', () => {
    const name = generateDisplayName();

    expect(name.length).toBeGreaterThan(0);
  });

  it('concatenates parts without separators', () => {
    const name = generateDisplayName();

    expect(name).not.toContain(' ');
    expect(name).not.toContain('-');
    expect(name).not.toContain('_');
  });

  it('includes color component', () => {
    const name = generateDisplayName();

    expect(name).toContain('Blue');
  });

  it('includes firstName component', () => {
    const name = generateDisplayName();

    expect(name).toContain('John');
  });

  it('includes animal component', () => {
    const name = generateDisplayName();

    expect(name).toContain('Dog');
  });

  it('maintains correct order: color-firstName-animal', () => {
    const name = generateDisplayName();

    expect(name.indexOf('Blue')).toBe(0);
    expect(name.indexOf('John')).toBe(4);
    expect(name.indexOf('Dog')).toBe(8);
  });
});
