import { Schema } from 'effect';
import { createHash } from 'node:crypto';

/** An OAuth error as RFC 6749 names it, e.g. invalid_grant. */
export class OAuthFailure extends Schema.TaggedError<OAuthFailure>()(
  'OAuthFailure',
  { error: Schema.String, description: Schema.String }
) {}
export const fail = (error: string, description: string) =>
  new OAuthFailure({ error, description });

export const SCOPE = 'mcp';
export const CODE_TTL = 10 * 60_000;
export const ACCESS_TTL = 60 * 60_000;
export const REFRESH_TTL = 90 * 24 * 60 * 60_000;

const LOOPBACK = new Set(['localhost', '127.0.0.1', '[::1]']);
const FORBIDDEN = new Set([
  'javascript:',
  'data:',
  'file:',
  'vbscript:',
  'blob:',
]);

const parse = (uri: string) => {
  try {
    return new URL(uri);
  } catch {
    return undefined;
  }
};

/**
 * Where a client may be sent back to: https anywhere, http only on this
 * machine (RFC 8252 loopback), or an app's own scheme (cursor://, vscode://).
 */
export const allowedRedirect = (uri: string): boolean => {
  const url = parse(uri);
  if (!url || url.hash || FORBIDDEN.has(url.protocol)) return false;
  if (url.protocol === 'http:') return LOOPBACK.has(url.hostname);
  return true;
};

/** A registered URI matches exactly, or, on loopback, on any port. */
export const matchesRedirect = (
  registered: ReadonlyArray<string>,
  uri: string
): boolean => {
  if (registered.includes(uri)) return true;
  const url = parse(uri);
  if (!url || url.protocol !== 'http:' || !LOOPBACK.has(url.hostname))
    return false;
  return registered.some((r) => {
    const reg = parse(r);
    return (
      reg !== undefined &&
      reg.protocol === 'http:' &&
      reg.hostname === url.hostname &&
      reg.pathname === url.pathname
    );
  });
};

/** PKCE S256: the verifier hashes to the challenge. */
export const pkceMatches = (verifier: string, challenge: string) =>
  createHash('sha256').update(verifier).digest('base64url') === challenge;
