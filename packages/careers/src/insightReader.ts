import { OpenAiLanguageModel } from '@effect/ai-openai';
import { Seniority } from '@repo/api';
import { Context, Effect, Layer, Schema } from 'effect';
import { LanguageModel } from 'effect/ai';
import { familyPrompt } from './families';
import { readable } from './resumeEntries';
import type { ResumeEntry } from './services';

export class ReadFailed extends Schema.TaggedError<ReadFailed>()('ReadFailed', {
  message: Schema.String,
}) {}

/** What the model reads from a resume: each entry's role and skills, and its strengths. */
export const Reading = Schema.Struct({
  entries: Schema.Array(
    Schema.Struct({
      key: Schema.String,
      family: Schema.String,
      seniority: Seniority,
      skills: Schema.Array(
        Schema.Struct({
          name: Schema.String,
          /** 1 mentioned, 2 used, 3 led, built or designed with it. */
          strength: Schema.Number,
          quote: Schema.String,
        })
      ),
    })
  ),
  strengths: Schema.Array(
    Schema.Struct({
      name: Schema.String,
      summary: Schema.String,
      entries: Schema.Array(Schema.String),
    })
  ),
});
export type Reading = typeof Reading.Type;

const MODEL = 'gpt-5-mini';

const INSTRUCTIONS = `You read one resume (JSON Resume) and say, for every entry listed, what it shows.

For each entry key given (answer with the key alone, exactly as given, e.g. "work:0"):
- family: the kind of role, one of these keys (for projects and the like, the kind of role the work is):
${familyPrompt}
- seniority: intern, junior, mid, senior, staff_plus (staff, principal, architect) or lead_management (manager, head of, CTO, founder of a team); "unspecified" only when nothing says.
- skills: every specific skill the entry shows, from all of its text (titles, summaries, descriptions, highlights, keywords), not only the resume's skills list. Technologies, languages, tools, methods and domains ("Kubernetes", "Rust", "LLM evaluation", "Language revitalization"), not kinds of work ("Backend", "Engineering") nor the names of the entry's own company or product. Name each as it is usually written.
  strength: 1 when only mentioned, 2 when used to do the work, 3 when the entry led, built or designed something with it.
  quote: the resume's own words that show it, at most 160 characters, copied, not paraphrased.

Then strengths: 3 to 6 themes the whole resume shows most, each a name of at most 6 words, one plain sentence, and the keys of the entries that show it (keys alone, e.g. "projects:2").

Cite only what the resume says; never add skills, numbers or claims it doesn't make.`;

const prompt = (resume: unknown, entries: ReadonlyArray<ResumeEntry>) =>
  `Entries (key, then what it is):\n${entries
    .map((e) => `${e.key} = ${e.label}${e.detail ? ` (${e.detail})` : ''}`)
    .join('\n')}\n\nResume:\n${JSON.stringify(readable(resume)).slice(
    0,
    40_000
  )}`;

/** One model call that reads a resume's entries, skills and strengths. */
export class InsightReader extends Context.Service<
  InsightReader,
  {
    read(
      resume: unknown,
      entries: ReadonlyArray<ResumeEntry>
    ): Effect.Effect<Reading, ReadFailed>;
  }
>()('@repo/careers/InsightReader') {}

/** Needs an OpenAiClient. */
export const InsightReaderLive = Layer.effect(
  InsightReader,
  Effect.gen(function* () {
    const model = yield* OpenAiLanguageModel.model(MODEL, {
      reasoning: { effort: 'low' },
    }).captureRequirements;
    return InsightReader.of({
      read: (resume, entries) =>
        LanguageModel.generateObject({
          objectName: 'resume_reading',
          schema: Reading,
          prompt: [
            { role: 'system', content: INSTRUCTIONS },
            { role: 'user', content: prompt(resume, entries) },
          ],
        }).pipe(
          Effect.map(({ value }) => value),
          Effect.provide(model),
          Effect.mapError((e) => new ReadFailed({ message: e.message }))
        ),
    });
  })
);
