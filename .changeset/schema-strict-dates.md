---
'@jsonresume/schema': patch
---

- iso8601 dates reject impossible months and days (e.g. `2013-19-39`, `2013-00`); every real calendar date is still accepted
- `validate()` reports an error for input that is not a JSON object (`undefined`, `null`, strings, arrays) instead of calling it valid
