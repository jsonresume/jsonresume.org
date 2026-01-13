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
- [Contributing Themes](#contributing-themes)

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

- **Node.js** 20+ (LTS recommended)
- **Bun** (latest version)
- **Git**
- **Supabase CLI** (for database operations)
- **just** (optional, for convenient task running)

### Installation

1. **Install dependencies**:

   ```bash
   bun install
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
   just db-generate
   # or: bun run db:generate
   ```

4. **Start development server**:

   ```bash
   just dev
   # or: bun run dev
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
│   ├── resume-core/      # Framework-agnostic theme primitives
│   ├── ats-validator/    # ATS compatibility validation
│   ├── themes/           # Resume theme implementations
│   │   ├── jsonresume-theme-reference/
│   │   ├── jsonresume-theme-modern/
│   │   ├── jsonresume-theme-standard/
│   │   └── ... (13+ themes)
│   ├── ui/               # Shared UI components
│   └── eslint-config/    # Shared ESLint config
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
# Using just (recommended)
just test              # Run tests in watch mode
just test-run          # Run tests once
just test-e2e          # Run E2E tests

# Using bun directly
bun run test           # Run tests in watch mode
bun run test:run       # Run tests once
bun run test:e2e       # Run E2E tests
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
   just lint          # ESLint
   just format-check  # Format check
   just test-run      # All tests
   just build         # Build check
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
- [ ] No new security vulnerabilities (`bun audit` or `npm audit`)
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

## Contributing Themes

Want to add your resume theme to the registry? Here's everything you need to know.

### Quick Start: Using @resume/core Components (Recommended)

The fastest way to build a new theme is using our composable component library:

```javascript
// index.js
import {
  Section,
  SectionTitle,
  ListItem,
  DateRange,
  BadgeList,
} from '@resume/core';

export function render(resume) {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>${resume.basics.name}</title>
      <link rel="stylesheet" href="https://unpkg.com/@resume/core@0.1.0/src/styles/tokens.css">
      <style>
        body {
          font-family: var(--resume-font-sans);
          max-width: var(--resume-max-width);
          margin: 0 auto;
          padding: 40px 20px;
        }
      </style>
    </head>
    <body>
      ${Section({
        children: `
          <h1>${resume.basics.name}</h1>
          <p>${resume.basics.label}</p>
        `,
      })}

      ${Section({
        children: `
          ${SectionTitle({ text: 'Work Experience' })}
          ${resume.work
            .map(
              (job) => `
            ${ListItem({
              title: job.position,
              subtitle: job.company,
              date: DateRange({
                startDate: job.startDate,
                endDate: job.endDate,
              }),
              description: job.summary,
            })}
          `
            )
            .join('')}
        `,
      })}

      ${Section({
        children: `
          ${SectionTitle({ text: 'Skills' })}
          ${resume.skills
            .map(
              (skill) => `
            <div>
              <strong>${skill.name}</strong>
              ${BadgeList({ items: skill.keywords })}
            </div>
          `
            )
            .join('')}
        `,
      })}
    </body>
    </html>
  `;

  return html;
}
```

**Benefits:**

- ✅ **ATS-friendly by default** - semantic HTML, standard fonts
- ✅ **10x faster development** - no need to write HTML from scratch
- ✅ **Tested components** - all primitives have unit tests
- ✅ **Design tokens** - consistent styling with CSS variables
- ✅ **Framework-agnostic** - works with any setup

**Available Components:**

- `Section()` - Wrapper for resume sections
- `SectionTitle()` - Styled section headings
- `ListItem()` - Experience/education entries
- `DateRange()` - Start/end date display
- `Badge()` / `BadgeList()` - Skills, keywords, tags

**See Working Examples:**

- `packages/themes/jsonresume-theme-reference/` - Complete implementation
- `packages/themes/jsonresume-theme-modern/` - Card-based modern design
- `packages/resume-core/README.md` - Full API documentation

### Theme Requirements

**CRITICAL:** Themes must be **serverless-compatible**. The registry runs on Vercel's serverless functions, which means:

❌ **Cannot use:**

- `fs.readFileSync()` or any filesystem operations
- `fs.readFile()`, `fs.readdirSync()`, etc.
- `__dirname` or `__filename` for file paths
- Dynamic file loading at runtime

✅ **Must use:**

- ES6 imports for templates and styles
- Build-time bundling (Vite, webpack, rollup)
- All assets inlined at compile time
- **OR** @resume/core components (recommended)

### Quick Start: Converting Your Theme

#### Before (❌ Breaks on Vercel)

```javascript
// index.js
const fs = require('fs');
const Handlebars = require('handlebars');

function render(resume) {
  const template = fs.readFileSync(__dirname + '/template.hbs', 'utf-8');
  const css = fs.readFileSync(__dirname + '/style.css', 'utf-8');

  return Handlebars.compile(template)({
    css: `<style>${css}</style>`,
    resume,
  });
}

module.exports = { render };
```

#### After (✅ Works on Vercel)

```javascript
// index.js
import Handlebars from 'handlebars';
import template from './template.hbs?raw'; // Vite raw import
import css from './style.css?inline'; // Vite inline import

export function render(resume) {
  return Handlebars.compile(template)({
    css: `<style>${css}</style>`,
    resume,
  });
}
```

### Step-by-Step Migration Guide

#### Option 1: Use Vite (Recommended)

1. **Install Vite and plugins:**

   ```bash
   npm install --save-dev vite vite-plugin-handlebars
   ```

2. **Create `vite.config.js`:**

   ```javascript
   import { defineConfig } from 'vite';

   export default defineConfig({
     build: {
       lib: {
         entry: './index.js',
         formats: ['cjs'],
         fileName: 'index',
       },
       rollupOptions: {
         external: ['handlebars'],
       },
     },
   });
   ```

3. **Update imports to use Vite's special imports:**

   ```javascript
   import template from './template.hbs?raw';
   import css from './style.css?inline';
   ```

4. **Add build script to `package.json`:**

   ```json
   {
     "scripts": {
       "build": "vite build",
       "prepublishOnly": "npm run build"
     },
     "main": "./dist/index.cjs"
   }
   ```

5. **Build and test:**

   ```bash
   npm run build
   npm publish
   ```

#### Option 2: Inline Everything Manually

For simple themes, you can inline content directly:

```javascript
// index.js
import Handlebars from 'handlebars';

const template = `
<!DOCTYPE html>
<html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; }
      /* your styles here */
    </style>
  </head>
  <body>
    <h1>{{resume.basics.name}}</h1>
    <!-- your template here -->
  </body>
</html>
`;

export function render(resume) {
  return Handlebars.compile(template)({ resume });
}
```

### Testing Your Theme Locally

1. **Install your theme in the registry:**

   ```bash
   cd jsonresume.org
   bun add --filter registry your-theme-name
   ```

2. **Add it to `themeConfig.js`:**

   ```javascript
   // apps/registry/lib/formatters/template/themeConfig.js
   export const THEMES = {
     // ... existing themes
     'your-theme': require('your-theme-name'),
   };
   ```

3. **Start the dev server:**

   ```bash
   just dev
   # or: bun run dev
   ```

4. **Test your theme:**
   ```
   http://localhost:3000/thomasdavis?theme=your-theme
   ```

### Working Examples

Check these themes in the repo for reference:

- **@resume/core components:** `packages/themes/jsonresume-theme-reference` (complete example)
- **@resume/core with custom styles:** `packages/themes/jsonresume-theme-modern` (card-based design)
- **Simple approach:** `packages/themes/jsonresume-theme-standard`
- **Vite bundling:** `packages/themes/jsonresume-theme-professional`
- **Handlebars templates:** `packages/themes/jsonresume-theme-spartacus`

### Common Issues

#### Issue: "Cannot find module"

**Cause:** Vite isn't bundling your files
**Fix:** Ensure you're using `?raw` or `?inline` suffixes for non-JS imports

#### Issue: "Template is undefined"

**Cause:** Import path is incorrect
**Fix:** Use relative paths (`./template.hbs`) not absolute paths

#### Issue: Theme works locally but fails on Vercel

**Cause:** Still using `fs` somewhere
**Fix:** Search your code for `require('fs')` or `fs.readFile`

### Submitting Your Theme

Once your theme is serverless-compatible:

1. **Publish to npm** (if not already published)
2. **Open an issue** at [#36](https://github.com/jsonresume/jsonresume.org/issues/36)
3. **Provide:**
   - Theme name
   - npm package name
   - Link to repository
   - Confirmation that it doesn't use `fs` operations

We'll review and add it to the registry!

### Need Help?

- **Examples:** See `packages/` directory in this repo
- **Questions:** Comment on [issue #36](https://github.com/jsonresume/jsonresume.org/issues/36)
- **Stuck:** We're happy to help! Just ask.

---

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
