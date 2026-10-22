# @jsonresume/jsonresume-to-rendercv

## 1.1.0

### Minor Changes

- de5ed96: - Publications now pass RenderCV validation: `authors` (required by RenderCV, absent in JSON Resume) is set to the resume owner, and `publisher`, `url` and `summary` are mapped
  - Local phone numbers, which RenderCV rejects, are omitted; international ones are kept
  - The package entry is now the converter (`import { convert } from '@jsonresume/jsonresume-to-rendercv'`); previously importing it ran the CLI
  - CLI takes an optional output path: `jsonresume-to-rendercv resume.json [output.yaml]`
  - README documents usage and the field mapping

## 1.0.14

### Patch Changes

- 77c17c7: Keep the social network name when converting profiles: match JSON Resume network names to RenderCV's supported list case-insensitively (`GitHub`, `github`, `Stack Overflow`, `Twitter` → `X`), drop profiles RenderCV would reject, and stop emitting `null` summaries or `undefined` locations.
