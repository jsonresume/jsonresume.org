import { Effect, Context, Layer, pipe } from 'effect';
import { FetchError, UpdateError, EmbeddingError } from '../errors';

// ============================================================================
// Types (JSON Resume format)
// ============================================================================

export interface ResumeBasics {
  name?: string;
  label?: string;
  email?: string;
  phone?: string;
  url?: string;
  summary?: string;
  location?: {
    address?: string;
    postalCode?: string;
    city?: string;
    countryCode?: string;
    region?: string;
  };
  profiles?: Array<{
    network?: string;
    username?: string;
    url?: string;
  }>;
}

export interface ResumeWork {
  name?: string;
  position?: string;
  url?: string;
  startDate?: string;
  endDate?: string;
  summary?: string;
  highlights?: string[];
  _delete?: boolean;
}

export interface ResumeEducation {
  institution?: string;
  url?: string;
  area?: string;
  studyType?: string;
  startDate?: string;
  endDate?: string;
  score?: string;
  courses?: string[];
  _delete?: boolean;
}

export interface ResumeSkill {
  name?: string;
  level?: string;
  keywords?: string[];
  _delete?: boolean;
}

export interface Resume {
  basics?: ResumeBasics;
  work?: ResumeWork[];
  education?: ResumeEducation[];
  skills?: ResumeSkill[];
  projects?: Array<{
    name?: string;
    description?: string;
    highlights?: string[];
    keywords?: string[];
    startDate?: string;
    endDate?: string;
    url?: string;
    _delete?: boolean;
  }>;
  volunteer?: Array<{
    organization?: string;
    position?: string;
    url?: string;
    startDate?: string;
    endDate?: string;
    summary?: string;
    highlights?: string[];
    _delete?: boolean;
  }>;
  awards?: Array<{
    title?: string;
    date?: string;
    awarder?: string;
    summary?: string;
    _delete?: boolean;
  }>;
  publications?: Array<{
    name?: string;
    publisher?: string;
    releaseDate?: string;
    url?: string;
    summary?: string;
    _delete?: boolean;
  }>;
  languages?: Array<{
    language?: string;
    fluency?: string;
    _delete?: boolean;
  }>;
  interests?: Array<{
    name?: string;
    keywords?: string[];
    _delete?: boolean;
  }>;
  references?: Array<{
    name?: string;
    reference?: string;
    _delete?: boolean;
  }>;
}

export type ResumeChanges = Partial<Resume>;

export type ChangeSource = 'ai_update' | 'file_upload' | 'manual_edit';

export interface SaveResult {
  success: boolean;
  resume?: Resume;
  error?: string;
}

// ============================================================================
// Service Interface
// ============================================================================

export interface ResumeServiceInterface {
  /**
   * Fetch resume for a user/session
   */
  readonly fetchResume: (params: {
    userId?: string;
    sessionId?: string;
  }) => Effect.Effect<Resume | null, FetchError>;

  /**
   * Save changes to resume (patch/merge)
   */
  readonly saveChanges: (params: {
    userId?: string;
    sessionId?: string;
    diff: ResumeChanges;
    explanation: string;
    source: ChangeSource;
  }) => Effect.Effect<Resume, UpdateError>;

  /**
   * Replace entire resume
   */
  readonly setFullResume: (params: {
    userId?: string;
    sessionId?: string;
    resume: Resume;
    source: ChangeSource;
  }) => Effect.Effect<Resume, UpdateError>;

  /**
   * Generate embedding for a resume
   */
  readonly generateEmbedding: (
    resume: Resume
  ) => Effect.Effect<number[], EmbeddingError>;
}

// ============================================================================
// Service Tag
// ============================================================================

export class ResumeService extends Context.Tag('ResumeService')<
  ResumeService,
  ResumeServiceInterface
>() {}

// ============================================================================
// Live Implementation
// ============================================================================

const fetchResumeLive = (params: {
  userId?: string;
  sessionId?: string;
}): Effect.Effect<Resume | null, FetchError> => {
  if (!params.userId && !params.sessionId) {
    return Effect.succeed(null);
  }

  const searchParams = new URLSearchParams();
  if (params.userId) {
    searchParams.set('userId', params.userId);
  } else if (params.sessionId) {
    searchParams.set('sessionId', params.sessionId);
  }

  const url = `/api/pathways/resume?${searchParams}`;

  return pipe(
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
};

const saveChangesLive = (params: {
  userId?: string;
  sessionId?: string;
  diff: ResumeChanges;
  explanation: string;
  source: ChangeSource;
}): Effect.Effect<Resume, UpdateError> => {
  const url = '/api/pathways/resume';

  const body: Record<string, unknown> = {
    diff: params.diff,
    explanation: params.explanation,
    source: params.source,
  };

  if (params.userId) {
    body.userId = params.userId;
  } else if (params.sessionId) {
    body.sessionId = params.sessionId;
  }

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

const setFullResumeLive = (params: {
  userId?: string;
  sessionId?: string;
  resume: Resume;
  source: ChangeSource;
}): Effect.Effect<Resume, UpdateError> => {
  const url = '/api/pathways/resume';

  const body: Record<string, unknown> = {
    diff: params.resume,
    explanation: 'Full resume replacement',
    source: params.source,
    replace: true,
  };

  if (params.userId) {
    body.userId = params.userId;
  } else if (params.sessionId) {
    body.sessionId = params.sessionId;
  }

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

const generateEmbeddingLive = (
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

// ============================================================================
// Layer
// ============================================================================

export const ResumeServiceLive = Layer.succeed(ResumeService, {
  fetchResume: fetchResumeLive,
  saveChanges: saveChangesLive,
  setFullResume: setFullResumeLive,
  generateEmbedding: generateEmbeddingLive,
});
