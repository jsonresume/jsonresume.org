# Monospaced Minimal

A restrained monospace identity and metadata system sits over a highly readable sans body. Use alignment and fine dotted rules instead of terminal effects or fake code.

Technical writers and developers. Style: minimal; layout: single; default language: en.

Install with `npm install jsonresume-theme-monospaced-minimal`. The package exports a synchronous `render(resume)` function and a default object containing it.

All standard JSON Resume sections render when populated. Text remains selectable, optional web fonts have system fallbacks, and styles are embedded at build time without runtime filesystem access. Narrow screens stack automatically; long resumes continue across A4 and Letter pages.

Set `meta.language` to override the default language. The `meta.researchThemes` preferences support `layout: "single"`, `density: "compact"`, `monochrome: true`, `showPhoto: true` and `showFullAddress: true`. Photos and full addresses are opt-in.

See the repository's theme portfolio spreadsheet and `docs/THEME_PORTFOLIO.md` for design rationale, usage evidence and verification.
