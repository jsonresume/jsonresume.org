---
'@jsonresume/ats-validator': minor
---

Add two ATS-friendliness checks: Contact Information (verifies an email and phone exist as selectable text or `mailto:`/`tel:` links, not just inside images) and Special Characters (flags icon fonts, Private Use Area glyphs, and excessive emoji that ATS parsers cannot extract). Standard punctuation like bullets and dashes is intentionally not flagged.
