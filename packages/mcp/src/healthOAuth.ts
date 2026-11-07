import { Effect, Schema } from 'effect';
import { HttpClient, HttpClientRequest } from 'effect/http';
import { as, bodyOf, fail, Registered } from './healthRpc';

/** Where a loopback client (Claude Code, Gemini CLI) asks to be sent back. */
const REDIRECT = 'http://127.0.0.1:33418/callback';
// Any S256 challenge will do: the check never exchanges a code.
const CHALLENGE = 'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM';

export const decode =
  <S extends Schema.Constraint>(step: string, schema: S) =>
  (value: unknown) =>
    as(step)(Schema.decodeUnknownEffect(schema)(value));

/** Dynamic client registration (RFC 7591), as a public PKCE client. */
export const register = (endpoint: string) =>
  Effect.gen(function* () {
    const client = yield* HttpClient.HttpClient;
    const response = yield* as('register')(
      client.execute(
        HttpClientRequest.post(endpoint).pipe(
          HttpClientRequest.bodyJsonUnsafe({
            client_name: 'jsonresume.org health check',
            redirect_uris: [REDIRECT],
            grant_types: ['authorization_code', 'refresh_token'],
            response_types: ['code'],
            token_endpoint_auth_method: 'none',
          })
        )
      )
    );
    if (response.status !== 201 && response.status !== 200)
      return yield* fail('register', `HTTP ${response.status}`);
    return yield* bodyOf('register', response).pipe(
      Effect.flatMap(decode('register', Registered))
    );
  });

/**
 * The consent page a person would see for that client: it must answer
 * (with the page, or the sign-in page it sends a stranger to), not refuse.
 */
export const authorizePage = (endpoint: string, clientId: string) =>
  Effect.gen(function* () {
    const client = yield* HttpClient.HttpClient;
    const url = new URL(endpoint);
    for (const [key, value] of Object.entries({
      response_type: 'code',
      client_id: clientId,
      redirect_uri: REDIRECT,
      code_challenge: CHALLENGE,
      code_challenge_method: 'S256',
      scope: 'mcp',
      state: 'health',
    }))
      url.searchParams.set(key, value);
    const response = yield* as('authorize-page')(client.get(url));
    if (response.status !== 200)
      return yield* fail('authorize-page', `HTTP ${response.status}`);
    return response.status;
  });
