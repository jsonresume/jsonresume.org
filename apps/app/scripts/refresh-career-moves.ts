/**
 * Learns where people go next from every public resume (@repo/careers
 * refreshMoves): reads new job titles into role families with OpenAI and
 * replaces app.career_moves. The jsonresume-career-moves timer runs it
 * weekly on the box; `vite build --ssr scripts/refresh-career-moves.ts`
 * bundles it. Needs DATABASE_URL and OPENAI_API_KEY.
 */
import { OpenAiClient } from '@effect/ai-openai';
import { NodeRuntime } from '@effect/platform-node';
import { refreshMoves, TitleReaderLive } from '@repo/careers/moves';
import { PgLive } from '@repo/database';
import { Config, Effect, Layer } from 'effect';
import { FetchHttpClient } from 'effect/http';

const reader = Layer.unwrap(
  Effect.gen(function* () {
    const apiKey = yield* Config.Redacted('OPENAI_API_KEY');
    return TitleReaderLive.pipe(
      Layer.provide(OpenAiClient.layer({ apiKey })),
      Layer.provide(FetchHttpClient.layer)
    );
  })
);

NodeRuntime.runMain(
  refreshMoves.pipe(Effect.provide(Layer.mergeAll(PgLive, reader)))
);
