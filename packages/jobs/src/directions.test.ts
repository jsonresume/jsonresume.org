import { expect, it } from 'vitest';
import { careerDirections, familyOf } from './directions';
import type { Ranked } from './matcher';
import { posting } from './test/fixtures';

const job = (
  id: number,
  title: string,
  score: number,
  skills: string[],
  extra = {}
): Ranked => ({
  row: {
    id,
    posting: posting({
      title,
      skills: skills.map((name) => ({ name, keywords: [] })),
      ...extra,
    }),
    postedAt: new Date('2026-10-01'),
    months: 1,
  },
  cosine: score / 100,
  order: score / 100,
  score,
  mark: null,
});

it('names kinds of role from titles, most specific first', () => {
  expect(familyOf('Founding Engineer (TypeScript)')).toBe('Founding engineer');
  expect(familyOf('Senior Engineering Manager')).toBe('Engineering leadership');
  expect(familyOf('Staff Backend Engineer')).toBe(
    'Staff and principal engineer'
  );
  expect(familyOf('ML Engineer, Search')).toBe('AI and machine learning');
  expect(familyOf('Senior Frontend Developer')).toBe('Frontend');
  expect(familyOf('Software Engineer')).toBe('Software engineering');
  expect(familyOf('Chef')).toBe('Other roles');
});

it('groups the fitting jobs into directions, with the skills to add', () => {
  const directions = careerDirections(
    [
      job(1, 'Founding Engineer', 90, ['TypeScript', 'Rust'], {
        salaryMax: 200_000,
        remote: 'remote_global',
      }),
      job(2, 'Founding Engineer', 70, ['Rust', 'Go']),
      job(3, 'Frontend Engineer', 60, ['React']),
      job(4, 'Frontend Developer', 50, ['React', 'CSS']),
      job(5, 'Designer', 95, ['Figma']),
    ],
    { skills: [{ name: 'TypeScript', keywords: ['React'] }] }
  );
  expect(directions.map((d) => d.name)).toEqual([
    'Founding engineer',
    'Frontend',
  ]);
  expect(directions[0]).toMatchObject({
    jobs: 2,
    bestFit: 90,
    medianPay: 200_000,
    remoteShare: 50,
    skillsAsked: ['Rust', 'TypeScript', 'Go'],
    skillsToAdd: ['Rust', 'Go'],
  });
  expect(directions[1]?.skillsToAdd).toEqual(['CSS']);
});
