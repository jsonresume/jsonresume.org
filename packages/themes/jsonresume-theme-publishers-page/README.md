# Publishers Page

Use a strong serif masthead, fine red keylines and compact publisher-style metadata. The page should feel typeset, with a single clear reading order and deliberate print continuation.

Publishing, editing and content. Style: editorial; layout: single; default language: en.

Install with `npm install jsonresume-theme-publishers-page`. The package exports a synchronous `render(resume)` function and a default object containing it.

All standard JSON Resume sections render when populated. Text remains selectable, optional web fonts have system fallbacks, and styles are embedded at build time without runtime filesystem access. Narrow screens stack automatically; long resumes continue across A4 and Letter pages.

Set `meta.language` to override the default language. The `meta.researchThemes` preferences support `layout: "single"`, `density: "compact"`, `monochrome: true`, `showPhoto: true` and `showFullAddress: true`. Photos and full addresses are opt-in.

See the repository's theme portfolio spreadsheet and `docs/THEME_PORTFOLIO.md` for design rationale, usage evidence and verification.
