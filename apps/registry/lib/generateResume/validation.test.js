import { describe, it, expect, vi } from 'vitest';
import { validateExtension, validateResume } from './validation';

// Mock buildError
vi.mock('../error/buildError', () => ({
  default: vi.fn((code, details) => ({ code, details })),
  ERROR_CODES: {
    INVALID_EXTENSION: 'INVALID_EXTENSION',
    RESUME_SCHEMA_ERROR: 'RESUME_SCHEMA_ERROR',
  },
}));

// Mock logger
vi.mock('../logger', () => ({
  default: {
    error: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
  },
}));

// Mock schema
vi.mock('../schema', () => ({
  default: {
    type: 'object',
    properties: {
      basics: { type: 'object' },
    },
  },
}));

describe('validateExtension', () => {
  it('validates valid extensions', () => {
    const validExtensions = [
      'qr',
      'json',
      'tex',
      'txt',
      'template',
      'yaml',
      'rendercv',
      'agent',
    ];

    validExtensions.forEach((ext) => {
      const result = validateExtension(ext);
      expect(result.error).toBeNull();
    });
  });

  it('rejects invalid extensions', () => {
    const result = validateExtension('pdf');
    expect(result.error).toBeDefined();
    expect(result.error.code).toBe('INVALID_EXTENSION');
  });

  it('rejects empty extension', () => {
    const result = validateExtension('');
    expect(result.error).toBeDefined();
  });

  it('is case-sensitive', () => {
    const result = validateExtension('JSON'); // uppercase
    expect(result.error).toBeDefined();
  });

  it('rejects extension with extra characters', () => {
    const result = validateExtension('json ');
    expect(result.error).toBeDefined();
  });
});

describe('validateResume', () => {
  it('validates valid resume', () => {
    const resume = {
      basics: {
        name: 'John Doe',
      },
    };

    const result = validateResume(resume);
    expect(result.error).toBeNull();
  });

  it('bypasses validation with skipValidation flag', () => {
    const resume = {
      meta: {
        skipValidation: true,
      },
      invalidField: 'this would normally fail',
    };

    const result = validateResume(resume);
    expect(result.error).toBeNull();
  });

  it('logs message when bypassing validation', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    const resume = {
      meta: {
        skipValidation: true,
      },
    };

    validateResume(resume);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Schema validation bypassed')
    );

    consoleSpy.mockRestore();
  });

  it('validates schema compliance', () => {
    const invalidResume = {
      basics: 'invalid', // Should be object
    };

    const result = validateResume(invalidResume);
    expect(result.error).toBeDefined();
    expect(result.error.code).toBe('RESUME_SCHEMA_ERROR');
  });

  it('includes validation errors in response', () => {
    const invalidResume = {
      basics: 'invalid',
    };

    const result = validateResume(invalidResume);
    expect(result.error.details).toHaveProperty('validation');
  });

  it('handles missing meta object', () => {
    const resume = {
      basics: {},
    };

    const result = validateResume(resume);
    expect(result.error).toBeNull();
  });

  it('requires exact skipValidation flag', () => {
    const resume = {
      meta: {
        skipValidation: 'true', // String instead of boolean
      },
      basics: 'invalid',
    };

    const result = validateResume(resume);
    expect(result.error).toBeDefined();
  });

  it('handles null resume', () => {
    const result = validateResume(null);
    expect(result.error).toBeDefined();
  });

  it('handles undefined resume', () => {
    const result = validateResume(undefined);
    expect(result.error).toBeDefined();
  });
});
