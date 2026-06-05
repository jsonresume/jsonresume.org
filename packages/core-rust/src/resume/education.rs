use crate::validation::{validate_date, validate_url};
use serde::{Deserialize, Serialize};
use serde_valid::Validate;

#[derive(Debug, Serialize, Deserialize, Validate)]
pub struct Education {
    pub institution: Option<String>,
    #[validate(custom = validate_url)]
    pub url: Option<String>,
    pub area: Option<String>,
    #[serde(rename = "studyType")]
    pub study_type: Option<String>,
    #[serde(rename = "startDate")]
    #[validate(custom = validate_date)]
    pub start_date: Option<String>,
    #[serde(rename = "endDate")]
    #[validate(custom = validate_date)]
    pub end_date: Option<String>,
    pub score: Option<String>,
    pub courses: Option<Vec<String>>,
}
