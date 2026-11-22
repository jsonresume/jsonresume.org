# @jsonresume/types

## 0.7.0

### Minor Changes

- a6ba9ed: Inline Markdown in resume prose (#600), as the November 2026 schema review decided: every `summary`, `work[].highlights[]`, `projects[].description` and `projects[].highlights[]` may use CommonMark inline syntax (`**strong**`, `*emphasis*`, `` `code` ``, `[links](https://…)`); block syntax isn't part of the format, and no flag is needed. `@jsonresume/utils` adds the one shared renderer, `renderInlineMarkdown` (escapes the text first, keeps only http(s) and mailto links) and `stripInlineMarkdown` for plain-text consumers, also at `@jsonresume/utils/markdown`; `@jsonresume/core` re-exports both and adds an `InlineMarkdown` component. The field descriptions and `SPEC.md` say so.
- b05f681: Job schema: optional `compensation` (`min`, `max`, `currency` as ISO 4217, `period` one of `hour`, `day`, `week`, `month`, `year`) beside the display `salary` text (#319), and optional `facets`, the fixed vocabulary tools filter on: `remoteScope`, `remoteRegions`, `timezoneRange`, `seniority`, `employmentType`, `visaSponsorship` and `salaryProvenance`, each with `unspecified` for a post that doesn't say (#353). These are the values jsonresume.org's jobs pipeline already uses. Existing job documents stay valid.
- a6277b9: Add optional `meta.language`, the language a resume is written in as a BCP 47 tag (`en`, `pt-BR`), and `meta.translations`, the same resume in other languages as `{ language, url }` entries: one document per language, as the November 2026 schema review decided (#288). Both are new optional fields; the 26 resumes on jsonresume.org that already set `meta.language` used a string and stay valid.
- 453ea3e: Add optional `work[].type`: how a role was held, as free text. Recommended values are `full-time`, `part-time`, `contract`, `freelance`, `internship` and `temporary`, and they combine ("part-time contract"). It describes past roles, not what someone is looking for. It must be a string: a resume that already put a non-string value under `work[].type` (allowed before as an extra field), such as an array, no longer validates and should join the values into one string, e.g. `"part-time contract"`.

### Patch Changes

- 32299c9: Document career breaks (#589): a `work` entry with `type: "career-break"`, its dates and an optional `summary`, and no `name`. No new section: every theme already shows work entries in date order, and the reason stays optional free text.

## 0.6.1

### Patch Changes

- 77a952e: Remove `basics.pronouns`. It was added by accident and was never meant to be part of the schema. Resumes that still include it stay valid, since the schema allows extra fields, but themes and tools shouldn't rely on it.

## 0.6.0

### Minor Changes

- b16c926: `publications[]` gains `authors` (in published order), `volume`, `issue`, `pages` and an open `identifiers` object (`doi`, `isbn`, `arxiv`, ...). All optional, so a minimal `{ "name": "..." }` entry stays valid. Talks use `type: "talk"` with `publisher` as the event name (#289, #305).
- 5351df4: `references[]` gains optional `relationship`, `organization`, `date` and `availableOnRequest`. There are deliberately no contact fields, so a public resume never publishes a referee's phone or email; `availableOnRequest: true` lets a resume say "References available on request" (#291, #311).

## 0.5.0

### Minor Changes

- 6748de7: `projects[].summary` is now the preferred field, consistent with `summary` elsewhere; `projects[].description` stays valid as a deprecated alias, and `summary` wins when both are set (#296). `@jsonresume/utils` adds `withProjectSummaries()`, which the registry and resume-cli apply before rendering so themes reading either field show the text.

## 0.4.0

### Minor Changes

- 117c7bf: Consolidate location into a shared definition (#323).

  `basics.location` was a structured object, `work.location` a plain string, and volunteer and education had no location at all. There is now one shared `location` object (address, postalCode, city, countryCode, region):

  - `basics.location` uses it (unchanged shape)
  - `work.location` accepts either the existing free-text string (e.g. "Palo Alto, CA") or the object
  - `volunteer.location` and `education.location` are new, optional, and accept the same string-or-object forms

  Existing resumes stay valid. Consumers that need uniform processing should normalise the string form; themes receive display strings via `withStringLocations` in the registry and resume-cli.

## 0.3.0

### Minor Changes

- f14aaac: - `certificates[].credentialId` (licence or certification number) and `certificates[].summary` (#590)
  - The date description now states the v1 convention: every date is optional, and an omitted `endDate` means a current position (#309)
- 640a5eb: Add an optional `custom` object (root, `basics`, and every section entry) for tool- or author-specific data that has no standard field. Contents are free-form and themes don't render it. Existing resumes are unaffected (#316).
- 788cab8: New optional fields, all additive:

  - `work[].keywords`: skills or technologies used in the role (#293)
  - `education[].summary`: thesis, honours or other context (#292)
  - `certificates[].expiryDate`: when a certificate lapses; omit if it doesn't expire (#307)
  - `publications[].type`: e.g. article, book, patent, thesis, talk (#295)

  The sample resume now includes a certificate and uses each new field (#294).

- 135a859: Optional root-level `objective`: a short, forward-looking career goal, distinct from `basics.summary` (#317).
- 135a859: Optional `basics.pronouns` (#312).

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
