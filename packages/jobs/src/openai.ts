import { OpenAiClient } from '@effect/ai-openai';
import { Config, Effect, Layer, Option } from 'effect';
import { FetchHttpClient } from 'effect/http';
import { Embedder, EmbedFailed } from './embedder';
import { JobFitter } from './fitter';
import { JobParser, ParseFailed } from './parser';

const missing = 'OPENAI_API_KEY is not set';

/**
 * The parser, embedder and fitter on OpenAI, with OPENAI_API_KEY. Without
 * the key (local development) the parser and embedder fail each call
 * instead and there is no fitter, so the rest of the app still runs.
 */
export const OpenAiJobs = Layer.unwrap(
  Effect.gen(function* () {
    const key = yield* Config.option(Config.Redacted('OPENAI_API_KEY'));
    if (Option.isNone(key)) {
      return Layer.mergeAll(
        Layer.succeed(
          Embedder,
          Embedder.of({
            embed: () => Effect.fail(new EmbedFailed({ message: missing })),
            embedMany: () => Effect.fail(new EmbedFailed({ message: missing })),
          })
        ),
        Layer.succeed(
          JobParser,
          JobParser.of({
            parse: () => Effect.fail(new ParseFailed({ message: missing })),
          })
        )
      );
    }
    return Layer.mergeAll(
      Embedder.layer,
      JobParser.layer,
      JobFitter.layer
    ).pipe(
      Layer.provide(OpenAiClient.layer({ apiKey: key.value })),
      Layer.provide(FetchHttpClient.layer)
    );
  })
);
