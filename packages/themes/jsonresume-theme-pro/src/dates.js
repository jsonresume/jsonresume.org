// One date formatter and one range formatter, shared by every section.
// Dates are parsed from their literal digits, never through Date(), so no
// server timezone can move a day across a boundary.

import { escapeHtml, text } from './text.js';

const PATTERN =
  /^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?(?:T[\d:.]+(?:Z|[+-]\d{2}:?\d{2})?)?$/;
const ONGOING = /^(present|current|now|ongoing)$/i;

const daysIn = (year, month) => new Date(Date.UTC(year, month, 0)).getUTCDate();

/**
 * Parses a supplied ISO 8601 date (YYYY, YYYY-MM or YYYY-MM-DD, optionally
 * with a time part, which is ignored) keeping its precision.
 * Returns null for absent values, { ongoing: true } for "present"-style
 * markers and { raw } for nonempty text that is not a valid date.
 */
export function parseDate(value) {
  const raw = text(value);
  if (raw === null) return null;
  if (ONGOING.test(raw)) return { ongoing: true, raw };
  const match = PATTERN.exec(raw);
  if (!match) return { raw };
  const year = Number(match[1]);
  const month = match[2] ? Number(match[2]) : null;
  const day = match[3] ? Number(match[3]) : null;
  if (month !== null && (month < 1 || month > 12)) return { raw };
  if (day !== null && (day < 1 || day > daysIn(year, month))) return { raw };
  return { year, month, day };
}

/** { label, datetime } for a parsed date; datetime only for valid dates. */
export function dateParts(parsed, labels) {
  if (!parsed) return null;
  if (parsed.ongoing) return { label: labels.present, datetime: null };
  if (parsed.raw !== undefined) return { label: parsed.raw, datetime: null };
  const { year, month, day } = parsed;
  const pad = (n) => String(n).padStart(2, '0');
  if (month === null) return { label: String(year), datetime: String(year) };
  const monthName = labels.months[month - 1];
  if (day === null) {
    return { label: `${monthName} ${year}`, datetime: `${year}-${pad(month)}` };
  }
  return {
    label: `${day} ${monthName} ${year}`,
    datetime: `${year}-${pad(month)}-${pad(day)}`,
  };
}

const timeHtml = (part) => {
  const label = escapeHtml(part.label);
  return part.datetime
    ? `<time class="pro-nowrap" datetime="${part.datetime}">${label}</time>`
    : `<span class="pro-nowrap">${label}</span>`;
};

/**
 * HTML for a single supplied date (awards, certificates, publications), or
 * null when absent. Collects a diagnostic for malformed values, which are
 * still shown as supplied.
 */
export function singleDateHtml(value, ctx) {
  const parsed = parseDate(value);
  if (!parsed) return null;
  if (parsed.raw !== undefined && !parsed.ongoing) {
    ctx.diagnostics.push(`Unrecognized date "${parsed.raw}"`);
  }
  return timeHtml(dateParts(parsed, ctx.labels));
}

/**
 * HTML for a start/end range, or null when neither endpoint is supplied.
 * `ongoingWhenOpen` applies the host convention that a missing end date
 * means the entry is current; elsewhere a one-ended range says From/Until.
 */
export function rangeHtml(start, end, ctx, { ongoingWhenOpen = false } = {}) {
  const labels = ctx.labels;
  const from = parseDate(start);
  let to = parseDate(end);
  for (const p of [from, to]) {
    if (p && p.raw !== undefined && !p.ongoing) {
      ctx.diagnostics.push(`Unrecognized date "${p.raw}"`);
    }
  }
  if (!from && !to) return null;
  if (from && !to && ongoingWhenOpen) to = { ongoing: true };
  if (from && to) {
    const a = dateParts(from, labels);
    const b = dateParts(to, labels);
    if (a.label === b.label) return timeHtml(a);
    // The non-breaking space keeps the dash with the start, so a range that
    // must wrap breaks cleanly after it.
    return `${timeHtml(a)}&nbsp;– ${timeHtml(b)}`;
  }
  if (from) {
    if (from.ongoing) return timeHtml(dateParts(from, labels));
    return `${escapeHtml(labels.from)}&nbsp;${timeHtml(
      dateParts(from, labels)
    )}`;
  }
  if (to.ongoing) return timeHtml(dateParts(to, labels));
  return `${escapeHtml(labels.until)}&nbsp;${timeHtml(dateParts(to, labels))}`;
}
