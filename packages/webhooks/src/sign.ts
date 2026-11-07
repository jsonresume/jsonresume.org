import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

/** A new signing secret for an app's webhook. */
export const newSigningSecret = () =>
  `whsec_${randomBytes(24).toString('base64url')}`;

/** The JSONResume-Signature header for a body, sent at `at` (unix seconds). */
export const signature = (secret: string, body: string, at: number) =>
  `t=${at},v1=${createHmac('sha256', secret)
    .update(`${at}.${body}`)
    .digest('hex')}`;

/**
 * What an app does on receipt: true when the header signs this body with
 * its secret and is no older than `toleranceSeconds`.
 */
export const verifySignature = (
  secret: string,
  body: string,
  header: string,
  now = Math.floor(Date.now() / 1000),
  toleranceSeconds = 300
) => {
  const parts = Object.fromEntries(
    header.split(',').map((p) => p.split('=') as [string, string])
  );
  const at = Number(parts['t']);
  const given = Buffer.from(parts['v1'] ?? '', 'hex');
  const expected = Buffer.from(
    signature(secret, body, at).split('v1=')[1] ?? '',
    'hex'
  );
  return (
    Number.isFinite(at) &&
    Math.abs(now - at) <= toleranceSeconds &&
    given.length === expected.length &&
    timingSafeEqual(given, expected)
  );
};
