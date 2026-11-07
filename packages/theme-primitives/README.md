# JSON Resume theme primitives

Shared typed document rendering for the ten research-informed theme families. Each theme supplies its own vanilla-extract tokens, layout and typography. The renderer preserves all standard resume sections, escapes content through React, restricts links, and supports incomplete and international data without mutating it.

`createTheme(options)` returns the standard synchronous `render(resume): string` interface. Styles are compiled and embedded at build time through `scripts/resume-theme-build.ts`; consuming packages need no CSS loader, JavaScript hydration, runtime filesystem access or stylesheet network request. Google Fonts are optional and local fallback stacks remain available.

`meta.researchThemes` supports `sectionOrder`, `layout: 'single'`, `density: 'compact'`, `monochrome`, `showPhoto` and `showFullAddress`. Sections omitted from an order still render. `meta.language` localises English, French, German and Spanish headings; other languages keep identified English headings. Images and street addresses are opt-in.

Run `pnpm --filter @jsonresume/theme-primitives build`, `test`, `typecheck` and `lint`. Tests exercise the compiled package, including content coverage, escaping, links, dates, ordering, malformed optional fields, localisation and user preferences. Browser and PDF checks are documented with the theme collection.
