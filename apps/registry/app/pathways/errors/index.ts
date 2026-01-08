import { Data } from 'effect';

/**
 * Error when fetching data from an API fails
 */
export class FetchError extends Data.TaggedError('FetchError')<{
  readonly message: string;
  readonly url: string;
  readonly status?: number;
}> {
  static fromResponse(url: string, response: Response): FetchError {
    return new FetchError({
      message: `Failed to fetch: ${response.statusText}`,
      url,
      status: response.status,
    });
  }

  static fromError(url: string, error: unknown): FetchError {
    return new FetchError({
      message: error instanceof Error ? error.message : 'Unknown fetch error',
      url,
    });
  }
}

/**
 * Error when updating data fails
 */
export class UpdateError extends Data.TaggedError('UpdateError')<{
  readonly message: string;
  readonly entity: string;
  readonly details?: unknown;
}> {}

/**
 * Error when generating embeddings fails
 */
export class EmbeddingError extends Data.TaggedError('EmbeddingError')<{
  readonly message: string;
  readonly resumeId?: string;
}> {}

/**
 * Error in chat/AI operations
 */
export class ChatError extends Data.TaggedError('ChatError')<{
  readonly message: string;
  readonly recoverable: boolean;
}> {}

/**
 * Error when a resume is not found
 */
export class ResumeNotFoundError extends Data.TaggedError(
  'ResumeNotFoundError'
)<{
  readonly username: string;
}> {}

/**
 * Error when job data is invalid
 */
export class JobDataError extends Data.TaggedError('JobDataError')<{
  readonly message: string;
  readonly jobId?: string;
}> {}

/**
 * Union type of all Pathways errors for exhaustive handling
 */
export type PathwaysError =
  | FetchError
  | UpdateError
  | EmbeddingError
  | ChatError
  | ResumeNotFoundError
  | JobDataError;

/**
 * Type guard to check if an error is a PathwaysError
 */
export const isPathwaysError = (error: unknown): error is PathwaysError => {
  return (
    error instanceof FetchError ||
    error instanceof UpdateError ||
    error instanceof EmbeddingError ||
    error instanceof ChatError ||
    error instanceof ResumeNotFoundError ||
    error instanceof JobDataError
  );
};

/**
 * Get a user-friendly message from any error
 */
export const getErrorMessage = (error: unknown): string => {
  if (isPathwaysError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};
