use crate::validation::{validate_date, validate_url};
use serde::{Deserialize, Serialize};
use serde_valid::Validate;

#[derive(Debug, Serialize, Deserialize, Validate)]
pub struct Certificate {
    pub name: Option<String>,
    #[validate(custom = validate_date)]
    pub date: Option<String>,
    pub issuer: Option<String>,
    #[validate(custom = validate_url)]
    pub url: Option<String>,
}
