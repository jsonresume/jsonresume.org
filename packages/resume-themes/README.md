# @repo/resume-themes

Renders a resume as a complete HTML page with any of the gallery's themes.
`renderTheme(slug, resume)` loads the theme package on first use (a theme
that throws on import fails only its own pages), normalises dates,
locations, project summaries and the basics the way themes expect, and makes
sure the page declares UTF-8.

Node runs this package from its TypeScript source rather than through the
app's bundle (`apps/app/vite.config.ts` keeps it external): each theme then
resolves from this package's `node_modules`, and Handlebars themes can read
their template files. So it uses `.ts` import extensions and erasable
TypeScript only.

The test renders every theme with the sample resume and with a resume that
has only a name.
