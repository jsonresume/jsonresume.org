import { THEME_METADATA } from '@jsonresume/theme-metadata';
import { ThemeSummary } from '@repo/domain';
import { Schema } from 'effect';

// Validated where the site is built and rendered; the browser gets checked data.
const decodeThemes = import.meta.env.SSR
  ? Schema.decodeUnknownSync(Schema.Array(ThemeSummary))
  : (input: unknown) => input as ReadonlyArray<ThemeSummary>;

/** Every theme the registry renders, A to Z, checked against the schema. */
export const themes: ReadonlyArray<ThemeSummary> = decodeThemes(
  Object.entries(THEME_METADATA)
    .map(([slug, meta]) => ({ slug, ...meta }))
    .sort((a, b) => a.name.localeCompare(b.name))
);

export const findTheme = (slug: string): ThemeSummary | undefined =>
  themes.find((theme) => theme.slug === slug);

export interface ThemeFilter {
  /** Free text, matched against name, description, author and tags. */
  query: string;
  /** Only themes with this tag, or every theme when null. */
  tag: string | null;
}

export const emptyFilter: ThemeFilter = { query: '', tag: null };

const haystack = (theme: ThemeSummary) =>
  [theme.name, theme.description, theme.author, ...theme.tags]
    .join(' ')
    .toLowerCase();

/** Themes matching every word of the query and the tag, in catalog order. */
export function filterThemes(
  list: ReadonlyArray<ThemeSummary>,
  { query, tag }: ThemeFilter
): ReadonlyArray<ThemeSummary> {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  return list.filter(
    (theme) =>
      (tag === null || theme.tags.includes(tag)) &&
      words.every((word) => haystack(theme).includes(word))
  );
}

export interface TagCount {
  tag: string;
  count: number;
}

/** Tags by how many themes use them, most used first, then A to Z. */
export function tagCounts(list: ReadonlyArray<ThemeSummary>): TagCount[] {
  const counts = new Map<string, number>();
  for (const theme of list) {
    for (const tag of theme.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}
