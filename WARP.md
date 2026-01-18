# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

JSON Resume is a Turborepo-driven Next.js monorepo focused on creating, sharing, and publishing resumes in a standardized JSON format. This repository contains all core applications, themes, and utilities that power the JSON Resume platform.

## Common Commands

### Development

- `pnpm install` — Install workspace dependencies from repo root
- `pnpm turbo dev` — Start all applications (registry on port 3000, homepage2 on port 3002)
- `pnpm turbo dev --filter=registry` — Start only the registry application
- `pnpm turbo dev --filter=homepage2` — Start only the homepage application

### Building & Testing

- `pnpm build` — Execute all build pipelines (run before merging)
- `pnpm turbo test` — Run all Vitest unit test suites (also works as `pnpm turbo test --filter=registry`)
- `pnpm --filter registry test -- --run` — Run tests for a specific package (bypasses turbo)
- `pnpm test:e2e` — Execute Playwright end-to-end tests (boot registry locally first)
- `pnpm lint` — Run ESLint across the entire monorepo
- `pnpm format` — Format code with Prettier (2-space indent, single quotes)

### Database Management

- `supabase link` — Connect CLI to Supabase project
- `supabase db push` — Push migrations to Supabase
- `supabase db reset` — Reset database with fresh schema

### Theme Development

- `pnpm serve:registry` — Start registry and auto-generate theme screenshots
- Visit `http://localhost:3000/thomasdavis?theme=your-theme-name` to test themes

## High-Level Architecture

### Monorepo Structure

- `apps/` — Core applications: `registry` (resume platform) and `homepage2` (marketing site)
- `packages/` — Shared modules:
  - `ui/` — Component library with shadcn/ui components
  - `eslint-config-custom` — Shared ESLint configuration
  - `themes/` — JSON Resume theme packages
  - `resume-core` — Resume schema and primitive components
  - `theme-config` — Theme configuration utilities
- `supabase/` — Database migrations and configuration
- `docs/` — Project documentation
- `scripts/` — Helper scripts for automation

### Key Applications

#### Registry App (`apps/registry/`)

- Next.js application for resume hosting and management
- Uses Vercel AI SDK v5 (`ai` + `@ai-sdk/openai`) for AI features
- Implements authentication with GitHub OAuth
- AI-powered features include job recommendations, cover letters, and interview simulations
- Supports multiple resume themes with server-side rendering
- Built with Supabase for database and Prisma as ORM

#### Homepage2 App (`apps/homepage2/`)

- Next.js marketing site for JSON Resume
- Showcases themes and provides documentation
- Uses shared UI components from `@repo/ui`

### Key Technical Patterns

#### AI Integration

- Standardize on Vercel AI SDK v5 for all AI functionality
- Use streaming responses and tool calling
- AI features require environment variables: `OPENAI_API_KEY`, `PERPLEXITY_API_KEY`, `PINECONE_API_KEY`

#### Database Schema

- Supabase handles persistence and authentication
- Migrations in `supabase/migrations/` follow naming convention: `YYYYMMDDHHMMSS_description.sql`
- Key tables: job_decisions, resume_companies, pathways_conversations, pathways_activity_log

#### Theme Development

- All themes must use React components and avoid Node.js `fs` runtime
- Themes must implement all sections of the JSON Resume schema
- Google Fonts must be loaded via CDN with `<link>` tags
- Themes must meet WCAG AA contrast requirements (4.5:1 for normal text)
- Register themes in `apps/registry/lib/formatters/template/themeConfig.js`

#### Code Organization

- Feature-based folder structure with components, hooks, and utils co-located
- Custom hooks follow naming pattern: `useCamelCase`
- Utilities are pure functions organized by domain
- API routes use Request/Response pattern with validation

#### Testing Strategy

- Focus on testing critical functionality: utilities, business logic, calculations
- Vitest for unit tests, Playwright for E2E testing
- No arbitrary coverage targets - test what matters
- Collocate tests with implementation files (`*.test.(ts|js)`)

### Dependencies

- `pnpm@8.15.9` is required (check `packageManager` field in root package.json)
- All workspace dependencies use `workspace:*` protocol
- Key packages: Next.js, React, Prisma, Supabase, Vercel AI SDK, Playwright

## Important Constraints

### File Size Limits

- Production code: Maximum 200 lines per file
- Tests/Stories/Config: Maximum 500 lines per file
- Large files must be refactored into smaller, focused modules

### Import Patterns

- Always use explicit paths for directory imports: `'./Component/index'` not `'./Component'`
- Import components from `@repo/ui` rather than creating duplicates
- When creating new utilities, search existing codebase first to avoid duplication

### Code Style

- Prettier handles formatting (2-space indent, single quotes)
- TypeScript with strict types, avoid `any`
- Use PascalCase components, camelCase functions/variables
- Enforce single-responsibility principle

### Git Workflow

- Always use local git commands, never the GitHub API for code changes
- If push fails, pull with rebase: `git pull --rebase origin master`, then retry
- Follow conventional commits: `type(scope): summary`

### Testing

- All tests must pass before merging
- E2E tests should be executed with registry running locally
- Use `pnpm --filter registry test -- --run` to run tests outside turbo when needed

## Environment Configuration

Critical environment variables for the registry app:

- `DATABASE_URL` — PostgreSQL connection string
- `OPENAI_API_KEY` — For AI features
- `PINECONE_API_KEY` — Vector database for AI
- `GITHUB_TOKEN` — GitHub API integration
- `SUPABASE_KEY` — Supabase authentication

See `apps/registry/.env.example` for complete configuration.
