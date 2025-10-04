import buildError, { ERROR_CODES } from '../error/buildError';

export const formatResume = async (resume, formatter, options) => {
  let formatted = {};

  try {
    formatted = await formatter.format(resume, options);
  } catch (e) {
    console.error(e);
    // @todo - do this better
    if (e.message === 'theme-missing') {
      return { error: buildError(ERROR_CODES.TEMPLATE_MISSING) };
    }

    return {
      error: buildError(ERROR_CODES.UNKNOWN_TEMPLATE_ERROR, { stack: e.stack }),
    };
  }

  return { content: formatted.content, headers: formatted.headers || [] };
};
