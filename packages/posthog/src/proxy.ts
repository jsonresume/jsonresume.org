/**
 * /ingest on our own domain, passed to PostHog, so blockers that refuse
 * third-party analytics hosts don't silently drop events. Cookies and
 * credentials never leave; the visitor's address goes along, as PostHog's
 * cookieless mode counts visitors with a daily hash of it.
 */
export type Fetch = (
  url: string,
  init: { method: string; headers: Headers; body?: ArrayBuffer }
) => Promise<Response>;

export interface PostHogProxyOptions {
  /** The path it's mounted at. */
  prefix?: string;
  /** Events and flags. */
  host?: string;
  /** The SDK's lazy-loaded files: /static and /array. */
  assetsHost?: string;
  fetch?: Fetch;
}

const FORWARDED = [
  'accept',
  'content-type',
  'content-encoding',
  'user-agent',
  'origin',
] as const;

// fetch decodes the body; its encoding and length no longer apply.
const DROPPED = new Set([
  'content-encoding',
  'content-length',
  'transfer-encoding',
  'connection',
  'set-cookie',
]);

const visitor = (headers: Headers) =>
  headers.get('cf-connecting-ip') ??
  headers.get('x-forwarded-for')?.split(',')[0]?.trim();

export function posthogProxy({
  prefix = '/ingest',
  host = 'https://us.i.posthog.com',
  assetsHost = 'https://us-assets.i.posthog.com',
  fetch: send = fetch,
}: PostHogProxyOptions = {}) {
  return async (request: Request): Promise<Response> => {
    const url = new URL(request.url);
    const path = url.pathname.slice(prefix.length) || '/';
    const assets = /^\/(static|array)\//.test(path);
    const headers = new Headers();
    for (const name of FORWARDED) {
      const value = request.headers.get(name);
      if (value) headers.set(name, value);
    }
    const address = visitor(request.headers);
    if (address) headers.set('x-forwarded-for', address);
    const read = request.method === 'GET' || request.method === 'HEAD';
    const upstream = await send(
      `${assets ? assetsHost : host}${path}${url.search}`,
      {
        method: request.method,
        headers,
        body: read ? undefined : await request.arrayBuffer(),
      }
    );
    const out = new Headers();
    upstream.headers.forEach((value, name) => {
      if (!DROPPED.has(name)) out.set(name, value);
    });
    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: out,
    });
  };
}
