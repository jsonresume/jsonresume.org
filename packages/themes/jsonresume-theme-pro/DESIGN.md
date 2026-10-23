# Pro design system

Pro is a single-column, serif résumé. One rule governs it: every semantic
role has one visual treatment, and a treatment changes only when the
meaning changes.

## Code layout

| Concern           | File                                                                                   |
| ----------------- | -------------------------------------------------------------------------------------- |
| Entry point       | `src/index.js` (`render`, `renderWithDiagnostics`)                                     |
| Input adaptation  | `src/text.js`, `src/dates.js`, `src/location.js`, `src/sections.js`, `src/settings.js` |
| Visual primitives | `src/components.js`, `src/masthead.js`                                                 |
| Tokens and media  | `src/styles.js` (screen and print tokens side by side)                                 |
| Fonts             | `fonts/*.woff2`, embedded by `scripts/embed-fonts.mjs`                                 |

`render(resume)` is pure: it does not mutate the input or touch the network
or filesystem, and the same input always gives the same output. The output
is one self-contained HTML document that needs no JavaScript.

## Typography

Source Serif 4 (Adobe, OFL 1.1), falling back to Georgia and Times New Roman.
Three faces are embedded: Regular, Semibold and Italic. They are the
official 4.005 WOFF2 files, unmodified. Subsetting would make a Modified
Version under the license's Reserved Font Name clause, so each page carries
about 290 KB of fonts.

| Role                  | Screen         | Print          | Treatment                           |
| --------------------- | -------------- | -------------- | ----------------------------------- |
| Name (`h1`)           | 30–36px / 1.12 | 25pt / 1.10    | 600                                 |
| Label                 | 16.5px / 1.40  | 11pt / 1.25    | 400                                 |
| Section (`h2`)        | 18.5px / 1.25  | 12pt / 1.20    | 600, fine rule                      |
| Entry title (`h3`)    | 16.5px / 1.30  | 11pt / 1.25    | 600                                 |
| Entry context         | 16px / 1.35    | 10.5pt / 1.25  | italic, primary color               |
| Narrative, highlights | 16.5px / 1.45  | 11pt / 1.30    | 400                                 |
| Dates, metadata       | 15px / 1.35    | 10.25pt / 1.25 | upright, secondary, tabular figures |
| Contacts              | 15px / 1.40    | 10.25pt / 1.25 | secondary                           |

Changes from the starting brief:

- **Section headings use 600, not 700.** There is no Bold face, which saves
  80 KB per page. Size and the rule still separate section headings from
  entry titles.
- **Dates use tabular figures.** This keeps right-aligned dates steady
  from entry to entry.

## Color and geometry

Paper `#ffffff`, text `#202020` (16.3:1), secondary `#4b4b4b` (8.7:1), rule
`#b8b8b2` (decorative only), focus `#174ea6` (2px outline). The measure is
`42rem`, the gutter `clamp(1rem, 4vw, 2rem)`. Pro uses no radius, shadow or
background panel.

## Spacing grammar

Internal gaps are smaller than entry gaps, and entry gaps are smaller than
section gaps:

| Relationship           | Screen | Print  |
| ---------------------- | ------ | ------ |
| Title → context        | 2px    | 0.5mm  |
| Context → narrative    | 6px    | 1.5mm  |
| Paragraph → paragraph  | 8px    | 2mm    |
| Narrative → highlights | 6px    | 1.5mm  |
| Highlight → highlight  | 4px    | 0.75mm |
| Entry → entry          | 18px   | 4mm    |
| Taxonomy row → row     | 6px    | 1.5mm  |
| Section title → rule   | 5px    | 1mm    |
| Rule → content         | 10px   | 2.5mm  |
| Section → section      | 28px   | 6mm    |

Parents own the spacing between siblings (`.pro-entries > * + *`), and an
entry owns its internal gaps. When an optional part is missing, its markup
and its gap both disappear.

## Components

- **Masthead.** Centered name, then the label, then two contact lists:
  primary (location, email, phone) and secondary (website, profiles). Email
  and phone become `mailto:`/`tel:` links only when valid. No country code
  is ever added, and a bracketed trunk `(0)` after `+` is dropped from the
  link. Profiles read "GitHub: name" on screen and show the address in
  print. A profile with no URL is never given one. The summary sits below,
  in the body column.
- **Section.** An `h2` with a bottom rule. A section with no renderable
  content emits nothing.
- **Entry.** The markup order is title → date → context line → narrative →
  highlights → compact groups. At 40rem and wider, title and date share a
  row and the date aligns to the end. Below 40rem every date stacks
  under its title. The context line holds the italic context (employer,
  issuer, publisher) and upright metadata joined by middle dots.
- **Taxonomy.** Skills, languages and interests share one 9.5rem label
  track at every row. Below 40rem the label stacks above the values. A
  row without a label keeps its values on the value edge, and no empty
  label is drawn.
- **Links.** A thin underline at 45% of the text color, solid on hover,
  with a 2px focus outline. Linked titles keep the size and weight of plain
  ones.

## Field mapping

| Section      | Title                        | Context               | Metadata                                                  | Body                                                                   |
| ------------ | ---------------------------- | --------------------- | --------------------------------------------------------- | ---------------------------------------------------------------------- |
| work         | position (else employer)     | employer (linked)     | location                                                  | description, then summary; highlights; keywords                        |
| projects     | name (linked)                | entity                | roles, type                                               | summary (a differing description is kept); highlights; keywords        |
| education    | institution (else study)     | studyType, area       | location, "Score" as supplied                             | summary; courses                                                       |
| certificates | name (linked)                | issuer                | expiry, credential ID                                     | summary                                                                |
| awards       | title                        | awarder               |                                                           | summary                                                                |
| publications | name (linked)                | publisher             | authors, type, volume/issue/pages, DOI, other identifiers | summary                                                                |
| volunteer    | position (else organization) | organization (linked) | location                                                  | summary; highlights                                                    |
| references   | name                         | relationship          | organization                                              | quotation, or "Available on request" when `availableOnRequest` is true |
| skills       | name                         |                       | level                                                     | keywords                                                               |
| languages    | language                     |                       |                                                           | fluency                                                                |
| interests    | name                         |                       |                                                           | keywords                                                               |

Display exclusions: `basics.image` and the street address/postal code are
hidden by default (see settings), and so is `meta`. Unknown extension
fields are never rendered.

Prose follows one rule: blank lines separate paragraphs and a single newline
becomes a line break. One pasted leading bullet character (`•`, `-`, `*`,
...) is removed from highlights. All text is escaped. Links accept only
`http(s)`, `mailto` and `tel`.

## Dates

There is one formatter and one range formatter. Dates are parsed from their
literal digits, so the server's timezone cannot shift a day. Precision is
preserved: `2021` → "2021", `2021-05` → "May 2021", `2021-05-09` → "9 May
2021". Ranges use an en dash.

A missing end date reads "Present" only for work and volunteer entries,
following `@jsonresume/utils`' `formatDateRange`. Elsewhere a one-sided
range reads "From May 2021" or "Until Sep 2024". An explicit `present` or
`current` end always reads "Present". Blank strings count as absent.
Malformed values are shown exactly as supplied, with no `<time>` element,
and are reported by `renderWithDiagnostics`.

## Settings

Settings are optional, live in a namespaced Pro extension under `meta`, and
never render:

```json
{
  "meta": {
    "pro": {
      "sectionOrder": ["skills", "work"],
      "showPortrait": false,
      "showFullAddress": false
    }
  }
}
```

The default order is Experience, Projects, Education, Certifications,
Awards, Publications, Volunteer Experience, Skills, Languages, Interests,
References. Sections listed in `sectionOrder` come first and the rest
follow in default order. Leaving a section out of the list never hides it.

## Print

`@page { margin: 16mm 18mm }`. Paper size is left to the printer or
exporter, so A4 and Letter both work. Print has its own tokens. The screen
container's width and padding are reset. Profiles show their addresses and
links lose their underline.

These elements avoid a page break directly after them: section titles,
entry headings and context lines. Small units avoid breaking inside: entry
headings, context lines, taxonomy rows and the masthead. Paragraphs and
list items keep at least two lines together. Whole entries and sections
are free to split.

## Verification record

Checked on Chromium 140 headless shell and agent-browser Chrome 150:

- **Fixtures** (`test/fixtures`): reference (registry.jsonresume.org/thomasdavis,
  fetched 23 Oct 2026, `meta.lastModified` 2026-07-22), sparse, dense (its
  first entry runs longer than a page), wrapping, coverage and
  international (with malformed dates).
- **Responsive matrix:** 4 fixtures × widths 320, 390, 630, 650, 768 and
  1280 × four conditions (normal, 200% text, WCAG 1.4.12 spacing overrides,
  font unavailable). 96 runs, with no horizontal overflow and no title/date
  overlap. Dates stack at ≤630px and share the row at ≥650px.
- **PDF:** the registry's exporter (`page.pdf`, zero margins) honors the
  theme's `@page` margins. A4 and Letter were both rendered and inspected
  page by page. Text is selectable and the fonts are embedded. Extracted
  text follows the reading order, and ligatures extract as plain letters.
- **Accessibility:** heading order is `h1` → `h2` → `h3`, focus is visible
  and follows reading order, forced colors keep links and rules, and both
  text colors exceed 4.5:1.

## Known limitations

- Controlled labels (section names, months, "Present") are English. When
  `meta.language` names another language, section headings carry
  `lang="en"`.
- The embedded faces cover Latin, Vietnamese, Greek and Cyrillic. Other
  scripts (CJK, Arabic, Hebrew) render in system fallback fonts, so
  right-to-left support has only been checked for mixed-direction text
  inside an LTR page.
- The PDF is not tagged. Chromium's exporter output is not an accessible
  PDF.
- Pro makes no ATS certification claim. Extracted text order was checked;
  that is all.
