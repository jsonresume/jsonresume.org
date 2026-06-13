import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { formatErrors } from './validate-errors';

export default async ({ resume, schema }) => {
  // strict:false is required: the JSON Resume schema is an externally authored
  // draft-07 document that uses keywords (e.g. additionalItems without an
  // array `items`) that Ajv's strict mode would otherwise reject.
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
