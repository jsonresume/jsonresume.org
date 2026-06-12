use crate::validation::validate_url;
use serde::{Deserialize, Serialize};
use serde_valid::Validate;

#[derive(Debug, Serialize, Deserialize, Validate)]
pub struct Profile {
    pub network: Option<String>,
    pub username: Option<String>,
    #[validate(custom = validate_url)]
    pub url: Option<String>,
}
