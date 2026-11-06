import { expect, it } from 'vitest';
import { pickRole, roleTitle } from './pickRole';
import type { JobRole } from './services';

const role = (
  index: number,
  title: string,
  family: JobRole['family'],
  required: number[] = []
): JobRole => ({
  jobId: 1,
  index,
  title,
  family,
  seniority: 'unspecified',
  summary: '',
  requirements: required.map((id) => ({
    skill: { id, key: `s${id}`, name: `S${id}` },
    need: 'required',
    years: null,
  })),
});

const rootly = [
  role(0, 'Design', 'design'),
  role(1, 'Engineering', 'other_tech', [1]),
  role(2, 'GTM', 'non_tech'),
];

it('takes the role the fit judge named, by shared words', () => {
  const picked = pickRole(
    rootly,
    'Various engineering roles (Rootly)',
    new Set(),
    new Set(['backend'])
  );
  expect(picked?.title).toBe('Engineering');
});

it('without a name, the role whose skills you show, never design by default', () => {
  expect(pickRole(rootly, null, new Set([1]), new Set())?.title).toBe(
    'Engineering'
  );
  expect(pickRole(rootly, null, new Set(), new Set(['fullstack']))?.title).toBe(
    'Engineering'
  );
  // A designer's own family wins.
  expect(pickRole(rootly, null, new Set(), new Set(['design']))?.title).toBe(
    'Design'
  );
  expect(pickRole([], 'Engineer', new Set(), new Set())).toBeNull();
});

it('drops titles the reader could not find', () => {
  expect(roleTitle(role(0, 'unspecified', 'other_tech'))).toBeNull();
  expect(roleTitle(role(0, 'Staff Engineer', 'backend'))).toBe(
    'Staff Engineer'
  );
});
