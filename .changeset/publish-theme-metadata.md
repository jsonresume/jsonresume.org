---
'@jsonresume/theme-metadata': minor
---

Publish theme registry metadata publicly as `@jsonresume/theme-metadata` (formerly the private `@repo/theme-config`). Exposes `THEME_METADATA`, `THEME_NAMES`, and `getRandomTheme` so external gallery/picker UIs and library developers can consume JSON Resume theme metadata. Internal consumers keep importing `@repo/theme-config` via a back-compat shim — no breaking changes.
