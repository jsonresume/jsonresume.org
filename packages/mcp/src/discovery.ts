import { OAUTH_SCOPE } from '@repo/accounts';

/**
 * How MCP clients find out how to sign in: the protected resource (RFC
 * 9728) names jsonresume.org as its authorization server, whose metadata
 * (RFC 8414) gives the endpoints. Served at /.well-known by the app.
 */
export const protectedResource = (site: string) => ({
  resource: `${site}/mcp`,
  authorization_servers: [site],
  bearer_methods_supported: ['header'],
  scopes_supported: [OAUTH_SCOPE],
  resource_name: 'JSON Resume',
  resource_documentation: `${site}/mcp`,
});

export const authorizationServer = (site: string) => ({
  issuer: site,
  authorization_endpoint: `${site}/oauth/authorize`,
  token_endpoint: `${site}/api/oauth/token`,
  registration_endpoint: `${site}/api/oauth/register`,
  response_types_supported: ['code'],
  grant_types_supported: ['authorization_code', 'refresh_token'],
  code_challenge_methods_supported: ['S256'],
  token_endpoint_auth_methods_supported: ['none'],
  scopes_supported: [OAUTH_SCOPE],
  service_documentation: `${site}/mcp`,
});
