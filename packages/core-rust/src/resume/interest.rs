use serde::{Deserialize, Serialize};
use serde_valid::Validate;

#[derive(Debug, Serialize, Deserialize, Validate)]
pub struct Interest {
    pub name: Option<String>,
    pub keywords: Vec<String>,
}
