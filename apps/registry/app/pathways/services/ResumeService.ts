import { Effect, Context, Layer } from 'effect';
import { FetchError } from '../errors';
import type {
  Resume,
  ResumeChanges,
  ChangeSource,
  ResumeServiceInterface,
} from './resumeTypes';
import {
  postResumeUpdate,
  fetchResumeFromApi,
  generateEmbeddingFromApi,
} from './resumeApiHelpers';

// Re-export types for consumers
export type {
  Resume,
  ResumeBasics,
  ResumeWork,
  ResumeEducation,
  ResumeSkill,
  ResumeChanges,
  ChangeSource,
  SaveResult,
  ResumeServiceInterface,
} from './resumeTypes';

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

  return fetchResumeFromApi(`/api/pathways/resume?${searchParams}`);
};

const saveChangesLive = (params: {
  userId?: string;
  sessionId?: string;
  diff: ResumeChanges;
  explanation: string;
  source: ChangeSource;
}) => {
  const body: Record<string, unknown> = {
    diff: params.diff,
    explanation: params.explanation,
    source: params.source,
  };
  if (params.userId) body.userId = params.userId;
  else if (params.sessionId) body.sessionId = params.sessionId;

  return postResumeUpdate(body);
};

const setFullResumeLive = (params: {
  userId?: string;
  sessionId?: string;
  resume: Resume;
  source: ChangeSource;
}) => {
  const body: Record<string, unknown> = {
    diff: params.resume,
    explanation: 'Full resume replacement',
    source: params.source,
    replace: true,
  };
  if (params.userId) body.userId = params.userId;
  else if (params.sessionId) body.sessionId = params.sessionId;

  return postResumeUpdate(body);
};

// ============================================================================
// Layer
// ============================================================================

export const ResumeServiceLive = Layer.succeed(ResumeService, {
  fetchResume: fetchResumeLive,
  saveChanges: saveChangesLive,
  setFullResume: setFullResumeLive,
  generateEmbedding: generateEmbeddingFromApi,
});
