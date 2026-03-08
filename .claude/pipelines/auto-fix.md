# Auto-Fix Pipeline Specification

When a Sentry alert creates a GitHub issue with the `auto-fix` label, Claude automatically:

1. Parses the error details from the issue
2. Locates the affected source files
3. Identifies the root cause
4. Implements a surgical fix
5. Validates the fix (type-check, lint, build)
6. Creates a PR for review

## Fix Constraints

### Allowed

- Null/undefined checks and guards
- Error handling (try/catch, error boundaries)
- Type narrowing and type guards
- Missing data fallbacks (default values, optional chaining)
- Off-by-one fixes
- Race condition guards
- Missing await/async fixes
- Import path corrections

### Prohibited

- Database schema changes
- New package dependencies
- Authentication or authorization changes
- Deployment configuration changes
- Environment variable additions
- API route signature changes (breaking changes)

## Scope Limits

- Max files changed: 5
- Change type: Surgical — minimal diff to fix the error
- New files: Not allowed
- Deleted files: Not allowed

## Validation Checklist

Before creating the PR, verify:

1. `pnpm turbo lint typecheck` passes
2. `pnpm turbo build` succeeds

If any validation step fails after 2 fix attempts, escalate to human review.

## PR Template

Title: `fix: <error title>`

Body should include:

- Sentry Issue URL
- Affected Route
- Root Cause (1-2 sentences)
- Fix Description (1-2 sentences)
- Validation checklist (typecheck, lint, build)
- Link back to the originating issue

## Label Management

| Label                | Meaning                             |
| -------------------- | ----------------------------------- |
| `auto-fix`           | Initial trigger                     |
| `claude-working`     | Claude is actively analyzing/fixing |
| `fix-submitted`      | PR has been created                 |
| `needs-human-review` | Claude cannot fix automatically     |
| `production-error`   | Informational tag                   |

### Lifecycle

1. `auto-fix` label applied -> workflow triggers
2. Add `claude-working` label
3. Claude analyzes and attempts fix
4. Success: remove `auto-fix`, add `fix-submitted`, create PR
5. Failure: remove `auto-fix`, add `needs-human-review`, post diagnostic comment

## Error Handling

| Scenario                           | Action                          |
| ---------------------------------- | ------------------------------- |
| Stack trace points to node_modules | Escalate with explanation       |
| Fix requires schema changes        | Escalate with analysis          |
| Fix requires new dependency        | Escalate with suggestion        |
| Validation fails after 2 attempts  | Escalate with validation output |
| Cannot reproduce or locate source  | Escalate with findings          |
| Fix would change >5 files          | Escalate with scope analysis    |

## Steps for Claude

1. Read this spec
2. Parse the issue — extract error details from the structured form
3. Locate source — find files from the stack trace
4. Analyze — understand error, check recent changes, identify root cause
5. Assess — verify fix is within allowed constraints
6. Fix — implement the minimal change needed
7. Validate — run `pnpm turbo lint typecheck` and `pnpm turbo build`
8. Create PR — branch `fix/sentry-<issue-number>`
9. Update issue — update labels, post summary comment linking to PR
10. Escalate if needed
