# @repo/resume-editor

The resume editor at `/dashboard/editor`. The form is generated from the
JSON Resume schema (`formSections`): every section and field the spec has,
each edited the way its type suggests (dates, URLs, lists of entries,
keywords as chips, highlights one per line). The JSON view is a code editor
that marks syntax errors and schema problems in place (`validate`,
`schemaDiagnostics`). Beside either, the page renders live in its theme
(server-side, sandboxed). Saving stores the copy `/@username` shows;
unsaved edits are kept in the browser until then.

Ideas from the registry's editor: form and JSON views over one resume,
schema checking while typing, a live preview, and Save beside the page.
