import { describe, it, expect } from 'vitest';
import { filterValidData } from './filterValidData';

describe('filterValidData', () => {
  describe('jobs data source', () => {
    it('filters out items without embeddings', () => {
      const data = [
        { id: 1, title: 'Developer', embedding: [0.1, 0.2, 0.3] },
        { id: 2, title: 'Designer', embedding: null },
        { id: 3, title: 'Manager', embedding: [0.4, 0.5] },
      ];

      const result = filterValidData(data, 'jobs');

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(3);
    });

    it('filters out items with empty embeddings', () => {
      const data = [
        { id: 1, title: 'Developer', embedding: [0.1, 0.2] },
        { id: 2, title: 'Designer', embedding: [] },
        { id: 3, title: 'Manager', embedding: [0.3] },
      ];

      const result = filterValidData(data, 'jobs');

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(3);
    });

    it('filters out items with non-array embeddings', () => {
      const data = [
        { id: 1, title: 'Developer', embedding: [0.1, 0.2] },
        { id: 2, title: 'Designer', embedding: 'invalid' },
        { id: 3, title: 'Manager', embedding: { value: 0.1 } },
      ];

      const result = filterValidData(data, 'jobs');

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    it('returns empty array when all items invalid', () => {
      const data = [
        { id: 1, title: 'Developer', embedding: null },
        { id: 2, title: 'Designer', embedding: [] },
        { id: 3, title: 'Manager', embedding: undefined },
      ];

      const result = filterValidData(data, 'jobs');

      expect(result).toEqual([]);
    });
  });

  describe('resumes data source', () => {
    it('parses string embeddings and filters valid', () => {
      const data = [
        { id: 1, position: 'Developer', embedding: '[0.1, 0.2, 0.3]' },
        { id: 2, position: 'Designer', embedding: '[]' },
        { id: 3, position: 'Manager', embedding: '[0.4, 0.5]' },
      ];

      const result = filterValidData(data, 'resumes');

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(3);
    });

    it('handles already-parsed array embeddings', () => {
      const data = [
        { id: 1, position: 'Developer', embedding: [0.1, 0.2, 0.3] },
        { id: 2, position: 'Designer', embedding: [] },
        { id: 3, position: 'Manager', embedding: [0.4, 0.5] },
      ];

      const result = filterValidData(data, 'resumes');

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(3);
    });

    it('handles invalid JSON strings', () => {
      const data = [
        { id: 1, position: 'Developer', embedding: '[0.1, 0.2]' },
        { id: 2, position: 'Designer', embedding: 'invalid json' },
        { id: 3, position: 'Manager', embedding: '[0.3]' },
      ];

      // Invalid JSON will throw and item will be filtered out
      expect(() => filterValidData(data, 'resumes')).toThrow();
    });

    it('filters null and undefined embeddings', () => {
      const data = [
        { id: 1, position: 'Developer', embedding: '[0.1, 0.2]' },
        { id: 2, position: 'Designer', embedding: null },
        { id: 3, position: 'Manager', embedding: undefined },
      ];

      const result = filterValidData(data, 'resumes');

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });
  });

  it('handles empty data array', () => {
    expect(filterValidData([], 'jobs')).toEqual([]);
    expect(filterValidData([], 'resumes')).toEqual([]);
  });

  it('handles mixed valid and invalid embeddings', () => {
    const data = [
      { id: 1, title: 'Dev 1', embedding: [0.1] },
      { id: 2, title: 'Dev 2', embedding: null },
      { id: 3, title: 'Dev 3', embedding: [0.2, 0.3] },
      { id: 4, title: 'Dev 4', embedding: [] },
      { id: 5, title: 'Dev 5', embedding: [0.4] },
    ];

    const result = filterValidData(data, 'jobs');

    expect(result).toHaveLength(3);
    expect(result.map((r) => r.id)).toEqual([1, 3, 5]);
  });
});
