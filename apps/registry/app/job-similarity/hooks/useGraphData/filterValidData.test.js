import { describe, it, expect } from 'vitest';
import { filterValidData } from './filterValidData';

describe('filterValidData', () => {
  describe('with jobs data source', () => {
    it('filters items with valid embeddings', () => {
      const data = [
        { id: 1, embedding: [0.1, 0.2, 0.3] },
        { id: 2, embedding: null },
        { id: 3, embedding: [0.4, 0.5] },
      ];

      const result = filterValidData(data, 'jobs');

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(3);
    });

    it('removes items with empty array embeddings', () => {
      const data = [
        { id: 1, embedding: [] },
        { id: 2, embedding: [0.1] },
      ];

      const result = filterValidData(data, 'jobs');

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(2);
    });

    it('removes items with non-array embeddings', () => {
      const data = [
        { id: 1, embedding: 'invalid' },
        { id: 2, embedding: [0.1, 0.2] },
        { id: 3, embedding: { values: [0.1] } },
      ];

      const result = filterValidData(data, 'jobs');

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(2);
    });

    it('handles undefined embeddings', () => {
      const data = [{ id: 1 }, { id: 2, embedding: [0.1] }];

      const result = filterValidData(data, 'jobs');

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(2);
    });
  });

  describe('with non-jobs data source', () => {
    it('parses valid string embeddings', () => {
      const data = [
        { id: 1, embedding: '[0.1, 0.2, 0.3]' },
        { id: 2, embedding: '[0.4, 0.5]' },
      ];

      const result = filterValidData(data, 'resumes');

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(2);
    });

    it('handles already parsed array embeddings', () => {
      const data = [
        { id: 1, embedding: [0.1, 0.2] },
        { id: 2, embedding: '[0.3, 0.4]' },
      ];

      const result = filterValidData(data, 'resumes');

      expect(result).toHaveLength(2);
    });

    it('filters empty arrays from parsed JSON', () => {
      const data = [
        { id: 1, embedding: '[]' },
        { id: 2, embedding: '[0.1, 0.2]' },
      ];

      const result = filterValidData(data, 'resumes');

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(2);
    });

    it('handles null embeddings', () => {
      const data = [
        { id: 1, embedding: null },
        { id: 2, embedding: [0.1] },
      ];

      const result = filterValidData(data, 'resumes');

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(2);
    });
  });

  describe('edge cases', () => {
    it('returns empty array for empty input', () => {
      const result = filterValidData([], 'jobs');

      expect(result).toEqual([]);
    });

    it('preserves all valid items', () => {
      const data = [
        { id: 1, embedding: [0.1] },
        { id: 2, embedding: [0.2] },
        { id: 3, embedding: [0.3] },
      ];

      const result = filterValidData(data, 'jobs');

      expect(result).toHaveLength(3);
    });

    it('filters all invalid items', () => {
      const data = [
        { id: 1, embedding: null },
        { id: 2, embedding: [] },
        { id: 3, embedding: undefined },
      ];

      const result = filterValidData(data, 'jobs');

      expect(result).toEqual([]);
    });
  });
});
