import { Schema } from 'effect';
import { describe, expect, it } from 'vitest';
import collectedJson from './data/contributors.json';
import {
  contributors,
  creditHref,
  creditLabel,
  filterContributors,
  profileHref,
  totalsOf,
} from './contributors';
import { isBot } from './merge';
import { Contributors, type Contributor } from './model';

const ada: Contributor = {
  name: 'Ada Lovelace',
  github: 'ada',
  id: 1,
  credits: [
    { kind: 'code', where: 'resume-cli', count: 312 },
    { kind: 'pulls', where: 'resume-schema', count: 1 },
    { kind: 'themes', where: 'jsonresume-theme-ada', count: 1 },
    { kind: 'issues', where: 'jsonresume.org', count: 2 },
    { kind: 'comments', where: 'resume-schema', count: 40 },
  ],
};
const lin: Contributor = {
  name: 'lin',
  npm: 'lin',
  credits: [{ kind: 'themes', where: 'jsonresume-theme-lin', count: 1 }],
};

describe('credits', () => {
  it('say what was done, and where', () => {
    expect(ada.credits.map(creditLabel)).toEqual([
      '312 commits to resume-cli',
      '1 pull request to resume-schema',
      'Theme jsonresume-theme-ada',
      '2 issues in jsonresume.org',
      '40 comments in resume-schema',
    ]);
  });

  it('link to the work itself', () => {
    const [code, pull, theme, issues, comments] = ada.credits.map((c) =>
      c ? creditHref(c, ada) : ''
    );
    expect(code).toBe(
      'https://github.com/jsonresume/resume-cli/commits?author=ada'
    );
    expect(pull).toBe(
      'https://github.com/jsonresume/resume-schema/pulls?q=is%3Apr%20author%3Aada'
    );
    expect(theme).toBe('https://www.npmjs.com/package/jsonresume-theme-ada');
    expect(issues).toContain(
      '/jsonresume.org/issues?q=is%3Aissue%20author%3Aada'
    );
    expect(comments).toContain('/resume-schema/issues?q=commenter%3Aada');
  });

  it('link people to their profile', () => {
    expect(profileHref(ada)).toBe('https://github.com/ada');
    expect(profileHref(lin)).toBe('https://www.npmjs.com/~lin');
  });
});

describe('filterContributors', () => {
  const people = [ada, lin];
  it('matches every word against names, logins and places', () => {
    expect(filterContributors(people, 'lovelace cli')).toEqual([ada]);
    expect(filterContributors(people, 'theme-lin')).toEqual([lin]);
    expect(filterContributors(people, '')).toEqual(people);
  });
  it('filters by what they did', () => {
    expect(filterContributors(people, '', 'code')).toEqual([ada]);
    expect(filterContributors(people, '', 'themes')).toEqual(people);
    expect(filterContributors(people, '', 'team')).toEqual([]);
  });
});

it('adds up the totals', () => {
  expect(totalsOf([ada, lin])).toEqual({
    people: 2,
    commits: 312,
    pulls: 1,
    issues: 2,
    comments: 40,
    themes: 2,
    projects: 0,
  });
});

describe('the collected list', () => {
  it('decodes', () => {
    expect(() =>
      Schema.decodeUnknownSync(Contributors)(collectedJson)
    ).not.toThrow();
  });

  it('has no bots, and nobody twice', () => {
    const logins = contributors.people.flatMap((p) =>
      p.github ? [p.github.toLowerCase()] : []
    );
    expect(logins.filter(isBot)).toEqual([]);
    expect(new Set(logins).size).toBe(logins.length);
  });

  it('publishes no email addresses', () => {
    expect(JSON.stringify(collectedJson)).not.toMatch(
      /[\w.+-]+@[\w-]+\.[\w.]+/
    );
  });
});
