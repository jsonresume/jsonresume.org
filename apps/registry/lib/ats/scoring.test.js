import { describe, it, expect } from 'vitest';
import { calculateATSScore } from './scoring';

describe('ATS Scoring', () => {
  describe('calculateATSScore', () => {
    it('scores perfect resume highly', () => {
      const resume = {
        basics: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1-555-0100',
          summary:
            'Experienced software engineer with 10+ years building scalable web applications',
          location: {
            city: 'San Francisco',
            region: 'CA',
            country: 'US',
          },
        },
        work: [
          {
            name: 'Tech Corp',
            position: 'Senior Engineer',
            startDate: '2020-01-01',
            endDate: '2024-01-01',
            summary: 'Led development of microservices',
            highlights: [
              'Improved performance by 50%',
              'Mentored 5 junior developers',
              'Architected new payment system',
            ],
          },
        ],
        education: [
          {
            institution: 'State University',
            studyType: 'Bachelor of Science',
            area: 'Computer Science',
            startDate: '2010-09-01',
            endDate: '2014-05-01',
          },
        ],
        skills: [
          {
            name: 'Languages',
            keywords: ['JavaScript', 'Python', 'Go', 'TypeScript'],
          },
          {
            name: 'Frameworks',
            keywords: ['React', 'Node.js', 'Express', 'Next.js'],
          },
          {
            name: 'Tools',
            keywords: ['Git', 'Docker', 'AWS', 'PostgreSQL'],
          },
        ],
      };

      const result = calculateATSScore(resume, {
        theme: 'jsonresume-theme-professional',
      });

      expect(result.score).toBeGreaterThan(85);
      expect(result.rating).toMatch(/Excellent|Good/);
      expect(result.checks).toHaveLength(7);
    });

    it('identifies missing contact information', () => {
      const resume = {
        basics: {},
      };

      const result = calculateATSScore(resume);

      const contactCheck = result.checks.find(
        (c) => c.name === 'Contact Information'
      );
      expect(contactCheck.score).toBe(0);
      expect(contactCheck.issues).toHaveLength(4); // name, email, phone, location
      expect(contactCheck.issues.some((i) => i.message.includes('name'))).toBe(
        true
      );
      expect(contactCheck.issues.some((i) => i.message.includes('email'))).toBe(
        true
      );
    });

    it('validates email format', () => {
      const resume = {
        basics: {
          name: 'John Doe',
          email: 'invalid-email',
        },
      };

      const result = calculateATSScore(resume);

      const contactCheck = result.checks.find(
        (c) => c.name === 'Contact Information'
      );
      expect(
        contactCheck.issues.some((i) => i.message.includes('invalid email'))
      ).toBe(true);
    });

    it('scores work experience appropriately', () => {
      const resume = {
        basics: {
          name: 'John Doe',
          email: 'john@example.com',
        },
        work: [
          {
            name: 'Company A',
            position: 'Developer',
            startDate: '2020-01-01',
            highlights: ['Built features', 'Fixed bugs'],
          },
          {
            name: 'Company B',
            // Missing position and highlights
            startDate: '2018-01-01',
          },
        ],
      };

      const result = calculateATSScore(resume);

      const workCheck = result.checks.find((c) => c.name === 'Work Experience');
      expect(workCheck.score).toBeGreaterThan(0);
      expect(workCheck.score).toBeLessThanOrEqual(workCheck.maxScore);
      expect(workCheck.issues.length).toBeGreaterThan(0);
    });

    it('scores education section', () => {
      const resume = {
        basics: {
          name: 'John Doe',
          email: 'john@example.com',
        },
        education: [
          {
            institution: 'University',
            studyType: 'Bachelor',
            area: 'Computer Science',
          },
        ],
      };

      const result = calculateATSScore(resume);

      const eduCheck = result.checks.find((c) => c.name === 'Education');
      expect(eduCheck.score).toBeGreaterThan(0);
    });

    it('handles missing education gracefully', () => {
      const resume = {
        basics: {
          name: 'John Doe',
          email: 'john@example.com',
        },
      };

      const result = calculateATSScore(resume);

      const eduCheck = result.checks.find((c) => c.name === 'Education');
      expect(eduCheck.score).toBe(0);
      expect(eduCheck.issues.some((i) => i.severity === 'info')).toBe(true);
    });

    it('scores skills section', () => {
      const resume = {
        basics: {
          name: 'John Doe',
          email: 'john@example.com',
        },
        skills: [
          {
            name: 'Languages',
            keywords: ['JavaScript', 'Python', 'Java'],
          },
          {
            name: 'Frameworks',
            keywords: ['React', 'Vue', 'Angular'],
          },
          {
            name: 'Tools',
            keywords: ['Git', 'Docker', 'Kubernetes', 'AWS'],
          },
        ],
      };

      const result = calculateATSScore(resume);

      const skillsCheck = result.checks.find((c) => c.name === 'Skills');
      expect(skillsCheck.score).toBeGreaterThan(10);
      expect(skillsCheck.passed).toBe(true);
    });

    it('penalizes missing skills', () => {
      const resume = {
        basics: {
          name: 'John Doe',
          email: 'john@example.com',
        },
        skills: [],
      };

      const result = calculateATSScore(resume);

      const skillsCheck = result.checks.find((c) => c.name === 'Skills');
      expect(skillsCheck.score).toBe(0);
      expect(skillsCheck.issues.some((i) => i.severity === 'warning')).toBe(
        true
      );
    });

    it('checks keyword density', () => {
      const resume = {
        basics: {
          name: 'John Doe',
          email: 'john@example.com',
          summary: 'Short summary',
        },
        work: [],
      };

      const result = calculateATSScore(resume);

      const keywordCheck = result.checks.find(
        (c) => c.name === 'Keywords & Content'
      );
      expect(keywordCheck.score).toBeLessThan(keywordCheck.maxScore);
    });

    it('rewards comprehensive content', () => {
      const resume = {
        basics: {
          name: 'John Doe',
          email: 'john@example.com',
          summary:
            'Experienced software engineer with extensive background in full-stack development, cloud architecture, and team leadership. Proven track record of delivering high-quality software solutions.',
        },
        work: [
          {
            name: 'Company',
            position: 'Engineer',
            startDate: '2020-01-01',
            highlights: [
              'Developed microservices architecture',
              'Implemented CI/CD pipeline',
              'Led team of 5 developers',
              'Reduced deployment time by 60%',
              'Improved system reliability',
              'Mentored junior engineers',
            ],
          },
        ],
      };

      const result = calculateATSScore(resume);

      const keywordCheck = result.checks.find(
        (c) => c.name === 'Keywords & Content'
      );
      expect(keywordCheck.score).toBeGreaterThanOrEqual(10);
    });

    it('checks date consistency', () => {
      const resume = {
        basics: {
          name: 'John Doe',
          email: 'john@example.com',
        },
        work: [
          {
            name: 'Company A',
            position: 'Developer',
            startDate: '2020-01-01',
          },
          {
            name: 'Company B',
            position: 'Developer',
            // Missing startDate
          },
        ],
      };

      const result = calculateATSScore(resume);

      const dateCheck = result.checks.find((c) => c.name === 'Date Formatting');
      expect(dateCheck.score).toBeLessThan(dateCheck.maxScore);
      expect(
        dateCheck.issues.some((i) => i.message.includes('missing start date'))
      ).toBe(true);
    });

    it('recognizes ATS-friendly themes', () => {
      const resume = {
        basics: {
          name: 'John Doe',
          email: 'john@example.com',
        },
      };

      const result = calculateATSScore(resume, {
        theme: 'jsonresume-theme-stackoverflow',
      });

      const themeCheck = result.checks.find(
        (c) => c.name === 'Theme Compatibility'
      );
      expect(themeCheck.score).toBe(5);
      expect(themeCheck.passed).toBe(true);
    });

    it('warns about problematic themes', () => {
      const resume = {
        basics: {
          name: 'John Doe',
          email: 'john@example.com',
        },
      };

      const result = calculateATSScore(resume, {
        theme: 'jsonresume-theme-paper',
      });

      const themeCheck = result.checks.find(
        (c) => c.name === 'Theme Compatibility'
      );
      expect(themeCheck.score).toBeLessThan(5);
      expect(themeCheck.issues.length).toBeGreaterThan(0);
    });

    it('provides actionable recommendations', () => {
      const resume = {
        basics: {
          name: 'John Doe',
          // Missing email
        },
      };

      const result = calculateATSScore(resume);

      expect(result.recommendations.length).toBeGreaterThan(0);
      expect(result.recommendations[0]).toHaveProperty('severity');
      expect(result.recommendations[0]).toHaveProperty('category');
      expect(result.recommendations[0]).toHaveProperty('message');
      expect(result.recommendations[0]).toHaveProperty('fix');
    });

    it('generates appropriate rating text', () => {
      const excellentResume = {
        basics: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1-555-0100',
          summary: 'Experienced professional with proven track record',
          location: { city: 'SF' },
        },
        work: [
          {
            name: 'Company',
            position: 'Developer',
            startDate: '2020-01-01',
            highlights: ['Achievement 1', 'Achievement 2', 'Achievement 3'],
          },
        ],
        education: [
          {
            institution: 'University',
            studyType: 'Bachelor',
          },
        ],
        skills: [
          { name: 'Languages', keywords: ['JS', 'Python'] },
          { name: 'Frameworks', keywords: ['React', 'Node'] },
          { name: 'Tools', keywords: ['Git', 'Docker', 'AWS', 'K8s'] },
        ],
      };

      const result = calculateATSScore(excellentResume, {
        theme: 'jsonresume-theme-professional',
      });

      expect(result.summary).toBeTruthy();
      expect(result.rating).toBeTruthy();
    });

    it('returns all required fields', () => {
      const resume = {
        basics: {
          name: 'John Doe',
          email: 'john@example.com',
        },
      };

      const result = calculateATSScore(resume);

      expect(result).toHaveProperty('score');
      expect(result).toHaveProperty('rating');
      expect(result).toHaveProperty('checks');
      expect(result).toHaveProperty('recommendations');
      expect(result).toHaveProperty('summary');

      expect(typeof result.score).toBe('number');
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
    });
  });
});
