'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Octokit } from 'octokit';
import { find } from 'lodash';

const RESUME_GIST_NAME = 'resume.json';

const ResumeContext = createContext({
  resume: null,
  gistId: null,
  loading: true,
  error: null,
  username: null,
  updateGist: async () => {},
  createGist: async () => {},
});

export function useResume() {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
}

export function ResumeProvider({ children }) {
  const [session, setSession] = useState(null);
  const [resume, setResume] = useState(null);
  const [gistId, setGistId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();
        setSession(currentSession);

        if (!currentSession) {
          setLoading(false);
          return;
        }

        if (!currentSession.provider_token) {
          throw new Error('No GitHub access token available');
        }

        const username = currentSession.user?.user_metadata?.user_name;
        if (!username) {
          throw new Error('No GitHub username found in user metadata');
        }
        setUsername(username);

        const octokit = new Octokit({ auth: currentSession.provider_token });
        const gists = await octokit.rest.gists.list({ per_page: 100 });

        const resumeUrl = find(gists.data, (f) => {
          return f.files[RESUME_GIST_NAME];
        });

        if (resumeUrl) {
          setGistId(resumeUrl.id);
          const fullResumeGistUrl = `https://gist.githubusercontent.com/${username}/${resumeUrl.id}/raw?cachebust=${new Date().getTime()}`;

          const response = await fetch(fullResumeGistUrl);
          if (!response.ok) {
            throw new Error('Failed to fetch resume data');
          }
          const resumeData = await response.json();
          setResume(resumeData);
        }
      } catch (error) {
        console.error('Error fetching resume data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      if (event === 'SIGNED_OUT') {
        setResume(null);
        setGistId(null);
        setUsername(null);
        setError(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const updateGist = async (resumeContent) => {
    try {
      if (!session?.provider_token) {
        throw new Error('No GitHub access token available');
      }

      const octokit = new Octokit({ auth: session.provider_token });

      if (gistId) {
        await octokit.rest.gists.update({
          gist_id: gistId,
          files: {
            [RESUME_GIST_NAME]: {
              content: resumeContent,
            },
          },
        });
      } else {
        const { data } = await octokit.rest.gists.create({
          public: true,
          files: {
            [RESUME_GIST_NAME]: {
              content: resumeContent,
            },
          },
        });
        setGistId(data.id);
      }
    } catch (error) {
      console.error('Error updating gist:', error);
      throw error;
    }
  };

  const createGist = async (sampleResume) => {
    try {
      if (!session?.provider_token) {
        throw new Error('No GitHub access token available');
      }

      const octokit = new Octokit({ auth: session.provider_token });
      const { data } = await octokit.rest.gists.create({
        files: {
          [RESUME_GIST_NAME]: {
            content: JSON.stringify(sampleResume, undefined, 2),
          },
        },
        public: true,
      });

      setGistId(data.id);
      return data;
    } catch (error) {
      console.error('Error creating gist:', error);
      throw error;
    }
  };

  const value = {
    resume,
    gistId,
    loading,
    error,
    username,
    updateGist,
    createGist,
  };

  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>;
}
