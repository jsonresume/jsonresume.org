# @jsonresume/ats-validator

## 0.2.0

### Minor Changes

- 8d6ffd8: Add two ATS-friendliness checks: Contact Information (verifies an email and phone exist as selectable text or `mailto:`/`tel:` links, not just inside images) and Special Characters (flags icon fonts, Private Use Area glyphs, and excessive emoji that ATS parsers cannot extract). Standard punctuation like bullets and dashes is intentionally not flagged.
