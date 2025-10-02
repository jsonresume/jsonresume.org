# Contributing to JSON Resume

Thank you for your interest in contributing to JSON Resume! This document provides guidelines and instructions for contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Code Standards](#code-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Commit Message Guidelines](#commit-message-guidelines)

## Code of Conduct

This project focuses exclusively on technical excellence. We expect all contributors to:

- Be professional and respectful
- Focus on code quality and technical merit
- Provide constructive feedback in code reviews
- Follow the established coding standards

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:

   ```bash
   git clone https://github.com/YOUR_USERNAME/jsonresume.org.git
   cd jsonresume.org
   ```

3. **Add upstream remote**:

   ```bash
   git remote add upstream https://github.com/jsonresume/jsonresume.org.git
   ```

4. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Setup

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **pnpm** 8.15.9+
- **Git**
- **Supabase CLI** (for database operations)

### Installation

1. **Install dependencies**:

   ```bash
   pnpm install
   ```

2. **Set up environment variables**:

   ```bash
   # Copy the example file
   cp apps/registry/.env.example apps/registry/.env

   # Edit .env and add your credentials
   # See .env.example for required variables
   ```

3. **Generate Prisma client**:

   ```bash
   pnpm --filter registry db:generate
   ```

4. **Start development server**:

   ```bash
   pnpm dev
   ```

   This starts:

   - Registry app: http://localhost:3000
   - Homepage: http://localhost:3001 (if applicable)

### Supabase Setup

The registry app uses Supabase for data storage.

**Database name:** `registry`

```bash
# Link to your Supabase project
supabase link --project-ref your-project-ref

# Pull latest schema
supabase db pull

# Run migrations (if any)
supabase db push
```

## Project Structure

```
jsonresume.org/
├── apps/
│   ├── homepage/          # Marketing site
│   ├── homepage2/         # New marketing site
│   └── registry/          # Main resume registry app
├── packages/
│   ├── ui/               # Shared UI components
│   └── eslint-config/    # Shared ESLint config
├── themes/               # Resume themes
│   ├── papirus/
│   ├── professional/
│   └── ...
└── scripts/              # Utility scripts
```

## Code Standards

### File Size Limit

**CRITICAL:** All files must be **≤150 lines**. No exceptions.

If a file exceeds 150 lines:

1. Extract business logic into hooks (`useFeatureName.ts`)
2. Split UI into sub-components
3. Move utilities to helper files
4. Follow the structure in `CLAUDE.md`

### Code Organization

```
feature/
├── index.ts                 # Public API exports
├── FeatureComponent.tsx     # Main component (<150 lines)
├── useFeatureLogic.ts      # Business logic hook
├── FeatureHelpers.ts       # Pure utility functions
├── FeatureTypes.ts         # TypeScript types
└── __tests__/              # Tests
    ├── FeatureComponent.test.tsx
    └── useFeatureLogic.test.ts
```

### TypeScript

- Use TypeScript for all new code
- Avoid `any` - use proper types or `unknown`
- Export types for public APIs
- Use strict mode

### Styling

- Use Tailwind CSS for styling
- Follow existing component patterns
- Mobile-first responsive design
- Dark mode support where applicable

### AI/LLM Integration

**IMPORTANT:** Always use Vercel AI SDK v5 (`ai` package):

```typescript
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

const { text } = await generateText({
  model: openai('gpt-4o-mini', {
    apiKey: process.env.OPENAI_API_KEY,
  }),
  prompt: 'Your prompt here',
});
```

❌ **DO NOT** use OpenAI SDK directly for chat completions
✅ **DO** use Vercel AI SDK for unified API across providers

## Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests for specific package
pnpm --filter registry test

# Run E2E tests
pnpm test:e2e
```

### Test Requirements

- **Unit tests:** >80% coverage for utilities and logic
- **Component tests:** >70% coverage for UI components
- **Integration tests:** All API routes must have tests
- **E2E tests:** Critical user flows (login, create resume, export)

### Writing Tests

```typescript
// Component test example
import { render, screen } from '@testing-library/react';
import { FeatureComponent } from './FeatureComponent';

describe('FeatureComponent', () => {
  it('renders correctly', () => {
    render(<FeatureComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

## Pull Request Process

### Before Submitting

1. **Update your branch**:

   ```bash
   git fetch upstream
   git rebase upstream/master
   ```

2. **Run quality checks**:

   ```bash
   pnpm lint          # ESLint
   pnpm prettier      # Format check
   pnpm test          # All tests
   pnpm build         # Build check
   ```

3. **Verify file sizes**:
   ```bash
   # Check if any files exceed 150 lines
   find . -name "*.ts" -o -name "*.tsx" -o -name "*.js" | xargs wc -l | awk '$1 > 150'
   ```

### PR Requirements

✅ **Required:**

- [ ] All tests passing
- [ ] No ESLint errors
- [ ] Code formatted with Prettier
- [ ] All files ≤150 lines
- [ ] Test coverage maintained/improved
- [ ] No new security vulnerabilities (`pnpm audit`)
- [ ] Documentation updated (if needed)

### PR Description Template

```markdown
## Description

[Clear description of changes]

## Related Issues

Closes #123, Relates to #456

## Changes Made

- [ ] Feature/fix 1
- [ ] Feature/fix 2

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

### Review Process

1. **Automated checks** must pass (CI/CD)
2. **Code review** by maintainer(s)
3. **Address feedback** and update PR
4. **Squash and merge** once approved

## Commit Message Guidelines

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Adding/updating tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes

### Examples

```
feat(api): add cover letter generation endpoint

Implements AI-powered cover letter generation using Vercel AI SDK v5.
Uses GPT-4o-mini for content generation.

Closes #123
```

```
fix(auth): resolve GitHub OAuth redirect issue

The callback URL was incorrectly configured for production environment.
Updated to use dynamic URL based on deployment context.

Fixes #456
```

## Getting Help

- **Documentation:** Check [README.md](README.md) and [CLAUDE.md](CLAUDE.md)
- **Issues:** Search existing issues or create a new one
- **Discussions:** Ask questions in [GitHub Discussions](https://github.com/jsonresume/jsonresume.org/discussions)
- **Security:** See [SECURITY.md](SECURITY.md) for reporting vulnerabilities

## Additional Resources

- [Architecture Documentation](CLAUDE.md)
- [Security Policy](SECURITY.md)
- [Project Audit](PROJECT_AUDIT.md)

---

Thank you for contributing to JSON Resume! 🎉
