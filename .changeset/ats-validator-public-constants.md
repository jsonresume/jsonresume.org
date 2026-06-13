---
'@jsonresume/ats-validator': minor
---

Promote internal pure pieces to the public API for reuse by library authors:

- Export `getGrade` from the package root (maps a 0-100 score to an A-F letter grade).
- Add a new `@jsonresume/ats-validator/constants` subpath exporting the reusable tables and regexes used by the checks: `ATS_FRIENDLY_FONTS`, `ATS_BAD_FONTS`, `ICON_FONT_TOKENS`, `ICON_FONT_FAMILIES`, `EMOJI_RE`, `PRIVATE_USE_RE`, `EMAIL_RE`, `PHONE_RE`, and the `countDigits` helper.

`validateATS` and `getRecommendations` are unchanged. The constants are re-exported from the existing check modules, so they never drift from what the validator actually uses.
