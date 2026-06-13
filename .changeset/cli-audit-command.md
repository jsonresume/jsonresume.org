---
'resume-cli': minor
---

Add a `resume audit [fileName]` command that scores a resume for ATS (Applicant
Tracking System) friendliness. It renders the resume to HTML with a theme
(default `even`), runs `@jsonresume/ats-validator` against the markup, and prints
an advisory report: an overall score and letter grade, a per-check pass/fail
breakdown, and recommendations. The audit is advisory — a successful audit
always exits `0`; only an unreadable resume or unrenderable theme exits non-zero
(reusing the existing friendly-error path). This is the first user-facing entry
point for `@jsonresume/ats-validator`.
