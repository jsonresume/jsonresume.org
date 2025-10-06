import { describe, it, expect } from 'vitest';
import buildError, { ERROR_CODES, ERROR_CODE_MESSAGES } from './buildError';

describe('ERROR_CODES', () => {
  it('contains all expected error codes', () => {
    expect(ERROR_CODES).toHaveProperty('INVALID_USERNAME');
    expect(ERROR_CODES).toHaveProperty('NON_EXISTENT_GIST');
    expect(ERROR_CODES).toHaveProperty('GIST_UNKNOWN_ERROR');
    expect(ERROR_CODES).toHaveProperty('RESUME_SCHEMA_ERROR');
    expect(ERROR_CODES).toHaveProperty('TEMPLATE_MISSING');
    expect(ERROR_CODES).toHaveProperty('UNKNOWN_TEMPLATE_ERROR');
    expect(ERROR_CODES).toHaveProperty('INVALID_EXTENSION');
    expect(ERROR_CODES).toHaveProperty('UNKNOWN_FORMATTER');
    expect(ERROR_CODES).toHaveProperty('RESUME_NOT_VALID_JSON');
  });

  it('is frozen and cannot be modified', () => {
    expect(Object.isFrozen(ERROR_CODES)).toBe(true);
  });
});

describe('ERROR_CODE_MESSAGES', () => {
  it('has messages for all error codes', () => {
    Object.keys(ERROR_CODES).forEach((code) => {
      expect(ERROR_CODE_MESSAGES).toHaveProperty(code);
      expect(typeof ERROR_CODE_MESSAGES[code]).toBe('string');
      expect(ERROR_CODE_MESSAGES[code].length).toBeGreaterThan(0);
    });
  });

  it('is frozen and cannot be modified', () => {
    expect(Object.isFrozen(ERROR_CODE_MESSAGES)).toBe(true);
  });
});

describe('buildError', () => {
  it('builds error object with code and message', () => {
    const error = buildError(ERROR_CODES.INVALID_USERNAME);
    expect(error).toEqual({
      error: {
        code: 'INVALID_USERNAME',
        message: 'This is not a valid Github username',
        extra: undefined,
      },
    });
  });

  it('includes extra data when provided', () => {
    const extra = { username: 'test@user', details: 'Invalid characters' };
    const error = buildError(ERROR_CODES.INVALID_USERNAME, extra);
    expect(error.error.extra).toEqual(extra);
  });

  it('builds RESUME_SCHEMA_ERROR correctly', () => {
    const error = buildError(ERROR_CODES.RESUME_SCHEMA_ERROR);
    expect(error.error.code).toBe('RESUME_SCHEMA_ERROR');
    expect(error.error.message).toContain('schema');
  });

  it('builds TEMPLATE_MISSING error correctly', () => {
    const error = buildError(ERROR_CODES.TEMPLATE_MISSING);
    expect(error.error.code).toBe('TEMPLATE_MISSING');
    expect(error.error.message).toContain('unsupported');
  });

  it('builds NON_EXISTENT_GIST error correctly', () => {
    const error = buildError(ERROR_CODES.NON_EXISTENT_GIST);
    expect(error.error.code).toBe('NON_EXISTENT_GIST');
    expect(error.error.message).toContain('gist');
  });

  it('preserves complex extra data', () => {
    const extra = {
      stack: 'Error stack trace here...',
      context: {
        userId: 123,
        timestamp: '2024-01-01',
      },
    };
    const error = buildError(ERROR_CODES.UNKNOWN_TEMPLATE_ERROR, extra);
    expect(error.error.extra).toEqual(extra);
    expect(error.error.extra.context.userId).toBe(123);
  });

  it('handles all error codes without throwing', () => {
    Object.values(ERROR_CODES).forEach((code) => {
      expect(() => buildError(code)).not.toThrow();
    });
  });

  it('returns consistent structure for all error codes', () => {
    Object.values(ERROR_CODES).forEach((code) => {
      const error = buildError(code);
      expect(error).toHaveProperty('error');
      expect(error.error).toHaveProperty('code');
      expect(error.error).toHaveProperty('message');
      expect(error.error).toHaveProperty('extra');
    });
  });
});
