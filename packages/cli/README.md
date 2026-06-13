# resume-cli

[![npm package](https://badge.fury.io/js/resume-cli.svg)](https://www.npmjs.org/package/resume-cli)

This is the command line tool for [JSON Resume](https://jsonresume.org), the open-source initiative to create a JSON-based standard for resumes.

> **Note:** `resume-cli` has been revived and now lives in the [jsonresume.org monorepo](https://github.com/jsonresume/jsonresume.org) as `packages/cli` (modernized for Node.js 18+). It keeps its npm identity as [`resume-cli`](https://www.npmjs.com/package/resume-cli) and is published from this workspace. The old standalone [jsonresume/resume-cli](https://github.com/jsonresume/resume-cli) repository is archived — please open issues and PRs against the monorepo.

## Getting Started

Requires Node.js 18 or newer.

Install the command-line tool:

```
npm install -g resume-cli
```

## Usage

### Commands at a Glance

| Command | Description |
|---|---|
| init | Initialize a `resume.json` file. |
| validate | Schema validation test your `resume.json`. |
| export path/to/file.html | Export to `.html`, `.pdf`, `.md` or `.txt`. |
| audit | Score your resume for ATS (Applicant Tracking System) friendliness. |
| themes | List the JSON Resume themes installed in `node_modules`. |
| serve | Serve resume at `http://localhost:4000/`. |

### `resume --help`

Show a list of options and commands for the <abbr title="Command-line Interface">CLI</abbr>.

### `resume init`

Creates a new `resume.json` file in your current working directory.

Complete the `resume.json` with your text editor. Be sure to follow the schema (available at https://jsonresume.org/schema/).

### `resume validate`

Validates your `resume.json` against our schema to ensure it complies with the standard.

On success it prints a one-line summary with the candidate name and a count of
each populated section:

```
✓ resume.json is valid (Ada Lovelace — 1 work, 1 education, 2 skills)
```

On failure it exits non-zero and prints one annotated block per problem, naming
the exact JSON path, the failing rule, the offending value, and a one-line hint:

```
Invalid resume: 2 problems found

  ✖ data/basics/email must match format "email"
    at:    basics.email
    rule:  format (expected email)
    found: "nope" (string)
    hint:  "basics.email" must be a valid email address, e.g. "you@example.com".

  ✖ data/work/0/startDate must match pattern "..."
    at:    work[0].startDate
    rule:  pattern
    found: "13-2020" (string)
    hint:  "work[0].startDate" must be an ISO-8601 date: YYYY, YYYY-MM, or YYYY-MM-DD.
```

Validate against a custom schema with `--schema <path>`.

### `resume export [fileName]`

Exports your resume to one of four formats:

- `.html` / `.pdf` — stylized output rendered through a theme.
- `.md` — clean Markdown (one heading per section). No theme required.
- `.txt` — readable plain text. No theme required.

The format is inferred from the file extension, or set it explicitly with
`--format`:

```
resume export resume.md                  # Markdown (inferred)
resume export resume.txt --format text   # plain text (explicit)
resume export resume.html --theme even   # themed HTML
resume export resume.pdf --theme even    # themed PDF
```

`--format` accepts `html`, `pdf`, `markdown` (or `md`) and `text` (or `txt`).

The Markdown and text formats render every JSON Resume section that is present
(basics, work, volunteer, education, awards, publications, skills, languages,
interests, references, projects) and skip any that are missing — so no theme
install is needed.

A list of available themes (for `.html` / `.pdf`) can be found here:  
https://jsonresume.org/themes/

Please npm install the theme you wish to use before attempting to export it.

Options:

- `--format <file type>` Example: `--format pdf`
- `--theme <name>` Example: `--theme even` (only used for `.html` / `.pdf`)

### `resume audit [fileName]`

Scores your resume for **ATS (Applicant Tracking System) friendliness**. It
renders your resume to HTML with a theme, runs
[`@jsonresume/ats-validator`](../ats-validator) against the markup, and prints an
advisory report: an overall score and letter grade, a per-check pass/fail
breakdown, and recommendations.

```
$ resume audit resume.json

ATS score: 88/100  (grade B, excellent)
9/10 checks passed, 1 need attention

Checks:
  ✓ Semantic HTML (10/10)
  ✓ ATS-Friendly Fonts (10/15)
  ✓ No Table Layouts (15/15)
  ✗ Single-Column Layout (6/15)
  ✓ Heading Structure (10/10)
  ...

Recommendations:
  - 📋 Single-Column Layout: 6/15 - Review and fix issues in this category
  - ✅ Great! Your resume is highly ATS-compatible. Minor improvements possible.
```

The audit is **advisory** — a successful audit always exits `0` regardless of
score. It only exits non-zero when the resume can't be read or the theme can't
be rendered (the same friendly errors as `export`).

The file argument is optional; it falls back to `--resume` (default
`resume.json`). The report is rendered with the bundled `even` theme by default;
pass `--theme <name>` to audit the markup a specific theme produces.

Options:

- `--theme <name>` Example: `--theme elegant` (defaults to `even`)

### `resume themes`

Lists the JSON Resume themes installed in `node_modules` — both in your project
and globally — so you don't have to know a theme slug ahead of time. It prints
the slug to pass to `--theme` for `export` / `serve`:

```
$ resume themes
Installed themes (2) — pass the slug to --theme:
  elegant v1.16.1
  even    v0.6.0

Use it:         resume export resume.html --theme elegant
Browse the full gallery:  https://jsonresume.org/themes/
```

If none are installed yet, it points you at how to install one. Discovery is
local and network-free; browse the full gallery (with screenshots) at
https://jsonresume.org/themes/ and `npm install jsonresume-theme-<slug>` the one
you want.

### `resume serve`

Starts a web server that serves your local `resume.json`. It will live reload when you make changes to your `resume.json`.

Options:

- `--port <port>`
- `--theme <name>`

When developing themes, change into your theme directory and run `resume serve --theme .`, which tells it to run the local folder as the specified theme.

This is not intended for production use, it's a convenience for theme development or to visualize changes to your resume while editing it.

## Supported Resume Input Types

- [`json`](https://www.json.org/json-en.html): via `JSON.parse`.
- [`yaml`](https://yaml.org/): via [`yaml-js`](https://www.npmjs.com/package/yaml-js)
- `quaff`: if `--resume` is a directory, then the path is passed to [`quaff`](https://www.npmjs.com/package/quaff) and the resulting json is used as the resume. quaff supports a variety of formats in the directory, including javascript modules.

## Resume Data

- Setting `--resume -` tells the CLI to read resume data from standard input (`STDIN`), and defaults `--type` to `application/json`.
- Setting `--resume <path>` reads resume data from `path`.
- Leaving `--resume` unset defaults to reading from `resume.json` on the current working directory.

## Resume MIME Types

Supported resume data MIME types are:

- `application/json`
- `text/yaml`

## Development

This package is part of the [jsonresume.org monorepo](https://github.com/jsonresume/jsonresume.org). From `packages/cli`:

```
pnpm dev    # run the CLI from source (babel-node lib/main.js)
pnpm build  # compile lib/ to build/ with Babel
pnpm test   # run the Jest test suite
pnpm lint   # run ESLint
```

## License

Available under [the MIT license](http://mths.be/mit).
