# JSON Resume 1.x

This document specifies the JSON Resume format, version 1.x: what a
conforming document is, what its fields mean, and what producers and
consumers of it must do. It is the first step towards a formal standard
(#310). The machine-readable definition is [`schema.json`](schema.json)
(JSON Schema draft-07); where this text and the schema disagree, the schema
decides what is valid and this text is wrong.

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY are to be
interpreted as described in RFC 2119.

## 1. Documents

A JSON Resume document is a JSON text (RFC 8259) whose top-level value is
an object and which validates against `schema.json`. By convention it is
stored as `resume.json` and served as `application/json`, in UTF-8.

- Every field is optional. `{}` is a conforming document.
- Objects MAY carry properties this specification does not define; they
  stay valid (§6).
- A field that is defined MUST have the type given here. A property whose
  name this specification defines but whose value has another type makes the
  document invalid, even where earlier versions did not define that name.

## 2. Conventions

**Dates.** Dates are strings in a reduced ISO 8601 form: `YYYY`, `YYYY-MM`
or `YYYY-MM-DD` (years 1000 to 2999), as precise as the author knows. Every
date is optional. An entry with a `startDate` and no `endDate` is current or
ongoing. `meta.lastModified` is the exception: a date and time,
`YYYY-MM-DDThh:mm:ss`.

**URLs** are absolute URIs (RFC 3986) where marked `uri` in the schema.
`basics.email` is an email address. `basics.phone` is free text in any
format.

**Text** is plain text, written to be read by people. Newlines MAY separate
lines (for example in `location.address`). Values meant for programs (codes,
tags, identifiers) are noted as such below.

**Inline Markdown** is allowed in prose fields: every `summary`,
`work[].highlights[]`, `projects[].description` and
`projects[].highlights[]`. Only CommonMark inline syntax is part of the
format: `**strong**`, `*emphasis*` (or `_emphasis_`), `` `code` `` and
`[links](https://example.com)`. Block syntax (headings, lists, tables) is
not, and stays literal text. No flag marks it: inline syntax reads as plain
text where it isn't rendered. Consumers that render it MUST escape the text
as HTML first and SHOULD keep only `http`, `https` and `mailto` links;
consumers that can't show it (plain text, ATS) SHOULD strip the marks and
keep the words. `@jsonresume/utils` provides both (`renderInlineMarkdown`,
`stripInlineMarkdown`), so themes agree.

**Countries** are ISO 3166-1 alpha-2 codes (`US`, `AU`, `IN`) in
`location.countryCode`.

**Languages** are BCP 47 tags (`en`, `pt-BR`) in `meta.language` and
`meta.translations[].language`. `languages[].language` is the name of a
language, for people (`Spanish`).

**Lists** are arrays. Order is the author's: consumers SHOULD keep it, and
MAY additionally sort dated entries by date.

## 3. The resume

| Field          | Meaning                                                                                                                                                                                                                                                                                                            |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `$schema`      | URL of the schema the document is written against.                                                                                                                                                                                                                                                                 |
| `basics`       | The person: `name`, `label` (a headline such as "Web Developer"), `image` (URL of a photo), `email`, `phone`, `url` (their site), `summary` (a short biography), `location` (§4), `profiles` (`network`, `username`, `url` on other sites).                                                                        |
| `objective`    | A forward-looking career goal. Distinct from `basics.summary`, which describes background.                                                                                                                                                                                                                         |
| `work`         | Jobs held: `name` (employer), `description` (of the employer), `position`, `location`, `url`, `startDate`, `endDate`, `summary`, `highlights` (accomplishments), `keywords` (skills and tools used), `type` (how the role was held: `full-time`, `part-time`, `contract`, `freelance`, `internship`, `temporary`). |
| `volunteer`    | Unpaid roles: `organization`, `position`, `location`, `url`, `startDate`, `endDate`, `summary`, `highlights`.                                                                                                                                                                                                      |
| `education`    | `institution`, `location`, `url`, `area` (subject), `studyType` (degree), `startDate`, `endDate`, `score`, `courses`, `summary` (thesis, honours, context).                                                                                                                                                        |
| `awards`       | `title`, `date`, `awarder`, `summary`.                                                                                                                                                                                                                                                                             |
| `certificates` | `name`, `date`, `issuer`, `url`, `credentialId`, `expiryDate`, `summary`.                                                                                                                                                                                                                                          |
| `publications` | `name`, `authors` (in published order, including the owner), `publisher` (for a talk, the event), `releaseDate`, `volume`, `issue`, `pages`, `identifiers` (keyed by scheme: `doi`, `isbn`, `arxiv`, …), `url`, `summary`, `type` (`article`, `book`, `patent`, `thesis`, `talk`, …).                              |
| `skills`       | `name`, `level`, `keywords`, `id` (a short stable identifier, such as `typescript`).                                                                                                                                                                                                                               |
| `languages`    | `language` (its name), `fluency` (a label people read, such as "Fluent") and `scale` (the level on a published scale, for tools: `{ framework, level }`, such as `{ "framework": "CEFR", "level": "C1" }`; `framework` is free text: `CEFR`, `ILR`, `ACTFL`, …).                                                   |
| `interests`    | `name`, `keywords`.                                                                                                                                                                                                                                                                                                |
| `references`   | `name`, `reference` (the text), `relationship`, `organization`, `date`, `availableOnRequest` (show "available on request" instead of the text). There are deliberately no contact fields.                                                                                                                          |
| `projects`     | `name`, `summary`, `description` (deprecated alias of `summary`; `summary` wins when both are set), `highlights`, `keywords`, `startDate`, `endDate`, `url`, `roles`, `entity` (affiliation), `type` (`talk`, `application`, …).                                                                                   |
| `meta`         | About the document, not the person (§5).                                                                                                                                                                                                                                                                           |
| `custom`       | Extension data (§6). Allowed at the root, in `basics`, and on every entry of every section.                                                                                                                                                                                                                        |

`work[].skills`, `volunteer[].skills`, `education[].skills` and
`projects[].skills` list the skills an entry used. Each item is a string,
the `name` or `id` of a top-level skill, or a skill object (`name`, `level`,
`keywords`) for a skill grouped there. Consumers SHOULD resolve a string
against `skills[].id` first, then `skills[].name`, and SHOULD accept a
string that matches neither as a skill name.

Free-text type fields (`work[].type`, `publications[].type`, `projects[].type`) take any
value; the values listed are recommendations, so that tools can agree on
common cases.

## 4. Locations

A location is an object with `address`, `postalCode`, `city`,
`countryCode` (§2) and `region` (a state or province). `basics.location` is
a location object. `work[].location`, `volunteer[].location` and
`education[].location` are a location object or a string of free text
("Menlo Park, CA"); `work[].location` was only a string before 1.5, and
consumers SHOULD accept both forms.

## 5. Meta

| Field          | Meaning                                                                     |
| -------------- | --------------------------------------------------------------------------- |
| `canonical`    | URL of the latest version of this document.                                 |
| `version`      | The document's own version, in semver (`v1.0.0`).                           |
| `lastModified` | When the document last changed (§2).                                        |
| `language`     | The language the document is written in (§2).                               |
| `translations` | The same resume in other languages: `{ language, url }`, one document each. |

One document holds one language; a resume in several languages is several
documents linked by `meta.translations`.

Tools also keep their own settings in `meta`. The most common is
`meta.theme`, the name of the theme the author chose (a theme package name
such as `jsonresume-theme-even`, or its short name `even`). It is a
convention, not part of the schema.

## 6. Extensions

Data this specification has no field for goes in `custom`, an object whose
keys are free-form. Producers SHOULD namespace its keys by tool
(`"custom": { "myTool": { … } }`) to avoid collisions.

Unknown properties outside `custom` are also valid, for compatibility with
documents written before `custom` existed. New extensions SHOULD use
`custom`.

## 7. Producers and consumers

A **producer** writes documents; a **consumer** reads them (a theme, a
validator, an ATS, a converter).

- Producers MUST write conforming documents and SHOULD omit empty values
  rather than write empty strings.
- Consumers MUST accept every conforming document, MUST NOT fail on unknown
  properties, and SHOULD treat every field as possibly absent.
- Consumers that display a resume SHOULD NOT render `custom`, and need not
  render every section.
- Tools that read and then write a document (editors, converters) SHOULD
  preserve `custom` and unknown properties unchanged.

## 8. Compatibility

Versions follow Semantic Versioning, published as `@jsonresume/schema`.

- **Within 1.x**, changes are additive: new fields are optional, and a
  document that conforms to an earlier 1.x version conforms to every later
  one. The one exception is §1's last rule: when a new field is defined, an
  existing document that used the same name with a different type stops
  validating. Before defining a field, the schema review checks the
  resumes published on jsonresume.org for such uses.
- Deprecated fields stay valid for the rest of 1.x (for example
  `projects[].description`).
- Breaking changes wait for a major version.

How changes are proposed and decided is in
[CONTRIBUTING.md → Proposing Schema Changes](../../CONTRIBUTING.md#proposing-schema-changes);
the decisions are recorded in [DECISIONS.md](DECISIONS.md).

## 9. Implementations

- [`@jsonresume/schema`](https://www.npmjs.com/package/@jsonresume/schema)
  (JavaScript): `schema.json` and a validator.
- [`json-resume-serde`](../core-rust) (Rust): typed serde bindings with
  validation, written separately from the JavaScript validator. It covers
  every field of 1.x, keeps unknown properties, and is tested against the
  schema's sample and examples in CI.
- [`@jsonresume/types`](../types) (TypeScript): types generated from the
  schema.

The job description format (`job-schema.json`) is a separate draft and not
part of this specification.
