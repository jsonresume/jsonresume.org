use crate::resume::common::{Custom, Extra};
use crate::validation::{validate_date, validate_url};
use serde::{Deserialize, Serialize};
use serde_valid::Validate;

/// A certificate (`certificates[]`).
#[derive(Debug, Clone, Default, PartialEq, Serialize, Deserialize, Validate)]
#[serde(default)]
pub struct Certificate {
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "name")]
    pub name: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[validate(custom = validate_date)]
    #[serde(rename = "date")]
    pub date: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[validate(custom = validate_url)]
    #[serde(rename = "url")]
    pub url: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "credentialId")]
    pub credential_id: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "issuer")]
    pub issuer: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[validate(custom = validate_date)]
    #[serde(rename = "expiryDate")]
    pub expiry_date: Option<String>,
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
