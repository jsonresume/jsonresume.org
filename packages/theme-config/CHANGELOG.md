# @jsonresume/theme-metadata

## 0.3.0

### Minor Changes

- f139330: Publish theme registry metadata publicly as `@jsonresume/theme-metadata` (formerly the private `@repo/theme-config`). Exposes `THEME_METADATA`, `THEME_NAMES`, and `getRandomTheme` so external gallery/picker UIs and library developers can consume JSON Resume theme metadata. Internal consumers keep importing `@repo/theme-config` via a back-compat shim — no breaking changes.

> Previously published internally as `@repo/theme-config`.

## 0.2.0

### Minor Changes

- 251fe8f: Add new theme: Art School Modern — an avant-garde gallery/exhibition aesthetic for designers and artists, with oversized Archivo Black display type, an asymmetric off-grid header with a framed photo plate, an editorial Fraunces serif statement, catalogue-numbered sections, and a single vivid vermilion accent.
