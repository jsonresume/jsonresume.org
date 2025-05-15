'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Octokit } from 'octokit';

export const RESUME_GIST_NAME = 'resume_thomas.json';

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!targetUsername) {
          setLoading(false);
          return;
        }

        // If registry fetch fails and user is logged in, try GitHub
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();
        setSession(currentSession);

        if (!currentSession?.provider_token) {
          setLoading(false);
          return;
        }

        const githubUsername = currentSession.user?.user_metadata?.user_name;

        // Only proceed with GitHub if we're viewing the logged-in user's profile
        if (githubUsername && githubUsername === targetUsername) {
          const octokit = new Octokit({ auth: currentSession.provider_token });

          try {
            console.log('Fetching gists for user:', githubUsername);
            const { data: gists } = await octokit.rest.gists.list({
              per_page: 100,
              sort: 'updated',
              direction: 'desc',
            });

            console.log('Found gists:', gists.length);

            // Find the most recently updated resume.json gist
            const findLatestResumeGist = async (octokit) => {
              console.log('Looking for most recent resume.json gist...');
              const { data: gists } = await octokit.rest.gists.list({
                per_page: 100,
                sort: 'updated',
                direction: 'desc',
              });

              console.log(
                `Found ${gists.length} gists, searching for resume.json...`
              );
              const resumeGist = gists.find((gist) =>
                Object.keys(gist.files).some(
                  (filename) => filename.toLowerCase() === RESUME_GIST_NAME
                )
              );

              if (resumeGist) {
                console.log(
                  'Found most recent resume.json gist:',
                  resumeGist.id
                );
                return resumeGist.id;
              }

              console.log('No existing resume.json gist found');
              return null;
            };

            const latestGistId = await findLatestResumeGist(octokit);
            if (latestGistId) {
              console.log('Found most recent resume.json gist:', latestGistId);
              setGistId(latestGistId);

              // Get the raw content
              const { data: gists } = await octokit.rest.gists.get({
                gist_id: latestGistId,
              });
              const resumeFile = Object.values(gists.files).find(
                (file) => file.filename.toLowerCase() === RESUME_GIST_NAME
              );

              if (resumeFile?.raw_url) {
                const response = await fetch(resumeFile.raw_url);
                if (!response.ok) {
                  throw new Error('Failed to fetch resume data');
                }
                const resumeData = await response.json();
                setResume(resumeData);
                setUsername(githubUsername);

                // Update localStorage with the latest gist ID
                localStorage.setItem(
                  `resume_${githubUsername}`,
                  JSON.stringify({
                    resume: resumeData,
                    gistId: latestGistId,
                    username: githubUsername,
                  })
                );
              }
            } else {
              console.log('No resume.json gist found');
            }
          } catch (error) {
            console.error('Error fetching gists:', error);
            setError('Failed to fetch resume from GitHub');
          }
        }
      } catch (error) {
        console.error('Error fetching resume data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [targetUsername]);

  const updateGist = async (resumeContent) => {
    try {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();

      if (!currentSession?.provider_token) {
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
          return;
        } catch (error) {
          console.error('GitHub authentication error:', error);
          throw new Error(
            'Failed to authenticate with GitHub. Please try again.'
          );
        }
      }

      const octokit = new Octokit({ auth: currentSession.provider_token });

      // Always look for the most recently updated resume.json gist first
      const findLatestResumeGist = async (octokit) => {
        console.log('Looking for most recent resume.json gist...');
        const { data: gists } = await octokit.rest.gists.list({
          per_page: 100,
          sort: 'updated',
          direction: 'desc',
        });

        console.log(
          `Found ${gists.length} gists, searching for resume.json...`
        );
        const resumeGist = gists.find((gist) =>
          Object.keys(gist.files).some(
            (filename) => filename.toLowerCase() === RESUME_GIST_NAME
          )
        );

        if (resumeGist) {
          console.log('Found most recent resume.json gist:', resumeGist.id);
          return resumeGist.id;
        }

        console.log('No existing resume.json gist found');
        return null;
      };

      const latestGistId = await findLatestResumeGist(octokit);

      if (latestGistId) {
        console.log('Updating existing gist:', latestGistId);
        await octokit.rest.gists.update({
          gist_id: latestGistId,
          files: {
            [RESUME_GIST_NAME]: {
              content: resumeContent,
            },
          },
        });
        setGistId(latestGistId);
      } else {
        console.log('No existing resume.json gist found, creating new one');
        const { data: newGist } = await octokit.rest.gists.create({
          files: {
            [RESUME_GIST_NAME]: {
              content: resumeContent,
            },
          },
          public: true,
          description: 'JSON Resume',
        });
        console.log('Created new gist:', newGist.id);
        setGistId(newGist.id);
      }

      // Update state after successful update
      const updatedResume = JSON.parse(resumeContent);
      setResume(updatedResume);
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
