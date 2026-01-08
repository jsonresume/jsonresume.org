/**
 * Pathways Services
 *
 * Effect-TS based services for type-safe async operations.
 * Each service provides a clean interface with typed errors.
 */

export {
  JobService,
  JobServiceLive,
  type JobServiceInterface,
  type Job,
  type GraphNode,
  type GraphEdge,
  type JobsResponse,
  type JobAction,
  type JobFeedback,
  type FilterCriteria,
} from './JobService';

export {
  ResumeService,
  ResumeServiceLive,
  type ResumeServiceInterface,
  type Resume,
  type ResumeBasics,
  type ResumeWork,
  type ResumeEducation,
  type ResumeSkill,
  type ResumeChanges,
  type ChangeSource,
  type SaveResult,
} from './ResumeService';

// Re-export errors for convenience
export * from '../errors';

// ============================================================================
// Combined Layer
// ============================================================================

import { Layer } from 'effect';
import { JobServiceLive } from './JobService';
import { ResumeServiceLive } from './ResumeService';

/**
 * Combined live layer for all Pathways services
 */
export const PathwaysServicesLive = Layer.mergeAll(
  JobServiceLive,
  ResumeServiceLive
);
