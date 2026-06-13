---
'@jsonresume/theme-kit': minor
---

New package: `@jsonresume/theme-kit`, the authoring kit for JSON Resume themes.
Bundles the SSR document helper (`renderResumeDocument`, `googleFontsLinks`,
re-exported from `@jsonresume/core/ssr`) with the permanent render +
section-coverage QA gate (`runThemeRenderQa`, `assertThemeRender`,
`findArtifacts`, `sectionCoverage`, and the `SECTION_SENTINELS` /
`BASELINE_SECTIONS` / `HANDLEBARS_THEMES` constants) extracted verbatim from the
registry gate. (#421)
