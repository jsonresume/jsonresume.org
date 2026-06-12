# json-resume-serde

A Rust implementation of the [JSON Resume schema](https://jsonresume.org/schema/) with [Serde](https://serde.rs/) and [`serde_valid`](https://crates.io/crates/serde_valid) support for serialization, deserialization, and validation.

This crate provides strongly-typed Rust structs (`Resume`, `Basics`, `Work`, etc.) that mirror the JSON Resume schema, so you can parse a `resume.json`, validate it, and serialize it back out with full type safety.

> **Note:** This crate is part of the [jsonresume.org monorepo](https://github.com/jsonresume/jsonresume.org) as `packages/core-rust`. The types here are kept in sync with the canonical schema in [`packages/schema`](../schema) (`@jsonresume/schema`); when the schema changes, update these structs and their validation rules to match. Publishing to [crates.io](https://crates.io) is TBD — for now, depend on it via a Git or path dependency. Please open issues and PRs against the monorepo.

## Usage

### From Serialized JSON

```rs
use serde_valid::Validate;

#[axum::debug_handler]
async fn post(Json(resume): Json<json_resume_serde::Resume>) -> Result<Json<Resume>, ResumeError> {

   let result = resume.validate()

   // do stuff

   Ok(Json(resume))
}
```

### Build manually

```rs
use serde_valid::Validate;

    let resume = json_resume_serde::Resume {
        basics: Some(json_resume_serde::Basics {
            //...
        }),
        work: vec![
            json_resume_serde::Work {
                // ...
            }
        ],
        volunteer: vec![],
        education: vec![],
        awards: vec![],
        certificates: vec![],
        publications: vec![],
        skills: vec![],
        languages: vec![],
        interests: vec![],
        references: vec![],
        projects: vec![],
    };

    resume.validate().unwrap();
```

## License

MIT
