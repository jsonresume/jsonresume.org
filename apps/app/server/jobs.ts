/**
 * The jobs pipeline, run once: import the newest Hacker News "Who is
 * hiring?" posts, parse, embed and group them (see @repo/jobs). The
 * jsonresume-jobs timer runs it on the box; `vite build --ssr server/jobs.ts`
 * bundles it. JOBS_DAYS widens how far back it parses and embeds;
 * JOBS_REPARSE_BEFORE (an ISO time) parses again posts parsed before it,
 * after a prompt change.
 */
import { NodeRuntime } from '@effect/platform-node';
import { PgLive } from '@repo/database';
import {
  HackerNews,
  JobStore,
  OpenAiJobs,
  pipelineDefaults,
  runPipeline,
} from '@repo/jobs';
import { Config, Effect, Layer, Option } from 'effect';
import { FetchHttpClient } from 'effect/http';

const main = Effect.gen(function* () {
  const days = yield* Config.Int('JOBS_DAYS').pipe(
    Config.withDefault(pipelineDefaults.days)
  );
  const reparse = yield* Config.option(Config.String('JOBS_REPARSE_BEFORE'));
  yield* runPipeline({
    ...pipelineDefaults,
    days,
    ...(Option.isSome(reparse) && { reparseBefore: new Date(reparse.value) }),
  });
});

const services = Layer.mergeAll(
  JobStore.layer.pipe(Layer.provide(PgLive)),
  HackerNews.layer.pipe(Layer.provide(FetchHttpClient.layer)),
  OpenAiJobs
);

NodeRuntime.runMain(main.pipe(Effect.provide(services)));
