<a id="1.0.0"></a>

## 1.7.1

### Patch Changes

- 77a952e: Remove `basics.pronouns`. It was added by accident and was never meant to be part of the schema. Resumes that still include it stay valid, since the schema allows extra fields, but themes and tools shouldn't rely on it.

## 1.7.0

### Minor Changes

- b16c926: `publications[]` gains `authors` (in published order), `volume`, `issue`, `pages` and an open `identifiers` object (`doi`, `isbn`, `arxiv`, ...). All optional, so a minimal `{ "name": "..." }` entry stays valid. Talks use `type: "talk"` with `publisher` as the event name (#289, #305).
- 5351df4: `references[]` gains optional `relationship`, `organization`, `date` and `availableOnRequest`. There are deliberately no contact fields, so a public resume never publishes a referee's phone or email; `availableOnRequest: true` lets a resume say "References available on request" (#291, #311).

## 1.6.0

### Minor Changes

- 6748de7: `projects[].summary` is now the preferred field, consistent with `summary` elsewhere; `projects[].description` stays valid as a deprecated alias, and `summary` wins when both are set (#296). `@jsonresume/utils` adds `withProjectSummaries()`, which the registry and resume-cli apply before rendering so themes reading either field show the text.

## 1.5.0

### Minor Changes

- 117c7bf: Consolidate location into a shared definition (#323).

  `basics.location` was a structured object, `work.location` a plain string, and volunteer and education had no location at all. There is now one shared `location` object (address, postalCode, city, countryCode, region):

  - `basics.location` uses it (unchanged shape)
  - `work.location` accepts either the existing free-text string (e.g. "Palo Alto, CA") or the object
  - `volunteer.location` and `education.location` are new, optional, and accept the same string-or-object forms

  Existing resumes stay valid. Consumers that need uniform processing should normalise the string form; themes receive display strings via `withStringLocations` in the registry and resume-cli.

## 1.4.0

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

### Patch Changes

- 8f377a4: Set real `$id`s on `schema.json` and `job-schema.json` (the resume schema had the placeholder `http://example.com/example.json`), point the sample and example resumes at the monorepo schema URL, and fix the README examples, which called `validate()` without its required callback.
- 34ac806: - iso8601 dates reject impossible months and days (e.g. `2013-19-39`, `2013-00`); every real calendar date is still accepted
  - `validate()` reports an error for input that is not a JSON object (`undefined`, `null`, strings, arrays) instead of calling it valid

## 1.3.1

### Patch Changes

- d8ebc8c: Draft-07 hygiene pass (#321): remove `additionalItems: false` everywhere it sat next to a non-array `items` (ignored by every draft, but rejected by Ajv strict mode), and bump job-schema.json's declared `$schema` from draft-04 to draft-07 (Ajv 8 cannot compile draft-04 documents; no draft-04-only constructs were in use). Validation behavior is unchanged — verified old vs new schemas produce identical results across all examples, samples, and test fixtures. Both schemas now compile under Ajv `strict: true` and are guarded by a new meta-schema compliance test. Note: `definitions` (not `$defs`) remains correct for draft-07.

## 1.3.0

### Minor Changes

- 0e497de: Ship three diverse, realistic example resumes under `examples/` (new-grad, career-changer, and senior IC / staff engineer). Each validates against `schema.json` and exercises a broad set of sections, making them useful for theme testing, onboarding, and demonstrating the breadth of the spec.

## [WIP], Version 1.0.0

### [Discussion: Planning 1.0](https://github.com/jsonresume/resume-schema/issues/372)

---

<a id="0.0.0"></a>

## [2014-07-30, Version 0.0.0](<(https://github.com/jsonresume/resume-schema/blob/0.0.0/schema.json)>)

### Changes

- [[v0.1.3] - add `education.url`](https://github.com/jsonresume/resume-schema/releases/tag/v0.1.3)
- [[v0.1.2] - add `$schema` property](https://github.com/jsonresume/resume-schema/releases/tag/v0.1.2)
- [[v0.1.1] - better dates](https://github.com/jsonresume/resume-schema/releases/tag/v0.1.1) - [Discussion](https://github.com/jsonresume/resume-schema/issues/142)
- [[v0.0.17]](https://github.com/jsonresume/resume-schema/commit/a6d1ae5c990e3370de6ca305ef32477b9516391b)
  - [[675972] - add `location` to work entries](https://github.com/jsonresume/resume-schema/pull/291)
  - [[ded5de] - move to entity description](https://github.com/jsonresume/resume-schema/pull/271)
  - [[b885dd] - move from `company` to `name`](https://github.com/jsonresume/resume-schema/pull/270)
  - [[9c965e] - Use `image` instead of `picture`](https://github.com/jsonresume/resume-schema/pull/268)
  - [[fb876d] - rewrite `website` to `url`](https://github.com/jsonresume/resume-schema/pull/267) - [Discussion](https://github.com/jsonresume/resume-schema/issues/266)
  - [[d996db] - add `project` section to the schema](https://github.com/jsonresume/resume-schema/pull/254) - [Discussion](https://github.com/jsonresume/resume-schema/issues/201)
  - [[720393] - company description](https://github.com/jsonresume/resume-schema/pull/261)
  - [[a26a72] - Add `lastModified` to meta](https://github.com/jsonresume/resume-schema/pull/259)
  - [[ec76c1] - meta `version`](https://github.com/jsonresume/resume-schema/pull/258)
  - [[230260] - Use `canonical` instead of `url`](https://github.com/jsonresume/resume-schema/pull/257)
  - [[de6067] - `meta` was added](https://github.com/jsonresume/resume-schema/pull/237) - [Discussion](https://github.com/jsonresume/resume-schema/issues/204)
  - [[8d316c] - updated `language' properties](https://github.com/jsonresume/resume-schema/pull/149) - [Discussion](https://github.com/jsonresume/resume-schema/issues/145)
  - [[a1bc56] - changes `website` -> `url`](https://github.com/jsonresume/resume-schema/pull/155) - [Discussion](https://github.com/jsonresume/resume-schema/issues/148)
- [[v0.0.12]](https://github.com/jsonresume/resume-schema/commit/f18c18743ac1903761b80851393a3a756dc327e4)
  - [[f02300] - `languages` was added](https://github.com/jsonresume/resume-schema/commit/f02300e36ba076787d008928b29963c3ffce6121) - [Discussion](https://github.com/jsonresume/resume-schema/issues/34)
  - [[1c93f1] - `hobbies` was renamed to `interests`](https://github.com/jsonresume/resume-schema/commit/1c93f11f121df3794ad59a99cfbd42e7948201c4)
  - [[dee007] - `volunteer` was added](https://github.com/jsonresume/resume-schema/commit/dee007c2e373645b6b67d07a92aebf22fda5b95a) - [Discussion](https://github.com/jsonresume/resume-schema/issues/43)
  - [[b1b62f] - `summary` was added to `awards`](https://github.com/jsonresume/resume-schema/commit/b1b62fb425f4ad8b13ad4612d658bdd203f51206) - [Discussion](https://github.com/jsonresume/resume-schema/issues/119)
  - [[7bde1b] - `summary` was added to `publications`](https://github.com/jsonresume/resume-schema/pull/129) - [Discussion](https://github.com/jsonresume/resume-schema/issues/126)
  - [[818051] - `profiles` was changed to a type array instead of an object](https://github.com/jsonresume/resume-schema/pull/116) - [Discussion](https://github.com/jsonresume/resume-schema/issues/6)
  - [[1a97f0] - `bio` was renamed to `basics`](https://github.com/jsonresume/resume-schema/pull/117) - [Discussion](https://github.com/jsonresume/resume-schema/issues/68)
  - [[bb0171] - `address` and `postalCode` were added to `location`](https://github.com/jsonresume/resume-schema/pull/110) - [Discussion](https://github.com/jsonresume/resume-schema/issues/76)
  - [[a236a3] - `awardDate` was changed to `date`](https://github.com/jsonresume/resume-schema/pull/107) - [Discussion](https://github.com/jsonresume/resume-schema/pull/107)
  - [[7e53c3] - `websites` was changed to `website`, changed from object into string](https://github.com/jsonresume/resume-schema/pull/101) - [Discussion](https://github.com/jsonresume/resume-schema/issues/10)
  - [[277c0d] - specified that `countryCode` conforms to ISO standard](https://github.com/jsonresume/resume-schema/pull/78) - [Discussion](https://github.com/jsonresume/resume-schema/pull/78)
  - [[24b0bb] - `region` replaced `state` as the default](https://github.com/jsonresume/resume-schema/pull/99) - [Discussion](https://github.com/jsonresume/resume-schema/issues/19)
  - [[011b4a] - `picture` was added to the `bio` object](https://github.com/jsonresume/resume-schema/pull/80) - [Discussion](https://github.com/jsonresume/resume-schema/issues/29)
  - [[0d4ae8] - `gpa` was added to `education` objects](https://github.com/jsonresume/resume-schema/pull/97) - [Discussion](https://github.com/jsonresume/resume-schema/issues/7)
  - [[afc937] - `email` and `phone` were changed from objects into strings](https://github.com/jsonresume/resume-schema/pull/98) - [Discussion](https://github.com/jsonresume/resume-schema/issues/27)
  - [[717b2a] - `firstName` and `lastName` were merged into `name`](https://github.com/jsonresume/resume-schema/releases/tag/v0.0.12) - [Discussion](https://github.com/jsonresume/resume-schema/issues/4)
- [[v0.0.10] - Add `bio.label`](https://github.com/jsonresume/resume-schema/releases/v0.0.10)
- [[v0.0.7] - Remove `skills.releaseDate`](https://github.com/jsonresume/resume-schema/releases/tag/v0.0.7)
- [[v0.0.6] - Schema First Draft](https://github.com/jsonresume/resume-schema/releases/tag/v0.0.6)
