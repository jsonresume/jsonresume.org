import { Effect, Context, Layer, pipe } from 'effect';
import { FetchError, UpdateError } from '../errors';

// ============================================================================
// Types
// ============================================================================

export interface Job {
  uuid: string;
  title: string;
  company: string;
  description?: string;
  skills?: Array<{ name: string }>;
  location?: { city?: string; region?: string };
  remote?: string;
  type?: string;
  salaryUsd?: number;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  similarity?: number;
}

export interface GraphNode {
  id: string;
  label?: string;
  group: number;
  size: number;
  color: string;
  x?: number;
  y?: number;
  data?: { isResume?: boolean };
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  value: number;
}

export interface JobsResponse {
  graphData: {
    nodes: GraphNode[];
    links: GraphEdge[];
  };
  jobInfoMap: Record<string, Job>;
  allJobs: Job[];
  nearestNeighbors: Record<string, Array<{ id: string; similarity: number }>>;
}

export type JobAction =
  | 'mark_read'
  | 'mark_interested'
  | 'mark_hidden'
  | 'unmark';

export interface JobFeedback {
  jobId: string;
  feedback: string;
  sentiment:
    | 'interested'
    | 'not_interested'
    | 'maybe'
    | 'applied'
    | 'dismissed';
  jobTitle?: string;
  jobCompany?: string;
}

export interface FilterCriteria {
  companies?: string[];
  keywords?: string[];
  industries?: string[];
  salaryMin?: number;
  salaryMax?: number;
  remoteOnly?: boolean;
  jobTypes?: string[];
}

// ============================================================================
// Service Interface
// ============================================================================

export interface JobServiceInterface {
  /**
   * Fetch jobs matching a resume embedding
   */
  readonly fetchJobs: (
    embedding: number[],
    timeRange?: string
  ) => Effect.Effect<JobsResponse, FetchError>;

  /**
   * Save feedback for a single job
   */
  readonly saveFeedback: (
    userId: string,
    feedback: JobFeedback
  ) => Effect.Effect<void, UpdateError>;

  /**
   * Save feedback for multiple jobs (batch)
   */
  readonly saveBatchFeedback: (
    userId: string,
    feedbacks: JobFeedback[]
  ) => Effect.Effect<{ count: number }, UpdateError>;

  /**
   * Find jobs matching filter criteria
   */
  readonly filterJobs: (
    jobs: Job[],
    jobInfo: Record<string, Job>,
    criteria: FilterCriteria
  ) => string[];
}

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
): string[] => {
  const matchingIds: string[] = [];

  for (const job of jobs) {
    const info = jobInfo[job.uuid] || {};
    let matches = true;

    // Company filter
    if (criteria.companies?.length) {
      const company = (info.company || '').toLowerCase();
      const companyMatch = criteria.companies.some((c) =>
        company.includes(c.toLowerCase())
      );
      if (!companyMatch) matches = false;
    }

    // Keywords filter
    if (matches && criteria.keywords?.length) {
      const searchText = [
        info.title,
        info.description,
        info.skills?.map((s) => s.name).join(' '),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      const keywordMatch = criteria.keywords.some((k) =>
        searchText.includes(k.toLowerCase())
      );
      if (!keywordMatch) matches = false;
    }

    // Industry filter
    if (matches && criteria.industries?.length) {
      const searchText = [info.title, info.description, info.company]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      const industryMatch = criteria.industries.some((ind) =>
        searchText.includes(ind.toLowerCase())
      );
      if (!industryMatch) matches = false;
    }

    // Salary filter (using normalized salary data)
    if (matches && (criteria.salaryMin || criteria.salaryMax)) {
      const salary = info.salaryUsd || info.salaryMax || info.salaryMin;
      if (salary) {
        if (criteria.salaryMin && salary < criteria.salaryMin * 1000)
          matches = false;
        if (criteria.salaryMax && salary > criteria.salaryMax * 1000)
          matches = false;
      } else {
        // No salary data - don't match salary-based filters
        matches = false;
      }
    }

    // Remote filter
    if (matches && criteria.remoteOnly) {
      const remote = (info.remote || '').toLowerCase();
      const location = (info.location?.city || '').toLowerCase();
      const isRemote =
        remote.includes('remote') ||
        remote.includes('full') ||
        location.includes('remote');
      if (!isRemote) matches = false;
    }

    // Job type filter
    if (matches && criteria.jobTypes?.length) {
      const jobType = (info.type || '').toLowerCase();
      const typeMatch = criteria.jobTypes.some((t) =>
        jobType.includes(t.toLowerCase())
      );
      if (!typeMatch) matches = false;
    }

    if (matches) {
      matchingIds.push(job.uuid);
    }
  }

  return matchingIds;
};

// ============================================================================
// Layer
// ============================================================================

export const JobServiceLive = Layer.succeed(JobService, {
  fetchJobs: fetchJobsLive,
  saveFeedback: saveFeedbackLive,
  saveBatchFeedback: saveBatchFeedbackLive,
  filterJobs: filterJobsLive,
});
