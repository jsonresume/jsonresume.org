use super::*;
use serde_json::{Value, json};

const SAMPLE: &str = include_str!("../../../schema/sample.resume.json");
const EXAMPLES: [&str; 3] = [
    include_str!("../../../schema/examples/career-changer.resume.json"),
    include_str!("../../../schema/examples/new-grad.resume.json"),
    include_str!("../../../schema/examples/senior-engineer.resume.json"),
];

fn read(json: &str) -> Resume {
    serde_json::from_str(json).expect("a conforming document parses")
}

#[test]
fn reads_an_empty_document() {
    let resume = read("{}");
    assert_eq!(resume, Resume::default());
    assert!(resume.validate().is_ok());
    assert_eq!(serde_json::to_string(&resume).unwrap(), "{}");
}

#[test]
fn reads_validates_and_round_trips_the_schemas_samples() {
    for json in std::iter::once(SAMPLE).chain(EXAMPLES) {
        let resume = read(json);
        assert!(resume.validate().is_ok(), "{:?}", resume.validate().err());
        let original: Value = serde_json::from_str(json).unwrap();
        // Everything comes back, standard fields and unknown ones alike.
        assert_eq!(serde_json::to_value(&resume).unwrap(), original);
    }
}

#[test]
fn reads_the_fields_added_since_1_0() {
    let resume: Resume = serde_json::from_value(json!({
        "objective": "Senior backend role in climate tech",
        "work": [
            { "name": "Acme", "location": "Menlo Park, CA", "type": "contract",
              "keywords": ["Rust"] },
            { "type": "career-break", "startDate": "2021-03",
              "location": { "city": "Berlin", "countryCode": "DE" } }
        ],
        "certificates": [{ "credentialId": "X-1", "expiryDate": "2027-01" }],
        "references": [{ "availableOnRequest": true }],
        "publications": [{ "authors": ["Ada"], "identifiers": { "doi": "10.1/x" } }],
        "meta": { "language": "pt-BR", "theme": "even",
                  "translations": [{ "language": "en", "url": "https://a.co/en.json" }] },
        "custom": { "myTool": { "id": 7 } }
    }))
    .unwrap();
    assert!(resume.validate().is_ok());
    assert_eq!(
        resume.work[0].location,
        Some(Place::Text("Menlo Park, CA".into()))
    );
    assert_eq!(resume.work[1].kind.as_deref(), Some("career-break"));
    let meta = resume.meta.as_ref().unwrap();
    assert_eq!(meta.language.as_deref(), Some("pt-BR"));
    assert_eq!(meta.extra.get("theme"), Some(&json!("even")));
    assert_eq!(resume.references[0].available_on_request, Some(true));
}

#[test]
fn rejects_what_the_schema_rejects() {
    let bad_email: Resume =
        serde_json::from_value(json!({ "basics": { "email": "not-an-email" } })).unwrap();
    assert!(bad_email.validate().is_err());
    let bad_date: Resume =
        serde_json::from_value(json!({ "work": [{ "startDate": "May 2020" }] })).unwrap();
    assert!(bad_date.validate().is_err());
    let bad_country: Resume = serde_json::from_value(
        json!({ "education": [{ "location": { "countryCode": "Germany" } }] }),
    )
    .unwrap();
    assert!(bad_country.validate().is_err());
    // A defined field with another type doesn't parse.
    assert!(serde_json::from_value::<Resume>(json!({ "work": [{ "type": 3 }] })).is_err());
}

#[test]
fn names_each_error_by_its_json_path() {
    let resume: Resume = serde_json::from_value(
        json!({ "basics": { "email": "nope" }, "work": [{ "startDate": "x" }] }),
    )
    .unwrap();
    let errors = serde_json::to_value(resume.validate().unwrap_err()).unwrap();
    assert!(
        errors
            .pointer("/properties/basics/properties/email")
            .is_some()
    );
    assert!(
        errors
            .pointer("/properties/work/items/0/properties/startDate")
            .is_some()
    );
}
