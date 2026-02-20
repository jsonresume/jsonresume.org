export const ERROR_CODES = Object.freeze({
  INVALID_USERNAME: 'INVALID_USERNAME',
  NON_EXISTENT_GIST: 'NON_EXISTENT_GIST',
  GIST_UNKNOWN_ERROR: 'GIST_UNKNOWN_ERROR',
  RESUME_SCHEMA_ERROR: 'RESUME_SCHEMA_ERROR',
  TEMPLATE_MISSING: 'TEMPLATE_MISSING',
  UNKNOWN_TEMPLATE_ERROR: 'UNKNOWN_TEMPLATE_ERROR',
  INVALID_EXTENSION: 'INVALID_EXTENSION',
  UNKNOWN_FORMATTER: 'UNKNOWN_FORMATTER',
  RESUME_NOT_VALID_JSON: 'RESUME_NOT_VALID_JSON',
});

export const ERROR_CODE_MESSAGES = Object.freeze({
  INVALID_USERNAME: 'This is not a valid Github username',
  NON_EXISTENT_GIST:
    'You have no gists named resume.json or your gist is private',
  GIST_UNKNOWN_ERROR: 'Cannot fetch gist, no idea why',
  RESUME_SCHEMA_ERROR:
    'Your resume does not conform to the schema, visit https://jsonresume.org/schema/ to double check why. But the error message below should contain all the information you need.',
  TEMPLATE_MISSING:
    'This theme is currently unsupported. Please visit this Github issue to request it https://github.com/jsonresume/jsonresume.org/issues/36 (unfortunately we have recently (11/2023) disabled a bunch of legacy themes due to critical flaws in them, please request if you would like them back.)',
  UNKNOWN_TEMPLATE_ERROR:
    'Cannot format resume, the theme you are using has encountered an error. You will have to get in contact with the theme developer yourself or you may be missing fields that the template requires.',
  INVALID_EXTENSION:
    'We only support the following extensions: json, html, yaml, tex, txt, qr, rendercv, agent, template',
  UNKNOWN_FORMATTER:
    'This is a valid extension but we do not have a formatter for it. Please visit github issues.',
  RESUME_NOT_VALID_JSON:
    'Your resume is not valid JSON. Find an online JSON validator to help you debug this.',
});

const buildError = (error, extra) => {
  return {
    error: {
      code: error,
      message: ERROR_CODE_MESSAGES[error],
      extra,
    },
  };
};

export default buildError;
