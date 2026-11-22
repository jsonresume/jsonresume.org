use crate::resume::common::{Custom, Extra, Place};
use crate::validation::{validate_date, validate_url};
use serde::{Deserialize, Serialize};
use serde_valid::Validate;

/// A course of study (`education[]`).
#[derive(Debug, Clone, Default, PartialEq, Serialize, Deserialize, Validate)]
#[serde(default)]
pub struct Education {
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "institution")]
    pub institution: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[validate]
    #[serde(rename = "location")]
    pub location: Option<Place>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[validate(custom = validate_url)]
    #[serde(rename = "url")]
    pub url: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "area")]
    pub area: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "studyType")]
    pub study_type: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[validate(custom = validate_date)]
    #[serde(rename = "startDate")]
    pub start_date: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[validate(custom = validate_date)]
    #[serde(rename = "endDate")]
    pub end_date: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "score")]
    pub score: Option<String>,
    #[serde(skip_serializing_if = "Vec::is_empty")]
    #[serde(rename = "courses")]
    pub courses: Vec<String>,
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
