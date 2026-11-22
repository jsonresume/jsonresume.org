---
'@jsonresume/schema': minor
'@jsonresume/types': minor
---

Job schema: optional `compensation` (`min`, `max`, `currency` as ISO 4217, `period` one of `hour`, `day`, `week`, `month`, `year`) beside the display `salary` text (#319), and optional `facets`, the fixed vocabulary tools filter on: `remoteScope`, `remoteRegions`, `timezoneRange`, `seniority`, `employmentType`, `visaSponsorship` and `salaryProvenance`, each with `unspecified` for a post that doesn't say (#353). These are the values jsonresume.org's jobs pipeline already uses. Existing job documents stay valid.
