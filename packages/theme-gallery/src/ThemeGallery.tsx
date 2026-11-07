import { useAtom, useAtomValue } from '@effect/atom-react';
import {
  ChipGroup,
  EmptyState,
  Field,
  FilterBar,
  SearchField,
} from '@jsonresume/ui';
import { optionParam, textParam, useAtomsInUrl } from '@repo/url-state';
import {
  THEME_STYLES,
  THEME_LAYOUTS,
  THEME_COLORS,
  THEME_USAGE_SOURCE,
} from '@jsonresume/theme-metadata';
import {
  themeQueryAtom,
  themeTagAtom,
  themeLayoutAtom,
  themeColorAtom,
  themeSortAtom,
  visibleThemesAtom,
} from './atoms';
import { facetCounts, themes } from './catalog';
import { ThemeControls } from './ThemeControls';
import * as s from './gallery.css';
import { ThemeGrid, type ThemeLinks } from './ThemeGrid';

const styles = facetCounts(themes, 'style').map(({ value, count }) => ({
  value,
  label: THEME_STYLES[value],
  count,
}));
const updated = new Intl.DateTimeFormat('en-AU', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
}).format(new Date(THEME_USAGE_SOURCE.asOf));

const urlBindings = [
  textParam('q', themeQueryAtom),
  optionParam('style', themeTagAtom),
  optionParam('layout', themeLayoutAtom),
  optionParam('color', themeColorAtom),
  optionParam('sort', themeSortAtom),
];

/** The full catalog with search and tag filters, kept in the URL. */
export function ThemeGallery(links: ThemeLinks) {
  useAtomsInUrl(urlBindings);
  const [query, setQuery] = useAtom(themeQueryAtom);
  const [tag, setTag] = useAtom(themeTagAtom);
  const [layout, setLayout] = useAtom(themeLayoutAtom);
  const [color, setColor] = useAtom(themeColorAtom);
  const [sort, setSort] = useAtom(themeSortAtom);
  const visible = useAtomValue(visibleThemesAtom);

  const active = [
    ...(query
      ? [{ key: 'q', label: `“${query}”`, onRemove: () => setQuery('') }]
      : []),
    ...(tag && tag !== 'research-informed'
      ? [
          {
            key: 'style',
            label: THEME_STYLES[tag] ?? tag,
            onRemove: () => setTag(null),
          },
        ]
      : []),
    ...(layout
      ? [
          {
            key: 'layout',
            label: THEME_LAYOUTS[layout],
            onRemove: () => setLayout(null),
          },
        ]
      : []),
    ...(color
      ? [
          {
            key: 'color',
            label: THEME_COLORS[color],
            onRemove: () => setColor(null),
          },
        ]
      : []),
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
          setLayout(null);
          setColor(null);
        }}
      >
        <Field label="Search" className={s.search}>
          <SearchField
            value={query}
            onValueChange={setQuery}
            placeholder="Name, style or colour"
          />
        </Field>
        <ThemeControls
          layout={layout}
          color={color}
          sort={sort}
          setLayout={setLayout}
          setColor={setColor}
          setSort={setSort}
        />
      </FilterBar>
      <ChipGroup
        className={s.styles}
        label="Style"
        allLabel="All styles"
        options={styles}
        value={tag === 'research-informed' ? null : tag}
        onValueChange={setTag}
      />
      <p className={s.usageNote}>
        Ranked by stored choices across{' '}
        {THEME_USAGE_SOURCE.population.toLocaleString('en')} public resumes.
        Most used includes unchanged defaults; explicitly chosen excludes them.
        Updated {updated}.
      </p>
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
