import { OpenAiLanguageModel } from '@effect/ai-openai';
import { Seniority } from '@repo/api';
import { Context, Effect, Layer, Schema } from 'effect';
import { LanguageModel } from 'effect/ai';
import { FAMILY_KEYS, familyPrompt } from './families';

export class PlanFailed extends Schema.TaggedError<PlanFailed>()('PlanFailed', {
  message: Schema.String,
}) {}

const Step = Schema.Struct({
  kind: Schema.Literals([
    'skill',
    'project',
    'resume',
    'apply',
    'learn',
    'network',
  ]),
  title: Schema.String,
  detail: Schema.String,
  /** The skill it builds or shows, as a name; empty when none. */
  skill: Schema.String,
  /** A job id from the list given, or 0. */
  jobId: Schema.Number,
});

export const Drafted = Schema.Struct({
  destination: Schema.String,
  family: Schema.Literals(FAMILY_KEYS),
  seniority: Seniority,
  summary: Schema.String,
  steps: Schema.Array(Step),
});
export type Drafted = typeof Drafted.Type;

/** What the planner is told: where to, and what the graph knows. */
export interface PlanBrief {
  destination: string;
  strengths: ReadonlyArray<string>;
  skills: ReadonlyArray<string>;
  gaps: ReadonlyArray<string>;
  /** What the destination's roles ask for most, when it's a known family. */
  asks: ReadonlyArray<string>;
  jobs: ReadonlyArray<{
    id: number;
    company: string;
    title: string;
    score: number;
  }>;
  history: ReadonlyArray<string>;
}

const INSTRUCTIONS = `You plan how one person gets from where their resume is to where they want to be. Write 4 to 8 concrete steps, most useful first:
- "skill": show or learn a skill the destination asks for and their resume doesn't show (name it in "skill").
- "project": build something that proves it; tie it to their own projects when you can.
- "resume": change how the resume presents something it already has.
- "apply": a specific job from the list (its id in "jobId"), when one fits the destination.
- "learn" and "network": a course, a community, people to talk to.
Steps are specific to this person (name their projects, employers, skills), not generic advice. Never invent experience they don't have.
family: the destination's role family, one of:
${familyPrompt}
seniority: the destination's level. summary: two sentences on why this destination fits them and the main gap.
"skill" is "" and "jobId" is 0 when a step has none.`;

const brief = (b: PlanBrief) =>
  [
    `Destination: ${b.destination}`,
    `Their strengths: ${b.strengths.join('; ') || 'none read yet'}`,
    `Skills their resume shows: ${b.skills.join(', ')}`,
    `Skills their best-fitting jobs ask for that it doesn't show: ${
      b.gaps.join(', ') || 'none'
    }`,
    b.asks.length
      ? `What roles like the destination ask for most: ${b.asks.join(', ')}`
      : '',
    `Their roles, newest first:\n${b.history.join('\n')}`,
    `Open jobs that fit them (id, company, title, fit):\n${b.jobs
      .map((j) => `${j.id} | ${j.company} | ${j.title} | ${j.score}%`)
      .join('\n')}`,
  ]
    .filter(Boolean)
    .join('\n\n');

/** Steps from a resume to a destination, written by a model. */
export class Planner extends Context.Service<
  Planner,
  { draft(b: PlanBrief): Effect.Effect<Drafted, PlanFailed> }
>()('@repo/careers/Planner') {
  /** Needs an OpenAiClient. */
  static readonly layer = Layer.effect(
    Planner,
    Effect.gen(function* () {
      const model = yield* OpenAiLanguageModel.model('gpt-5-mini', {
        reasoning: { effort: 'low' },
      }).captureRequirements;
      return Planner.of({
        draft: (b) =>
          LanguageModel.generateObject({
            objectName: 'pathway_plan',
            schema: Drafted,
            prompt: [
              { role: 'system', content: INSTRUCTIONS },
              { role: 'user', content: brief(b) },
            ],
          }).pipe(
            Effect.map(({ value }) => value),
            Effect.provide(model),
            Effect.mapError((e) => new PlanFailed({ message: e.message }))
          ),
      });
    })
  );
}

/** Without a model: show the missing skills, then apply to the best fits. */
export const plainPlan = (b: PlanBrief): Drafted => ({
  destination: b.destination,
  family: 'other_tech',
  seniority: 'unspecified',
  summary: `Steps toward ${b.destination}: show the skills its roles ask for, then apply.`,
  steps: [
    ...b.gaps.slice(0, 4).map((skill) => ({
      kind: 'skill' as const,
      title: `Show ${skill}`,
      detail: `Your best-fitting jobs ask for ${skill}; add work or a project that shows it.`,
      skill,
      jobId: 0,
    })),
    ...b.jobs.slice(0, 2).map((j) => ({
      kind: 'apply' as const,
      title: `Apply to ${j.company}`,
      detail: `${j.title}, a ${j.score}% fit.`,
      skill: '',
      jobId: j.id,
    })),
  ],
});
