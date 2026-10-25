# Repository Guidelines

Two parts: **the new jsonresume.org stack**, which governs `apps/app` and every
package it uses, and **general repository guidelines**, which apply everywhere.
Where they disagree, the new stack wins for new code.

# Part 1: the new jsonresume.org stack

jsonresume.org is being rebuilt from scratch in `apps/app`, served from our own
server (see `SELF_HOSTING_PLAN.md` and `deploy/README.md`). The older apps
(`apps/registry`, `apps/homepage2`) are reference material only: read them for
behaviour and content, never copy their code or patterns.

Everything below applies to `apps/app` and every package it uses. It does not
apply to the older apps.

## Stack (agreed 2026-10-23)

| Concern             | Use                                                                                                                                                                                                           | Not                                                             |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Language            | TypeScript, strict. No `any`, no non-null `!` to silence errors                                                                                                                                               | JavaScript                                                      |
| UI                  | React 19 + `@jsonresume/ui` (vanilla-extract tokens and components)                                                                                                                                           | Tailwind, shadcn, inline `style={{}}`, CSS files                |
| Build               | Vite 6                                                                                                                                                                                                        | Next.js                                                         |
| Routing             | TanStack Router (code-based routes, typed params and search)                                                                                                                                                  | React Router, hand-rolled routing                               |
| State               | Effect Atom: `effect/reactivity` + `@effect/atom-react`                                                                                                                                                       | Zustand, Redux, Jotai, React Query, ad-hoc `useEffect` fetching |
| Effects and errors  | Effect 4 (`effect`), everywhere: server, data, client                                                                                                                                                         | raw promises with try/catch in app code                         |
| Data and validation | Effect Schema (`effect/schema` via `Schema`) for every type that crosses a boundary                                                                                                                           | zod, Ajv, hand-written guards (use `Predicate`)                 |
| HTTP server         | Hono on Node (`@hono/node-server`): static files, pages, middleware                                                                                                                                           | Express, Next API routes, a hand-rolled server                  |
| API                 | Effect `HttpApi` (`effect/http-api`), mounted in Hono at `/api` via `HttpRouter.toWebHandler`                                                                                                                 | Hono RPC routes, hand-written JSON handlers                     |
| API contract        | `HttpApi` defined once in `@repo/api`; clients from `HttpApiClient`/`AtomHttpApi`                                                                                                                             | hand-written fetch wrappers                                     |
| Database            | `effect/sql` + `@effect/sql-pg` against our Postgres                                                                                                                                                          | supabase-js, Prisma                                             |
| Config              | Effect `Config`                                                                                                                                                                                               | reading `process.env` directly                                  |
| Rendering           | TanStack Router SSR (`createRequestHandler`, `RouterServer`, `RouterClient`, `HeadContent`, `Scripts`) via `@repo/ssg`: content pages prerendered through it at build time, dynamic pages rendered by it live | client-only rendering, hand-rolled SSR, TanStack Start          |
| Tests               | Vitest, Testing Library; Effect code runs with `Effect.runPromise` and `TestClock.layer()` (`@effect/vitest` 4 needs vitest 5)                                                                                | Jest                                                            |

Effect 4 ships its own guide and examples in `node_modules/effect/AGENTS.md`
and `node_modules/effect/ai-docs/`. Read them before writing Effect code; the
v3 APIs you may remember (`@effect/platform`, `Schema` from `@effect/schema`,
`Context.Tag`, `Effect.catchAll`) are gone or renamed.

## Packages: build features as reusable packages

Apps are thin. `apps/app` holds routes and wiring; anything with logic, data or
UI that another app could use lives in `packages/*`. Prefer a new focused
package over growing an app.

| Package                   | What it holds                                                                                                                                 |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `@jsonresume/ui`          | Design system: tokens and generic components. No jsonresume.org copy or data. New generic components go here, with a styleguide example.      |
| `@repo/domain`            | Effect Schema models shared by everything (Project, TeamMember, BlogPost, …). No React, no IO.                                                |
| `@repo/content`           | Site content: Markdown documents, blog posts and typed data lists, each decoded with a `@repo/domain` schema. No React.                       |
| `@repo/site`              | The jsonresume.org shell in React: layout, navigation, Markdown and document page templates. Uses `@jsonresume/ui`.                           |
| `@repo/theme-gallery`     | Theme catalog: search and filter logic, its atoms, and the gallery components.                                                                |
| `@repo/project-directory` | Community projects directory: search and category filters, atoms in the URL, directory components.                                            |
| `@repo/schema-explorer`   | Reads a JSON Schema into sections and readable field rows; renders the reference with examples. Used for both schema pages.                   |
| `@repo/url-state`         | `useAtomsInUrl`: keeps atoms in search params, read after hydration so prerendered HTML matches.                                              |
| `@repo/ssg`               | TanStack Router SSR for Vite apps: Vite manifest to router manifest, request renderer, prerendering, hydration, SSR dev server. App-agnostic. |
| `@repo/api`               | The `HttpApi` contract: groups, endpoints, request/response schemas. Shared by server and clients; no server code.                            |
| `@repo/server`            | A Hono app factory: static files with cache rules, the 404 page, health, and the Effect `HttpApi` mounted at `/api`.                          |
| `@repo/profiles`          | Who `/@username` belongs to (`docs/ACCOUNTS_AND_USERNAMES.md`): usernames, ghost profiles mirrored from GitHub gists, their Postgres store.   |
| `@repo/resume-themes`     | Renders a resume with any gallery theme, loading theme packages on first use. Run by Node from source, never bundled (see its README).        |
| `@repo/resume-formats`    | A resume as JSON, YAML or plain text.                                                                                                         |
| `@repo/resume-host`       | Serves `/@username`: picks the theme or format and responds, or returns the problem for the app to explain.                                   |
| `@repo/database`          | The app's Postgres: `PgLive` from `DATABASE_URL` and every migration (`app` schema); PGlite layers for tests and `pnpm dev`.                  |
| `@repo/accounts`          | Accounts: email/password and GitHub sign-in, sessions, email verification, username claims; their Postgres store.                             |
| `@repo/analytics`         | Resume views: the beacon script in themed pages, cookie-free visitor counts, and the dashboard's numbers.                                     |
| `@repo/api-server`        | The server side of `@repo/api`: handlers, the session middleware, GitHub OAuth redirects, cookies.                                            |
| `@repo/api-client`        | The browser's typed client (`AtomHttpApi`): query and mutation atoms, `useIsClient`, the signed-in hint.                                      |
| `@repo/auth-pages`        | Sign in, sign up and choose-a-username pages.                                                                                                 |
| `@repo/dashboard`         | The signed-in app: full-screen shell, overview charts, resume source, settings. Client-rendered.                                              |
| `@repo/jobs`              | Hacker News jobs: the import pipeline (fetch, parse with OpenAI, embed, repost families), the board's queries, matching against a resume.     |
| `@repo/job-board`         | The job board in React: job cards, filters kept in the URL, the /jobs and /jobs/:id pages.                                                    |
| `@repo/mcp`               | jsonresume.org for agents: the MCP server at /mcp (tools, prompts, Bearer auth by API key or OAuth) and the catalog the /mcp page lists.      |
| `@repo/pathways`          | Pathways' career copilot: an OpenAI agent with every MCP tool, acting as the user, streaming its replies.                                     |
| `@repo/resume-pdf`        | Prints a themed resume to PDF with headless Chromium (`/@username.pdf`), loading only the public web.                                         |
| `@repo/ats`               | The ATS check: how tracking systems read a resume, scored from its JSON, with fixes (`/ui`: the report view).                                 |
| `@repo/explore`           | Explore: every public resume, searchable, in an index kept in memory, and the opt-out (`/ui`: the /explore page).                             |
| `@repo/timeline`          | A resume as a timeline for `/@username/timeline` (`/ui`: the page).                                                                           |

Dependency direction: `domain` ← `content`, `api` ← `site`, feature packages ←
`apps/app`. Packages never import from apps. `@jsonresume/ui` imports nothing
from `@repo/*`.

A new package needs: `package.json` (`"type": "module"`, `exports` pointing at
`src/index.ts`, scripts `test`, `typecheck`, `lint`), `tsconfig.json` extending
`tsconfig/base.json`, a short README saying what it is for, and tests.

## Conventions

- **Every feature has MCP tools.** Anything a person can do on jsonresume.org,
  their agent can do through the MCP server (`@repo/mcp`, served at `/mcp`):
  a feature isn't done until its tools are in `@repo/mcp`'s catalog and
  toolkits, with tests through the endpoint. The `/mcp` page lists the
  catalog, so documenting them is automatic.

- **Effect style** (from Effect's own guide): `Effect.gen` inline;
  `Effect.fn("name")` for reusable functions; services as `Context.Service`
  classes with a static `layer`; errors as `Schema.TaggedError`; parse untrusted
  data with `Schema.decodeUnknown*`, never by hand.
- **Routes** are declared in `apps/app/src/routes` with `createRoute` and a
  `head` from `pageHead()` (title, description, canonical URL); the page
  component lives in a `.lazy.tsx` file. The root route renders `<html>` with
  `<HeadContent />` and `<Scripts />`. Data comes from route `loader`s, which
  run on the server and are dehydrated into the HTML. Search params are
  parsed with `Predicate` in the route file: route files load on every page,
  and `Schema` there brings Effect's runtime into the main bundle.
- **State**: derive from the URL first (search params), then atoms. Atoms live
  next to the feature that owns them (usually in its package) and are exported
  for reuse; components read them with `useAtomValue` / `useAtom`. Wrap the
  feature in `RegistryProvider` where it mounts (for example the themes page),
  not the whole app: Effect's runtime then loads only on pages that use atoms,
  and each server render gets its own registry. Move it to the root route once
  there is app-wide state.
- **Bundle size**: page components load per route (`createRoute(...).lazy()`),
  data arrives through route loaders (dehydrated into the HTML), and packages
  expose narrow entry points (`@repo/site/doc`, `@repo/content/slugs`) so the
  main chunk carries only the shell. Check `pnpm build` output when adding
  dependencies to anything every page loads.
- **Content** is data: prose is Markdown in `@repo/content`, lists are typed
  arrays decoded with a schema. Pages render content; they do not contain it.
- **Styling**: vanilla-extract `.css.ts` files using `vars` and `media` from
  `@jsonresume/ui/tokens`. Dynamic values via `createVar` + `assignInlineVars`.
- **Files** stay under 200 lines (tests and config: 500).
- **Logging**: Effect's logger on the server; no `console.*` anywhere.
- **Facts on the site** (counts, dates, commands) must be checked against the
  source of truth, and computed from data where possible.
- **Accessibility**: one `h1` per page, landmarks, alt text, keyboard support;
  component tests run axe.

## Commands

```sh
pnpm --filter app dev          # Vite + SSR dev server: every page server-rendered, with HMR
pnpm --filter app build        # client, SSR and server builds, then prerender
pnpm --filter app start        # serve dist/: Hono, with the Effect API at /api
pnpm --filter app test         # vitest
pnpm turbo typecheck lint test --filter=app...   # app and every package it uses
```

# Part 2: general repository guidelines

These predate the rebuild. The Next.js, Vercel and Supabase specifics describe
the older apps (`apps/registry`, `apps/homepage2`); the style, testing and
commit rules apply to all code.

## Project Philosophy & Scope

This repository is a Turborepo-driven Next.js monorepo focused purely on technical excellence—no community morale docs or Code of Conduct. Always build features with performance, maintainability, and developer experience in mind. When adding AI capabilities, standardize on Vercel AI SDK v5 (`ai` + `@ai-sdk/openai`) with streaming responses and tool calling.

## Structure & Shared Modules

Core apps live in `apps/`: the `registry` resume platform and the `homepage2` marketing site. Edge routes reside at `app/api`. Shared UI, linting rules, and utilities come from `packages/` (notably `packages/ui`, the `@jsonresume/ui` design system documented by `apps/styleguide`, and the `jsonresume-theme-*` packages). Supabase migrations and config live in `supabase/`, reference docs in `docs/`, helper scripts in `scripts/`, and sample resume data in `resume.yaml`. Keep feature logic, hooks, components, and `*.test.*` files co-located under the relevant app or package.

## Build, Test & Tooling

- `pnpm install` — install workspace deps (run from repo root).
- `pnpm turbo dev` / `pnpm turbo dev --filter=registry` — start all or targeted apps.
- `pnpm build` — execute all build pipelines before merging.
- `pnpm lint` and `pnpm format` — enforce shared ESLint + Prettier rules.
- `pnpm turbo test` or `pnpm --filter registry test -- --run` — run Vitest suites.
- `pnpm test:e2e` — execute Playwright flows; boot registry locally first.
- Supabase CLI (`supabase link`, `supabase db push`) manages the `registry` database schema.

## Coding Style & Architecture

Rely on Prettier (2-space indent, single quotes) and `@repo/eslint-config-custom`—avoid manual formatting tweaks. Prefer TypeScript, exporting shared types and avoiding `any`. Use `PascalCase` components, `useCamelCase` hooks, and `camelCase` utilities. Enforce line limits: ≤200 for production code, ≤500 for tests/stories/config. Apply single-responsibility structure by extracting hooks, utilities, and subcomponents, and ensure themes avoid runtime `fs` usage to remain serverless-compatible.

## Testing Expectations

Colocate deterministic Vitest specs (`*.test.(ts|js)`) with the code they cover, focusing on utilities, parsers, calculations, and API handlers over simple UI. Maintain snapshots intentionally and document any temporary gaps. Use the Playwright MCP server to exercise critical flows (login, resume publishing, exports) across desktop and mobile breakpoints. No coverage targets—test what matters and confirm all suites pass before pushing.

## Commits & PR Workflow

Use Conventional Commits (`type(scope): summary`), as in `fix(navigation): update docs links`. Perform local git commits—never rely on GitHub API file updates. PRs must outline changes, link issues, list executed commands (`pnpm lint`, `pnpm turbo test`, `pnpm build`, `pnpm test:e2e` when relevant), and attach screenshots for UI updates. Keep environment samples (`apps/registry/.env.example`) in sync, ensure CI is green, and request review only after validating builds and tests.
