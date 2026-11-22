use crate::validation::validate_url;
use serde::{Deserialize, Serialize};
use serde_valid::Validate;

use crate::resume::common::Extra;

#[derive(Debug, Clone, Default, PartialEq, Serialize, Deserialize, Validate)]
#[serde(default)]
pub struct Profile {
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "network")]
    pub network: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "username")]
    pub username: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[validate(custom = validate_url)]
    #[serde(rename = "url")]
    pub url: Option<String>,
    #[serde(flatten)]
    pub extra: Extra,
}
