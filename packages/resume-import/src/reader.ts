import { OpenAiClient, OpenAiLanguageModel } from '@effect/ai-openai';
import { ImportFailed } from '@repo/api';
import { Config, Context, Effect, Layer, Option } from 'effect';
import { LanguageModel } from 'effect/ai';
import { FetchHttpClient } from 'effect/http';
import { ModelReply } from './shape';

export const MODEL = 'gpt-5-mini';

const INSTRUCTIONS = `You turn a resume (text taken from a PDF, a Word document, a LinkedIn profile or pasted) into JSON Resume.

Rules:
- Use only what the text says. Never invent or embellish; where it doesn't say, use null or an empty list.
- Keep the person's own words for summaries and highlights; one highlight per bullet point. Fix only broken line wraps and hyphenation from the PDF.
- Dates: YYYY-MM-DD, YYYY-MM or YYYY. "Jan 2020" is 2020-01. A current role ("Present", "now") has endDate null.
- basics.label is the headline or current title. basics.location.countryCode is ISO 3166-1 alpha-2, only when the country is clear.
- basics.profiles: social and code profiles (LinkedIn, GitHub, X, Mastodon…), with network and username; url only as written.
- URLs as written, adding https:// when the scheme is missing.
- work is jobs, newest first as the resume lists them; volunteer is unpaid roles; projects are side or open-source projects.
- skills: group as the resume groups them (name the group, keywords for the skills in it); a flat list becomes one entry per skill.
- Text in the resume that fits no field (a cover note, page numbers, "References available") is left out.
- unsure: every field you filled that you inferred rather than copied, or that may belong elsewhere, as a JSON pointer into resume (e.g. /work/0/startDate, /basics/location/city) with "medium" (likely right) or "low" (a guess). Leave out fields you copied plainly.`;

/** Resume text into JSON Resume, with a model. */
export class ResumeReader extends Context.Service<
  ResumeReader,
  {
    /** The model's name, kept with each import (null for no model). */
    readonly model: string;
    read(text: string): Effect.Effect<ModelReply, ImportFailed>;
  }
>()('@repo/resume-import/ResumeReader') {
  /** On the LanguageModel given: OpenAI in production, a fake in tests. */
  static readonly layer = (model: string = MODEL) =>
    Layer.effect(
      ResumeReader,
      Effect.gen(function* () {
        const language = yield* LanguageModel.LanguageModel;
        return ResumeReader.of({
          model,
          read: (text) =>
            LanguageModel.generateObject({
              objectName: 'json_resume',
              schema: ModelReply,
              prompt: [
                { role: 'system', content: INSTRUCTIONS },
                { role: 'user', content: text },
              ],
            }).pipe(
              Effect.map(({ value }) => value),
              Effect.provideService(LanguageModel.LanguageModel, language),
              Effect.tapError((e) =>
                Effect.logWarning('Resume import: the model failed', {
                  error: e.message,
                })
              ),
              Effect.mapError(
                () =>
                  new ImportFailed({
                    message:
                      'The resume couldn’t be read just now. Try again in a minute.',
                  })
              ),
              Effect.withSpan('ResumeReader.read')
            ),
        });
      })
    );
}

/**
 * A ResumeReader on OpenAI with OPENAI_API_KEY. Without the key (local
 * development) each read fails, saying so; LinkedIn exports, which need no
 * model, still import.
 */
export const ResumeReaderFromEnv: Layer.Layer<ResumeReader> = Layer.unwrap(
  Effect.gen(function* () {
    const key = yield* Config.option(Config.Redacted('OPENAI_API_KEY'));
    if (Option.isNone(key)) {
      return Layer.succeed(
        ResumeReader,
        ResumeReader.of({
          model: MODEL,
          read: () =>
            Effect.fail(
              new ImportFailed({ message: 'OPENAI_API_KEY is not set' })
            ),
        })
      );
    }
    return ResumeReader.layer().pipe(
      Layer.provide(
        OpenAiLanguageModel.layer({
          model: MODEL,
          config: { reasoning: { effort: 'low' } },
        })
      ),
      Layer.provide(OpenAiClient.layer({ apiKey: key.value })),
      Layer.provide(FetchHttpClient.layer)
    );
  }).pipe(Effect.orDie)
);
