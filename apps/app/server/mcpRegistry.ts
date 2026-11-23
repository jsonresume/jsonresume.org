/**
 * /.well-known/mcp-registry-auth: proves to the official MCP Registry that
 * whoever publishes `org.jsonresume/*` controls jsonresume.org (HTTP
 * authentication). The public half of an Ed25519 key; the private half is
 * /etc/jsonresume/mcp-registry.pem on the box, used by `mcp-publisher login
 * http` (see packages/mcp/server.json and its README).
 */
const RECORD =
  'v=MCPv1; k=ed25519; p=pM3UOCudxIVBneJgHmLIKDLvAYNUUrnZr1Ydr74wAkg=';

export const mcpRegistryAuthRoute = () => ({
  path: '/.well-known/mcp-registry-auth',
  fetch: async () =>
    new Response(RECORD, {
      headers: {
        'content-type': 'text/plain; charset=utf-8',
        'cache-control': 'public, max-age=3600',
      },
    }),
});
