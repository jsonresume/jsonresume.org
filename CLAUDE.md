# Claude Repository Instructions

## Project

- **Org/Repo:** `jsonresume/jsonresume.org` — ALWAYS use `owner: "jsonresume"`
- **Stack:** Next.js monorepo (Turborepo + pnpm), Vercel deployment, Supabase DB (`registry`)
- **AI SDK:** Use Vercel AI SDK (`ai@^6` + `@ai-sdk/openai@^3`), never vendor SDKs directly
- **Post-consolidation:** This monorepo now absorbs the former standalone repos. The old `resume-schema`, `resume-cli`, `rust-json-resume` repos are **archived** — never link them as live (tracking: #275).

## Packages (publishable)

- `packages/schema` (`@jsonresume/schema`) — THE JSON Resume spec. Consumed internally via `workspace:*`.
- `packages/cli` (`resume-cli`) — Node 18+, Ajv (draft-07, `strict:false` + `ajv-formats`) validation.
- `packages/core-rust` (`json-resume-serde`) — Cargo crate, NOT a pnpm package; excluded from JS tooling.
- `packages/resume-core` (`@jsonresume/core`) — shared theme components. UI: `packages/ui` (`@repo/ui`).

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
- Search codebase before creating new utils — check `apps/registry/app/utils/`, `apps/registry/lib/`, `packages/`

## CI/CD

- **`ci.yml`** runs on `push(master)` + `pull_request` + `merge_group`; fork PRs supported.
- **Required checks:** `Lint + Typecheck`, `build`, `test` (e2e), `unit-test`, `dev-script`.
- Unit tests: `pnpm --filter registry test -- --run` (bypass turbo for selective tests)
- E2E: `pnpm turbo test:e2e` (Playwright) — covers registry + homepage2 + docs
- turbo.json must have task entries for any `pnpm turbo <task>` command
- All env vars used must be declared in turbo.json `globalEnv`
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
