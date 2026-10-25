import type { ExploreResults } from '@repo/api';
import type { Entry } from './listing';

export const PAGE_SIZE = 24;

/** The words of a query: "React, Berlin" is react and berlin. */
export const termsOf = (query: string) =>
  query
    .toLowerCase()
    .split(/[\s,]+/)
    .map((t) => t.replace(/^@/, ''))
    .filter((t) => t.length > 0)
    .slice(0, 8);

/** How well an entry matches every term, or 0 when one is missing. */
const relevance = (entry: Entry, terms: ReadonlyArray<string>) => {
  let score = 0;
  for (const term of terms) {
    if (!entry.words.includes(term)) return 0;
    const { name, label, username } = entry.listing;
    score += entry.skillSet.has(term)
      ? 3
      : `${name} ${label ?? ''} ${username}`.toLowerCase().includes(term)
      ? 2
      : 1;
  }
  return score;
};

const newest = (a: Entry, b: Entry) =>
  (b.listing.updatedAt ?? '').localeCompare(a.listing.updatedAt ?? '');

/**
 * The skills most resumes list, as they're most often written ("Python",
 * not "python"). Compounds such as "JavaScript / TypeScript" are left out:
 * as a search they'd only find that exact pairing.
 */
export const popularSkills = (all: ReadonlyArray<Entry>, count = 16) => {
  const tally = new Map<
    string,
    { n: number; spellings: Map<string, number> }
  >();
  for (const entry of all)
    for (const skill of entry.listing.skills) {
      if (/[/,&|]/.test(skill)) continue;
      const key = skill.toLowerCase();
      const seen = tally.get(key) ?? { n: 0, spellings: new Map() };
      seen.n += 1;
      seen.spellings.set(skill, (seen.spellings.get(skill) ?? 0) + 1);
      tally.set(key, seen);
    }
  const commonest = (spellings: Map<string, number>) =>
    [...spellings].sort((a, b) => b[1] - a[1])[0]?.[0] ?? '';
  return [...tally.values()]
    .sort((a, b) => b.n - a.n)
    .slice(0, count)
    .map((s) => commonest(s.spellings));
};

/**
 * One page of people matching every word of the query, best matches first
 * (skills, then name and headline, then anywhere), fuller and newer
 * resumes breaking ties. With no query, the fullest resumes first.
 */
export const search = (
  all: ReadonlyArray<Entry>,
  popular: ReadonlyArray<string>,
  query: string,
  page: number
): ExploreResults => {
  const terms = termsOf(query);
  const ranked =
    terms.length === 0
      ? [...all].sort(
          (a, b) =>
            Math.round(b.fullness) - Math.round(a.fullness) || newest(a, b)
        )
      : all
          .map((entry) => ({ entry, score: relevance(entry, terms) }))
          .filter((r) => r.score > 0)
          .sort(
            (a, b) =>
              b.score - a.score ||
              b.entry.fullness - a.entry.fullness ||
              newest(a.entry, b.entry)
          )
          .map((r) => r.entry);
  const pageCount = Math.max(1, Math.ceil(ranked.length / PAGE_SIZE));
  const current = Math.min(Math.max(1, Math.floor(page) || 1), pageCount);
  return {
    query: query.trim(),
    page: current,
    pageCount,
    total: ranked.length,
    people: ranked
      .slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)
      .map((e) => e.listing),
    popularSkills: [...popular],
  };
};
