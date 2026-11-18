---
'@jsonresume/schema': minor
'@jsonresume/types': minor
---

`work[].type` gives a role's employment type as free text, mirroring `projects[].type`: `full-time`, `part-time`, `contract`, `freelance`, `internship`, `temporary`, or a combination such as `part-time contract`. Optional, so every existing resume stays valid. It describes the role as it was, not what someone is looking for (#599).
