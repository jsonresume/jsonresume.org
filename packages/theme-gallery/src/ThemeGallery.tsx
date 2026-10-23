import { useAtom, useAtomValue } from '@effect/atom-react';
import {
  EmptyState,
  Field,
  FilterBar,
  SearchField,
  Select,
} from '@jsonresume/ui';
import type { ThemeSummary } from '@repo/domain';
import { themeQueryAtom, themeTagAtom, visibleThemesAtom } from './atoms';
import { tagCounts, themes } from './catalog';
import * as s from './gallery.css';
import { ThemeCard } from './ThemeCard';
import { useFilterInUrl } from './useFilterInUrl';

export interface ThemeLinks {
  /** Screenshot URL for a theme. */
  image: (theme: ThemeSummary) => string;
  /** Where a theme card links, e.g. a live preview. */
  href: (theme: ThemeSummary) => string;
}

export interface ThemeGridProps extends ThemeLinks {
  themes: ReadonlyArray<ThemeSummary>;
  /** How many cards load their screenshot eagerly. */
  eagerCount?: number;
  /** Accessible name of the list. */
  label?: string;
}

export function ThemeGrid({
  themes: list,
  image,
  href,
  eagerCount = 0,
  label = 'Themes',
}: ThemeGridProps) {
  return (
    <ul className={s.grid} role="list" aria-label={label}>
      {list.map((theme, index) => (
        <li key={theme.slug}>
          <ThemeCard
            theme={theme}
            image={image(theme)}
            href={href(theme)}
            eager={index < eagerCount}
          />
        </li>
      ))}
    </ul>
  );
}

const tags = tagCounts(themes).filter(({ count }) => count > 1);

/** The full catalog with search and tag filters, kept in the URL. */
export function ThemeGallery(links: ThemeLinks) {
  useFilterInUrl();
  const [query, setQuery] = useAtom(themeQueryAtom);
  const [tag, setTag] = useAtom(themeTagAtom);
  const visible = useAtomValue(visibleThemesAtom);

  const active = [
    ...(query
      ? [{ key: 'q', label: `“${query}”`, onRemove: () => setQuery('') }]
      : []),
    ...(tag ? [{ key: 'tag', label: tag, onRemove: () => setTag(null) }] : []),
  ];

  return (
    <>
      <FilterBar
        className={s.filters}
        label="Filter themes"
        active={active}
        resultCount={visible.length}
        resultLabel={(n) => `${n} ${n === 1 ? 'theme' : 'themes'}`}
        onClearAll={() => {
          setQuery('');
          setTag(null);
        }}
      >
        <Field label="Search">
          <SearchField
            value={query}
            onValueChange={setQuery}
            placeholder="Name, style or colour"
          />
        </Field>
        <Field label="Style">
          <Select
            value={tag ?? ''}
            onChange={(e) => setTag(e.target.value || null)}
          >
            <option value="">Any style</option>
            {tags.map(({ tag: t, count }) => (
              <option key={t} value={t}>
                {t} ({count})
              </option>
            ))}
          </Select>
        </Field>
      </FilterBar>
      {visible.length ? (
        <ThemeGrid themes={visible} eagerCount={4} {...links} />
      ) : (
        <EmptyState className={s.empty} title="No themes match">
          Try another word, or clear the filters.
        </EmptyState>
      )}
    </>
  );
}
