//! The schema's conformance suite (packages/schema/conformance): every resume
//! case the manifest calls valid parses, validates and round-trips; every one
//! it calls invalid is refused, by parsing or by validation.
use super::*;
use serde_json::Value;
use std::path::{Path, PathBuf};

fn suite() -> PathBuf {
    Path::new(env!("CARGO_MANIFEST_DIR")).join("../schema/conformance")
}

fn read(path: &Path) -> String {
    std::fs::read_to_string(path).unwrap_or_else(|e| panic!("{}: {e}", path.display()))
}

#[test]
fn passes_the_conformance_suite() {
    let manifest: Value = serde_json::from_str(&read(&suite().join("manifest.json"))).unwrap();
    let cases = manifest["cases"].as_array().expect("cases");
    let mut checked = 0;
    for case in cases.iter().filter(|c| c["schema"] == "resume") {
        let file = case["file"].as_str().expect("file");
        let valid = case["valid"].as_bool().expect("valid");
        let json = read(&suite().join(file));
        let parsed = serde_json::from_str::<Resume>(&json);
        if valid {
            let resume = parsed.unwrap_or_else(|e| panic!("{file} should parse: {e}"));
            assert!(
                resume.validate().is_ok(),
                "{file}: {:?}",
                resume.validate().err()
            );
            let original: Value = serde_json::from_str(&json).unwrap();
            assert_eq!(
                serde_json::to_value(&resume).unwrap(),
                original,
                "{file} round-trips"
            );
        } else {
            let refused = match parsed {
                Err(_) => true,
                Ok(resume) => resume.validate().is_err(),
            };
            assert!(refused, "{file} should be refused: {}", case["description"]);
        }
        checked += 1;
    }
    assert!(checked > 20, "only {checked} resume cases");
}
