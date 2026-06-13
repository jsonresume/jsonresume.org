---
'resume-cli': minor
---

`resume validate` now reports precise, actionable results. On failure each
problem is shown with its JSON path (e.g. `work[0].startDate`), the failing
rule, the offending value, and a one-line fix hint. On success it prints an OK
summary with the candidate name and a count of each populated section. The
classic `data/...` phrasing and the non-zero exit code on invalid input are
preserved; raw Ajv errors are exposed on the thrown error for machine-readable
callers.
