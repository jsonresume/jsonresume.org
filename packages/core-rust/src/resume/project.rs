use crate::validation::{validate_date, validate_url};
use serde::{Deserialize, Serialize};
use serde_valid::Validate;

#[derive(Debug, Serialize, Deserialize, Validate)]
pub struct Project {
    pub name: Option<String>,
    pub description: Option<String>,
    pub highlights: Vec<String>,
    pub keywords: Vec<String>,
    #[validate(custom = validate_date)]
    #[serde(rename = "startDate")]
    pub start_date: Option<String>,
    #[validate(custom = validate_date)]
    #[serde(rename = "endDate")]
    pub end_date: Option<String>,
    pub roles: Vec<String>,
    #[validate(custom = validate_url)]
    pub url: Option<String>,
    pub entity: Option<String>,
    #[serde(rename = "type")]
    pub kind: Option<String>,
}
