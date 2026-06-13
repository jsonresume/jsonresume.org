use crate::validation::validate_country_code;
use serde::{Deserialize, Serialize};
use serde_valid::Validate;

#[derive(Debug, Serialize, Deserialize, Validate)]
pub struct Location {
    pub address: Option<String>,
    #[serde(rename = "postalCode")]
    pub postal_code: Option<String>,
    pub city: Option<String>,
    #[serde(rename = "countryCode")]
    #[validate(custom = validate_country_code)]
    pub country_code: Option<String>,
    pub region: Option<String>,
}
