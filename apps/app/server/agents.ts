import { authorizationServer, protectedResource } from '@repo/mcp';

/**
 * OAuth discovery, at the paths RFC 9728 and 8414 and OpenID Connect name; and,
 * when OPENAI_APPS_CHALLENGE is set, the token proving to OpenAI that we own
 * the MCP server's domain (ChatGPT app submission).
 */
export const discoveryRoutes = (site: string, openAiChallenge?: string) => {
  const json = (body: unknown) => async () =>
    Response.json(body, {
      headers: {
        'access-control-allow-origin': '*',
        'cache-control': 'public, max-age=3600',
      },
    });
  const resource = json(protectedResource(site));
  return [
    { path: '/.well-known/oauth-protected-resource', fetch: resource },
    { path: '/.well-known/oauth-protected-resource/mcp', fetch: resource },
    {
      path: '/.well-known/oauth-authorization-server',
      fetch: json(authorizationServer(site)),
    },
    {
      path: '/.well-known/openid-configuration',
      fetch: json(authorizationServer(site)),
    },
    ...(openAiChallenge
      ? [
          {
            path: '/.well-known/openai-apps-challenge',
            fetch: async () =>
              new Response(openAiChallenge, {
                headers: { 'content-type': 'text/plain; charset=utf-8' },
              }),
          },
        ]
      : []),
  ];
};

/**
 * What OAuth clients call without a session: registration, tokens,
 * revocation, ID-token keys, and what a token reads and writes (userinfo,
 * the resume).
 */
const oauthEndpoints = [
  '/api/oauth/register',
  '/api/oauth/token',
  '/api/oauth/revoke',
  '/api/oauth/userinfo',
  '/api/oauth/resume',
  '/api/oauth/jwks',
];

/** Paths other sites' clients call: MCP, OAuth, discovery. */
export const openPaths = ['/mcp', ...oauthEndpoints, '/.well-known/'];

/** Writes that clients make without a session (so no Origin check). */
export const sessionless = oauthEndpoints;

/**
 * /mcp is both the MCP server and the page about it: a browser asking for
 * HTML gets the page, everything else (MCP clients) the server.
 */
export const isMcpRequest = (request: Request) =>
  !(
    request.method === 'GET' &&
    (request.headers.get('accept') ?? '').includes('text/html')
  );
