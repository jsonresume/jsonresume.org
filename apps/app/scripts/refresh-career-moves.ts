/**
 * Learns where people go next from every public resume (@repo/careers
 * refreshMoves): reads new job titles into role families with OpenAI and
 * replaces app.career_moves. The jsonresume-career-moves timer runs it
 * weekly on the box; `vite build --ssr scripts/refresh-career-moves.ts`
 * bundles it. Needs DATABASE_URL and OPENAI_API_KEY.
 */
import { NodeRuntime } from '@effect/platform-node';
import { CareerAiFromEnv } from '@repo/careers';
import { refreshMoves } from '@repo/careers/moves';
import { PgLive } from '@repo/database';
import { Effect, Layer } from 'effect';

NodeRuntime.runMain(
  refreshMoves.pipe(
    Effect.tap((stats) => Effect.logInfo('Career moves refreshed', stats)),
    Effect.provide(Layer.mergeAll(PgLive, CareerAiFromEnv))
  )
);
