import { describe, it, expect } from 'vitest';
import jsonFormatter from './json';

describe('json formatter', () => {
  it('formats resume as pretty-printed JSON', async () => {
    const resume = {
      basics: {
        name: 'John Doe',
        email: 'john@example.com',
      },
    };

    const result = await jsonFormatter.format(resume);

    expect(result.content).toBe(JSON.stringify(resume, undefined, 4));
  });

  it('includes empty headers array', async () => {
    const resume = { basics: {} };

    const result = await jsonFormatter.format(resume);

    expect(result.headers).toEqual([]);
  });

  it('handles nested objects', async () => {
    const resume = {
      basics: { name: 'Test' },
      work: [
        {
          company: 'Acme',
          position: 'Developer',
        },
      ],
    };

    const result = await jsonFormatter.format(resume);

    expect(result.content).toContain('"basics"');
    expect(result.content).toContain('"work"');
    expect(result.content).toContain('"company"');
  });

  it('uses 4-space indentation', async () => {
    const resume = { basics: { name: 'Test' } };

    const result = await jsonFormatter.format(resume);

    expect(result.content).toContain('    ');
  });

  it('handles empty resume', async () => {
    const result = await jsonFormatter.format({});

    expect(result.content).toBe('{}');
  });

  it('handles null values', async () => {
    const resume = {
      basics: {
        name: 'John',
        website: null,
      },
    };

    const result = await jsonFormatter.format(resume);

    expect(result.content).toContain('null');
  });

  it('handles arrays', async () => {
    const resume = {
      skills: ['JavaScript', 'Python', 'Go'],
    };

    const result = await jsonFormatter.format(resume);

    expect(result.content).toContain('JavaScript');
    expect(result.content).toContain('Python');
    expect(result.content).toContain('Go');
  });

  it('preserves property order', async () => {
    const resume = {
      basics: {},
      work: [],
      skills: [],
    };

    const result = await jsonFormatter.format(resume);

    const basicsIndex = result.content.indexOf('basics');
    const workIndex = result.content.indexOf('work');
    const skillsIndex = result.content.indexOf('skills');

    expect(basicsIndex).toBeLessThan(workIndex);
    expect(workIndex).toBeLessThan(skillsIndex);
  });
});
