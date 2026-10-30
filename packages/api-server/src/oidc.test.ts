import { createHash, createPublicKey, verify } from 'node:crypto';
import { afterEach, describe, expect, it } from 'vitest';
import { testServer } from './test/server';

let server: ReturnType<typeof testServer>;
afterEach(() => server?.dispose());

const redirect_uri = 'https://ats.example/auth/jsonresume/callback';

const form = (body: Record<string, string>) => ({
  method: 'POST',
  headers: { 'content-type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams(body).toString(),
});

const part = (segment: string) =>
  JSON.parse(Buffer.from(segment, 'base64url').toString('utf8'));

/** Ada registers an app, approves it with these scopes and gets its tokens. */
const signIn = async (scope: string, nonce?: string) => {
  await server.post('/api/auth/signup', {
    email: 'ada@example.com',
    password: 'correct horse battery',
    username: 'ada',
  });
  const made = await server.post('/api/oauth/apps', {
    name: 'Acme ATS',
    redirectUris: [redirect_uri],
  });
  const { app, clientSecret } = await made.json();
  const decided = await server.post('/api/oauth/decide', {
    client_id: app.id,
    redirect_uri,
    scope,
    ...(nonce && { nonce }),
    approve: true,
  });
  const code =
    new URL((await decided.json()).redirect).searchParams.get('code') ?? '';
  const tokens = await (
    await server.fetch(
      '/api/oauth/token',
      form({
        grant_type: 'authorization_code',
        code,
        redirect_uri,
        client_id: app.id,
        client_secret: clientSecret,
      })
    )
  ).json();
  return { clientId: app.id as string, secret: clientSecret as string, tokens };
};

describe('OpenID Connect', () => {
  it('returns an ID token signed with a key from the JWKS', async () => {
    server = testServer();
    const { clientId, tokens } = await signIn(
      'openid profile email',
      'n-0S6_WzA2Mj'
    );
    expect(tokens.scope).toBe('openid profile email');
    const [header = '', payload = '', signature = ''] =
      tokens.id_token.split('.');

    const { keys } = await (await server.fetch('/api/oauth/jwks')).json();
    const head = part(header);
    expect(head).toMatchObject({ alg: 'RS256', typ: 'JWT' });
    const jwk = keys.find((k: { kid: string }) => k.kid === head.kid);
    expect(jwk).toMatchObject({ kty: 'RSA', use: 'sig', alg: 'RS256' });
    expect(jwk.d).toBeUndefined();
    const key = createPublicKey({ key: jwk, format: 'jwk' });
    expect(
      verify(
        'sha256',
        Buffer.from(`${header}.${payload}`),
        key,
        Buffer.from(signature, 'base64url')
      )
    ).toBe(true);

    const claims = part(payload);
    const userinfo = await (
      await server.fetch('/api/oauth/userinfo', {
        headers: { authorization: `Bearer ${tokens.access_token}` },
      })
    ).json();
    expect(claims).toMatchObject({
      iss: 'https://jsonresume.test',
      aud: clientId,
      sub: userinfo.sub,
      nonce: 'n-0S6_WzA2Mj',
      preferred_username: 'ada',
      email: 'ada@example.com',
      email_verified: false,
    });
    expect(claims.exp - claims.iat).toBe(3600);
    expect(claims.at_hash).toBe(
      createHash('sha256')
        .update(tokens.access_token)
        .digest()
        .subarray(0, 16)
        .toString('base64url')
    );
  });

  it('refreshing keeps the ID token; no openid, no ID token', async () => {
    server = testServer();
    const { clientId, secret, tokens } = await signIn('openid');
    const refreshed = await (
      await server.fetch(
        '/api/oauth/token',
        form({
          grant_type: 'refresh_token',
          refresh_token: tokens.refresh_token,
          client_id: clientId,
          client_secret: secret,
        })
      )
    ).json();
    const claims = part(refreshed.id_token.split('.')[1] ?? '');
    expect(claims.nonce).toBeUndefined();
    // openid alone: who they are, nothing more.
    expect(claims.preferred_username).toBeUndefined();

    server.dispose();
    server = testServer();
    const plain = await signIn('profile');
    expect(plain.tokens.id_token).toBeUndefined();
  });
});
