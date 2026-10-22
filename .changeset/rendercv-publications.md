---
'@jsonresume/jsonresume-to-rendercv': minor
---

- Publications now pass RenderCV validation: `authors` (required by RenderCV, absent in JSON Resume) is set to the resume owner, and `publisher`, `url` and `summary` are mapped
- Local phone numbers, which RenderCV rejects, are omitted; international ones are kept
- The package entry is now the converter (`import { convert } from '@jsonresume/jsonresume-to-rendercv'`); previously importing it ran the CLI
- CLI takes an optional output path: `jsonresume-to-rendercv resume.json [output.yaml]`
- README documents usage and the field mapping
