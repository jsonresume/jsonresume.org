---
'@jsonresume/schema': minor
---

Consolidate location into a shared definition used across all sections.

The schema previously defined location inconsistently: basics.location was a structured object, work.location was a plain string, and volunteer and education had no location at all. This made it impossible to query or process locations uniformly across a resume.

All sections now use the same structured location object with address, postalCode, city, countryCode, and region fields. Volunteer and education gain a new optional location field, while work.location remains backwards compatible and accepts either a freetext string like "Palo Alto, CA" or an object.
