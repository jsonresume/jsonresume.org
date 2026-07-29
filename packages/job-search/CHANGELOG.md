# @jsonresume/jobs

## 0.15.0

### Minor Changes

- 8d9134b: Tier-based match experience: the TUI now groups jobs into Strong/Good/Stretch bands with colored tier chips (raw cosine numbers retired from the list), shows a grounded "Why: …" line per match in the detail pane, a "N jobs · X strong · Z new since last visit" digest header, and honest empty states that name the filters that eliminated everything. Server-side (registry): hybrid vector+full-text retrieval fused with RRF, listwise tiers + grounded reasons from the reranker, and Rocchio relevance feedback so interested/applied marks pull the ranking toward what you actually like.

### Patch Changes

- ef427fc: Match quality overhaul (client side): the CLI table and TUI list now display the score the server actually sorts by (decay/rerank blend) instead of raw similarity, the TUI runs its background AI rerank pass on every view (previously only custom searches), and `search` gains a `--fast` flag to skip reranking. Pairs with the registry-side ranking fixes: 300-candidate retrieval pool, 0.95/0.05 recency decay, deep (150-job) location-aware listwise reranking on by default, real min-salary filtering backed by normalized salary data, word-boundary keyword search, prompt-first HyDE for custom searches, and rate-limited resume-body matching.

## 0.14.4

### Patch Changes

- fafc9e3: CLI banner now reads its version from package.json instead of a stale hardcoded constant (was stuck at v0.10.0).

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
