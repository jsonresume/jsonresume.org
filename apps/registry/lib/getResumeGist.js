import axios from 'axios';
import { find } from 'lodash';
import buildError, { ERROR_CODES } from './error/buildError';
import { RESUME_GIST_NAME } from '../app/providers/ResumeProvider';
import logger from './logger';

const fetchGists = async (username) => {
  const token = process.env.GITHUB_TOKEN;
  const url = `https://api.github.com/users/${username}/gists?per_page=100`;

  try {
    // If we have no token and are in development, we can still make some requests.
    return await axios.get(url, {
      headers: token ? { Authorization: 'Bearer ' + token } : {},
    });
  } catch (e) {
    if (e.response?.status !== 401 || !token) throw e;
    // A revoked or expired token 401s for every user. Fall back to anonymous
    // requests so the registry stays up while the token is rotated.
    logger.error(
      { username },
      'GITHUB_TOKEN rejected by GitHub (401), retrying unauthenticated; rotate the token'
    );
    return axios.get(url);
  }
};

const getResumeGist = async (username, gistname = RESUME_GIST_NAME) => {
  let gistData = null;
  try {
    gistData = await fetchGists(username);
  } catch (e) {
    const status = e.response?.status;
    logger.error(
      { error: e.message, status, username },
      'Failed to fetch gists'
    );
    // Only a 404 means the user doesn't exist; rate limits, auth failures and
    // outages are on GitHub's side (or ours), not the user's.
    return buildError(
      status === 404
        ? ERROR_CODES.INVALID_USERNAME
        : ERROR_CODES.GITHUB_UNAVAILABLE
    );
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
