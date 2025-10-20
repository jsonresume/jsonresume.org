import axios from 'axios';
import { find } from 'lodash';
import buildError, { ERROR_CODES } from './error/buildError';
import { RESUME_GIST_NAME } from '../app/providers/ResumeProvider';
import logger from './logger';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const getResumeGist = async (username, gistname = RESUME_GIST_NAME) => {
  let gistData = null;
  try {
    gistData = await axios.get(
      `https://api.github.com/users/${username}/gists?per_page=100`,
      {
        headers: {
          ...(GITHUB_TOKEN ? { Authorization: 'Bearer ' + GITHUB_TOKEN } : {}), // If we have no token and are in development, we can still make some requests.
        },
      }
    );
  } catch (e) {
    logger.error({ error: e.message, username }, 'Failed to fetch gists');
    return buildError(ERROR_CODES.INVALID_USERNAME);
  }

  if (!gistData.data) {
    return buildError(ERROR_CODES.GIST_UNKNOWN_ERROR);
  }

  const resumeUrl = find(gistData.data, (f) => {
    return f.files[gistname];
  });

  if (!resumeUrl) {
    return buildError(ERROR_CODES.NON_EXISTENT_GIST);
  }

  const gistId = resumeUrl.id;

  let resumeRes = {};

  try {
    const fullResumeGistUrl = `https://gist.githubusercontent.com/${username}/${gistId}/raw?cachebust=${new Date().getTime()}`;

    resumeRes = await axios({
      method: 'GET',
      headers: { 'content-type': 'application/json' },
      url: fullResumeGistUrl,
    });
  } catch (e) {
    // Check if the error is a JSON parsing error
    if (e.message?.includes('JSON') || e.name === 'SyntaxError') {
      return buildError(ERROR_CODES.RESUME_NOT_VALID_JSON);
    }
    return buildError(ERROR_CODES.GIST_UNKNOWN_ERROR);
  }

  // Validate that we actually received valid JSON data
  if (typeof resumeRes.data !== 'object' || resumeRes.data === null) {
    return buildError(ERROR_CODES.RESUME_NOT_VALID_JSON);
  }

  return { resume: resumeRes.data };
};

export default getResumeGist;
