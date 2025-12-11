'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { useJobStates } from '@/app/hooks/useJobStates';

// Sample resume for anonymous users to start with
const SAMPLE_RESUME = {
  basics: {
    name: 'Jane Doe',
    label: 'Full-Stack Developer',
    email: 'jane.doe@example.com',
    phone: '+1-555-0123',
    url: 'https://janedoe.dev',
    location: { city: 'San Francisco', region: 'CA', countryCode: 'US' },
    summary:
      'Experienced full-stack developer with 5+ years building scalable web applications.',
    profiles: [
      {
        network: 'GitHub',
        username: 'janedoe',
        url: 'https://github.com/janedoe',
      },
      {
        network: 'LinkedIn',
        username: 'janedoe',
        url: 'https://linkedin.com/in/janedoe',
      },
    ],
  },
  work: [
    {
      name: 'Tech Solutions Inc.',
      position: 'Senior Software Engineer',
      startDate: '2022-03-01',
      summary: 'Lead development of microservices architecture.',
      highlights: [
        'Architected microservices reducing response time by 40%',
        'Led migration to containerized architecture',
      ],
    },
    {
      name: 'StartupCo',
      position: 'Full-Stack Developer',
      startDate: '2020-01-01',
      endDate: '2022-02-01',
      summary: 'Built features for B2B SaaS platform.',
      highlights: [
        'Developed real-time collaboration features',
        'Improved application performance by 60%',
      ],
    },
  ],
  education: [
    {
      institution: 'University of California, Berkeley',
      area: 'Computer Science',
      studyType: 'Bachelor',
      startDate: '2016-09-01',
      endDate: '2020-05-01',
    },
  ],
  skills: [
    {
      name: 'JavaScript',
      level: 'Expert',
      keywords: ['TypeScript', 'React', 'Node.js'],
    },
    {
      name: 'Backend',
      level: 'Advanced',
      keywords: ['Python', 'PostgreSQL', 'Docker'],
    },
  ],
};

const PathwaysContext = createContext(null);

/**
 * Get or create a session ID for anonymous users
 */
function getSessionId() {
  if (typeof window === 'undefined') return null;

  let id = localStorage.getItem('pathways_session_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('pathways_session_id', id);
  }
  return id;
}

export function PathwaysProvider({
  children,
  username = null,
  isAuthenticated = false,
}) {
  // Session management
  const [sessionId, setSessionId] = useState(null);

  // Resume state
  const [resume, setResume] = useState(SAMPLE_RESUME);
  const [resumeJson, setResumeJson] = useState(() =>
    JSON.stringify(SAMPLE_RESUME, null, 2)
  );
  const [isResumeLoading, setIsResumeLoading] = useState(false);

  // Embedding state
  const [embedding, setEmbedding] = useState(null);
  const [isEmbeddingLoading, setIsEmbeddingLoading] = useState(false);

  // Graph refresh trigger
  const [graphVersion, setGraphVersion] = useState(0);

  // Initialize session ID on mount
  useEffect(() => {
    setSessionId(getSessionId());
  }, []);

  // Job states hook
  const jobStatesHook = useJobStates({
    sessionId,
    username,
    isAuthenticated,
  });

  // Update resume and sync JSON
  const updateResume = useCallback((newResume) => {
    setResume(newResume);
    setResumeJson(JSON.stringify(newResume, null, 2));
  }, []);

  // Update resume JSON and try to sync object
  const updateResumeJson = useCallback((json) => {
    setResumeJson(json);
    try {
      const parsed = JSON.parse(json);
      setResume(parsed);
    } catch {
      // Invalid JSON, don't update object
    }
  }, []);

  // Refresh embedding for current resume
  const refreshEmbedding = useCallback(async () => {
    if (!resume) return null;

    setIsEmbeddingLoading(true);
    try {
      // Generate embedding via API
      const response = await fetch('/api/pathways/embedding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate embedding');
      }

      const data = await response.json();
      setEmbedding(data.embedding);

      // Trigger graph refresh
      setGraphVersion((v) => v + 1);

      return data.embedding;
    } catch (error) {
      console.error('Failed to refresh embedding:', error);
      return null;
    } finally {
      setIsEmbeddingLoading(false);
    }
  }, [resume]);

  // Trigger graph refresh manually
  const triggerGraphRefresh = useCallback(() => {
    setGraphVersion((v) => v + 1);
  }, []);

  // Migrate anonymous session data to authenticated user
  const migrateToUser = useCallback(
    async (newUsername) => {
      if (!sessionId)
        return { success: false, message: 'No session to migrate' };

      try {
        // Get job states from localStorage
        const localStates = {};
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key?.startsWith('pathways_job_')) {
            const jobId = key.replace('pathways_job_', '');
            localStates[jobId] = localStorage.getItem(key);
          }
        }

        // Migrate to Supabase
        const response = await fetch('/api/job-states/migrate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            username: newUsername,
            states: localStates,
          }),
        });

        if (!response.ok) {
          throw new Error('Migration failed');
        }

        const result = await response.json();

        // Clean up localStorage on successful migration
        Object.keys(localStates).forEach((jobId) => {
          localStorage.removeItem(`pathways_job_${jobId}`);
        });

        // Clear session ID (user is now authenticated)
        localStorage.removeItem('pathways_session_id');

        return result;
      } catch (error) {
        console.error('Migration error:', error);
        return { success: false, message: error.message };
      }
    },
    [sessionId]
  );

  // Load user's resume on mount if authenticated
  useEffect(() => {
    if (isAuthenticated && username) {
      setIsResumeLoading(true);
      fetch(`/api/resumes?username=${username}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.resume) {
            const parsed =
              typeof data.resume === 'string'
                ? JSON.parse(data.resume)
                : data.resume;
            setResume(parsed);
            setResumeJson(JSON.stringify(parsed, null, 2));
          }
        })
        .catch((err) => console.error('Failed to load resume:', err))
        .finally(() => setIsResumeLoading(false));
    }
  }, [isAuthenticated, username]);

  // Generate initial embedding when resume is set
  useEffect(() => {
    if (resume && !embedding && !isEmbeddingLoading) {
      refreshEmbedding();
    }
  }, [resume, embedding, isEmbeddingLoading, refreshEmbedding]);

  const value = {
    // Session
    sessionId,
    isAuthenticated,
    username,

    // Resume
    resume,
    resumeJson,
    isResumeLoading,
    updateResume,
    updateResumeJson,
    setResume,
    setResumeJson,

    // Embedding
    embedding,
    isEmbeddingLoading,
    refreshEmbedding,

    // Job states (spread all methods from hook)
    ...jobStatesHook,

    // Graph
    graphVersion,
    triggerGraphRefresh,

    // Migration
    migrateToUser,
  };

  return (
    <PathwaysContext.Provider value={value}>
      {children}
    </PathwaysContext.Provider>
  );
}

export function usePathways() {
  const context = useContext(PathwaysContext);
  if (!context) {
    throw new Error('usePathways must be used within a PathwaysProvider');
  }
  return context;
}

export default PathwaysContext;
