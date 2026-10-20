---
'@jsonresume/jsonresume-to-rendercv': patch
---

Keep the social network name when converting profiles: match JSON Resume network names to RenderCV's supported list case-insensitively (`GitHub`, `github`, `Stack Overflow`, `Twitter` → `X`), drop profiles RenderCV would reject, and stop emitting `null` summaries or `undefined` locations.
