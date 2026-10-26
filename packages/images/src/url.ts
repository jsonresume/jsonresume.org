/** Widths the proxy makes: 2x the avatar sizes (sm, md, lg) and a card. */
export const IMAGE_WIDTHS = [64, 96, 160, 320] as const;
export type ImageWidth = (typeof IMAGE_WIDTHS)[number];

/** The Hono path pattern the server answers. */
export const imageProxyPath = '/_img/:width/:file';

const base64url = (text: string) => {
  let binary = '';
  for (const byte of new TextEncoder().encode(text)) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

/**
 * Another site's image as this server serves it: resized to `width`, WebP,
 * cached here and at the edge, and fetched without the visitor's referrer.
 * Our own paths and data: URIs come back unchanged.
 */
export const proxiedImage = (
  src: string | null | undefined,
  width: ImageWidth
): string | null => {
  if (!src) return null;
  if (!/^https?:\/\//i.test(src)) return src;
  return `/_img/${width}/${base64url(src)}.webp`;
};

/** The source and width a proxy path names, when it names valid ones. */
export const parseProxyPath = (
  pathname: string
): { src: string; width: ImageWidth } | undefined => {
  const match = /^\/_img\/(\d+)\/([\w-]+)\.webp$/.exec(pathname);
  const width = IMAGE_WIDTHS.find((w) => String(w) === match?.[1]);
  // A base64 string is never 1 more than a multiple of 4 long.
  if (!match?.[2] || match[2].length % 4 === 1 || width === undefined)
    return undefined;
  const src = new TextDecoder().decode(
    Uint8Array.from(atob(match[2].replace(/-/g, '+').replace(/_/g, '/')), (c) =>
      c.charCodeAt(0)
    )
  );
  return /^https?:\/\//i.test(src) && src.length <= 2048
    ? { src, width }
    : undefined;
};
