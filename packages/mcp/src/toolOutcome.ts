import { Option, Schema } from 'effect';
import type { HttpServerResponse } from 'effect/http';

const Reply = Schema.fromJsonString(
  Schema.Struct({
    error: Schema.optional(Schema.Struct({ code: Schema.Number })),
    result: Schema.optional(
      Schema.Struct({
        isError: Schema.optional(Schema.Boolean),
        content: Schema.optional(
          Schema.Array(Schema.Struct({ text: Schema.optional(Schema.String) }))
        ),
      })
    ),
  })
);

/** A tool's failure as its handler wrote it: { "_tag": "ImportFailed", ... }. */
const Failure = Schema.fromJsonString(Schema.Struct({ _tag: Schema.String }));

export interface Outcome {
  ok: boolean;
  /** What failed, by kind only (never the message, which can quote a resume). */
  error: string | null;
}

/** The JSON-RPC message in a response body: plain JSON, or the last event of a stream. */
const message = (text: string) =>
  text.trimStart().startsWith('{')
    ? text
    : text
        .split('\n')
        .filter((line) => line.startsWith('data:'))
        .map((line) => line.slice(5).trim())
        .pop();

/**
 * Whether a tools/call worked, from its response: a JSON-RPC error
 * ("rpc_-32602"), a result marked isError (named by the failure's tag, else
 * "tool_error"), or a result. Undefined when the body isn't at hand (a
 * stream still open).
 */
export const toolOutcome = (
  response: HttpServerResponse.HttpServerResponse
): Outcome | undefined => {
  const body = response.body;
  if (body._tag !== 'Uint8Array') return undefined;
  const text = message(body.text ?? new TextDecoder().decode(body.body));
  if (text === undefined) return undefined;
  const reply = Schema.decodeUnknownOption(Reply)(text);
  if (Option.isNone(reply)) return undefined;
  const { error, result } = reply.value;
  if (error) return { ok: false, error: `rpc_${error.code}` };
  if (!result?.isError) return { ok: true, error: null };
  const failure = Schema.decodeUnknownOption(Failure)(
    result.content?.[0]?.text ?? ''
  );
  return {
    ok: false,
    error: Option.match(failure, {
      onNone: () => 'tool_error',
      onSome: (f) => f._tag.slice(0, 64),
    }),
  };
};
