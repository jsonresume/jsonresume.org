import { Accounts } from '@repo/accounts';
import { accountsStack } from '@repo/accounts/stack';
import { PgAnalyticsStore } from '@repo/analytics/sql';
import { Explore } from '@repo/explore';
import { embedderFrom, JobBoard, JobMatcher } from '@repo/jobs';
import { Effect, Layer, Stream } from 'effect';
import { LanguageModel } from 'effect/ai';
import { expect, it } from 'vitest';
import { Copilot } from './copilot';

/**
 * A model that first asks for get_account, then, seeing its result in the
 * conversation, answers with the username it found.
 */
const scriptedModel = Layer.effect(
  LanguageModel.LanguageModel,
  LanguageModel.make({
    generateText: () => Effect.succeed([]),
    streamText: (options) => {
      const result = options.prompt.content
        .flatMap((m) => (m.role === 'tool' ? m.content : []))
        .find((part) => part.type === 'tool-result');
      if (!result) {
        return Stream.make({
          type: 'tool-call',
          id: 'call-1',
          name: 'get_account',
          params: {},
        });
      }
      const username = JSON.stringify(result.result).match(
        /"username":"([^"]+)"/
      )?.[1];
      return Stream.make(
        { type: 'text-delta', id: 't', delta: 'You are ' },
        { type: 'text-delta', id: 't', delta: `@${username}.` }
      );
    },
  })
);

it('streams a reply that uses the tools as the user, then answers', async () => {
  const stack = accountsStack();
  const services = Layer.mergeAll(
    PgAnalyticsStore,
    JobBoard.layer,
    Explore.layer,
    JobMatcher.layer.pipe(
      Layer.provide(embedderFrom(() => new Float32Array(3072)))
    )
  ).pipe(Layer.provideMerge(stack.layer));
  const events = await Effect.runPromise(
    Effect.gen(function* () {
      const accounts = yield* Accounts;
      const { user } = yield* accounts.signUp({
        email: 'ada@example.com',
        password: 'correct horse battery',
        username: 'ada',
      });
      const copilot = yield* Copilot;
      return yield* Stream.runCollect(
        copilot.reply(user, [{ role: 'user', content: 'Who am I?' }])
      );
    }).pipe(
      Effect.provide(
        Copilot.layerWith(scriptedModel).pipe(Layer.provideMerge(services))
      ),
      Effect.scoped
    )
  );
  expect(events).toEqual([
    { type: 'tool', id: 'call-1', name: 'get_account', status: 'running' },
    { type: 'tool', id: 'call-1', name: 'get_account', status: 'done' },
    { type: 'text', delta: 'You are ' },
    { type: 'text', delta: '@ada.' },
    { type: 'done' },
  ]);
});
