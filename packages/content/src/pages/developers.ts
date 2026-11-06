/**
 * /developers: "Sign in with JSON Resume" for HR tools, job boards and ATSs.
 * Endpoints and scopes as @repo/api's OAuthApi and OAuthResourceApi define
 * them; keep the two in step.
 */
import type { Step } from './types';

const site = 'https://jsonresume.org';
const callback = 'https://acme.example/auth/jsonresume/callback';

export const intro = {
  eyebrow: 'Developers',
  title: 'Sign in with JSON Resume',
  lede: 'Let people bring their resume to your HR tool, job board or applicant tracker. They sign in with jsonresume.org and choose what you may see; you get their resume.json, kept up to date by them, with no forms to fill in again.',
};

export const steps: Step[] = [
  {
    title: 'Register your app',
    body: 'Under [Settings → Your OAuth apps](/dashboard/settings#oauth-apps), give its name and the URLs people come back to. You get a client ID and a secret, shown once. Keep the secret on your server.',
  },
  {
    title: 'Send people to jsonresume.org',
    body: 'Link to the authorization page with the scopes you need, a random `state` and, for OpenID Connect, a `nonce`. They sign in (or sign up), see exactly what you asked for, and choose **Allow**.',
    code: `${site}/oauth/authorize?response_type=code
  &client_id=$CLIENT_ID
  &redirect_uri=${encodeURIComponent(callback)}
  &scope=openid%20profile%20email%20resume:read
  &state=$STATE
  &nonce=$NONCE`,
  },
  {
    title: 'Swap the code for tokens',
    body: 'They come back to your redirect URI with `code` and your `state`. From your server, exchange the code within 10 minutes. With the `openid` scope you also get an `id_token`: who they are, signed. Access tokens last an hour; refresh tokens 90 days, and each is used once.',
    code: `curl ${site}/api/oauth/token -u "$CLIENT_ID:$CLIENT_SECRET" \\
  -d grant_type=authorization_code \\
  -d code=$CODE \\
  -d redirect_uri=${callback}`,
  },
  {
    title: 'Read their resume',
    body: 'Send the access token as a Bearer token. Who they are is at `/api/oauth/userinfo`; their resume, as JSON Resume, at `/api/oauth/resume`.',
    code: `curl ${site}/api/oauth/resume -H "Authorization: Bearer $ACCESS_TOKEN"`,
  },
];

export const scopes: ReadonlyArray<{ scope: string; allows: string }> = [
  {
    scope: 'openid',
    allows:
      'An OpenID Connect ID token with the tokens: a JWT (RS256) naming them, with the claims your other scopes allow.',
  },
  {
    scope: 'profile',
    allows:
      'Their username, name, photo and page, from `/api/oauth/userinfo`. What you get when you ask for nothing.',
  },
  {
    scope: 'email',
    allows: 'Their email address, and whether it is verified.',
  },
  {
    scope: 'resume:read',
    allows: 'Their resume as JSON Resume, from `GET /api/oauth/resume`.',
  },
  {
    scope: 'resume:write',
    allows:
      'Replace their resume with `PUT /api/oauth/resume`. Saved to their gist when their page reads from it, and checked against the schema.',
  },
  {
    scope: 'mcp',
    allows:
      'Everything, through the [MCP server](/mcp). For agents, not HR tools.',
  },
];

export const endpoints: ReadonlyArray<{ name: string; url: string }> = [
  { name: 'Authorization', url: `${site}/oauth/authorize` },
  { name: 'Token', url: `POST ${site}/api/oauth/token` },
  { name: 'User info', url: `GET ${site}/api/oauth/userinfo` },
  { name: 'Resume', url: `GET, PUT ${site}/api/oauth/resume` },
  { name: 'Revocation', url: `POST ${site}/api/oauth/revoke` },
  { name: 'Signing keys (JWKS)', url: `GET ${site}/api/oauth/jwks` },
  {
    name: 'OpenID configuration',
    url: `${site}/.well-known/openid-configuration`,
  },
  {
    name: 'Metadata (RFC 8414)',
    url: `${site}/.well-known/oauth-authorization-server`,
  },
];

export const examples = [
  {
    label: 'Auth.js',
    code: `// auth.ts: Auth.js (NextAuth) with JSON Resume as a provider
providers: [
  {
    id: 'jsonresume',
    name: 'JSON Resume',
    type: 'oidc',
    issuer: '${site}',
    authorization: {
      params: { scope: 'openid profile email resume:read' },
    },
    clientId: process.env.JSONRESUME_CLIENT_ID,
    clientSecret: process.env.JSONRESUME_CLIENT_SECRET,
    profile: (p) => ({
      id: p.sub,
      name: p.name ?? p.preferred_username,
      email: p.email,
      image: p.picture,
    }),
  },
],`,
  },
  {
    label: 'ID token',
    code: `// The id_token's claims; /api/oauth/userinfo returns the same, minus the first five
{
  "iss": "${site}",
  "aud": "jrc_…",                 // your client ID
  "exp": 1793000000,
  "iat": 1792996400,
  "nonce": "…",                   // the one you sent
  "sub": "0d6f2c1e-…",            // stays the same if they rename
  "preferred_username": "ada",    // with the profile scope
  "name": "Ada Lovelace",
  "picture": "https://…/ada.png",
  "profile": "${site}/@ada",
  "email": "ada@example.com",    // with the email scope
  "email_verified": true
}`,
  },
];

export const notes = [
  'Use `sub` as the user’s ID: usernames can change.',
  'Any OpenID Connect library works from the issuer `https://jsonresume.org` alone: it reads the endpoints and keys from `/.well-known/openid-configuration`. ID tokens are RS256, last an hour, and carry your `nonce`.',
  'PKCE (S256) is optional for apps with a secret and required for apps without one. Browser and mobile apps without a server can register themselves (RFC 7591, `POST /api/oauth/register`) and must use PKCE.',
  'People see every app they’ve connected under Settings → Connected apps, and can disconnect it there. Revoke a token yourself when someone disconnects on your side.',
  'Errors follow RFC 6749 and 6750: `invalid_grant`, `invalid_client`, `invalid_token` (401) and `insufficient_scope` (403).',
];
