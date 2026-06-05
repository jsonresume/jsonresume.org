use email_address::EmailAddress;
use serde_valid::validation::Error;
use url::Url;

// Validates that a string is a well-formed URL (RFC 3986).
pub fn validate_url(value: &Option<String>) -> Result<(), Error> {
    if let Some(url_str) = value {
        Url::parse(url_str)
            .map(|_| ())
            .map_err(|_| Error::Custom("must be a valid URL (RFC 3986)".to_string()))
    } else {
        Ok(())
    }
}

// Validates country code as per ISO-3166-1 ALPHA-2, e.g. US, AU, IN
pub fn validate_country_code(value: &Option<String>) -> Result<(), Error> {
    if let Some(country_code) = value {
        let re = regex::Regex::new(r"^[A-Z]{2}$").unwrap();
        if re.is_match(country_code) {
            Ok(())
        } else {
            Err(Error::Custom(
                "must be a valid country code as per ISO-3166-1 ALPHA-2, e.g. US, AU, IN"
                    .to_string(),
            ))
        }
    } else {
        Ok(())
    }
}

pub fn validate_email(value: &Option<String>) -> Result<(), Error> {
    if let Some(email) = value {
        if EmailAddress::is_valid(email) {
            Ok(())
        } else {
            Err(Error::Custom("must be a valid email address".to_string()))
        }
    } else {
        Ok(())
    }
}

pub fn validate_date(value: &Option<String>) -> Result<(), Error> {
    if let Some(date_str) = value {
        // Pattern: YYYY or YYYY-MM or YYYY-MM-DD
        let re =
            regex::Regex::new(r"^[1-9]\d{3}(?:-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12]\d|3[01]))?)?$")
                .unwrap();
        if re.is_match(date_str) {
            Ok(())
        } else {
            Err(Error::Custom(
                "must be a valid ISO8601 date: YYYY, YYYY-MM, or YYYY-MM-DD".to_string(),
            ))
        }
    } else {
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_url_validation_valid_urls() {
        let valid_urls = vec![
            "https://www.example.com",
            "http://example.com",
            "https://example.com/path",
            "https://example.com/path?param=value",
            "https://example.com/path#fragment",
            "https://subdomain.example.com",
            "https://example.com:8080",
        ];

        for url in valid_urls {
            let url_str = Some(url.to_string());

            assert!(
                validate_url(&url_str).is_ok(),
                "URL '{url}' should be valid",
            );
        }
    }

    #[test]
    fn test_url_validation_invalid_urls() {
        let invalid_urls = vec![
            "not-a-url",      // No scheme
            "http://",        // Missing host
            "https://",       // Missing host
            "ftp://",         // Missing host
            "://example.com", // Missing scheme
            //"http://example",      // Invalid TLD @TODO: this is considered valid by url crate
            //"http://.com",         // Missing hostname @TODO: this is considered valid by url crate
            //"http://example..com", // Double dots @TODO: this is considered valid by url crate
            "http://example.com:abc",   // Invalid port
            "http://example.com:99999", // Port out of range
            "",                         // Empty string
        ];

        for url in invalid_urls {
            let url_str = Some(url.to_string());

            assert!(
                validate_url(&url_str).is_err(),
                "URL '{url}' should be invalid",
            );
        }
    }

    #[test]
    fn test_url_validation_none() {
        let url = None;

        // None should be valid since it's optional
        assert!(validate_url(&url).is_ok(), "None URL should be valid");
    }

    #[test]
    fn test_email_validation_valid_emails() {
        let valid_emails = vec![
            "user@example.com",
            "user.name@example.com",
            "user+tag@example.com",
            "user123@example.com",
            "user@subdomain.example.com",
            "user@example.co.uk",
            "user@example-domain.com",
            "user@example.com",
            "user@example.org",
            "user@example.net",
        ];

        for email in valid_emails {
            let email_str = Some(email.to_string());

            assert!(
                validate_email(&email_str).is_ok(),
                "Email '{email}' should be valid",
            );
        }
    }

    #[test]
    fn test_email_validation_invalid_emails() {
        let invalid_emails = vec![
            "not-an-email", // No @ symbol
            "@example.com", // Missing local part
            "user@",        // Missing domain
            "user@.com",    // Missing domain name
            //"user@example",        // Missing TLD @TODO: this is considered valid by email_address crate
            "user..name@example.com", // Double dots in local part
            "user@example..com",      // Double dots in domain
            "user@example.com.",      // Trailing dot
            ".user@example.com",      // Leading dot
            "user name@example.com",  // Space in local part
            "user@example com",       // Space in domain
            "user@@example.com",      // Double @
            "",                       // Empty string
        ];

        for email in invalid_emails {
            let email_str = Some(email.to_string());

            assert!(
                validate_email(&email_str).is_err(),
                "Email '{email}' should be invalid",
            );
        }
    }

    #[test]
    fn test_email_validation_none() {
        let email = None;

        // None should be valid since it's optional
        assert!(validate_email(&email).is_ok(), "None email should be valid");
    }

    #[test]
    fn test_date_validation_valid_dates() {
        let valid_dates = vec![
            // YYYY format
            "2023",
            "1990",
            "2050",
            "1000",
            "2999",
            // YYYY-MM format
            "2023-01",
            "2023-12",
            "1990-06",
            "2050-03",
            // YYYY-MM-DD format
            "2023-01-01",
            "2023-12-31",
            "1990-06-15",
            "2050-03-20",
            "2023-02-28", // February (non-leap year)
            "2024-02-29", // February (leap year)
        ];

        for date in valid_dates {
            let date_str = Some(date.to_string());

            assert!(
                validate_date(&date_str).is_ok(),
                "Date '{date}' should be valid",
            );
        }
    }

    #[test]
    fn test_date_validation_invalid_dates() {
        let invalid_dates = vec![
            // Invalid formats
            "202",        // Too short
            "20234",      // Too long
            "2023-1",     // Missing leading zero in month
            "2023-13",    // Invalid month
            "2023-00",    // Zero month
            "2023-01-1",  // Missing leading zero in day
            "2023-01-32", // Invalid day @TODO
            "2023-01-00", // Zero day @TODO
            //"2023-02-30",    // February 30th (invalid) @TODO : improve regex
            //"2023-04-31",    // April 31st (invalid) @TODO : improve regex
            //"2023-06-31",    // June 31st (invalid) @TODO : improve regex
            //"2023-09-31",    // September 31st (invalid) @TODO : improve regex
            //"2023-11-31",    // November 31st (invalid) @TODO : improve regex
            //"2024-02-30",    // February 30th in leap year (still invalid) @TODO : improve regex

            // Malformed strings
            "2023/01/01",  // Wrong separator
            "01-01-2023",  // Wrong order
            "2023-01-01T", // Extra characters
            "2023-01-01 ", // Trailing space
            " 2023-01-01", // Leading space
            "",            // Empty string
            "abc",         // Non-numeric
            "2023-abc-01", // Non-numeric month
            "2023-01-abc", // Non-numeric day
        ];

        for date in invalid_dates {
            let date_str = Some(date.to_string());

            assert!(
                validate_date(&date_str).is_err(),
                "Date '{date}' should be invalid",
            );
        }
    }

    #[test]
    fn test_date_validation_none() {
        let date = None;

        // None should be valid since it's optional
        assert!(validate_date(&date).is_ok(), "None date should be valid");
    }

    #[test]
    fn test_country_code_validation_valid_codes() {
        let valid_codes = vec!["US", "CA", "GB", "FR", "DE", "JP", "AU", "BR", "IN", "CN"];

        for code in valid_codes {
            let country_code = Some(code.to_string());

            assert!(
                validate_country_code(&country_code).is_ok(),
                "Country code '{code}' should be valid",
            );
        }
    }

    #[test]
    fn test_country_code_validation_invalid_codes() {
        let invalid_codes = vec![
            "USA", // Too long
            "u",   // Too short
            "us",  // Lowercase
            "Us",  // Mixed case
            "12",  // Numbers
            "A1",  // Mixed alphanumeric
            "",    // Empty string
        ];

        for code in invalid_codes {
            let country_code = Some(code.to_string());

            assert!(
                validate_country_code(&country_code).is_err(),
                "Country code '{code}' should be invalid",
            );
        }
    }

    #[test]
    fn test_country_code_validation_none() {
        let country_code = None;

        // None should be valid since it's optional
        assert!(
            validate_country_code(&country_code).is_ok(),
            "None country_code should be valid"
        );
    }
}
