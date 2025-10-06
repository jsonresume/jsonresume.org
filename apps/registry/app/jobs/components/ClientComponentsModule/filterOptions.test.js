import { describe, it, expect } from 'vitest';
import { JOB_TYPES, EXPERIENCE_LEVELS } from './filterOptions';

describe('filterOptions', () => {
  describe('JOB_TYPES', () => {
    it('is an array', () => {
      expect(Array.isArray(JOB_TYPES)).toBe(true);
    });

    it('contains expected job types', () => {
      expect(JOB_TYPES).toContain('Full-time');
      expect(JOB_TYPES).toContain('Part-time');
      expect(JOB_TYPES).toContain('Contract');
      expect(JOB_TYPES).toContain('Internship');
    });

    it('has 4 job types', () => {
      expect(JOB_TYPES).toHaveLength(4);
    });

    it('has no duplicate values', () => {
      const unique = [...new Set(JOB_TYPES)];
      expect(unique).toHaveLength(JOB_TYPES.length);
    });
  });

  describe('EXPERIENCE_LEVELS', () => {
    it('is an array', () => {
      expect(Array.isArray(EXPERIENCE_LEVELS)).toBe(true);
    });

    it('contains expected experience levels', () => {
      expect(EXPERIENCE_LEVELS).toContain('Entry Level');
      expect(EXPERIENCE_LEVELS).toContain('Mid Level');
      expect(EXPERIENCE_LEVELS).toContain('Senior Level');
      expect(EXPERIENCE_LEVELS).toContain('Lead');
      expect(EXPERIENCE_LEVELS).toContain('Manager');
    });

    it('has 5 experience levels', () => {
      expect(EXPERIENCE_LEVELS).toHaveLength(5);
    });

    it('has no duplicate values', () => {
      const unique = [...new Set(EXPERIENCE_LEVELS)];
      expect(unique).toHaveLength(EXPERIENCE_LEVELS.length);
    });

    it('is ordered from entry to senior', () => {
      expect(EXPERIENCE_LEVELS[0]).toBe('Entry Level');
      expect(EXPERIENCE_LEVELS[EXPERIENCE_LEVELS.length - 1]).toBe('Manager');
    });
  });
});
