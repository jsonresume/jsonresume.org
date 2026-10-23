// Input adaptation per JSON Resume section. Each adapter understands its own
// fields and hands the shared primitives a neutral entry description.

import { entry, link, narrative, taxonomy } from './components.js';
import { rangeHtml, singleDateHtml } from './dates.js';
import { formatLocation } from './location.js';
import {
  escapeHtml,
  highlightList,
  isObject,
  safeHref,
  text,
  textList,
} from './text.js';

const items = (value) => (Array.isArray(value) ? value.filter(isObject) : []);

/** Title with fallback; the fallback is not repeated as context. */
function titled(preferred, fallback) {
  const title = text(preferred);
  const context = text(fallback);
  if (title) return { title, context };
  return { title: context, context: null, usedFallback: true };
}

/** Distinct prose values in order; identical aliases render once. */
function prose(...values) {
  const out = [];
  for (const v of values) {
    const t = text(v);
    if (t && !out.includes(t)) out.push(t);
  }
  return out;
}

const meta = (...values) => values.map(text).filter(Boolean).map(escapeHtml);

function work(list, ctx) {
  return items(list).map((w) => {
    const { title, context, usedFallback } = titled(
      w.position,
      w.name ?? w.company
    );
    const href = safeHref(w.url);
    return entry({
      title,
      titleHref: usedFallback ? href : null,
      date: rangeHtml(w.startDate, w.endDate, ctx, { ongoingWhenOpen: true }),
      context,
      contextHref: usedFallback ? null : href,
      meta: meta(formatLocation(w.location)),
      // Employer description first, then the role summary (both kept).
      prose: prose(w.description, w.summary),
      highlights: highlightList(w.highlights),
      groups: [{ label: null, values: textList(w.keywords) }],
    });
  });
}

function volunteer(list, ctx) {
  return items(list).map((v) => {
    const { title, context, usedFallback } = titled(v.position, v.organization);
    const href = safeHref(v.url);
    return entry({
      title,
      titleHref: usedFallback ? href : null,
      date: rangeHtml(v.startDate, v.endDate, ctx, { ongoingWhenOpen: true }),
      context,
      contextHref: usedFallback ? null : href,
      meta: meta(formatLocation(v.location)),
      prose: prose(v.summary),
      highlights: highlightList(v.highlights),
    });
  });
}

function projects(list, ctx) {
  return items(list).map((p) => {
    const roles = textList(p.roles).join(', ');
    return entry({
      title: text(p.name),
      titleHref: safeHref(p.url),
      date: rangeHtml(p.startDate, p.endDate, ctx),
      context: text(p.entity),
      meta: meta(roles, p.type),
      // summary is preferred (#296); a differing legacy description is kept.
      prose: prose(p.summary, p.description),
      highlights: highlightList(p.highlights),
      groups: [{ label: null, values: textList(p.keywords) }],
    });
  });
}

function education(list, ctx) {
  return items(list).map((e) => {
    const study = [text(e.studyType), text(e.area)].filter(Boolean).join(', ');
    const { title, context } = titled(e.institution, study);
    const score = text(e.score);
    return entry({
      title,
      titleHref: safeHref(e.url),
      date: rangeHtml(e.startDate, e.endDate, ctx),
      context,
      meta: [
        ...meta(formatLocation(e.location)),
        score ? `${escapeHtml(ctx.labels.score)} ${escapeHtml(score)}` : null,
      ],
      prose: prose(e.summary),
      groups: [{ label: ctx.labels.courses, values: textList(e.courses) }],
    });
  });
}

function certificates(list, ctx) {
  return items(list).map((c) => {
    const expiry = singleDateHtml(c.expiryDate, ctx);
    const credential = text(c.credentialId);
    return entry({
      title: text(c.name),
      titleHref: safeHref(c.url),
      date: singleDateHtml(c.date, ctx),
      context: text(c.issuer),
      meta: [
        expiry ? `${escapeHtml(ctx.labels.expires)}&nbsp;${expiry}` : null,
        credential
          ? `${escapeHtml(ctx.labels.credential)} ${escapeHtml(credential)}`
          : null,
      ],
      prose: prose(c.summary),
    });
  });
}

function awards(list, ctx) {
  return items(list).map((a) =>
    entry({
      title: text(a.title),
      date: singleDateHtml(a.date, ctx),
      context: text(a.awarder),
      prose: prose(a.summary),
    })
  );
}

function publications(list, ctx) {
  return items(list).map((p) => {
    const L = ctx.labels;
    const ids = isObject(p.identifiers) ? p.identifiers : {};
    const doi = text(ids.doi);
    const doiHref = doi ? safeHref(`https://doi.org/${doi}`) : null;
    const locator = [
      text(p.volume) && `${L.volume}\u00a0${text(p.volume)}`,
      text(p.issue) && `${L.issue}\u00a0${text(p.issue)}`,
      text(p.pages) && `${L.pages}\u00a0${text(p.pages)}`,
    ]
      .filter(Boolean)
      .join(', ');
    const otherIds = Object.entries(ids)
      .filter(([k]) => k !== 'doi')
      .map(([k, v]) => text(v) && `${k.toUpperCase()} ${text(v)}`)
      .filter(Boolean);
    return entry({
      title: text(p.name),
      titleHref: safeHref(p.url),
      date: singleDateHtml(p.releaseDate, ctx),
      context: text(p.publisher),
      meta: [
        ...meta(textList(p.authors).join(', '), p.type, locator),
        doi ? `DOI&nbsp;${link(doi, doiHref)}` : null,
        ...otherIds.map(escapeHtml),
      ],
      prose: prose(p.summary),
    });
  });
}

function references(list, ctx) {
  return items(list).map((r) => {
    const quote = narrative(r.reference, 'pro-quote-text');
    const onRequest =
      !quote && r.availableOnRequest === true
        ? `<p class="pro-narrative">${escapeHtml(ctx.labels.onRequest)}</p>`
        : '';
    return entry({
      title: text(r.name),
      date: singleDateHtml(r.date, ctx),
      context: text(r.relationship),
      meta: meta(r.organization),
      body: quote
        ? `<blockquote class="pro-quote">${quote}</blockquote>`
        : onRequest,
    });
  });
}

function skills(list) {
  return taxonomy(
    items(list).map((s) => ({
      label: text(s.name),
      detail: text(s.level),
      values: textList(s.keywords),
    }))
  );
}

function languages(list) {
  return taxonomy(
    items(list).map((l) => ({
      label: text(l.language),
      detail: null,
      values: textList([l.fluency]),
    }))
  );
}

function interests(list) {
  return taxonomy(
    items(list).map((i) => ({
      label: text(i.name),
      detail: null,
      values: textList(i.keywords),
    }))
  );
}

const ENTRY_SECTIONS = {
  work,
  volunteer,
  projects,
  education,
  certificates,
  awards,
  publications,
  references,
};
const TAXONOMY_SECTIONS = { skills, languages, interests };

/** Section body HTML, or '' when the section has nothing to render. */
export function sectionContent(key, resume, ctx) {
  if (TAXONOMY_SECTIONS[key]) return TAXONOMY_SECTIONS[key](resume[key], ctx);
  const entries = ENTRY_SECTIONS[key](resume[key], ctx).filter(Boolean);
  return entries.length
    ? `<div class="pro-entries">${entries.join('')}</div>`
    : '';
}
