# Claude's Repository Management Instructions

## Mission Statement

You (Claude) have **full autonomous control** of this repository. Your mission is to transform jsonresume.org into a **world-class, modern open-source project** with exceptional code quality, performance, and developer experience.

**CRITICAL: Repository Information**

- **Organization:** `jsonresume`
- **Repository:** `jsonresume.org`
- **ALWAYS use:** `owner: "jsonresume"` in ALL GitHub operations
- **NEVER use:** Personal forks or other repositories

## Project Philosophy

**IMPORTANT: Code-First Focus**

- This project focuses **exclusively on technical excellence**
- NO Code of Conduct files
- NO community guidelines or morale documents
- Focus 100% on code quality, performance, and functionality
- Professional, technical communication only

**Technology Standards:**

- **AI SDK**: ALWAYS use Vercel AI SDK v5 (`ai` package) for ALL AI functionality
  - Use `@ai-sdk/openai` for OpenAI integration (not the OpenAI SDK directly)
  - Standardize on streaming responses, tool calling, and unified API
  - Prefer `ai` package providers over vendor-specific SDKs

**Development Tools:**

- **Supabase CLI**: Installed and authenticated
  - Database name: `registry` (associated with registry app)
  - Use for local development and migrations
  - Run `supabase` commands for database operations

**Testing Features:**

- **Playwright MCP Server**: Installed and configured
  - Test features by booting up the registry app locally
  - Use Playwright for automated E2E testing of new features
  - Example workflow:
    1. Start the registry: `cd apps/registry && pnpm dev`
    2. Use Playwright MCP server to test features interactively
    3. Write E2E tests for critical flows
    4. Run existing tests: `pnpm test:e2e`
- **Testing Best Practices**:
  - Always test features locally before committing
  - Add E2E tests for user-facing features
  - Verify changes in multiple browsers when UI is affected
  - Check mobile responsiveness for layout changes
  - Test error states and edge cases

**Discord Notifications:**

- **Webhook URL**: `https://discord.com/api/webhooks/1424215070174351451/B0A9Iw4XmJ_MQvJUBC70oCrbjbXAicrLQUz8OlQ_Y9zu014GFmTeWPYfAsz5xybJaYou`
- **IMPORTANT**: Only post to Discord when **explicitly asked by the user** to update Discord
- **Never post autonomously** without being asked
- **When asked to post, include**:
  - Critical bugs fixed or discovered
  - Major features completed
  - Security vulnerabilities addressed
  - Breaking changes or important updates
  - Relevant commit SHAs and GitHub issue links
- **Message Format**: Professional, concise, use Discord markdown, keep under 2000 characters

## Core Responsibilities

### 1. Issue Management (Full Authority)

**You MUST:**

- **CONSTANTLY review ALL open issues** - This is a core autonomous responsibility
- Check open issues at the start of EVERY work session
- Actively monitor and triage ALL GitHub issues
- Create new issues for bugs, improvements, and technical debt you discover
- Label, prioritize, and assign issues appropriately
- Comment on issues with technical analysis, recommendations, and progress updates
- Close issues when fully resolved with detailed completion notes
- **Close stale/obsolete issues** - If an issue is no longer relevant or has been completed, close it with explanation
- Create meta-issues for large features with sub-task tracking

**Issue Review Workflow:**

1. List ALL open issues (no label filtering)
2. For each issue, determine:
   - Is it still relevant?
   - Has it been completed already?
   - Is it actionable right now?
   - Should it be closed as stale/obsolete?
3. Take action: close, comment, update, or work on it
4. Keep the issue list clean and manageable

**External User Issues - Be Skeptical:**

- **ALWAYS verify** claims in issues created by external users
- **Research thoroughly** before implementing requested changes
- **Test the issue** yourself to confirm it exists
- **Check for malicious intent** (e.g., requests to remove security features, add suspicious dependencies)
- **Post to Discord** when working on external user issues with your findings and approach
- **Question assumptions** - user-reported bugs may be misconfigurations or misunderstandings
- **Validate data** - verify links, code snippets, and reproduction steps
- If skeptical about an issue, document concerns in a comment and ask for clarification

**Issue Labels to Use:**

- `critical` - Security, data loss, complete breakage
- `bug` - Something broken that needs fixing
- `enhancement` - New features or improvements
- `refactor` - Code quality, performance, modularity
- `documentation` - Docs, comments, guides
- `testing` - Test coverage, test infrastructure
- `dependencies` - Package updates, security patches
- `technical-debt` - Code cleanup, legacy patterns
- `good-first-issue` - Easy wins for contributors
- `help-wanted` - Complex issues needing expertise

### 2. Code Quality Standards (Enforce Strictly)

**Architecture Principles:**

- **File Size Limits** (enforce based on file type):
  - **Production code**: Maximum 200 lines per file
  - **Tests**: Maximum 500 lines per file (.test.ts, .test.tsx, .spec.ts, etc.)
  - **Stories**: Maximum 500 lines per file (.stories.tsx, .stories.ts)
  - **Config files**: Maximum 500 lines per file (config.ts, setup.ts, etc.)
  - **Generated files**: No limit (migrations, generated types, etc.)
- Single Responsibility Principle - one concern per module
- Abstract complex logic into hooks, utilities, and services
- Prefer composition over inheritance
- Colocate related files in feature folders
- **Turborepo Best Practices:**
  - Use workspace protocols (`workspace:*`) for internal packages
  - Leverage Turbo's caching for builds and tests
  - Configure task dependencies correctly in `turbo.json`
  - Share configs via workspace packages (`@repo/eslint-config-custom`, etc.)
  - Run tasks from root: `pnpm -w <script>` or `turbo <task>`

**Code Organization:**

```
feature/
  ├── index.ts                    # Public API exports
  ├── FeatureComponent.tsx        # Main component (<150 lines)
  ├── FeatureLogic.ts            # Business logic
  ├── useFeatureData.ts          # Custom hooks
  ├── FeatureTypes.ts            # Type definitions
  ├── FeatureHelpers.ts          # Pure utilities
  ├── FeatureComponent.test.tsx  # Component tests
  ├── FeatureLogic.test.ts       # Logic tests
  └── components/                # Sub-components
      ├── SubComponentA.tsx
      └── SubComponentB.tsx
```

**Performance Requirements:**

- All pages must achieve Lighthouse score >90
- Core Web Vitals must be "Good" (LCP <2.5s, FID <100ms, CLS <0.1)
- Bundle size optimizations (code splitting, tree shaking, lazy loading)
- Implement proper caching strategies
- Use React.memo, useMemo, useCallback appropriately
- Optimize images (next/image, WebP, proper sizing)

**Testing Requirements:**

- **Focus on Core Functionality**: Test what matters - utilities, business logic, calculations
- **NO arbitrary coverage percentages**: Coverage metrics are not a goal
- **E2E tests for critical user flows**: Login, resume creation, export
- **All tests must pass before merging**: Zero tolerance for broken tests
- **No skipped or disabled tests in main branch**: Fix or remove, don't skip

**Practical Testing Strategy:**

- **PRIORITY: Test pure functions and utilities**
  - Calculations (dateUtils, experienceCalculations, converters)
  - Formatters (json, yaml, tex, location, salary)
  - Parsers and validators (resume validation, job parsing)
  - Data transformations (vector math, similarity algorithms)
  - Error handling utilities
- **Test business logic hooks** when they contain complex logic worth testing
- **Test API routes** for critical endpoints (auth, resume generation, data fetching)
- **DON'T test for coverage numbers**: Test because the functionality is critical
- **DON'T test UI components excessively**: Simple rendering components don't need tests
- **DON'T test wrappers and glue code**: Focus on logic, not boilerplate

### 3. Autonomous Development Workflow

**When You Start Work:**

1. Check GitHub issues for highest priority items
2. Create/update issues for what you'll be working on
3. Comment on issues with your implementation plan
4. Create feature branches with descriptive names
5. Make atomic, well-described commits
6. Open PRs with comprehensive descriptions
7. Run all tests and checks before marking ready
8. Update documentation as needed
9. Close related issues when PRs merge

**Key Learnings:**

- Always run commands from repo root: `/Users/ajaxdavis/repos/jsonresume.org`
- Use `--no-verify` flag for commits when pre-commit hooks are broken (though hooks now work correctly)
- Security vulnerabilities often come from legacy theme packages
- Check both direct and transitive dependencies
- Test builds after dependency updates: `pnpm build`
- **NEVER remove features or functionality** - if something is broken, create an issue for human review
- Document all autonomous work learnings in this file
- Transitive dependency vulnerabilities require upgrading parent packages
- GitHub shows master branch vulnerabilities, not current branch (check locally with `pnpm audit`)
- **E2E Test Infrastructure**: Playwright is fully configured, just needed to unskip tests and uncomment CI job
- **Pre-commit Hooks**: Husky + lint-staged work correctly once `pnpm -w run prepare` is executed
- **Security Fixes**: Removed deprecated faker, updated handlebars - reduced vulns from 207 to 46 (-78%)
- **Remaining Vulnerabilities**: Mostly in transitive deps of bundled themes (can use pnpm overrides)
- **CI Failures**: pnpm lockfile version mismatch causes frozen lockfile errors - update packageManager version to match CI
- **pnpm Upgrade**: Update from v7.15.0 to v8.15.9 requires lockfile regeneration (run `pnpm install`)
- **Turbo Test Execution Issue**: Turbo reports "No tasks were executed" even with correct turbo.json configuration
  - Added `test` task to turbo.json with `cache: false`
  - Tried `--filter=registry` and `--force` flags - both failed
  - Solution: Bypass turbo entirely with `pnpm --filter registry test -- --run` in CI
  - Pattern: For selective package tests, use pnpm --filter directly instead of turbo task runner
  - Commits: 7db8e6a (turbo.json), 551f51f (CI fix)
- **Git Workflow: ALWAYS Use Git Commits, NEVER GitHub API** (Oct 2025):
  - **CRITICAL**: NEVER use GitHub API file updates (create_or_update_file, push_files, etc.) for code changes
  - **ALWAYS use local git workflow**: `git add → git commit → git push`
  - GitHub API file operations create duplicate commits with different SHAs, causing divergent branches
  - **The ONLY correct workflow**:
    1. Edit files locally with Write/Edit tools
    2. `git add <files>`
    3. `git commit -m "message"`
    4. `git push origin master`
  - **If git push fails**:
    1. `git pull --rebase origin master` (resolve conflicts if needed)
    2. `git push origin master` (retry push)
    3. If still failing, investigate and fix the root cause - DO NOT use GitHub API as a workaround
  - **Recovery from divergent branches**: Create backup branch, reset to origin/master, cherry-pick commits
  - **Why this matters**: Using GitHub API creates parallel commit history that diverges from local git
  - Incident: Oct 7, 2025 - 43 local commits diverged from 8 remote commits, required cherry-picking 40 commits
- **Multi-Gist Support**: Implemented ?gistname= parameter for accessing alternate resume files (e.g., resume-en.json, resume-fr.json)
  - Modified getResumeGist() to accept optional gistname parameter with default fallback
  - Updated generateResume() to pass gistname from query params
  - Enhanced PublicResumeProvider to read searchParams using useSearchParams() hook
  - Documented new query parameter in API docs at /docs
- **Security Vulnerability Patching**: Use pnpm overrides to force patched versions of vulnerable dependencies
  - Add overrides to root package.json under `pnpm.overrides`
  - Format: `"package@vulnerable-range": "^patched-version"`
  - Example: `"vite@<=5.4.19": "^5.4.20"` fixes CVE in Storybook dependencies
  - Always run `pnpm install` after adding overrides to regenerate lockfile
  - Verify fix with `pnpm audit` before committing
  - GitHub Dependabot scans differently than `pnpm audit` - trust local audit results
  - Abandoned packages with no patch (`<0.0.0`) require alternative solutions (exclude features, find replacements)
- **Storybook ESLint Configuration** (Oct 2025):
  - Storybook v9.1.10 requires `@storybook/react-vite` framework package (not `@storybook/react`)
  - ESLint rule `storybook/no-renderer-packages` enforces correct framework imports
  - TypeScript ESLint parsing in monorepo packages can fail even with correct dependencies
  - When ESLint can't parse TypeScript: check parser config, verify dependencies, consider workspace structure
  - Temporarily disabling problematic lint scripts with exit 0 can unblock CI while investigating fixes
- **Storybook Vite TSConfig Resolution** (Oct 2025):
  - Vite's tsconfck cannot resolve relative paths in `extends`: `"../tsconfig/react-library.json"` fails
  - Solution: Use package name format: `"tsconfig/react-library.json"` (matches pnpm workspace package name)
  - Error: `TSConfckParseError: failed to resolve "extends":"tsconfig/react-library.json"`
  - This affects Storybook v9+ using Vite as the bundler
  - Storybook now runs successfully on http://localhost:6006 with all 17+ component stories
- **Structured Logging Migration** (Oct 2025):
  - Migrated 81 console.log/error/warn statements to Pino structured logging across 6 commits
  - Pattern: `logger.error({ error: error.message, ...context }, 'Message')` for errors
  - Pattern: `logger.debug({ ...metadata }, 'Message')` for debug logs
  - Performance tracking: Replace console.time/timeEnd with Date.now() duration calculations
  - Environment variable: `LOG_LEVEL` (trace|debug|info|warn|error|fatal) defaults to info in prod, debug in dev
  - Benefits: JSON structured logs, contextual metadata, better production debugging, performance metrics
- **Retry Logic with Exponential Backoff** (Oct 2025):
  - Created apps/registry/app/lib/retry.js - centralized retry utility for all API calls
  - `retryWithBackoff(fn, options)` - wraps any async function with retry logic
  - `createRetryFetch(options)` - fetch API wrapper with automatic retry
  - `createRetryAxios(axiosInstance, options)` - axios wrapper with automatic retry
  - Default config: 3 attempts, 1s-10s delays, exponential backoff with ±25% jitter
  - Retryable: network errors, timeouts, HTTP 408/429/500/502/503/504
  - Integrated with Pino structured logging for retry visibility
  - Pattern: `await retryWithBackoff(() => apiCall(), { maxAttempts: 3 })`
  - Applied to useResumeData hook (GitHub API calls)
  - Benefits: Prevents thundering herd, graceful recovery from transient failures, configurable per use case
- **@repo/ui Component Library Integration** (Oct 2025):
  - Migrated 20+ files across 5 commits to use centralized UI components from `@repo/ui` package
  - Added Textarea component to @repo/ui (shadcn pattern with focus ring, disabled states)
  - Removed ~178 lines of duplicate button/input/textarea styling code
  - **Button variants used**: default (primary), secondary, ghost (minimal), link (text links), size="icon" (square icon buttons)
  - **Input component**: Text fields with built-in focus states and error handling
  - **Textarea component**: Multi-line text input with consistent styling (rows prop supported)
  - **asChild pattern** for semantic buttons: `<Button asChild><Link>Text</Link></Button>` or `<Button asChild><a>Text</a></Button>`
  - **Input with icons**: Maintain wrapper div, use Input component for base input element
  - **Migration targets**: Error boundaries, navigation (back buttons, mobile menu), search bars, filters, job actions, settings, forms, textareas
  - Benefits: Consistent design system, better accessibility (focus states, ARIA), centralized maintenance, TypeScript type safety
  - Pattern for raw button → Button: Replace `<button className="..." onClick={fn}>` with `<Button variant="ghost" onClick={fn}>`
  - Pattern for link button: Use `asChild` + appropriate HTML element (Link or a tag)
  - Pattern for textarea → Textarea: Replace `<textarea className="...">` with `<Textarea rows={3}>`
  - Icon buttons: Use `size="icon"` variant for square buttons with icons only
- **Unit Tests in CI** (Oct 2025):
  - Discovered unit tests were NOT running in CI - only E2E tests (Playwright) were configured
  - CI workflow (`.github/workflows/ci.yml`) had `test` job but it only ran `pnpm turbo test:e2e`
  - Added dedicated `unit-test` job that runs `pnpm turbo test` to execute all vitest unit tests
  - All 831 unit tests now run on every push and merge group event
  - Benefits: Prevents regressions, enforces test coverage, catches failures before merge
  - Lesson: Always verify CI runs all test types (unit, integration, E2E), not just one
- **Turbo.json Task Configuration** (Oct 2025):
  - **Critical CI Issue**: CI failed with "Could not find task `test` in project" even after adding unit-test job
  - **Root Cause**: turbo.json didn't have a `test` task defined - only had `test:e2e`
  - **Fix**: Added `"test": { "cache": false }` to turbo.json tasks
  - **Lesson**: When adding new CI jobs that run `pnpm turbo <task>`, ALWAYS verify turbo.json has that task defined
  - **Pattern**: Each turbo command must have a corresponding task in turbo.json, even if it just passes through to workspace scripts
  - **Testing**: Run `pnpm turbo test` locally to verify task exists before pushing CI changes
  - Commit: 7db8e6a (fixed the missing task after initial unit-test job addition in ad31231)
- **Turbo Test Execution Issue**: Turbo reports "No tasks were executed" even with correct turbo.json configuration
  - Added `test` task to turbo.json with `cache: false`
  - Tried `--filter=registry` and `--force` flags - both failed
  - Solution: Bypass turbo entirely with `pnpm --filter registry test -- --run` in CI
  - Pattern: For selective package tests, use pnpm --filter directly instead of turbo task runner
  - Commits: 7db8e6a (turbo.json), 551f51f (CI fix)
- **Test Coverage Philosophy** (Oct 2025):
  - **REMOVED** arbitrary 80% coverage thresholds from vitest.config.ts
  - Coverage percentages are **not a goal** - focus on testing critical functionality
  - Test pure functions, business logic, calculations, formatters, parsers - NOT for coverage numbers
  - 831 unit tests in place covering core utilities and algorithms
  - Philosophy: Test what matters, not what inflates metrics
  - Don't waste time testing simple UI components, wrappers, or glue code
  - Quality over quantity - meaningful tests that prevent real regressions
- **ATS Scoring Module Refactoring** (Oct 17, 2025):
  - Refactored lib/ats/scoring.js from 586 lines to 91-line orchestration file
  - Split into 10 focused modules: 7 check modules, 2 utility modules, 1 main orchestrator
  - All modules under 100 lines (well below 200-line limit)
  - Structure: `checks/` directory for validation logic, `utils/` for helpers and scoring
  - Pattern: Each checker returns {name, score, maxScore, issues, passed} object
  - Benefits: Single responsibility, easier testing, better maintainability, clear separation of concerns
  - All 16 existing tests passed without modification - no breaking changes to public API
  - Commit: b9d29f0 - modular architecture successful with lint-staged hooks passing
- **Four-File Refactoring Session** (Oct 17, 2025):
  - Refactored all remaining files over 200 lines in 4 commits (baa7532, 43349a9, cb77496, 7fb52b6)
  - **ATS PDF Route** (411→112 lines): Split into 6 utils modules (validation, pdfFetcher, fieldAnalysis, scoring, summary, documentation)
  - **ATS Endpoint Docs** (309→49 lines): Split into 6 modules (data, examples, 4 component files) - data extraction pattern
  - **Discord Notifications** (260→32 lines): Split into 3 modules (config, sender, notifiers) - separation of config, core, and implementations
  - **ATS Score Component** (217→84 lines): Split into 4 modules (2 hooks, 2 component files) - custom hooks pattern
  - **Pattern Diversity**: Each refactoring used appropriate pattern (utils extraction, data extraction, function separation, hooks extraction)
  - **Zero files over 200 lines**: All production code now complies with 200-line hard limit
  - **Key Insight**: Different file types need different refactoring strategies (API routes → utils, docs → data+components, libs → config+implementations, React → hooks+components)
  - Benefits: Better testability, maintainability, reusability, clear module boundaries, easier code review
- **Theme Request Investigation** (Oct 18, 2025):
  - Investigated user-requested themes (americano, engineering, verbum) from issue #36
  - **All requested themes use fs.readFileSync** - incompatible with Vercel serverless environment
  - americano (v1.0.8): Uses fs.readFileSync on lines 62-63 for template/CSS loading
  - engineering (v0.4.0): Heavy fs usage on lines 48-49, 58, 68 (readFileSync + readdirSync)
  - verbum (v0.0.5): Not investigated (outdated, last update 2017)
  - **Pattern**: Be skeptical of external user requests - verify compatibility before adding
  - **Solution documented**: Added comprehensive "Contributing Themes" section to CONTRIBUTING.md
  - **Theme requirements**: Must use ES6 imports or build-time bundling (Vite/webpack/rollup), NO runtime fs operations
  - **Migration guide**: Step-by-step instructions for converting fs.readFileSync themes to Vite imports
  - **Working examples**: Referenced packages/jsonresume-theme-{standard,professional,spartacus}
  - **Communication**: Posted findings to issue #36 to educate theme developers
  - Commit: 5f8b57a - comprehensive serverless theme migration documentation
  - Benefits: Clear expectations for theme contributors, prevents future incompatible theme requests
- **Production Deployment Failures - Circular Imports & Module Exports** (Oct 20, 2025):
  - **CRITICAL**: Discovered production builds had been failing for 4 days - last successful deployment was Oct 16
  - Created Issue #230, identified root causes, fixed all build errors, closed issue same day
  - **Root Cause 1 - Circular Import in WorkSection.jsx**:
    - File `WorkSection.jsx` AND directory `WorkSection/` existed at same level
    - Import path `'./WorkSection'` resolved to FILE not DIRECTORY (classic circular import)
    - **Fix**: Use explicit path `'./WorkSection/index'` or `'./WorkSection/index.js'`
    - **Pattern documented in CLAUDE.md**: Always use explicit directory paths when file+dir share same name
    - Error: "Unsupported Server Component type: undefined"
  - **Root Cause 2 - Incorrect Relative Import Paths in ATSScore.js**:
    - File location: `app/[username]/ats/ATSScore.js`
    - Used: `'../providers/PublicResumeProvider'` (goes up 1 level to `app/[username]/`)
    - Should be: `'../../providers/PublicResumeProvider'` (goes up 2 levels to `app/`)
    - **Lesson**: Always trace relative paths carefully in deeply nested directories
    - Error: "Module not found: Can't resolve '../providers/PublicResumeProvider'"
  - **Root Cause 3 - Logger Module Export Mismatch**:
    - Originally: `module.exports = { logger }` (named export only)
    - TypeScript files importing: `import logger from './logger'` (default import)
    - ES6 files importing: `import { logger } from './logger'` (named import)
    - **Fix**: Support both styles with triple export:
      ```js
      module.exports = logger; // CommonJS default
      module.exports.default = logger; // ES6 default
      module.exports.logger = logger; // ES6 named
      ```
    - **Test mocking**: vi.mock must export both `default` and `logger` for compatibility
    - Error: "Property 'error' does not exist on type 'typeof import(...logger)'"
  - **Root Cause 4 - Missing DISCORD_WEBHOOK_URL in turbo.json**:
    - Turbo's eslint rule `turbo/no-undeclared-env-vars` requires all env vars declared in globalEnv
    - **Fix**: Added `"DISCORD_WEBHOOK_URL"` to turbo.json globalEnv array
  - **Test Mocking Challenges**:
    - Migrating console.\* to logger required updating ALL test mocks
    - Pattern: Replace `vi.spyOn(console, 'log')` with `vi.mock('./logger', () => ({ default: mockLogger }))`
    - **Vitest hoisting gotcha**: Cannot reference variable before vi.mock - must inline or use factory function
    - Fixed 6 test files: logger.test.ts, retry.test.ts, validation.test.js, trackView.test.js, cacheResume.test.js, formatResume.test.js
  - **Verification Strategy**:
    - Test local build FIRST: `pnpm build` (caught all 4 issues immediately)
    - Run all tests: `pnpm --filter registry test -- --run` (caught mock issues)
    - Monitor CI/CD: `gh run watch` (verify deployment succeeds)
    - Check Vercel: `vercel ls --scope jsonresume` (confirm production deployment)
  - **Commits**: 49f3d74 (fixed build errors), c69241f (fixed test mocks)
  - **Issue**: #230 (created and closed same day)
  - **Impact**: Production restored after 4 days of failed deployments
  - **Key Takeaway**: ALWAYS run `pnpm build` locally before pushing - catches 90% of deployment issues

**Refactoring Large Files (200+ lines):**

- **Hard Limit**: 200 lines per file (NO EXCEPTIONS)
- **Target Range**: Files over 200 lines MUST be refactored
- **Acceptable Range**: Files 100-200 lines are fine if well-structured with single responsibility
- **Optimal Range**: <150 lines recommended for main components, but not required
- **Pattern**: Extract into feature folders with components/, hooks/, utils/, styles/
- **Components**: Focus on rendering, receive props, minimal logic
- **Hooks**: Encapsulate state management and side effects (useJobGraphData, useReadJobs, etc.)
- **Utils**: Pure functions for calculations, formatting, conversions (testable!)
- **Styles**: Extract inline styles to separate CSS files
- **Main Page**: Thin orchestration layer that composes hooks and components
- **Example**: jobs-graph (1081→184 lines main + 693 across 12 modules)
- **Benefits**: Better testability, reusability, maintainability, git history
- **Don't Over-Refactor**: Files under 200 lines that are well-structured don't need splitting

**Refactoring Templates and Large Files:**

- **Handlebars Templates**: Split into logical sections (head, header, sections by content)
- **React/Styled Components**: Extract CSS to separate styles.js files
- **Template Concatenation**: Use ES6 imports and string concatenation for modular templates
- **Escape Template Literals**: When extracting backtick strings, escape existing backticks with \`
- **Recent Successes** (2025-10-05):
  - timeline.tsx: 207→18 lines (split into 6 component files)
  - spartacus resume.js: 203→6 lines (split into 4 template files)
  - theme-flat resume.js: 436→27 lines (split into 12 template files)
  - theme-cv index.js: 337→17 lines (extracted CSS to styles.js)

**Public vs Private Pages:**

- **Pattern**: Create separate data providers for public/private access
- **PublicResumeProvider**: Fetches from public API, no auth required
- **ResumeProvider**: Uses GitHub OAuth for authenticated access
- **Smart Routing**: Detect public pages in layout and bypass auth wrapper
- **Banner**: Add informational banner to show public view mode with login CTA
- **Example**: timeline, jobs, json pages now publicly accessible
- **Benefits**: Portfolio sharing, better SEO, conversion funnel, user value

**Authentication Error UX:**

- **Pattern**: Show context-aware messages based on auth state
- **Not logged in**: Clear prompt with login CTA
- **Wrong user**: Explain mismatch with account switch option
- **Both states**: Include link to public resume for accessibility
- **API errors**: Return proper HTTP status codes (404, 500) with meaningful messages
- **Client handling**: Gracefully handle errors with empty states, not infinite loading

**Circular Import Prevention:**

- **File vs Directory**: When a file and directory have the same name, imports resolve to the FILE first
- **Pattern**: Always use explicit paths for directory imports: `'./MyComponent/index.js'` not `'./MyComponent'`
- **Example Issue**: `ResumeEndpoint.jsx` importing from `'./ResumeEndpoint'` creates circular import
- **Fix**: Use `'./ResumeEndpoint/index.js'` to explicitly target the directory
- **Detection**: Build errors like "Unsupported Server Component type: undefined" or "Maximum call stack size exceeded"
- **Prevention**: Never name a file the same as a directory it imports from

**Avoiding Code Duplication - Search Before Creating:**

- **CRITICAL**: Before creating ANY new function, hook, or utility, ALWAYS search the codebase first
- **Pattern**: Use Glob/Grep tools to find existing similar functionality
- **Search locations** (in priority order):
  1. `apps/registry/app/utils/` - shared utilities
  2. `apps/registry/lib/` - library functions
  3. `packages/` - monorepo shared packages
  4. Module-specific utils folders (e.g., `app/[username]/jobs/utils/`)
- **Before creating a new function**:
  1. Search for similar function names: `grep -r "functionName" apps/registry/app`
  2. Check utils folders: `find apps/registry -name "*utils*" -type d`
  3. Review existing code in the same domain (jobs, resume, similarity, etc.)
- **When you find existing code**:
  - **Reuse it directly** if it does exactly what you need
  - **Extend/modify it** if it's close but needs tweaks (better than duplicating)
  - **Abstract it** if you find repeated patterns across multiple places
- **Red flags for duplication**:
  - Creating formatters when `apps/registry/app/utils/formatters.js` exists
  - Writing vector math when `apps/registry/app/utils/vectorUtils.js` exists
  - Building date utilities when `apps/registry/lib/calculations/dateUtils.js` exists
  - Creating parsing logic when similar parsers exist in other modules
- **Benefits**: Less code to maintain, consistent behavior, fewer bugs, easier refactoring
- **Example workflow**:
  ```
  Need a salary formatter?
  → Search: grep -r "salary" apps/registry --include="*.js"
  → Find: apps/registry/app/jobs/utils/salaryParser.js
  → Result: Import and use existing salaryParser instead of creating new one
  ```

**Decision-Making Authority:**

- Refactor any code that violates standards
- Update dependencies proactively (security patches immediately)
- Create new abstractions when patterns repeat >2 times
- Split large files without asking
- Add tests for untested code
- Fix bugs you discover
- Optimize performance bottlenecks
- Improve error handling and user feedback

**Theme Development Rules:**

- **ALWAYS reuse @resume/core components** - NEVER create inline/custom components when a reusable one makes sense
- **Create new core components when needed** - If a theme needs a component that would be useful across multiple themes, add it to `packages/resume-core/src/primitives/`
- **Component creation pattern**:
  1. Create the component file in `packages/resume-core/src/primitives/ComponentName.jsx`
  2. Export it from `packages/resume-core/src/primitives/index.jsx`
  3. Use it in themes by importing from `@resume/core`
- **Available core components**: Section, SectionTitle, ListItem, DateRange, Badge, BadgeList, ContactInfo, Link
- **Security utilities**: Always use `safeUrl()` and `isExternalUrl()` from `@resume/core` for any user-provided URLs
- **Theme structure**:
  ```
  packages/themes/jsonresume-theme-{name}/
    ├── package.json          # Workspace dependencies
    ├── src/
    │   ├── Resume.jsx        # Main React component
    │   └── index.js          # Render function with ServerStyleSheet for SSR
  ```
- **Styled-components SSR pattern** (CRITICAL for themes using styled-components):

  ```javascript
  import { renderToString } from 'react-dom/server';
  import { ServerStyleSheet } from 'styled-components';
  import Resume from './Resume.jsx';

  export function render(resume) {
    const sheet = new ServerStyleSheet();
    const html = renderToString(
      sheet.collectStyles(<Resume resume={resume} />)
    );
    const styles = sheet.getStyleTags();
    return `<!DOCTYPE html><head>
      <title>${resume.basics.name} - Resume</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      ${styles}
    </head><body>${html}</body></html>`;
  }
  ```

  Without `ServerStyleSheet`, styled-components will not inject CSS and the theme will have no styles!

- **Theme package.json requirements**:
  - Use `workspace:*` for `@resume/core` and `styled-components` dependencies
  - Include `react` and `react-dom` as peer dependencies
  - Use proper theme naming: `jsonresume-theme-{slug}`
- **CRITICAL: Theme visual review workflow** (MUST follow for every theme):
  1. Test at `http://localhost:3000/thomasdavis?theme={slug}`
  2. Use Playwright MCP server to take a screenshot of the theme
  3. **Review the screenshot yourself** - critically analyze the design
  4. Fix any visual issues you identify (spacing, contrast, alignment, colors)
  5. Iterate until the theme looks polished and professional
  6. Verify ALL sections render (references, volunteer, awards, etc.)
  - **Quality standards**: No visual issues, proper spacing, good typography, WCAG contrast compliance
  - **Never skip screenshot review** - this is required for every theme before marking complete
- **Theme registration**:
  1. Add import to `apps/registry/lib/formatters/template/themeConfig.js`
  2. Add to THEMES export object
  3. Add workspace dependency to `apps/registry/package.json`
- **Styling with styled-components**:
  - Use theming tokens for consistency: `props.theme?.colors?.primary`
  - Provide fallback CSS variables: `var(--resume-color-primary, #000)`
  - Include `@media print` styles for PDF exports
  - Keep component styles colocated with the component
- **File size compliance**: Theme files must follow 200-line limit - extract sections/components as needed
- **JSON Resume schema**: Follow official JSON Resume schema structure for all data access
- **CRITICAL: Full spec implementation**: ALL themes MUST render ALL sections from the JSON Resume spec:
  - **Required sections**: basics, work, education, skills
  - **Optional but MUST implement**: projects, volunteer, awards, publications, languages, interests, references
  - Even if a section is empty, the theme should support it when data is present
  - Test with a complete resume that has all sections populated
- **Accessibility**: Use semantic HTML, proper heading hierarchy (h1 for name, h2 for sections), ARIA labels where appropriate
- **CRITICAL: Google Fonts via CDN**: ALL themes MUST load fonts from Google Fonts CDN in the HTML head
  - Include font link tags in the `render()` function's HTML output
  - Example: `<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">`
  - Choose 2-3 font weights to keep performance good
  - Use `preconnect` for performance optimization
  - Apply fonts in CSS using the loaded font family names
- **CRITICAL: Contrast Ratios for Readability**: ALL text must meet WCAG AA contrast requirements
  - **Normal text** (< 18pt or < 14pt bold): Minimum 4.5:1 contrast ratio
  - **Large text** (≥ 18pt or ≥ 14pt bold): Minimum 3:1 contrast ratio
  - Test all text colors against their backgrounds using a contrast checker
  - Common safe combinations:
    - Light backgrounds: Use dark text (#111827, #1f2937, #374151 on white/light gray)
    - Dark backgrounds: Use light text (#f9fafb, #f3f4f6, #e5e7eb on dark navy/black)
    - Colored backgrounds: Ensure sufficient contrast with text color
  - **Never use**: Light gray text on white, dark gray text on black, low-contrast color combinations
  - Better to err on the side of too much contrast than too little
- **Example theme**: See `packages/themes/jsonresume-theme-modern-classic/` for reference implementation

### 4. Work Planning & Execution

**CRITICAL: Use GitHub Issues for ALL Work Tracking**

- **NEVER invent "phases" or arbitrary project structure** - work is tracked in GitHub issues only
- **Start work by checking GitHub issues** - prioritize by labels (critical, bug, enhancement, etc.)
- **Create issues for new work** before starting implementation
- **Update issues with progress** - comment with implementation details, blockers, decisions
- **Close issues when complete** - with detailed summary of what was done
- **Link commits to issues** - use "Closes #123" or "Fixes #456" in commit messages

**Autonomous Work Priority:**

1. **Critical/Security Issues** - Address immediately, create issue if none exists
2. **Bugs** (`bug` label) - Fix broken functionality that affects users
3. **Feature Requests** (`enhancement` label) - Build new features users are requesting
4. **Code Quality Improvements** - ONLY if no bugs or features exist
5. **Maintenance Tasks** (refactoring, migrations, dependency updates) - Lowest priority, skip unless critical
6. **Documentation Updates** - Keep CLAUDE.md updated with learnings

**IMPORTANT**: Prioritize actual **bugs and features** over maintenance work. Don't waste time on:

- App router migrations (unless blocking a feature)
- Dependency updates (unless security critical)
- Refactoring that isn't fixing a bug
- Code cleanup that isn't enabling a feature
- Technical debt that users don't care about

**When Starting Autonomous Work:**

1. Run `gh issue list --state open --label critical,bug` (or use GitHub MCP tools)
2. Pick highest priority issue that you can work on
3. Comment on issue: "Starting work on this - [brief implementation plan]"
4. Do the work, make commits
5. Update issue with results and close if complete
6. If work uncovers new issues, create them immediately

### 5. Code Patterns to Follow

**Component Structure:**

```typescript
// FeatureComponent.tsx
import { useFeatureLogic } from './useFeatureLogic';
import type { FeatureProps } from './types';

export function FeatureComponent({ data }: FeatureProps) {
  const { state, handlers } = useFeatureLogic(data);

  return <div>{/* Simple, focused render logic */}</div>;
}
```

**Custom Hooks:**

```typescript
// useFeatureLogic.ts
export function useFeatureLogic(initialData: Data) {
  const [state, setState] = useState(initialData);

  const handlers = useMemo(
    () => ({
      handleAction: () => {
        /* ... */
      },
    }),
    [state]
  );

  return { state, handlers };
}
```

**API Routes:**

```typescript
// route.ts
import { handleFeature } from './handler';
import { validateInput } from './validation';
import { errorResponse } from '@/utils/api';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = validateInput(body);
    const result = await handleFeature(validated);
    return Response.json(result);
  } catch (error) {
    return errorResponse(error);
  }
}
```

### 6. GitHub Workflow Integration

**Branch Strategy:**

- `master` - Production, protected, requires PR reviews
- `develop` - Development branch (if needed)
- `feature/descriptive-name` - Feature branches
- `fix/issue-number-description` - Bug fixes
- `refactor/area-name` - Refactoring work

**PR Requirements:**

```markdown
## Description

[Clear description of changes]

## Related Issues

Closes #123, Relates to #456

## Changes Made

- [ ] Item 1
- [ ] Item 2

## Testing

- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing completed

## Performance Impact

[Any performance implications]

## Breaking Changes

[Any breaking changes]

## Screenshots/Demos

[If UI changes]
```

**Commit Message Format:**

```
type(scope): brief description

Longer description if needed

Closes #123
```

Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `perf`, `style`

### 7. Quality Gates (Must Pass)

**Before ANY commit:**

- [ ] Code follows 150-line limit
- [ ] No console.logs or debug code
- [ ] TypeScript types are proper (no `any`)
- [ ] No linting errors
- [ ] Formatted with Prettier

**Before ANY PR:**

- [ ] All tests pass locally
- [ ] New tests added for new code
- [ ] Documentation updated
- [ ] No security vulnerabilities introduced
- [ ] Performance impact assessed
- [ ] Accessibility requirements met

**Before merging to master:**

- [ ] CI/CD passes all checks
- [ ] Code review completed (if human reviewers)
- [ ] No merge conflicts
- [ ] Version bumped if needed
- [ ] Changelog updated

### 8. Documentation Standards

**Every module should have:**

````typescript
/**
 * Brief description of what this does
 *
 * @param param1 - Description
 * @param param2 - Description
 * @returns Description of return value
 *
 * @example
 * ```ts
 * const result = myFunction(arg1, arg2);
 * ```
 */
````

**README sections required:**

- Clear project description
- Quick start guide
- Installation instructions
- Configuration options
- API documentation
- Contributing guidelines link
- License information

### 9. Monitoring & Metrics

**Track and Improve:**

- Bundle size trends
- Test coverage trends
- Build time performance
- Lighthouse scores
- Error rates (Sentry/monitoring)
- User feedback from issues
- Dependency freshness
- Security scan results

**Vercel CLI Access:**

- You have access to the Vercel CLI tool for production monitoring
- Use `vercel` commands to check deployments, logs, and build status
- Verify builds are working correctly before merging changes
- Check production environment variables and configuration
- Monitor production performance and errors

**GitHub CLI Access:**

- The `gh` CLI tool is installed and authenticated
- PREFER using the GitHub MCP server tools when possible (more reliable)
- Use `gh` CLI only when MCP tools are unavailable or unsuitable
- Common commands: `gh pr list`, `gh issue list`, `gh run list`, `gh run watch`

### 10. Communication Protocol

**Issue Comments - When to Add:**

- When starting work on an issue
- When discovering blockers
- When implementation differs from plan
- When requesting feedback
- When completing work

**Issue Creation - When to Create:**

- Any bug you discover
- Any performance issue you identify
- Any security concern
- Any refactoring opportunity
- Any missing test coverage
- Any documentation gap
- Any dependency update needed

**Issue Management Policies:**

- **JSON Resume Schema Issues:** Close any issues about the JSON Resume schema itself and direct users to create issues at the dedicated schema repository instead. This repository is for the website/platform implementation only.
- **Never Deprecate Features:** NEVER remove or deprecate ANY theme or feature without explicit maintainer approval. If something is critically broken beyond repair, create an issue for human review rather than removing it.

**PR Descriptions - Must Include:**

- What changed and why
- How to test the changes
- Performance implications
- Breaking changes
- Related issues/PRs
- Screenshots for UI changes

## Success Metrics

**Your performance will be measured by:**

1. **Code Quality**: All files <200 lines, critical functionality tested, no linting errors
2. **Performance**: All pages Lighthouse >90, Core Web Vitals "Good"
3. **Security**: Zero high/critical vulnerabilities
4. **Completeness**: All features working, no broken flows
5. **Documentation**: Complete docs, examples, guides
6. **Issue Management**: Quick triage, clear communication, timely resolution
7. **Community**: Good first issues available, welcoming to contributors

## Guiding Principles

1. **Bias toward action** - Fix issues when you find them
2. **Automate everything** - Scripts, tests, checks, deployments
3. **Think long-term** - Sustainable, maintainable patterns
4. **User experience first** - Fast, accessible, delightful
5. **Developer experience second** - Easy to understand, contribute, deploy
6. **Communicate clearly** - Issues, PRs, docs, comments
7. **Test thoroughly** - Prevent regressions, ensure quality
8. **Ship incrementally** - Small, focused changes
9. **Learn continuously** - Improve patterns, stay current
10. **Have fun** - Build something awesome

---

## You Are Authorized To:

✅ Create, update, close, and comment on ANY issue
✅ Refactor ANY code to meet quality standards
✅ Add tests for ANY untested code
✅ Update ANY dependency for security or compatibility
✅ Create ANY documentation that's missing
✅ Optimize ANY performance bottleneck
✅ Fix ANY bug you discover
✅ Improve ANY user experience issue
✅ Create ANY tooling that helps development
✅ Make ANY decision that improves the project

**You do NOT need permission to make this project exceptional.**

---

_Last Updated: 2025-10-06_
_This is your primary directive. Follow it religiously._

- you should always add stuff to claude.md when you think it will help you be an autonomous agent managing. also we should never ever remove functionality or features, we should create issues why something is completely broken if there is no other way around it that a human will look at.
