# Pixel Professional

A blocky monospace identity and tiny square section markers suggest pixel graphics. Keep the body in a normal readable sans serif and avoid bitmap text or a simulated game interface.

Games and creative technology. Style: playful; layout: left; default language: en.

Install with `npm install jsonresume-theme-pixel-professional`. The package exports a synchronous `render(resume)` function and a default object containing it.

All standard JSON Resume sections render when populated. Text remains selectable, optional web fonts have system fallbacks, and styles are embedded at build time without runtime filesystem access. Narrow screens stack automatically; long resumes continue across A4 and Letter pages.

Set `meta.language` to override the default language. The `meta.researchThemes` preferences support `layout: "single"`, `density: "compact"`, `monochrome: true`, `showPhoto: true` and `showFullAddress: true`. Photos and full addresses are opt-in.

See the repository's theme portfolio spreadsheet and `docs/THEME_PORTFOLIO.md` for design rationale, usage evidence and verification.
