# @repo/resume-themes

Renders a resume as a complete HTML page with any of the gallery's themes.
`renderTheme(slug, resume)` loads the theme package on first use (a theme
that throws on import fails only its own pages), normalises dates,
locations, project summaries and the basics the way themes expect, and makes
sure the page declares UTF-8. Shapes people write that crash or blank
themes are read the way the schema means them (`shapes.ts`): profiles
without a network named from their URL, objects in highlights as text,
skills as a map of groups, a section written as one entry, a missing name;
`even`, which names countries from ISO codes, gets codes for "USA" or
"India" (`regions.ts`). `themeSlug` reads `jsonresume-theme-even`, paths
and known misspellings as the gallery theme they mean. Rendering every
hosted resume in its own theme (2026-11-18) found 8 pages failing, 0 after.

Node runs this package from its TypeScript source rather than through the
app's bundle (`apps/app/vite.config.ts` keeps it external): each theme then
resolves from this package's `node_modules`, and Handlebars themes can read
their template files. So it uses `.ts` import extensions and erasable
TypeScript only.

The test renders every theme with the sample resume and with a resume that
has only a name.
