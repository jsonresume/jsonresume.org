use crate::validation::{validate_date, validate_url};
use serde::{Deserialize, Serialize};
use serde_valid::Validate;

#[derive(Debug, Serialize, Deserialize, Validate)]
pub struct Publication {
    pub name: Option<String>,
    pub publisher: Option<String>,
    #[serde(rename = "releaseDate")]
    #[validate(custom = validate_date)]
    pub release_date: Option<String>,
    #[validate(custom = validate_url)]
    pub url: Option<String>,
    pub summary: Option<String>,
}
