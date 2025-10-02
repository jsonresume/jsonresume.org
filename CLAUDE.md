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

## Core Responsibilities

### 1. Issue Management (Full Authority)

**You MUST:**
- Actively monitor and triage ALL GitHub issues
- Create new issues for bugs, improvements, and technical debt you discover
- Label, prioritize, and assign issues appropriately
- Comment on issues with technical analysis, recommendations, and progress updates
- Close issues when fully resolved with detailed completion notes
- Create meta-issues for large features with sub-task tracking

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
- Maximum 150 lines per file (NO EXCEPTIONS)
- Single Responsibility Principle - one concern per module
- Abstract complex logic into hooks, utilities, and services
- Prefer composition over inheritance
- Colocate related files in feature folders

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
- Unit test coverage: >80% for utilities and logic
- Component test coverage: >70% for UI components
- Integration tests for all API routes
- E2E tests for critical user flows (login, resume creation, export)
- All tests must pass before merging
- No skipped or disabled tests in main branch

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

**Decision-Making Authority:**
- Refactor any code that violates standards
- Update dependencies proactively (security patches immediately)
- Create new abstractions when patterns repeat >2 times
- Split large files without asking
- Add tests for untested code
- Fix bugs you discover
- Optimize performance bottlenecks
- Improve error handling and user feedback

### 4. Current Project Goals

**Phase 1: Foundation & Cleanup (PRIORITY)**
- [ ] Fix all CRITICAL security vulnerabilities (14+)
- [ ] Re-enable E2E tests in CI/CD pipeline
- [ ] Refactor all files >150 lines (29 files identified)
- [ ] Upgrade major dependencies (Prisma v6, Pinecone v6, OpenAI v4)
- [ ] Add missing open-source files (CONTRIBUTING.md, CODE_OF_CONDUCT.md, SECURITY.md)
- [ ] Create .env.example with all required variables
- [ ] Achieve 80%+ test coverage

**Phase 2: Feature Completion**
- [ ] Complete all TODO/FIXME items in codebase
- [ ] Finish incomplete features (check PROJECT_AUDIT.md)
- [ ] Ensure all user flows work end-to-end
- [ ] Add proper error boundaries and fallbacks
- [ ] Implement comprehensive loading states
- [ ] Add retry logic for failed operations

**Phase 3: Performance & Polish**
- [ ] Achieve Lighthouse score >90 on all pages
- [ ] Optimize bundle sizes (analyze and reduce)
- [ ] Implement proper caching strategies
- [ ] Add skeleton loaders and progressive enhancement
- [ ] Optimize database queries (add indexes, reduce N+1)
- [ ] Implement CDN and edge caching

**Phase 4: Developer Experience**
- [ ] Complete API documentation
- [ ] Add Storybook for component library
- [ ] Improve TypeScript coverage (strict mode)
- [ ] Add pre-commit hooks (linting, formatting, tests)
- [ ] Create development guides for common tasks
- [ ] Add code generation scripts/templates

### 5. Code Patterns to Follow

**Component Structure:**
```typescript
// FeatureComponent.tsx
import { useFeatureLogic } from './useFeatureLogic';
import type { FeatureProps } from './types';

export function FeatureComponent({ data }: FeatureProps) {
  const { state, handlers } = useFeatureLogic(data);

  return (
    <div>
      {/* Simple, focused render logic */}
    </div>
  );
}
```

**Custom Hooks:**
```typescript
// useFeatureLogic.ts
export function useFeatureLogic(initialData: Data) {
  const [state, setState] = useState(initialData);

  const handlers = useMemo(() => ({
    handleAction: () => { /* ... */ },
  }), [state]);

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
```typescript
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
```

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

**PR Descriptions - Must Include:**
- What changed and why
- How to test the changes
- Performance implications
- Breaking changes
- Related issues/PRs
- Screenshots for UI changes

## Success Metrics

**Your performance will be measured by:**
1. **Code Quality**: All files <150 lines, >80% test coverage, no linting errors
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

*Last Updated: 2025-10-03*
*This is your primary directive. Follow it religiously.*
