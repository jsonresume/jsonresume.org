use serde::{Deserialize, Serialize};
use serde_valid::Validate;

mod award;
mod basics;
mod certificate;
mod education;
mod interest;
mod language;
mod project;
mod publication;
mod reference;
mod skill;
mod volunteer;
mod work;

pub use award::Award;
pub use basics::Basics;
pub use basics::Location;
pub use basics::Profile;
pub use certificate::Certificate;
pub use education::Education;
pub use interest::Interest;
pub use language::Language;
pub use project::Project;
pub use publication::Publication;
pub use reference::Reference;
pub use skill::Skill;
pub use volunteer::Volunteer;
pub use work::Work;

#[derive(Debug, Serialize, Deserialize, Validate)]
pub struct Resume {
    #[validate]
    pub basics: Option<Basics>,
    #[validate]
    pub work: Vec<Work>,
    #[validate]
    pub volunteer: Vec<Volunteer>,
    #[validate]
    pub education: Vec<Education>,
    #[validate]
    pub awards: Vec<Award>,
    #[validate]
    pub certificates: Vec<Certificate>,
    #[validate]
    pub publications: Vec<Publication>,
    #[validate]
    pub skills: Vec<Skill>,
    #[validate]
    pub languages: Vec<Language>,
    #[validate]
    pub interests: Vec<Interest>,
    #[validate]
    pub references: Vec<Reference>,
    #[validate]
    pub projects: Vec<Project>,
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::resume::{Basics, Resume};

    #[test]
    fn test_resume_validation() {
        let basics = Basics {
            name: Some("John Doe".to_string()),
            label: Some("Programmer".to_string()),
            image: Some("https://example.com/image.jpg".to_string()),
            email: Some("john.doe@example.com".to_string()),
            phone: Some("+1234567890".to_string()),
            url: Some("https://johndoe.com".to_string()),
            summary: Some("A passionate developer.".to_string()),
            location: None,
            profiles: vec![],
        };

        let resume = Resume {
            basics: Some(basics),
            work: vec![],
            volunteer: vec![],
            education: vec![],
            awards: vec![],
            certificates: vec![],
            publications: vec![],
            skills: vec![],
            languages: vec![],
            interests: vec![],
            references: vec![],
            projects: vec![],
        };

        // Validate the resume. This will return Result<(), ValidationErrors>
        let result = resume.validate();
        assert!(
            result.is_ok(),
            "Resume validation failed: {:?}",
            result.err()
        );
    }

    #[test]
    fn test_resume_validation_invalid() {
        let resume = Resume {
            basics: Some(Basics {
                name: Some("John Doe".to_string()),
                label: Some("Programmer".to_string()),
                image: Some("https://example.com/image.jpg".to_string()),
                email: Some("not-an-email".to_string()),
                phone: Some("+1234567890".to_string()),
                url: Some("https://johndoe.com".to_string()),
                summary: Some("A passionate developer.".to_string()),
                location: None,
                profiles: vec![],
            }),
            work: vec![],
            volunteer: vec![],
            education: vec![],
            awards: vec![],
            certificates: vec![],
            publications: vec![],
            skills: vec![],
            languages: vec![],
            interests: vec![],
            references: vec![],
            projects: vec![],
        };

        let result = resume.validate();
        assert!(result.is_err(), "Resume validation should fail");
    }
}
