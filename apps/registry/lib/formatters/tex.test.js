import { describe, it, expect } from 'vitest';
import texFormatter from './tex';

describe('tex formatter', () => {
  it('returns unsupported message', async () => {
    const resume = { basics: { name: 'Test' } };

    const result = await texFormatter.format(resume);

    expect(result.content).toBe('Unsupported Latex');
  });

  it('includes empty headers array', async () => {
    const result = await texFormatter.format({});

    expect(result.headers).toEqual([]);
  });

  it('ignores resume content', async () => {
    const resume = {
      basics: { name: 'John Doe' },
      work: [{ company: 'Acme' }],
    };

    const result = await texFormatter.format(resume);

    expect(result.content).toBe('Unsupported Latex');
  });

  it('handles empty resume', async () => {
    const result = await texFormatter.format({});

    expect(result.content).toBe('Unsupported Latex');
    expect(result.headers).toEqual([]);
  });

  it('returns consistent format', async () => {
    const result1 = await texFormatter.format({ test: 1 });
    const result2 = await texFormatter.format({ test: 2 });

    expect(result1).toEqual(result2);
  });

  it('format is a function', () => {
    expect(typeof texFormatter.format).toBe('function');
  });

  it('format is async', async () => {
    const result = texFormatter.format({});

    expect(result).toBeInstanceOf(Promise);
    await result;
  });
});
