---
'@jsonresume/schema': patch
---

Draft-07 hygiene pass (#321): remove `additionalItems: false` everywhere it sat next to a non-array `items` (ignored by every draft, but rejected by Ajv strict mode), and bump job-schema.json's declared `$schema` from draft-04 to draft-07 (Ajv 8 cannot compile draft-04 documents; no draft-04-only constructs were in use). Validation behavior is unchanged — verified old vs new schemas produce identical results across all examples, samples, and test fixtures. Both schemas now compile under Ajv `strict: true` and are guarded by a new meta-schema compliance test. Note: `definitions` (not `$defs`) remains correct for draft-07.
