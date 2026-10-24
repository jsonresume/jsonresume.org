import { authorizationServer, protectedResource } from '@repo/mcp';

/** OAuth discovery for MCP clients, at the paths RFC 9728 and 8414 name. */
export const discoveryRoutes = (site: string) => {
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
  ];
};

/** Paths agents' clients call from other sites: MCP, OAuth, discovery. */
export const openPaths = [
  '/mcp',
  '/api/oauth/register',
  '/api/oauth/token',
  '/.well-known/',
];

/** Writes that clients make without a session (so no Origin check). */
export const sessionless = ['/api/oauth/register', '/api/oauth/token'];

/**
 * /mcp is both the MCP server and the page about it: a browser asking for
 * HTML gets the page, everything else (MCP clients) the server.
 */
export const isMcpRequest = (request: Request) =>
  !(
    request.method === 'GET' &&
    (request.headers.get('accept') ?? '').includes('text/html')
  );
