import { describe, it, expect } from 'vitest';
import { capitalizeFirstLetter } from './textUtils';

describe('capitalizeFirstLetter', () => {
  it('capitalizes first letter of lowercase string', () => {
    expect(capitalizeFirstLetter('hello')).toBe('Hello');
  });

  it('capitalizes first letter of all lowercase string', () => {
    expect(capitalizeFirstLetter('world')).toBe('World');
  });

  it('handles already capitalized string', () => {
    expect(capitalizeFirstLetter('Hello')).toBe('Hello');
  });

  it('handles single character', () => {
    expect(capitalizeFirstLetter('a')).toBe('A');
  });

  it('handles uppercase single character', () => {
    expect(capitalizeFirstLetter('A')).toBe('A');
  });

  it('handles empty string', () => {
    expect(capitalizeFirstLetter('')).toBe('');
  });

  it('only capitalizes first letter, preserves rest', () => {
    expect(capitalizeFirstLetter('hELLO')).toBe('HELLO');
  });

  it('handles string with spaces', () => {
    expect(capitalizeFirstLetter('hello world')).toBe('Hello world');
  });

  it('handles string starting with number', () => {
    expect(capitalizeFirstLetter('123abc')).toBe('123abc');
  });

  it('handles string starting with special character', () => {
    expect(capitalizeFirstLetter('!hello')).toBe('!hello');
  });

  it('handles multi-word string', () => {
    expect(capitalizeFirstLetter('the quick brown fox')).toBe(
      'The quick brown fox'
    );
  });

  it('preserves trailing whitespace', () => {
    expect(capitalizeFirstLetter('hello ')).toBe('Hello ');
  });
});
