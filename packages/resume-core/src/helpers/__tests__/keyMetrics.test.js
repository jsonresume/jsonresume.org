import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { calculateKeyMetrics } from '../keyMetrics.js';
import { fullResume, skills, languages, FIXED_NOW } from './fixtures.js';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(FIXED_NOW);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('calculateKeyMetrics', () => {
  it('builds the full dashboard metric list in order for a populated resume', () => {
    expect(calculateKeyMetrics(fullResume)).toEqual([
      { label: 'Years Experience', value: 10 },
      { label: 'Companies', value: 2 },
      { label: 'Projects', value: 2 },
      { label: 'Core Skills', value: 4 },
      { label: 'Publications', value: 1 },
      { label: 'Awards', value: 1 },
      { label: 'Education', value: 'Master of Science' },
      { label: 'Languages', value: 2 },
    ]);
  });

  it('returns an empty array for an empty resume object', () => {
    expect(calculateKeyMetrics({})).toEqual([]);
  });

  it('only includes metrics for populated sections', () => {
    expect(calculateKeyMetrics({ skills })).toEqual([
      { label: 'Core Skills', value: 4 },
    ]);
  });

  it('omits the Languages metric unless multilingual (more than one)', () => {
    expect(calculateKeyMetrics({ languages: [languages[0]] })).toEqual([]);
    expect(calculateKeyMetrics({ languages })).toEqual([
      { label: 'Languages', value: 2 },
    ]);
  });

  it('omits Education when no studyType matches a known degree', () => {
    expect(
      calculateKeyMetrics({ education: [{ institution: 'No Degree U' }] })
    ).toEqual([]);
  });

  // Documents current behavior: the resume argument has no default, so
  // destructuring undefined throws. Callers must pass an object.
  it('throws when called without a resume object', () => {
    expect(() => calculateKeyMetrics()).toThrow(TypeError);
  });
});
