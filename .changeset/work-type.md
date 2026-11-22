---
'@jsonresume/schema': minor
'@jsonresume/types': minor
---

Add optional `work[].type`: how a role was held, as free text. Recommended values are `full-time`, `part-time`, `contract`, `freelance`, `internship` and `temporary`, and they combine ("part-time contract"). It describes past roles, not what someone is looking for. It must be a string: a resume that already put a non-string value under `work[].type` (allowed before as an extra field), such as an array, no longer validates and should join the values into one string, e.g. `"part-time contract"`.
