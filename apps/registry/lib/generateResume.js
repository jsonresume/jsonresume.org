import buildError, { ERROR_CODES } from './error/buildError';
import getResumeGist from './getResumeGist';
import formatters from './formatters/formatters';
import { validateExtension, validateResume } from './generateResume/validation';
import { cacheResume } from './generateResume/cacheResume';
import { formatResume } from './generateResume/formatResume';

const generateResume = async (username, extension = 'template', query = {}) => {
  const { theme } = query;
  const formatter = formatters[extension];

  const { error: extensionError } = validateExtension(extension);
  if (extensionError) return extensionError;

  if (!formatter) {
    return buildError(ERROR_CODES.UNKNOWN_FORMATTER);
  }

  // retrieve the users github gist
  const { error: gistError, resume } = await getResumeGist(username);

  if (gistError) {
    return buildError(gistError);
  }

  const { error: validationError } = validateResume(resume);
  if (validationError) return validationError;

  let selectedTheme = theme || resume.meta?.theme || 'elegant';
  selectedTheme = selectedTheme.toLowerCase();

  // @todo - using as a resume cache for extra features
  (async () => {
    await cacheResume(username, resume);
  })();

  const options = { ...query, theme: selectedTheme, username };

  return formatResume(resume, formatter, options);
};

export default generateResume;
