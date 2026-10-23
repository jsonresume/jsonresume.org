---
'@jsonresume/schema': minor
'@jsonresume/types': minor
---

`references[]` gains optional `relationship`, `organization`, `date` and `availableOnRequest`. There are deliberately no contact fields, so a public resume never publishes a referee's phone or email; `availableOnRequest: true` lets a resume say "References available on request" (#291, #311).
