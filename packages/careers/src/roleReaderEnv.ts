import { OpenAiClient } from '@effect/ai-openai';
import { Config, Effect, Layer, Option } from 'effect';
import { FetchHttpClient } from 'effect/http';
import { RoleReaderLive } from './roleReader';

/**
 * A RoleReader on OpenAI when OPENAI_API_KEY is set, else none at all:
 * refreshRoles and refreshArchetypes look for it with serviceOption and do
 * without (no roles read; plain archetype summaries).
 */
export const RoleReaderFromEnv: Layer.Layer<never> = Layer.unwrap(
  Effect.gen(function* () {
    const key = yield* Config.option(Config.Redacted('OPENAI_API_KEY'));
    if (Option.isNone(key)) return Layer.empty;
    return RoleReaderLive.pipe(
      Layer.provide(OpenAiClient.layer({ apiKey: key.value })),
      Layer.provide(FetchHttpClient.layer)
    );
  }).pipe(Effect.orDie)
);
