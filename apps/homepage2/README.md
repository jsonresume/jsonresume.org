# Homepage

The JSON Resume marketing site, served at
[jsonresume.org](https://jsonresume.org). It's a Next.js app that introduces the
project, the schema, and the ecosystem of tools and themes.

## Development

From the repo root:

```sh
pnpm install
pnpm turbo dev --filter=homepage2
```

Or from this directory:

```sh
pnpm dev          # next dev (http://localhost:3002)
pnpm build        # prisma generate + next build
pnpm start        # serve the production build
pnpm lint         # next lint
pnpm typecheck    # tsc --noEmit
```

## Where this fits

This app is part of the [jsonresume.org monorepo](../../README.md). The hosted
resume registry lives in [`apps/registry`](../registry) and the documentation
site in [`apps/docs`](../docs).

See the root [Contributing Guide](../../CONTRIBUTING.md) before opening a PR.
