import { describe, expect, it } from 'vitest';
import { themeCredit } from './npm.ts';

describe('themeCredit', () => {
  it('credits a theme to the GitHub owner of its repository', () => {
    expect(
      themeCredit({
        name: 'jsonresume-theme-kendall',
        publisher: { username: 'someone-on-npm' },
        links: {
          repository:
            'git+https://github.com/LinuxBozo/jsonresume-theme-kendall.git',
        },
      })
    ).toEqual({
      who: { github: 'LinuxBozo' },
      kind: 'themes',
      where: 'jsonresume-theme-kendall',
      count: 1,
    });
  });

  it('credits its npm publisher when it has no GitHub repository', () => {
    expect(
      themeCredit({
        name: '@scope/jsonresume-theme-x',
        publisher: { username: 'pub' },
      })?.who
    ).toEqual({ npm: 'pub' });
  });

  it('skips the org’s own themes and packages that aren’t themes', () => {
    expect(
      themeCredit({
        name: 'jsonresume-theme-even',
        links: {
          repository: 'git+https://github.com/jsonresume/jsonresume.org.git',
        },
      })
    ).toBeUndefined();
    expect(themeCredit({ name: 'jsonresume-themeutils' })).toBeUndefined();
  });
});
