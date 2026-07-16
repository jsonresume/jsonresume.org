import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { formatErrors } from './validate-errors';

export default async ({ resume, schema }) => {
  // strict:false is the ecosystem baseline: the schema passed in may be an
  // externally authored draft-07 document (custom/theme schemas) that is not
  // strict-mode clean, and strict mode would reject it instead of validating.
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);

  const validateFn = ajv.compile(schema);
  if (validateFn(resume)) {
    return true;
  }

  const error = new Error(formatErrors(validateFn.errors || [], resume));
  // Expose the raw Ajv errors so callers can build machine-readable output.
  error.validationErrors = validateFn.errors || [];
  throw error;
};
