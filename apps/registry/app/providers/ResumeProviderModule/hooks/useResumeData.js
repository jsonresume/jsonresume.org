import { useEffect, useState } from 'react';
import { Octokit } from 'octokit';
import { findLatestResumeGist } from '../utils/gistFinder';
import { getSession } from '../utils/githubAuth';
import { fetchGistData } from './useResumeData/fetchGistData';
import { cacheResume } from './useResumeData/cacheResume';

export const useResumeData = (targetUsername) => {
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

        const currentSession = await getSession();

        if (!currentSession?.provider_token) {
          setLoading(false);
          return;
        }

        const githubUsername = currentSession.user?.user_metadata?.user_name;

        if (githubUsername && githubUsername === targetUsername) {
          const octokit = new Octokit({ auth: currentSession.provider_token });

          try {
            const latestGistId = await findLatestResumeGist(octokit);
            if (latestGistId) {
              console.log('Found most recent resume.json gist:', latestGistId);
              setGistId(latestGistId);

              const resumeData = await fetchGistData(octokit, latestGistId);

              if (resumeData) {
                setResume(resumeData);
                setUsername(githubUsername);
                cacheResume(githubUsername, resumeData, latestGistId);
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

  return {
    resume,
    setResume,
    gistId,
    setGistId,
    loading,
    error,
    username,
  };
};
