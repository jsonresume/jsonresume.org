import { OpenAiLanguageModel } from '@effect/ai-openai';
import { Context, Effect, Layer, Schema } from 'effect';
import { LanguageModel } from 'effect/ai';
import { Posting } from './posting';
import { postText } from './postText';

export class ParseFailed extends Schema.TaggedError<ParseFailed>()(
  'ParseFailed',
  { message: Schema.String }
) {}

const MODEL = 'gpt-5-mini';

const INSTRUCTIONS = `You turn one job post from Hacker News "Who is hiring?" into structured data.

Rules:
- Use only what the post says. Where it doesn't say, use null, an empty list or "unspecified". Never guess.
- A post may list several roles. Describe the main one, or the most senior engineering role, in title; mention the others in summary.
- summary: two or three plain sentences on what the company does and what the role is.
- remote: "remote_global" only when the post says anywhere or worldwide. Remote limited to countries, regions or time zones is "remote_region", with remoteRegions listing them (e.g. ["US", "Canada"], ["EU"]). An office is "onsite"; office plus remote days is "hybrid".
- seniority: intern, junior, mid, senior, staff_plus (staff, principal), lead_management (manager, head of, VP, CTO).
- employmentType: "cofounder" for founding roles paid mostly in equity.
- salary: the pay exactly as the post writes it. salaryMin and salaryMax: annual amounts in US dollars, only when the post states numbers; convert hourly (x2000), monthly (x12) and other currencies (approximately). One number means min and max are equal.
- visa: "yes" or "no" only when the post says so.
- skills: specific technologies, languages, frameworks and tools named in the post (React, PostgreSQL, Kubernetes), each with related keywords from the post. Not categories like "Backend".
- responsibilities and qualifications: short phrases from the post.
- apply: the URL or email the post says to apply at.
- countryCode: ISO 3166-1 alpha-2.`;

/** Job posts into Postings, with an OpenAI model. */
export class JobParser extends Context.Service<
  JobParser,
  { parse(html: string): Effect.Effect<Posting, ParseFailed> }
>()('@repo/jobs/JobParser') {
  /** Needs an OpenAiClient. */
  static readonly layer = Layer.effect(
    JobParser,
    Effect.gen(function* () {
      const model = yield* OpenAiLanguageModel.model(MODEL, {
        reasoning: { effort: 'low' },
      }).captureRequirements;
      return JobParser.of({
        parse: (html) =>
          LanguageModel.generateObject({
            objectName: 'job_posting',
            schema: Posting,
            prompt: [
              { role: 'system', content: INSTRUCTIONS },
              { role: 'user', content: postText(html) },
            ],
          }).pipe(
            Effect.map((response) => response.value),
            Effect.provide(model),
            Effect.mapError((e) => new ParseFailed({ message: e.message }))
          ),
      });
    })
  );
}
