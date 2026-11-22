use crate::resume::common::{Custom, Extra};
use serde::{Deserialize, Serialize};
use serde_valid::Validate;

/// A language spoken (`languages[]`).
#[derive(Debug, Clone, Default, PartialEq, Serialize, Deserialize, Validate)]
#[serde(default)]
pub struct Language {
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "language")]
    pub language: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "fluency")]
    pub fluency: Option<String>,
    /// The level on a published scale, for tools; `fluency` is the label.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "scale")]
    pub scale: Option<Scale>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "custom")]
    pub custom: Option<Custom>,
    /// Properties this crate doesn't model, kept as they were.
    #[serde(flatten)]
    pub extra: Extra,
}

/// A level on a published proficiency scale (`languages[].scale`):
/// `{ "framework": "CEFR", "level": "C1" }`. Both are free text.
#[derive(Debug, Clone, Default, PartialEq, Serialize, Deserialize, Validate)]
#[serde(default)]
pub struct Scale {
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "framework")]
    pub framework: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "level")]
    pub level: Option<String>,
    /// Properties this crate doesn't model, kept as they were.
    #[serde(flatten)]
    pub extra: Extra,
}
