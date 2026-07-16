var test = require('tape');
var Ajv = require('ajv');
var addFormats = require('ajv-formats');

const schema = require('../schema.json');
const jobSchema = require('../job-schema.json');
const sampleResume = require('../sample.resume.json');
const sampleJob = require('../sample.job.json');

// Regression tests for jsonresume/jsonresume.org#321.
//
// Both published schemas are draft-07 documents. Note that in draft-07 the
// spec'd keyword for reusable definitions is `definitions` — `$defs` only
// exists from 2019-09 onward — so `definitions` is correct here and must not
// be "fixed" without a deliberate draft upgrade.
const schemas = [
  ['schema.json', schema],
  ['job-schema.json', jobSchema],
];

test('schemas declare the draft-07 meta-schema', (t) => {
  schemas.forEach(([name, s]) => {
    t.equal(
      s.$schema,
      'http://json-schema.org/draft-07/schema#',
      name + ' declares draft-07'
    );
  });
  t.end();
});

test('schemas validate against the draft-07 meta-schema', (t) => {
  schemas.forEach(([name, s]) => {
    const ajv = new Ajv({ strict: false });
    addFormats(ajv);
    t.true(
      ajv.validateSchema(s),
      name + ' is draft-07 compliant: ' + JSON.stringify(ajv.errors || null)
    );
  });
  t.end();
});

// Stricter than the ecosystem baseline (resume-cli uses strict:false): strict
// mode also rejects keywords that draft-07 validators silently ignore, e.g.
// `additionalItems` alongside a non-array `items`, misspelled keywords, and
// unknown formats. Schemas must stay clean enough to compile under it.
test('schemas compile under Ajv strict mode', (t) => {
  schemas.forEach(([name, s]) => {
    const ajv = new Ajv({ strict: true });
    addFormats(ajv);
    t.doesNotThrow(() => ajv.compile(s), name + ' compiles with strict:true');
  });
  t.end();
});

// The ecosystem baseline: resume-cli compiles these schemas with Ajv draft-07,
// strict:false + ajv-formats. The bundled samples must validate under it.
test('samples validate under the resume-cli Ajv baseline', (t) => {
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  const validateResume = ajv.compile(schema);
  const validateJob = ajv.compile(jobSchema);
  t.true(
    validateResume(sampleResume),
    'sample.resume.json: ' + JSON.stringify(validateResume.errors || null)
  );
  t.true(
    validateJob(sampleJob),
    'sample.job.json: ' + JSON.stringify(validateJob.errors || null)
  );
  t.end();
});
