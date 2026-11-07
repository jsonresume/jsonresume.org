# Gallery Catalogue

Use a restrained exhibition-catalogue masthead, numbered section labels and two unequal information columns. Achievements remain text-first, with no dependence on portfolio images.

Curators and arts administration. Style: editorial; layout: columns; default language: en.

Install with `npm install jsonresume-theme-gallery-catalogue`. The package exports a synchronous `render(resume)` function and a default object containing it.

All standard JSON Resume sections render when populated. Text remains selectable, optional web fonts have system fallbacks, and styles are embedded at build time without runtime filesystem access. Narrow screens stack automatically; long resumes continue across A4 and Letter pages.

Set `meta.language` to override the default language. The `meta.researchThemes` preferences support `layout: "single"`, `density: "compact"`, `monochrome: true`, `showPhoto: true` and `showFullAddress: true`. Photos and full addresses are opt-in.

See the repository's theme portfolio spreadsheet and `docs/THEME_PORTFOLIO.md` for design rationale, usage evidence and verification.
