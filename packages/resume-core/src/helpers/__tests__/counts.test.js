import { describe, it, expect } from 'vitest';
import {
  countCompanies,
  countProjects,
  countPublications,
  countAwards,
  countTotalSkills,
  countSkillCategories,
  countLanguages,
} from '../counts.js';
import {
  work,
  skills,
  projects,
  publications,
  awards,
  languages,
} from './fixtures.js';

describe('countCompanies', () => {
  it('counts unique company names', () => {
    // Acme Corp appears twice in the fixture
    expect(countCompanies(work)).toBe(2);
  });

  it('ignores entries without a name', () => {
    expect(
      countCompanies([{ name: 'A' }, { position: 'Engineer' }, { name: 'B' }])
    ).toBe(2);
  });

  it('returns 0 for empty, missing, or non-array input', () => {
    expect(countCompanies([])).toBe(0);
    expect(countCompanies()).toBe(0);
    expect(countCompanies(null)).toBe(0);
    expect(countCompanies('not-an-array')).toBe(0);
  });
});

describe('countProjects', () => {
  it('returns the number of projects', () => {
    expect(countProjects(projects)).toBe(2);
    expect(countProjects([{ name: 'Solo' }])).toBe(1);
  });

  it('returns 0 for empty, missing, or non-array input', () => {
    expect(countProjects([])).toBe(0);
    expect(countProjects()).toBe(0);
    expect(countProjects(null)).toBe(0);
    expect(countProjects({})).toBe(0);
  });
});

describe('countPublications', () => {
  it('returns the number of publications', () => {
    expect(countPublications(publications)).toBe(1);
  });

  it('returns 0 for empty, missing, or non-array input', () => {
    expect(countPublications([])).toBe(0);
    expect(countPublications()).toBe(0);
    expect(countPublications(null)).toBe(0);
  });
});

describe('countAwards', () => {
  it('returns the number of awards', () => {
    expect(countAwards(awards)).toBe(1);
  });

  it('returns 0 for empty, missing, or non-array input', () => {
    expect(countAwards([])).toBe(0);
    expect(countAwards()).toBe(0);
    expect(countAwards(null)).toBe(0);
  });
});

describe('countTotalSkills', () => {
  it('sums keywords across all skill categories', () => {
    // 3 (Web) + 1 (Ops) + 0 (Soft Skills, no keywords)
    expect(countTotalSkills(skills)).toBe(4);
  });

  it('treats categories without keywords as contributing 0', () => {
    expect(countTotalSkills([{ name: 'Empty' }])).toBe(0);
  });

  it('returns 0 for empty, missing, or non-array input', () => {
    expect(countTotalSkills([])).toBe(0);
    expect(countTotalSkills()).toBe(0);
    expect(countTotalSkills(null)).toBe(0);
  });
});

describe('countSkillCategories', () => {
  it('returns the number of skill categories', () => {
    expect(countSkillCategories(skills)).toBe(3);
  });

  it('returns 0 for empty, missing, or non-array input', () => {
    expect(countSkillCategories([])).toBe(0);
    expect(countSkillCategories()).toBe(0);
    expect(countSkillCategories(null)).toBe(0);
  });
});

describe('countLanguages', () => {
  it('returns the number of languages', () => {
    expect(countLanguages(languages)).toBe(2);
    expect(countLanguages([{ language: 'English' }])).toBe(1);
  });

  it('returns 0 for empty, missing, or non-array input', () => {
    expect(countLanguages([])).toBe(0);
    expect(countLanguages()).toBe(0);
    expect(countLanguages(null)).toBe(0);
  });
});
