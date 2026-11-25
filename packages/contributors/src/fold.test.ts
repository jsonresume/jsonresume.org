import { describe, expect, it } from 'vitest';
import { foldByName } from './fold';
import type { Contributor } from './model';

const ursula: Contributor = {
  name: 'Ursula Kallio',
  github: 'osg',
  credits: [{ kind: 'pulls', where: 'resume-schema', count: 2 }],
};

describe('foldByName', () => {
  it('gives commits under a name to the one person with that name or login', () => {
    const people = foldByName([
      ursula,
      {
        name: 'ursula kallio',
        credits: [{ kind: 'code', where: 'resume-schema', count: 3 }],
      },
      {
        name: 'OSG',
        credits: [{ kind: 'code', where: 'resume-schema', count: 1 }],
      },
    ]);
    expect(people).toEqual([
      {
        ...ursula,
        credits: [
          { kind: 'pulls', where: 'resume-schema', count: 2 },
          { kind: 'code', where: 'resume-schema', count: 4 },
        ],
      },
    ]);
  });

  it('joins name-only entries with each other', () => {
    const people = foldByName([
      {
        name: 'Charlotteis',
        credits: [{ kind: 'code', where: 'theme-class', count: 14 }],
      },
      {
        name: 'Charlotteis',
        credits: [
          { kind: 'themes', where: 'jsonresume-theme-class', count: 1 },
        ],
      },
    ]);
    expect(people).toHaveLength(1);
    expect(people[0]?.credits).toHaveLength(2);
  });

  it('gives an npm publisher’s themes to the GitHub account with that login', () => {
    const people = foldByName([
      { ...ursula, github: 'osg' },
      {
        name: 'OSG',
        npm: 'OSG',
        credits: [{ kind: 'themes', where: 'jsonresume-theme-u', count: 1 }],
      },
      {
        name: 'lin',
        npm: 'lin',
        credits: [{ kind: 'themes', where: 'jsonresume-theme-lin', count: 1 }],
      },
    ]);
    expect(people.map((p) => p.name)).toEqual(['Ursula Kallio', 'lin']);
    expect(people[0]?.credits).toHaveLength(2);
  });

  it('leaves a name two people share alone', () => {
    const alex = (github: string): Contributor => ({
      name: 'Alex',
      github,
      credits: [],
    });
    const people = foldByName([
      alex('alex1'),
      alex('alex2'),
      {
        name: 'Alex',
        credits: [{ kind: 'code', where: 'resume-cli', count: 1 }],
      },
    ]);
    expect(people).toHaveLength(3);
  });
});
