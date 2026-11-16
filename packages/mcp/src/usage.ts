import type { ProductEventName, ProductEventProperties } from '@repo/posthog';
import { Effect, Option, Schema } from 'effect';
import { HttpServerRequest } from 'effect/http';

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
 * Counts what a request does: a tool call, or a client connecting (with the
 * name and version it gives itself, "claude-ai", "cursor"). The body is read
 * once and cached, so the MCP server still reads it.
 */
export const reportUsage = (track: Track, userId: string, caller: Caller) =>
  Effect.gen(function* () {
    const request = yield* HttpServerRequest.HttpServerRequest;
    if (request.method !== 'POST') return;
    const body = Schema.decodeUnknownOption(McpRequest)(yield* request.text);
    if (Option.isNone(body)) return;
    const { via, app } = caller;
    if (body.value.method === 'tools/call') {
      return yield* track(userId, 'mcp_tool_called', {
        tool: body.value.params.name,
        via,
        app,
      });
    }
    const { name, version } = body.value.params.clientInfo;
    yield* track(userId, 'mcp_client_connected', {
      client: name.slice(0, 64),
      client_version: version?.slice(0, 32) ?? null,
      via,
      app,
    });
  }).pipe(Effect.ignore);
