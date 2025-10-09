import { describe, it, expect } from 'vitest';
import { categorizeJobType } from './categorizeJobType';

describe('categorizeJobType', () => {
  it('categorizes contract jobs', () => {
    expect(categorizeJobType('Contract')).toBe('Contract');
    expect(categorizeJobType('contract position')).toBe('Contract');
    expect(categorizeJobType('CONTRACT')).toBe('Contract');
  });

  it('categorizes full-time jobs', () => {
    expect(categorizeJobType('Full-time')).toBe('Full-time');
    expect(categorizeJobType('fulltime')).toBe('Full-time');
    expect(categorizeJobType('full time')).toBe('Full-time');
    expect(categorizeJobType('Full Time Position')).toBe('Full-time');
  });

  it('categorizes part-time jobs', () => {
    expect(categorizeJobType('Part-time')).toBe('Part-time');
    expect(categorizeJobType('parttime')).toBe('Part-time');
    expect(categorizeJobType('part time')).toBe('Part-time');
  });

  it('categorizes internships', () => {
    expect(categorizeJobType('Internship')).toBe('Internship');
    expect(categorizeJobType('intern')).toBe('Internship');
    expect(categorizeJobType('Summer Intern')).toBe('Internship');
  });

  it('categorizes temporary jobs', () => {
    expect(categorizeJobType('Temporary')).toBe('Temporary');
    expect(categorizeJobType('temp')).toBe('Temporary');
    expect(categorizeJobType('Temp Position')).toBe('Temporary');
  });

  it('categorizes hybrid jobs', () => {
    expect(categorizeJobType('Hybrid')).toBe('Hybrid');
    expect(categorizeJobType('hybrid work')).toBe('Hybrid');
  });

  it('categorizes remote jobs', () => {
    expect(categorizeJobType('Remote')).toBe('Remote');
    expect(categorizeJobType('remote work')).toBe('Remote');
    expect(categorizeJobType('100% Remote')).toBe('Remote');
  });

  it('returns Other for unrecognized types', () => {
    expect(categorizeJobType('Freelance')).toBe('Other');
    expect(categorizeJobType('Consultant')).toBe('Other');
    expect(categorizeJobType('Unknown')).toBe('Other');
  });

  it('is case insensitive', () => {
    expect(categorizeJobType('FULL-TIME')).toBe('Full-time');
    expect(categorizeJobType('PaRt-TiMe')).toBe('Part-time');
  });

  it('handles special characters', () => {
    expect(categorizeJobType('Full-Time!')).toBe('Full-time');
    expect(categorizeJobType('Contract@Company')).toBe('Contract');
  });

  it('handles empty string', () => {
    expect(categorizeJobType('')).toBe('Other');
  });

  it('handles null/undefined', () => {
    expect(categorizeJobType(null)).toBe('Other');
    expect(categorizeJobType(undefined)).toBe('Other');
  });

  it('prioritizes contract over other keywords', () => {
    expect(categorizeJobType('Contract Full-time')).toBe('Contract');
  });

  it('prioritizes full-time over part-time', () => {
    expect(categorizeJobType('Full-time Part-time')).toBe('Full-time');
  });
});
