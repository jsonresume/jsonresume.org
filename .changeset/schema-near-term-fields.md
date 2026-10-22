---
'@jsonresume/schema': minor
'@jsonresume/types': minor
---

New optional fields, all additive:

- `work[].keywords`: skills or technologies used in the role (#293)
- `education[].summary`: thesis, honours or other context (#292)
- `certificates[].expiryDate`: when a certificate lapses; omit if it doesn't expire (#307)
- `publications[].type`: e.g. article, book, patent, thesis, talk (#295)

The sample resume now includes a certificate and uses each new field (#294).
