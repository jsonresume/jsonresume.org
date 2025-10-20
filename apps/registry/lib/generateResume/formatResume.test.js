import { describe, it, expect, vi } from 'vitest';
import { formatResume } from './formatResume';

// Mock buildError
vi.mock('../error/buildError', () => ({
  default: vi.fn((code, details) => ({ code, details })),
  ERROR_CODES: {
    TEMPLATE_MISSING: 'TEMPLATE_MISSING',
    UNKNOWN_TEMPLATE_ERROR: 'UNKNOWN_TEMPLATE_ERROR',
  },
}));

describe('formatResume', () => {
  it('formats resume successfully', async () => {
    const mockFormatter = {
      format: vi
        .fn()
        .mockResolvedValue({ content: '<html>Resume</html>', headers: [] }),
    };

    const resume = { basics: { name: 'John Doe' } };
    const options = { theme: 'default' };

    const result = await formatResume(resume, mockFormatter, options);

    expect(mockFormatter.format).toHaveBeenCalledWith(resume, options);
    expect(result.content).toBe('<html>Resume</html>');
    expect(result.headers).toEqual([]);
  });

  it('includes custom headers', async () => {
    const customHeaders = [{ key: 'Content-Type', value: 'application/pdf' }];

    const mockFormatter = {
      format: vi
        .fn()
        .mockResolvedValue({ content: 'PDF content', headers: customHeaders }),
    };

    const result = await formatResume({}, mockFormatter, {});

    expect(result.headers).toEqual(customHeaders);
  });

  it('defaults to empty headers array when not provided', async () => {
    const mockFormatter = {
      format: vi.fn().mockResolvedValue({ content: 'Content' }),
    };

    const result = await formatResume({}, mockFormatter, {});

    expect(result.headers).toEqual([]);
  });

  it('handles theme-missing error', async () => {
    const mockFormatter = {
      format: vi.fn().mockRejectedValue(new Error('theme-missing')),
    };

    const result = await formatResume({}, mockFormatter, {});

    expect(result.error).toBeDefined();
    expect(result.error.code).toBe('TEMPLATE_MISSING');
  });

  it('handles unknown template errors', async () => {
    const error = new Error('Unknown error');
    error.stack = 'Error stack trace';

    const mockFormatter = {
      format: vi.fn().mockRejectedValue(error),
    };

    const result = await formatResume({}, mockFormatter, {});

    expect(result.error).toBeDefined();
    expect(result.error.code).toBe('UNKNOWN_TEMPLATE_ERROR');
    expect(result.error.details.error).toHaveProperty('stack');
  });

  it('logs errors to console', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('Test error');

    const mockFormatter = {
      format: vi.fn().mockRejectedValue(error),
    };

    await formatResume({}, mockFormatter, {});

    expect(consoleSpy).toHaveBeenCalledWith('[Theme Error]', 'unknown', error);
    consoleSpy.mockRestore();
  });

  it('passes resume and options to formatter', async () => {
    const resume = { basics: { name: 'Jane Doe' } };
    const options = { theme: 'elegant', format: 'pdf' };

    const mockFormatter = {
      format: vi.fn().mockResolvedValue({ content: 'output' }),
    };

    await formatResume(resume, mockFormatter, options);

    expect(mockFormatter.format).toHaveBeenCalledWith(resume, options);
  });

  it('handles formatter returning minimal response', async () => {
    const mockFormatter = {
      format: vi.fn().mockResolvedValue({ content: 'minimal' }),
    };

    const result = await formatResume({}, mockFormatter, {});

    expect(result.content).toBe('minimal');
    expect(result.headers).toEqual([]);
  });

  it('includes stack trace in error details', async () => {
    const error = new Error('Template error');
    error.stack = 'Stack trace here';

    const mockFormatter = {
      format: vi.fn().mockRejectedValue(error),
    };

    const result = await formatResume({}, mockFormatter, {});

    expect(result.error.details.error.stack).toBe('Stack trace here');
  });

  it('handles empty resume', async () => {
    const mockFormatter = {
      format: vi.fn().mockResolvedValue({ content: 'empty' }),
    };

    const result = await formatResume({}, mockFormatter, {});

    expect(result.content).toBe('empty');
  });

  it('handles null options', async () => {
    const mockFormatter = {
      format: vi.fn().mockResolvedValue({ content: 'output' }),
    };

    const result = await formatResume({}, mockFormatter, null);

    expect(mockFormatter.format).toHaveBeenCalledWith({}, null);
    expect(result.content).toBe('output');
  });
});
