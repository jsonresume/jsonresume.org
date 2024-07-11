[![](https://dcbadge.limes.pink/api/server/GTZtn8pTXC)](https://discord.gg/GTZtn8pTXC)

# JSON Resume

Welcome to the JSON Resume monorepo, the centralized repository for the registry, homepage, UI kit, base templates, utilities, and more.

## Applications

All projects hosted on this domain can be found in the `/apps` folder.

- **Homepage**: [jsonresume.org](https://jsonresume.org)
  - Source: [/apps/homepage2](https://github.com/jsonresume/jsonresume.org/tree/master/apps/homepage2)
- **Registry**: [registry.jsonresume.org](https://registry.jsonresume.org)
  - Source: [/apps/registry](https://github.com/jsonresume/jsonresume.org/tree/master/apps/registry)

## Requirements

This project requires [pnpm](https://pnpm.io/installation), an alternative to npm/yarn.

To install pnpm:

```sh
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

## Getting Started

This repository uses Vercel's Turbo repo setup.

Install the packages:

```sh
pnpm i
```

To start all applications:

```sh
pnpm turbo dev
```

To start an individual application, such as the registry:

```sh
pnpm turbo dev --filter=registry
```

## Application Details

### Registry

To start the registry application:

```sh
pnpm dev --filter=registry
```

**Environment Variables:**

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
```

The local server will start at [http://localhost:3000/thomasdavis](http://localhost:3000/thomasdavis).

**Supported Formats:**

- Markdown
- YAML
- HTML
- Text
- Lex

### Homepage

To start the homepage application:

```sh
pnpm dev --filter=homepage2
```

## Contributors

[![](https://4.vercel.app/github/contributors/jsonresume/jsonresume.org?strokeopacity=1)](https://discord.gg/GTZtn8pTXC)

## AI Features

This repository includes some AI/LLM usage examples. Access each feature by appending the normal hosted URL with the specific path.

### Jobs

This feature creates embeddings from Hacker News Who Is Hiring posts, matches them with an embedding of your resume, and recommends the most suitable jobs.

**Note:** This is not fully automated and requires formatting improvements. Each post should be reformatted using GPT into a templated job description before generating embeddings.

Access: [http://localhost:3000/thomasdavis/jobs](http://localhost:3000/thomasdavis/jobs)

### Letter

Generates a cover letter using GPT based on your resume. It can be improved by including the context of the job you are applying for.

Access: [http://localhost:3000/thomasdavis/letter](http://localhost:3000/thomasdavis/letter)

### Suggestions

Generates a list of suggestions to improve your resume using GPT.

Access: [http://localhost:3000/thomasdavis/suggestions](http://localhost:3000/thomasdavis/suggestions)

### Interview

A chatbot implementation where your resume is included in the prompt, allowing you to simulate an interview.

Access: [http://localhost:3000/thomasdavis/interview](http://localhost:3000/thomasdavis/interview)

## To-Do

- AI Tools:
  - Add an option to use your own API key.


## Design System

Brand colors: [Color Hexa](https://www.colorhexa.com/fff18f)

Feel free to join our community on [Discord](https://discord.gg/GTZtn8pTXC) for discussions, support, and collaboration.