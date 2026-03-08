# Claude Repository Instructions

## Project

- **Org/Repo:** `jsonresume/jsonresume.org` — ALWAYS use `owner: "jsonresume"`
- **Stack:** Next.js monorepo (Turborepo + pnpm), Vercel deployment, Supabase DB (`registry`)
- **AI SDK:** Use Vercel AI SDK v5 (`ai` + `@ai-sdk/openai`), never vendor SDKs directly

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
- **Themes:** Must use ES6 imports (no `fs.readFileSync`), must render ALL JSON Resume sections, must load Google Fonts via CDN, must use `@resume/core` components, must use `ServerStyleSheet` for styled-components SSR
- **Theme registration:** Add to `apps/registry/lib/formatters/template/themeConfig.js`
- Search codebase before creating new utils — check `apps/registry/app/utils/`, `apps/registry/lib/`, `packages/`

## CI/CD

- Unit tests: `pnpm --filter registry test -- --run` (bypass turbo for selective tests)
- E2E tests: `pnpm test:e2e` (Playwright)
- turbo.json must have task entries for any `pnpm turbo <task>` command
- All env vars used must be declared in turbo.json `globalEnv`
- Security patches: Use `pnpm.overrides` in root package.json

## Issue Management

- Track all work via GitHub issues. Label: critical/bug/enhancement/refactor/testing
- Be skeptical of external user issues — verify before implementing
- Close schema-related issues → direct to schema repo
- Never deprecate themes/features without maintainer approval
- Discord webhook: only post when explicitly asked

## Key Paths

- Theme screenshots: `apps/homepage2/public/img/themes/`
- Screenshot generator: `apps/registry/scripts/generate-theme-screenshots-auto.js`
- Retry utility: `apps/registry/app/lib/retry.js`
- UI components: `packages/ui` (@repo/ui — Button, Input, Textarea with variants)
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
