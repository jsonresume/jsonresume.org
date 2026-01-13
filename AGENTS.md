# Repository Guidelines

## Project Overview

Bun-powered Next.js monorepo for jsonresume.org. Focus on technical excellence with performance, maintainability, and developer experience. For AI capabilities, use Vercel AI SDK v5 (`ai` + `@ai-sdk/openai`) with streaming responses and tool calling.

## Project Structure

```
jsonresume.org/
├── apps/
│   ├── registry/      # Main resume platform (Next.js 16)
│   ├── homepage2/     # Marketing site (Next.js 15)
│   └── docs/          # Documentation site
├── packages/
│   ├── ui/            # Shared UI components (@repo/ui)
│   ├── themes/        # 40+ jsonresume-theme-* packages
│   ├── resume-core/   # Core resume utilities (@resume/core)
│   └── tsconfig/      # Shared TypeScript configs
├── supabase/          # Database migrations/config
└── scripts/           # Helper scripts
```

## Build, Lint & Test Commands

```bash
# Using just (recommended) - run `just --list` for all commands
just install                              # Install deps
just dev                                  # Start registry app
just dev-all                              # Start all apps
just build                                # Build all packages/apps
just lint                                 # Run ESLint on all packages
just format                               # Run Prettier on all files

# Unit Testing (Vitest)
just test                                 # Run registry tests (watch mode)
just test-run                             # Run registry tests once (CI)
just test-file path/to/file.test.ts       # Single test file
just test-match "test name"               # Single test by name
just test-coverage                        # Run with coverage

# E2E Testing (Playwright)
just test-e2e                             # Run E2E tests (registry must be running)
just playwright-install                   # Install Playwright browsers

# Database
just db-generate                          # Generate Prisma client
just db-push                              # Push schema to Supabase

# Using bun directly
bun install                               # Install deps
bun run dev                               # Start registry app
bun run build                             # Build all packages/apps
bun run lint                              # Run ESLint
bun run test                              # Run tests (watch mode)
bun run test:run                          # Run tests once
bun run test:e2e                          # Run E2E tests
```

## Code Style

**Formatting (Prettier):** 2-space indent, single quotes. Config: `.prettierrc`

**Naming Conventions:**
| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `ResumeEditor`, `LoadingSkeleton` |
| Hooks | useCamelCase | `useSettings`, `useResumeData` |
| Utilities | camelCase | `formatResume`, `calculateDelay` |
| Constants | SCREAMING_SNAKE_CASE | `ERROR_CODES`, `DEFAULT_CONFIG` |
| Test files | `*.test.{ts,tsx}` | `retry.test.ts` |
| E2E tests | `*.spec.js` | `render.spec.js` |

**Import Order:**

```typescript
// 1. External dependencies
import { useState, useEffect } from 'react';
import { NextResponse } from 'next/server';
// 2. Internal packages (workspace aliases)
import { logger } from '@/lib/logger';
import { Button } from '@repo/ui';
// 3. Relative imports
import Resume from './ui/Resume';
import { ERROR_CODES } from './buildError';
```

Path aliases: `@/*` and `~/*` map to app root.

**TypeScript:** Prefer TS, export shared types, avoid `any`, use `strictNullChecks: true`

**File Size Limits:** Production code: 200 lines max | Tests/Stories/Config: 500 lines max

## Error Handling

**Structured Error Codes:**

```javascript
export const ERROR_CODES = Object.freeze({
  INVALID_USERNAME: 'INVALID_USERNAME',
  NON_EXISTENT_GIST: 'NON_EXISTENT_GIST',
});
```

**API Route Pattern:**

```javascript
export async function POST(request) {
  try {
    const body = await request.json();
    if (!isValid(body)) {
      logger.warn('Invalid data');
      return NextResponse.json({ message: 'Invalid data' }, { status: 400 });
    }
    const result = await processData(body);
    logger.debug({ duration }, 'Operation completed');
    return NextResponse.json(result);
  } catch (error) {
    logger.error({ error: error.message }, 'Error description');
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

**Structured Logging (Pino):**

```javascript
import { logger } from '@/lib/logger';
logger.debug({ data }, 'Debug message');
logger.info({ attempt }, 'Info message');
logger.warn({ error: error.message }, 'Warning');
logger.error({ error: error.message }, 'Error');
```

## Testing Guidelines

**Unit Tests (Vitest):**

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('./logger', () => ({
  logger: { error: vi.fn(), info: vi.fn() },
}));

describe('functionToTest', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('describes expected behavior', async () => {
    const result = await functionToTest();
    expect(result).toBe(expected);
  });
});
```

**What to Test:** Pure functions and utilities (formatters, parsers, calculations), business logic hooks with complex logic, API routes for critical endpoints. Do NOT test for coverage numbers - test what matters.

**E2E Tests (Playwright):**

```javascript
const { test, expect } = require('@playwright/test');
test('user can view resume', async ({ page }) => {
  await page.goto('http://localhost:3000/thomasdavis');
  await expect(page.locator('body')).toContainText('Thomas Davis');
});
```

## Architecture Guidelines

**Component Structure:**

```
feature/
├── index.ts              # Public API exports
├── FeatureComponent.tsx  # Main component (<150 lines)
├── useFeatureData.ts     # Custom hooks
├── FeatureHelpers.ts     # Pure utilities
└── FeatureComponent.test.tsx
```

**Theme Development:**

- Themes must be serverless-compatible (NO runtime `fs` usage)
- Use ES6 imports or build-time bundling
- Use `ServerStyleSheet` for styled-components SSR
- Load Google Fonts via CDN in HTML head
- Ensure WCAG AA contrast ratios (4.5:1 for normal text)

## Commits & PR Workflow

**Conventional Commits:** `type(scope): brief description`

- Types: feat, fix, refactor, test, docs, chore, perf
- Example: `fix(navigation): update docs links`

**Before Committing:**

- Run `just lint` and `just format`
- Run `just test-run`
- Run `just build` to verify no build errors

**Before Merging:**

- All CI checks pass
- Run E2E tests if UI changes: `just test-e2e`
- Keep `.env.example` in sync with new env vars
