# @repo/ats

How well applicant tracking systems (Greenhouse, Lever, Workday…) will read a
resume, from its JSON alone: `checkAts(resume)` scores contact details, jobs,
skills, headline and summary, achievements, education and dates out of 100,
with each issue's severity, a fix and the field it's in (`work[0].startDate`).

Pure and synchronous, so the editor runs it on every keystroke, the dashboard
shows it, and the `check_ats` MCP tool returns it. The registry's ATS checker
was the reference; its theme check is gone (the theme doesn't change what a
tracking system reads from the JSON or the PDF text).
