import { describe, it, expect } from 'vitest';
import errorTemplate from './errorTemplate';

describe('errorTemplate', () => {
  it('generates HTML error page with single error', () => {
    const errorObject = {
      extra: {
        validation: [
          {
            property: 'instance.name',
            message: 'is required',
          },
        ],
      },
    };

    const result = errorTemplate(errorObject);

    expect(result).toContain('<!DOCTYPE html>');
    expect(result).toContain('Resume Validation Failed');
    expect(result).toContain('<strong>1 validation error</strong>');
    expect(result).toContain('this issue');
  });

  it('generates HTML error page with multiple errors', () => {
    const errorObject = {
      extra: {
        validation: [
          {
            property: 'instance.name',
            message: 'is required',
          },
          {
            property: 'instance.email',
            message: 'must be a valid email',
          },
        ],
      },
    };

    const result = errorTemplate(errorObject);

    expect(result).toContain('<strong>2 validation errors</strong>');
    expect(result).toContain('these issues');
  });

  it('includes error list in output', () => {
    const errorObject = {
      extra: {
        validation: [
          {
            property: 'instance.basics.name',
            message: 'is required',
          },
        ],
      },
    };

    const result = errorTemplate(errorObject);

    expect(result).toContain('<ul id="error-list">');
    expect(result).toContain('basics → name');
    expect(result).toContain('is required');
  });

  it('includes error styles in head', () => {
    const errorObject = {
      extra: {
        validation: [
          {
            property: 'test',
            message: 'error',
          },
        ],
      },
    };

    const result = errorTemplate(errorObject);

    expect(result).toContain('<style>');
    expect(result).toContain('.error-container');
  });

  it('includes schema documentation link', () => {
    const errorObject = {
      extra: {
        validation: [
          {
            property: 'test',
            message: 'error',
          },
        ],
      },
    };

    const result = errorTemplate(errorObject);

    expect(result).toContain('https://jsonresume.org/schema/');
    expect(result).toContain('JSON Resume Schema documentation');
  });

  it('has proper HTML structure', () => {
    const errorObject = {
      extra: {
        validation: [
          {
            property: 'test',
            message: 'error',
          },
        ],
      },
    };

    const result = errorTemplate(errorObject);

    expect(result).toContain('<html lang="en">');
    expect(result).toContain('<meta charset="UTF-8">');
    expect(result).toContain('<meta name="viewport"');
    expect(result).toContain('</html>');
  });

  it('displays error count correctly', () => {
    const errorObject = {
      extra: {
        validation: [
          { property: 'a', message: 'error 1' },
          { property: 'b', message: 'error 2' },
          { property: 'c', message: 'error 3' },
        ],
      },
    };

    const result = errorTemplate(errorObject);

    expect(result).toContain('3 validation errors');
  });

  it('uses correct grammar for zero errors', () => {
    const errorObject = {
      extra: {
        validation: [],
      },
    };

    const result = errorTemplate(errorObject);

    expect(result).toContain('0 validation errors');
    expect(result).toContain('these issues');
  });
});
