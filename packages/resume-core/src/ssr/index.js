/**
 * @jsonresume/core/ssr
 *
 * Server-side render helpers for JSON Resume themes. Every JSX theme's
 * `render(resume)` repeats the same boilerplate: spin up a styled-components
 * ServerStyleSheet, collect styles while rendering, emit a full
 * `<!DOCTYPE html>` document with Google Font <link>s in the <head>, and seal
 * the sheet. This module factors that out so a theme's render() can be a single
 * call to `renderResumeDocument(<Resume resume={resume} />, { fonts, title })`.
 *
 * SSR-safe: imports only react-dom/server + styled-components (both already
 * core peer/deps) and touches no window/document at module load.
 *
 * @module @jsonresume/core/ssr
 */
import { renderToStaticMarkup } from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';

/**
 * Minimal, opt-in CSS reset (margin/padding zero + border-box). Themes that
 * already ship their own reset leave this off (default); ATS-plain themes that
 * want a clean slate pass `reset: true`.
 */
const CSS_RESET =
  '<style>*,*::before,*::after{box-sizing:border-box}' +
  'html,body{margin:0;padding:0}body{-webkit-font-smoothing:antialiased}</style>';

/** Stylesheet href for the @jsonresume/core design tokens (CSS custom props). */
const TOKENS_CSS_HREF = 'https://unpkg.com/@jsonresume/core/dist/tokens.css';

const FONTS_PRECONNECT =
  '<link rel="preconnect" href="https://fonts.googleapis.com">' +
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>';

/** A value is a ready-made href if it already looks like a URL or <link> tag. */
function isHref(value) {
  return /^(https?:)?\/\//.test(value) || value.trim().startsWith('<link');
}

/** Turn a Google font family name into the css2 `family=` query fragment. */
function familyParam(family) {
  // Preserve any axis spec the caller appended (e.g. "Inter:wght@400;700"),
  // only the family portion needs its spaces turned into '+'.
  const [name, ...rest] = String(family).split(':');
  const encodedName = name.trim().replace(/\s+/g, '+');
  return rest.length ? `${encodedName}:${rest.join(':')}` : encodedName;
}

/**
 * Build the Google Fonts <link> markup for the given families.
 *
 * Accepts either bare family names / `Family:axis@weights` specs (combined into
 * a single css2 request) or fully-formed href strings / `<link>` tags (passed
 * through verbatim). Returns an empty string when given nothing.
 *
 * @param {string[]} [families]
 * @returns {string}
 */
export function googleFontsLinks(families) {
  if (!Array.isArray(families) || families.length === 0) return '';

  const passthrough = [];
  const names = [];
  for (const entry of families) {
    if (entry == null || entry === '') continue;
    if (isHref(entry)) passthrough.push(entry);
    else names.push(entry);
  }

  const links = passthrough.map((href) =>
    href.trim().startsWith('<link')
      ? href
      : `<link href="${href}" rel="stylesheet">`
  );

  if (names.length > 0) {
    const query = names.map(familyParam).join('&family=');
    links.unshift(
      `<link href="https://fonts.googleapis.com/css2?family=${query}&display=swap" rel="stylesheet">`
    );
  }

  if (links.length === 0) return '';
  return FONTS_PRECONNECT + links.join('');
}

/**
 * Render a React element to a complete, styled HTML document string using the
 * same ServerStyleSheet path themes hand-roll today. The sheet is ALWAYS sealed
 * in a finally block so collected styles never leak between renders.
 *
 * @param {import('react').ReactElement} element  Root resume element to render.
 * @param {object} [options]
 * @param {string[]} [options.fonts]            Google font families OR hrefs.
 * @param {string}   [options.title]            <title> text (omitted if falsy).
 * @param {string}   [options.lang='en']        <html lang> attribute.
 * @param {string}   [options.dir='ltr']        <html dir> attribute.
 * @param {boolean}  [options.reset=false]      Include the minimal CSS reset.
 * @param {string}   [options.head='']          Raw HTML inserted in <head> BEFORE the
 *   styled-components tags (base styles a theme's components then override — e.g. a
 *   `:root` design-token block or a CSS reset).
 * @param {string}   [options.headAfterStyles=''] Raw HTML inserted in <head> AFTER the
 *   styled-components tags (styles that must OVERRIDE component styles — e.g. a global
 *   reset, body background, or `@media print`/`@page` rules). Composes with `head`:
 *   a theme can pass both to reproduce an inline-style block on each side.
 * @param {boolean}  [options.includeTokensCss=true] Link @jsonresume/core tokens.
 * @param {string}   [options.bodyClass]        class attribute on <body>.
 * @returns {string} Full `<!DOCTYPE html>...` document.
 */
export function renderResumeDocument(element, options = {}) {
  const {
    fonts,
    title,
    lang = 'en',
    dir = 'ltr',
    reset = false,
    head = '',
    headAfterStyles = '',
    includeTokensCss = true,
    bodyClass,
  } = options;

  const sheet = new ServerStyleSheet();
  let html;
  let styleTags;
  try {
    html = renderToStaticMarkup(sheet.collectStyles(element));
    styleTags = sheet.getStyleTags();
  } finally {
    sheet.seal();
  }

  const fontLinks = googleFontsLinks(fonts);
  const tokensLink = includeTokensCss
    ? `<link rel="stylesheet" href="${TOKENS_CSS_HREF}">`
    : '';
  const resetTag = reset ? CSS_RESET : '';
  const titleTag = title ? `<title>${title}</title>` : '';
  const bodyAttr = bodyClass ? ` class="${bodyClass}"` : '';

  return (
    '<!DOCTYPE html>' +
    `<html lang="${lang}" dir="${dir}">` +
    '<head>' +
    '<meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">' +
    fontLinks +
    tokensLink +
    resetTag +
    head +
    styleTags +
    headAfterStyles +
    titleTag +
    '</head>' +
    `<body${bodyAttr}>${html}</body>` +
    '</html>'
  );
}

export default { renderResumeDocument, googleFontsLinks };
