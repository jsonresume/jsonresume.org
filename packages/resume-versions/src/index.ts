export { diffResumes, sameJson, type Change, type ChangeKind } from './diff';
export {
  isRealResume,
  isSampleResume,
  savedProperties,
  sectionCount,
  type SaveOutcome,
  type SaveSource,
} from './real';
export {
  ActorKind,
  MAX_PAGE,
  ResumeVersions,
  userActor,
  type Actor,
  type ResumeVersion,
  type VersionSummary,
} from './versions';
export {
  MAX_VARIANTS,
  slugOf,
  Variants,
  type Variant,
  type VariantFailure,
} from './variants';
