---
'@jsonresume/schema': minor
'@jsonresume/types': minor
'@jsonresume/utils': minor
'resume-cli': patch
---

`projects[].summary` is now the preferred field, consistent with `summary` elsewhere; `projects[].description` stays valid as a deprecated alias, and `summary` wins when both are set (#296). `@jsonresume/utils` adds `withProjectSummaries()`, which the registry and resume-cli apply before rendering so themes reading either field show the text.
