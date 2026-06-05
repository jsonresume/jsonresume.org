# json-resume

A Rust implementation of the [JSON Resume schema](https://github.com/jsonresume/resume-schema/blob/master/schema.json) with Serde and Validate support for serialization and deserialization.

## Usage

### From Serialized JSON
```rs
use serde_valid::Validate;

#[axum::debug_handler]
async fn post(Json(resume): Json<json_resume::Resume>) -> Result<Json<Resume>, ResumeError> {

   let result = resume.validate()

   // do stuff

   Ok(Json(resume))
}
```

### Build manually
```rs
use serde_valid::Validate;

    let resume = json_resume::Resume {
        basics: Some(json_resume::Basics {
            //...
        }),
        work: vec![
            json_resume::Work {
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
