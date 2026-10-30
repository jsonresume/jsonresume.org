# @jsonresume/theme-kit

## 1.1.4

### Patch Changes

- @jsonresume/core@0.3.7

## 1.1.3

### Patch Changes

- @jsonresume/core@0.3.6

## 1.1.2

### Patch Changes

- @jsonresume/core@0.3.5

## 1.1.1

### Patch Changes

- @jsonresume/core@0.3.4

## 1.1.0

### Minor Changes

- a33bbec: `findArtifacts` (and so `assertThemeRender`) now flags "Invalid Date", the output of formatting a missing date. Themes must render entries without dates cleanly, since every JSON Resume date is optional.

### Patch Changes

- Updated dependencies [2fa869c]
  - @jsonresume/core@0.3.3

## 1.0.2

### Patch Changes

- @jsonresume/core@0.3.2

## 1.0.1

### Patch Changes

- Updated dependencies [ff09f75]
  - @jsonresume/core@0.3.1

## 1.0.0

### Minor Changes

- ff0f85b: New package: `@jsonresume/theme-kit`, the authoring kit for JSON Resume themes.
  Bundles the SSR document helper (`renderResumeDocument`, `googleFontsLinks`,
  re-exported from `@jsonresume/core/ssr`) with the permanent render +
  section-coverage QA gate (`runThemeRenderQa`, `assertThemeRender`,
  `findArtifacts`, `sectionCoverage`, and the `SECTION_SENTINELS` /
  `BASELINE_SECTIONS` / `HANDLEBARS_THEMES` constants) extracted verbatim from the
  registry gate. (#421)

### Patch Changes

- Updated dependencies [4556376]
- Updated dependencies [ff0f85b]
  - @jsonresume/sample-data@0.2.1
  - @jsonresume/core@0.3.0
