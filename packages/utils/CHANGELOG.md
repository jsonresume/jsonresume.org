# @jsonresume/utils

## 0.2.2

### Patch Changes

- 7aea354: formatDateRange now formats date-only ISO strings (YYYY/YYYY-MM/YYYY-MM-DD) in UTC, so first-of-month dates no longer shift back a month in non-UTC environments (output changes for such dates when running west of UTC)

## 0.2.1

### Patch Changes

- 4556376: Add a README documenting every export grouped by subpath (`.`, `./dates`,
  `./metrics`, `./url`) with install and usage examples, so the npmjs.com page is
  no longer bare. (#421)

## 0.2.0

### Minor Changes

- 36d1759: New package: framework-free (no React, no styled-components) pure utilities for
  JSON Resume. Subpath exports `.`, `./dates`, `./metrics`, `./url`. Includes the
  date helpers (`formatDateRange`, `getRelativeTime`, `getDuration`,
  `normalizeDates`), the 19 metric/calculation helpers, the URL safety helpers
  (`safeUrl`, `getLinkRel`, `sanitizeHtml`, `isExternalUrl`), and new helpers
  `formatUrlForDisplay`, `formatLocation`, and `normalizeResume`. Includes the
  education-years magnitude bugfix (see `@jsonresume/core`).
