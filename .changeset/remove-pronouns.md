---
'@jsonresume/schema': patch
'@jsonresume/types': patch
---

Remove `basics.pronouns`. It was added by accident and was never meant to be part of the schema. Resumes that still include it stay valid, since the schema allows extra fields, but themes and tools shouldn't rely on it.
