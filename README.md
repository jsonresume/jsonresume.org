<p align="center">
  <img src="https://raw.githubusercontent.com/jsonresume/jsonresume-website/master/public/img/logo.svg" height="100" alt="JSON Resume logo" />
</p>

<h1 align="center">JSON Resume</h1>

<p align="center">
  <b>A community-driven open source initiative to create a JSON-based standard for resumes</b>
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

This project requires [pnpm](https://pnpm.io/installation), an alternative to npm/yarn.

To install pnpm:

```sh
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

## Getting Started

This repository uses [Turborepo](https://turbo.build/) for managing multiple applications and packages.

### Installation

```sh
# Clone the repository
git clone https://github.com/jsonresume/jsonresume.org.git
cd jsonresume.org

# Install dependencies
pnpm i
```

### Development

```sh
# Start all applications
pnpm turbo dev

# Start a specific application (e.g., registry)
pnpm turbo dev --filter=registry
```

## Application Details

### Registry

The registry allows users to publish and share their resumes with unique URLs.

```sh
# Start the registry application
pnpm dev --filter=registry
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
pnpm dev --filter=homepage2
```

## Testing

```sh
# Run tests for all projects
pnpm turbo test

# Run tests for a specific project
pnpm turbo test --filter=registry
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

## Turbo Gotchas

- If you don't import components from `@repo/ui`, it will not work in the build step