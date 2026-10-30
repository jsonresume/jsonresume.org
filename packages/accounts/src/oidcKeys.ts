import { Config, Effect, Option, Redacted } from 'effect';
import {
  createHash,
  createPrivateKey,
  createPublicKey,
  generateKeyPairSync,
  type KeyObject,
  sign,
} from 'node:crypto';

const b64url = (data: string | Buffer) =>
  Buffer.from(data).toString('base64url');

/** RFC 7638: the key's thumbprint, used as its `kid`. */
const thumbprint = (jwk: { e?: string; n?: string }) =>
  b64url(
    createHash('sha256')
      .update(JSON.stringify({ e: jwk.e, kty: 'RSA', n: jwk.n }))
      .digest()
  );

/**
 * The RS256 key that signs OpenID Connect ID tokens, from OIDC_SIGNING_KEY
 * (a PKCS#8 PEM, base64-encoded so it fits on one line). Without it, a key
 * made at startup: fine for tests, but tokens fail to verify after a restart.
 */
export const signingKey = Effect.gen(function* () {
  const configured = yield* Config.option(Config.Redacted('OIDC_SIGNING_KEY'));
  let key: KeyObject;
  if (Option.isSome(configured)) {
    const pem = Buffer.from(Redacted.value(configured.value), 'base64');
    key = createPrivateKey(pem.toString('utf8'));
  } else {
    yield* Effect.logWarning(
      'OIDC_SIGNING_KEY is not set: using a key made now'
    );
    key = generateKeyPairSync('rsa', { modulusLength: 2048 }).privateKey;
  }
  const jwk = createPublicKey(key).export({ format: 'jwk' });
  const kid = thumbprint(jwk);

  /** A signed JWT (RS256) with these claims. */
  const signJwt = (claims: Record<string, unknown>) => {
    const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT', kid }));
    const input = `${header}.${b64url(JSON.stringify(claims))}`;
    return `${input}.${b64url(sign('sha256', Buffer.from(input), key))}`;
  };

  return {
    signJwt,
    /** The public half, for /api/oauth/jwks. */
    jwks: { keys: [{ ...jwk, kid, use: 'sig', alg: 'RS256' }] },
  };
});

/** OIDC at_hash: the left half of the access token's SHA-256. */
export const atHash = (accessToken: string) =>
  b64url(createHash('sha256').update(accessToken).digest().subarray(0, 16));
