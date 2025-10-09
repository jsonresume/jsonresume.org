import { describe, it, expect, vi } from 'vitest';
import rendercvFormatter from './rendercv';

// Mock the convert function
vi.mock(
  '../../../../packages/converters/jsonresume-to-rendercv/convert',
  () => ({
    convert: vi.fn(async (resume) => {
      return `rendercv_version: 1.0\nname: ${resume.basics?.name || 'Unknown'}`;
    }),
  })
);

describe('rendercv formatter', () => {
  it('formats resume as RenderCV', async () => {
    const resume = {
      basics: { name: 'John Doe' },
    };

    const result = await rendercvFormatter.format(resume);

    expect(result.content).toContain('rendercv_version');
    expect(result.content).toContain('John Doe');
  });

  it('includes empty headers array', async () => {
    const resume = { basics: {} };

    const result = await rendercvFormatter.format(resume);

    expect(result.headers).toEqual([]);
  });

  it('calls convert function with resume', async () => {
    const { convert } = await import(
      '../../../../packages/converters/jsonresume-to-rendercv/convert'
    );
    const resume = { basics: { name: 'Test' } };

    await rendercvFormatter.format(resume);

    expect(convert).toHaveBeenCalledWith(resume);
  });

  it('returns converted content', async () => {
    const resume = { basics: { name: 'Jane Smith' } };

    const result = await rendercvFormatter.format(resume);

    expect(typeof result.content).toBe('string');
    expect(result.content).toContain('Jane Smith');
  });

  it('handles empty resume', async () => {
    const result = await rendercvFormatter.format({});

    expect(result.content).toBeDefined();
    expect(result.headers).toEqual([]);
  });

  it('format is async function', () => {
    const result = rendercvFormatter.format({});

    expect(result).toBeInstanceOf(Promise);
  });

  it('preserves resume data through conversion', async () => {
    const resume = {
      basics: { name: 'Test User', email: 'test@example.com' },
    };

    const result = await rendercvFormatter.format(resume);

    expect(result.content).toContain('Test User');
  });
});
