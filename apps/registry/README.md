# Registry

The JSON Resume registry, hosted at
[registry.jsonresume.org](https://registry.jsonresume.org). It's a Next.js app
that hosts resumes, renders them with any of the official themes, and serves the
project's AI-powered features.

Resumes are published from a public GitHub gist named `resume.json` and become
available at `registry.jsonresume.org/<username>`. The same routes power theme
rendering (`?theme=<slug>`) and the AI tools (job recommendations, cover letters,
resume suggestions, interview simulation).

## Development

From the repo root:

```sh
pnpm install
pnpm turbo dev --filter=registry
```

Or from this directory:

```sh
pnpm dev          # next dev (http://localhost:3000)
pnpm build        # prisma generate + next build
pnpm start        # serve the production build
pnpm lint         # eslint
pnpm typecheck    # tsc --noEmit
pnpm test         # vitest unit tests
pnpm test:e2e     # playwright end-to-end tests
```

Once running, open
[http://localhost:3000/thomasdavis](http://localhost:3000/thomasdavis) to render
a sample resume.

## Environment variables

The registry renders resumes without any configuration. Auth, database, and AI
features need additional keys. Copy [`.env.example`](.env.example) to `.env` and
fill in the values you need — it documents the GitHub OAuth, Supabase, OpenAI,
Perplexity, Pinecone, logging, and webhook variables.

## Where this fits

This app is part of the [jsonresume.org monorepo](../../README.md). Themes come
from [`packages/themes`](../../packages/themes), shared UI from
[`packages/ui`](../../packages/ui), and the schema from
[`packages/schema`](../../packages/schema).

See the root [Contributing Guide](../../CONTRIBUTING.md) before opening a PR.
