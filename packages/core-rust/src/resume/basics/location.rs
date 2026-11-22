use crate::validation::validate_country_code;
use serde::{Deserialize, Serialize};
use serde_valid::Validate;

use crate::resume::common::Extra;

#[derive(Debug, Clone, Default, PartialEq, Serialize, Deserialize, Validate)]
#[serde(default)]
pub struct Location {
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "address")]
    pub address: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "postalCode")]
    pub postal_code: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "city")]
    pub city: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[validate(custom = validate_country_code)]
    #[serde(rename = "countryCode")]
    pub country_code: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "region")]
    pub region: Option<String>,
    #[serde(flatten)]
    pub extra: Extra,
}
