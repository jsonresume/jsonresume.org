import applyResumeChanges from '../../../app/pathways/utils/applyResumeChanges';

describe('applyResumeChanges', () => {
  const mockResumeBase = {
    basics: {
      name: 'John Doe',
      email: 'john@example.com',
      location: {
        city: 'New York',
        countryCode: 'US',
      },
    },
    work: [
      {
        name: 'Tech Corp',
        position: 'Software Engineer',
        startDate: '2022-01-01',
        highlights: ['Built APIs', 'Led team'],
      },
      {
        name: 'Start Up',
        position: 'Developer',
        startDate: '2020-01-01',
        highlights: ['Created features'],
      },
    ],
    skills: [
      {
        name: 'JavaScript',
        level: 'Expert',
        keywords: ['React', 'Node.js'],
      },
    ],
  };

  it('should return a new object, not mutate the original', () => {
    const changes = { basics: { name: 'Jane Doe' } };
    const result = applyResumeChanges(mockResumeBase, changes);

    expect(result).not.toBe(mockResumeBase);
    expect(mockResumeBase.basics.name).toBe('John Doe'); // Original unchanged
    expect(result.basics.name).toBe('Jane Doe');
  });

  describe('basic field updates', () => {
    it('should update primitive fields', () => {
      const changes = {
        basics: {
          name: 'Jane Smith',
          email: 'jane@example.com',
        },
      };

      const result = applyResumeChanges(mockResumeBase, changes);

      expect(result.basics.name).toBe('Jane Smith');
      expect(result.basics.email).toBe('jane@example.com');
    });

    it('should deep merge nested objects', () => {
      const changes = {
        basics: {
          location: {
            city: 'Los Angeles',
            region: 'CA',
          },
        },
      };

      const result = applyResumeChanges(mockResumeBase, changes);

      expect(result.basics.location.city).toBe('Los Angeles');
      expect(result.basics.location.region).toBe('CA');
      expect(result.basics.location.countryCode).toBe('US'); // Should preserve existing
    });

    it('should add new fields to existing objects', () => {
      const changes = {
        basics: {
          phone: '+1-555-0123',
          summary: 'Experienced developer',
        },
      };

      const result = applyResumeChanges(mockResumeBase, changes);

      expect(result.basics.phone).toBe('+1-555-0123');
      expect(result.basics.summary).toBe('Experienced developer');
      expect(result.basics.name).toBe('John Doe'); // Should preserve existing
    });
  });

  describe('array handling', () => {
    it('should replace array items by index', () => {
      const changes = {
        work: [
          {
            name: 'New Company',
            position: 'Senior Engineer',
            startDate: '2023-01-01',
          },
        ],
      };

      const result = applyResumeChanges(mockResumeBase, changes);

      expect(result.work[0].name).toBe('New Company');
      expect(result.work[0].position).toBe('Senior Engineer');
      expect(result.work[0].startDate).toBe('2023-01-01');
      expect(result.work[1]).toEqual(mockResumeBase.work[1]); // Second item unchanged
    });

    it('should merge with existing work entries when matching name and position', () => {
      const changes = {
        work: [
          {
            name: 'Tech Corp',
            position: 'Software Engineer',
            endDate: '2024-01-01',
            highlights: ['Built APIs', 'Led team', 'Mentored juniors'],
          },
        ],
      };

      const result = applyResumeChanges(mockResumeBase, changes);

      expect(result.work[0].name).toBe('Tech Corp');
      expect(result.work[0].position).toBe('Software Engineer');
      expect(result.work[0].startDate).toBe('2022-01-01'); // Original preserved
      expect(result.work[0].endDate).toBe('2024-01-01'); // New field added
      expect(result.work[0].highlights).toEqual([
        'Built APIs',
        'Led team',
        'Mentored juniors',
      ]);
    });

    it('should append new items to array', () => {
      const changes = {
        skills: [
          {
            name: 'JavaScript',
            level: 'Expert',
            keywords: ['React', 'Node.js', 'TypeScript'], // Add TypeScript to existing
          },
          {
            name: 'Python',
            level: 'Intermediate',
            keywords: ['Django', 'Flask'],
          },
        ],
      };

      const result = applyResumeChanges(mockResumeBase, changes);

      expect(result.skills).toHaveLength(2);
      expect(result.skills[0].name).toBe('JavaScript');
      expect(result.skills[0].keywords).toContain('TypeScript');
      expect(result.skills[1].name).toBe('Python');
      expect(result.skills[1].level).toBe('Intermediate');
    });

    it('should handle deletion markers', () => {
      const changes = {
        work: [
          { _delete: true }, // Delete first work entry
        ],
      };

      const result = applyResumeChanges(mockResumeBase, changes);

      expect(result.work).toHaveLength(1);
      expect(result.work[0].name).toBe('Start Up'); // Second item becomes first
    });

    it('should create new array if field does not exist', () => {
      const resumeWithoutEducation = { ...mockResumeBase };
      delete resumeWithoutEducation.education;

      const changes = {
        education: [
          {
            institution: 'University of Tech',
            area: 'Computer Science',
            studyType: 'Bachelor',
          },
        ],
      };

      const result = applyResumeChanges(resumeWithoutEducation, changes);

      expect(result.education).toHaveLength(1);
      expect(result.education[0].institution).toBe('University of Tech');
    });
  });

  describe('complex scenarios', () => {
    it('should handle multiple types of changes simultaneously', () => {
      const changes = {
        basics: {
          name: 'Jane Developer',
          location: {
            city: 'San Francisco',
            region: 'CA',
          },
          profiles: [
            {
              network: 'GitHub',
              url: 'https://github.com/jane',
            },
          ],
        },
        work: [
          {
            name: 'Big Tech',
            position: 'Principal Engineer',
            startDate: '2024-01-01',
          },
          { _delete: true }, // Delete second work entry
        ],
        skills: [
          {
            name: 'JavaScript',
            level: 'Expert',
            keywords: ['React', 'Node.js', 'TypeScript'], // Add TypeScript
          },
        ],
      };

      const result = applyResumeChanges(mockResumeBase, changes);

      // Check basics updates
      expect(result.basics.name).toBe('Jane Developer');
      expect(result.basics.location.city).toBe('San Francisco');
      expect(result.basics.location.region).toBe('CA');
      expect(result.basics.location.countryCode).toBe('US'); // Preserved
      expect(result.basics.profiles).toHaveLength(1);

      // Check work updates
      expect(result.work).toHaveLength(1);
      expect(result.work[0].name).toBe('Big Tech');
      expect(result.work[0].position).toBe('Principal Engineer');

      // Check skills updates
      expect(result.skills[0].keywords).toContain('TypeScript');
    });

    it('should handle empty changes object', () => {
      const result = applyResumeChanges(mockResumeBase, {});

      expect(result).toEqual(mockResumeBase);
      expect(result).not.toBe(mockResumeBase); // Should still be a new object
    });

    it('should handle null and undefined values in changes', () => {
      const changes = {
        basics: {
          name: null,
          email: undefined,
          phone: '+1-555-0123',
        },
      };

      const result = applyResumeChanges(mockResumeBase, changes);

      expect(result.basics.name).toBeNull();
      expect(result.basics.email).toBeUndefined();
      expect(result.basics.phone).toBe('+1-555-0123');
    });

    it('should handle deeply nested object merging', () => {
      const changes = {
        basics: {
          location: {
            address: '123 Main St',
          },
        },
      };

      const result = applyResumeChanges(mockResumeBase, changes);

      expect(result.basics.location.address).toBe('123 Main St');
      expect(result.basics.location.city).toBe('New York'); // Preserved
      expect(result.basics.location.countryCode).toBe('US'); // Preserved
    });
  });

  describe('edge cases', () => {
    it('should handle empty resume object', () => {
      const changes = {
        basics: {
          name: 'New Person',
        },
      };

      const result = applyResumeChanges({}, changes);

      expect(result.basics.name).toBe('New Person');
    });

    it('should handle primitive to object conversion', () => {
      const resumeWithPrimitiveLocation = {
        ...mockResumeBase,
        basics: {
          ...mockResumeBase.basics,
          location: 'New York', // Primitive instead of object
        },
      };

      const changes = {
        basics: {
          location: {
            city: 'Los Angeles',
            countryCode: 'US',
          },
        },
      };

      const result = applyResumeChanges(resumeWithPrimitiveLocation, changes);

      expect(result.basics.location.city).toBe('Los Angeles');
      expect(result.basics.location.countryCode).toBe('US');
    });

    it('should handle type mismatches gracefully', () => {
      const changes = {
        work: 'Not an array', // Wrong type
      };

      const result = applyResumeChanges(mockResumeBase, changes);

      expect(result.work).toBe('Not an array');
    });
  });
});
