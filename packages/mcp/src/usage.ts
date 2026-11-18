import type { ProductEventName, ProductEventProperties } from '@repo/posthog';
import { Effect, Option, Schema } from 'effect';
import { HttpServerRequest, type HttpServerResponse } from 'effect/http';
import { toolOutcome } from './toolOutcome';

/**
 * How a caller reached /mcp: through an OAuth app (by its registered name,
 * "Claude") or with an API key (whose name the user typed: not reported).
 */
export type Caller =
  | { readonly via: 'oauth'; readonly app: string }
  | { readonly via: 'api_key'; readonly app: null };

const McpRequest = Schema.fromJsonString(
  Schema.Union([
    Schema.Struct({
      method: Schema.Literal('tools/call'),
      params: Schema.Struct({ name: Schema.String }),
    }),
    Schema.Struct({
      method: Schema.Literal('initialize'),
      params: Schema.Struct({
        clientInfo: Schema.Struct({
          name: Schema.String,
          version: Schema.optional(Schema.String),
        }),
      }),
    }),
  ])
);

export type Track = (
  id: string,
  event: ProductEventName,
  properties: ProductEventProperties
) => Effect.Effect<void>;

/**
 * Counts a client connecting (with the name and version it gives itself,
 * "claude-ai", "cursor"), and gives back the tool a tools/call names, for
 * reportToolCall once it has answered. The body is read once and cached,
 * so the MCP server still reads it.
 */
export const reportUsage = (track: Track, userId: string, caller: Caller) =>
  Effect.gen(function* () {
    const request = yield* HttpServerRequest.HttpServerRequest;
    if (request.method !== 'POST') return undefined;
    const body = Schema.decodeUnknownOption(McpRequest)(yield* request.text);
    if (Option.isNone(body)) return undefined;
    if (body.value.method === 'tools/call') return body.value.params.name;
    const { name, version } = body.value.params.clientInfo;
    yield* track(userId, 'mcp_client_connected', {
      client: name.slice(0, 64),
      client_version: version?.slice(0, 32) ?? null,
      via: caller.via,
      app: caller.app,
    });
    return undefined;
  }).pipe(Effect.orElseSucceed(() => undefined));

/**
 * Counts a tool call once answered: whether it worked (and if not, what
 * kind of failure; null when the answer is still streaming) and how long
 * it took.
 */
export const reportToolCall = (
  track: Track,
  userId: string,
  caller: Caller,
  call: {
    tool: string;
    ms: number;
    response: HttpServerResponse.HttpServerResponse;
  }
) => {
  const outcome = toolOutcome(call.response);
  return track(userId, 'mcp_tool_called', {
    tool: call.tool,
    via: caller.via,
    app: caller.app,
    ok: outcome?.ok ?? null,
    error: outcome?.error ?? null,
    ms: Math.round(call.ms),
  }).pipe(Effect.ignore);
};
