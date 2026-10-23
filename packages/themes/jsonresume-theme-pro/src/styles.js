// The stylesheet: tokens first, then components, then the responsive and
// print overrides. Screen and print values for the same token sit together
// in the two :root blocks so they are easy to compare.

import { FONT_FACES } from './fonts.generated.js';

const fontFaces = FONT_FACES.map(
  ({ weight, style, data }) => `@font-face {
  font-family: 'Source Serif 4';
  font-style: ${style};
  font-weight: ${weight};
  font-display: swap;
  src: url(data:font/woff2;base64,${data}) format('woff2');
}`
).join('\n');

const css = `
:root {
  --pro-font-body: 'Source Serif 4', Georgia, 'Times New Roman', serif;

  --pro-paper: #ffffff;
  --pro-text: #202020;
  --pro-text-secondary: #4b4b4b;
  --pro-rule-color: #b8b8b2;
  --pro-focus: #174ea6;
  --pro-rule: 1px;

  --pro-measure: 42rem;
  --pro-gutter: clamp(1rem, 4vw, 2rem);
  --pro-pad-top: 2rem;
  --pro-pad-bottom: 2.5rem;

  /* type: size / unitless leading */
  --pro-size-name: clamp(1.875rem, 1.45rem + 2.2vw, 2.25rem);
  --pro-lead-name: 1.12;
  --pro-size-label: 1.03125rem;
  --pro-lead-label: 1.4;
  --pro-size-section: 1.15625rem;
  --pro-lead-section: 1.25;
  --pro-size-title: 1.03125rem;
  --pro-lead-title: 1.3;
  --pro-size-context: 1rem;
  --pro-lead-context: 1.35;
  --pro-size-body: 1.03125rem;
  --pro-lead-body: 1.45;
  --pro-size-meta: 0.9375rem;
  --pro-lead-meta: 1.35;
  --pro-size-contact: 0.9375rem;
  --pro-lead-contact: 1.4;

  /* spacing: internal < entry < section */
  --pro-gap-title-context: 0.125rem;
  --pro-gap-meta-narrative: 0.375rem;
  --pro-gap-paragraph: 0.5rem;
  --pro-gap-narrative-list: 0.375rem;
  --pro-gap-list-item: 0.25rem;
  --pro-gap-entry: 1.125rem;
  --pro-gap-row: 0.375rem;
  --pro-gap-title-rule: 0.3125rem;
  --pro-gap-rule-content: 0.625rem;
  --pro-gap-section: 1.75rem;
  --pro-gap-contact-summary: 1.125rem;
  --pro-gap-summary-section: 1.5rem;
  --pro-gap-contact-col: 1.1em;
  --pro-gap-contact-row: 0.15rem;

  --pro-list-inset: 1.15em;
  --pro-label-track: 9.5rem;
  --pro-label-gap: 0.75rem;
  --pro-portrait: 5.5rem;
}

@media print {
  :root {
    --pro-size-name: 25pt;
    --pro-lead-name: 1.1;
    --pro-size-label: 11pt;
    --pro-lead-label: 1.25;
    --pro-size-section: 12pt;
    --pro-lead-section: 1.2;
    --pro-size-title: 11pt;
    --pro-lead-title: 1.25;
    --pro-size-context: 10.5pt;
    --pro-lead-context: 1.25;
    --pro-size-body: 11pt;
    --pro-lead-body: 1.3;
    --pro-size-meta: 10.25pt;
    --pro-lead-meta: 1.25;
    --pro-size-contact: 10.25pt;
    --pro-lead-contact: 1.25;

    --pro-gap-title-context: 0.5mm;
    --pro-gap-meta-narrative: 1.5mm;
    --pro-gap-paragraph: 2mm;
    --pro-gap-narrative-list: 1.5mm;
    --pro-gap-list-item: 0.75mm;
    --pro-gap-entry: 4mm;
    --pro-gap-row: 1.5mm;
    --pro-gap-title-rule: 1mm;
    --pro-gap-rule-content: 2.5mm;
    --pro-gap-section: 6mm;
    --pro-gap-contact-summary: 4mm;
    --pro-gap-summary-section: 5mm;
    --pro-gap-contact-row: 0.5mm;
    --pro-rule: 0.5pt;
    --pro-label-track: 34mm;
    --pro-label-gap: 3mm;
    --pro-portrait: 22mm;
  }
}

html {
  background: var(--pro-paper);
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
}

body {
  margin: 0;
  background: var(--pro-paper);
  color: var(--pro-text);
}

.pro {
  box-sizing: border-box;
  max-width: calc(var(--pro-measure) + 2 * var(--pro-gutter));
  margin-inline: auto;
  padding: var(--pro-pad-top) var(--pro-gutter) var(--pro-pad-bottom);
  font-family: var(--pro-font-body);
  font-size: var(--pro-size-body);
  line-height: var(--pro-lead-body);
  font-kerning: normal;
  font-variant-ligatures: common-ligatures;
  overflow-wrap: break-word;
}

.pro *,
.pro *::before,
.pro *::after {
  box-sizing: inherit;
}

.pro :where(h1, h2, h3, p, ul, blockquote) {
  margin: 0;
  padding: 0;
}

/* links: quiet underline, same color as their role */
.pro a {
  color: inherit;
  text-decoration-line: underline;
  text-decoration-thickness: 0.06em;
  text-underline-offset: 0.18em;
  text-decoration-color: color-mix(in srgb, currentColor 45%, transparent);
}
.pro a:hover {
  text-decoration-color: currentColor;
}
.pro a:focus-visible {
  outline: 2px solid var(--pro-focus);
  outline-offset: 2px;
  border-radius: 1px;
}

.pro-sr {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}
.pro-print {
  display: none;
}
.pro-nowrap {
  white-space: nowrap;
}

/* masthead */
.pro-masthead {
  text-align: center;
}
.pro-masthead--portrait {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 1rem 1.5rem;
}
.pro-masthead--portrait .pro-identity {
  flex: 0 1 30rem;
  min-width: min(100%, 16rem);
}
.pro-portrait {
  display: block;
  width: auto;
  height: auto;
  max-width: var(--pro-portrait);
  max-height: var(--pro-portrait);
}
.pro-name {
  font-size: var(--pro-size-name);
  line-height: var(--pro-lead-name);
  font-weight: 600;
  letter-spacing: -0.005em;
}
.pro-label {
  margin-block-start: 0.25rem;
  font-size: var(--pro-size-label);
  line-height: var(--pro-lead-label);
}
.pro-contacts {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--pro-gap-contact-row) var(--pro-gap-contact-col);
  list-style: none;
  font-size: var(--pro-size-contact);
  line-height: var(--pro-lead-contact);
  color: var(--pro-text-secondary);
}
.pro-contacts li {
  min-width: 0;
  max-width: 100%;
}
.pro-contacts a {
  overflow-wrap: anywhere;
}
.pro-label + .pro-contacts,
.pro-name + .pro-contacts {
  margin-block-start: 0.5rem;
}
.pro-contacts + .pro-contacts {
  margin-block-start: var(--pro-gap-contact-row);
}

.pro-summary {
  margin-block-start: var(--pro-gap-contact-summary);
}
.pro-summary p + p,
.pro-narrative p + p,
.pro-quote-text p + p {
  margin-block-start: var(--pro-gap-paragraph);
}

/* section: heading, rule, rhythm */
.pro-section {
  margin-block-start: var(--pro-gap-section);
}
.pro-summary + .pro-section,
.pro-masthead + .pro-section {
  margin-block-start: var(--pro-gap-summary-section);
}
.pro-section-title {
  font-size: var(--pro-size-section);
  line-height: var(--pro-lead-section);
  font-weight: 600;
  padding-block-end: var(--pro-gap-title-rule);
  border-block-end: var(--pro-rule) solid var(--pro-rule-color);
  margin-block-end: var(--pro-gap-rule-content);
}

.pro-entries > * + * {
  margin-block-start: var(--pro-gap-entry);
}

/* entry: heading row, context line, prose, evidence */
.pro-entry-head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  column-gap: 1rem;
}
.pro-entry-title {
  flex: 1 1 20rem;
  min-width: 0;
  font-size: var(--pro-size-title);
  line-height: var(--pro-lead-title);
  font-weight: 600;
}
.pro-date {
  flex: 0 1 auto;
  font-size: var(--pro-size-meta);
  line-height: var(--pro-lead-meta);
  color: var(--pro-text-secondary);
  font-variant-numeric: tabular-nums;
}
.pro-entry-head .pro-date:only-child {
  flex-grow: 1;
}
.pro-entry > * + .pro-context-line {
  margin-block-start: var(--pro-gap-title-context);
}
.pro-context-line {
  font-size: var(--pro-size-context);
  line-height: var(--pro-lead-context);
  color: var(--pro-text-secondary);
}
.pro-context {
  font-style: italic;
  color: var(--pro-text);
}
.pro-context-line .pro-meta,
.pro-context-line .pro-sep {
  font-size: var(--pro-size-meta);
  font-variant-numeric: tabular-nums;
}
.pro-entry > * + :is(.pro-narrative, .pro-quote) {
  margin-block-start: var(--pro-gap-meta-narrative);
}
.pro-entry > .pro-narrative + .pro-narrative {
  margin-block-start: var(--pro-gap-paragraph);
}
.pro-entry > * + .pro-highlights {
  margin-block-start: var(--pro-gap-narrative-list);
}
.pro-entry > * + .pro-group {
  margin-block-start: var(--pro-gap-meta-narrative);
}
.pro-highlights {
  padding-inline-start: var(--pro-list-inset);
}
.pro-highlights li {
  padding-inline-start: 0.1em;
}
.pro-highlights li + li {
  margin-block-start: var(--pro-gap-list-item);
}
.pro-highlights li::marker {
  color: var(--pro-text-secondary);
}
.pro-group {
  font-size: var(--pro-size-meta);
  line-height: var(--pro-lead-meta);
  color: var(--pro-text-secondary);
}
.pro-group-label {
  font-weight: 600;
  color: var(--pro-text);
}

/* references: a quotation, at reading size */
.pro-quote {
  margin: 0;
}

/* taxonomy: one shared label track for the whole section */
.pro-tax {
  list-style: none;
}
.pro-tax-row {
  display: grid;
  grid-template-columns: var(--pro-label-track) minmax(0, 1fr);
  column-gap: var(--pro-label-gap);
  align-items: baseline;
}
.pro-tax-row + .pro-tax-row {
  margin-block-start: var(--pro-gap-row);
}
.pro-tax-label {
  grid-column: 1;
  min-width: 0;
}
.pro-tax-name {
  font-weight: 600;
}
.pro-tax-detail {
  display: block;
  font-size: var(--pro-size-meta);
  line-height: var(--pro-lead-meta);
  color: var(--pro-text-secondary);
}
.pro-tax-values {
  grid-column: 2;
}

@media screen and (max-width: 40rem) {
  :root {
    --pro-pad-top: 1.5rem;
    --pro-pad-bottom: 1.5rem;
  }
  .pro-entry-title,
  .pro-date {
    flex-basis: 100%;
  }
  .pro-tax-row {
    grid-template-columns: minmax(0, 1fr);
    row-gap: 0.0625rem;
  }
  .pro-tax-label,
  .pro-tax-values {
    grid-column: 1;
  }
  .pro-tax-label .pro-tax-detail {
    display: inline;
  }
  .pro-tax-name + .pro-tax-detail::before {
    content: ' · ';
  }
}

@media (forced-colors: active) {
  .pro-section-title {
    border-block-end-color: CanvasText;
  }
  .pro a {
    text-decoration-color: currentColor;
  }
}

@page {
  margin: 16mm 18mm;
}

@media print {
  html,
  body {
    background: #ffffff;
  }
  .pro {
    max-width: none;
    margin: 0;
    padding: 0;
  }
  .pro a {
    text-decoration: none;
  }
  .pro-screen {
    display: none;
  }
  .pro-print {
    display: inline;
  }
  .pro-section-title,
  .pro-entry-head,
  .pro-context-line {
    break-after: avoid;
    page-break-after: avoid;
  }
  .pro-entry-head,
  .pro-context-line,
  .pro-tax-row,
  .pro-masthead {
    break-inside: avoid;
    page-break-inside: avoid;
  }
  .pro p,
  .pro li {
    orphans: 2;
    widows: 2;
  }
}
`;

export const stylesheet = `${fontFaces}\n${css}`;
