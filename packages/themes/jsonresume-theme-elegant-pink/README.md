# Elegant Pink

A JSON Resume theme. Elegant Pink renders your resume.json into a polished, ready-to-share document.

![Elegant Pink theme preview](https://raw.githubusercontent.com/jsonresume/jsonresume.org/master/apps/homepage2/public/img/themes/elegant-pink.png)

## Use it

Preview it live on the JSON Resume registry:

- https://registry.jsonresume.org/thomasdavis?theme=elegant-pink

Install and use it with the JSON Resume CLI:

```sh
npm install jsonresume-theme-elegant-pink
resume export resume.html --theme elegant-pink
```

## Sections

Renders all standard JSON Resume sections: work, education, skills, projects, volunteer, awards, publications, languages, interests, references.

## Development

This theme lives in the [jsonresume.org](https://github.com/jsonresume/jsonresume.org) monorepo. Build it from the repo root with:

```sh
pnpm --filter jsonresume-theme-elegant-pink build
```

## License

MIT
