---
'resume-cli': minor
---

Friendlier theme-not-found errors and clearer `validate` output.

- `export` and `serve` now print an actionable message when a `--theme` is not installed (e.g. `Theme 'X' not found. Install it: npm install jsonresume-theme-X`) and a link to the themes gallery, instead of a raw stack trace. `export` exits with a non-zero code on failure.
- `validate` now prints a concise `✓ <file> is valid` line on success while keeping the per-field error list on failure.
- `--help` documents the `--theme` option and points to https://jsonresume.org/themes/.
