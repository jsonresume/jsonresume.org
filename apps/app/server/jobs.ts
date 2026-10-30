/**
 * The jobs pipeline, run once: import the newest Hacker News "Who is
 * hiring?" posts, parse, embed and group them (see @repo/jobs); then read
 * the roles in new posts and what each requires, and sum up role families
 * (@repo/careers/roles). The jsonresume-jobs timer runs it on the box;
 * `vite build --ssr server/jobs.ts` bundles it. JOBS_DAYS widens how far
 * back it parses and embeds; JOBS_REPARSE_BEFORE (an ISO time) parses again
 * posts parsed before it, after a prompt change.
 */
import { NodeRuntime } from '@effect/platform-node';
import {
  refreshArchetypes,
  refreshRoles,
  RoleReaderFromEnv,
} from '@repo/careers/roles';
import { PgLive } from '@repo/database';
import {
  HackerNews,
  JobStore,
  OpenAiJobs,
  pipelineDefaults,
  runPipeline,
} from '@repo/jobs';
import { Cause, Config, Effect, Layer, Option } from 'effect';
import { FetchHttpClient } from 'effect/http';
import { CareerSkills } from './careerSkills';

/** Roles and archetypes: a failure here is logged, and the pipeline's run stands. */
const careers = Effect.gen(function* () {
  const roles = yield* refreshRoles();
  const archetypes = yield* refreshArchetypes();
  yield* Effect.logInfo('Job roles refreshed', { roles, archetypes });
}).pipe(
  Effect.provide(Layer.mergeAll(CareerSkills, RoleReaderFromEnv)),
  Effect.catchCause((cause) =>
    Effect.logWarning('Job roles not refreshed', {
      cause: Cause.pretty(cause),
    })
  )
);

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
  yield* careers;
});

const services = Layer.mergeAll(
  JobStore.layer,
  HackerNews.layer.pipe(Layer.provide(FetchHttpClient.layer)),
  OpenAiJobs
).pipe(Layer.provideMerge(PgLive));

NodeRuntime.runMain(main.pipe(Effect.provide(services)));
