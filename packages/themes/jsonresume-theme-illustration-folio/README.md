# Illustration Folio

A friendly serif identity and pencil-like red dividers support a project-forward resume. Avoid requiring illustrations inside the document; portfolio links and applicant-supplied photos remain optional.

Illustrators and visual storytellers. Style: creative; layout: single; default language: en.

Install with `npm install jsonresume-theme-illustration-folio`. The package exports a synchronous `render(resume)` function and a default object containing it.

All standard JSON Resume sections render when populated. Text remains selectable, optional web fonts have system fallbacks, and styles are embedded at build time without runtime filesystem access. Narrow screens stack automatically; long resumes continue across A4 and Letter pages.

Set `meta.language` to override the default language. The `meta.researchThemes` preferences support `layout: "single"`, `density: "compact"`, `monochrome: true`, `showPhoto: true` and `showFullAddress: true`. Photos and full addresses are opt-in.

See the repository's theme portfolio spreadsheet and `docs/THEME_PORTFOLIO.md` for design rationale, usage evidence and verification.
