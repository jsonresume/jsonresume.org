import { CopilotEvent, type CopilotMessage } from '@repo/api';
import { Effect, Schema, Stream } from 'effect';
import { FetchHttpClient, HttpClient, HttpClientRequest } from 'effect/http';

const decodeEvent = Schema.decodeUnknownSync(CopilotEvent);
const ErrorBody = Schema.Struct({ error: Schema.String });
const dropped: CopilotEvent = {
  type: 'error',
  message: 'The connection dropped. Try again.',
};

/**
 * The copilot's reply to a conversation, as it streams (server-sent events
 * from /api/pathways/chat). A refusal (signed out, too many) arrives as one
 * error event.
 */
export const reply = (
  messages: ReadonlyArray<CopilotMessage>
): Stream.Stream<CopilotEvent> =>
  Stream.unwrap(
    Effect.gen(function* () {
      const client = yield* HttpClient.HttpClient;
      const response = yield* client.execute(
        HttpClientRequest.post(`${location.origin}/api/pathways/chat`).pipe(
          HttpClientRequest.bodyJsonUnsafe({ messages })
        )
      );
      if (response.status !== 200) {
        const body = yield* response.json.pipe(
          Effect.flatMap(Schema.decodeUnknownEffect(ErrorBody)),
          Effect.orElseSucceed(() => ({ error: 'That didn’t work.' }))
        );
        const failed: CopilotEvent = { type: 'error', message: body.error };
        return Stream.make(failed);
      }
      return response.stream.pipe(
        Stream.decodeText(),
        Stream.splitLines,
        Stream.filter((line) => line.startsWith('data: ')),
        Stream.map(
          (line): CopilotEvent => decodeEvent(JSON.parse(line.slice(6)))
        )
      );
    }).pipe(Effect.provide(FetchHttpClient.layer))
  ).pipe(Stream.catchCause(() => Stream.make(dropped)));
