use crate::validation::{validate_email, validate_url};
use serde::{Deserialize, Serialize};
use serde_valid::Validate;

mod location;
mod profile;

pub use location::Location;
pub use profile::Profile;

#[derive(Debug, Serialize, Deserialize, Validate)]
pub struct Basics {
    pub name: Option<String>,
    pub label: Option<String>,
    #[validate(custom = validate_url)]
    pub image: Option<String>,
    #[validate(custom = validate_email)]
    pub email: Option<String>,
    pub phone: Option<String>,
    #[validate(custom = validate_url)]
    pub url: Option<String>,
    pub summary: Option<String>,
    pub location: Option<Location>,
    pub profiles: Vec<Profile>,
}
