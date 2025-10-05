import { logger } from '@/lib/logger';
import { RESUME_GIST_NAME } from '../constants';

export const findLatestResumeGist = async (octokit) => {
  logger.info(
    { action: 'gist_search_start' },
    'Looking for most recent resume.json gist'
  );
  const { data: gists } = await octokit.rest.gists.list({
    per_page: 100,
    sort: 'updated',
    direction: 'desc',
  });

  logger.debug(
    { gistCount: gists.length, action: 'gist_search' },
    'Searching gists for resume.json'
  );
  const resumeGist = gists.find((gist) =>
    Object.keys(gist.files).some(
      (filename) => filename.toLowerCase() === RESUME_GIST_NAME
    )
  );

  if (resumeGist) {
    logger.info(
      { gistId: resumeGist.id, action: 'gist_found' },
      'Found most recent resume.json gist'
    );
    return resumeGist.id;
  }

  logger.info(
    { action: 'gist_not_found' },
    'No existing resume.json gist found'
  );
  return null;
};
