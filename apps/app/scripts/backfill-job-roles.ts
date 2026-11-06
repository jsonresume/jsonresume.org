/**
 * One-off, run on the box once @repo/careers's job roles land: reads the
 * roles in every open job post and what each requires, then sums up role
 * families. The jobs timer does the same for new posts after each run.
 * JOB_ROLES_LIMIT caps how many posts it reads (default: all open ones).
 *
 *   vite build --ssr scripts/backfill-job-roles.ts --outDir <dir> && node <dir>/backfill-job-roles.js
 */
import { NodeRuntime } from '@effect/platform-node';
import {
  refreshArchetypes,
  refreshRoles,
  RoleReaderFromEnv,
} from '@repo/careers/roles';
import { PgLive } from '@repo/database';
import { Config, Effect, Layer } from 'effect';
import { CareerSkills } from '../server/careerSkills';

const main = Effect.gen(function* () {
  const limit = yield* Config.Int('JOB_ROLES_LIMIT').pipe(
    Config.withDefault(100_000)
  );
  const roles = yield* refreshRoles({ limit, concurrency: 6 });
  yield* Effect.logInfo('backfilled job roles', roles);
  const archetypes = yield* refreshArchetypes();
  yield* Effect.logInfo('refreshed role archetypes', archetypes);
});

NodeRuntime.runMain(
  main.pipe(
    Effect.provide(
      Layer.mergeAll(CareerSkills, RoleReaderFromEnv).pipe(
        Layer.provideMerge(PgLive)
      )
    )
  )
);
