import type { Contributor, Credit, CreditKind } from './model';

/** Who a credit belongs to, as the source names them. */
export type Who =
  | { readonly github: string; readonly id?: number }
  | { readonly npm: string }
  | { readonly name: string };

/** One thing someone did, as the collector finds it. */
export interface Found {
  readonly who: Who;
  readonly kind: CreditKind;
  readonly where: string;
  readonly count: number;
  readonly href?: string;
}

/** Accounts that are automation, not people. GitHub types most as Bot. */
const BOTS = new Set([
  'ghost',
  'dependabot',
  'dependabot-preview',
  'renovate',
  'renovate-bot',
  'greenkeeper',
  'greenkeeperio-bot',
  'snyk-bot',
  'github-actions',
  'semantic-release-bot',
  'changeset-bot',
  'allcontributors',
  'imgbot',
  'codecov',
  'codecov-io',
  'coveralls',
  'vercel',
  'claude',
  'copilot',
  'coderabbitai',
  'netlify',
  'gitlab ci/cd',
]);

export const isBot = (login: string) => {
  const l = login.toLowerCase();
  return l.endsWith('[bot]') || l.endsWith('-bot') || BOTS.has(l);
};

/** How much each kind counts when ordering people. */
const WEIGHT: Record<CreditKind, number> = {
  team: 1000,
  themes: 30,
  projects: 30,
  code: 3,
  pulls: 5,
  issues: 2,
  reviews: 1,
  comments: 1,
};
const ORDER: ReadonlyArray<CreditKind> = [
  'team',
  'code',
  'pulls',
  'themes',
  'projects',
  'reviews',
  'issues',
  'comments',
];

export const weightOf = (credits: ReadonlyArray<Credit>) =>
  credits.reduce((sum, c) => sum + WEIGHT[c.kind] * c.count, 0);

const keyOf = (who: Who) =>
  'github' in who
    ? `gh:${who.github.toLowerCase()}`
    : 'npm' in who
    ? `npm:${who.npm.toLowerCase()}`
    : `name:${who.name.trim().toLowerCase()}`;

interface Draft {
  who: Who;
  credits: Map<string, Credit>;
}

export interface Profile {
  readonly login: string;
  readonly id: number | undefined;
  readonly name: string | undefined;
}

/**
 * Everyone, once: credits from every source joined by GitHub login (or npm
 * name, or a commit author's name), the same kind in the same place added
 * up. Bots are left out. In no order: see orderPeople.
 *
 * `profiles`, when given, is GitHub's answer for each login (keyed in lower
 * case): its exact spelling, id and display name. A login GitHub doesn't
 * know (renamed or deleted) keeps its credits under the name alone.
 */
export function mergeCredits(
  found: Iterable<Found>,
  profiles?: ReadonlyMap<string, Profile>
): ReadonlyArray<Contributor> {
  const people = new Map<string, Draft>();
  for (const f of found) {
    if ('github' in f.who && isBot(f.who.github)) continue;
    if ('npm' in f.who && isBot(f.who.npm)) continue;
    if (f.count <= 0) continue;
    const key = keyOf(f.who);
    const draft = people.get(key) ?? { who: f.who, credits: new Map() };
    if ('github' in f.who && f.who.id !== undefined) draft.who = f.who;
    const at = `${f.kind}|${f.where}`;
    const before = draft.credits.get(at);
    draft.credits.set(at, {
      kind: f.kind,
      where: f.where,
      count: (before?.count ?? 0) + f.count,
      ...(before?.href ?? f.href ? { href: before?.href ?? f.href } : {}),
    });
    people.set(key, draft);
  }
  return [...people.values()].map(({ who, credits }): Contributor => {
    const list = [...credits.values()];
    if ('github' in who) {
      if (!profiles) {
        const id = who.id === undefined ? {} : { id: who.id };
        return { name: who.github, github: who.github, ...id, credits: list };
      }
      const profile = profiles.get(who.github.toLowerCase());
      if (!profile) return { name: who.github, credits: list };
      const id = profile.id ?? who.id;
      return {
        name: profile.name ?? profile.login,
        github: profile.login,
        ...(id === undefined ? {} : { id }),
        credits: list,
      };
    }
    if ('npm' in who) return { name: who.npm, npm: who.npm, credits: list };
    return { name: who.name.trim(), credits: list };
  });
}

const rank = (c: Credit) => ORDER.indexOf(c.kind);

/** Most involved first, then by name; each person's credits by kind, then count. */
export const orderPeople = (
  people: ReadonlyArray<Contributor>
): ReadonlyArray<Contributor> =>
  people
    .map((p) => ({
      ...p,
      credits: [...p.credits].sort(
        (a, b) => rank(a) - rank(b) || b.count - a.count
      ),
    }))
    .sort(
      (a, b) =>
        weightOf(b.credits) - weightOf(a.credits) ||
        a.name.localeCompare(b.name)
    );
