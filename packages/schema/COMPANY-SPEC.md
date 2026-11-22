# JSON Resume company, draft

This document specifies the company format: a company that hires, as JSON,
validated by [`company-schema.json`](company-schema.json) (JSON Schema
draft-07). It is a draft: fields may still change before 1.0, and changes
are recorded in [DECISIONS.md](DECISIONS.md). It shares the conventions of
the resume format ([SPEC.md](SPEC.md) §2) and its rules for producers and
consumers (SPEC.md §7). Where this text and the schema disagree, the schema
decides what is valid.

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY are to be
interpreted as described in RFC 2119.

## 1. Documents

A company document is a JSON object that validates against
`company-schema.json`, stored by convention as `company.json`. Every field
is optional, and unknown properties stay valid. Extension data goes in
`custom`, keyed by tool, as in the resume (SPEC.md §6).

A company is identified by its website, `url`. Job documents name their
employer's website in `companyUrl` ([JOB-SPEC.md](JOB-SPEC.md)), so tools
join jobs to companies by comparing the two. They SHOULD compare the host
name only, ignoring the scheme and a leading `www.`.

## 2. Fields

| Field          | Meaning                                                                                                  |
| -------------- | -------------------------------------------------------------------------------------------------------- |
| `name`         | The company's name.                                                                                      |
| `url`          | Its website, which identifies it (§1).                                                                   |
| `logo`         | URL of its logo, a square image.                                                                         |
| `description`  | What it does, in a few sentences.                                                                        |
| `industry`     | Its field, free text ("Developer tools").                                                                |
| `keywords`     | Words that describe what it does.                                                                        |
| `founded`      | When it was founded (SPEC.md §2).                                                                        |
| `employees`    | How many people work there: `{ min, max }`, whole numbers of at least 1, equal for an exact count.       |
| `stage`        | Funding or ownership, free text ("Bootstrapped", "Series B", "Public", "Non-profit").                    |
| `headquarters` | A location object (SPEC.md §4).                                                                          |
| `locations`    | Other offices and places people work, as location objects.                                               |
| `remote`       | Its usual policy: `Full`, `Hybrid` or `None`. Each job document states its own, which wins for that job. |
| `technologies` | Languages, frameworks and tools it uses.                                                                 |
| `benefits`     | What it offers beyond pay, one item each.                                                                |
| `values`       | What it says it values, in its words.                                                                    |
| `careers`      | Its page of open roles.                                                                                  |
| `email`        | An address for hiring questions.                                                                         |
| `profiles`     | The company on other sites: `network`, `username`, `url`, as in the resume's `basics.profiles`.          |
| `custom`       | Extension data (§1).                                                                                     |
| `meta`         | About the document: `canonical`, `version`, `lastModified` (SPEC.md §5).                                 |

Open roles are not part of the document: they change daily, and each is a
job document of its own.

## 3. Implementations

- [`@jsonresume/schema`](https://www.npmjs.com/package/@jsonresume/schema):
  `company-schema.json`, exported as `companySchema`.
- [`@jsonresume/types`](../types): the `Company` type.
