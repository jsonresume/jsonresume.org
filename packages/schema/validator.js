'use strict';
const schema = require('./schema');
const jobSchema = require('./job-schema');
const Validator = require('jsonschema').Validator;

function validate(resumeJson, callback) {
  // jsonschema treats an absent instance as valid, which hides failed reads
  // and parses upstream
  if (
    resumeJson === null ||
    typeof resumeJson !== 'object' ||
    Array.isArray(resumeJson)
  ) {
    return callback(
      [{ property: 'instance', message: 'resume must be a JSON object' }],
      false
    );
  }

  const v = new Validator();

  const validation = v.validate(resumeJson, schema);

  if (!validation.valid) {
    return callback(validation.errors, false);
  }

  return callback(null, true);
}

module.exports = {
  validate: validate,
  schema,
  jobSchema,
};
