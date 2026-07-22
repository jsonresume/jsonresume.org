# @jsonresume/jobs

## 0.14.3

### Patch Changes

- fb57055: Remove unused dependencies flagged by knip (`async` from resume-cli, `@ai-sdk/anthropic` from @jsonresume/jobs). No runtime behavior change; slims the install footprint.

## 0.14.2

### Patch Changes

- 53fbe20: Fix inconsistent `job.location` typing in the job-search TUI. The registry API
  serves `location` as an object (`{ city, region, countryCode, ... }`) with
  remote status in a separate `remote` field, but the TUI remote filter treated
  `location` as a string (`/remote/i.test(j.location)`), which silently never
  matched against object locations. Added a shared `normalizeLocation()` helper
  that accepts both string and object shapes (the DB still holds some historic
  string rows) and is now used by both `formatters.js` and the TUI `useJobs`
  remote filter.
