import { describe, it, expect } from 'vitest';
import { normalizeString } from './normalizeString';

describe('normalizeString', () => {
  it('converts to lowercase', () => {
    expect(normalizeString('HELLO')).toBe('hello');
    expect(normalizeString('Hello World')).toBe('helloworld');
  });

  it('removes spaces', () => {
    expect(normalizeString('hello world')).toBe('helloworld');
    expect(normalizeString('  hello  world  ')).toBe('helloworld');
  });

  it('removes special characters', () => {
    expect(normalizeString('hello-world')).toBe('helloworld');
    expect(normalizeString('hello_world')).toBe('helloworld');
    expect(normalizeString('hello.world')).toBe('helloworld');
    expect(normalizeString('hello@world')).toBe('helloworld');
    expect(normalizeString('hello#world')).toBe('helloworld');
  });

  it('keeps alphanumeric characters', () => {
    expect(normalizeString('abc123')).toBe('abc123');
    expect(normalizeString('test123xyz')).toBe('test123xyz');
  });

  it('handles empty string', () => {
    expect(normalizeString('')).toBe('');
  });

  it('handles null/undefined', () => {
    expect(normalizeString(null)).toBe('');
    expect(normalizeString(undefined)).toBe('');
  });

  it('removes all non-alphanumeric characters', () => {
    expect(normalizeString('hello!@#$%^&*()world')).toBe('helloworld');
  });

  it('handles strings with only special characters', () => {
    expect(normalizeString('!@#$%^&*()')).toBe('');
  });

  it('handles mixed case with numbers', () => {
    expect(normalizeString('Test123Case')).toBe('test123case');
  });

  it('handles unicode characters', () => {
    expect(normalizeString('café')).toBe('caf');
    expect(normalizeString('naïve')).toBe('nave');
  });

  it('handles multiple spaces and special chars', () => {
    expect(normalizeString('  hello   -   world  ')).toBe('helloworld');
  });

  it('preserves numbers', () => {
    expect(normalizeString('2023')).toBe('2023');
    expect(normalizeString('$2,000.00')).toBe('200000');
  });
});
