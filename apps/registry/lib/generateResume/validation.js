import schema from '../schema';
import buildError, { ERROR_CODES } from '../error/buildError';
import logger from '../logger';

const Validator = require('jsonschema').Validator;

export const EXTENSIONS = new Set([
  'qr',
  'json',
  'tex',
  'txt',
  'template',
  'html',
  'yaml',
  'rendercv',
  'agent',
]);

export const validateExtension = (extension) => {
  if (!EXTENSIONS.has(extension)) {
    return { error: buildError(ERROR_CODES.INVALID_EXTENSION) };
  }

  return { error: null };
};

export const validateResume = (resume) => {
  // Allow bypassing validation via meta.skipValidation flag
  if (resume?.meta?.skipValidation === true) {
    logger.info(
      { skipValidation: true },
      'Schema validation bypassed via meta.skipValidation flag'
    );
    return { error: null };
  }

  const v = new Validator();
  const validation = v.validate(resume, schema);

  if (!validation.valid) {
    return {
      error: buildError(ERROR_CODES.RESUME_SCHEMA_ERROR, {
        validation: validation.errors,
      }),
    };
  }

  return { error: null };
};
