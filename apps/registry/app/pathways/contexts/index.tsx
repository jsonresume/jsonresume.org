'use client';

import { type ReactNode, useEffect, useState } from 'react';
import { useAuth } from '@/app/context/auth';
import { ResumeProvider, useResume } from './ResumeContext';
import { JobGraphProvider } from './JobGraphContext';
import { KeyboardProvider } from './KeyboardContext';
import { getSessionId } from '../context/sessionUtils';

// ============================================================================
// Re-exports
// ============================================================================

export { ResumeProvider, useResume } from './ResumeContext';
export {
  JobGraphProvider,
  useJobGraph,
  EMBEDDING_STAGES,
} from './JobGraphContext';
export { KeyboardProvider, useKeyboard } from './KeyboardContext';
export type { EmbeddingStage } from './JobGraphContext';
export type { FocusArea, KeyboardShortcut } from './KeyboardContext';
export { usePathways } from './usePathwaysFacade';

// ============================================================================
// Combined Provider
// ============================================================================

interface PathwaysProviderProps {
  children: ReactNode;
}

/**
 * Combined provider that composes all Pathways contexts.
 * Handles auth and session management, then provides context to children.
 */
export function PathwaysProvider({ children }: PathwaysProviderProps) {
  const { user } = useAuth();
  const userId = user?.id || null;
  const username = user?.user_metadata?.user_name || null;
  const isAuthenticated = !!user;

  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    setSessionId(getSessionId());
  }, []);

  return (
    <KeyboardProvider>
      <ResumeProvider sessionId={sessionId} userId={userId}>
        <JobGraphProviderWrapper
          sessionId={sessionId}
          userId={userId}
          username={username}
          isAuthenticated={isAuthenticated}
        >
          {children}
        </JobGraphProviderWrapper>
      </ResumeProvider>
    </KeyboardProvider>
  );
}

/**
 * Wrapper component that accesses resume from ResumeContext
 * and passes it to JobGraphProvider.
 */
function JobGraphProviderWrapper({
  children,
  sessionId,
  userId,
  username,
  isAuthenticated,
}: {
  children: ReactNode;
  sessionId: string | null;
  userId: string | null;
  username: string | null;
  isAuthenticated: boolean;
}) {
  const { resume } = useResume();

  return (
    <JobGraphProvider
      sessionId={sessionId}
      userId={userId}
      username={username}
      isAuthenticated={isAuthenticated}
      resume={resume}
    >
      {children}
    </JobGraphProvider>
  );
}
