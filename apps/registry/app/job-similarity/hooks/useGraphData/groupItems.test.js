import { describe, it, expect } from 'vitest';
import { groupItems } from './groupItems';

describe('groupItems', () => {
  describe('jobs data source', () => {
    it('groups jobs by title', () => {
      const data = [
        { id: 1, title: 'Software Developer', embedding: [0.1] },
        { id: 2, title: 'Software Developer', embedding: [0.2] },
        { id: 3, title: 'Product Manager', embedding: [0.3] },
      ];

      const result = groupItems(data, 'jobs');

      expect(Object.keys(result)).toHaveLength(2);
      expect(result['Software Developer']).toHaveLength(2);
      expect(result['Product Manager']).toHaveLength(1);
    });

    it('creates separate groups for different titles', () => {
      const data = [
        { id: 1, title: 'Developer', embedding: [0.1] },
        { id: 2, title: 'Designer', embedding: [0.2] },
        { id: 3, title: 'Manager', embedding: [0.3] },
      ];

      const result = groupItems(data, 'jobs');

      expect(Object.keys(result)).toHaveLength(3);
      expect(result['Developer']).toEqual([data[0]]);
      expect(result['Designer']).toEqual([data[1]]);
      expect(result['Manager']).toEqual([data[2]]);
    });
  });

  describe('resumes data source', () => {
    it('groups resumes by position', () => {
      const data = [
        { id: 1, position: 'Frontend Developer', embedding: [0.1] },
        { id: 2, position: 'Frontend Developer', embedding: [0.2] },
        { id: 3, position: 'Backend Developer', embedding: [0.3] },
      ];

      const result = groupItems(data, 'resumes');

      expect(Object.keys(result)).toHaveLength(2);
      expect(result['Frontend Developer']).toHaveLength(2);
      expect(result['Backend Developer']).toHaveLength(1);
    });

    it('uses "Unknown Position" for missing positions', () => {
      const data = [
        { id: 1, position: 'Developer', embedding: [0.1] },
        { id: 2, embedding: [0.2] }, // No position
        { id: 3, position: null, embedding: [0.3] }, // Null position
      ];

      const result = groupItems(data, 'resumes');

      expect(result['Developer']).toHaveLength(1);
      expect(result['Unknown Position']).toHaveLength(2);
      expect(result['Unknown Position']).toContainEqual(data[1]);
      expect(result['Unknown Position']).toContainEqual(data[2]);
    });

    it('groups multiple resumes with same position', () => {
      const data = [
        { id: 1, position: 'Software Engineer', embedding: [0.1] },
        { id: 2, position: 'Software Engineer', embedding: [0.2] },
        { id: 3, position: 'Software Engineer', embedding: [0.3] },
      ];

      const result = groupItems(data, 'resumes');

      expect(Object.keys(result)).toHaveLength(1);
      expect(result['Software Engineer']).toHaveLength(3);
    });
  });

  it('handles empty data array', () => {
    expect(groupItems([], 'jobs')).toEqual({});
    expect(groupItems([], 'resumes')).toEqual({});
  });

  it('handles single item', () => {
    const data = [{ id: 1, title: 'Developer', embedding: [0.1] }];

    const result = groupItems(data, 'jobs');

    expect(Object.keys(result)).toHaveLength(1);
    expect(result['Developer']).toEqual([data[0]]);
  });

  it('preserves all item properties in groups', () => {
    const data = [
      {
        id: 1,
        title: 'Developer',
        embedding: [0.1],
        company: 'Acme Inc',
        salary: 100000,
      },
      {
        id: 2,
        title: 'Developer',
        embedding: [0.2],
        company: 'Tech Corp',
        salary: 120000,
      },
    ];

    const result = groupItems(data, 'jobs');

    expect(result['Developer'][0]).toEqual(data[0]);
    expect(result['Developer'][1]).toEqual(data[1]);
    expect(result['Developer'][0].company).toBe('Acme Inc');
    expect(result['Developer'][1].salary).toBe(120000);
  });

  it('handles items with various label formats', () => {
    const data = [
      { id: 1, title: 'senior developer', embedding: [0.1] },
      { id: 2, title: 'Senior Developer', embedding: [0.2] },
      { id: 3, title: 'SENIOR DEVELOPER', embedding: [0.3] },
    ];

    const result = groupItems(data, 'jobs');

    // Labels are case-sensitive, so creates 3 groups
    expect(Object.keys(result)).toHaveLength(3);
  });
});
