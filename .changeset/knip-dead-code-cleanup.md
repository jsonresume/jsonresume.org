---
'resume-cli': patch
'@jsonresume/jobs': patch
---

Remove unused dependencies flagged by knip (`async` from resume-cli, `@ai-sdk/anthropic` from @jsonresume/jobs). No runtime behavior change; slims the install footprint.
