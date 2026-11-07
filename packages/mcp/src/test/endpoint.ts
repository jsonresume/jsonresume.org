import { Accounts, ApiKeys, OAuth, RateLimiter } from '@repo/accounts';
import { accountsStack } from '@repo/accounts/stack';
import { PgAnalyticsStore } from '@repo/analytics/sql';
import { plainCareers } from '@repo/careers/testing';
import { Explore } from '@repo/explore';
import { embedderFrom, JobBoard, JobMatcher } from '@repo/jobs';
import { ProductEvents } from '@repo/posthog';
import { textPdf } from '@repo/resume-import/fixtures';
import {
  emptyReply,
  fakeDownloader,
  fakeReader,
  testImporter,
} from '@repo/resume-import/testing';
import { userActor } from '@repo/resume-versions';
import { Webhooks, WebhookSender } from '@repo/webhooks';
import { Effect, Layer, ManagedRuntime } from 'effect';
import { HttpRouter, HttpServer, HttpServerResponse } from 'effect/http';
import { createHash } from 'node:crypto';
import { mcpRoutes } from '../server';

let dispose: (() => Promise<void>) | undefined;

/** For afterEach: closes the last endpoint setup made. */
export const disposeEndpoint = () => dispose?.();

/** The MCP endpoint over a fresh database, and an API key for a user with a resume. */
export const setup = async () => {
  const stack = accountsStack();
  const events: Array<{ event: string; properties?: unknown }> = [];
  // Imports: the model "reads" the first line as the name; one PDF online.
  const reader = fakeReader((text) => {
    const reply = emptyReply();
    const name = text.split('\n')[0] ?? null;
    const basics = { ...reply.resume.basics, name };
    return { ...reply, resume: { ...reply.resume, basics } };
  });
  const downloads = fakeDownloader(
    new Map([
      [
        'https://example.com/cv.pdf',
        {
          bytes: textPdf(['Grace Hopper', 'Rear Admiral', 'Navy, 1943 - 1986']),
        },
      ],
    ])
  );
  const services = Layer.mergeAll(
    Layer.succeed(
      ProductEvents,
      ProductEvents.of({
        capture: (_, event, properties) =>
          Effect.sync(() => void events.push({ event, properties })),
      })
    ),
    RateLimiter.layer,
    downloads,
    ApiKeys.layer,
    OAuth.layer,
    PgAnalyticsStore,
    JobBoard.layer,
    Explore.layer,
    JobMatcher.layer.pipe(
      Layer.provide(embedderFrom(() => new Float32Array(3072).fill(1)))
    )
  ).pipe(Layer.provideMerge(stack.layer));
  const webhooks = Webhooks.layer.pipe(
    Layer.provide(
      Layer.merge(
        Layer.succeed(
          WebhookSender,
          WebhookSender.of({ send: () => Effect.succeed({ status: 200 }) })
        ),
        services
      )
    )
  );
  const withCareers = Layer.mergeAll(
    services,
    webhooks,
    plainCareers.pipe(Layer.provide(services)),
    testImporter(reader.layer).pipe(Layer.provide(services))
  );
  // Another route on the same router, as the API is in the app.
  const neighbour = HttpRouter.add(
    'GET',
    '/neighbour',
    HttpServerResponse.text('open')
  );
  const app = Layer.mergeAll(mcpRoutes(), neighbour).pipe(
    Layer.provide(withCareers),
    Layer.provide(HttpServer.layerServices)
  );
  // One MemoMap, so the endpoint and the setup share one database.
  const memoMap = Layer.makeMemoMapUnsafe();
  const web = HttpRouter.toWebHandler(app, { disableLogger: true, memoMap });
  const runtime = ManagedRuntime.make(withCareers, { memoMap });
  dispose = async () => {
    await web.dispose();
    await runtime.dispose();
  };
  const key = await runtime.runPromise(
    Effect.gen(function* () {
      const accounts = yield* Accounts;
      const { user } = yield* accounts.signUp({
        email: 'ada@example.com',
        password: 'correct horse battery',
        username: 'ada',
      });
      yield* accounts.saveResume(
        user.id,
        { basics: { name: 'Ada', label: 'Engineer' } },
        userActor
      );
      const made = yield* (yield* ApiKeys).create(user.id, 'agent');
      // And an OAuth access token, as claude.ai would hold.
      const oauth = yield* OAuth;
      const redirectUri = 'https://claude.ai/api/mcp/auth_callback';
      const client = yield* oauth.register({
        name: 'Claude',
        redirectUris: [redirectUri],
      });
      const verifier = 'verifier-verifier-verifier-verifier-verifier';
      const tokenFor = (scope: string | undefined) =>
        Effect.gen(function* () {
          const code = yield* oauth.issueCode({
            clientId: client.id,
            userId: user.id,
            redirectUri,
            codeChallenge: createHash('sha256')
              .update(verifier)
              .digest('base64url'),
            scope,
          });
          const tokens = yield* oauth.exchangeCode({
            code,
            clientId: client.id,
            secret: undefined,
            redirectUri,
            verifier,
          });
          return tokens.tokens.access_token;
        });
      return {
        key: made?.key ?? '',
        // A self-registered client asking for nothing gets the mcp scope.
        access: yield* tokenFor(undefined),
        // An HR app that may only read the resume.
        readOnly: yield* tokenFor('resume:read'),
      };
    })
  );
  return { handler: web.handler, events, ...key };
};

/** A client speaking Streamable HTTP (2025-06-18) with the key. */
export const connect = async (
  handler: (request: Request) => Promise<Response>,
  key: string
) => {
  let session = '';
  let id = 0;
  const send = async (method: string, params?: unknown) => {
    const response = await handler(
      new Request('http://x/mcp', {
        method: 'POST',
        headers: {
          authorization: `Bearer ${key}`,
          'content-type': 'application/json',
          accept: 'application/json, text/event-stream',
          'mcp-protocol-version': '2025-06-18',
          ...(session && { 'mcp-session-id': session }),
        },
        body: JSON.stringify({ jsonrpc: '2.0', id: ++id, method, params }),
      })
    );
    session = response.headers.get('mcp-session-id') ?? session;
    return (await response.json()).result;
  };
  await send('initialize', {
    protocolVersion: '2025-06-18',
    capabilities: {},
    clientInfo: { name: 'test', version: '1' },
  });
  const call = async (name: string, args: unknown = {}) => {
    const result = await send('tools/call', { name, arguments: args });
    const text = result.content?.[0]?.text ?? '';
    return { isError: result.isError, value: JSON.parse(text || 'null') };
  };
  return { send, call };
};
