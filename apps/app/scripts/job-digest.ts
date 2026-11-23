/**
 * The weekly jobs email (@repo/job-digest sendDigests): this week's new jobs
 * to apply for, to everyone who turned it on. The jsonresume-job-digest
 * timer runs it on Mondays; `vite build --ssr scripts/job-digest.ts`
 * bundles it. Needs app.env (AUTH_SECRET, RESEND_API_KEY, OPENAI_API_KEY)
 * and DATABASE_URL.
 */
import { NodeRuntime } from '@effect/platform-node';
import { PgLive } from '@repo/database';
import { sendDigests } from '@repo/job-digest';
import { Effect } from 'effect';
import { appServices } from '../server/services';

NodeRuntime.runMain(
  sendDigests.pipe(
    Effect.tap((counts) => Effect.logInfo('Job digest done', counts)),
    Effect.provide(appServices(PgLive))
  )
);
