# Quiet Column

Set a narrow, quiet reading column beneath a small serif identity. Short horizontal rules and generous line spacing give the page character without a sidebar or coloured panel.

Applicants who prefer understated editorial type. Style: editorial; layout: single; default language: en.

Install with `npm install jsonresume-theme-quiet-column`. The package exports a synchronous `render(resume)` function and a default object containing it.

All standard JSON Resume sections render when populated. Text remains selectable, optional web fonts have system fallbacks, and styles are embedded at build time without runtime filesystem access. Narrow screens stack automatically; long resumes continue across A4 and Letter pages.

Set `meta.language` to override the default language. The `meta.researchThemes` preferences support `layout: "single"`, `density: "compact"`, `monochrome: true`, `showPhoto: true` and `showFullAddress: true`. Photos and full addresses are opt-in.

See the repository's theme portfolio spreadsheet and `docs/THEME_PORTFOLIO.md` for design rationale, usage evidence and verification.
