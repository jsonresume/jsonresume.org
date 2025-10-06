import { describe, it, expect } from 'vitest';
import { colors } from './constants';

describe('colors', () => {
  it('is an array', () => {
    expect(Array.isArray(colors)).toBe(true);
  });

  it('contains 20 colors', () => {
    expect(colors).toHaveLength(20);
  });

  it('contains hex color codes', () => {
    colors.forEach((color) => {
      expect(color).toMatch(/^#[0-9A-F]{6}$/i);
    });
  });

  it('has no duplicate colors', () => {
    const unique = new Set(colors);
    expect(unique.size).toBe(colors.length);
  });

  it('contains coral red as first color', () => {
    expect(colors[0]).toBe('#FF6B6B');
  });

  it('contains turquoise as second color', () => {
    expect(colors[1]).toBe('#4ECDC4');
  });

  it('all colors are uppercase hex', () => {
    colors.forEach((color) => {
      expect(color).toBe(color.toUpperCase());
    });
  });

  it('contains diverse color palette', () => {
    expect(colors).toContain('#FF6B6B'); // red
    expect(colors).toContain('#4ECDC4'); // turquoise
    expect(colors).toContain('#2ECC71'); // green
    expect(colors).toContain('#9B59B6'); // purple
  });

  it('each color starts with #', () => {
    colors.forEach((color) => {
      expect(color[0]).toBe('#');
    });
  });

  it('each color has 7 characters', () => {
    colors.forEach((color) => {
      expect(color.length).toBe(7);
    });
  });
});
