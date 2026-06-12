# Docs

The JSON Resume documentation site, served at
[docs.jsonresume.org](https://docs.jsonresume.org). It's built with
[Fumadocs](https://fumadocs.dev) on top of Next.js, and the
`deploy-docs.yml` workflow publishes a static export to GitHub Pages.

Content is authored as MDX; `fumadocs-mdx` runs on `postinstall` and as part of
`typecheck` to generate the docs source.

## Development

From the repo root:

```sh
pnpm install
pnpm turbo dev --filter=docs
```

Or from this directory:

```sh
pnpm dev          # next dev (http://localhost:3002)
pnpm build        # next build
pnpm start        # serve the production build
pnpm lint         # eslint
pnpm typecheck    # fumadocs-mdx + tsc --noEmit
```

> The `dev` script and `apps/homepage2` both default to port 3002, so run them
> one at a time or pass a different `--port`.

## Where this fits

This app is part of the [jsonresume.org monorepo](../../README.md). The marketing
site lives in [`apps/homepage2`](../homepage2) and the hosted registry in
[`apps/registry`](../registry).

See the root [Contributing Guide](../../CONTRIBUTING.md) before opening a PR.
