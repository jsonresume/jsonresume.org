use crate::resume::Location;
use serde::{Deserialize, Serialize};
use serde_json::{Map, Value};
use serde_valid::Validate;

/// Properties this crate has no field for, kept so a document read and
/// written again loses nothing (SPEC.md §7).
pub type Extra = Map<String, Value>;

/// Tool- or author-specific data with no standard field (`custom`, SPEC.md §6).
pub type Custom = Map<String, Value>;

/// Where an entry was: a location object, or free text ("Menlo Park, CA"),
/// as `work`, `volunteer` and `education` allow.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize, Validate)]
#[serde(untagged)]
pub enum Place {
    Text(String),
    Structured(#[validate] Location),
}
