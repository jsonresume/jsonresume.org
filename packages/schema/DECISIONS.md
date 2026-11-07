# Schema decisions

Each schema proposal gets an **accept**, **change** or **decline**, with
reasons, at the monthly review (CONTRIBUTING.md → Proposing Schema Changes).
This file is the record.

Every rule from the proposal process applies to what is accepted here: in
v1, new fields are optional and existing resumes stay valid; free text is
preferred over a closed list; the schema describes the person, not the
layout.

## Awaiting the maintainer

Drafted recommendations for the proposals open in November 2026. Each becomes
a decision when a maintainer confirms it on the issue and moves it below.

| Issue                                                           | Proposal                         | Recommendation                                                                |
| --------------------------------------------------------------- | -------------------------------- | ----------------------------------------------------------------------------- |
| [#599](https://github.com/jsonresume/jsonresume.org/issues/599) | Employment type on work entries  | **Accept**                                                                    |
| [#589](https://github.com/jsonresume/jsonresume.org/issues/589) | Career breaks on the timeline    | **Change**: a `work` entry with that type, not a new section                  |
| [#315](https://github.com/jsonresume/jsonresume.org/issues/315) | Standard language fluency levels | **Accept** the shape agreed in the thread                                     |
| [#600](https://github.com/jsonresume/jsonresume.org/issues/600) | Markdown in free-text fields     | **Change**: inline Markdown only, in named fields                             |
| [#353](https://github.com/jsonresume/jsonresume.org/issues/353) | Stabilise job-schema v1          | **Accept**, with #319 folded in                                               |
| [#319](https://github.com/jsonresume/jsonresume.org/issues/319) | Structured salary in job-schema  | **Accept**, as part of #353                                                   |
| [#313](https://github.com/jsonresume/jsonresume.org/issues/313) | Skills model                     | **Change**: the additive part now, hierarchies and global ids declined for v1 |
| [#288](https://github.com/jsonresume/jsonresume.org/issues/288) | Internationalisation             | **Change**: one document per language, linked                                 |
| [#310](https://github.com/jsonresume/jsonresume.org/issues/310) | Submit as a formal standard      | **Accept** step one: a normative spec for 1.x                                 |
| [#329](https://github.com/jsonresume/jsonresume.org/issues/329) | Schema roadmap                   | Not a proposal: label it `tracking`                                           |

### #599 Employment type: accept

Add optional `work[].type`, free text, mirroring `projects[].type`, with
recommended values in the description: `full-time`, `part-time`, `contract`,
`freelance`, `internship`, `temporary`. Combinations ("part-time contract")
stay possible because it is text. It describes past roles only; what someone
is looking for stays in `basics` (#299). Readers and ATS tools both use it,
and it costs themes nothing when absent.

### #589 Career breaks: change

A new top-level section would have to be rendered by every theme (around 200)
before it helps anyone, and most resumes would never use it. Instead, once
#599 lands, a break is a `work` entry with `type: "career-break"`, a
`summary` and dates, and no `name` required. Themes already show work in
date order; the ones that want to can style it differently. The reason
stays optional free text, which keeps it private by default.

### #315 Language fluency: accept

Keep `fluency` as free text, the label people read. Add optional
`proficiency: { "framework": "CEFR", "level": "C1" }` for tools, with
`framework` free text (`CEFR`, `ILR`, `ACTFL`, …). No closed list: regions use
different scales, and a mandatory enum would break every existing resume.
Speaking and writing levels can follow later as an array if a consumer needs
them.

### #600 Markdown: change

Allow CommonMark **inline** syntax only (emphasis, links, code) in `summary`,
`work[].highlights[]`, `projects[].description` and
`projects[].highlights[]`. Block syntax (headings, lists, tables) is not part
of the format. Consumers that don't render Markdown strip it, and
`@jsonresume/core` gets one shared renderer so themes agree. No flag is
needed: inline syntax degrades to readable text.

### #353 and #319 Job schema v1: accept

Proceed with the RFC as refreshed on 2026-10-22, additive and
compatibility-first. Keep `salary` as the display string and add
`compensation: { "min", "max", "currency" (ISO 4217), "period" }` with
`period` one of `hour`, `day`, `week`, `month`, `year`. Normalised values
(such as USD) are derived data for the registry, not part of the document.

### #313 Skills model: change

Accept the additive part: optional `skills[].id` and optional `skills[]` on
`work`, `projects`, `education` and `volunteer`, holding names or ids from
the top-level list, so a skill can point to where it was used. Decline, for
v1, global skill identifiers and dotted hierarchies: they need a shared
registry the format can't carry, and `skills[].keywords` already groups.
Revisit for v2 with a concrete consumer.

### #288 Internationalisation: change

One resume document per language, with `meta.language` (a BCP 47 tag) and
optional `meta.translations` linking the others by URL. Per-field language
maps would change the shape of every string, a v2-scale break, and most
tools only ever need one language at a time.

### #310 Formal standard: accept the first step

Write `packages/schema/SPEC.md`, a short normative description of 1.x: field
meanings, the date convention, extension through `custom`, and the
compatibility promise. Approaching a standards body (W3C Community Group or
similar) waits until the spec exists and has a second independent
implementation.

## Decided

None recorded yet.
