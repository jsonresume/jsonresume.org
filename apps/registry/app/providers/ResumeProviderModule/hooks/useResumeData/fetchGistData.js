import { RESUME_GIST_NAME } from '../../constants';

export const fetchGistData = async (octokit, gistId) => {
  const { data: gists } = await octokit.rest.gists.get({ gist_id: gistId });

  const resumeFile = Object.values(gists.files).find(
    (file) => file.filename.toLowerCase() === RESUME_GIST_NAME
  );

  if (!resumeFile?.raw_url) {
    return null;
  }

  const response = await fetch(resumeFile.raw_url);
  if (!response.ok) {
    throw new Error('Failed to fetch resume data');
  }

  return await response.json();
};
