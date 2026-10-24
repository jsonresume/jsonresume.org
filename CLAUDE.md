# Claude Repository Instructions

## Project

- **Org/Repo:** `jsonresume/jsonresume.org` — ALWAYS use `owner: "jsonresume"`
- **New stack (live since 2026-10-24):** jsonresume.org is served by `apps/app` from our own server (see `deploy/README.md`), built with React + Vite, TanStack Router, Effect 4 (Schema, HttpApi server, SQL), Effect Atom and `@jsonresume/ui`, as reusable `packages/*`. Follow AGENTS.md for all new code: @AGENTS.md
- **Legacy stack:** Next.js monorepo (Turborepo + pnpm), Vercel deployment, Supabase DB (`registry`) — `apps/registry` and `apps/homepage2`, now reference only. The registry is deprecated: registry.jsonresume.org redirects to jsonresume.org (resumes to `/@username`, everything else to `/registry`, which lists what hasn't been ported and asks for GitHub issues). Its data is kept (Supabase, CockroachDB, and the copy in our Postgres).
- **AI SDK:** Use Vercel AI SDK (`ai@^6` + `@ai-sdk/openai@^3`), never vendor SDKs directly
- **Post-consolidation:** This monorepo now absorbs the former standalone repos. The old `resume-schema`, `resume-cli`, `rust-json-resume` repos are **archived** — never link them as live (tracking: #275).

## Packages (publishable)

- `packages/schema` (`@jsonresume/schema`) — THE JSON Resume spec. Consumed internally via `workspace:*`.
- `packages/cli` (`resume-cli`) — Node 18+, Ajv (draft-07, `strict:false` + `ajv-formats`) validation.
- `packages/core-rust` (`json-resume-serde`) — Cargo crate, NOT a pnpm package; excluded from JS tooling.
- `packages/resume-core` (`@jsonresume/core`) — shared theme components. UI: `packages/ui` (`@jsonresume/ui`, the design system: vanilla-extract tokens + React, documented by `apps/styleguide` at styleguide.jsonresume.org; no Tailwind). `packages/ui-legacy` (`@repo/ui`) is the old shadcn/Tailwind set the registry still uses. Style with vanilla-extract `.css.ts` files and `vars` tokens (dynamic values via `createVar` + `assignInlineVars`), not inline `style={{}}` or plain CSS.

## Code Standards

- **Max 200 lines** per production file (tests/config: 500 max)
- No `console.log` — use Pino structured logger (`LOG_LEVEL` env var)
- No `any` types. No skipped tests on main branch
- Run `pnpm build` locally before pushing — catches 90% of deployment issues
- Never remove features — create issues for human review if something is broken beyond repair

## Git Workflow

- **ALWAYS local git:** `git add → git commit → git push` — NEVER use GitHub API for file changes
- If push fails: `git pull --rebase origin master` then retry
- Commit format: `type(scope): description` (feat/fix/refactor/test/docs/chore/perf)
- Run commands from repo root

## Architecture Patterns

- **Circular imports:** When file and directory share a name, use explicit path: `'./Component/index.js'`
- **Logger exports:** Triple export pattern (CommonJS default + ES6 default + named)
- **Themes:** Must use ES6 imports (no `fs.readFileSync`), must render ALL JSON Resume sections, must load Google Fonts via CDN, must use `@jsonresume/core` components, must use `ServerStyleSheet` for styled-components SSR
- **Theme registration:** Add to `apps/registry/lib/formatters/template/themeConfig.js`
- **Theme SSR gotcha:** if a theme 400s with `Cannot read properties of undefined (reading 'withConfig')` under the registry's webpack build (but works in plain Node), its styled-components definitions live in a `.js` module — move them into a `.jsx` file (fixed desert-modern; tokyo-modernist was fixed earlier by inlining styles into Resume.jsx). Verify with a production build, not `next dev`.
- **Bulk live-testing themes:** run `next start` with `GITHUB_TOKEN=$(gh auth token)` or with `AUTH_GITHUB_ID`/`AUTH_GITHUB_SECRET` set — anonymous GitHub lookups rate-limit after ~60 requests and surface as `GITHUB_UNAVAILABLE` 503s.
- **Gist lookups auth chain** (`lib/getResumeGist.js`): `GITHUB_TOKEN` bearer → on 401, or when unset, the OAuth app credentials as Basic auth (5000/h) → anonymous. Only a GitHub 404 is `INVALID_USERNAME`. A revoked prod token caused the 2026-10-22 outage (#464).
- **Slow LLM/embedding results:** cache by content with `cachedByContent()` (`lib/contentCache.js`, Vercel Runtime Cache). The CDN alone rarely hits behind Cloudflare.
- **Never return embedding columns** (`embedding*`, ~40KB/row) to clients; use `JOB_COLUMNS` (`lib/jobColumns.js`). Vercel caps responses at 4.5MB.
- **`next dev` artifacts:** Next 16 writes `apps/*/AGENTS.md`, `apps/*/CLAUDE.md` and rewrites `next-env.d.ts`. Don't commit them.
- **Vercel file tracing:** `outputFileTracingIncludes` must use the real `node_modules/.pnpm/...` path; files reached through pnpm's symlinks make Vercel reject the function ("files in symlinked directories"). Verify packaging changes with a `vercel deploy` preview.
- Search codebase before creating new utils — check `apps/registry/app/utils/`, `apps/registry/lib/`, `packages/`

## CI/CD

- **`ci.yml`** runs on `push(master)` + `pull_request` + `merge_group`; fork PRs supported.
- **Required checks:** `Lint + Typecheck`, `build`, `test` (e2e), `unit-test`, `dev-script`.
- Unit tests: `pnpm --filter registry test -- --run` (bypass turbo for selective tests)
- E2E: `pnpm turbo test:e2e` (Playwright) — covers registry + homepage2 + docs
- turbo.json must have task entries for any `pnpm turbo <task>` command
- All env vars used must be declared in turbo.json `globalEnv`
- **Branch protection requires up-to-date branches:** with several PRs queued, update and auto-merge them one at a time (`gh pr update-branch N` then `gh pr merge N --squash --auto`).
- **Theme `dist/` is committed** and the `Theme dist sync` check compares it to `src/`: rebuild with `pnpm build` in the theme after editing.
- **LINT GOTCHA:** `eslint-config-next` is PINNED to `^15` in `@repo/eslint-config-custom` via `require.resolve`. v16 ships an ESLint-9 flat-config ARRAY that crashes ESLint 8 with a circular-structure error — and turbo's remote cache can MASK the failure. Never bump it to 16 without migrating to flat config; verify lint changes with `turbo lint --force`.

## Releases (Changesets)

- See `docs/RELEASING.md`. Add a changeset with your PR: `pnpm changeset`.
- Merge to `master` → workflow opens/updates a **"Version Packages"** PR → merge it → auto-publish to npm.
- Manual dispatch: `gh workflow run release-packages.yml`. npm maintenance: `gh workflow run npm-maintenance.yml`.

## Security & Deps

- Security patches: `pnpm.overrides` in root `package.json` (~79 entries live there now).
- Dependabot runs weekly, grouped.
- `.prettierignore` excludes `packages/cli`, `packages/core-rust`, package READMEs, and generated/CSS files — keep them out of prettier runs.

## Issue & Community Management

- Track all work via GitHub issues. Label: critical/bug/enhancement/refactor/testing
- `CONTRIBUTING.md`, `docs/RELEASING.md`, and issue forms exist — point contributors there.
- Schema is now in-repo (`packages/schema`) — handle schema issues HERE, not an external repo.
- Be skeptical of external user issues — verify before implementing
- Never deprecate themes/features without maintainer approval
- **Comments policy:** terse, no emoji; sign agent-authored comments `— AI` on its own line.
- Discord webhook: only post when explicitly asked

## Schema Gotcha

- `schema.json` has `additionalProperties: true` — unknown fields are VALID. Invalid-case test fixtures must use **type violations**, not unknown keys.
- The registry validates against its **own copy** (`apps/registry/lib/schema/`); `lib/schema.test.js` fails if it lacks a field the published schema declares. Schema PRs also regenerate `@jsonresume/types` (`pnpm --filter @jsonresume/types build`). Proposal rules: CONTRIBUTING.md → Proposing Schema Changes.

## Key Paths

- Theme screenshots: `apps/homepage2/public/img/themes/`
- Screenshot generator: `apps/registry/scripts/generate-theme-screenshots-auto.js`
- Retry utility: `apps/registry/lib/retry.js`
- Theme ideas: `packages/themes/ideas.md`
- Theme dev guide: `docs/AGENT_THEME_DEVELOPMENT.md`

## Theme Development Workflow

1. Start dev server: `cd apps/registry && pnpm dev`
2. Build complete theme with all sections
3. Screenshot with Playwright, review, iterate until polished
4. Test at `http://localhost:3000/thomasdavis?theme={slug}`
5. Each theme MUST have a visually distinct layout from existing themes

## Principles

- Bias toward action. Ship incrementally. User experience first.
- Prioritize bugs/features over maintenance/refactoring
- Never over-engineer. Minimum complexity for current task.
- Update this file with important learnings for future sessions.
