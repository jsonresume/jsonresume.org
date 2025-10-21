# Repository Guidelines

## Project Philosophy & Scope

This repository is a Turborepo-driven Next.js monorepo focused purely on technical excellence—no community morale docs or Code of Conduct. Always build features with performance, maintainability, and developer experience in mind. When adding AI capabilities, standardize on Vercel AI SDK v5 (`ai` + `@ai-sdk/openai`) with streaming responses and tool calling.

## Structure & Shared Modules

Core apps live in `apps/`: the `registry` resume platform and the `homepage2` marketing site. Edge routes reside at `app/api`. Shared UI, linting rules, and utilities come from `packages/` (notably `packages/ui` and the `jsonresume-theme-*` packages). Supabase migrations and config live in `supabase/`, reference docs in `docs/`, helper scripts in `scripts/`, and sample resume data in `resume.yaml`. Keep feature logic, hooks, components, and `*.test.*` files co-located under the relevant app or package.

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
