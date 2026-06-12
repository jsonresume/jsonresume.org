import { describe, it, expect } from 'vitest';
import * as barrel from '../calculations.js';
import { calculateTotalExperience } from '../experience.js';
import { work } from './fixtures.js';

/** Every public calculation helper, grouped by implementation module. */
const EXPECTED_EXPORTS = [
  // experience.js
  'calculateTotalExperience',
  'calculateCurrentRoleExperience',
  'countCareerPositions',
  'getCareerProgressionRate',
  'countTotalHighlights',
  // counts.js
  'countCompanies',
  'countProjects',
  'countPublications',
  'countAwards',
  'countTotalSkills',
  'countSkillCategories',
  'countLanguages',
  // education.js
  'calculateEducationYears',
  'getHighestDegree',
  // workHistory.js
  'calculateVolunteerYears',
  'getUniqueIndustries',
  'getCurrentEmployer',
  'isCurrentlyEmployed',
  // keyMetrics.js
  'calculateKeyMetrics',
];

describe('calculations barrel', () => {
  it('re-exports exactly the 19 calculation helpers', () => {
    expect(EXPECTED_EXPORTS).toHaveLength(19);
    expect(Object.keys(barrel).sort()).toEqual([...EXPECTED_EXPORTS].sort());
  });

  it('exports a function for every helper', () => {
    for (const name of EXPECTED_EXPORTS) {
      expect(barrel[name], `${name} should be a function`).toBeTypeOf(
        'function'
      );
    }
  });

  it('re-exports the same implementations as the focused modules', () => {
    expect(barrel.calculateTotalExperience).toBe(calculateTotalExperience);
  });

  it('helpers are callable through the barrel', () => {
    // countCompanies is date-independent: 2 unique companies in the fixture.
    expect(barrel.countCompanies(work)).toBe(2);
  });
});
