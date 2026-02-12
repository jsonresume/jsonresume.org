import { Effect, Context, Layer, pipe } from 'effect';
import { FetchError, UpdateError } from '../errors';
import { findMatchingJobs } from '../utils/jobFilterMatcher';
import type {
  Job,
  JobsResponse,
  JobFeedback,
  FilterCriteria,
  JobServiceInterface,
} from './jobServiceTypes';

// Re-export types for consumers
export type {
  Job,
  GraphNode,
  GraphEdge,
  JobsResponse,
  JobAction,
  JobFeedback,
  FilterCriteria,
  JobServiceInterface,
} from './jobServiceTypes';

// ============================================================================
// Service Tag
// ============================================================================

export class JobService extends Context.Tag('JobService')<
  JobService,
  JobServiceInterface
>() {}

// ============================================================================
// Live Implementation
// ============================================================================

const fetchJobsLive = (
  embedding: number[],
  timeRange = '1m'
): Effect.Effect<JobsResponse, FetchError> =>
  pipe(
    Effect.tryPromise({
      try: () =>
        fetch('/api/pathways/jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ embedding, timeRange }),
        }),
      catch: (error) => FetchError.fromError('/api/pathways/jobs', error),
    }),
    Effect.flatMap((response) =>
      response.ok
        ? Effect.tryPromise({
            try: () => response.json() as Promise<JobsResponse>,
            catch: (error) => FetchError.fromError('/api/pathways/jobs', error),
          })
        : Effect.fail(FetchError.fromResponse('/api/pathways/jobs', response))
    )
  );

const saveFeedbackLive = (
  userId: string,
  feedback: JobFeedback
): Effect.Effect<void, UpdateError> =>
  pipe(
    Effect.tryPromise({
      try: () =>
        fetch('/api/pathways/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            jobId: feedback.jobId,
            feedback: feedback.feedback,
            sentiment: feedback.sentiment,
            jobTitle: feedback.jobTitle,
            jobCompany: feedback.jobCompany,
          }),
        }),
      catch: (error) =>
        new UpdateError({
          message:
            error instanceof Error ? error.message : 'Failed to save feedback',
          entity: 'feedback',
        }),
    }),
    Effect.flatMap((response) =>
      response.ok
        ? Effect.void
        : Effect.fail(
            new UpdateError({
              message: `Failed to save feedback: ${response.statusText}`,
              entity: 'feedback',
            })
          )
    )
  );

const saveBatchFeedbackLive = (
  userId: string,
  feedbacks: JobFeedback[]
): Effect.Effect<{ count: number }, UpdateError> =>
  pipe(
    Effect.tryPromise({
      try: () =>
        fetch('/api/pathways/feedback/batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, feedbacks }),
        }),
      catch: (error) =>
        new UpdateError({
          message:
            error instanceof Error
              ? error.message
              : 'Failed to save batch feedback',
          entity: 'feedback',
        }),
    }),
    Effect.flatMap((response) =>
      response.ok
        ? Effect.tryPromise({
            try: () => response.json() as Promise<{ count: number }>,
            catch: () =>
              new UpdateError({
                message: 'Failed to parse batch feedback response',
                entity: 'feedback',
              }),
          })
        : Effect.fail(
            new UpdateError({
              message: `Failed to save batch feedback: ${response.statusText}`,
              entity: 'feedback',
            })
          )
    )
  );

const filterJobsLive = (
  jobs: Job[],
  jobInfo: Record<string, Job>,
  criteria: FilterCriteria
): string[] => findMatchingJobs(criteria, jobs, jobInfo);

// ============================================================================
// Layer
// ============================================================================

export const JobServiceLive = Layer.succeed(JobService, {
  fetchJobs: fetchJobsLive,
  saveFeedback: saveFeedbackLive,
  saveBatchFeedback: saveBatchFeedbackLive,
  filterJobs: filterJobsLive,
});
