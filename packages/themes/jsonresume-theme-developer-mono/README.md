# Developer Mono

Technical, efficient theme with monospace headers and sans-serif body. Code-style aesthetics without gimmicks.

![Developer Mono theme preview](https://raw.githubusercontent.com/jsonresume/jsonresume.org/master/apps/homepage2/public/img/themes/developer-mono.png)

**Tags:** technical, developer, monospace, minimalist, blue

## Use it

Preview it live on the JSON Resume registry:

- https://registry.jsonresume.org/thomasdavis?theme=developer-mono

Install and use it with the JSON Resume CLI:

```sh
npm install jsonresume-theme-developer-mono
resume export resume.html --theme developer-mono
```

## Sections

Renders all standard JSON Resume sections: work, education, skills, projects, volunteer, awards, publications, languages, interests, references.

## Development

This theme lives in the [jsonresume.org](https://github.com/jsonresume/jsonresume.org) monorepo. Build it from the repo root with:

```sh
pnpm --filter jsonresume-theme-developer-mono build
```

## License

MIT
