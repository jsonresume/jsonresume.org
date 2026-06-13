---
'@jsonresume/core': minor
---

Add a new `@jsonresume/core/ssr` subpath exporting `renderResumeDocument` and
`googleFontsLinks`. `renderResumeDocument(element, options)` wraps the
styled-components `ServerStyleSheet` boilerplate every JSX theme repeats
(collectStyles + getStyleTags + always-seal) and returns a complete
`<!DOCTYPE html>` document with Google Font links, optional CSS reset, tokens
CSS link, title/lang/dir, and extra head HTML. Existing exports are unchanged.
(#421)
