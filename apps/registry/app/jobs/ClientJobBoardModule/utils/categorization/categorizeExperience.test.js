import { describe, it, expect } from 'vitest';
import { categorizeExperience } from './categorizeExperience';

describe('categorizeExperience', () => {
  it('categorizes entry level', () => {
    expect(categorizeExperience('Entry Level')).toBe('Entry Level');
    expect(categorizeExperience('entry')).toBe('Entry Level');
    expect(categorizeExperience('Junior')).toBe('Entry Level');
    expect(categorizeExperience('junior developer')).toBe('Entry Level');
  });

  it('categorizes mid level', () => {
    expect(categorizeExperience('Mid Level')).toBe('Mid Level');
    expect(categorizeExperience('mid')).toBe('Mid Level');
    expect(categorizeExperience('Intermediate')).toBe('Mid Level');
    expect(categorizeExperience('intermediate developer')).toBe('Mid Level');
  });

  it('categorizes senior level', () => {
    expect(categorizeExperience('Senior')).toBe('Senior Level');
    expect(categorizeExperience('senior developer')).toBe('Senior Level');
    expect(categorizeExperience('Sr. Engineer')).toBe('Senior Level');
    expect(categorizeExperience('SR')).toBe('Senior Level');
  });

  it('categorizes lead positions', () => {
    expect(categorizeExperience('Lead')).toBe('Lead');
    expect(categorizeExperience('lead developer')).toBe('Lead');
    expect(categorizeExperience('Principal')).toBe('Lead');
    expect(categorizeExperience('principal engineer')).toBe('Lead');
  });

  it('categorizes manager positions', () => {
    expect(categorizeExperience('Manager')).toBe('Manager');
    expect(categorizeExperience('Engineering Manager')).toBe('Manager');
    expect(categorizeExperience('Head')).toBe('Manager');
    expect(categorizeExperience('Head of Engineering')).toBe('Manager');
  });

  it('categorizes executive positions', () => {
    expect(categorizeExperience('Executive')).toBe('Executive');
    expect(categorizeExperience('exec')).toBe('Executive');
    expect(categorizeExperience('Director')).toBe('Executive');
    expect(categorizeExperience('director of engineering')).toBe('Executive');
  });

  it('returns Not Specified for unrecognized levels', () => {
    expect(categorizeExperience('Intern')).toBe('Not Specified');
    expect(categorizeExperience('Consultant')).toBe('Not Specified');
    expect(categorizeExperience('Specialist')).toBe('Not Specified');
  });

  it('is case insensitive', () => {
    expect(categorizeExperience('SENIOR')).toBe('Senior Level');
    expect(categorizeExperience('MID')).toBe('Mid Level');
    expect(categorizeExperience('ENTRY')).toBe('Entry Level');
  });

  it('handles special characters', () => {
    expect(categorizeExperience('Senior!')).toBe('Senior Level');
    expect(categorizeExperience('Mid-Level')).toBe('Mid Level');
  });

  it('handles empty string', () => {
    expect(categorizeExperience('')).toBe('Not Specified');
  });

  it('handles null/undefined', () => {
    expect(categorizeExperience(null)).toBe('Not Specified');
    expect(categorizeExperience(undefined)).toBe('Not Specified');
  });

  it('prioritizes entry over other keywords', () => {
    expect(categorizeExperience('Entry Senior')).toBe('Entry Level');
  });

  it('prioritizes mid over senior', () => {
    expect(categorizeExperience('Mid Senior')).toBe('Mid Level');
  });

  it('handles whitespace', () => {
    expect(categorizeExperience('  Senior  ')).toBe('Senior Level');
  });
});
