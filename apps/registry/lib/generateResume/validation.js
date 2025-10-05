import schema from '../schema';
import buildError, { ERROR_CODES } from '../error/buildError';

const Validator = require('jsonschema').Validator;

export const validateExtension = (extension) => {
  const EXTENSIONS = new Set([
    'qr',
    'json',
    'tex',
    'txt',
    'template',
    'yaml',
    'rendercv',
    'agent',
  ]);

  if (!EXTENSIONS.has(extension)) {
    return { error: buildError(ERROR_CODES.INVALID_EXTENSION) };
  }

  return { error: null };
};

export const validateResume = (resume) => {
  // Allow bypassing validation via meta.skipValidation flag
  if (resume?.meta?.skipValidation === true) {
    console.log(
      'Schema validation bypassed via meta.skipValidation flag for experimental resume'
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
