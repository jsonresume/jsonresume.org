/**
 * Connects to jsonresume.org's MCP server the way Claude, ChatGPT, Cursor,
 * Gemini CLI and VS Code do, and says which step broke: the 401 that points
 * at the OAuth metadata (RFC 9728), the authorization server's metadata
 * (RFC 8414), dynamic client registration (RFC 7591), the consent page for
 * that client; then, with a token, MCP `initialize`, `tools/list` and a
 * `get_resume` call. Run by apps/app/scripts/mcp-health.ts.
 */
import { Clock, Effect, Option } from 'effect';
import { HttpClient, HttpClientRequest } from 'effect/http';
import {
  as,
  AuthorizationServer,
  bodyOf,
  fail,
  Initialized,
  ProtectedResource,
  rpcSession,
  ToolList,
  ToolResult,
} from './healthRpc';
import { authorizePage, decode, register } from './healthOAuth';

export { HealthCheckFailed } from './healthRpc';

export interface HealthStep {
  step: string;
  ms: number;
  detail: string;
}

/**
 * Check the MCP server at `${base}/mcp`. Fails with the first step that
 * broke; succeeds with every step's time. Without `token` (an API key or
 * OAuth access token for a test account) the signed-in steps are skipped.
 */
export const checkMcp = Effect.fn('checkMcp')(function* (
  base: string,
  token: Option.Option<string>
) {
  const client = yield* HttpClient.HttpClient;
  const site = base.replace(/\/$/, '');
  const mcpUrl = `${site}/mcp`;
  const steps: HealthStep[] = [];
  const timed = <A, E, R>(
    step: string,
    effect: Effect.Effect<A, E, R>,
    detail: (a: A) => string
  ) =>
    Effect.gen(function* () {
      const start = yield* Clock.currentTimeMillis;
      const value = yield* effect;
      const ms = (yield* Clock.currentTimeMillis) - start;
      steps.push({ step, ms, detail: detail(value) });
      return value;
    });
  const getJson = (step: string, url: string) =>
    Effect.gen(function* () {
      const response = yield* as(step)(client.get(url));
      if (response.status !== 200)
        return yield* fail(step, `HTTP ${response.status} from ${url}`);
      return yield* bodyOf(step, response);
    });

  const metadataUrl = yield* timed(
    'challenge',
    Effect.gen(function* () {
      const response = yield* as('challenge')(
        client.execute(
          HttpClientRequest.post(mcpUrl).pipe(
            HttpClientRequest.bodyJsonUnsafe({
              jsonrpc: '2.0',
              id: 0,
              method: 'ping',
            })
          )
        )
      );
      const header = response.headers['www-authenticate'] ?? '';
      const url = /resource_metadata="([^"]+)"/.exec(header)?.[1];
      if (response.status !== 401 || !url)
        return yield* fail(
          'challenge',
          `expected 401 with resource_metadata, got ${response.status} "${header}"`
        );
      return url;
    }),
    (url) => url
  );
  const resource = yield* timed(
    'protected-resource',
    getJson('protected-resource', metadataUrl).pipe(
      Effect.flatMap(decode('protected-resource', ProtectedResource))
    ),
    (r) => r.authorization_servers[0]
  );
  if (resource.resource !== mcpUrl)
    return yield* fail(
      'protected-resource',
      `resource is ${resource.resource}`
    );
  const issuer = resource.authorization_servers[0].replace(/\/$/, '');
  const server = yield* timed(
    'authorization-server',
    getJson(
      'authorization-server',
      `${issuer}/.well-known/oauth-authorization-server`
    ).pipe(Effect.flatMap(decode('authorization-server', AuthorizationServer))),
    (s) => s.registration_endpoint
  );
  if (!server.code_challenge_methods_supported.includes('S256'))
    return yield* fail('authorization-server', 'no S256 PKCE');

  const registered = yield* timed(
    'register',
    register(server.registration_endpoint),
    (r) => r.client_id
  );
  yield* timed(
    'authorize-page',
    authorizePage(server.authorization_endpoint, registered.client_id),
    (status) => `HTTP ${status}`
  );

  if (Option.isNone(token)) return steps;
  const rpc = yield* rpcSession(mcpUrl, token.value);
  yield* timed(
    'initialize',
    rpc.call(
      'initialize',
      'initialize',
      {
        protocolVersion: '2025-06-18',
        capabilities: {},
        clientInfo: { name: 'jsonresume-health-check', version: '1' },
      },
      Initialized
    ),
    (r) => `${r.serverInfo.name}, protocol ${r.protocolVersion}`
  );
  yield* rpc.notify('initialized', 'notifications/initialized');
  const list = yield* timed(
    'tools/list',
    rpc.call('tools/list', 'tools/list', {}, ToolList),
    (r) => `${r.tools.length} tools`
  );
  if (!list.tools.some((t) => t.name === 'get_resume'))
    return yield* fail('tools/list', 'get_resume is missing');
  const result = yield* timed(
    'get_resume',
    rpc.call(
      'get_resume',
      'tools/call',
      { name: 'get_resume', arguments: {} },
      ToolResult
    ),
    (r) => (r.isError ? 'error' : 'ok')
  );
  if (result.isError) return yield* fail('get_resume', 'the tool failed');
  return steps;
});
