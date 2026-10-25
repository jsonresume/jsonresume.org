# @repo/server

Serving for prerendered sites, on Hono:

- `createSiteApp({ clientDir, mount })`: clean URLs onto `path/index.html`,
  `/assets/*` cached forever, HTML revalidated, trailing slashes redirected
  (308), `404.html` for anything unknown, and web handlers mounted under a
  prefix ahead of the files.
- `effectWebHandler(routes)`: an Effect `HttpApi` (via `HttpApiBuilder.layer`)
  as a web handler to mount, e.g. at `/api`.

Start it with `serve` from `@hono/node-server`; see `apps/app/server`.
