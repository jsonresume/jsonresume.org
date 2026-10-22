---
'@jsonresume/schema': minor
'@jsonresume/types': minor
---

Consolidate location into a shared definition (#323).

`basics.location` was a structured object, `work.location` a plain string, and volunteer and education had no location at all. There is now one shared `location` object (address, postalCode, city, countryCode, region):

- `basics.location` uses it (unchanged shape)
- `work.location` accepts either the existing free-text string (e.g. "Palo Alto, CA") or the object
- `volunteer.location` and `education.location` are new, optional, and accept the same string-or-object forms

Existing resumes stay valid. Consumers that need uniform processing should normalise the string form; themes receive display strings via `withStringLocations` in the registry and resume-cli.
