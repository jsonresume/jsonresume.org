import { Atom } from 'effect/reactivity';
import { filterThemes, themes } from './catalog';

/** The gallery's search text. */
export const themeQueryAtom = Atom.make('');

/** The selected tag, or null for every theme. */
export const themeTagAtom = Atom.make<string | null>(null);
export const themeLayoutAtom = Atom.make<string | null>(null);
export const themeColorAtom = Atom.make<string | null>(null);
/** The gallery's order; null is its default, recommended first. */
export const themeSortAtom = Atom.make<string | null>(null);

/** The theme open in the preview, or null when it is closed. */
export const themeOpenAtom = Atom.make<string | null>(null);

/** Themes matching the current query and tag. */
export const visibleThemesAtom = Atom.make((get) =>
  filterThemes(themes, {
    query: get(themeQueryAtom),
    tag: null,
    style: get(themeTagAtom),
    layout: get(themeLayoutAtom),
    color: get(themeColorAtom),
    sort: get(themeSortAtom) ?? 'recommended',
  })
);
