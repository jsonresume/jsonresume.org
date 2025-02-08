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

export function ResumeProvider({ children, targetUsername }) {
  const [, setSession] = useState(null);
  const [resume, setResume] = useState(null);
  const [gistId, setGistId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState(null);

  // Load from localStorage on mount
  useEffect(() => {
    if (!targetUsername) {
      return;
    }

    const storedData = localStorage.getItem(`resume_${targetUsername}`);
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setResume(parsedData.resume);
      setGistId(parsedData.gistId);
      setUsername(targetUsername);
    }
  }, [targetUsername]);

  // Save to localStorage whenever resume changes
  useEffect(() => {
    if (resume && username) {
      localStorage.setItem(
        `resume_${username}`,
        JSON.stringify({ resume, gistId, username })
      );
    }
  }, [resume, gistId, username]);

  useEffect(() => {
    async (username) => {
      try {
        const response = await fetch(
          `https://registry.jsonresume.org/${username}.json`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch resume from registry');
        }
        const resumeData = await response.json();
        setResume(resumeData);
        setUsername(username);
      } catch (error) {
        console.error('Error fetching from registry:', error);
        setError(error.message);
      }
    };

    const fetchData = async () => {
      try {
        if (!targetUsername) {
          setLoading(false);
          return;
        }

        // Always try to fetch from registry first for the target username
        try {
          const response = await fetch(
            `https://registry.jsonresume.org/${targetUsername}.json`
          );
          if (response.ok) {
            const resumeData = await response.json();
            setResume(resumeData);
            setUsername(targetUsername);
            setLoading(false);
            return;
          }
        } catch (error) {
          console.error('Error fetching from registry:', error);
        }

        // If registry fetch fails and user is logged in, try GitHub only if it's their own profile
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();
        setSession(currentSession);

        if (!currentSession || !currentSession.provider_token) {
          setLoading(false);
          return;
        }

        const githubUsername = currentSession.user?.user_metadata?.user_name;

        // Only proceed with GitHub if we're viewing the logged-in user's profile
        if (githubUsername && githubUsername === targetUsername) {
          const octokit = new Octokit({ auth: currentSession.provider_token });
          const gists = await octokit.rest.gists.list({ per_page: 100 });

          const resumeUrl = find(gists.data, (f) => {
            return f.files[RESUME_GIST_NAME];
          });

          if (resumeUrl) {
            setGistId(resumeUrl.id);
            const fullResumeGistUrl = `https://gist.githubusercontent.com/${githubUsername}/${
              resumeUrl.id
            }/raw?cachebust=${new Date().getTime()}`;

            const response = await fetch(fullResumeGistUrl);
            if (!response.ok) {
              throw new Error('Failed to fetch resume data');
            }
            const resumeData = await response.json();
            setResume(resumeData);
            setUsername(githubUsername);
          }
        }
      } catch (error) {
        console.error('Error fetching resume data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    // Fetch when targetUsername changes or we don't have data
    if (!resume || username !== targetUsername) {
      fetchData();
    }

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
        localStorage.removeItem(`resume_${username}`);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [resume, error, username, targetUsername]);

  const updateGist = async (resumeContent) => {
    try {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();

      if (!currentSession?.provider_token) {
        // Try to get a fresh token
        try {
          const { error } = await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
              scopes: 'gist',
              redirectTo: window.location.origin,
              queryParams: {
                access_type: 'offline',
                prompt: 'consent',
              },
            },
          });

          if (error) throw error;

          // Wait for redirect
          return;
        } catch (error) {
          console.error('GitHub authentication error:', error);
          throw new Error(
            'Failed to authenticate with GitHub. Please try again.'
          );
        }
      }

      const octokit = new Octokit({ auth: currentSession.provider_token });

      if (gistId) {
        await octokit.rest.gists.update({
          gist_id: gistId,
          files: {
            [RESUME_GIST_NAME]: {
              content: resumeContent,
            },
          },
        });
        // Update local storage and state after successful update
        const updatedResume = JSON.parse(resumeContent);
        setResume(updatedResume);
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
        // Update local storage and state after successful create
        const updatedResume = JSON.parse(resumeContent);
        setResume(updatedResume);
      }
    } catch (error) {
      console.error('Error updating gist:', error);
      throw error;
    }
  };

  const createGist = async (sampleResume) => {
    try {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();

      if (!currentSession?.provider_token) {
        // Try to get a fresh token
        try {
          const { error } = await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
              scopes: 'gist',
              redirectTo: window.location.origin,
              queryParams: {
                access_type: 'offline',
                prompt: 'consent',
              },
            },
          });

          if (error) throw error;

          // Wait for redirect
          return;
        } catch (error) {
          console.error('GitHub authentication error:', error);
          throw new Error(
            'Failed to authenticate with GitHub. Please try again.'
          );
        }
      }

      const octokit = new Octokit({ auth: currentSession.provider_token });
      const { data } = await octokit.rest.gists.create({
        files: {
          [RESUME_GIST_NAME]: {
            content: JSON.stringify(sampleResume, undefined, 2),
          },
        },
        public: true,
      });

      setGistId(data.id);
      setResume(sampleResume);
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

  return (
    <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>
  );
}
