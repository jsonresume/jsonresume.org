import { Effect, Redacted } from 'effect';
import {
  createHash,
  createHmac,
  randomBytes,
  scrypt,
  timingSafeEqual,
} from 'node:crypto';

// scrypt with the parameters OWASP lists as a minimum (N=2^15, r=8, p=1).
const N = 32768;
const R = 8;
const P = 1;
const KEY_LENGTH = 32;
const MAX_MEMORY = 64 * 1024 * 1024;

const derive = (
  password: string,
  salt: Buffer,
  n: number,
  r: number,
  p: number
) =>
  Effect.callback<Buffer, never>((resume) => {
    scrypt(
      password,
      salt,
      KEY_LENGTH,
      { N: n, r, p, maxmem: MAX_MEMORY },
      (error, key) => resume(error ? Effect.die(error) : Effect.succeed(key))
    );
  });

/** "scrypt$N$r$p$salt$hash", base64url, so parameters can rise later. */
export const hashPassword = (password: string) =>
  Effect.gen(function* () {
    const salt = randomBytes(16);
    const key = yield* derive(password, salt, N, R, P);
    return [
      'scrypt',
      N,
      R,
      P,
      salt.toString('base64url'),
      key.toString('base64url'),
    ].join('$');
  });

/** A stored hash's own parameters are used, so old hashes keep working. */
export const verifyPassword = (password: string, stored: string) =>
  Effect.gen(function* () {
    const [scheme, n, r, p, salt, hash] = stored.split('$');
    if (scheme !== 'scrypt' || !salt || !hash) return false;
    const expected = Buffer.from(hash, 'base64url');
    const key = yield* derive(
      password,
      Buffer.from(salt, 'base64url'),
      Number(n),
      Number(r),
      Number(p)
    );
    return key.length === expected.length && timingSafeEqual(key, expected);
  });

/** A hash to compare against when the email is unknown, so timing doesn't tell. */
export const decoyHash = hashPassword('decoy password for timing');

/** An opaque random token for cookies and email links. */
export const newToken = () => randomBytes(32).toString('base64url');

/** Tokens are stored hashed: a leaked table grants nothing. */
export const hashToken = (token: string) =>
  createHash('sha256').update(token).digest('hex');

/** value.signature, so a cookie we set can be trusted when it comes back. */
export const sign = (secret: Redacted.Redacted, value: string) => {
  const body = Buffer.from(value).toString('base64url');
  const mac = createHmac('sha256', Redacted.value(secret))
    .update(body)
    .digest('base64url');
  return `${body}.${mac}`;
};

export const unsign = (
  secret: Redacted.Redacted,
  signed: string
): string | undefined => {
  const [body, mac] = signed.split('.');
  if (!body || !mac) return undefined;
  const expected = createHmac('sha256', Redacted.value(secret))
    .update(body)
    .digest();
  const given = Buffer.from(mac, 'base64url');
  if (given.length !== expected.length || !timingSafeEqual(given, expected))
    return undefined;
  return Buffer.from(body, 'base64url').toString();
};
