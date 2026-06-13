# jsonresume-theme-french-atelier

## 0.2.4

### Patch Changes

- Updated dependencies [ff09f75]
  - @jsonresume/core@0.3.1

## 0.2.3

### Patch Changes

- 5c23cd2: use @jsonresume/core/ssr renderResumeDocument

## 0.2.2

### Patch Changes

- Updated dependencies [ff0f85b]
  - @jsonresume/core@0.3.0

## 0.2.1

### Patch Changes

- Updated dependencies [36d1759]
  - @jsonresume/core@0.2.0

## 0.2.0

### Minor Changes

- 718690c: Add missing JSON Resume sections (certificates/volunteer/publications); visual and crash fixes.

  Publishes the wave 5-7 theme improvements that currently exist only in git (refs #275). The
  published npm versions are stale: most themes never rendered certificates/volunteer/publications,
  and all carried the `@resume/core` import (renamed to `@jsonresume/core`) plus the Date-shadow
  rendering crash.

  Minor (gained rendered sections via the "render missing sections" batches #363-#366 and the
  operations-precision a11y/markdown work): all themes listed above as `minor` now render the
  previously-missing certificates/volunteer/publications (and related) sections.

  Patch (no new sections; visual, crash and dependency-rename fixes only):

  - consultant-polished: stop crash when certificates/publications present (#359).
  - tokyo-modernist: exports/CI fixes; styled-components moved to dependencies.
  - @jsonresume/theme-stackoverflow: consistent date formatting (#259) + a11y fixes (the
    Yarn-Berry lockfile removal did not change source and does not drive this bump).
  - community-garden, desert-modern, elegant-pink: `@resume/core` -> `@jsonresume/core` import
    fix and visual polish; sections were already rendered.

  Excludes `@jsonresume/jsonresume-theme-professional` (already current on npm) and the private
  themes (claude, creative-confidence, flat, tailwind).
