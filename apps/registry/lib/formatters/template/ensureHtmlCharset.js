/**
 * Guarantees rendered theme HTML declares UTF-8.
 *
 * Some external themes (e.g. jsonresume-theme-elegant, the registry
 * default) emit HTML without a <meta charset> tag. Combined with a
 * Content-Type header lacking a charset, browsers fall back to a
 * platform-default encoding and multi-byte UTF-8 sequences render as
 * mojibake ("é" -> "├⌐"). See issue #471.
 */

const CHARSET_DECLARATION =
  /<meta[^>]+(?:charset\s*=|http-equiv\s*=\s*["']?content-type)/i;

const META_CHARSET = '<meta charset="utf-8">';

export function ensureHtmlCharset(html) {
  if (typeof html !== 'string' || CHARSET_DECLARATION.test(html)) {
    return html;
  }

  // Inject just inside <head> so the declaration sits within the first
  // 1024 bytes; fall back to after <html> or the doctype, and finally
  // to prepending for headless fragments.
  const insertionPoint =
    html.match(/<head(?:\s[^>]*)?>/i) ||
    html.match(/<html(?:\s[^>]*)?>/i) ||
    html.match(/<!doctype[^>]*>/i);

  if (insertionPoint) {
    const index = insertionPoint.index + insertionPoint[0].length;
    return html.slice(0, index) + META_CHARSET + html.slice(index);
  }

  return META_CHARSET + html;
}
