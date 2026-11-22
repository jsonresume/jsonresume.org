# Contributing to JSON Resume

Thank you for your interest in contributing to JSON Resume! This document
explains how to set up the repository, what we expect from a change, and how
to propose schema changes and themes.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Code Standards](#code-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Proposing Schema Changes](#proposing-schema-changes)
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

- **Node.js** 24 (what CI uses; the TypeScript scripts rely on its built-in type stripping)
- **pnpm**, the version pinned in `package.json`'s `packageManager` field
- **Git**

### Run the site

```bash
pnpm install
pnpm --filter app dev
```

This serves jsonresume.org at http://localhost:5173, every page rendered on
the server as in production, with hot reloading. It needs no accounts,
secrets or database: it runs on an in-memory Postgres (PGlite) that starts
empty, so you can sign up, edit a resume and use the dashboard locally.
Resumes in public GitHub gists render too, for example
http://localhost:5173/@thomasdavis or `/@thomasdavis?theme=<slug>`.

Optional: `OPENAI_API_KEY` turns on the features that call a model (job
matching, Pathways). The production configuration is described in
[`deploy/README.md`](deploy/README.md).

## Project Structure

```
jsonresume.org/
├── apps/
│   ├── app/            # jsonresume.org: routes and wiring (React, Vite, Hono, Effect)
│   ├── docs/           # jsonresume.org/docs (Fumadocs, static export)
│   ├── styleguide/     # styleguide.jsonresume.org, the design system's docs
│   ├── registry/       # legacy Next.js app, reference only
│   └── homepage2/      # legacy Next.js site, reference only
├── packages/
│   ├── schema/         # @jsonresume/schema, the JSON Resume spec
│   ├── cli/            # resume-cli
│   ├── ui/             # @jsonresume/ui, the design system
│   ├── resume-themes/  # renders a resume with any gallery theme
│   ├── theme-config/   # @jsonresume/theme-metadata, the gallery's catalogue
│   ├── themes/         # the jsonresume-theme-* packages
│   └── ...             # one package per feature (accounts, jobs, mcp, ...)
├── deploy/             # how the production server runs
└── docs/               # design notes and guides
```

The site's logic lives in focused packages under `packages/*`; `apps/app` is
thin. [`AGENTS.md`](AGENTS.md) lists every package and what it holds. The
legacy apps are kept for reference: don't add features to them.

## Code Standards

The full rules are in [`AGENTS.md`](AGENTS.md). In short:

- **TypeScript, strict.** No `any`, no non-null `!` to silence errors.
- **Effect 4** for effects, errors, services and the API; **Effect Schema**
  to parse anything that crosses a boundary. Effect ships its own guide in
  `node_modules/effect/AGENTS.md`.
- **React 19 + `@jsonresume/ui`**, styled with vanilla-extract `.css.ts`
  files and its `vars` tokens. No Tailwind, no inline `style={{}}`.
- **Files stay under 200 lines** (tests and config: 500). Split by
  responsibility when one grows.
- **No `console.*`.** Use Effect's logger on the server.
- **Every feature has MCP tools** in `@repo/mcp`, so a person's agent can do
  anything they can do on the site.
- **Accessibility:** one `h1` per page, landmarks, alt text, keyboard support.

## Testing

Tests are Vitest, with Testing Library for components. Run them per package
while you work:

```bash
pnpm --filter <package> test        # e.g. pnpm --filter @repo/resume-themes test
pnpm --filter <package> typecheck
pnpm turbo typecheck lint test --filter=app...   # the app and every package it uses
```

Test what matters: parsers, calculations, API handlers and the flows people
use. Every test must pass before you push; no skipped tests on `master`.

## Pull Request Process

### Before Submitting

1. **Update your branch**:

   ```bash
   git fetch upstream
   git rebase upstream/master
   ```

2. **Run the checks CI runs**:

   ```bash
   pnpm turbo lint typecheck prettier
   pnpm turbo test --filter=app...
   pnpm turbo build
   ```

3. **Add a changeset** if you changed a published package (`@jsonresume/*`,
   `resume-cli`, a theme): `pnpm changeset`. See
   [`docs/RELEASING.md`](docs/RELEASING.md).

### PR Requirements

- Describe what changed and why, and link the issue (`Closes #123`).
- List the commands you ran.
- Add screenshots for visual changes.
- CI must be green: `Lint + Typecheck`, `build`, `unit-test`, `test` (e2e)
  and `dev-script`.

### Review Process

1. **Automated checks** must pass (CI)
2. **Code review** by maintainer(s)
3. **Address feedback** and update the PR
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

Generates a cover letter from the resume and a job post.

Closes #123
```

```
fix(auth): resolve GitHub OAuth redirect issue

The callback URL was incorrectly configured for production environment.
Updated to use dynamic URL based on deployment context.

Fixes #456
```

## Proposing Schema Changes

The schema (`packages/schema`, published as `@jsonresume/schema`) is shared by
thousands of resumes, dozens of themes and many tools, so changes are made
deliberately. Discuss a change in an issue (use the **Schema proposal** form)
before opening a schema PR. The roadmap of open proposals is
[#329](https://github.com/jsonresume/jsonresume.org/issues/329).

### What gets in

- **Broadly useful.** A field most people with that kind of experience would
  fill in. Niche or tool-specific data belongs in the `custom` object (or any
  extra property, since unknown properties are allowed), not the core.
- **Minimal and additive.** In v1 every new field is optional and every
  existing resume stays valid. Prefer free text over a hard enum unless the
  values are genuinely closed (themes and regions differ).
- **Consistent.** Reuse existing conventions: `iso8601` dates, `keywords` as
  string arrays, `summary` for free text, `url` for links.
- **Not presentation.** The schema describes the person's history, not how a
  theme lays it out.

### What a proposal needs

1. The problem, with a real example of a resume that can't express it today.
2. The proposed JSON, with an example.
3. Why existing fields, `custom` or extra properties aren't enough.
4. Who consumes it: themes, the registry, ATS/job matching, other tools.
5. Migration impact if it changes an existing shape (renaming, type changes,
   string to object). Those are v2 changes and need a migration plan; they
   won't land as drive-by edits.

### Making the change

Once a proposal has agreement, a schema PR should:

- update `packages/schema/schema.json` and `sample.resume.json`
- add tests in `packages/schema/test/` (invalid cases must be **type
  violations**, since unknown properties are valid)
- mirror the change in the registry's copy (`apps/registry/lib/schema/`); a
  test checks they stay in step
- regenerate types: `pnpm --filter @jsonresume/types build`
- include a changeset (`pnpm changeset`)

Proposals are closed when they're out of scope, duplicate an existing thread,
or are covered by an extension mechanism. The issue will say which.

### Decisions, monthly

On the first of each month a workflow (`.github/workflows/schema-review.yml`)
opens a **Schema review** issue listing every open `schema` issue that has no
decision yet, oldest first. Each one gets one of three answers, with reasons,
in a comment on the proposal:

- **Accept** (`decision: accept`): a PR can follow, as described below.
- **Change** (`decision: change`): accepted in a different form, which the
  comment spells out.
- **Decline** (`decision: decline`): closed, saying why (out of scope,
  duplicate, or covered by `custom`).

Decisions are logged in [packages/schema/DECISIONS.md](packages/schema/DECISIONS.md).
Index issues such as the roadmap carry the `tracking` label and are skipped.

## Contributing Themes

A theme is an npm package that exports `render(resume)`, returning a complete
HTML page (a string, or a Promise of one). jsonresume.org renders it on the
server in Node, for the page at `/@username?theme=<slug>`, and prints the
same HTML to PDF with headless Chromium.

### Building a theme in this repo

Start with the generator. It scaffolds a theme on `@jsonresume/core` that
renders every section and passes the render checks:

```bash
pnpm gen:theme harbor-light "Harbor Light"
```

[`docs/CREATING_A_THEME.md`](docs/CREATING_A_THEME.md) walks through
building, previewing and registering it, and
[`docs/AGENT_THEME_DEVELOPMENT.md`](docs/AGENT_THEME_DEVELOPMENT.md) covers
the design process and the screenshot review.

### Adding a theme you publish yourself

Publish it to npm and open an issue with the package name and a link to its
source. Before adding it, we read its code and pin an exact version. A theme
must:

- **Render every JSON Resume section** it is given, and nothing that isn't
  there (no `undefined`, `[object Object]` or `NaN`).
- **Escape resume text.** Resumes are written by anyone.
- **Not touch the disk or the network while rendering.** Bundle templates
  and styles into the package's code, so it also works in the CLI and
  serverless tools.
- **Load fonts from absolute URLs** (Google Fonts, for example) or embed
  them. The PDF is printed from a blank page, so relative URLs don't resolve,
  and fonts from another origin need CORS headers.
- **Keep the text readable when printed**: real text, not images of text.

### Testing a theme locally

```bash
pnpm --filter app dev
open "http://localhost:5173/@thomasdavis?theme=<slug>"
```

A theme from npm must be registered first (see the checklist in
`docs/CREATING_A_THEME.md`: a dependency and a loader in
`packages/resume-themes`, and an entry in `packages/theme-config`).
`pnpm --filter @repo/resume-themes test` then renders every registered theme.

### Working examples

- **@jsonresume/core components:** `packages/themes/jsonresume-theme-reference`
- **Typeset serif, embedded fonts:** `packages/themes/jsonresume-theme-professional`
- **Handlebars templates:** `packages/themes/jsonresume-theme-flat`

## Getting Help

- **Documentation:** [README.md](README.md), [AGENTS.md](AGENTS.md) and [docs/](docs)
- **Issues:** search existing issues or open a new one
- **Discussions:** ask in [GitHub Discussions](https://github.com/jsonresume/jsonresume.org/discussions)
- **Security:** see [SECURITY.md](SECURITY.md) for reporting vulnerabilities
- **Releasing npm packages:** [docs/RELEASING.md](docs/RELEASING.md)

---

Thank you for contributing to JSON Resume!
