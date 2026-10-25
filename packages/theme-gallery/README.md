# @repo/theme-gallery

The JSON Resume theme catalog as a reusable feature:

- `themes`, `findTheme`, `filterThemes`, `tagCounts`: the catalog from
  `@jsonresume/theme-metadata`, decoded with `ThemeSummary`, and pure filters.
- `themeQueryAtom`, `themeTagAtom`, `visibleThemesAtom`: Effect Atom state.
- `ThemeGallery` (search + style filter, kept in `?q=&tag=`), `ThemeGrid`,
  `ThemeCard`. Apps pass `image` and `href` so screenshots and preview links
  stay theirs.

Render inside `@effect/atom-react`'s `RegistryProvider`.
