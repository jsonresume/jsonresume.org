import { OpenAiLanguageModel } from '@effect/ai-openai';
import { Seniority } from '@repo/api';
import { Context, Effect, Layer, Schema } from 'effect';
import { LanguageModel } from 'effect/ai';
import { FAMILY_KEYS, familyPrompt, type Family } from './families';

export class TitleReadFailed extends Schema.TaggedError<TitleReadFailed>()(
  'TitleReadFailed',
  { message: Schema.String }
) {}

/** A job title as a resume writes it, with the company when there is one. */
export interface TitleInput {
  title: string;
  company?: string | null;
}

export interface ReadTitle {
  title: string;
  family: Family;
  seniority: Seniority;
}

const MODEL = 'gpt-5-mini';
/** Bump when the instructions or families change: stored readings name it. */
export const TITLES_VERSION = 'titles-1';
const CHUNK = 150;

const INSTRUCTIONS = `You sort job titles from resumes into role families and seniority.
Each line is "<number>. <title>" and maybe "@ <company>". Answer for EVERY line, by its number.

family: exactly one key from this list (key: name):
${familyPrompt}

Rules:
- Judge the work the title names, not the company.
- General software titles with no area ("Software Engineer", "Developer", "Programmer", "Web Developer") are fullstack.
- Founders and co-founders are founder, even when the title adds CTO.
- CTO, VP or head of engineering is eng_executive; engineering manager, team lead of engineers, director of engineering is eng_manager.
- Titles that aren't technical work (sales, marketing, support, operations, finance, retail, hospitality) are non_tech.
- A tech lead or lead engineer who still builds is staff_plus; lead_management is for people managing people.
- seniority: intern, junior, mid, senior, staff_plus (staff, principal, distinguished, architect, tech lead), lead_management (manager, head, director, VP, C-level, founder), or unspecified when the title doesn't say (plain "Engineer" is unspecified, not mid).`;

const Answers = Schema.Struct({
  items: Schema.Array(
    Schema.Struct({
      n: Schema.Number,
      family: Schema.Literals(FAMILY_KEYS),
      seniority: Seniority,
    })
  ),
});

const line = (t: TitleInput, n: number) =>
  `${n}. ${t.title.slice(0, 120)}${
    t.company ? ` @ ${t.company.slice(0, 60)}` : ''
  }`;

export interface TitleReaderShape {
  read(
    titles: ReadonlyArray<TitleInput>
  ): Effect.Effect<ReadonlyArray<ReadTitle>, TitleReadFailed>;
}

/** Job titles into role families and seniority, many at a time. */
export class TitleReader extends Context.Service<
  TitleReader,
  TitleReaderShape
>()('@repo/careers/TitleReader') {}

/** Needs an OpenAiClient. */
export const TitleReaderLive = Layer.effect(
  TitleReader,
  Effect.gen(function* () {
    const model = yield* OpenAiLanguageModel.model(MODEL, {
      reasoning: { effort: 'low' },
    }).captureRequirements;

    const ask = (chunk: ReadonlyArray<TitleInput>) =>
      LanguageModel.generateObject({
        objectName: 'title_families',
        schema: Answers,
        prompt: [
          { role: 'system', content: INSTRUCTIONS },
          {
            role: 'user',
            content: chunk.map((t, i) => line(t, i + 1)).join('\n'),
          },
        ],
      }).pipe(
        Effect.map(({ value }) =>
          value.items.flatMap((a): ReadTitle[] => {
            const t = chunk[a.n - 1];
            return t
              ? [{ title: t.title, family: a.family, seniority: a.seniority }]
              : [];
          })
        ),
        Effect.provide(model),
        Effect.mapError((e) => new TitleReadFailed({ message: e.message }))
      );

    const pass = (titles: ReadonlyArray<TitleInput>) =>
      Effect.forEach(
        Array.from({ length: Math.ceil(titles.length / CHUNK) }, (_, i) =>
          titles.slice(i * CHUNK, (i + 1) * CHUNK)
        ),
        ask,
        { concurrency: 4 }
      ).pipe(Effect.map((all) => all.flat()));

    return TitleReader.of({
      // The model sometimes skips a line in a long list: ask again once.
      read: Effect.fn('TitleReader.read')(function* (titles) {
        const first = yield* pass(titles);
        const got = new Set(first.map((r) => r.title));
        const missing = titles.filter((t) => !got.has(t.title));
        if (missing.length === 0) return first;
        return [...first, ...(yield* pass(missing))];
      }),
    });
  })
);
