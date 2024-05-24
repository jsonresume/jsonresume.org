import axios from 'axios';
import { find } from 'lodash';
import buildError, { ERROR_CODES } from './error/buildError';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const getResumeGist = async (username) => {
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
    console.log(e);
    return buildError(ERROR_CODES.INVALID_USERNAME);
  }

  if (!gistData.data) {
    return buildError(ERROR_CODES.GIST_UNKNOWN_ERROR);
  }

  const resumeUrl = find(gistData.data, (f) => {
    return f.files['resume.json'];
  });

  if (!resumeUrl) {
    return buildError(ERROR_CODES.NON_EXISTENT_GIST);
  }

  const gistId = resumeUrl.id;

  let resumeRes = {};

  try {
    const fullResumeGistUrl =
      `https://gist.githubusercontent.com/${username}/${gistId}/raw?cachebust=${new Date().getTime()}`;

    resumeRes = await axios({
      method: 'GET',
      headers: { 'content-type': 'application/json' },
      url: fullResumeGistUrl,
    });
  } catch (e) {
    return buildError(ERROR_CODES.GIST_UNKNOWN_ERROR);
  }

  return { resume: resumeRes.data };
};

export default getResumeGist;
