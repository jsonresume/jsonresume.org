var test = require('tape');
var Validator = require('jsonschema').Validator;
var { validate, jobSchema } = require('../validator');

const sampleResume = require('../sample.resume.json');
const sampleJob = require('../sample.job.json');

// The bundled samples are shipped in package.json "files" and referenced from
// docs/themes as the canonical examples. They must validate against the schemas
// they claim to follow.
test('sample.resume.json validates against schema', (t) => {
  validate(sampleResume, (err, valid) => {
    t.equal(err, null, 'err should be null');
    t.true(valid, 'sample.resume.json is valid');
  });
  t.end();
});

test('sample.job.json validates against job-schema', (t) => {
  var v = new Validator();
  var result = v.validate(sampleJob, jobSchema);
  t.true(
    result.valid,
    'sample.job.json is valid: ' +
      result.errors.map((e) => e.property + ' ' + e.message).join(', ')
  );
  t.end();
});

// Guard the validator's contract: a type violation must yield an array of errors
// and valid:false, while a conforming document yields null + valid:true.
test('validate reports an error array for a type violation', (t) => {
  validate({ basics: null }, (err, valid) => {
    t.false(valid, 'valid is false');
    t.true(Array.isArray(err), 'err is an array of validation errors');
    t.true(err.length > 0, 'err is non-empty');
  });
  t.end();
});
