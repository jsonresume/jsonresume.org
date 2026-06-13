var test = require('tape');
var { validate } = require('../validator');

// Every example bundled in the package (the diverse personas under examples/
// plus the canonical sample.resume.json) is shipped in package.json "files"
// and referenced from docs/themes. They must each validate against schema.json.
const bundledExamples = {
  'sample.resume.json': require('../sample.resume.json'),
  'examples/new-grad.resume.json': require('../examples/new-grad.resume.json'),
  'examples/career-changer.resume.json': require('../examples/career-changer.resume.json'),
  'examples/senior-engineer.resume.json': require('../examples/senior-engineer.resume.json'),
};

Object.keys(bundledExamples).forEach((name) => {
  test(name + ' validates against schema', (t) => {
    validate(bundledExamples[name], (err, valid) => {
      t.equal(
        err,
        null,
        'err should be null' + (err ? ': ' + JSON.stringify(err) : '')
      );
      t.true(valid, name + ' is valid');
    });
    t.end();
  });
});
