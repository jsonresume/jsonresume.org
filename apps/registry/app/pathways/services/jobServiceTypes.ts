import { Effect } from 'effect';
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
  readonly fetchJobs: (
    embedding: number[],
    timeRange?: string
  ) => Effect.Effect<JobsResponse, FetchError>;

  readonly saveFeedback: (
    userId: string,
    feedback: JobFeedback
  ) => Effect.Effect<void, UpdateError>;

  readonly saveBatchFeedback: (
    userId: string,
    feedbacks: JobFeedback[]
  ) => Effect.Effect<{ count: number }, UpdateError>;

  readonly filterJobs: (
    jobs: Job[],
    jobInfo: Record<string, Job>,
    criteria: FilterCriteria
  ) => string[];
}
