---
'@jsonresume/schema': minor
'@jsonresume/types': minor
---

`publications[]` gains `authors` (in published order), `volume`, `issue`, `pages` and an open `identifiers` object (`doi`, `isbn`, `arxiv`, ...). All optional, so a minimal `{ "name": "..." }` entry stays valid. Talks use `type: "talk"` with `publisher` as the event name (#289, #305).
