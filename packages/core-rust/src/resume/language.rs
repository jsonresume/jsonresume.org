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
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "custom")]
    pub custom: Option<Custom>,
    /// Properties this crate doesn't model, kept as they were.
    #[serde(flatten)]
    pub extra: Extra,
}
