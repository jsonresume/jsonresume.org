---
'@jsonresume/types': minor
---

New package: TypeScript types for the JSON Resume and Job schemas, generated
from `@jsonresume/schema` (schema.json + job-schema.json). Exports `Resume`,
`ResumeBasics`, `ResumeLocation`, `ResumeProfile`, `WorkItem`, `VolunteerItem`,
`EducationItem`, `AwardItem`, `CertificateItem`, `PublicationItem`, `SkillItem`,
`LanguageItem`, `InterestItem`, `ReferenceItem`, `ProjectItem`, `ResumeMeta`,
and `JobDescription`. Run `pnpm --filter @jsonresume/types build` to regenerate
the committed `dist/*.d.ts` from the schema.
