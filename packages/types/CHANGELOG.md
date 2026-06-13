# @jsonresume/types

## 0.2.1

### Patch Changes

- 4556376: Add a README documenting the exported interfaces (`Resume`, `WorkItem`,
  `JobDescription`, etc.) with install and TypeScript usage examples, so the
  npmjs.com page is no longer bare. (#421)

## 0.2.0

### Minor Changes

- 36d1759: New package: TypeScript types for the JSON Resume and Job schemas, generated
  from `@jsonresume/schema` (schema.json + job-schema.json). Exports `Resume`,
  `ResumeBasics`, `ResumeLocation`, `ResumeProfile`, `WorkItem`, `VolunteerItem`,
  `EducationItem`, `AwardItem`, `CertificateItem`, `PublicationItem`, `SkillItem`,
  `LanguageItem`, `InterestItem`, `ReferenceItem`, `ProjectItem`, `ResumeMeta`,
  and `JobDescription`. Run `pnpm --filter @jsonresume/types build` to regenerate
  the committed `dist/*.d.ts` from the schema.
