import { Effect, Schema } from 'effect';
import {
  HttpClient,
  HttpClientRequest,
  type HttpClientResponse,
} from 'effect/http';

/** A step of the health check that didn't do what a client needs. */
export class HealthCheckFailed extends Schema.TaggedError<HealthCheckFailed>()(
  'HealthCheckFailed',
  { step: Schema.String, message: Schema.String }
) {}

/** Run `effect` as `step`: any failure becomes that step's HealthCheckFailed. */
export const as =
  (step: string) =>
  <A, E, R>(effect: Effect.Effect<A, E, R>) =>
    effect.pipe(
      Effect.mapError((e) =>
        e instanceof HealthCheckFailed
          ? e
          : new HealthCheckFailed({
              step,
              message: e instanceof Error ? e.message : String(e),
            })
      )
    );

export const fail = (step: string, message: string) =>
  Effect.fail(new HealthCheckFailed({ step, message }));

/** The body as JSON, from a plain response or the last event of a stream. */
export const bodyOf = (
  step: string,
  response: HttpClientResponse.HttpClientResponse
) =>
  Effect.gen(function* () {
    const text = yield* as(step)(response.text);
    const type = response.headers['content-type'] ?? '';
    const json = type.includes('text/event-stream')
      ? text
          .split('\n')
          .filter((line) => line.startsWith('data:'))
          .map((line) => line.slice(5).trim())
          .filter(Boolean)
          .at(-1) ?? ''
      : text;
    return yield* as(step)(
      Schema.decodeUnknownEffect(Schema.fromJsonString(Schema.Unknown))(json)
    );
  });

/** What a client reads at each step. */
export const ProtectedResource = Schema.Struct({
  resource: Schema.String,
  authorization_servers: Schema.NonEmptyArray(Schema.String),
});
export const AuthorizationServer = Schema.Struct({
  issuer: Schema.String,
  authorization_endpoint: Schema.String,
  token_endpoint: Schema.String,
  registration_endpoint: Schema.String,
  code_challenge_methods_supported: Schema.Array(Schema.String),
});
export const Registered = Schema.Struct({ client_id: Schema.String });
export const Initialized = Schema.Struct({
  protocolVersion: Schema.String,
  serverInfo: Schema.Struct({ name: Schema.String }),
});
export const ToolList = Schema.Struct({
  tools: Schema.Array(Schema.Struct({ name: Schema.String })),
});
export const ToolResult = Schema.Struct({
  isError: Schema.optional(Schema.Boolean),
});

const RpcResult = Schema.Struct({ result: Schema.Unknown });

/** A JSON-RPC session with an MCP server over Streamable HTTP. */
export const rpcSession = (url: string, token: string) =>
  Effect.gen(function* () {
    const client = yield* HttpClient.HttpClient;
    let session: string | undefined;
    let id = 0;
    const post = (step: string, body: unknown) =>
      HttpClientRequest.post(url).pipe(
        HttpClientRequest.bearerToken(token),
        HttpClientRequest.setHeaders({
          accept: 'application/json, text/event-stream',
          'mcp-protocol-version': '2025-06-18',
          ...(session ? { 'mcp-session-id': session } : {}),
        }),
        HttpClientRequest.bodyJsonUnsafe(body),
        client.execute,
        as(step)
      );

    /** A request; its result, or the server's error as this step's failure. */
    const call = <S extends Schema.Constraint>(
      step: string,
      method: string,
      params: unknown,
      schema: S
    ) =>
      Effect.gen(function* () {
        const response = yield* post(step, {
          jsonrpc: '2.0',
          id: ++id,
          method,
          params,
        });
        session = response.headers['mcp-session-id'] ?? session;
        const body = yield* bodyOf(step, response);
        if (response.status !== 200)
          return yield* fail(
            step,
            `HTTP ${response.status}: ${JSON.stringify(body)}`
          );
        const { result } = yield* as(step)(
          Schema.decodeUnknownEffect(RpcResult)(body)
        );
        return yield* as(step)(Schema.decodeUnknownEffect(schema)(result));
      });

    /** A notification: accepted (2xx) with nothing to answer. */
    const notify = (step: string, method: string) =>
      Effect.gen(function* () {
        const response = yield* post(step, { jsonrpc: '2.0', method });
        if (response.status >= 300)
          return yield* fail(step, `HTTP ${response.status}`);
      });

    return { call, notify };
  });
