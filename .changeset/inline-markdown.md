---
'@jsonresume/schema': minor
'@jsonresume/types': minor
'@jsonresume/utils': minor
'@jsonresume/core': minor
---

Inline Markdown in resume prose (#600), as the November 2026 schema review decided: every `summary`, `work[].highlights[]`, `projects[].description` and `projects[].highlights[]` may use CommonMark inline syntax (`**strong**`, `*emphasis*`, `` `code` ``, `[links](https://…)`); block syntax isn't part of the format, and no flag is needed. `@jsonresume/utils` adds the one shared renderer, `renderInlineMarkdown` (escapes the text first, keeps only http(s) and mailto links) and `stripInlineMarkdown` for plain-text consumers, also at `@jsonresume/utils/markdown`; `@jsonresume/core` re-exports both and adds an `InlineMarkdown` component. The field descriptions and `SPEC.md` say so.
