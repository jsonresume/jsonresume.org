# Confetti Accent

A few small colour dots decorate an otherwise restrained identity margin. Keep all career content on a plain white field with dark text and conventional, easily scanned section labels.

Applicants wanting a small expressive touch. Style: playful; layout: single; default language: en.

Install with `npm install jsonresume-theme-confetti-accent`. The package exports a synchronous `render(resume)` function and a default object containing it.

All standard JSON Resume sections render when populated. Text remains selectable, optional web fonts have system fallbacks, and styles are embedded at build time without runtime filesystem access. Narrow screens stack automatically; long resumes continue across A4 and Letter pages.

Set `meta.language` to override the default language. The `meta.researchThemes` preferences support `layout: "single"`, `density: "compact"`, `monochrome: true`, `showPhoto: true` and `showFullAddress: true`. Photos and full addresses are opt-in.

See the repository's theme portfolio spreadsheet and `docs/THEME_PORTFOLIO.md` for design rationale, usage evidence and verification.
