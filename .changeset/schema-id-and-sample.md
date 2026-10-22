---
'@jsonresume/schema': patch
---

Set real `$id`s on `schema.json` and `job-schema.json` (the resume schema had the placeholder `http://example.com/example.json`), point the sample and example resumes at the monorepo schema URL, and fix the README examples, which called `validate()` without its required callback.
