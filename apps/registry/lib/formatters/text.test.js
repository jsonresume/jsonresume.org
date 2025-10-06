import { describe, it, expect } from 'vitest';
import textFormatter from './text';

describe('text formatter', () => {
  it('formats basic information', async () => {
    const resume = {
      basics: {
        name: 'John Doe',
        label: 'Software Engineer',
        email: 'john@example.com',
        phone: '555-1234',
        location: {
          address: '123 Main St',
          city: 'San Francisco',
          region: 'CA',
          postalCode: '94102',
          countryCode: 'US',
        },
        summary: 'Experienced developer',
      },
    };

    const result = await textFormatter.format(resume);

    expect(result.content).toContain('John Doe');
    expect(result.content).toContain('Software Engineer');
    expect(result.content).toContain('john@example.com');
    expect(result.content).toContain('PROFESSIONAL SUMMARY');
    expect(result.content).toContain('Experienced developer');
  });

  it('formats work history', async () => {
    const resume = {
      basics: {
        name: 'Test',
        location: {},
      },
      work: [
        {
          name: 'Acme Corp',
          position: 'Developer',
          startDate: '2020-01',
          endDate: '2023-01',
          summary: 'Built applications',
          highlights: ['Led team', 'Shipped features'],
        },
      ],
    };

    const result = await textFormatter.format(resume);

    expect(result.content).toContain('WORK HISTORY');
    expect(result.content).toContain('Acme Corp');
    expect(result.content).toContain('Developer');
    expect(result.content).toContain('Built applications');
    expect(result.content).toContain('+ Led team');
    expect(result.content).toContain('+ Shipped features');
  });

  it('formats volunteer work', async () => {
    const resume = {
      basics: { name: 'Test', location: {} },
      volunteer: [
        {
          organization: 'Non-profit',
          position: 'Volunteer',
          startDate: '2021-01',
          endDate: '2022-01',
          summary: 'Helped community',
          highlights: ['Organized events'],
        },
      ],
    };

    const result = await textFormatter.format(resume);

    expect(result.content).toContain('VOLUNTEER');
    expect(result.content).toContain('Non-profit');
    expect(result.content).toContain('Volunteer');
    expect(result.content).toContain('Helped community');
    expect(result.content).toContain('+ Organized events');
  });

  it('formats awards', async () => {
    const resume = {
      basics: { name: 'Test', location: {} },
      awards: [
        {
          title: 'Best Developer',
          date: '2023',
          awarder: 'Tech Company',
        },
      ],
    };

    const result = await textFormatter.format(resume);

    expect(result.content).toContain('AWARDS');
    expect(result.content).toContain('Best Developer');
    expect(result.content).toContain('Tech Company');
  });

  it('formats certificates', async () => {
    const resume = {
      basics: { name: 'Test', location: {} },
      certificates: [
        {
          name: 'AWS Certified',
          date: '2023',
          issuer: 'Amazon',
        },
      ],
    };

    const result = await textFormatter.format(resume);

    expect(result.content).toContain('CERTIFICATES');
    expect(result.content).toContain('AWS Certified');
    expect(result.content).toContain('Amazon');
  });

  it('formats publications', async () => {
    const resume = {
      basics: { name: 'Test', location: {} },
      publications: [
        {
          name: 'Research Paper',
          date: '2023',
          issuer: 'Journal',
          summary: 'Study of algorithms',
        },
      ],
    };

    const result = await textFormatter.format(resume);

    expect(result.content).toContain('PUBLICATIONS');
    expect(result.content).toContain('Research Paper');
    expect(result.content).toContain('Journal');
    expect(result.content).toContain('Study of algorithms');
  });

  it('formats skills', async () => {
    const resume = {
      basics: { name: 'Test', location: {} },
      skills: [
        {
          name: 'JavaScript',
          keywords: ['React', 'Node.js'],
        },
      ],
    };

    const result = await textFormatter.format(resume);

    expect(result.content).toContain('SKILLS');
    expect(result.content).toContain('JavaScript');
    expect(result.content).toContain('+ React');
    expect(result.content).toContain('+ Node.js');
  });

  it('handles missing optional fields', async () => {
    const resume = {
      basics: { name: 'Test', location: {} },
      work: [
        {
          name: 'Company',
          position: 'Role',
          startDate: '2020',
          endDate: '2021',
        },
      ],
    };

    const result = await textFormatter.format(resume);

    expect(result.content).toBeDefined();
    expect(result.headers).toEqual([]);
  });

  it('handles empty arrays', async () => {
    const resume = {
      basics: { name: 'Test', location: {} },
      work: [],
      skills: [],
      awards: [],
    };

    const result = await textFormatter.format(resume);

    expect(result.content).not.toContain('WORK HISTORY');
    expect(result.content).not.toContain('SKILLS');
    expect(result.content).not.toContain('AWARDS');
  });

  it('returns headers as empty array', async () => {
    const resume = {
      basics: { name: 'Test', location: {} },
    };

    const result = await textFormatter.format(resume);

    expect(result.headers).toEqual([]);
  });

  it('handles missing dates in awards', async () => {
    const resume = {
      basics: { name: 'Test', location: {} },
      awards: [
        {
          title: 'Award',
          awarder: 'Company',
        },
      ],
    };

    const result = await textFormatter.format(resume);

    expect(result.content).toContain('Award');
  });

  it('handles missing dates in certificates', async () => {
    const resume = {
      basics: { name: 'Test', location: {} },
      certificates: [
        {
          name: 'Cert',
          issuer: 'Issuer',
        },
      ],
    };

    const result = await textFormatter.format(resume);

    expect(result.content).toContain('Cert');
  });

  it('handles missing dates in publications', async () => {
    const resume = {
      basics: { name: 'Test', location: {} },
      publications: [
        {
          name: 'Paper',
          issuer: 'Journal',
        },
      ],
    };

    const result = await textFormatter.format(resume);

    expect(result.content).toContain('Paper');
  });
});
