<p align="center">
  <img src="https://raw.githubusercontent.com/jsonresume/jsonresume-website/master/public/img/logo.svg" height="100" alt="JSON Resume logo" />
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

JSON Resume is an open-source ecosystem of tools designed to create, share, and publish resumes in a standardized JSON format. This monorepo contains all the core applications, themes, and utilities that power the JSON Resume platform.

With JSON Resume, you can:
- Create a portable, machine-readable resume
- Publish your resume online with a unique URL
- Convert your resume to various formats (PDF, HTML, Markdown)
- Choose from a variety of community-built themes
- Leverage AI-powered tools to enhance your job search

## Applications

All projects hosted on this domain can be found in the `/apps` folder:

| Application | URL | Source |
|-------------|-----|--------|
| **Homepage** | [jsonresume.org](https://jsonresume.org) | [/apps/homepage2](https://github.com/jsonresume/jsonresume.org/tree/master/apps/homepage2) |
| **Registry** | [registry.jsonresume.org](https://registry.jsonresume.org) | [/apps/registry](https://github.com/jsonresume/jsonresume.org/tree/master/apps/registry) |

## Themes

JSON Resume themes allow you to render your resume in different styles. This repository includes several official themes:

- `jsonresume-theme-cv`
- `jsonresume-theme-flat`
- `jsonresume-theme-full`
- `jsonresume-theme-onepage`
- `jsonresume-theme-onepage-plus`
- `jsonresume-theme-papirus`
- `jsonresume-theme-professional`
- `jsonresume-theme-spartacus`
- `jsonresume-theme-standard`
- `jsonresume-theme-tailwind`
- `jsonresume-theme-stackoverflow`

## AI Features

JSON Resume includes several AI-powered features to enhance your job search:

| Feature | Description | URL |
|---------|-------------|-----|
| **Job Recommendations** | Matches your resume with job postings from Hacker News Who Is Hiring | `/[username]/recommendations` |
| **Cover Letter** | Generates personalized cover letters based on your resume | `/[username]/letter` |
| **Resume Suggestions** | Provides suggestions to improve your resume | `/[username]/suggestions` |
| **Interview Simulator** | Simulates an interview based on your resume | `/[username]/interview` |

## Prerequisites

This project uses [Bun](https://bun.sh/) as the package manager and runtime.

To install Bun:

```sh
curl -fsSL https://bun.sh/install | bash
```

Optionally, install [just](https://github.com/casey/just) for convenient task running:

```sh
# macOS
brew install just

# Linux
curl --proto '=https' --tlsv1.2 -sSf https://just.systems/install.sh | bash -s -- --to /usr/local/bin
```

## Getting Started

### Installation

```sh
# Clone the repository
git clone https://github.com/jsonresume/jsonresume.org.git
cd jsonresume.org

# Install dependencies
bun install
```

### Development

```sh
# Using just (recommended)
just dev              # Start registry app
just dev-all          # Start all apps

# Using bun directly
bun run dev           # Start registry app
bun run dev:all       # Start all apps
```

## Application Details

### Registry

The registry allows users to publish and share their resumes with unique URLs.

```sh
# Start the registry application
just dev
# or
bun run dev
```

#### Environment Variables

These variables are optional and used for running different parts of the registry. The main rendering behavior of resumes does not require them.

```sh
# GitHub token for authentication
GITHUB_TOKEN=

# Database URLs
DATABASE_URL_RAW=
DATABASE_URL=

# AI configurations
PINECONE_API_KEY=
PINECONE_ENVIRONMENT=
OPENAI_API_KEY=
PERPLEXITY_API_KEY=
SUPABASE_KEY=
```

Local server will be available at [http://localhost:3000/thomasdavis](http://localhost:3000/thomasdavis)

### Homepage

The homepage serves as the main entry point for the JSON Resume project.

```sh
# Start the homepage application
just dev-homepage
# or
bun run --filter homepage2 dev
```

## Building Themes

### Creating a React Theme for the Registry

The registry can render React-based themes. Here's how to create one:

1. **Create a new theme package** in `/themes/your-theme-name`
2. **Export a React component** that accepts `resume` prop
3. **Important**: Avoid using Node.js-specific modules like `fs` - they won't work on Vercel's edge runtime
4. **Use the `@repo/ui` package** for shared components

Example structure:
```jsx
// themes/your-theme/index.js
export default function YourTheme({ resume }) {
  return (
    <div>
      <h1>{resume.basics.name}</h1>
      {/* Your theme JSX */}
    </div>
  );
}
```

5. **Test locally**:
```sh
just dev
# Visit http://localhost:3000/thomasdavis?theme=your-theme-name
```

### AI Features Development

The AI-powered features require additional environment variables:

```sh
# Required for AI features
OPENAI_API_KEY=your_openai_key
PERPLEXITY_API_KEY=your_perplexity_key
PINECONE_API_KEY=your_pinecone_key
PINECONE_ENVIRONMENT=your_pinecone_env
```

AI features use the Vercel AI SDK v5 (`ai` package). See the registry app for implementation examples.

## Testing

```sh
# Using just
just test             # Run unit tests in watch mode
just test-run         # Run unit tests once
just test-e2e         # Run E2E tests
just test-coverage    # Run with coverage

# Using bun directly
bun run test          # Run unit tests in watch mode
bun run test:run      # Run unit tests once
bun run test:e2e      # Run E2E tests
```

## Available Commands

Run `just --list` to see all available commands:

```sh
just install          # Install dependencies
just dev              # Start registry in dev mode
just build            # Build all packages
just lint             # Run ESLint
just format           # Format with Prettier
just test             # Run unit tests
just test-e2e         # Run E2E tests
just storybook        # Start Storybook
just db-generate      # Generate Prisma client
just clean            # Remove node_modules
```

## Documentation

For more detailed documentation about:
- [JSON Resume Schema](https://jsonresume.org/schema/)
- [Creating your own theme](https://jsonresume.org/themes/)
- [API documentation](https://registry.jsonresume.org/api/docs)

## Contributing

We welcome contributions from the community! Here's how you can help:

1. **Fork** the repository
2. **Clone** your fork to your local machine
3. **Create a branch** for your feature or bugfix
4. **Make your changes** and commit them
5. **Push** your changes to your fork
6. Submit a **Pull Request**

Please make sure to follow our code style and include appropriate tests for your changes.

## Contributors

[![Contributors](https://4.vercel.app/github/contributors/jsonresume/jsonresume.org?strokeopacity=1)](https://github.com/jsonresume/jsonresume.org/graphs/contributors)

Join our [Discord community](https://discord.gg/GTZtn8pTXC) for discussions, support, and collaboration.

## Design System

Brand colors: [Color Hexa](https://www.colorhexa.com/fff18f)

## License

This project is licensed under the [MIT License](LICENSE).

## Roadmap

- Enhance AI recommendation features
- Add support for more export formats
- Improve theme customization options
- Add an option to use your own API key for AI features
- Create a unified CLI tool for the ecosystem
