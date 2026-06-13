import { describe, it, expect } from 'vitest';
import {
  buildReasons,
  determineOutcome,
  bucketTextFor,
} from './decisionScoring';

const r = (extra = {}) => ({
  checkRequiredSkills: { reasoning: 'skills', matchPercentage: 0.9 },
  checkExperience: { reasoning: 'exp', hasEnoughExperience: true },
  checkWorkRights: { reasoning: 'wr', hasWorkRights: true },
  checkLocation: { reasoning: 'loc', locationCompatible: true },
  checkTimezone: { reasoning: 'tz', timezoneCompatible: true },
  checkAvailability: { reasoning: 'avail', availableInTime: true },
  checkSalary: { reasoning: 'sal', salaryAligned: true },
  ...extra,
});

describe('buildReasons', () => {
  it('emits reason rows in fixed check order', () => {
    expect(buildReasons(r())).toEqual([
      ['Required Skills', 'skills'],
      ['Experience', 'exp'],
      ['Work Rights', 'wr'],
      ['Location', 'loc'],
      ['Timezone', 'tz'],
      ['Availability', 'avail'],
      ['Salary', 'sal'],
    ]);
  });
  it('omits absent checks', () => {
    expect(buildReasons({ checkSalary: { reasoning: 's' } })).toEqual([
      ['Salary', 's'],
    ]);
  });
});

describe('determineOutcome', () => {
  it('strong match when everything passes', () => {
    expect(determineOutcome(r())).toBe('strongMatch');
  });
  it('no match when skills below 50%', () => {
    expect(
      determineOutcome(r({ checkRequiredSkills: { matchPercentage: 0.3 } }))
    ).toBe('noMatch');
  });
  it('possible match when skills 50-80%', () => {
    expect(
      determineOutcome(r({ checkRequiredSkills: { matchPercentage: 0.6 } }))
    ).toBe('possibleMatch');
  });
  it('no match when experience insufficient', () => {
    expect(
      determineOutcome(r({ checkExperience: { hasEnoughExperience: false } }))
    ).toBe('noMatch');
  });
  it('no match when work rights missing', () => {
    expect(
      determineOutcome(r({ checkWorkRights: { hasWorkRights: false } }))
    ).toBe('noMatch');
  });
  it('no match only when both location and timezone fail', () => {
    expect(
      determineOutcome(
        r({
          checkLocation: { locationCompatible: false },
          checkTimezone: { timezoneCompatible: false },
        })
      )
    ).toBe('noMatch');
    // location fails but timezone ok → not noMatch on that rule
    expect(
      determineOutcome(
        r({
          checkLocation: { locationCompatible: false },
          checkTimezone: { timezoneCompatible: true },
        })
      )
    ).toBe('strongMatch');
  });
  it('possible match when availability or salary fail', () => {
    expect(
      determineOutcome(r({ checkAvailability: { availableInTime: false } }))
    ).toBe('possibleMatch');
    expect(determineOutcome(r({ checkSalary: { salaryAligned: false } }))).toBe(
      'possibleMatch'
    );
  });
});

describe('bucketTextFor', () => {
  it('maps outcomes to labels', () => {
    expect(bucketTextFor('strongMatch')).toBe('✅ Strong Match');
    expect(bucketTextFor('possibleMatch')).toBe('🟡 Possible Match');
    expect(bucketTextFor('noMatch')).toBe('❌ Not a Match');
  });
});
