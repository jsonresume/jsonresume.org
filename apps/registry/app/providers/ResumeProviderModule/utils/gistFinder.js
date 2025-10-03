import { RESUME_GIST_NAME } from '../constants';

export const findLatestResumeGist = async (octokit) => {
  console.log('Looking for most recent resume.json gist...');
  const { data: gists } = await octokit.rest.gists.list({
    per_page: 100,
    sort: 'updated',
    direction: 'desc',
  });

  console.log(`Found ${gists.length} gists, searching for resume.json...`);
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
