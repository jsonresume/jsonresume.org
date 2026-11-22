---
'@jsonresume/schema': minor
'@jsonresume/types': minor
---

Add optional `meta.language`, the language a resume is written in as a BCP 47 tag (`en`, `pt-BR`), and `meta.translations`, the same resume in other languages as `{ language, url }` entries: one document per language, as the November 2026 schema review decided (#288). Both are new optional fields; the 26 resumes on jsonresume.org that already set `meta.language` used a string and stay valid.
