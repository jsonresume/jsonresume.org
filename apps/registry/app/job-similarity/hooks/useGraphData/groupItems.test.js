import { describe, it, expect } from 'vitest';
import { groupItems } from './groupItems';

describe('groupItems', () => {
  describe('with jobs data source', () => {
    it('groups items by title', () => {
      const data = [
        { id: 1, title: 'Developer' },
        { id: 2, title: 'Developer' },
        { id: 3, title: 'Designer' },
      ];

      const result = groupItems(data, 'jobs');

      expect(result.Developer).toHaveLength(2);
      expect(result.Designer).toHaveLength(1);
    });

    it('creates array for each unique title', () => {
      const data = [
        { id: 1, title: 'Engineer' },
        { id: 2, title: 'Manager' },
      ];

      const result = groupItems(data, 'jobs');

      expect(result.Engineer).toEqual([{ id: 1, title: 'Engineer' }]);
      expect(result.Manager).toEqual([{ id: 2, title: 'Manager' }]);
    });

    it('preserves item data in groups', () => {
      const data = [
        { id: 1, title: 'Dev', company: 'Acme' },
        { id: 2, title: 'Dev', company: 'Corp' },
      ];

      const result = groupItems(data, 'jobs');

      expect(result.Dev[0].company).toBe('Acme');
      expect(result.Dev[1].company).toBe('Corp');
    });
  });

  describe('with non-jobs data source', () => {
    it('groups items by position', () => {
      const data = [
        { id: 1, position: 'Developer' },
        { id: 2, position: 'Developer' },
        { id: 3, position: 'Designer' },
      ];

      const result = groupItems(data, 'resumes');

      expect(result.Developer).toHaveLength(2);
      expect(result.Designer).toHaveLength(1);
    });

    it('uses "Unknown Position" for missing position', () => {
      const data = [{ id: 1 }, { id: 2, position: 'Dev' }];

      const result = groupItems(data, 'resumes');

      expect(result['Unknown Position']).toHaveLength(1);
      expect(result['Dev']).toHaveLength(1);
    });

    it('groups items with null position as Unknown', () => {
      const data = [
        { id: 1, position: null },
        { id: 2, position: null },
      ];

      const result = groupItems(data, 'resumes');

      expect(result['Unknown Position']).toHaveLength(2);
    });
  });

  describe('edge cases', () => {
    it('returns empty object for empty data', () => {
      const result = groupItems([], 'jobs');

      expect(result).toEqual({});
    });

    it('handles single item', () => {
      const data = [{ id: 1, title: 'Dev' }];

      const result = groupItems(data, 'jobs');

      expect(Object.keys(result)).toHaveLength(1);
      expect(result.Dev).toHaveLength(1);
    });

    it('handles all items with same label', () => {
      const data = [
        { id: 1, title: 'Dev' },
        { id: 2, title: 'Dev' },
        { id: 3, title: 'Dev' },
      ];

      const result = groupItems(data, 'jobs');

      expect(Object.keys(result)).toHaveLength(1);
      expect(result.Dev).toHaveLength(3);
    });

    it('maintains insertion order within groups', () => {
      const data = [
        { id: 1, title: 'Dev' },
        { id: 2, title: 'Dev' },
      ];

      const result = groupItems(data, 'jobs');

      expect(result.Dev[0].id).toBe(1);
      expect(result.Dev[1].id).toBe(2);
    });

    it('creates separate groups for different cases', () => {
      const data = [
        { id: 1, title: 'developer' },
        { id: 2, title: 'Developer' },
      ];

      const result = groupItems(data, 'jobs');

      expect(result.developer).toHaveLength(1);
      expect(result.Developer).toHaveLength(1);
    });
  });
});
