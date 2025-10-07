import { Octokit } from 'octokit';
import { logger } from '@/lib/logger';
import { RESUME_GIST_NAME } from '../constants';
import { findLatestResumeGist } from './gistFinder';
import { getSession, authenticateGitHub } from './githubAuth';

export const updateGistContent = async (
  resumeContent,
  setGistId,
  setResume
) => {
  const currentSession = await getSession();

  if (!currentSession?.provider_token) {
    await authenticateGitHub();
    return;
  }

  const octokit = new Octokit({ auth: currentSession.provider_token });
  const latestGistId = await findLatestResumeGist(octokit);

  if (latestGistId) {
    logger.info(
      { gistId: latestGistId, action: 'gist_update' },
      'Updating existing gist'
    );
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
    logger.info(
      { action: 'gist_create_start' },
      'No existing resume.json gist found, creating new one'
    );
    const { data: newGist } = await octokit.rest.gists.create({
      files: {
        [RESUME_GIST_NAME]: {
          content: resumeContent,
        },
      },
      public: true,
      description: 'JSON Resume',
    });
    logger.info(
      { gistId: newGist.id, action: 'gist_created' },
      'Created new gist'
    );
    setGistId(newGist.id);
  }

  const updatedResume = JSON.parse(resumeContent);
  setResume(updatedResume);
};

export const createNewGist = async (sampleResume, setGistId, setResume) => {
  const currentSession = await getSession();

  if (!currentSession?.provider_token) {
    await authenticateGitHub();
    return;
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
};
