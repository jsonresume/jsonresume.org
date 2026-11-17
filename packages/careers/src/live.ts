import { OpenAiClient } from '@effect/ai-openai';
import { Config, Effect, Layer, Option } from 'effect';
import { FetchHttpClient } from 'effect/http';
import { PreferenceStore } from '@repo/jobs';
import { CareerGraphs } from './careerGraph';
import { JobDecisions } from './decisions';
import { CareerMovesLive } from './careerMoves';
import { InsightReaderLive } from './insightReader';
import { JobRolesLive } from './jobRoles';
import { Planner } from './planner';
import { PlanStore } from './plans';
import { ResumeInsightsLive } from './resumeInsights';
import { RoleReaderLive } from './roleReader';
import { SkillCatalogLive } from './skills';
import { Snapshots } from './snapshots';
import { TitleReaderLive } from './titleReader';

/**
 * Every model the career graph reads with (resumes, job posts, titles,
 * plans), on OpenAI when OPENAI_API_KEY is set; none at all without it,
 * and each part does without.
 */
export const CareerAiFromEnv: Layer.Layer<never> = Layer.unwrap(
  Effect.gen(function* () {
    const key = yield* Config.option(Config.Redacted('OPENAI_API_KEY'));
    if (Option.isNone(key)) return Layer.empty;
    return Layer.mergeAll(
      InsightReaderLive,
      RoleReaderLive,
      TitleReaderLive,
      Planner.layer
    ).pipe(
      Layer.provide(OpenAiClient.layer({ apiKey: key.value })),
      Layer.provide(FetchHttpClient.layer)
    );
  }).pipe(Effect.orDie)
);

/**
 * CareerGraphs and JobDecisions, and everything under them, over the
 * database. Needs a SqlClient and a JobMatcher; an Embedder, when given,
 * matches skills by meaning.
 */
export const CareersLive = Layer.mergeAll(
  CareerGraphs.layer,
  JobDecisions.layer
).pipe(
  Layer.provideMerge(
    Layer.mergeAll(
      ResumeInsightsLive,
      JobRolesLive,
      CareerMovesLive,
      PlanStore.layer,
      Snapshots.layer,
      PreferenceStore.layer
    )
  ),
  Layer.provideMerge(SkillCatalogLive),
  Layer.provide(CareerAiFromEnv)
);
