import { describe, it, expect } from 'vitest';
import { validateFileSize, EXTRACTION_PROMPT } from './fileUtils';

describe('validateFileSize', () => {
  it('accepts files under 10MB', () => {
    const file = { name: 'resume.pdf', size: 5 * 1024 * 1024 };
    const result = validateFileSize(file);
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('accepts files exactly at 10MB', () => {
    const file = { name: 'resume.pdf', size: 10 * 1024 * 1024 };
    const result = validateFileSize(file);
    expect(result.valid).toBe(true);
  });

  it('rejects files over 10MB', () => {
    const file = { name: 'large-resume.pdf', size: 11 * 1024 * 1024 };
    const result = validateFileSize(file);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('large-resume.pdf');
    expect(result.error).toContain('10MB');
  });

  it('accepts very small files', () => {
    const file = { name: 'tiny.txt', size: 100 };
    const result = validateFileSize(file);
    expect(result.valid).toBe(true);
  });

  it('accepts empty files', () => {
    const file = { name: 'empty.txt', size: 0 };
    const result = validateFileSize(file);
    expect(result.valid).toBe(true);
  });

  it('includes filename in error message', () => {
    const file = { name: 'my-custom-file.docx', size: 15 * 1024 * 1024 };
    const result = validateFileSize(file);
    expect(result.error).toContain('my-custom-file.docx');
  });
});

describe('EXTRACTION_PROMPT', () => {
  it('is a non-empty string', () => {
    expect(typeof EXTRACTION_PROMPT).toBe('string');
    expect(EXTRACTION_PROMPT.length).toBeGreaterThan(0);
  });

  it('mentions JSON Resume schema', () => {
    expect(EXTRACTION_PROMPT.toLowerCase()).toContain('json resume');
  });

  it('includes all major resume sections', () => {
    const sections = [
      'basics',
      'work',
      'education',
      'skills',
      'awards',
      'projects',
      'languages',
      'interests',
      'volunteer',
      'certificates',
      'publications',
    ];

    sections.forEach((section) => {
      expect(EXTRACTION_PROMPT.toLowerCase()).toContain(section);
    });
  });
});
