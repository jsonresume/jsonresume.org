import { Effect } from 'effect';
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
  readonly fetchResume: (params: {
    userId?: string;
    sessionId?: string;
  }) => Effect.Effect<Resume | null, FetchError>;

  readonly saveChanges: (params: {
    userId?: string;
    sessionId?: string;
    diff: ResumeChanges;
    explanation: string;
    source: ChangeSource;
  }) => Effect.Effect<Resume, UpdateError>;

  readonly setFullResume: (params: {
    userId?: string;
    sessionId?: string;
    resume: Resume;
    source: ChangeSource;
  }) => Effect.Effect<Resume, UpdateError>;

  readonly generateEmbedding: (
    resume: Resume
  ) => Effect.Effect<number[], EmbeddingError>;
}
