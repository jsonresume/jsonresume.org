---
title: Schema
description: Sections and fields of resume.json, and validating in code.
---

The schema is published as
[`@jsonresume/schema`](https://www.npmjs.com/package/@jsonresume/schema)
(JSON Schema draft-07). Source:
[`packages/schema/schema.json`](https://github.com/jsonresume/jsonresume.org/blob/master/packages/schema/schema.json).

## Sections

| Section | Contents |
| --- | --- |
| `basics` | `name`, `label`, `image`, `email`, `phone`, `url`, `summary`, `location`, `profiles` |
| `objective` | a single string: the role or direction you're seeking (distinct from `basics.summary`, which describes your background) |
| `work` | `name`, `position`, `location`, `description`, `url`, `startDate`, `endDate`, `summary`, `highlights`, `keywords` |
| `volunteer` | `organization`, `position`, `url`, `startDate`, `endDate`, `summary`, `highlights` |
| `education` | `institution`, `url`, `area`, `studyType`, `startDate`, `endDate`, `score`, `courses`, `summary` |
| `awards` | `title`, `date`, `awarder`, `summary` |
| `certificates` | `name`, `date`, `expiryDate`, `issuer`, `url`, `credentialId`, `summary` |
| `publications` | `name`, `type`, `authors`, `publisher` (the event name for talks), `releaseDate`, `volume`, `issue`, `pages`, `identifiers` (`doi`, `isbn`, `arxiv`, ...), `url`, `summary` |
| `skills` | `name`, `level`, `keywords` |
| `languages` | `language`, `fluency` |
| `interests` | `name`, `keywords` |
| `references` | `name`, `reference`, `relationship`, `organization`, `date`, `availableOnRequest` (no contact fields, by design) |
| `projects` | `name`, `summary` (preferred; `description` is a deprecated alias), `highlights`, `keywords`, `startDate`, `endDate`, `url`, `roles`, `entity`, `type` |
| `meta` | `canonical`, `version`, `lastModified`, plus tool settings such as `theme` |

Rules worth knowing:

- Every field is optional.
- Dates are ISO 8601 strings: `YYYY`, `YYYY-MM` or `YYYY-MM-DD`. Leave out
  `endDate` for a current position.
- Unknown properties are allowed (`additionalProperties: true`), so tools can
  store their own data alongside the standard fields.
- For data with no standard field, use the optional `custom` object, allowed
  at the root, in `basics` and on every entry. Namespace keys by tool, e.g.
  `"custom": { "myTool": { "teamSize": 12 } }`. Themes don't render it.

## Validating in code

```bash
npm install @jsonresume/schema
```

`validate(resume, callback)` calls back with `(errors, valid)`:

```js
const { validate } = require('@jsonresume/schema');
const resume = require('./resume.json');

validate(resume, (errors, valid) => {
  if (!valid) {
    console.error(errors);
    process.exit(1);
  }
  console.log('resume.json is valid');
});
```

The raw schema is exported as `schema`, for use with any JSON Schema validator
(for example Ajv with `strict: false` and `ajv-formats`).

## Proposing changes

Schema changes are discussed in the
[schema roadmap issue](https://github.com/jsonresume/jsonresume.org/issues/329).
Open a PR against `packages/schema` with a changeset once a proposal has
consensus.
