import { Effect, pipe } from 'effect';
import { FetchError, UpdateError, EmbeddingError } from '../errors';
import type { Resume } from './resumeTypes';

/**
 * Shared helper for resume save/update API calls.
 * Both saveChanges and setFullResume follow the same pattern.
 */
export const postResumeUpdate = (
  body: Record<string, unknown>
): Effect.Effect<Resume, UpdateError> => {
  const url = '/api/pathways/resume';

  return pipe(
    Effect.tryPromise({
      try: () =>
        fetch(url, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }),
      catch: (error) =>
        new UpdateError({
          message:
            error instanceof Error ? error.message : 'Failed to save resume',
          entity: 'resume',
        }),
    }),
    Effect.flatMap((response) =>
      response.ok
        ? Effect.tryPromise({
            try: () => response.json(),
            catch: () =>
              new UpdateError({
                message: 'Failed to parse resume response',
                entity: 'resume',
              }),
          })
        : Effect.fail(
            new UpdateError({
              message: `Failed to save resume: ${response.statusText}`,
              entity: 'resume',
            })
          )
    ),
    Effect.flatMap((data: { resume?: { resume?: Resume }; error?: string }) => {
      if (data.error) {
        return Effect.fail(
          new UpdateError({
            message: data.error,
            entity: 'resume',
          })
        );
      }
      return Effect.succeed(data.resume?.resume ?? {});
    })
  );
};

/**
 * Fetch resume from API with standard error handling.
 */
export const fetchResumeFromApi = (
  url: string
): Effect.Effect<Resume | null, FetchError> =>
  pipe(
    Effect.tryPromise({
      try: () => fetch(url),
      catch: (error) => FetchError.fromError(url, error),
    }),
    Effect.flatMap((response) =>
      response.ok
        ? Effect.tryPromise({
            try: () => response.json(),
            catch: (error) => FetchError.fromError(url, error),
          })
        : Effect.fail(FetchError.fromResponse(url, response))
    ),
    Effect.map((data: { resume?: { resume?: Resume }; error?: string }) => {
      if (data.error) {
        return null;
      }
      return data.resume?.resume ?? null;
    })
  );

/**
 * Generate embedding via API.
 */
export const generateEmbeddingFromApi = (
  resume: Resume
): Effect.Effect<number[], EmbeddingError> => {
  const url = '/api/pathways/embedding';

  return pipe(
    Effect.tryPromise({
      try: () =>
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resume }),
        }),
      catch: (error) =>
        new EmbeddingError({
          message:
            error instanceof Error
              ? error.message
              : 'Failed to generate embedding',
        }),
    }),
    Effect.flatMap((response) =>
      response.ok
        ? Effect.tryPromise({
            try: () => response.json() as Promise<{ embedding: number[] }>,
            catch: () =>
              new EmbeddingError({
                message: 'Failed to parse embedding response',
              }),
          })
        : Effect.fail(
            new EmbeddingError({
              message: `Failed to generate embedding: ${response.statusText}`,
            })
          )
    ),
    Effect.map((data) => data.embedding)
  );
};
