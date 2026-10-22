---
title: CLI
description: Render and validate resume.json locally with resume-cli.
---

```bash
npm install -g resume-cli
# or run without installing
npx resume-cli --help
```

`resume-cli` needs Node.js 18 or later. Source:
[`packages/cli`](https://github.com/jsonresume/jsonresume.org/tree/master/packages/cli).

## Commands

| Command | What it does |
| --- | --- |
| `resume init` | Creates `resume.json` from the sample (prompts for name and email) |
| `resume validate` | Checks `resume.json` against the schema |
| `resume export <file>` | Writes `.html`, `.pdf`, `.md` or `.txt`, chosen by the extension |
| `resume serve` | Serves your resume at `http://localhost:4000` with live reload |
| `resume themes` | Lists the themes installed locally (the names to pass to `--theme`) |
| `resume audit` | Scores the resume for applicant-tracking-system friendliness |

Common options:

- `--resume <file>`: use a file other than `resume.json` (`-` reads stdin). A
  `.jsonc` file may contain comments and trailing commas
- `--theme <name>`: theme for HTML and PDF; defaults to `even`
- `--format <type>`: set the export format explicitly

## Themes

`--theme even` resolves the npm package `jsonresume-theme-even`. Install
themes in your project (`npm install jsonresume-theme-<name>`); the CLI also
finds the themes it ships with. Scoped packages are passed by their full name:

```bash
resume export resume.html --theme @jsonresume/jsonresume-theme-professional
```

A local theme under development can be passed as a path:

```bash
resume export resume.html --theme ./my-theme
```

## PDF on Linux CI and containers

PDF export runs headless Chrome. Where Chrome can't start its sandbox
(common in Docker and CI), set:

```bash
RESUME_PUPPETEER_NO_SANDBOX=1 resume export resume.pdf
```

## Alternative: resumed

[resumed](https://github.com/rbardini/resumed) is a smaller community CLI with
the same theme ecosystem:

```bash
npm install -g resumed jsonresume-theme-even
resumed render resume.json --theme jsonresume-theme-even
```
