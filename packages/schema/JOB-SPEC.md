# JSON Resume job description, v1

This document specifies the job description format: one job posting as JSON,
validated by [`job-schema.json`](job-schema.json) (JSON Schema draft-07).
It completes #353. It shares the conventions of the resume format
([SPEC.md](SPEC.md) §2: dates, URLs, countries, lists) and its rules for
producers, consumers and compatibility (SPEC.md §7 and §8). Where this text
and the schema disagree, the schema decides what is valid.

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY are to be
interpreted as described in RFC 2119.

## 1. Documents

A job document is a JSON object that validates against `job-schema.json`,
stored by convention as `job.json`. Every field is optional, and unknown
properties stay valid. A posting that does not say something leaves the
field out: producers SHOULD NOT guess.

## 2. Fields

| Field              | Meaning                                                                                                                                      |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`            | The role, as the posting names it ("Web Developer").                                                                                         |
| `company`          | The employer's name.                                                                                                                         |
| `companyUrl`       | The employer's website. It identifies the company: a company document ([COMPANY-SPEC.md](COMPANY-SPEC.md)) with the same `url` describes it. |
| `type`             | How the role is held, as text people read ("Full-time"). `facets.employmentType` is the same for tools.                                      |
| `date`             | When the job was posted (SPEC.md §2).                                                                                                        |
| `description`      | A short description of the job.                                                                                                              |
| `url`              | Where the posting is published.                                                                                                              |
| `apply`            | How to apply: `url` (a form or page), `email` (an address), `instructions` (anything else the applicant must do). Any combination.           |
| `location`         | Where the job is: a location object (SPEC.md §4).                                                                                            |
| `remote`           | `Full`, `Hybrid` or `None`.                                                                                                                  |
| `salary`           | The pay as the posting words it, for display ("$120k–150k + equity").                                                                        |
| `compensation`     | The pay as numbers (#319): `min`, `max` (equal for one figure), `currency` (ISO 4217) and `period` (`hour`, `day`, `week`, `month`, `year`). |
| `experience`       | The level as text people read ("Senior"). `facets.seniority` is the same for tools.                                                          |
| `facets`           | The posting in fixed terms tools filter on (§3).                                                                                             |
| `responsibilities` | What the job entails, one item each.                                                                                                         |
| `qualifications`   | What the applicant needs, one item each.                                                                                                     |
| `skills`           | Skills asked for: `name`, `level`, `keywords`, as in the resume.                                                                             |
| `meta`             | About the document: `canonical`, `version`, `lastModified` (SPEC.md §5).                                                                     |

`salary` and `compensation` say the same thing to different readers, and a
document MAY carry either or both. Amounts converted to another currency are
derived data and MUST NOT be written into `compensation`.

## 3. Facets

Each facet is optional. `unspecified` means the posting does not say, and
reads the same as an absent facet.

| Facet              | Values                                                                                     |
| ------------------ | ------------------------------------------------------------------------------------------ |
| `remoteScope`      | `onsite`, `hybrid`, `remote_region` (remote within `remoteRegions`), `remote_global`.      |
| `remoteRegions`    | Where remote work is allowed, when limited (`["US"]`, `["EU"]`).                           |
| `timezoneRange`    | Overlap or time zones required, free text ("UTC-5 to UTC+1").                              |
| `seniority`        | `intern`, `junior`, `mid`, `senior`, `staff_plus`, `lead_management`.                      |
| `employmentType`   | `full_time`, `part_time`, `contract`, `internship`, `cofounder`.                           |
| `visaSponsorship`  | `yes`, `no`.                                                                               |
| `salaryProvenance` | `stated` (the posting gives numbers), `inferred` (a tool estimated them), `absent` (none). |

## 4. Matching against resumes

Tools that match jobs to resumes SHOULD compare `skills[].name` and
`skills[].keywords` with the resume's `skills` and entry `skills`, and
`facets.remoteScope` and `location.countryCode` with the resume's
`basics.location`. Match scores are the tool's own data, not part of either
document.

## 5. Implementations

- [`@jsonresume/schema`](https://www.npmjs.com/package/@jsonresume/schema):
  `job-schema.json`, exported as `jobSchema`.
- [`@jsonresume/types`](../types): the `JobDescription` type.
- jsonresume.org serves every job on its board as a document at
  `/api/jobs/<id>/document`, and to agents through the MCP tool
  `get_job_document`.
