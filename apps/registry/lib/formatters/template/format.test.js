import { describe, it, expect, vi } from 'vitest';
import { format } from './format';

// Mock getTheme
vi.mock('./getTheme', () => ({
  getTheme: vi.fn((theme) => {
    if (theme === 'missing') return null;
    return {
      render: vi.fn(
        (resume) => `<html>${resume.basics?.name || 'Resume'}</html>`
      ),
    };
  }),
}));

describe('format', () => {
  it('renders resume with default theme', async () => {
    const resume = { basics: { name: 'John Doe' } };
    const options = {};

    const result = await format(resume, options);

    expect(result.content).toBe('<html>John Doe</html>');
  });

  it('renders resume with specified theme', async () => {
    const resume = { basics: { name: 'Jane Smith' } };
    const options = { theme: 'professional' };

    const result = await format(resume, options);

    expect(result.content).toBe('<html>Jane Smith</html>');
  });

  it('throws error when theme is missing', async () => {
    const resume = { basics: { name: 'Test' } };
    const options = { theme: 'missing' };

    await expect(format(resume, options)).rejects.toThrow('theme-missing');
  });

  it('returns correct headers', async () => {
    const resume = {};
    const options = {};

    const result = await format(resume, options);

    expect(result.headers).toEqual([
      {
        key: 'Cache-control',
        value: 'public, max-age=90',
      },
      {
        key: 'Content-Type',
        value: 'text/html',
      },
    ]);
  });

  it('uses elegant theme by default', async () => {
    const resume = {};
    const options = {};

    const result = await format(resume, options);

    expect(result.content).toBeDefined();
  });

  it('handles empty resume', async () => {
    const resume = {};
    const options = { theme: 'standard' };

    const result = await format(resume, options);

    expect(result.content).toBe('<html>Resume</html>');
  });

  it('returns content and headers object', async () => {
    const resume = { basics: { name: 'Test' } };
    const options = {};

    const result = await format(resume, options);

    expect(result).toHaveProperty('content');
    expect(result).toHaveProperty('headers');
    expect(Array.isArray(result.headers)).toBe(true);
  });

  it('handles theme option from options', async () => {
    const resume = { basics: { name: 'Developer' } };
    const options = { theme: 'cv' };

    const result = await format(resume, options);

    expect(result.content).toContain('Developer');
  });
});
