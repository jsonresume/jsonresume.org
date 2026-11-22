---
'@jsonresume/schema': minor
'@jsonresume/types': minor
---

Add `languages[].scale` (`{ framework, level }`, such as CEFR C1) beside the free-text `fluency` (#315), and `skills[].id` with optional `skills` lists on `work`, `volunteer`, `education` and `projects`, holding skill names, ids or skill objects (#313). Every resume that validated before still validates.
