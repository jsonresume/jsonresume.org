# @repo/resume-import

Turns a resume someone already has into JSON Resume, server side, for the
import-first onboarding (PRD-GROWTH IMP-1, IMP-2, IMP-5). Nothing is saved
to an account: the result goes to a review screen, and the person saves it.

- **Inputs** (`detect`, by the file's bytes, never its name): PDF (text via
  `unpdf`, PDF.js), Word `.docx` (`mammoth`), a LinkedIn data export `.zip`
  (its CSVs, read with `fflate`), and plain text. Old `.doc` files, images
  and other zips are refused with a message saying what to do instead. At
  most 5 MB (`IMPORT_MAX_BYTES` in `@repo/api`).
- **Reading**: LinkedIn exports map column by column (`fromLinkedIn`), with
  no model. Everything else goes to `ResumeReader`: `gpt-5-mini` with
  structured output shaped like JSON Resume (`shape.ts`), which also lists
  the fields it inferred or is unsure of. `OPENAI_API_KEY` turns it on;
  without it model imports fail with `ImportFailed` and LinkedIn still works.
- **Repair** (`repair`): the result is checked with the validator
  `save_resume` uses (`@repo/resume-editor/validate`). Values with a plain
  meaning are rewritten ("Jan 2020" is `2020-01`, `ada.dev` is
  `https://ada.dev`); others are left out, each with a warning. An import
  never fails because of one bad field.
- **Confidence**: every filled field, by JSON pointer (`/work/0/name`), is
  `high`, `medium` or `low`: lower when the reader marked it, `medium` at
  best when repair rewrote it.
- **Cache and records** (`ImportStore`, `app.imports`): keyed by the SHA-256
  of the input and `IMPORT_VERSION` plus the model, so the same file is
  read once. Each import keeps its hash, kind, time, field count, model and,
  on the row that read it, the parsed result. Never the file or its text.
- **Events**: `import_started` and `import_finished` (`kind`, `ms`,
  `fields_found`, `cached`, `ok`) through `@repo/posthog`; signed out, under
  a one-off id with `$process_person_profile: false`.

Exposed as `POST /api/import` (`@repo/api-server`, works signed out, rate
limited per address) and the MCP tool `import_resume` (text or a public
URL; `Downloader` refuses private addresses).

Tests use `@repo/resume-import/testing`: `fakeReader` runs the real reader
over a scripted `LanguageModel`, so no OpenAI calls; fixtures (a text PDF, a
.docx, a LinkedIn zip) are built in `src/test/fixtures.ts`.
