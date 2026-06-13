# @jsonresume/ats-validator

## 0.3.0

### Minor Changes

- fa27450: Promote internal pure pieces to the public API for reuse by library authors:

  - Export `getGrade` from the package root (maps a 0-100 score to an A-F letter grade).
  - Add a new `@jsonresume/ats-validator/constants` subpath exporting the reusable tables and regexes used by the checks: `ATS_FRIENDLY_FONTS`, `ATS_BAD_FONTS`, `ICON_FONT_TOKENS`, `ICON_FONT_FAMILIES`, `EMOJI_RE`, `PRIVATE_USE_RE`, `EMAIL_RE`, `PHONE_RE`, and the `countDigits` helper.

  `validateATS` and `getRecommendations` are unchanged. The constants are re-exported from the existing check modules, so they never drift from what the validator actually uses.

## 0.2.0

### Minor Changes

- 8d6ffd8: Add two ATS-friendliness checks: Contact Information (verifies an email and phone exist as selectable text or `mailto:`/`tel:` links, not just inside images) and Special Characters (flags icon fonts, Private Use Area glyphs, and excessive emoji that ATS parsers cannot extract). Standard punctuation like bullets and dashes is intentionally not flagged.
