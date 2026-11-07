# Theme portfolio

The portfolio adds 150 original themes to the 77-entry catalogue. The briefs in
`docs/theme-roadmap/*.json` are the design source. Each includes an audience,
composition, type pairing, palette, layout, demand anchor and build wave.
The workbook includes both the original catalogue and the new portfolio.

## Discovery

Styles describe appearance: Classic, Minimal, Modern, Editorial, Technical,
Bold, Creative, Retro and Playful. Layout and colour are independent filters.
Audience terms remain searchable; they do not compete with visual styles.
The old `research-informed` style is retired; bookmarked URLs still open the
catalogue. The ten original researched families remain available individually.

The gallery defaults to public-resume usage. Users can instead sort by explicit
choices or name. Every theme carries the same facets and usage fields in MCP
`list_themes`, so agents see the same catalogue and ordering as the website.
Styles, layouts and colours are ordered by the public-resume adoption of the
themes they contain. Equal usage counts use alphabetical order. Equal counts share a usage rank.

## What usage means

The snapshot dated 7 November 2026 contains 4,604 public resumes. It measures
stored theme choices, not monthly active users, successful job applications or
recruiter preference. Elegant has 3,099 resumes, including 2,343 inherited
choices. Its 756 explicit choices are reported separately. Default inheritance
is not evidence that all those users deliberately preferred the design.

The source combines current verified account/ghost profiles with legacy public
resumes that are not reserved by a current profile. Aliases, unverified accounts,
case-insensitive duplicate usernames and non-object documents are excluded.
Only an official `jsonresume-theme-` package prefix is normalised. Fork names,
typos and unknown slugs remain separate. No personal resume content is exported.

The snapshot also identifies 306 choices in 57 theme families outside the
current catalogue. The workbook preserves these as a restoration/review queue;
it does not silently replace anyone's stored choice. Recent page views are a
secondary signal, include previews and have shorter recording coverage.

New themes have no measured adoption in this pre-launch snapshot. Their build
priority uses the explicit adoption of a related existing design plus the
coverage wave. This is planning evidence, not invented usage of new themes.

Refresh from an approved local aggregate JSON file:

```sh
node scripts/update-theme-usage.ts --source /path/to/aggregate.json
```

Or run the documented read-only aggregate query over an authorised SSH account:

```sh
node scripts/update-theme-usage.ts --ssh user@production-host
```

The query is `packages/theme-config/queries/usage.sql`; refresh validates totals
and produces `docs/theme-roadmap/usage-source.json` and public catalogue counts.
Do not use raw database credentials or personal records in these artifacts.

## Implementation

Each design is an independently importable public package with a synchronous
`render(resume)` export and default `{ render }`. Shared typed primitives handle
safe content, dates, standard sections, selectable text and document semantics.
Vanilla-extract styles are compiled and embedded at build time. Rendering does
not read files or require browser hydration. Host imports remain lazy.

The build-time recipes under `scripts/theme-portfolio` encode composition,
typography and section emphasis. They generate ordinary theme source; they are
not a runtime dependency. To regenerate sources and registrations after changing
a brief or composition, run the generator followed by registration, formatting,
workspace installation and theme builds. Never publish stale committed `dist`.

All standard JSON Resume sections render when populated. Sparse documents omit
empty sections. Narrow screens stack columns. Long content wraps and continues
onto additional A4/Letter pages rather than being cropped to fit one page.
The larger-type design retains a larger print body. Regional designs default to
appropriate language labels and script-capable fonts; `meta.language` overrides
the default. Applicant prose is never translated automatically.

Photos and full street addresses are opt-in. The existing `meta.researchThemes`
preference key remains compatible and supports single column, compact density,
monochrome, section order, photo and full-address options.

## Verification

Every package exercises its published entry for full standard-section coverage
and sparse content. Hosted renderer tests compare the complete catalogue with
registered loaders. Browser verification covers 320, 390, 640, 768 and 1280 pixel
screens, long names/URLs, sparse and malformed data, blocked fonts and WCAG AA
checks. Print verification checks complete and dense documents on A4 and Letter,
including extracted content, page bounds and rendered page contact sheets.

```sh
node scripts/verify-researched-themes.ts --portfolio --gallery
python scripts/verify-researched-theme-pdfs.py --portfolio
```

Generated verification output belongs under `output/theme-portfolio` and is not
part of the published packages. Actual release checks and any unresolved gaps
must be recorded before deployment; this document describes the required matrix.

Existing classifications were audited against current hosted previews and layout
source, and all 77 existing thumbnails were regenerated with the same sample
content. Tan Responsive remains for compatibility; its preview needs its legacy entrance
animation to settle, and it expects legacy company/picture fields. The workbook
flags that schema compatibility for review. The 150 new designs support current
standard JSON Resume fields without client-side animation.
