# @jsonresume/utils

## 0.2.0

### Minor Changes

- 36d1759: New package: framework-free (no React, no styled-components) pure utilities for
  JSON Resume. Subpath exports `.`, `./dates`, `./metrics`, `./url`. Includes the
  date helpers (`formatDateRange`, `getRelativeTime`, `getDuration`,
  `normalizeDates`), the 19 metric/calculation helpers, the URL safety helpers
  (`safeUrl`, `getLinkRel`, `sanitizeHtml`, `isExternalUrl`), and new helpers
  `formatUrlForDisplay`, `formatLocation`, and `normalizeResume`. Includes the
  education-years magnitude bugfix (see `@jsonresume/core`).
