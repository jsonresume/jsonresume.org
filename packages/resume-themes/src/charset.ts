const CHARSET_DECLARATION =
  /<meta[^>]+(?:charset\s*=|http-equiv\s*=\s*["']?content-type)/i;
const META_CHARSET = '<meta charset="utf-8">';

/**
 * Make sure theme HTML declares UTF-8: some themes (elegant, the default)
 * omit it, and browsers then show "é" as mojibake (#471). The tag goes just
 * inside <head>, so it falls within the first 1024 bytes.
 */
export function ensureHtmlCharset(html: string): string {
  if (CHARSET_DECLARATION.test(html)) return html;
  const at =
    /<head(?:\s[^>]*)?>/i.exec(html) ??
    /<html(?:\s[^>]*)?>/i.exec(html) ??
    /<!doctype[^>]*>/i.exec(html);
  if (!at) return META_CHARSET + html;
  const index = at.index + at[0].length;
  return html.slice(0, index) + META_CHARSET + html.slice(index);
}
