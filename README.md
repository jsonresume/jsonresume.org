<p align="center">
  <img src="https://raw.githubusercontent.com/jsonresume/jsonresume.org/master/apps/app/public/favicon.svg" height="100" alt="JSON Resume logo" />
</p>

<h1 align="center">JSON Resume</h1>

<p align="center">
  <b>A community-driven open-source initiative to create a JSON-based standard for resumes</b>
</p>

<p align="center">
  <a href="https://github.com/jsonresume/jsonresume.org/actions/workflows/ci.yml"><img src="https://github.com/jsonresume/jsonresume.org/actions/workflows/ci.yml/badge.svg" alt="CI Status"></a>
  <a href="https://discord.gg/GTZtn8pTXC"><img src="https://dcbadge.limes.pink/api/server/GTZtn8pTXC" alt="Discord"></a>
  <img src="https://img.shields.io/github/license/jsonresume/jsonresume.org" alt="License">
  <img src="https://img.shields.io/github/stars/jsonresume/jsonresume.org?style=social" alt="Stars">
</p>

## Overview

JSON Resume is an open-source ecosystem of tools for creating, sharing, and
publishing resumes in a standardized JSON format. This is the monorepo (Turborepo
+ pnpm) that powers the platform: jsonresume.org, the documentation site, the
schema, the CLI, and the official themes.

With JSON Resume, you can:

- Create a portable, machine-readable resume
- Publish your resume online at jsonresume.org/@you, as a page, PDF or Word document
- Render your resume with dozens of community-built themes
- Validate your resume against the JSON Resume schema
- Match your resume to Hacker News "Who is hiring?" jobs
- Let your AI agent read and edit your resume through the MCP server at jsonresume.org/mcp

Useful links:

- Site: [jsonresume.org](https://jsonresume.org)
- Documentation: [jsonresume.org/docs](https://jsonresume.org/docs)
- Themes: [jsonresume.org/themes](https://jsonresume.org/themes)

## Monorepo layout

### Apps (`/apps`)

| App                                    | URL                                                            | Description                                                                 |
| -------------------------------------- | -------------------------------------------------------------- | --------------------------------------------------------------------------- |
| [`apps/app`](apps/app)                 | [jsonresume.org](https://jsonresume.org)                       | The site: resumes, themes, the editor, jobs, MCP (React, Vite, Hono, Effect) |
| [`apps/docs`](apps/docs)               | [jsonresume.org/docs](https://jsonresume.org/docs)             | Fumadocs documentation site, deployed to GitHub Pages                       |
| [`apps/styleguide`](apps/styleguide)   | [styleguide.jsonresume.org](https://styleguide.jsonresume.org) | The design system's documentation                                           |
| [`apps/registry`](apps/registry)       | —                                                              | The former registry (Next.js), kept for reference; its URLs redirect here   |
| [`apps/homepage2`](apps/homepage2)     | —                                                              | The former marketing site (Next.js), kept for reference                     |

### Key packages (`/packages`)

| Package                                            | npm / crate                | Description                                                  |
| -------------------------------------------------- | -------------------------- | ------------------------------------------------------------ |
| [`packages/schema`](packages/schema)               | `@jsonresume/schema`       | The JSON Resume schema and validator                         |
| [`packages/cli`](packages/cli)                     | `resume-cli`               | The `resume` command line interface                          |
| [`packages/core-rust`](packages/core-rust)         | `json-resume-serde` (crate) | Rust serde bindings for the schema                           |
| [`packages/resume-core`](packages/resume-core)     | `@jsonresume/core`         | Framework-agnostic design tokens, primitives, and validators |
| [`packages/ats-validator`](packages/ats-validator) | `@jsonresume/ats-validator` | ATS (Applicant Tracking System) validation for resume HTML   |
| [`packages/job-search`](packages/job-search)       | `@jsonresume/jobs`         | Hacker News "Who is Hiring" job search matched to a resume   |
| [`packages/ui`](packages/ui)                       | `@jsonresume/ui`           | Design system: tokens and React components ([styleguide](https://styleguide.jsonresume.org)) |
| [`packages/themes`](packages/themes)               | —                          | The official `jsonresume-theme-*` packages                   |

The site's features live in focused workspace packages (`@repo/accounts`,
`@repo/jobs`, `@repo/mcp`, `@repo/resume-themes`, ...); [`AGENTS.md`](AGENTS.md)
lists them all.

## Prerequisites

This project uses [pnpm](https://pnpm.io/installation) (see the `packageManager`
field in `package.json` for the pinned version):

```sh
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

## Quickstart

```sh
# Clone and install
git clone https://github.com/jsonresume/jsonresume.org.git
cd jsonresume.org
pnpm install

# Run jsonresume.org locally (http://localhost:5173)
pnpm --filter app dev
```

The dev server needs no accounts or secrets: it runs on an in-memory database,
so you can sign up and edit a resume locally. Open
[http://localhost:5173/@thomasdavis](http://localhost:5173/@thomasdavis) to
render a resume from a public gist, or append `?theme=<slug>` to try a theme.

### Working across the monorepo

```sh
pnpm turbo build
pnpm turbo lint typecheck
pnpm turbo typecheck lint test --filter=app...   # the app and every package it uses
```

## Testing

```sh
# One package (Vitest)
pnpm --filter @repo/resume-themes test

# Everything the site uses
pnpm turbo test --filter=app...

# End-to-end tests (Playwright)
pnpm turbo test:e2e
```

## Releases

npm packages (`@jsonresume/schema`, `resume-cli`, etc.) are released with
[Changesets](https://github.com/changesets/changesets). Add a changeset with
`pnpm changeset`; the `release-packages.yml` workflow opens a "Version Packages"
PR and publishes to npm on merge to `master`. The `json-resume-serde` Rust crate
is versioned in `packages/core-rust/Cargo.toml`.

## Building themes

A theme is an npm package exporting `render(resume)`, which returns a complete
HTML page. Themes live in `packages/themes`; scaffold one with

```sh
pnpm gen:theme harbor-light "Harbor Light"
```

and follow [`docs/CREATING_A_THEME.md`](docs/CREATING_A_THEME.md) to preview
and register it. The [Contributing Guide](CONTRIBUTING.md#contributing-themes)
says what a theme published on npm needs to be added.

## Documentation

- [JSON Resume docs](https://jsonresume.org/docs)
- [Schema](https://jsonresume.org/schema/)
- [Themes](https://jsonresume.org/themes/)
- [MCP server](https://jsonresume.org/mcp)
- [Developers (OAuth, API)](https://jsonresume.org/developers)

## History

JSON Resume started as a set of standalone repositories. In 2026 the project
consolidated into this monorepo: the schema (formerly `jsonresume/resume-schema`)
now lives in `packages/schema`, and the CLI (formerly `jsonresume/resume-cli`)
now lives in `packages/cli`. Those original repositories are archived and
redirect here, while the published npm package names (`@jsonresume/schema`,
`resume-cli`) are unchanged.

## Contributing

We welcome contributions from the community! Here's how you can help:

1. **Fork** the repository
2. **Clone** your fork to your local machine
3. **Create a branch** for your feature or bugfix
4. **Make your changes** and commit them
5. **Push** your changes to your fork
6. Submit a **Pull Request**

Please make sure to follow our code style and include appropriate tests for your changes.

Before opening a PR, please read our [Contributing Guide](CONTRIBUTING.md) for the full setup, checks, and conventions. All participants are expected to follow our [Code of Conduct](CODE_OF_CONDUCT.md), and security issues should be reported per our [Security Policy](SECURITY.md).

## Contributors

[![Contributors](https://contrib.rocks/image?repo=jsonresume/jsonresume.org)](https://github.com/jsonresume/jsonresume.org/graphs/contributors)

Join our [Discord community](https://discord.gg/GTZtn8pTXC) for discussions, support, and collaboration.

## License

This project is licensed under the [MIT License](LICENSE).
