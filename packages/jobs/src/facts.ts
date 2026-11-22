import { OpenAiLanguageModel } from '@effect/ai-openai';
import { CompanyStage, Sector } from '@repo/api';
import { Context, Effect, Layer, Schema } from 'effect';
import { LanguageModel } from 'effect/ai';

export class FactsFailed extends Schema.TaggedError<FactsFailed>()(
  'FactsFailed',
  { message: Schema.String }
) {}

/** What a post says about the company: what it works on, its stage, its size. */
export const CompanyFacts = Schema.Struct({
  sectors: Schema.Array(Sector),
  stage: CompanyStage,
  /** People at the company, when the post says. */
  teamSize: Schema.NullOr(Schema.Number),
  /** Facts the post states that people weigh: "profitable since 2016", "Series A, a16z". */
  signals: Schema.Array(Schema.String),
});
export type CompanyFacts = typeof CompanyFacts.Type;

export const noFacts: CompanyFacts = {
  sectors: [],
  stage: 'unspecified',
  teamSize: null,
  signals: [],
};

/** Bump when the instructions change: facts are read again. */
export const FACTS_VERSION = 'facts-1';
const MODEL = 'gpt-5-mini';

const INSTRUCTIONS = `You read job posts from Hacker News "Who is hiring?" and say what each post states about the company. Answer for EVERY post, by its id.
- sectors: what the company works on, 1-3 from the list, most central first. A company that sells to an industry is in that industry (payroll software for clinics: healthcare, enterprise_saas). Empty only when the post doesn't say.
- stage: seed (pre-seed, seed, "just raised"), early (Series A or B), growth (Series C or later, unicorn, late stage), public (listed), bootstrapped (self-funded or profitable without saying it raised), nonprofit, government, agency (consultancy, dev shop, staffing). "unspecified" when the post doesn't say. Never guess from the name.
- teamSize: the number of people at the company or team when the post gives one; null otherwise.
- signals: up to 3 short facts the post states that a candidate weighs: funding and investors, profitability, revenue or users, notable customers, mission. Quote the post's facts; never add your own.`;

const Read = Schema.Struct({
  facts: Schema.Array(
    Schema.Struct({ id: Schema.Number, ...CompanyFacts.fields })
  ),
});

export interface FactsPost {
  id: number;
  text: string;
}

const POST_CHARS = 2000;

/** Company facts from posts, many at a time, with an OpenAI model. */
export class FactsReader extends Context.Service<
  FactsReader,
  {
    read(
      posts: ReadonlyArray<FactsPost>
    ): Effect.Effect<ReadonlyMap<number, CompanyFacts>, FactsFailed>;
  }
>()('@repo/jobs/FactsReader') {
  /** Needs an OpenAiClient. */
  static readonly layer = Layer.effect(
    FactsReader,
    Effect.gen(function* () {
      const model = yield* OpenAiLanguageModel.model(MODEL, {
        reasoning: { effort: 'low' },
      }).captureRequirements;
      return FactsReader.of({
        read: (posts) =>
          LanguageModel.generateObject({
            objectName: 'company_facts',
            schema: Read,
            prompt: [
              { role: 'system', content: INSTRUCTIONS },
              {
                role: 'user',
                content: posts
                  .map((p) => `[${p.id}]\n${p.text.slice(0, POST_CHARS)}`)
                  .join('\n\n---\n\n'),
              },
            ],
          }).pipe(
            Effect.map(({ value }) => {
              const asked = new Set(posts.map((p) => p.id));
              return new Map(
                value.facts
                  .filter((f) => asked.has(f.id))
                  .map(({ id, ...facts }) => [
                    id,
                    {
                      ...facts,
                      sectors: [...new Set(facts.sectors)].slice(0, 3),
                      signals: facts.signals.slice(0, 3),
                    },
                  ])
              );
            }),
            Effect.provide(model),
            Effect.mapError((e) => new FactsFailed({ message: e.message }))
          ),
      });
    })
  );
}
