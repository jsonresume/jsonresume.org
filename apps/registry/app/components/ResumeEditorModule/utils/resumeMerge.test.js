import { describe, it, expect } from 'vitest';
import { mergeArrays, applyChanges } from './resumeMerge';

describe('mergeArrays', () => {
  it('updates existing items by key', () => {
    const existing = [{ name: 'JavaScript', level: 'Intermediate' }];
    const newItems = [{ name: 'JavaScript', level: 'Advanced' }];

    const result = mergeArrays(existing, newItems, 'name');

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ name: 'JavaScript', level: 'Advanced' });
  });

  it('deletes items with _delete flag', () => {
    const existing = [{ name: 'Item 1' }, { name: 'Item 2' }];
    const newItems = [{ name: 'Item 1', _delete: true }];

    const result = mergeArrays(existing, newItems, 'name');

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Item 2');
  });

  it('matches by startDate and endDate when key not matched', () => {
    const existing = [
      { company: 'Acme', startDate: '2020-01', endDate: '2021-01' },
    ];
    const newItems = [
      { company: 'Acme Corp', startDate: '2020-01', endDate: '2021-01' },
    ];

    const result = mergeArrays(existing, newItems, 'name');

    expect(result).toHaveLength(1);
    expect(result[0].company).toBe('Acme Corp');
  });

  it('deletes by date match when key not matched', () => {
    const existing = [
      { company: 'Acme', startDate: '2020-01', endDate: '2021-01' },
    ];
    const newItems = [
      {
        company: 'Acme',
        startDate: '2020-01',
        endDate: '2021-01',
        _delete: true,
      },
    ];

    const result = mergeArrays(existing, newItems, 'name');

    expect(result).toHaveLength(0);
  });

  it('handles empty existing array', () => {
    const existing = [];
    const newItems = [{ name: 'Item 1' }];

    const result = mergeArrays(existing, newItems, 'name');

    expect(result).toHaveLength(1);
  });

  it('handles empty new array', () => {
    const existing = [{ name: 'Item 1' }];
    const newItems = [];

    const result = mergeArrays(existing, newItems, 'name');

    expect(result).toHaveLength(1);
  });

  it('handles undefined arrays with defaults', () => {
    const result = mergeArrays(undefined, undefined, 'name');

    expect(result).toEqual([]);
  });

  it('uses custom key for matching', () => {
    const existing = [{ id: '1', value: 'old' }];
    const newItems = [{ id: '1', value: 'new' }];

    const result = mergeArrays(existing, newItems, 'id');

    expect(result).toHaveLength(1);
    expect(result[0].value).toBe('new');
  });

  it('merges object properties on update', () => {
    const existing = [{ name: 'Skill', keywords: ['React'] }];
    const newItems = [{ name: 'Skill', level: 'Advanced' }];

    const result = mergeArrays(existing, newItems, 'name');

    expect(result[0]).toEqual({
      name: 'Skill',
      keywords: ['React'],
      level: 'Advanced',
    });
  });
});

describe('applyChanges', () => {
  it('applies object changes by merging', () => {
    const resume = {
      basics: { name: 'John', email: 'john@example.com' },
    };
    const changes = {
      basics: { email: 'newemail@example.com' },
    };

    const result = applyChanges(resume, changes);

    expect(result.basics).toEqual({
      name: 'John',
      email: 'newemail@example.com',
    });
  });

  it('applies primitive value changes', () => {
    const resume = { title: 'Developer' };
    const changes = { title: 'Senior Developer' };

    const result = applyChanges(resume, changes);

    expect(result.title).toBe('Senior Developer');
  });

  it('does not mutate original resume', () => {
    const resume = { basics: { name: 'John' } };
    const changes = { basics: { email: 'john@example.com' } };

    const result = applyChanges(resume, changes);

    expect(resume.basics).toEqual({ name: 'John' });
    expect(result.basics).toEqual({ name: 'John', email: 'john@example.com' });
  });

  it('handles null values', () => {
    const resume = { basics: { name: 'John' } };
    const changes = { basics: null };

    const result = applyChanges(resume, changes);

    expect(result.basics).toBeNull();
  });

  it('handles empty changes', () => {
    const resume = { basics: { name: 'John' } };
    const changes = {};

    const result = applyChanges(resume, changes);

    expect(result).toEqual(resume);
  });

  it('uses skills key for skills section', () => {
    const resume = {
      skills: [{ name: 'JavaScript', level: 'Intermediate' }],
    };
    const changes = {
      skills: [{ name: 'JavaScript', level: 'Advanced' }],
    };

    const result = applyChanges(resume, changes);

    expect(result.skills).toHaveLength(1);
    expect(result.skills[0].level).toBe('Advanced');
  });

  it('preserves sections not in changes', () => {
    const resume = {
      basics: { name: 'John' },
      work: [{ name: 'Company A' }],
    };
    const changes = {
      basics: { email: 'john@example.com' },
    };

    const result = applyChanges(resume, changes);

    expect(result.work).toEqual([{ name: 'Company A' }]);
  });

  it('handles nested object updates', () => {
    const resume = {
      basics: {
        location: { city: 'SF', country: 'US' },
      },
    };
    const changes = {
      basics: {
        location: { city: 'NYC' },
      },
    };

    const result = applyChanges(resume, changes);

    expect(result.basics.location).toEqual({ city: 'NYC' });
  });
});
