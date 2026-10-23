# @repo/ssg

TanStack Router's own SSR, packaged for Vite apps (no TanStack Start):

- `@repo/ssg/server`: `createRenderer({ createRouter, manifest })` turns a
  `Request` into the full HTML `Response` (via `createRequestHandler` and
  `RouterServer`); `prerender()` writes chosen paths to static files with it;
  `routerManifestFromVite()` maps Vite's build manifest to the CSS and scripts
  the router injects.
- `@repo/ssg/browser`: `hydrateRouter(router)` hydrates the document with
  `RouterClient`.
- `@repo/ssg/dev`: `startDevServer()` runs Vite in middleware mode and renders
  every page through the server entry, with HMR.

The app's root route renders `<html>`, `<HeadContent />` in `<head>` and
`<Scripts />` at the end of `<body>`; routes declare `head`.
