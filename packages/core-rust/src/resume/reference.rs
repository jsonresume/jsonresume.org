use serde::{Deserialize, Serialize};
use serde_valid::Validate;

#[derive(Debug, Serialize, Deserialize, Validate)]
pub struct Reference {
    pub name: Option<String>,
    pub reference: Option<String>,
}
