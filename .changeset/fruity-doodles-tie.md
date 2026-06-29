---
'@jsonresume/schema': major
---

Consolidate location into a shared definition used across all sections.

The schema previously defined location inconsistently: basics.location was a structured object, work.location was a plain string, and volunteer and education had no location at all. This made it impossible to query or process locations uniformly across a resume.

All sections now use the same structured location object with address, postalCode, city, countryCode, and region fields. Volunteer and education gain a new optional location field.

This is a breaking change for work.location, which was previously a freetext string like "Palo Alto, CA" and is now an object. We chose a clean break over a deprecation path because JSON Schema has no mechanism to enforce deprecation warnings, and introducing a synonym field would have created permanent ambiguity about which field to use.

To migrate, replace work.location strings with the structured form:

Before: { "location": "Palo Alto, CA" }
After: { "location": { "city": "Palo Alto", "region": "California", "countryCode": "US" } }
