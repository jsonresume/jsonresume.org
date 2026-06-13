---
'@jsonresume/core': minor
---

The pure (framework-free) calculation, date, and URL helpers now live in the
new `@jsonresume/utils` package; `@jsonresume/core` re-exports them so every
existing `import { calculateTotalExperience, safeUrl, formatDateRange, ... }
from '@jsonresume/core'` keeps working unchanged. Adds a `./helpers` subpath
that re-exports `@jsonresume/utils` for discoverability.

Two user-visible bugfixes (behavior change):

- `calculateEducationYears` used the wrong divisor (ms-per-day / 365.25 instead
  of ms-per-day \* 365.25), inflating the result ~133M-fold. It now returns a
  realistic number of years, matching `calculateTotalExperience`.
- `formatDateRange` now treats a missing/`undefined` `endDate` the same as a
  `null` `endDate` (ongoing role): it renders `start - Present` instead of a
  bare single date.
