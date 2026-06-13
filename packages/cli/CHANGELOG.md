# resume-cli

## 3.6.0

### Minor Changes

- 99c2e70: Add a `resume themes` command that lists the JSON Resume themes installed in
  `node_modules` (project and global), printing the slug to pass to `--theme`
  plus a usage example and the gallery link. Discovery is local and
  network-free, so you no longer have to know a theme slug ahead of time.

## 3.5.0

### Minor Changes

- e4acade: `resume validate` now reports precise, actionable results. On failure each
  problem is shown with its JSON path (e.g. `work[0].startDate`), the failing
  rule, the offending value, and a one-line fix hint. On success it prints an OK
  summary with the candidate name and a count of each populated section. The
  classic `data/...` phrasing and the non-zero exit code on invalid input are
  preserved; raw Ajv errors are exposed on the thrown error for machine-readable
  callers.

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
