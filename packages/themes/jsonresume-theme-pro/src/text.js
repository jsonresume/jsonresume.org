// Input adaptation helpers: presence, escaping, safe links and text blocks.

const ESCAPES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (c) => ESCAPES[c]);

/**
 * Normalizes a supplied scalar to display text. Absent, null, whitespace-only
 * and non-text values (objects, booleans) become null; finite numbers,
 * including 0, keep their textual form.
 */
export function text(value) {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? String(value) : null;
  }
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
}

/** Array of display strings with absent items removed. */
export function textList(value) {
  if (!Array.isArray(value)) return [];
  return value.map(text).filter((v) => v !== null);
}

export const isObject = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

const SAFE_SCHEMES = new Set(['http:', 'https:', 'mailto:', 'tel:']);

/**
 * Returns an href for an author-supplied URL, or null when it is malformed or
 * uses a scheme other than http(s), mailto or tel. Bare domains such as
 * "example.com/work" are treated as https.
 */
export function safeHref(value) {
  const raw = text(value);
  if (!raw || /\s/.test(raw)) return null;
  const candidate = /^[a-z][a-z0-9+.-]*:/i.test(raw) ? raw : `https://${raw}`;
  try {
    const url = new URL(candidate);
    if (!SAFE_SCHEMES.has(url.protocol)) return null;
    if (url.protocol.startsWith('http') && !url.hostname.includes('.')) {
      return null;
    }
    return url.href;
  } catch {
    return null;
  }
}

/** "https://www.example.com/work/" -> "example.com/work" */
export function displayUrl(href) {
  try {
    const url = new URL(href);
    const host = url.hostname.replace(/^www\./, '');
    const path = decodeURI(url.pathname).replace(/\/+$/, '');
    return `${host}${path}${url.search}`;
  } catch {
    return href;
  }
}

/** mailto: for a plausible single address, otherwise null. */
export function mailtoHref(value) {
  const email = text(value);
  if (!email || !/^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/.test(email)) {
    return null;
  }
  return `mailto:${email}`;
}

/**
 * tel: from the displayed number, keeping digits and a leading +. Extensions
 * and letters make the number ambiguous, so they yield no link. No country
 * code is ever added.
 */
export function telHref(value) {
  const phone = text(value);
  if (!phone || /[a-z]/i.test(phone)) return null;
  // "+61 (0)7 ..." - the bracketed trunk zero is not dialled after a +.
  const dialled = phone.startsWith('+') ? phone.replace(/\(0\)/g, '') : phone;
  const digits = dialled.replace(/[^\d+]/g, '');
  const normalized = digits.startsWith('+')
    ? `+${digits.slice(1).replace(/\+/g, '')}`
    : digits.replace(/\+/g, '');
  const count = normalized.replace(/\D/g, '').length;
  return count >= 3 && count <= 15 ? `tel:${normalized}` : null;
}

/**
 * Splits prose into paragraphs on blank lines. A single newline inside a
 * paragraph is kept as a line break; runs of spaces and tabs collapse.
 * Returns arrays of lines per paragraph.
 */
export function paragraphs(value) {
  const raw = text(value);
  if (!raw) return [];
  return raw
    .replace(/\r\n?/g, '\n')
    .split(/\n[ \t]*\n+/)
    .map((block) =>
      block
        .split('\n')
        .map((line) => line.replace(/[ \t]+/g, ' ').trim())
        .filter(Boolean)
    )
    .filter((lines) => lines.length > 0);
}

// One leading presentation bullet that some editors paste into highlights.
const LEGACY_MARKER = /^[•◦▪▸►‣·∙*-]\s+/u;

/** Highlights with a single pasted leading bullet character removed. */
export function highlightList(value) {
  return textList(value)
    .map((item) => item.replace(LEGACY_MARKER, ''))
    .filter(Boolean);
}
