import Ajv from 'ajv';
import addFormats from 'ajv-formats';

// Format a single Ajv error into a readable `field message` line.
const formatError = (error) => {
  // instancePath is like "/basics/name"; the root is an empty string.
  const field = error.instancePath ? `data${error.instancePath}` : 'data';
  if (error.keyword === 'additionalProperties') {
    return `${field} ${error.message} (${error.params.additionalProperty})`;
  }
  return `${field} ${error.message}`;
};

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

  const details = (validateFn.errors || []).map(formatError).join('\n  ');
  throw new Error(`Invalid resume:\n  ${details}`);
};
