import { Accounts, RateLimiter } from '@repo/accounts';
import { CopilotRequest, sessionCookie } from '@repo/api';
import { Copilot } from '@repo/pathways';
import { Effect, Schema, Stream } from 'effect';
import { HttpRouter, HttpServerRequest, HttpServerResponse } from 'effect/http';

const encoder = new TextEncoder();
const json = (status: number, error: string) =>
  HttpServerResponse.jsonUnsafe({ error }, { status });

/**
 * POST /api/pathways/chat: the copilot's reply to a conversation, as
 * server-sent events (one CopilotEvent per `data:` line), outside the
 * HttpApi because it streams. Needs a session; 60 replies an hour each.
 */
export const PathwaysRoutes = HttpRouter.use((router) =>
  Effect.gen(function* () {
    const accounts = yield* Accounts;
    const copilot = yield* Copilot;
    const limiter = yield* RateLimiter;

    yield* router.add('POST', '/api/pathways/chat', (request) =>
      Effect.gen(function* () {
        const token = request.cookies[sessionCookie.key];
        const user = token
          ? yield* accounts.session(token).pipe(Effect.option)
          : undefined;
        if (!user || user._tag === 'None') return json(401, 'Sign in first');
        const limited = yield* limiter
          .hit(`pathways:${user.value.id}`, 60, 3600)
          .pipe(Effect.flip, Effect.option);
        if (limited._tag === 'Some') {
          return json(
            429,
            'That’s a lot of questions for one hour. Try again soon.'
          );
        }
        const body = yield* HttpServerRequest.schemaBodyJson(
          CopilotRequest
        ).pipe(Effect.option);
        if (body._tag === 'None') return json(400, 'Send { messages: [...] }');

        const events = copilot
          .reply(user.value, body.value.messages)
          .pipe(
            Stream.map((event) =>
              encoder.encode(`data: ${JSON.stringify(event)}\n\n`)
            )
          );
        return HttpServerResponse.stream(events, {
          contentType: 'text/event-stream',
          headers: {
            'cache-control': 'no-cache, no-transform',
            'x-accel-buffering': 'no',
          },
        });
      })
    );
  })
);
