use crate::validation::validate_date;
use serde::{Deserialize, Serialize};
use serde_valid::Validate;

#[derive(Debug, Serialize, Deserialize, Validate)]
pub struct Award {
    pub title: Option<String>,
    #[validate(custom = validate_date)]
    pub date: Option<String>,
    pub awarder: Option<String>,
    pub summary: Option<String>,
}
