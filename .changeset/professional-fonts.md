---
'@jsonresume/jsonresume-theme-professional': patch
---

Load Latin Modern from https://jsonresume.org/fonts/ (served with CORS), so the theme shows in its own typeface wherever it renders, a PDF or a resume built with resume-cli, and fall back to a serif rather than Courier. Drop the Latin Modern Sans faces it declared but never used.
