import { useEffect, useState } from 'react';
import { Octokit } from 'octokit';
import { logger } from '@/lib/logger';
import { retryWithBackoff } from '@/lib/retry';
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
            // Retry finding gist with exponential backoff
            const latestGistId = await retryWithBackoff(
              () => findLatestResumeGist(octokit),
              { maxAttempts: 3 }
            );

            if (latestGistId) {
              logger.info(
                { gistId: latestGistId, username: githubUsername },
                'Found most recent resume.json gist'
              );
              setGistId(latestGistId);

              // Retry fetching gist data with exponential backoff
              const resumeData = await retryWithBackoff(
                () => fetchGistData(octokit, latestGistId),
                { maxAttempts: 3 }
              );

              if (resumeData) {
                setResume(resumeData);
                setUsername(githubUsername);
                cacheResume(githubUsername, resumeData, latestGistId);
              }
            } else {
              logger.info(
                { username: githubUsername },
                'No resume.json gist found'
              );
            }
          } catch (error) {
            logger.error(
              { error: error.message, username: githubUsername },
              'Error fetching gists'
            );
            setError('Failed to fetch resume from GitHub');
          }
        }
      } catch (error) {
        logger.error(
          { error: error.message, targetUsername },
          'Error fetching resume data'
        );
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
