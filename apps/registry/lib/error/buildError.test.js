import { describe, it, expect } from 'vitest';
import buildError, { ERROR_CODES, ERROR_CODE_MESSAGES } from './buildError';

describe('ERROR_CODES', () => {
  it('contains all error code constants', () => {
    expect(ERROR_CODES.INVALID_USERNAME).toBe('INVALID_USERNAME');
    expect(ERROR_CODES.NON_EXISTENT_GIST).toBe('NON_EXISTENT_GIST');
    expect(ERROR_CODES.TEMPLATE_MISSING).toBe('TEMPLATE_MISSING');
  });

  it('is frozen object', () => {
    expect(Object.isFrozen(ERROR_CODES)).toBe(true);
  });

  it('has matching keys and values', () => {
    Object.keys(ERROR_CODES).forEach((key) => {
      expect(ERROR_CODES[key]).toBe(key);
    });
  });
});

describe('ERROR_CODE_MESSAGES', () => {
  it('has messages for all error codes', () => {
    Object.keys(ERROR_CODES).forEach((code) => {
      expect(ERROR_CODE_MESSAGES[code]).toBeDefined();
      expect(typeof ERROR_CODE_MESSAGES[code]).toBe('string');
    });
  });

  it('is frozen object', () => {
    expect(Object.isFrozen(ERROR_CODE_MESSAGES)).toBe(true);
  });

  it('contains helpful error messages', () => {
    expect(ERROR_CODE_MESSAGES.INVALID_USERNAME).toContain('username');
    expect(ERROR_CODE_MESSAGES.TEMPLATE_MISSING).toContain('theme');
    expect(ERROR_CODE_MESSAGES.RESUME_SCHEMA_ERROR).toContain('schema');
  });
});

describe('buildError', () => {
  it('builds error object with code and message', () => {
    const result = buildError('INVALID_USERNAME');

    expect(result.error.code).toBe('INVALID_USERNAME');
    expect(result.error.message).toBe(ERROR_CODE_MESSAGES.INVALID_USERNAME);
  });

  it('includes extra details when provided', () => {
    const extra = { username: 'invalid@user' };
    const result = buildError('INVALID_USERNAME', extra);

    expect(result.error.extra).toEqual(extra);
  });

  it('handles undefined extra', () => {
    const result = buildError('TEMPLATE_MISSING');

    expect(result.error.extra).toBeUndefined();
  });

  it('builds template missing error', () => {
    const result = buildError('TEMPLATE_MISSING');

    expect(result.error.code).toBe('TEMPLATE_MISSING');
    expect(result.error.message).toContain('theme');
  });

  it('builds schema error', () => {
    const result = buildError('RESUME_SCHEMA_ERROR', {
      errors: ['field missing'],
    });

    expect(result.error.code).toBe('RESUME_SCHEMA_ERROR');
    expect(result.error.extra.errors).toEqual(['field missing']);
  });

  it('returns consistent structure', () => {
    const result = buildError('GIST_UNKNOWN_ERROR');

    expect(result).toHaveProperty('error');
    expect(result.error).toHaveProperty('code');
    expect(result.error).toHaveProperty('message');
  });

  it('handles all error codes', () => {
    Object.keys(ERROR_CODES).forEach((code) => {
      const result = buildError(code);

      expect(result.error.code).toBe(code);
      expect(result.error.message).toBe(ERROR_CODE_MESSAGES[code]);
    });
  });
});
