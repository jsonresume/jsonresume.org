---
'@jsonresume/theme-kit': minor
---

`findArtifacts` (and so `assertThemeRender`) now flags "Invalid Date", the output of formatting a missing date. Themes must render entries without dates cleanly, since every JSON Resume date is optional.
