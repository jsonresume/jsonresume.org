import buildError, { ERROR_CODES } from '../error/buildError';

export const formatResume = async (resume, formatter, options) => {
  let formatted = {};
  const themeName = options?.theme || 'unknown';

  try {
    formatted = await formatter.format(resume, options);
  } catch (e) {
    console.error('[Theme Error]', themeName, e);

    // Theme not found error
    if (e.message === 'theme-missing') {
      return {
        error: buildError(ERROR_CODES.TEMPLATE_MISSING, { themeName }),
      };
    }

    // Theme runtime error - capture full error details
    return {
      error: buildError(ERROR_CODES.UNKNOWN_TEMPLATE_ERROR, {
        themeName,
        error: {
          message: e.message,
          stack: e.stack,
          name: e.name,
        },
      }),
    };
  }

  return { content: formatted.content, headers: formatted.headers || [] };
};
