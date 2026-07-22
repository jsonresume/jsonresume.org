<a id="1.0.0"></a>

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
