import { Atom } from 'effect/reactivity';
import { filterThemes, themes } from './catalog';

/** The gallery's search text. */
export const themeQueryAtom = Atom.make('');

/** The selected tag, or null for every theme. */
export const themeTagAtom = Atom.make<string | null>(null);

/** Themes matching the current query and tag. */
export const visibleThemesAtom = Atom.make((get) =>
  filterThemes(themes, { query: get(themeQueryAtom), tag: get(themeTagAtom) })
);
