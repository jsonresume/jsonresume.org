use crate::resume::common::{Custom, Extra};
use crate::validation::validate_date;
use serde::{Deserialize, Serialize};
use serde_valid::Validate;

/// A reference (`references[]`). There are deliberately no contact fields.
#[derive(Debug, Clone, Default, PartialEq, Serialize, Deserialize, Validate)]
#[serde(default)]
pub struct Reference {
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "name")]
    pub name: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "reference")]
    pub reference: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "relationship")]
    pub relationship: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "organization")]
    pub organization: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[validate(custom = validate_date)]
    #[serde(rename = "date")]
    pub date: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "availableOnRequest")]
    pub available_on_request: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "custom")]
    pub custom: Option<Custom>,
    /// Properties this crate doesn't model, kept as they were.
    #[serde(flatten)]
    pub extra: Extra,
}
