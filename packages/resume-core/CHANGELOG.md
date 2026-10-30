# Changelog

## 0.3.7

### Patch Changes

- Updated dependencies [77a952e]
- Updated dependencies [51c4bdf]
  - @jsonresume/types@0.6.1
  - @jsonresume/utils@0.4.1

## 0.3.6

### Patch Changes

- Updated dependencies [b16c926]
- Updated dependencies [5351df4]
  - @jsonresume/types@0.6.0
  - @jsonresume/utils@0.4.0

## 0.3.5

### Patch Changes

- Updated dependencies [6748de7]
  - @jsonresume/types@0.5.0
  - @jsonresume/utils@0.4.0

## 0.3.4

### Patch Changes

- Updated dependencies [117c7bf]
  - @jsonresume/types@0.4.0
  - @jsonresume/utils@0.3.0

## 0.3.3

### Patch Changes

- 2fa869c: README: document that the package ships JSX source and must be consumed through a bundler (Vite, Next.js `transpilePackages`, or esbuild), with working setups.
- Updated dependencies [f14aaac]
- Updated dependencies [640a5eb]
- Updated dependencies [788cab8]
- Updated dependencies [135a859]
- Updated dependencies [135a859]
- Updated dependencies [5a2b1a3]
  - @jsonresume/types@0.3.0
  - @jsonresume/utils@0.3.0

## 0.3.2

### Patch Changes

- Updated dependencies [7aea354]
  - @jsonresume/utils@0.2.2
  - @jsonresume/types@0.2.1

## 0.3.1

### Patch Changes

- ff09f75: `renderResumeDocument` gains a composable `headAfterStyles` option: raw HTML
  inserted in `<head>` AFTER the styled-components tags (for inline `<style>` that
  must override component styles — global resets, body backgrounds, `@media print`
  / `@page` rules). Composes with the existing `head` option (before the styled
  tags), so a theme can reproduce inline-style blocks on either side of the
  component CSS cascade. Backward-compatible (default empty).

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
