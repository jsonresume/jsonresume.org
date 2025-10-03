import { useEffect, useState } from 'react';
import { Octokit } from 'octokit';
import { RESUME_GIST_NAME } from '../constants';
import { findLatestResumeGist } from '../utils/gistFinder';
import { getSession } from '../utils/githubAuth';

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
