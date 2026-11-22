# json-resume-serde

A Rust implementation of the [JSON Resume schema](https://jsonresume.org/schema/) with [Serde](https://serde.rs/) and [`serde_valid`](https://crates.io/crates/serde_valid) support for serialization, deserialization, and validation.

This crate provides strongly-typed Rust structs (`Resume`, `Basics`, `Work`, etc.) that mirror the JSON Resume schema, so you can parse a `resume.json`, validate it, and serialize it back out with full type safety.

> **Note:** This crate is part of the [jsonresume.org monorepo](https://github.com/jsonresume/jsonresume.org) as `packages/core-rust`. The types here follow the canonical schema in [`packages/schema`](../schema) (`@jsonresume/schema`); a schema PR that adds a field adds it here too. Publishing to [crates.io](https://crates.io) is TBD — for now, depend on it via a Git or path dependency. Please open issues and PRs against the monorepo.

## What it covers

JSON Resume 1.x as [`SPEC.md`](../schema/SPEC.md) describes it: every section
and field of `schema.json`, including `objective`, `meta` (with `language` and
`translations`) and `custom`, and `work`/`volunteer`/`education` locations as
either free text or a location object (`Place`).

- Every field is optional: `{}` parses, and absent fields are left out when
  writing (never `null`).
- Properties the crate doesn't model are kept in each struct's `extra` map,
  so a document read and written again comes back unchanged. The tests check
  this on the schema's sample and examples.
- `validate()` checks the format conventions (URLs, emails, ISO 8601 dates,
  ISO 3166-1 country codes) and names each error by its JSON path
  (`basics.email`, `work[0].startDate`).
- `type` fields are `kind` in Rust (`Work::kind`, `Project::kind`,
  `Publication::kind`).

## Usage

```rs
use json_resume_serde::Resume;
use serde_valid::Validate;

let resume: Resume = serde_json::from_str(&std::fs::read_to_string("resume.json")?)?;
resume.validate()?;
println!("{}", serde_json::to_string_pretty(&resume)?);
```

Building one, with `Default` for everything left out:

```rs
use json_resume_serde::{Basics, Resume, Work};

let resume = Resume {
    basics: Some(Basics { name: Some("Ada Lovelace".into()), ..Default::default() }),
    work: vec![Work {
        name: Some("Analytical Engines".into()),
        kind: Some("contract".into()),
        start_date: Some("1842-07".into()),
        ..Default::default()
    }],
    ..Default::default()
};
```

Run the tests with `cargo test` in `packages/core-rust`; CI runs them with
`cargo fmt --check` and `cargo clippy`.

## License

MIT
