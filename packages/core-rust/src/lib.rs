//! JSON Resume documents in Rust, with serde and validation.
//!
//! Follows JSON Resume 1.x as `packages/schema/SPEC.md` describes it:
//! every field optional, conventions validated, unknown properties kept.

mod resume;
mod validation;

pub use resume::{
    Award, Basics, Certificate, Custom, Education, Extra, Interest, Language, Location, Meta,
    Place, Profile, Project, Publication, Reference, Resume, Skill, Translation, Volunteer, Work,
};
