use crate::resume::common::{Custom, Extra};
use crate::validation::{validate_date, validate_url};
use serde::{Deserialize, Serialize};
use serde_valid::Validate;
use std::collections::BTreeMap;

/// A publication or talk (`publications[]`). `kind` is `type`.
#[derive(Debug, Clone, Default, PartialEq, Serialize, Deserialize, Validate)]
#[serde(default)]
pub struct Publication {
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "name")]
    pub name: Option<String>,
    #[serde(skip_serializing_if = "Vec::is_empty")]
    #[serde(rename = "authors")]
    pub authors: Vec<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "publisher")]
    pub publisher: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[validate(custom = validate_date)]
    #[serde(rename = "releaseDate")]
    pub release_date: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "volume")]
    pub volume: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "issue")]
    pub issue: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "pages")]
    pub pages: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "identifiers")]
    pub identifiers: Option<BTreeMap<String, String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[validate(custom = validate_url)]
    #[serde(rename = "url")]
    pub url: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "summary")]
    pub summary: Option<String>,
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
