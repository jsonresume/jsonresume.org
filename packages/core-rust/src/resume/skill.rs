use crate::resume::common::{Custom, Extra};
use serde::{Deserialize, Serialize};
use serde_valid::Validate;

/// A skill (`skills[]`).
#[derive(Debug, Clone, Default, PartialEq, Serialize, Deserialize, Validate)]
#[serde(default)]
pub struct Skill {
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "name")]
    pub name: Option<String>,
    /// A short, stable identifier entries can use instead of the name.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "id")]
    pub id: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "level")]
    pub level: Option<String>,
    #[serde(skip_serializing_if = "Vec::is_empty")]
    #[serde(rename = "keywords")]
    pub keywords: Vec<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "custom")]
    pub custom: Option<Custom>,
    /// Properties this crate doesn't model, kept as they were.
    #[serde(flatten)]
    pub extra: Extra,
}

/// A skill an entry used (`work[].skills[]` and the like): the name or id of
/// a top-level skill, or a skill object for one grouped there.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize, Validate)]
#[serde(untagged)]
pub enum SkillReference {
    Name(String),
    Skill(#[validate] Skill),
}
