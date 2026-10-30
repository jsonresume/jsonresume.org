import { OpenAiLanguageModel } from '@effect/ai-openai';
import { Context, Effect, Layer, Schema } from 'effect';
import { LanguageModel } from 'effect/ai';

export class FitFailed extends Schema.TaggedError<FitFailed>()('FitFailed', {
  message: Schema.String,
}) {}

/** How well one job fits a candidate, as the model judges it. */
export const Fit = Schema.Struct({
  id: Schema.Number,
  /** 0 to 100. */
  score: Schema.Number,
  /** The post's role that fits best: posts often list several. */
  role: Schema.String,
  /** The overlap (or the gap), in a few words. */
  why: Schema.String,
});
export type Fit = typeof Fit.Type;

/** A job as the fitter reads it: the post's own text. */
export interface FitJob {
  id: number;
  company: string;
  text: string;
}

const MODEL = 'gpt-5-mini';
/** Bump when the instructions change: cached fits are keyed by it. */
export const FIT_VERSION = 'fit-2';
const CHUNK = 25;
const POST_CHARS = 1500;

const INSTRUCTIONS = `You judge how well job posts from Hacker News "Who is hiring?" fit one candidate as their next job. Score EVERY post you are given, 0-100.
85+: their recent work is what the role does and their level fits. 70-84: strong. 50-69: plausible. 30-49: weak. Under 30: poor.
- A post may list several roles: judge its best role for the candidate and name it in "role", as the post titles it.
- Weigh what they do now and are moving towards (recent roles and projects) above older experience.
- Ignore location, pay and level: those are checked separately.
- Use the whole range; avoid ties.
"why": under 15 words, to the candidate as "you": the concrete overlap or gap, e.g. "You've shipped agent harnesses; this role builds one" or "Wants Kubernetes depth your resume doesn't show".`;

const Scores = Schema.Struct({ scores: Schema.Array(Fit) });

const block = (job: FitJob) =>
  `[${job.id}] ${job.company}\n${job.text.slice(0, POST_CHARS)}`;

/** Scores jobs against a candidate, many at a time. */
export class JobFitter extends Context.Service<
  JobFitter,
  {
    fit(
      candidate: string,
      jobs: ReadonlyArray<FitJob>
    ): Effect.Effect<ReadonlyArray<Fit>, FitFailed>;
  }
>()('@repo/jobs/JobFitter') {
  /** Needs an OpenAiClient. */
  static readonly layer = Layer.effect(
    JobFitter,
    Effect.gen(function* () {
      const model = yield* OpenAiLanguageModel.model(MODEL, {
        reasoning: { effort: 'low' },
      }).captureRequirements;
      const scoreChunk = (candidate: string, jobs: ReadonlyArray<FitJob>) =>
        LanguageModel.generateObject({
          objectName: 'job_fits',
          schema: Scores,
          prompt: [
            { role: 'system', content: INSTRUCTIONS },
            {
              role: 'user',
              content: `${candidate}\n\nJob posts:\n\n${jobs
                .map(block)
                .join('\n\n---\n\n')}`,
            },
          ],
        }).pipe(
          Effect.map(({ value }) => value.scores),
          Effect.provide(model),
          Effect.mapError((e) => new FitFailed({ message: e.message }))
        );
      const chunks = <A>(items: ReadonlyArray<A>) =>
        Array.from({ length: Math.ceil(items.length / CHUNK) }, (_, i) =>
          items.slice(i * CHUNK, (i + 1) * CHUNK)
        );
      const pass = (candidate: string, jobs: ReadonlyArray<FitJob>) =>
        Effect.forEach(chunks(jobs), (c) => scoreChunk(candidate, c), {
          concurrency: 8,
        }).pipe(Effect.map((all) => all.flat()));

      return JobFitter.of({
        // The model sometimes skips a post in a long list: ask again once.
        fit: Effect.fn('JobFitter.fit')(function* (candidate, jobs) {
          const asked = new Set(jobs.map((j) => j.id));
          const first = (yield* pass(candidate, jobs)).filter((f) =>
            asked.has(f.id)
          );
          const got = new Set(first.map((f) => f.id));
          const missing = jobs.filter((j) => !got.has(j.id));
          if (missing.length === 0) return first;
          const second = yield* pass(candidate, missing);
          return [...first, ...second.filter((f) => asked.has(f.id))];
        }),
      });
    })
  );
}
