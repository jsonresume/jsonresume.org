import { createHash } from 'node:crypto';

/**
 * Some themes (pro, two-column) inline their fonts as data: URIs, which made
 * every page of theirs ~300KB of HTML, downloaded before anything showed and
 * never cached. Served pages point at /_fonts/<hash> instead: fetched in
 * parallel, cached for good, shared by every resume in the theme. The PDF
 * printer still gets the self-contained page.
 */
export const themeFontPath = '/_fonts/:file';

const INLINE_FONT =
  /url\(\s*(['"]?)data:((?:font|application)\/[\w.+-]+);base64,([A-Za-z0-9+/=]+)\1\s*\)/g;

/** Fonts below this stay inline: a request would cost more than it saves. */
const MIN_BASE64 = 8 * 1024;
/** Themes inline a handful of fonts; the cap bounds memory if one misbehaves. */
const MAX_FONTS = 128;

const types: Readonly<Record<string, string>> = {
  woff2: 'font/woff2',
  woff: 'font/woff',
  otf: 'font/otf',
  ttf: 'font/ttf',
};

const extensionOf = (type: string) =>
  type.includes('woff2')
    ? 'woff2'
    : type.includes('woff')
    ? 'woff'
    : /otf|opentype/.test(type)
    ? 'otf'
    : 'ttf';

const fonts = new Map<string, Uint8Array<ArrayBuffer>>();

/** The themed page with its large inline fonts swapped for /_fonts URLs. */
export const externalizeFonts = (html: string) =>
  html.replace(INLINE_FONT, (match, _quote, type: string, data: string) => {
    if (data.length < MIN_BASE64) return match;
    const hash = createHash('sha256').update(data).digest('base64url');
    const file = `${hash.slice(0, 24)}.${extensionOf(type)}`;
    if (!fonts.has(file)) {
      if (fonts.size >= MAX_FONTS) return match;
      fonts.set(file, new Uint8Array(Buffer.from(data, 'base64')));
    }
    return `url(/_fonts/${file})`;
  });

/**
 * A font a served page points at. Undefined until a page using it has been
 * rendered by this process; pages are never cached, so that comes first.
 */
export const themeFont = async (request: Request) => {
  const file = new URL(request.url).pathname.split('/').pop() ?? '';
  const body = fonts.get(file);
  if (!body) return undefined;
  const type = types[file.split('.').pop() ?? ''] ?? 'font/ttf';
  return new Response(body, {
    headers: {
      'content-type': type,
      // The name is the content's hash.
      'cache-control': 'public, max-age=31536000, immutable',
      'access-control-allow-origin': '*',
    },
  });
};
