/**
 * Inline Markdown in resume text (#600).
 *
 * The schema allows CommonMark inline syntax only, in `summary` fields,
 * `work[].highlights[]`, `projects[].description` and
 * `projects[].highlights[]`: **strong**, *emphasis* (or _emphasis_),
 * `code` and [links](https://example.com). Block syntax (headings, lists,
 * tables) is not part of the format and stays as text. Themes render it
 * with `renderInlineMarkdown`, so every theme shows the same thing; plain
 * text consumers (ATS, .txt) use `stripInlineMarkdown`.
 *
 * Framework-free, and safe for resume text from anyone: everything is
 * escaped first, and links only keep http(s) and mailto addresses.
 *
 * @module @jsonresume/utils/markdown
 */

const ESCAPES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};
const escapeHtml = (text) => text.replace(/[&<>"']/g, (c) => ESCAPES[c]);

/** Characters a backslash makes literal, as CommonMark allows. */
const ESCAPABLE = /\\([\\`*_[\]()!#])/g;
const CODE = /`([^`]+)`/g;
const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;
const STRONG = /\*\*(?=\S)([^*]*?\S)\*\*|__(?=\S)([^_]*?\S)__/g;
// Underscores only at word edges, so snake_case and file_names stay as written.
const EMPHASIS =
  /\*(?=\S)([^*]*?\S)\*|(^|[^\p{L}\p{N}_])_(?=\S)([^_]*?\S)_(?![\p{L}\p{N}_])/gu;

const safeHref = (url) =>
  /^(https?:\/\/|mailto:)/i.test(url) ? url : undefined;

const emphasis = (text, strong, em) =>
  text
    .replace(STRONG, (_, a, b) => strong(a ?? b))
    .replace(EMPHASIS, (_, a, before, b) =>
      a !== undefined ? em(a) : `${before}${em(b)}`
    );

/**
 * Reads inline Markdown with the given output for each mark. Escaped
 * characters, code spans and whole links become placeholders first, so
 * emphasis is never read inside them (a link's label gets its own pass).
 */
const inline = (text, out) => {
  const kept = [];
  // A private-use character marks each placeholder; any in the text go first.
  const keep = (value) => `\uE000${kept.push(value) - 1}\uE000`;
  const marks = (t) => emphasis(t, out.strong, out.em);
  const rest = text
    .replace(/\uE000/g, '')
    .replace(ESCAPABLE, (_, c) => keep(out.text(c)))
    .replace(CODE, (_, body) => keep(out.code(body)))
    .replace(LINK, (_, label, url) =>
      keep(out.link(marks(out.text(label)), url))
    );
  return marks(out.text(rest)).replace(
    /\uE000(\d+)\uE000/g,
    (_, i) => kept[Number(i)]
  );
};

/**
 * Resume text with inline Markdown as HTML: escaped, with <strong>, <em>,
 * <code> and <a> for what the text marks. Non-strings render as ''.
 *
 * @param {unknown} text
 * @returns {string}
 * @example
 * renderInlineMarkdown('Cut costs **40%** with [Rust](https://rust-lang.org)')
 * // 'Cut costs <strong>40%</strong> with <a href="https://rust-lang.org">Rust</a>'
 */
export function renderInlineMarkdown(text) {
  if (typeof text !== 'string') return '';
  return inline(text, {
    text: escapeHtml,
    code: (body) => `<code>${escapeHtml(body)}</code>`,
    link: (label, url) => {
      const href = safeHref(url);
      return href ? `<a href="${escapeHtml(href)}">${label}</a>` : label;
    },
    strong: (t) => `<strong>${t}</strong>`,
    em: (t) => `<em>${t}</em>`,
  });
}

/**
 * Resume text with its inline Markdown removed, for plain-text consumers:
 * emphasis and code marks dropped, links as their label.
 *
 * @param {unknown} text
 * @returns {string}
 * @example
 * stripInlineMarkdown('Cut costs **40%** with [Rust](https://rust-lang.org)')
 * // 'Cut costs 40% with Rust'
 */
export function stripInlineMarkdown(text) {
  if (typeof text !== 'string') return '';
  const same = (t) => t;
  return inline(text, {
    text: same,
    code: same,
    link: same,
    strong: same,
    em: same,
  });
}
