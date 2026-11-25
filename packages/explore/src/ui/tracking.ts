import { track } from '@repo/posthog/browser';
import { useEffect, type MouseEvent } from 'react';

const PAGE_SIZE = 24;

const termsOf = (query: string) =>
  query
    .toLowerCase()
    .split(/[\s,]+/)
    .filter(Boolean);

/**
 * The query, when every word is one of Explore's popular skills ("react
 * berlin" is not): searches can be people's names, and events never carry
 * a name.
 */
const skillQuery = (query: string, skills: ReadonlyArray<string>) => {
  const known = new Set(skills.map((s) => s.toLowerCase()));
  const terms = termsOf(query);
  return terms.length > 0 && terms.every((t) => known.has(t))
    ? terms.join(' ')
    : null;
};

/**
 * What Explore tracks, to see what people look for and whether they find
 * it: each search (how many words and matches, the page, and the words
 * when they are all skills) and which result was opened (its rank).
 */
export function useExploreTracking(
  query: string,
  total: number,
  page: number,
  skills: ReadonlyArray<string>
) {
  const skill = skillQuery(query, skills);
  useEffect(() => {
    track('explore_searched', {
      terms: termsOf(query).length,
      skills: skill,
      total,
      page,
    });
  }, [query, skill, total, page]);

  /** On the results: the card opened, by its place in the list. */
  return (event: MouseEvent<HTMLElement>) => {
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest('a[href^="/@"]');
    const cards = [...event.currentTarget.querySelectorAll('a[href^="/@"]')];
    const index = link ? cards.indexOf(link) : -1;
    if (index < 0) return;
    track('explore_result_opened', {
      terms: termsOf(query).length,
      skills: skill,
      rank: (page - 1) * PAGE_SIZE + index + 1,
      page,
    });
  };
}
