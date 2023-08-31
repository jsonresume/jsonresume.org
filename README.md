# JSON Resume

This is a monorepo, will be the home of the registry, the homepage, ui kit, base templates, utils etc

// @todo - explain apps vs packages

## Apps

All projects hosted on this domain, will be found in the /apps folder.

- [jsonresume.org](https://jsonresume.org) - the homepage, currently built in Jekyll, would like to move to a Javascript framework for easier contributions
  - found in [/apps/homepage](https://github.com/jsonresume/jsonresume.org/tree/master/apps/homepage)
- [registry.jsonresume.org](https://registry.jsonresume.org) - the opt-in hosted place blah blah
  - found in [/apps/registry](https://github.com/jsonresume/jsonresume.org/tree/master/apps/registry)

## Requirements

1. This project requires [pnpm](https://pnpm.io/installation) (yet another npm/yarn alternative)

```
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

2. Until futher ado this repo will also depend on a globally installed version of [turbo](https://turbo.build/repo/docs/installing).

```
pnpm install turbo --global
```

(insert someone who can remove all of the global crap)

## Getting Started

This repo uses Vercel's Turbo repo setup.

Install the packages;

```
pnpm i
```

To start them all;

```
turbo dev
```

To start an individual app;

```
turbo dev --filter=registry
```

// @todo - don't really want to add containers (docker etc), thoughts needed (because of the current jekyll requirement on the homepage)

**Environment variables**:

These are required to run the registry. (only the github token, but it probably crashs without the rest for now)

```
GITHUB_TOKEN=

# normal dbs vs edge location dbs
DATABASE_URL_RAW=
DATABASE_URL=

# ai crap, llm and vectors
PINECONE_API_KEY=
PINECONE_ENVIRONMENT=
OPENAI_API_KEY=
```


## App - Registry

registry shit goes here


### Formats

- markdown
- yaml
- html
- text
- lex

### Notes
- Gonna drop Typescript, prefer less barriers to entry
- Templates cannot read from the file system when using the registry
- Base templates using react/svelte/etc
- pdf? lol

## App - Homepage

homepage shit goes here

### Notes

- Get rid of Jekyll



# OTHER - WIP - IGNORE

## Prisma

// @todo - edge location database proxy, might just get rid of it, kind of annoying

apps/registry postinstall$ prisma generate --data-proxy
[2 lines collapsed]
│ You can now start using Prisma Client in your code. Reference: https://pris.
│ ```
│ import { PrismaClient } from '@prisma/client'
│ const prisma = new PrismaClient()
│ ```
│ To use Prisma Client in edge runtimes like Cloudflare Workers or Vercel Edge
│ ``` 
│ import { PrismaClient } from '@prisma/client/edge'
│ ```
│ You will need a Prisma Data Proxy connection string. See documentation: http
└─ Done in 1.4s
Done in 8.2s


### Jobs

// @todo - creating embeddings out of hn who is hiring post

### Letter

// @todo - set up an url reader or copy paste a jd

### Suggestions

// @todo - use a fine trained model

### Interview

// @todo - example of how to use memories and vector similarity searches

