import buildError, { ERROR_CODES } from '../error/buildError';
import logger from '../logger';

export const formatResume = async (resume, formatter, options) => {
  let formatted = {};
  const themeName = options?.theme || 'unknown';

  try {
    formatted = await formatter.format(resume, options);
  } catch (e) {
    logger.error(
      { themeName, error: e.message, stack: e.stack },
      'Theme rendering error'
    );

    if (e.code === 'PDF_RENDER_FAILED') {
      return buildError(ERROR_CODES.PDF_RENDER_FAILED);
    }

    // Theme not found error
    if (e.message === 'theme-missing') {
      return buildError(ERROR_CODES.TEMPLATE_MISSING, { themeName });
    }

    // Theme runtime error - capture full error details
    return buildError(ERROR_CODES.UNKNOWN_TEMPLATE_ERROR, {
      themeName,
      error: {
        message: e.message,
        stack: e.stack,
        name: e.name,
      },
    });
  }

  return { content: formatted.content, headers: formatted.headers || [] };
};
