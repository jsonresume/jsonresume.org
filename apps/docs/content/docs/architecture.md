---
title: How jsonresume.org is built
description: The live site's stack, how a request is served, and the package that holds each feature.
---

jsonresume.org is `apps/app` in the
[jsonresume.org repository](https://github.com/jsonresume/jsonresume.org),
live since October 2026 on the project's own server. The app is thin: it holds
routes and wiring, and every feature is a package in `packages/*`.

## Stack

| Concern               | Used                                                                      |
| --------------------- | ------------------------------------------------------------------------- |
| Language              | TypeScript, strict                                                        |
| UI                    | React 19 and `@jsonresume/ui` (vanilla-extract tokens and components)     |
| Build                 | Vite                                                                      |
| Routing and rendering | TanStack Router, server-rendered; content pages prerendered at build time |
| Server                | Hono on Node                                                              |
| API                   | Effect `HttpApi`, defined once in `@repo/api`, mounted at `/api`          |
| State                 | Effect Atom                                                               |
| Data and validation   | Effect Schema                                                             |
| Database              | Postgres through `effect/sql`                                             |
| AI                    | Effect AI (`effect/ai` with `@effect/ai-openai`)                          |
| Tests                 | Vitest and Testing Library; Playwright end to end                         |

## How a request is served

- **Pages** are rendered by TanStack Router on the server and hydrated in the
  browser. Content pages (the schema, guides, the blog) are prerendered when
  the app is built.
- **`/api`** is the Effect `HttpApi`. The browser's typed client comes from the
  same contract, so client and server can't disagree on a shape.
- **`/@username`** is served by `@repo/resume-host`: it finds the resume (an
  account's saved copy, or a public GitHub gist kept as a mirror), then renders
  a theme or a download format.
- **`/mcp`** is the MCP server for AI agents. Every feature a person can use on
  the site has MCP tools.
- **`/docs`** (this site) is `apps/docs`, a static Fumadocs export.

## Packages

| Package                                                                                                      | What it holds                                                |
| ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------ |
| [`@jsonresume/ui`](https://github.com/jsonresume/jsonresume.org/tree/master/packages/ui)                     | Design system: tokens and generic components                 |
| [`@repo/domain`](https://github.com/jsonresume/jsonresume.org/tree/master/packages/domain)                   | Effect Schema models shared by everything                    |
| [`@repo/content`](https://github.com/jsonresume/jsonresume.org/tree/master/packages/content)                 | Site copy, Markdown documents and typed data lists           |
| [`@repo/site`](https://github.com/jsonresume/jsonresume.org/tree/master/packages/site)                       | The site shell: layout, navigation, page templates           |
| [`@repo/ssg`](https://github.com/jsonresume/jsonresume.org/tree/master/packages/ssg)                         | Server rendering, prerendering and hydration for Vite apps   |
| [`@repo/api`](https://github.com/jsonresume/jsonresume.org/tree/master/packages/api)                         | The `HttpApi` contract: endpoints and their schemas          |
| [`@repo/api-server`](https://github.com/jsonresume/jsonresume.org/tree/master/packages/api-server)           | The API's handlers, sessions and GitHub sign-in              |
| [`@repo/api-client`](https://github.com/jsonresume/jsonresume.org/tree/master/packages/api-client)           | The browser's typed client and its atoms                     |
| [`@repo/server`](https://github.com/jsonresume/jsonresume.org/tree/master/packages/server)                   | The Hono app: static files, the 404 page, health, `/api`     |
| [`@repo/database`](https://github.com/jsonresume/jsonresume.org/tree/master/packages/database)               | Postgres connection and every migration                      |
| [`@repo/accounts`](https://github.com/jsonresume/jsonresume.org/tree/master/packages/accounts)               | Accounts: email and GitHub sign-in, sessions, OAuth provider |
| [`@repo/profiles`](https://github.com/jsonresume/jsonresume.org/tree/master/packages/profiles)               | Who `/@username` belongs to, and gist mirrors                |
| [`@repo/resume-host`](https://github.com/jsonresume/jsonresume.org/tree/master/packages/resume-host)         | Serves `/@username`: picks the theme or format               |
| [`@repo/resume-themes`](https://github.com/jsonresume/jsonresume.org/tree/master/packages/resume-themes)     | Renders a resume with any gallery theme                      |
| [`@repo/resume-formats`](https://github.com/jsonresume/jsonresume.org/tree/master/packages/resume-formats)   | JSON, YAML, text, RenderCV, Word and QR code                 |
| [`@repo/resume-pdf`](https://github.com/jsonresume/jsonresume.org/tree/master/packages/resume-pdf)           | PDFs, printed with headless Chromium                         |
| [`@repo/resume-versions`](https://github.com/jsonresume/jsonresume.org/tree/master/packages/resume-versions) | Every save as a version, and restore                         |
| [`@repo/analytics`](https://github.com/jsonresume/jsonresume.org/tree/master/packages/analytics)             | Cookie-free resume view counts                               |
| [`@repo/auth-pages`](https://github.com/jsonresume/jsonresume.org/tree/master/packages/auth-pages)           | Sign in, sign up and choose-a-username pages                 |
| [`@repo/dashboard`](https://github.com/jsonresume/jsonresume.org/tree/master/packages/dashboard)             | The signed-in app: editor, overview, settings                |
| [`@repo/explore`](https://github.com/jsonresume/jsonresume.org/tree/master/packages/explore)                 | Explore: every public resume, searchable                     |
| [`@repo/theme-gallery`](https://github.com/jsonresume/jsonresume.org/tree/master/packages/theme-gallery)     | The theme gallery and its search                             |
| [`@repo/schema-explorer`](https://github.com/jsonresume/jsonresume.org/tree/master/packages/schema-explorer) | The readable schema reference                                |
| [`@repo/jobs`](https://github.com/jsonresume/jsonresume.org/tree/master/packages/jobs)                       | Hacker News jobs: import pipeline and matching               |
| [`@repo/job-board`](https://github.com/jsonresume/jsonresume.org/tree/master/packages/job-board)             | The job board pages                                          |
| [`@repo/job-digest`](https://github.com/jsonresume/jsonresume.org/tree/master/packages/job-digest)           | The opt-in weekly jobs email                                 |
| [`@repo/careers`](https://github.com/jsonresume/jsonresume.org/tree/master/packages/careers)                 | Career tree: skill evidence, roles, where people go next     |
| [`@repo/pathways`](https://github.com/jsonresume/jsonresume.org/tree/master/packages/pathways)               | The career copilot agent                                     |
| [`@repo/ats`](https://github.com/jsonresume/jsonresume.org/tree/master/packages/ats)                         | The ATS check and its report                                 |
| [`@repo/timeline`](https://github.com/jsonresume/jsonresume.org/tree/master/packages/timeline)               | A resume as a timeline                                       |
| [`@repo/images`](https://github.com/jsonresume/jsonresume.org/tree/master/packages/images)                   | Other sites' images, resized and cached                      |
| [`@repo/posthog`](https://github.com/jsonresume/jsonresume.org/tree/master/packages/posthog)                 | Cookie-free product analytics                                |
| [`@repo/mcp`](https://github.com/jsonresume/jsonresume.org/tree/master/packages/mcp)                         | The MCP server and its tool catalog                          |

Each package has a README saying what it is for.

## Working on it

```bash
pnpm install
pnpm --filter app dev
```

That serves http://localhost:5173 with every page server-rendered, on an
in-memory database. No secrets are needed, and public gists load, so
`/@thomasdavis` works. Test one package at a time with
`pnpm --filter <package> test`.

The conventions every change follows are in
[AGENTS.md](https://github.com/jsonresume/jsonresume.org/blob/master/AGENTS.md),
and how to propose one is in
[CONTRIBUTING.md](https://github.com/jsonresume/jsonresume.org/blob/master/CONTRIBUTING.md).

`apps/registry` and `apps/homepage2` are the Next.js apps the site ran on
before October 2026. They are kept for reference only. The pages under
**Legacy internals** describe them, not the live site.
