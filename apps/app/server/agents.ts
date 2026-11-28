import {
  aiCatalog,
  authorizationServer,
  protectedResource,
  SERVER_CARD_PATH,
  serverCard,
} from '@repo/mcp';
import { llmsRoutes } from './llmsFiles';
import { mcpRegistryAuthRoute } from './mcpRegistry';
import { schemaFileRoutes } from './schemaFiles';
import { securityTxtRoute } from './securityTxt';

/**
 * OAuth discovery, at the paths RFC 9728 and 8414 and OpenID Connect name;
 * the MCP Server Card and the AI Catalog;
 * security.txt (RFC 9116); the schema files; llms.txt; and,
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
  // The MCP Server Card and the AI Catalog pointing at it, in their own
  // media types, readable from any origin (as SEP-2127 asks).
  const typed = (body: unknown, type: string) => async () =>
    new Response(JSON.stringify(body), {
      headers: {
        'content-type': type,
        'access-control-allow-origin': '*',
        'cache-control': 'public, max-age=3600',
      },
    });
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
    {
      path: SERVER_CARD_PATH,
      fetch: typed(serverCard(site), 'application/mcp-server-card+json'),
    },
    {
      path: '/.well-known/ai-catalog.json',
      fetch: typed(aiCatalog(site), 'application/ai-catalog+json'),
    },
    securityTxtRoute(site),
    ...schemaFileRoutes(),
    ...llmsRoutes(site),
    mcpRegistryAuthRoute(),
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

/**
 * Paths other sites' clients call: MCP, OAuth, discovery; and the fonts a
 * theme loads from here (professional), wherever it renders: a printed PDF,
 * a resume built with resume-cli.
 */
export const openPaths = [
  '/mcp',
  ...oauthEndpoints,
  '/.well-known/',
  '/fonts/',
];

/**
 * Writes that clients make without a session (so no Origin check): OAuth,
 * and mail apps' one-click unsubscribe (RFC 8058), which carries a token.
 */
export const sessionless = [...oauthEndpoints, '/api/email-settings/stop'];

/**
 * /mcp is both the MCP server and the page about it: a browser asking for
 * HTML gets the page, everything else (MCP clients) the server. Its server
 * card, under it, is a plain file.
 */
export const isMcpRequest = (request: Request) =>
  new URL(request.url).pathname !== SERVER_CARD_PATH &&
  !(
    request.method === 'GET' &&
    (request.headers.get('accept') ?? '').includes('text/html')
  );
