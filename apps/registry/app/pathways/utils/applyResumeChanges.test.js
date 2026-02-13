import { describe, it, expect } from 'vitest';
import applyResumeChanges from './applyResumeChanges';

describe('applyResumeChanges', () => {
  describe('basics section', () => {
    it('merges shallow properties', () => {
      const prev = { basics: { name: 'John', email: 'john@old.com' } };
      const changes = { basics: { email: 'john@new.com' } };
      const result = applyResumeChanges(prev, changes);
      expect(result.basics.name).toBe('John');
      expect(result.basics.email).toBe('john@new.com');
    });

    it('adds new properties', () => {
      const prev = { basics: { name: 'John' } };
      const changes = { basics: { phone: '555-1234' } };
      const result = applyResumeChanges(prev, changes);
      expect(result.basics.phone).toBe('555-1234');
      expect(result.basics.name).toBe('John');
    });

    it('merges nested location object', () => {
      const prev = {
        basics: { location: { city: 'SF', region: 'CA' } },
      };
      const changes = { basics: { location: { city: 'NYC' } } };
      const result = applyResumeChanges(prev, changes);
      expect(result.basics.location.city).toBe('NYC');
      expect(result.basics.location.region).toBe('CA');
    });
  });

  describe('work array', () => {
    it('updates existing work entry by name+position match', () => {
      // Note: implementation uses item.name (not item.company) for matching
      const prev = {
        work: [
          {
            name: 'Acme',
            position: 'Engineer',
            summary: 'old summary',
          },
        ],
      };
      const changes = {
        work: [
          {
            name: 'Acme',
            position: 'Engineer',
            summary: 'new summary',
          },
        ],
      };
      const result = applyResumeChanges(prev, changes);
      expect(result.work).toHaveLength(1);
      expect(result.work[0].summary).toBe('new summary');
    });

    it('appends new work entry when no match', () => {
      const prev = {
        work: [{ name: 'Acme', position: 'Engineer' }],
      };
      const changes = {
        work: [{ name: 'NewCo', position: 'Manager' }],
      };
      const result = applyResumeChanges(prev, changes);
      expect(result.work).toHaveLength(2);
    });

    it('appends when company field used but name field missing', () => {
      // company field is NOT used for matching — only name+position
      const prev = {
        work: [{ company: 'Acme', position: 'Engineer' }],
      };
      const changes = {
        work: [{ company: 'Acme', position: 'Engineer', summary: 'x' }],
      };
      const result = applyResumeChanges(prev, changes);
      // No match (company not used), so appended
      expect(result.work).toHaveLength(2);
    });

    it('deletes work entry with _delete marker', () => {
      const prev = {
        work: [
          { name: 'Acme', position: 'Engineer' },
          { name: 'Beta', position: 'Manager' },
        ],
      };
      const changes = {
        work: [{ name: 'Acme', position: 'Engineer', _delete: true }],
      };
      const result = applyResumeChanges(prev, changes);
      expect(result.work).toHaveLength(1);
      expect(result.work[0].name).toBe('Beta');
    });
  });

  describe('education array', () => {
    it('matches by institution+area', () => {
      const prev = {
        education: [
          {
            institution: 'MIT',
            area: 'CS',
            studyType: 'BS',
          },
        ],
      };
      const changes = {
        education: [
          {
            institution: 'MIT',
            area: 'CS',
            studyType: 'MS',
          },
        ],
      };
      const result = applyResumeChanges(prev, changes);
      expect(result.education).toHaveLength(1);
      expect(result.education[0].studyType).toBe('MS');
    });
  });

  describe('skills array', () => {
    it('matches by skill name and merges non-array fields', () => {
      const prev = {
        skills: [{ name: 'JavaScript', level: 'Intermediate' }],
      };
      const changes = {
        skills: [{ name: 'JavaScript', level: 'Advanced' }],
      };
      const result = applyResumeChanges(prev, changes);
      expect(result.skills).toHaveLength(1);
      expect(result.skills[0].level).toBe('Advanced');
    });

    it('appends primitive keyword items to existing keywords array', () => {
      const prev = {
        skills: [{ name: 'JavaScript', keywords: ['React'] }],
      };
      const changes = {
        skills: [{ name: 'JavaScript', keywords: ['Node.js'] }],
      };
      const result = applyResumeChanges(prev, changes);
      expect(result.skills).toHaveLength(1);
      // Primitives are pushed, so 'Node.js' is appended
      expect(result.skills[0].keywords).toContain('React');
      expect(result.skills[0].keywords).toContain('Node.js');
    });

    it('adds new skill when name does not match', () => {
      const prev = {
        skills: [{ name: 'JavaScript', keywords: ['React'] }],
      };
      const changes = {
        skills: [{ name: 'Python', keywords: ['Django'] }],
      };
      const result = applyResumeChanges(prev, changes);
      expect(result.skills).toHaveLength(2);
    });
  });

  describe('edge cases', () => {
    it('handles empty previous resume', () => {
      const result = applyResumeChanges({}, { basics: { name: 'New' } });
      expect(result.basics.name).toBe('New');
    });

    it('handles empty changes', () => {
      const prev = { basics: { name: 'John' } };
      const result = applyResumeChanges(prev, {});
      expect(result.basics.name).toBe('John');
    });

    it('does not mutate the original resume', () => {
      const prev = { basics: { name: 'John' } };
      const prevCopy = JSON.parse(JSON.stringify(prev));
      applyResumeChanges(prev, { basics: { name: 'Jane' } });
      expect(prev).toEqual(prevCopy);
    });

    it('handles null/undefined values in changes', () => {
      const prev = { basics: { name: 'John', email: 'a@b.com' } };
      const result = applyResumeChanges(prev, { basics: { email: null } });
      expect(result.basics.email).toBeNull();
    });

    it('creates arrays from scratch when prev has none', () => {
      const prev = {};
      const changes = {
        work: [{ company: 'Acme', position: 'Engineer' }],
      };
      const result = applyResumeChanges(prev, changes);
      expect(result.work).toHaveLength(1);
      expect(result.work[0].company).toBe('Acme');
    });

    it('handles multiple sections in one change', () => {
      const prev = {
        basics: { name: 'John' },
        work: [{ company: 'Acme', position: 'Dev' }],
        skills: [],
      };
      const changes = {
        basics: { email: 'j@j.com' },
        work: [{ company: 'NewCo', position: 'Lead' }],
        skills: [{ name: 'Go', keywords: [] }],
      };
      const result = applyResumeChanges(prev, changes);
      expect(result.basics.email).toBe('j@j.com');
      expect(result.work).toHaveLength(2);
      expect(result.skills).toHaveLength(1);
    });

    it('preserves sections not mentioned in changes', () => {
      const prev = {
        basics: { name: 'John' },
        languages: [{ language: 'English', fluency: 'Native' }],
      };
      const changes = { basics: { email: 'new@test.com' } };
      const result = applyResumeChanges(prev, changes);
      expect(result.languages).toEqual(prev.languages);
    });
  });
});
