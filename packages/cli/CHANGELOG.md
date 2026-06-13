# resume-cli

## 3.4.0

### Minor Changes

- 3bbe2bd: Add `markdown` and `text` export formats to `resume export` (no theme required). Render the resume as clean Markdown (`.md` / `--format markdown`) or readable plain text (`.txt` / `--format text`), covering every JSON Resume section. Reuses the capability of the archived resume-to-markdown / resume-to-text projects inside the maintained CLI.

## 3.3.0

### Minor Changes

- b0ccf9b: Friendlier theme-not-found errors and clearer `validate` output.

  - `export` and `serve` now print an actionable message when a `--theme` is not installed (e.g. `Theme 'X' not found. Install it: npm install jsonresume-theme-X`) and a link to the themes gallery, instead of a raw stack trace. `export` exits with a non-zero code on failure.
  - `validate` now prints a concise `✓ <file> is valid` line on success while keeping the per-field error list on failure.
  - `--help` documents the `--theme` option and points to https://jsonresume.org/themes/.

## 3.2.0

### Minor Changes

- 07c0f0e: Validation now uses Ajv with JSON Schema draft-07 (@jsonresume/schema 1.2.x); error output format updated.
