var test = require('tape');
var Validator = require('jsonschema').Validator;
var { schema, jobSchema, companySchema } = require('../validator');
var manifest = require('../conformance/manifest.json');

// The conformance suite (conformance/README.md): every case gives the result
// the manifest says, with the schema it names.
var schemas = { resume: schema, job: jobSchema, company: companySchema };

test('the conformance suite covers every format, valid and invalid', (t) => {
  for (var kind of Object.keys(schemas)) {
    var cases = manifest.cases.filter((c) => c.schema === kind);
    t.true(
      cases.some((c) => c.valid),
      kind + ' has valid cases'
    );
    t.true(
      cases.some((c) => !c.valid),
      kind + ' has invalid cases'
    );
  }
  t.end();
});

test('every conformance case gives its expected result', (t) => {
  for (var c of manifest.cases) {
    var doc = require('../conformance/' + c.file);
    var result = new Validator().validate(doc, schemas[c.schema]);
    t.equal(
      result.valid,
      c.valid,
      c.file + (c.valid ? ' is valid' : ' is invalid') + ': ' + c.description
    );
  }
  t.end();
});
