---
title: Themes
description: Use a theme, or build and publish your own.
---

## Using a theme

Themes are npm packages named `jsonresume-theme-<name>`. Browse them in the
[gallery](https://jsonresume.org/themes/).

- Registry: `?theme=<name>` or `meta.theme` in your resume ([registry guide](/guides/registry))
- CLI: `resume export resume.html --theme <name>` ([CLI guide](/guides/cli))

## Building a theme

A theme is a package that exports a `render` function. It receives the resume
object and returns a complete HTML document as a string:

```js
// index.js
export function render(resume) {
  const { name, label } = resume.basics ?? {};
  return `<!doctype html>
<html>
  <head><meta charset="utf-8"><title>${name ?? 'Resume'}</title></head>
  <body><h1>${name ?? ''}</h1><p>${label ?? ''}</p></body>
</html>`;
}
```

CommonJS (`module.exports = { render }`) works too.

Guidelines:

- **Inline everything.** The output is a single HTML file, so inline CSS and
  base64-encode images. Web fonts can load from a CDN.
- **Keep `render` pure.** No file or network access (`fs`, `http`) at render
  time.
- **Handle missing data.** Every field is optional; a resume may have only
  `basics.name`. Don't render "Invalid Date" for a missing `endDate` (it means
  "present").
- **Escape user content** before inserting it into HTML.
- **Cover every section** you can: `work`, `volunteer`, `education`, `awards`,
  `certificates`, `publications`, `skills`, `languages`, `interests`,
  `references`, `projects`.

Optional exports for PDF export via `resume-cli`:

```js
export const pdfRenderOptions = { mediaType: 'print' };
```

### Try it locally

```bash
resume export resume.html --theme ./path/to/your-theme
```

### Publish

Publish to npm as `jsonresume-theme-<name>`. To have it added to the registry
and gallery, open an issue or PR on
[jsonresume.org](https://github.com/jsonresume/jsonresume.org). The
[reference theme](https://github.com/jsonresume/jsonresume.org/tree/master/packages/themes/jsonresume-theme-reference)
is a maintained starting point.
