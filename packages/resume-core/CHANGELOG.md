# Changelog

## 0.3.0

### Minor Changes

- ff0f85b: Add a new `@jsonresume/core/ssr` subpath exporting `renderResumeDocument` and
  `googleFontsLinks`. `renderResumeDocument(element, options)` wraps the
  styled-components `ServerStyleSheet` boilerplate every JSX theme repeats
  (collectStyles + getStyleTags + always-seal) and returns a complete
  `<!DOCTYPE html>` document with Google Font links, optional CSS reset, tokens
  CSS link, title/lang/dir, and extra head HTML. Existing exports are unchanged.
  (#421)

### Patch Changes

- Updated dependencies [4556376]
- Updated dependencies [4556376]
  - @jsonresume/types@0.2.1
  - @jsonresume/utils@0.2.1

## 0.2.0

### Minor Changes

- 36d1759: The pure (framework-free) calculation, date, and URL helpers now live in the
  new `@jsonresume/utils` package; `@jsonresume/core` re-exports them so every
  existing `import { calculateTotalExperience, safeUrl, formatDateRange, ... }
from '@jsonresume/core'` keeps working unchanged. Adds a `./helpers` subpath
  that re-exports `@jsonresume/utils` for discoverability.

  One user-visible bugfix (behavior change):

  - `calculateEducationYears` used the wrong divisor (ms-per-day / 365.25 instead
    of ms-per-day \* 365.25), inflating the result ~133M-fold. It now returns a
    realistic number of years, matching `calculateTotalExperience`.

  `formatDateRange` behavior is unchanged: an explicit `null` `endDate` renders
  `start - Present` (ongoing role); a missing/`undefined` `endDate` renders a
  single date (a point in time, e.g. an award or certificate date).

### Patch Changes

- Updated dependencies [36d1759]
- Updated dependencies [36d1759]
  - @jsonresume/types@0.2.0
  - @jsonresume/utils@0.2.0

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-12-04

### Added

- Initial public release of @jsonresume/core (published under @jsonresume scope for consistency with @jsonresume/schema)
- React primitives for resume components (Section, SectionTitle, ListItem, DateRange, Badge, etc.)
- Design tokens system (typography, colors, spacing, layout, radius, shadows)
- Security utilities (safeUrl, sanitizeHtml, isExternalUrl, getLinkRel)
- 20+ calculation helper functions for resume metrics
- Layout components (Grid, Sidebar, Stack, Card, Flex, TwoColumn)
- Skills components (Bar, Pill, Rating, Group, Cloud, Category)
- Timeline components (Section, Item, Rule, Inline)
- Profile components (Avatar, Card, ContactGrid, SocialLinks)
- Typography components (Heading, Text, Label, Paragraph variants)
- Data display components (Progress, Stats, Metrics, KPIs)
- Experience components (Card, Timeline, Grid, Compact)
- Header/Footer components (multiple variants)
- Quote/testimonial components
- Certification/award components
- Language proficiency components
- Publication/portfolio components
- Table components (SkillMatrix, Comparison, Data)
- Callout/highlight components
- List components (10+ variants)
- Date components (Badge, Relative)
- Visual components (Patterns, ColorBlocks, Dividers, Accents)
- Print utilities (KeepTogether, ColumnBreak, PrintOnly, ScreenOnly)
- Metadata components
- Container components
- Tag and badge components
- ThemeProvider for context
- 200+ total component exports
- Comprehensive TypeScript definitions
- Styled-components integration
- SSR support
- Print optimization
- ATS-friendly semantic HTML
- Accessibility features (ARIA labels, keyboard navigation)
- Responsive mobile-first design

### Documentation

- Comprehensive README with installation, quick start, and examples
- API reference for all component categories
- Security best practices guide
- Styled-components SSR setup guide
- Theme building tutorial
- Calculation helpers examples

### Package Configuration

- npm public package configuration
- Peer dependencies for React 18 and 19
- styled-components dependency
- ES module exports
- TypeScript support
- GitHub repository links
- MIT license

[0.1.0]: https://github.com/jsonresume/jsonresume.org/releases/tag/@jsonresume/core@0.1.0
