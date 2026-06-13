---
'resume-cli': patch
---

`validate` and `export` now print a friendly, stack-trace-free error and exit
non-zero when the resume file is missing, unreadable, or contains malformed
JSON/YAML (and when a custom `--schema` fails to load), instead of crashing
with an unhandled-rejection Node-internal stack trace.
