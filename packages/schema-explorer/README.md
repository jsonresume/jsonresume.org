# @repo/schema-explorer

Show a JSON Schema as a reference people can read:

- `decodeJsonSchema(json)`: the draft-07 subset it understands, as an Effect Schema.
- `schemaSections(schema)`: top-level properties as sections with flat field
  rows (`location.city`, `profiles[].url`) and readable types (`URL`, `date`,
  `text or location`, `list of text`), resolving `#/definitions` refs.
- `<SchemaReference sections example exampleName />`: anchored sections with a
  field table and the matching part of the example, plus a section index.

Used for the resume and job description schemas on jsonresume.org.
