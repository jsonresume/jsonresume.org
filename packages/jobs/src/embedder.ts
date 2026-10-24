import { OpenAiEmbeddingModel } from '@effect/ai-openai';
import { Context, Effect, Layer, Schema } from 'effect';
import { DIMENSIONS, normalize } from './vectors';

export class EmbedFailed extends Schema.TaggedError<EmbedFailed>()(
  'EmbedFailed',
  { message: Schema.String }
) {}

/** Text into normalized vectors (text-embedding-3-large, 3072 dimensions). */
export class Embedder extends Context.Service<
  Embedder,
  {
    embed(text: string): Effect.Effect<Float32Array, EmbedFailed>;
    embedMany(
      texts: ReadonlyArray<string>
    ): Effect.Effect<Float32Array[], EmbedFailed>;
  }
>()('@repo/jobs/Embedder') {
  /** Needs an OpenAiClient. */
  static readonly layer = Layer.effect(
    Embedder,
    Effect.gen(function* () {
      const model = yield* OpenAiEmbeddingModel.make({
        model: 'text-embedding-3-large',
        config: { dimensions: DIMENSIONS },
      });
      const failed = (e: { message: string }) =>
        new EmbedFailed({ message: e.message });
      return Embedder.of({
        embed: (text) =>
          model.embed(text).pipe(
            Effect.map((r) => normalize(r.vector)),
            Effect.mapError(failed)
          ),
        embedMany: (texts) =>
          texts.length === 0
            ? Effect.succeed([])
            : model.embedMany(texts).pipe(
                Effect.map((r) => r.embeddings.map((e) => normalize(e.vector))),
                Effect.mapError(failed)
              ),
      });
    })
  );
}

/** For tests: a deterministic Embedder, no model. */
export const embedderFrom = (
  embed: (text: string) => Float32Array
): Layer.Layer<Embedder> =>
  Layer.succeed(
    Embedder,
    Embedder.of({
      embed: (text) => Effect.succeed(embed(text)),
      embedMany: (texts) => Effect.succeed(texts.map(embed)),
    })
  );
