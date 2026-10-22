---
'@jsonresume/utils': minor
'resume-cli': patch
---

- `@jsonresume/utils`: `withStringLocations(resume)` formats structured `location` objects on work, volunteer and education entries as display strings, for themes written for string locations (#323)
- `resume-cli`: applies the same conversion before rendering a theme, so structured entry locations never print as `[object Object]`
