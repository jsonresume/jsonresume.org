import type { Family } from './families';
import type { JobRole } from './services';

const words = (s: string) =>
  new Set(
    s
      .toLowerCase()
      .split(/[^a-z0-9+#]+/)
      .filter((w) => w.length > 1)
  );

const shared = (a: ReadonlySet<string>, b: ReadonlySet<string>) =>
  [...a].filter((w) => b.has(w)).length;

const AWAY: ReadonlySet<Family> = new Set(['non_tech', 'design']);

/**
 * The role in a post that fits the person: the one named by the fit judge
 * (by the words they share), then the one whose required skills they show
 * most, then one in a family they've worked in. Posts list roles in any
 * order, so the first is only the last resort.
 */
export const pickRole = (
  roles: ReadonlyArray<JobRole>,
  named: string | null,
  have: ReadonlySet<number>,
  families: ReadonlySet<Family>
): JobRole | null => {
  const want = words(named ?? '');
  const score = (r: JobRole) =>
    3 * shared(want, words(r.title)) +
    r.requirements.filter((q) => q.need === 'required' && have.has(q.skill.id))
      .length +
    (families.has(r.family) ? 2 : 0) -
    (AWAY.has(r.family) && !families.has(r.family) ? 2 : 0);
  return roles.reduce<{ role: JobRole | null; score: number }>(
    (best, r) => {
      const s = score(r);
      return s > best.score ? { role: r, score: s } : best;
    },
    { role: null, score: -Infinity }
  ).role;
};

/** A role's title, unless the reader couldn't find one. */
export const roleTitle = (role: JobRole | null) =>
  role && role.title.trim() && role.title.toLowerCase() !== 'unspecified'
    ? role.title
    : null;
