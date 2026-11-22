use crate::resume::common::Extra;
use crate::validation::validate_url;
use serde::{Deserialize, Serialize};
use serde_valid::Validate;

/// About the document, not the person (`meta`). Tools keep their own
/// settings here too, such as `theme`; they stay in `extra`.
#[derive(Debug, Clone, Default, PartialEq, Serialize, Deserialize, Validate)]
#[serde(default)]
pub struct Meta {
    #[serde(skip_serializing_if = "Option::is_none")]
    #[validate(custom = validate_url)]
    #[serde(rename = "canonical")]
    pub canonical: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "version")]
    pub version: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "lastModified")]
    pub last_modified: Option<String>,
    /// The language the document is written in, a BCP 47 tag.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "language")]
    pub language: Option<String>,
    /// The same resume in other languages, one document each.
    #[serde(skip_serializing_if = "Vec::is_empty")]
    #[validate]
    #[serde(rename = "translations")]
    pub translations: Vec<Translation>,
    #[serde(flatten)]
    pub extra: Extra,
}

/// Another language's document (`meta.translations[]`).
#[derive(Debug, Clone, Default, PartialEq, Serialize, Deserialize, Validate)]
#[serde(default)]
pub struct Translation {
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "language")]
    pub language: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[validate(custom = validate_url)]
    #[serde(rename = "url")]
    pub url: Option<String>,
    #[serde(flatten)]
    pub extra: Extra,
}
