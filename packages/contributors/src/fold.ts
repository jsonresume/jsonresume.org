import type { Contributor, Credit } from './model';

const joinCredits = (
  a: ReadonlyArray<Credit>,
  b: ReadonlyArray<Credit>
): ReadonlyArray<Credit> => {
  const out = new Map<string, Credit>();
  for (const c of [...a, ...b]) {
    const at = `${c.kind}|${c.where}`;
    const before = out.get(at);
    out.set(
      at,
      before ? { ...before, count: before.count + c.count } : { ...c }
    );
  }
  return [...out.values()];
};

const isNameOnly = (p: Contributor) => !p.github && !p.npm;
const isNpmOnly = (p: Contributor) => !p.github && Boolean(p.npm);

/**
 * Credits under a name alone (commits without a GitHub account, a login
 * GitHub no longer knows) folded into the one person with that name or
 * login, and into each other when nobody else has it; a name two people
 * share is left alone. An npm publisher whose username is someone's GitHub
 * login is folded into them too.
 */
export function foldByName(
  people: ReadonlyArray<Contributor>
): ReadonlyArray<Contributor> {
  const byName = new Map<string, Array<Contributor>>();
  const byLogin = new Map<string, Contributor>();
  for (const p of people) {
    if (isNameOnly(p)) continue;
    if (p.github) byLogin.set(p.github.toLowerCase(), p);
    const keys = new Set(
      [p.name, p.github, p.npm].flatMap((k) => (k ? [k.toLowerCase()] : []))
    );
    for (const key of keys) byName.set(key, [...(byName.get(key) ?? []), p]);
  }
  const merged = new Map<Contributor, Contributor>();
  const into = (target: Contributor, p: Contributor) => {
    const before = merged.get(target) ?? target;
    merged.set(target, {
      ...before,
      credits: joinCredits(before.credits, p.credits),
    });
  };
  const loose = new Map<string, Contributor>();
  const kept: Array<Contributor> = [];
  for (const p of people) {
    if (isNpmOnly(p)) {
      const owner = byLogin.get((p.npm ?? '').toLowerCase());
      if (owner) into(owner, p);
      else kept.push(p);
      continue;
    }
    if (!isNameOnly(p)) {
      kept.push(p);
      continue;
    }
    const key = p.name.toLowerCase();
    const [only, ...others] = byName.get(key) ?? [];
    if (only && others.length === 0) {
      into(only, p);
      continue;
    }
    const before = loose.get(key);
    loose.set(
      key,
      before
        ? { ...before, credits: joinCredits(before.credits, p.credits) }
        : p
    );
  }
  return [...kept.map((p) => merged.get(p) ?? p), ...loose.values()];
}
