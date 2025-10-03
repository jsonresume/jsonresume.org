import { Octokit } from 'octokit';
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
