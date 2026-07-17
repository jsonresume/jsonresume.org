<p align="center">
  <img src="https://raw.githubusercontent.com/jsonresume/jsonresume.org/master/apps/registry/public/favicon.svg" height="100" alt="JSON Resume logo" />
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
+ pnpm) that powers the platform: the marketing site, the hosted registry, the
documentation site, the schema, the CLI, and the official themes.

With JSON Resume, you can:

- Create a portable, machine-readable resume
- Publish your resume online with a unique URL via the registry
- Render your resume with dozens of community-built themes
- Validate your resume against the JSON Resume schema
- Leverage AI-powered tools to help with your job search

Useful links:

- Documentation: [jsonresume.org/docs](https://jsonresume.org/docs)
- Hosted registry: [registry.jsonresume.org](https://registry.jsonresume.org)
- Marketing site: [jsonresume.org](https://jsonresume.org)

## Monorepo layout

### Apps (`/apps`)

| App                                | URL                                                          | Description                                                            |
| ---------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------- |
| [`apps/registry`](apps/registry)   | [registry.jsonresume.org](https://registry.jsonresume.org)   | Next.js app that hosts resumes, renders themes, and serves AI features |
| [`apps/homepage2`](apps/homepage2) | [jsonresume.org](https://jsonresume.org)                     | Next.js marketing site for the project                                 |
| [`apps/docs`](apps/docs)           | [jsonresume.org/docs](https://jsonresume.org/docs)           | Fumadocs documentation site, deployed to GitHub Pages                  |

### Key packages (`/packages`)

| Package                                            | npm / crate                | Description                                                  |
| -------------------------------------------------- | -------------------------- | ------------------------------------------------------------ |
| [`packages/schema`](packages/schema)               | `@jsonresume/schema`       | The JSON Resume schema and validator                         |
| [`packages/cli`](packages/cli)                     | `resume-cli`               | The `resume` command line interface                          |
| [`packages/core-rust`](packages/core-rust)         | `json-resume-serde` (crate) | Rust serde bindings for the schema                           |
| [`packages/resume-core`](packages/resume-core)     | `@jsonresume/core`         | Framework-agnostic design tokens, primitives, and validators |
| [`packages/ats-validator`](packages/ats-validator) | `@jsonresume/ats-validator` | ATS (Applicant Tracking System) validation for resume HTML   |
| [`packages/job-search`](packages/job-search)       | `@jsonresume/jobs`         | Hacker News "Who is Hiring" job search matched to a resume   |
| [`packages/ui`](packages/ui)                       | `@repo/ui`                 | Shared UI components (Button, Input, Textarea, ...)          |
| [`packages/themes`](packages/themes)               | —                          | ~52 official `jsonresume-theme-*` packages plus `stackoverflow` |

Other workspace packages include `converters`, `theme-config`, `test-fixtures`,
and the shared `eslint-config-custom` / `tsconfig` presets.

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

# Run the registry app (http://localhost:3000)
cd apps/registry && pnpm dev
```

Once the registry is running, open
[http://localhost:3000/thomasdavis](http://localhost:3000/thomasdavis) to render a
sample resume, or append `?theme=<slug>` to try a theme.

### Working across the monorepo

```sh
# Run a task for every workspace
pnpm turbo dev
pnpm turbo build
pnpm turbo lint typecheck

# Scope a task to one app or package
pnpm turbo dev --filter=registry
pnpm turbo test --filter=registry
```

## Testing

```sh
# All workspaces
pnpm turbo test

# Registry unit tests (Vitest)
pnpm --filter registry test

# Registry end-to-end tests (Playwright)
pnpm --filter registry test:e2e
```

## Releases

npm packages (`@jsonresume/schema`, `resume-cli`, etc.) are released with
[Changesets](https://github.com/changesets/changesets). Add a changeset with
`pnpm changeset`; the `release-packages.yml` workflow opens a "Version Packages"
PR and publishes to npm on merge to `master`. The `json-resume-serde` Rust crate
is versioned in `packages/core-rust/Cargo.toml`.

## Building themes

Themes live in `packages/themes`. React themes rendered by the registry should:

- Export a default component that accepts a `resume` prop
- Avoid Node-only modules (e.g. `fs`) so they work on Vercel's runtime
- Use the `@repo/ui` shared components and render all JSON Resume sections

```jsx
// packages/themes/jsonresume-theme-your-theme/index.js
export default function YourTheme({ resume }) {
  return (
    <div>
      <h1>{resume.basics.name}</h1>
      {/* Your theme JSX */}
    </div>
  );
}
```

```sh
pnpm turbo dev --filter=registry
# Visit http://localhost:3000/thomasdavis?theme=your-theme-name
```

See [`docs/AGENT_THEME_DEVELOPMENT.md`](docs/AGENT_THEME_DEVELOPMENT.md) for the
full theme workflow.

## AI features

The registry includes AI-powered tools (job recommendations, cover letters,
resume suggestions, interview simulation). These require provider keys; see
[`apps/registry/.env.example`](apps/registry/.env.example) for the full list.
AI code uses the Vercel AI SDK v5 (`ai` + `@ai-sdk/openai`).

## Documentation

- [JSON Resume docs](https://jsonresume.org/docs)
- [Schema](https://jsonresume.org/schema/)
- [Themes](https://jsonresume.org/themes/)
- [Registry API](https://registry.jsonresume.org/docs)

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

[![Contributors](https://4.vercel.app/github/contributors/jsonresume/jsonresume.org?strokeopacity=1)](https://github.com/jsonresume/jsonresume.org/graphs/contributors)

Join our [Discord community](https://discord.gg/GTZtn8pTXC) for discussions, support, and collaboration.

## License

This project is licensed under the [MIT License](LICENSE).
