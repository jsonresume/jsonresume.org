// Visual composition: shared primitives that every section adapter uses.
// Adapters describe an entry; these functions decide how it is marked up.

import { escapeHtml, paragraphs } from './text.js';

/** Link with the shared affordance, or escaped text when there is no href. */
export function link(label, href, className = '') {
  const cls = className ? ` class="${className}"` : '';
  const body = escapeHtml(label);
  return href
    ? `<a${cls} href="${escapeHtml(href)}">${body}</a>`
    : className
    ? `<span${cls}>${body}</span>`
    : body;
}

/** Paragraphs for prose, or '' when there is none. */
export function narrative(value, className = 'pro-narrative') {
  const blocks = paragraphs(value);
  if (blocks.length === 0) return '';
  const html = blocks
    .map((lines) => `<p>${lines.map(escapeHtml).join('<br>')}</p>`)
    .join('');
  return `<div class="${className}">${html}</div>`;
}

/** Joins nonempty HTML fragments with the shared separator. */
export function joinMeta(parts) {
  const present = parts.filter(Boolean);
  // The non-breaking space keeps each dot with the value before it, so a
  // wrapped line never starts with a separator.
  return present.join(
    '<span class="pro-sep" aria-hidden="true">&nbsp;· </span>'
  );
}

/**
 * One entry: title -> date -> context/metadata -> narrative -> highlights ->
 * compact groups. Every part is optional; a missing part leaves no markup
 * and so no gap.
 *
 * @param {object} e
 * @param {string|null} e.title       plain text
 * @param {string|null} e.titleHref
 * @param {string|null} e.date        HTML from dates.js
 * @param {string|null} e.context     plain text (italic role)
 * @param {string|null} e.contextHref
 * @param {string[]}    e.meta        HTML fragments (escaped by the caller)
 * @param {string[]}    e.prose       raw prose values, in order
 * @param {string[]}    e.highlights  plain text
 * @param {Array<{label: string|null, values: string[]}>} e.groups
 * @param {string}      [e.body]      extra HTML (e.g. a quotation)
 */
export function entry(e) {
  const parts = [];
  if (e.title || e.date) {
    const title = e.title
      ? `<h3 class="pro-entry-title">${link(e.title, e.titleHref)}</h3>`
      : '';
    const date = e.date ? `<p class="pro-date">${e.date}</p>` : '';
    parts.push(`<div class="pro-entry-head">${title}${date}</div>`);
  }
  const context = e.context
    ? `<span class="pro-context">${link(e.context, e.contextHref)}</span>`
    : null;
  const meta = (e.meta || []).filter(Boolean);
  if (context || meta.length) {
    const metaHtml = meta.length
      ? `<span class="pro-meta">${joinMeta(meta)}</span>`
      : null;
    parts.push(
      `<p class="pro-context-line">${joinMeta([context, metaHtml])}</p>`
    );
  }
  for (const value of e.prose || []) parts.push(narrative(value));
  if (e.body) parts.push(e.body);
  if (e.highlights?.length) {
    const items = e.highlights.map((h) => `<li>${escapeHtml(h)}</li>`);
    parts.push(`<ul class="pro-highlights">${items.join('')}</ul>`);
  }
  for (const group of e.groups || []) {
    if (!group.values.length) continue;
    const label = group.label
      ? `<span class="pro-group-label">${escapeHtml(group.label)}:</span> `
      : '';
    parts.push(
      `<p class="pro-group">${label}${group.values
        .map(escapeHtml)
        .join(', ')}</p>`
    );
  }
  const html = parts.filter(Boolean).join('');
  return html ? `<div class="pro-entry">${html}</div>` : '';
}

/**
 * Compact label/value rows (skills, languages, interests). Every row uses
 * the section-wide label track; a row without a label keeps its values on
 * the value edge.
 */
export function taxonomy(rows) {
  const items = rows
    .map(({ label, detail, values }) => {
      if (!label && !detail && values.length === 0) return '';
      const name = label
        ? `<span class="pro-tax-name">${escapeHtml(label)}</span>`
        : '';
      const level = detail
        ? `<span class="pro-tax-detail">${escapeHtml(detail)}</span>`
        : '';
      // A hidden colon keeps "Frontend: React" readable when copied or
      // read aloud.
      const colon = values.length ? '<span class="pro-sr">:</span>' : '';
      const head =
        name || level
          ? `<span class="pro-tax-label">${name}${level}${colon}</span>`
          : '';
      const body = values.length
        ? ` <span class="pro-tax-values">${values
            .map(escapeHtml)
            .join(', ')}</span>`
        : '';
      return `<li class="pro-tax-row">${head}${body}</li>`;
    })
    .filter(Boolean);
  return items.length ? `<ul class="pro-tax">${items.join('')}</ul>` : '';
}

/** A section with its heading and rule, or '' when it has no content. */
export function section(key, title, content, headingLang) {
  if (!content) return '';
  const lang = headingLang ? ` lang="${headingLang}"` : '';
  return `<section class="pro-section pro-section--${key}" aria-labelledby="pro-${key}"><h2 class="pro-section-title" id="pro-${key}"${lang}>${escapeHtml(
    title
  )}</h2><div class="pro-section-body">${content}</div></section>`;
}
