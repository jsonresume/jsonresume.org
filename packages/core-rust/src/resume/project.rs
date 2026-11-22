use crate::resume::common::{Custom, Extra};
use crate::validation::{validate_date, validate_url};
use serde::{Deserialize, Serialize};
use serde_valid::Validate;

/// A project (`projects[]`). `description` is a deprecated alias of `summary`; `kind` is `type`.
#[derive(Debug, Clone, Default, PartialEq, Serialize, Deserialize, Validate)]
#[serde(default)]
pub struct Project {
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "name")]
    pub name: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "summary")]
    pub summary: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "description")]
    pub description: Option<String>,
    #[serde(skip_serializing_if = "Vec::is_empty")]
    #[serde(rename = "highlights")]
    pub highlights: Vec<String>,
    #[serde(skip_serializing_if = "Vec::is_empty")]
    #[serde(rename = "keywords")]
    pub keywords: Vec<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[validate(custom = validate_date)]
    #[serde(rename = "startDate")]
    pub start_date: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[validate(custom = validate_date)]
    #[serde(rename = "endDate")]
    pub end_date: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[validate(custom = validate_url)]
    #[serde(rename = "url")]
    pub url: Option<String>,
    #[serde(skip_serializing_if = "Vec::is_empty")]
    #[serde(rename = "roles")]
    pub roles: Vec<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "entity")]
    pub entity: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "type")]
    pub kind: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "custom")]
    pub custom: Option<Custom>,
    /// Properties this crate doesn't model, kept as they were.
    #[serde(flatten)]
    pub extra: Extra,
}
