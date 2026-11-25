import { Schema } from 'effect';
import collectedJson from './data/contributors.json';
import {
  Contributors,
  type Contributor,
  type Credit,
  type CreditKind,
} from './model';

const ORG = 'https://github.com/jsonresume';

// Checked where the site is built and served; the browser gets checked data.
const decode = import.meta.env.SSR
  ? Schema.decodeUnknownSync(Contributors)
  : (input: unknown) => input as Contributors;

/** Everyone, as last collected (scripts/collect.ts). */
export const contributors: Contributors = decode(collectedJson);

const plural = (n: number, one: string, many = `${one}s`) =>
  `${n.toLocaleString('en')} ${n === 1 ? one : many}`;

/** What a credit says, e.g. "312 commits to resume-cli". */
export function creditLabel(c: Credit): string {
  switch (c.kind) {
    case 'code':
      return `${plural(c.count, 'commit')} to ${c.where}`;
    case 'pulls':
      return `${plural(c.count, 'pull request')} to ${c.where}`;
    case 'issues':
      return `${plural(c.count, 'issue')} in ${c.where}`;
    case 'comments':
      return `${plural(c.count, 'comment')} in ${c.where}`;
    case 'reviews':
      return `${plural(c.count, 'review comment')} in ${c.where}`;
    case 'themes':
      return `Theme ${c.where}`;
    case 'projects':
      return `Built ${c.where}`;
    case 'team':
      return c.where;
  }
}

/** Where to see a credit: their commits, issues or comments, or the thing. */
export function creditHref(c: Credit, person: Contributor): string {
  if (c.href) return c.href;
  const repo = `${ORG}/${c.where}`;
  const who = person.github;
  if (c.kind === 'themes') return `https://www.npmjs.com/package/${c.where}`;
  if (c.kind === 'team') return '/team';
  if (!who) return repo;
  const q = (query: string) => encodeURIComponent(query);
  switch (c.kind) {
    case 'code':
      return `${repo}/commits?author=${who}`;
    case 'pulls':
      return `${repo}/pulls?q=${q(`is:pr author:${who}`)}`;
    case 'issues':
      return `${repo}/issues?q=${q(`is:issue author:${who}`)}`;
    case 'comments':
      return `${repo}/issues?q=${q(`commenter:${who}`)}`;
    default:
      return `${repo}/pulls?q=${q(`commenter:${who}`)}`;
  }
}

/** Their own page: GitHub, npm, or the place their credit is. */
export function profileHref(person: Contributor): string | undefined {
  if (person.github) return `https://github.com/${person.github}`;
  if (person.npm) return `https://www.npmjs.com/~${person.npm}`;
  const [first] = person.credits;
  return first ? creditHref(first, person) : undefined;
}

/** How the filters group the kinds. */
export const KIND_GROUPS = {
  code: ['code', 'pulls', 'reviews'],
  themes: ['themes'],
  projects: ['projects'],
  discussion: ['issues', 'comments'],
  team: ['team'],
} as const satisfies Record<string, ReadonlyArray<CreditKind>>;
export type KindGroup = keyof typeof KIND_GROUPS;

const has = (person: Contributor, group: KindGroup) =>
  person.credits.some((c) =>
    (KIND_GROUPS[group] as ReadonlyArray<CreditKind>).includes(c.kind)
  );

/** People matching every word (name, login or a credit's place) and the group. */
export function filterContributors(
  people: ReadonlyArray<Contributor>,
  query: string,
  group?: KindGroup
): ReadonlyArray<Contributor> {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  return people.filter((p) => {
    if (group && !has(p, group)) return false;
    if (words.length === 0) return true;
    const text = [p.name, p.github, p.npm, ...p.credits.map((c) => c.where)]
      .join(' ')
      .toLowerCase();
    return words.every((w) => text.includes(w));
  });
}

export interface Totals {
  people: number;
  commits: number;
  pulls: number;
  issues: number;
  comments: number;
  themes: number;
  projects: number;
}

export function totalsOf(people: ReadonlyArray<Contributor>): Totals {
  const sum = (...kinds: ReadonlyArray<CreditKind>) =>
    people.reduce(
      (n, p) =>
        n +
        p.credits.reduce(
          (m, c) => m + (kinds.includes(c.kind) ? c.count : 0),
          0
        ),
      0
    );
  return {
    people: people.length,
    commits: sum('code'),
    pulls: sum('pulls'),
    issues: sum('issues'),
    comments: sum('comments', 'reviews'),
    themes: sum('themes'),
    projects: sum('projects'),
  };
}
