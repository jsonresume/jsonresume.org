# @repo/content

Everything the jsonresume.org site says, as data:

- `src/docs/*.md`: documentation pages (front matter `title`, `description`).
- `src/blog/*.md`: blog posts (front matter `title`, `date`, `author`).
- `src/data/*.json`: projects, team and history.

All of it is decoded with `@repo/domain` schemas when the module loads, so a
bad file fails the build. Documents never hardcode facts that change; they use
placeholders (`{{themeCount}}`, `{{schemaSectionCount}}`, `{{schemaVersion}}`)
filled by `fillFacts`. Markdown is GitHub-flavoured, with no raw HTML and no
`#` heading (the page title is the h1).

Entry points: `@repo/content/facts`, `/placeholders`, `/data`, `/slugs` and
`/documents` (lazy, one module
per Markdown file), or everything from `@repo/content`.

Documents load through Vite (`import.meta.glob`), so consumers build with Vite.
