# One Page Plus

Use a broad evidence column and a narrow qualifications rail beneath a shallow masthead. Designed to use space efficiently while retaining every section on longer documents.

Concise applications with supporting detail. Style: minimal; layout: right; default language: en.

Install with `npm install jsonresume-theme-one-page-plus`. The package exports a synchronous `render(resume)` function and a default object containing it.

All standard JSON Resume sections render when populated. Text remains selectable, optional web fonts have system fallbacks, and styles are embedded at build time without runtime filesystem access. Narrow screens stack automatically; long resumes continue across A4 and Letter pages.

Set `meta.language` to override the default language. The `meta.researchThemes` preferences support `layout: "single"`, `density: "compact"`, `monochrome: true`, `showPhoto: true` and `showFullAddress: true`. Photos and full addresses are opt-in.

See the repository's theme portfolio spreadsheet and `docs/THEME_PORTFOLIO.md` for design rationale, usage evidence and verification.
