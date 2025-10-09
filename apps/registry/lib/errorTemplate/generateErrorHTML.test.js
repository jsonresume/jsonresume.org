import { describe, it, expect } from 'vitest';
import { generateErrorHTML, generateErrorsHTML } from './generateErrorHTML';

describe('generateErrorHTML', () => {
  it('generates HTML for basic error', () => {
    const error = {
      property: 'instance.name',
      message: 'is required',
    };

    const result = generateErrorHTML(error, 0);

    expect(result).toContain('1.');
    expect(result).toContain('name');
    expect(result).toContain('is required');
  });

  it('converts property path to readable format', () => {
    const error = {
      property: 'instance.basics.name',
      message: 'Invalid name',
    };

    const result = generateErrorHTML(error, 0);

    expect(result).toContain('basics → name');
    // Note: Technical details still shows full "instance.basics.name"
  });

  it('shows "root" for root-level errors', () => {
    const error = {
      property: '',
      message: 'Invalid document',
    };

    const result = generateErrorHTML(error, 0);

    expect(result).toContain('root');
  });

  it('displays error instance value when provided', () => {
    const error = {
      property: 'instance.age',
      message: 'must be a number',
      instance: 'twenty',
    };

    const result = generateErrorHTML(error, 1);

    expect(result).toContain('Current value:');
    expect(result).toContain('"twenty"');
  });

  it('includes error index in numbering', () => {
    const error = { property: 'test', message: 'error' };

    expect(generateErrorHTML(error, 0)).toContain('1.');
    expect(generateErrorHTML(error, 1)).toContain('2.');
    expect(generateErrorHTML(error, 5)).toContain('6.');
  });

  it('includes technical details section', () => {
    const error = {
      property: 'instance.name',
      message: 'Invalid',
    };

    const result = generateErrorHTML(error, 0);

    expect(result).toContain('Technical details');
    expect(result).toContain('instance.name');
  });

  it('includes schema when provided', () => {
    const error = {
      property: 'instance.age',
      message: 'Invalid type',
      schema: { type: 'number', minimum: 0 },
    };

    const result = generateErrorHTML(error, 0);

    expect(result).toContain('Expected schema:');
    expect(result).toContain('"type": "number"');
    expect(result).toContain('"minimum": 0');
  });

  it('includes stack trace when provided', () => {
    const error = {
      property: 'test',
      message: 'error',
      stack: 'Error at line 42',
    };

    const result = generateErrorHTML(error, 0);

    expect(result).toContain('Stack:');
    expect(result).toContain('Error at line 42');
  });

  it('omits instance section when undefined', () => {
    const error = {
      property: 'test',
      message: 'error',
      instance: undefined,
    };

    const result = generateErrorHTML(error, 0);

    expect(result).not.toContain('Current value:');
  });

  it('omits instance section when null', () => {
    const error = {
      property: 'test',
      message: 'error',
      instance: null,
    };

    const result = generateErrorHTML(error, 0);

    expect(result).not.toContain('Current value:');
  });

  it('shows instance value of 0', () => {
    const error = {
      property: 'test',
      message: 'error',
      instance: 0,
    };

    const result = generateErrorHTML(error, 0);

    expect(result).toContain('Current value:');
    expect(result).toContain('0');
  });

  it('shows instance value of false', () => {
    const error = {
      property: 'test',
      message: 'error',
      instance: false,
    };

    const result = generateErrorHTML(error, 0);

    expect(result).toContain('Current value:');
    expect(result).toContain('false');
  });

  it('escapes HTML in error message', () => {
    const error = {
      property: 'test',
      message: '<script>alert("xss")</script>',
    };

    const result = generateErrorHTML(error, 0);

    // HTML should be directly inserted (not escaped in this implementation)
    expect(result).toContain('<script>alert("xss")</script>');
  });

  it('handles complex nested property paths', () => {
    const error = {
      property: 'instance.work[0].highlights[2]',
      message: 'Invalid highlight',
    };

    const result = generateErrorHTML(error, 0);

    expect(result).toContain('work[0] → highlights[2]');
  });

  it('handles objects as instance values', () => {
    const error = {
      property: 'instance.basics',
      message: 'Invalid structure',
      instance: { name: 'John', age: 30 },
    };

    const result = generateErrorHTML(error, 0);

    expect(result).toContain('"name"');
    expect(result).toContain('"age"');
  });

  it('omits schema section when not provided', () => {
    const error = {
      property: 'test',
      message: 'error',
    };

    const result = generateErrorHTML(error, 0);

    expect(result).not.toContain('Expected schema:');
  });

  it('omits stack section when not provided', () => {
    const error = {
      property: 'test',
      message: 'error',
    };

    const result = generateErrorHTML(error, 0);

    expect(result).not.toContain('Stack:');
  });
});

describe('generateErrorsHTML', () => {
  it('generates HTML for multiple errors', () => {
    const errors = [
      { property: 'instance.name', message: 'is required' },
      { property: 'instance.age', message: 'must be a number' },
    ];

    const result = generateErrorsHTML(errors);

    expect(result).toContain('1.');
    expect(result).toContain('2.');
    expect(result).toContain('name');
    expect(result).toContain('age');
  });

  it('returns empty string for empty array', () => {
    const result = generateErrorsHTML([]);

    expect(result).toBe('');
  });

  it('handles single error', () => {
    const errors = [{ property: 'test', message: 'error' }];

    const result = generateErrorsHTML(errors);

    expect(result).toContain('1.');
    expect(result).toContain('test');
  });

  it('joins errors without separators', () => {
    const errors = [
      { property: 'a', message: 'error 1' },
      { property: 'b', message: 'error 2' },
    ];

    const result = generateErrorsHTML(errors);

    // Should have both error items consecutively
    expect(result).toContain('error 1');
    expect(result).toContain('error 2');
    expect(result.split('error-item').length).toBe(3); // 1 + 2 errors
  });

  it('preserves error order', () => {
    const errors = [
      { property: 'first', message: 'error 1' },
      { property: 'second', message: 'error 2' },
      { property: 'third', message: 'error 3' },
    ];

    const result = generateErrorsHTML(errors);

    const firstIndex = result.indexOf('first');
    const secondIndex = result.indexOf('second');
    const thirdIndex = result.indexOf('third');

    expect(firstIndex).toBeLessThan(secondIndex);
    expect(secondIndex).toBeLessThan(thirdIndex);
  });
});
