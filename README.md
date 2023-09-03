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

(insert someone who can remove all of the global install crap)

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
# classic token
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

```
turbo dev --filter=registry
```

This will start a local server at [http://localhost:3002/thomasdavis](http://localhost:3002/thomasdavis)


### Formats

- Markdown
- YAML
- HTML
- Text
- Lex

### Notes
- Gonna drop Typescript, prefer less barriers to entry
- Templates cannot read from the file system when using the registry
- Base templates using react/svelte/etc
- pdf? lol

## App - Homepage

homepage shit goes here

### Notes

- Get rid of Jekyll

## AI

This repo contains some fun examples of AI/LLM usage. Each feature can be reached by simply appending your normal hosted url with the following;

### Jobs

This project creates embeddings out of Hacker News Who Is Hiring post, it then generates an embedding of your resume. Then uses vector similarity matching to recommend what jobs would be most applicable to you. 

It is not setup to be automated at the moment, and the formatting is garbage. Each post should be sent to GPT to reformat it into a templated job description before generating embeddings.


[http://localhost:3002/thomasdavis/jobs](http://localhost:3002/thomasdavis/jobs)

### Letter

This is a very simple service that prompts GPT with your resume and asks to generate a cover letter.

It could be easily improved to also contain the context of the job you are applying for. 

[http://localhost:3002/thomasdavis/letter](http://localhost:3002/thomasdavis/letter)


### Suggestions

This is a very simple service that prompts GPT with your resume and asks to generate a list of suggestions for you to improve your resume.

[http://localhost:3002/thomasdavis/suggestions](http://localhost:3002/thomasdavis/suggestions)


### Interview

This is an implementation of a chat bot, your resume is injected, and the conversation is included in the prompt. So you can interview your self or talk as if you were being interviewed.

[http://localhost:3002/thomasdavis/interview](http://localhost:3002/thomasdavis/interview)

