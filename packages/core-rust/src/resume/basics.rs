use crate::resume::common::{Custom, Extra};
use crate::validation::{validate_email, validate_url};
use serde::{Deserialize, Serialize};
use serde_valid::Validate;

mod location;
mod profile;

pub use location::Location;
pub use profile::Profile;

/// The person (`basics`).
#[derive(Debug, Clone, Default, PartialEq, Serialize, Deserialize, Validate)]
#[serde(default)]
pub struct Basics {
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "name")]
    pub name: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "label")]
    pub label: Option<String>,
    /// A URL to a photo; not validated, as the schema gives it no format.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "image")]
    pub image: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[validate(custom = validate_email)]
    #[serde(rename = "email")]
    pub email: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "phone")]
    pub phone: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[validate(custom = validate_url)]
    #[serde(rename = "url")]
    pub url: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "summary")]
    pub summary: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[validate]
    #[serde(rename = "location")]
    pub location: Option<Location>,
    #[serde(skip_serializing_if = "Vec::is_empty")]
    #[validate]
    #[serde(rename = "profiles")]
    pub profiles: Vec<Profile>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "custom")]
    pub custom: Option<Custom>,
    /// Properties this crate doesn't model, kept as they were.
    #[serde(flatten)]
    pub extra: Extra,
}
