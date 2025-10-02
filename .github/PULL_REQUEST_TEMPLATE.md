# Pull Request

## Description

<!-- Provide a clear and concise description of your changes -->

## Related Issues

<!-- Link to related issues. Use "Closes #123" to auto-close issues when PR merges -->

Closes #
Relates to #

## Changes Made

<!-- List the specific changes made in this PR -->

- [ ] Change 1
- [ ] Change 2
- [ ] Change 3

## Type of Change

<!-- Mark the relevant option with an "x" -->

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Refactoring (code improvement without changing functionality)
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Test coverage improvement
- [ ] Dependency update

## Testing

<!-- Describe the testing you've done -->

- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing completed

**Test Details:**

<!-- Describe your test cases and results -->

## Quality Checklist

<!-- Ensure all items are checked before submitting -->

- [ ] All tests passing locally (`pnpm test`)
- [ ] No ESLint errors (`pnpm lint`)
- [ ] Code formatted with Prettier (`pnpm prettier`)
- [ ] All files ≤150 lines (verify with: `find . -name "*.ts" -o -name "*.tsx" -o -name "*.js" | xargs wc -l | awk '$1 > 150'`)
- [ ] Test coverage maintained or improved
- [ ] No new security vulnerabilities (`pnpm audit`)
- [ ] Documentation updated (if needed)
- [ ] TypeScript types are proper (no `any` unless absolutely necessary)

## Performance Impact

<!-- Describe any performance implications of your changes -->

- [ ] No performance impact
- [ ] Performance improved
- [ ] Potential performance impact (explain below)

**Details:**

## Breaking Changes

<!-- List any breaking changes and migration steps -->

- [ ] No breaking changes
- [ ] Breaking changes (describe below)

**Details:**

## Screenshots/Demos

<!-- If UI changes, include screenshots or GIFs -->

## Additional Notes

<!-- Any additional information reviewers should know -->

---

**For Reviewers:**

- Does this PR follow the [contribution guidelines](../CONTRIBUTING.md)?
- Are all quality checks passing?
- Is the code well-tested and documented?
- Are there any security concerns?
