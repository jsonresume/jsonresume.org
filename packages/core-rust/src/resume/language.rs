use serde::{Deserialize, Serialize};
use serde_valid::Validate;

#[derive(Debug, Serialize, Deserialize, Validate)]
pub struct Language {
    pub language: Option<String>,
    pub fluency: Option<String>,
}
