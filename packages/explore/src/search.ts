import type { ExploreResults } from '@repo/api';
import { wordsOf, type Entry } from './listing';

export const PAGE_SIZE = 24;

/** The words of a query: "React, Berlin" is react and berlin. */
export const termsOf = (query: string) =>
  query
    .toLowerCase()
    .split(/[\s,]+/)
    .map((t) => t.replace(/^@/, ''))
    .filter((t) => t.length > 0)
    .slice(0, 8);

/** What may follow a term in another spelling of it: reactjs, react.js, python3. */
const VARIANT = /^(?:\.?js|lang|\d[\w.]*|[-_.].*)$/;

/**
 * How a word matches a term: the same word, or another spelling of it
 * ("react" finds "reactjs", "python" finds "python3"), but never a
 * different word that happens to start the same ("java" isn't "javascript").
 */
const fit = (word: string, term: string) =>
  word === term
    ? 1
    : word.startsWith(term) && VARIANT.test(word.slice(term.length))
    ? 0.5
    : 0;

const best = (words: Iterable<string>, term: string) => {
  let top = 0;
  for (const word of words) {
    top = Math.max(top, fit(word, term));
    if (top === 1) break;
  }
  return top;
};

/** How many skills count as someone's main ones: people list those first. */
const LEAD_SKILLS = 3;

/**
 * How well an entry matches every term, or 0 when one is missing. A skill
 * counts 3, one of the first listed 1 more, and the name or headline 2 on
 * top: with "python", a Python Developer comes before a wireless engineer
 * who lists it eighth (1,684 people list Python, and each used to tie).
 */
const relevance = (entry: Entry, terms: ReadonlyArray<string>) => {
  let score = 0;
  for (const term of terms) {
    const match = best(entry.words, term);
    if (match === 0) return 0;
    const { name, label, username } = entry.listing;
    const skill = entry.skillSet.has(term) ? 3 : 0;
    const lead = entry.skills
      .slice(0, LEAD_SKILLS)
      .some((s) => s.toLowerCase() === term)
      ? 1
      : 0;
    const headline =
      best(wordsOf(`${name} ${label ?? ''} ${username}`), term) > 0 ? 2 : 0;
    score += match * (skill + lead + headline || 1);
  }
  // "data engineer" as written, in the headline: worth more than both words
  // found apart (a "Data" skill and an "Engineer" one).
  if (terms.length > 1) {
    const said = ` ${wordsOf(entry.listing.label ?? '').join(' ')} `;
    if (said.includes(` ${terms.join(' ')} `)) score += 4 * terms.length;
  }
  return score;
};

/** The listing with the skills a search matched shown first. */
const matchedFirst = (entry: Entry, terms: ReadonlyArray<string>) => {
  if (terms.length === 0) return entry.listing;
  const hit = (skill: string) =>
    wordsOf(skill).some((w) => terms.some((t) => fit(w, t) > 0)) ||
    terms.includes(skill.toLowerCase());
  const matched = entry.skills.filter(hit);
  if (matched.length === 0) return entry.listing;
  const rest = entry.listing.skills.filter((s) => !matched.includes(s));
  return { ...entry.listing, skills: [...matched, ...rest].slice(0, 8) };
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
      .map((e) => matchedFirst(e, terms)),
    popularSkills: [...popular],
  };
};
