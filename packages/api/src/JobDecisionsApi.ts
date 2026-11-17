import { Schema } from 'effect';
import { HttpApiEndpoint, HttpApiGroup } from 'effect/http-api';
import { Authentication } from './Authentication';
import { NoResume } from './errors';
import { JobMatch } from './JobsApi';
import { JobPreferences } from './jobPreferences';

export { JobPreferenceChange, JobPreferences } from './jobPreferences';
import { CompanyStage, Sector } from './jobVocabulary';

export {
  CompanyStage,
  Priority,
  priorityLabels,
  Sector,
  sectorLabels,
  stageLabels,
  Workplace,
  workplaceLabels,
} from './jobVocabulary';

/** The decision on one job, best first: apply, stretch, skip, or ruled out. */
export const Verdict = Schema.Literals([
  'apply',
  'stretch',
  'skip',
  'ruled_out',
]);
export type Verdict = typeof Verdict.Type;

export const DecisionFactor = Schema.Literals([
  'skills',
  'level',
  'fit',
  'pay',
  'place',
  'sector',
  'stage',
  'stack',
  'direction',
  'employment',
  'visa',
  'marks',
]);
export type DecisionFactor = typeof DecisionFactor.Type;

export const DecisionReason = Schema.Struct({
  factor: DecisionFactor,
  tone: Schema.Literals(['good', 'bad', 'note']),
  text: Schema.String,
});
export type DecisionReason = typeof DecisionReason.Type;

export const JobDecision = Schema.Struct({
  verdict: Verdict,
  /** How likely they'd get it, 0 to 100. */
  chance: Schema.Number,
  /** How much they'd want it, 0 to 100. */
  appeal: Schema.Number,
  /** Appeal discounted by chance: what the list is ordered by, 0 to 100. */
  value: Schema.Number,
  /** What decided it, the strongest first. */
  reasons: Schema.Array(DecisionReason),
  /** Required skills the resume shows, and those it doesn't. */
  shown: Schema.Array(Schema.String),
  missing: Schema.Array(Schema.String),
  sectors: Schema.Array(Sector),
  stage: CompanyStage,
});
export type JobDecision = typeof JobDecision.Type;

export const DecidedJob = Schema.Struct({
  ...JobMatch.fields,
  decision: JobDecision,
});
export type DecidedJob = typeof DecidedJob.Type;

/** A preference learned from marks, for the person to accept or dismiss. */
export const PreferenceSuggestion = Schema.Struct({
  id: Schema.String,
  text: Schema.String,
  /** Their preferences once accepted. */
  preferences: JobPreferences,
});
export type PreferenceSuggestion = typeof PreferenceSuggestion.Type;

export const JobDecisions = Schema.Struct({
  jobs: Schema.Array(DecidedJob),
  preferences: JobPreferences,
  /** False until they've said what they want. */
  stated: Schema.Boolean,
  /** Unmarked jobs of each verdict, all of them (the list sends the best of each). */
  counts: Schema.Struct({
    apply: Schema.Number,
    stretch: Schema.Number,
    skip: Schema.Number,
    ruled_out: Schema.Number,
  }),
  /** Model work still under way: posts being judged, the resume being read. */
  waitingFor: Schema.Array(Schema.Literals(['jobs', 'resume'])),
  suggestions: Schema.Array(PreferenceSuggestion),
});
export type JobDecisions = typeof JobDecisions.Type;

/** Decisions on the open jobs for the signed-in user, and what they want. */
export class JobDecisionsApi extends HttpApiGroup.make('jobDecisions')
  .add(
    HttpApiEndpoint.get('decisions', '/me/job-decisions', {
      /** Seconds to wait for model work before answering with what's ready. */
      query: { wait: Schema.optionalKey(Schema.NumberFromString) },
      success: JobDecisions,
      error: NoResume,
    }),
    HttpApiEndpoint.get('preferences', '/me/job-preferences', {
      success: JobPreferences,
    }),
    HttpApiEndpoint.put('savePreferences', '/me/job-preferences', {
      /** Where the change came from: the editor, a suggestion, the first-run questions. */
      query: {
        source: Schema.optionalKey(
          Schema.Literals(['you', 'suggestion', 'interview'])
        ),
      },
      payload: JobPreferences,
      success: JobPreferences,
    })
  )
  .middleware(Authentication) {}
