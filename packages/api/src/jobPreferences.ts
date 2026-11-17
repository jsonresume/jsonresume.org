import { Effect, Schema } from 'effect';
import { EmploymentType, Seniority } from './JobsApi';
import { CompanyStage, Priority, Sector, Workplace } from './jobVocabulary';

/** Each preference as it is, without defaults. */
const preferenceFields = {
  /** Workplaces they'd take, first the one they'd like most. */
  workplaces: Schema.Array(Workplace),
  /** Annual USD: less than this rules a job out. */
  payFloor: Schema.NullOr(Schema.Finite),
  /** Annual USD: what they hope for. */
  payTarget: Schema.NullOr(Schema.Finite),
  /** Kinds of employment they'd take. */
  employment: Schema.Array(EmploymentType),
  /** Levels they'd take; empty means around their own. */
  levels: Schema.Array(Seniority),
  avoidSectors: Schema.Array(Sector),
  likeSectors: Schema.Array(Sector),
  stages: Schema.Array(CompanyStage),
  wantSkills: Schema.Array(Schema.String),
  avoidSkills: Schema.Array(Schema.String),
  /** Where they want to go, in their words. */
  direction: Schema.String,
  priorities: Schema.Array(Priority),
  /** They need a visa sponsored. */
  needsVisa: Schema.Boolean,
};

/**
 * What someone wants from their next job. Empty means no preference. Every
 * key may be missing (older saves): it then reads as empty.
 */
export const JobPreferences = Schema.Struct({
  workplaces: preferenceFields.workplaces.pipe(
    Schema.withDecodingDefaultKey(Effect.succeed([]))
  ),
  payFloor: preferenceFields.payFloor.pipe(
    Schema.withDecodingDefaultKey(Effect.succeed(null))
  ),
  payTarget: preferenceFields.payTarget.pipe(
    Schema.withDecodingDefaultKey(Effect.succeed(null))
  ),
  employment: preferenceFields.employment.pipe(
    Schema.withDecodingDefaultKey(Effect.succeed([]))
  ),
  levels: preferenceFields.levels.pipe(
    Schema.withDecodingDefaultKey(Effect.succeed([]))
  ),
  avoidSectors: preferenceFields.avoidSectors.pipe(
    Schema.withDecodingDefaultKey(Effect.succeed([]))
  ),
  likeSectors: preferenceFields.likeSectors.pipe(
    Schema.withDecodingDefaultKey(Effect.succeed([]))
  ),
  stages: preferenceFields.stages.pipe(
    Schema.withDecodingDefaultKey(Effect.succeed([]))
  ),
  wantSkills: preferenceFields.wantSkills.pipe(
    Schema.withDecodingDefaultKey(Effect.succeed([]))
  ),
  avoidSkills: preferenceFields.avoidSkills.pipe(
    Schema.withDecodingDefaultKey(Effect.succeed([]))
  ),
  direction: preferenceFields.direction.pipe(
    Schema.withDecodingDefaultKey(Effect.succeed(''))
  ),
  priorities: preferenceFields.priorities.pipe(
    Schema.withDecodingDefaultKey(Effect.succeed([]))
  ),
  needsVisa: preferenceFields.needsVisa.pipe(
    Schema.withDecodingDefaultKey(Effect.succeed(false))
  ),
  /** Suggestions they turned down, by id. */
  dismissed: Schema.Array(Schema.String).pipe(
    Schema.withDecodingDefaultKey(Effect.succeed([]))
  ),
});
/** A change to preferences: only the keys given change. */
export const JobPreferenceChange = Schema.Struct({
  workplaces: Schema.optionalKey(preferenceFields.workplaces),
  payFloor: Schema.optionalKey(preferenceFields.payFloor),
  payTarget: Schema.optionalKey(preferenceFields.payTarget),
  employment: Schema.optionalKey(preferenceFields.employment),
  levels: Schema.optionalKey(preferenceFields.levels),
  avoidSectors: Schema.optionalKey(preferenceFields.avoidSectors),
  likeSectors: Schema.optionalKey(preferenceFields.likeSectors),
  stages: Schema.optionalKey(preferenceFields.stages),
  wantSkills: Schema.optionalKey(preferenceFields.wantSkills),
  avoidSkills: Schema.optionalKey(preferenceFields.avoidSkills),
  direction: Schema.optionalKey(preferenceFields.direction),
  priorities: Schema.optionalKey(preferenceFields.priorities),
  needsVisa: Schema.optionalKey(preferenceFields.needsVisa),
});
export type JobPreferences = typeof JobPreferences.Type;
