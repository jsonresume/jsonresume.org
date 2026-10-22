---
title: Getting started
description: Write a resume.json, validate it, and render it.
---

## 1. Write your resume.json

A minimal resume only needs a name:

```json
{
  "basics": {
    "name": "Jane Doe",
    "label": "Software Engineer",
    "email": "jane@example.com"
  }
}
```

Every section is optional. Add the ones that apply to you (`work`,
`education`, `skills`, `projects` and so on). See the [schema guide](/guides/schema)
for the full list, or start from the
[sample resume](https://github.com/jsonresume/jsonresume.org/blob/master/packages/schema/sample.resume.json).

With the CLI installed you can also generate a starter file:

```bash
npm install -g resume-cli
resume init
```

## 2. Validate it

```bash
resume validate
```

Validation checks types and formats (for example, dates must be ISO 8601:
`2024`, `2024-03` or `2024-03-15`). Unknown fields are allowed, so you can keep
extra data in the same file.

## 3. Render it

Locally, with the default theme:

```bash
resume export resume.html
resume export resume.pdf
```

Or host it: put the file in a public GitHub gist named `resume.json` and open
`https://registry.jsonresume.org/<your-github-username>`. See the
[registry guide](/guides/registry).

## 4. Pick a theme

Browse the [theme gallery](https://jsonresume.org/themes/), then:

```bash
resume export resume.html --theme even
```

or, on the registry, `?theme=even` or `"meta": { "theme": "even" }` in your
resume. See [themes](/guides/themes).
