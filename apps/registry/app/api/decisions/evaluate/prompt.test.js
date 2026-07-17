import { describe, it, expect } from 'vitest';
import {
  buildJobContext,
  buildPreferencesInfo,
  buildEvaluationPrompt,
} from './prompt';

describe('buildJobContext', () => {
  it('prefers gpt_content values, falls back to job fields', () => {
    const job = {
      title: 'Job Title',
      company: 'Job Co',
      location: 'Job Loc',
      description: 'desc',
    };
    const gptJob = { title: 'GPT Title', remote: 'Full' };
    const ctx = buildJobContext(job, gptJob);
    expect(ctx.title).toBe('GPT Title');
    expect(ctx.company).toBe('Job Co');
    expect(ctx.location).toBe('Job Loc');
    expect(ctx.remote).toBe('Full');
    expect(ctx.description).toBe('desc');
  });

  it('applies defaults when gpt_content is empty', () => {
    const ctx = buildJobContext({}, {});
    expect(ctx.skills).toEqual([]);
    expect(ctx.bonusSkills).toEqual([]);
    expect(ctx.minYearsExperience).toBe(0);
    expect(ctx.salary).toEqual({ min: 0, max: 999999 });
    expect(ctx.startWithinWeeks).toBe(12);
    // workRightsRequired defaults to true unless explicitly false
    expect(ctx.workRightsRequired).toBe(true);
  });

  it('respects workRightsRequired === false', () => {
    expect(
      buildJobContext({}, { workRightsRequired: false }).workRightsRequired
    ).toBe(false);
  });
});

describe('buildPreferencesInfo', () => {
  it('returns empty string with no preferences', () => {
    expect(buildPreferencesInfo({})).toBe('');
  });

  it('renders disabled, custom-value, and standard criteria', () => {
    const out = buildPreferencesInfo({
      skills: { enabled: false },
      salary: { enabled: true, value: { min: 100, max: 200 } },
      location: { enabled: true },
    });
    expect(out).toBe(
      [
        "- skills: DISABLED (user doesn't care about this criterion)",
        '- salary: ENABLED with custom values: {"min":100,"max":200}',
        '- location: ENABLED (use standard evaluation)',
      ].join('\n')
    );
  });
});

describe('buildEvaluationPrompt', () => {
  const base = {
    resumeContext: '{RESUME}',
    jobContext: '{JOB}',
    preferencesInfo: '',
    preferences: {},
  };

  it('includes both contexts and the no-preferences fallback line', () => {
    const prompt = buildEvaluationPrompt(base);
    expect(prompt).toContain('CANDIDATE RESUME:\n{RESUME}');
    expect(prompt).toContain('JOB POSTING:\n{JOB}');
    expect(prompt).toContain(
      'No custom preferences set - use standard evaluation for all criteria'
    );
  });

  it('keeps a trailing space after each criterion when no hint applies', () => {
    const prompt = buildEvaluationPrompt(base);
    // Matches the original template: hint slot is empty but the space remains
    expect(prompt).toContain('<0.5 insufficient. \n');
    expect(prompt).toContain('years of experience? \n');
    expect(prompt).toContain('salary expectations aligned? \n');
  });

  it('injects the disabled hint inline when a criterion is disabled', () => {
    const prompt = buildEvaluationPrompt({
      ...base,
      preferences: { skills: { enabled: false } },
    });
    expect(prompt).toContain(
      '<0.5 insufficient. (User disabled - be very lenient)\n'
    );
  });

  it('injects the custom salary expectation hint', () => {
    const prompt = buildEvaluationPrompt({
      ...base,
      preferences: { salary: { enabled: true, value: { min: 150, max: 250 } } },
    });
    expect(prompt).toContain('aligned? (User expects 150-250)');
  });
});
