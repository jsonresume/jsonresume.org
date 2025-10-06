import { describe, it, expect, vi } from 'vitest';
import yamlFormatter from './yaml';

// Mock json-to-pretty-yaml
vi.mock('json-to-pretty-yaml', () => ({
  default: {
    stringify: vi.fn((obj) => {
      // Simple mock YAML output
      return Object.keys(obj)
        .map((key) => `${key}: ${JSON.stringify(obj[key])}`)
        .join('\n');
    }),
  },
}));

describe('yaml formatter', () => {
  it('formats resume as YAML', async () => {
    const resume = {
      basics: {
        name: 'John Doe',
      },
    };

    const result = await yamlFormatter.format(resume);

    expect(result.content).toContain('basics');
    expect(typeof result.content).toBe('string');
  });

  it('includes empty headers array', async () => {
    const resume = { basics: {} };

    const result = await yamlFormatter.format(resume);

    expect(result.headers).toEqual([]);
  });

  it('handles empty resume', async () => {
    const result = await yamlFormatter.format({});

    expect(result.content).toBeDefined();
    expect(typeof result.content).toBe('string');
  });

  it('handles nested objects', async () => {
    const resume = {
      basics: { name: 'Test' },
      work: [{ company: 'Acme' }],
    };

    const result = await yamlFormatter.format(resume);

    expect(result.content).toContain('basics');
    expect(result.content).toContain('work');
  });

  it('handles arrays in resume', async () => {
    const resume = {
      skills: ['JavaScript', 'Python'],
    };

    const result = await yamlFormatter.format(resume);

    expect(result.content).toBeDefined();
  });

  it('handles null values', async () => {
    const resume = {
      basics: {
        website: null,
      },
    };

    const result = await yamlFormatter.format(resume);

    expect(result.content).toBeDefined();
  });

  it('returns string content', async () => {
    const resume = { basics: {} };

    const result = await yamlFormatter.format(resume);

    expect(typeof result.content).toBe('string');
  });
});
