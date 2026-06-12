use serde::{Deserialize, Serialize};
use serde_valid::Validate;

#[derive(Debug, Serialize, Deserialize, Validate)]
pub struct Skill {
    pub name: Option<String>,
    pub level: Option<String>,
    pub keywords: Vec<String>,
}
