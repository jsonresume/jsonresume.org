use serde::{Deserialize, Serialize};
use serde_valid::Validate;

mod award;
mod basics;
mod certificate;
pub(crate) mod common;
mod education;
mod interest;
mod language;
mod meta;
mod project;
mod publication;
mod reference;
mod skill;
mod volunteer;
mod work;

pub use award::Award;
pub use basics::{Basics, Location, Profile};
pub use certificate::Certificate;
pub use common::{Custom, Extra, Place};
pub use education::Education;
pub use interest::Interest;
pub use language::Language;
pub use meta::{Meta, Translation};
pub use project::Project;
pub use publication::Publication;
pub use reference::Reference;
pub use skill::Skill;
pub use volunteer::Volunteer;
pub use work::Work;

/// A JSON Resume document (packages/schema/SPEC.md). Every field is
/// optional, absent ones are left out when writing, and properties this
/// crate doesn't model are kept in `extra`.
#[derive(Debug, Clone, Default, PartialEq, Serialize, Deserialize, Validate)]
#[serde(default)]
pub struct Resume {
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "$schema")]
    pub schema: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[validate]
    #[serde(rename = "basics")]
    pub basics: Option<Basics>,
    /// A forward-looking career goal, distinct from `basics.summary`.
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "objective")]
    pub objective: Option<String>,
    #[serde(skip_serializing_if = "Vec::is_empty")]
    #[validate]
    #[serde(rename = "work")]
    pub work: Vec<Work>,
    #[serde(skip_serializing_if = "Vec::is_empty")]
    #[validate]
    #[serde(rename = "volunteer")]
    pub volunteer: Vec<Volunteer>,
    #[serde(skip_serializing_if = "Vec::is_empty")]
    #[validate]
    #[serde(rename = "education")]
    pub education: Vec<Education>,
    #[serde(skip_serializing_if = "Vec::is_empty")]
    #[validate]
    #[serde(rename = "awards")]
    pub awards: Vec<Award>,
    #[serde(skip_serializing_if = "Vec::is_empty")]
    #[validate]
    #[serde(rename = "certificates")]
    pub certificates: Vec<Certificate>,
    #[serde(skip_serializing_if = "Vec::is_empty")]
    #[validate]
    #[serde(rename = "publications")]
    pub publications: Vec<Publication>,
    #[serde(skip_serializing_if = "Vec::is_empty")]
    #[validate]
    #[serde(rename = "skills")]
    pub skills: Vec<Skill>,
    #[serde(skip_serializing_if = "Vec::is_empty")]
    #[validate]
    #[serde(rename = "languages")]
    pub languages: Vec<Language>,
    #[serde(skip_serializing_if = "Vec::is_empty")]
    #[validate]
    #[serde(rename = "interests")]
    pub interests: Vec<Interest>,
    #[serde(skip_serializing_if = "Vec::is_empty")]
    #[validate]
    #[serde(rename = "references")]
    pub references: Vec<Reference>,
    #[serde(skip_serializing_if = "Vec::is_empty")]
    #[validate]
    #[serde(rename = "projects")]
    pub projects: Vec<Project>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[validate]
    #[serde(rename = "meta")]
    pub meta: Option<Meta>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(rename = "custom")]
    pub custom: Option<Custom>,
    /// Properties this crate doesn't model, kept as they were.
    #[serde(flatten)]
    pub extra: Extra,
}

#[cfg(test)]
mod tests;
