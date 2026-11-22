use crate::resume::common::{Custom, Extra};
use crate::validation::validate_date;
use serde::{Deserialize, Serialize};
use serde_valid::Validate;

/// An award (`awards[]`).
#[derive(Debug, Clone, Default, PartialEq, Serialize, Deserialize, Validate)]
#[serde(default)]
pub struct Award {
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "title")]
    pub title: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[validate(custom = validate_date)]
    #[serde(rename = "date")]
    pub date: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "awarder")]
    pub awarder: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "summary")]
    pub summary: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "custom")]
    pub custom: Option<Custom>,
    /// Properties this crate doesn't model, kept as they were.
    #[serde(flatten)]
    pub extra: Extra,
}
