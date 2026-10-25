import { useAtom, useAtomValue } from '@effect/atom-react';
import {
  ChipGroup,
  EmptyState,
  Field,
  FilterBar,
  SearchField,
} from '@jsonresume/ui';
import type { ThemeSummary } from '@repo/domain';
import { optionParam, textParam, useAtomsInUrl } from '@repo/url-state';
import { themeQueryAtom, themeTagAtom, visibleThemesAtom } from './atoms';
import { tagCounts, themes } from './catalog';
import * as s from './gallery.css';
import { ThemeCard } from './ThemeCard';

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

/** The styles most themes share, as one-tap filters. */
const STYLE_CHIPS = 12;
const styles = tagCounts(themes)
  .slice(0, STYLE_CHIPS)
  .map(({ tag, count }) => ({ value: tag, label: tag, count }));

const urlBindings = [
  textParam('q', themeQueryAtom),
  optionParam('style', themeTagAtom),
];

/** The full catalog with search and tag filters, kept in the URL. */
export function ThemeGallery(links: ThemeLinks) {
  useAtomsInUrl(urlBindings);
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
        <Field label="Search" className={s.search}>
          <SearchField
            value={query}
            onValueChange={setQuery}
            placeholder="Name, style or colour"
          />
        </Field>
      </FilterBar>
      <ChipGroup
        className={s.styles}
        label="Style"
        allLabel="All styles"
        options={styles}
        value={tag}
        onValueChange={setTag}
      />
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
