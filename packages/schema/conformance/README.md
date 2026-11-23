# Conformance suite

Documents with the result every implementation of the format must give: a
validator says `valid` or not, a parser accepts the valid ones (and keeps
what it doesn't know). It covers the resume ([SPEC.md](../SPEC.md)), job
([JOB-SPEC.md](../JOB-SPEC.md)) and company
([COMPANY-SPEC.md](../COMPANY-SPEC.md)) formats.

`manifest.json` lists every case:

```json
{
  "file": "resume/invalid/date-month-13.json",
  "schema": "resume",
  "valid": false,
  "description": "There is no month 13.",
  "section": "2"
}
```

- `schema` is `resume`, `job` or `company` (`schema.json`,
  `job-schema.json`, `company-schema.json`).
- `section` is the specification section the case tests (`JOB 2` is
  JOB-SPEC.md §2).
- Invalid cases break a type, a pattern or an enumeration. JSON Schema
  `format` keywords (email, uri) are annotations that validators may skip,
  so no case depends on them.

The suite ships in `@jsonresume/schema` (`conformance/`). The JavaScript
validator runs it (`test/conformance.spec.js`), and so does the Rust crate
(`packages/core-rust`). Ajv agrees with both. To add a case, add its file and
its manifest entry, and say in the description what rule it checks.
