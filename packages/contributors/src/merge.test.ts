import { describe, expect, it } from 'vitest';
import { isBot, mergeCredits, orderPeople, type Found } from './merge';

const found: ReadonlyArray<Found> = [
  {
    who: { github: 'Ada', id: 1 },
    kind: 'code',
    where: 'resume-cli',
    count: 3,
  },
  { who: { github: 'ada' }, kind: 'code', where: 'resume-cli', count: 2 },
  { who: { github: 'ada' }, kind: 'issues', where: 'resume-schema', count: 1 },
  {
    who: { github: 'ada' },
    kind: 'themes',
    where: 'jsonresume-theme-ada',
    count: 1,
  },
  {
    who: { github: 'grace' },
    kind: 'comments',
    where: 'resume-schema',
    count: 9,
  },
  {
    who: { github: 'dependabot[bot]' },
    kind: 'pulls',
    where: 'resume-cli',
    count: 40,
  },
  {
    who: { github: 'greenkeeperio-bot' },
    kind: 'pulls',
    where: 'resume-cli',
    count: 12,
  },
  {
    who: { npm: 'lin' },
    kind: 'themes',
    where: 'jsonresume-theme-lin',
    count: 1,
  },
  {
    who: { name: ' Old Committer ' },
    kind: 'code',
    where: 'resume-website',
    count: 4,
    href: 'https://github.com/jsonresume/resume-website/commit/abc',
  },
];

describe('mergeCredits', () => {
  const people = orderPeople(mergeCredits(found));

  it('joins one person’s credits across sources, whatever the case of their login', () => {
    const ada = people.find((p) => p.github?.toLowerCase() === 'ada');
    expect(ada?.id).toBe(1);
    expect(ada?.credits).toEqual([
      { kind: 'code', where: 'resume-cli', count: 5 },
      { kind: 'themes', where: 'jsonresume-theme-ada', count: 1 },
      { kind: 'issues', where: 'resume-schema', count: 1 },
    ]);
  });

  it('leaves bots out', () => {
    expect(people.map((p) => p.name)).not.toContain('dependabot[bot]');
    expect(people.map((p) => p.name)).not.toContain('greenkeeperio-bot');
    expect(isBot('ghost')).toBe(true);
    expect(isBot('thomasdavis')).toBe(false);
  });

  it('keeps people without a GitHub account, with what links them', () => {
    expect(people.find((p) => p.npm === 'lin')?.name).toBe('lin');
    const old = people.find((p) => p.name === 'Old Committer');
    expect(old?.github).toBeUndefined();
    expect(old?.credits[0]?.href).toContain('/commit/abc');
  });

  it('puts the most involved first', () => {
    expect(people[0]?.github?.toLowerCase()).toBe('ada');
  });

  it('takes names, ids and spelling from GitHub, and drops logins it doesn’t know', () => {
    const profiles = new Map([
      ['ada', { login: 'Ada', id: 1, name: 'Ada Lovelace' }],
      ['lin', { login: 'lin', id: 7, name: undefined }],
    ]);
    const named = mergeCredits(found, profiles);
    expect(named.find((p) => p.github === 'Ada')?.name).toBe('Ada Lovelace');
    const grace = named.find((p) => p.name === 'grace');
    expect(grace?.github).toBeUndefined();
    expect(grace?.credits).toHaveLength(1);
  });
});
