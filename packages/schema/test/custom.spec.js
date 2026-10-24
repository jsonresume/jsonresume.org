var test = require('tape');
var { validate } = require('../validator');
var schema = require('../schema.json');

const SECTIONS = [
  'work',
  'volunteer',
  'education',
  'awards',
  'certificates',
  'publications',
  'skills',
  'languages',
  'interests',
  'references',
  'projects',
];

test('custom - accepted at the root, in basics and in every section entry', (t) => {
  const resume = {
    custom: { myTool: { generatedBy: 'ResumeBuilder', version: 2 } },
    basics: { name: 'Jane', custom: { nickname: 'Jay' } },
  };
  for (const section of SECTIONS) {
    resume[section] = [{ custom: { anything: [1, { nested: true }] } }];
  }
  validate(resume, (errors, valid) => {
    t.equal(errors, null, 'no errors');
    t.true(valid, 'valid');
  });
  t.end();
});

test('custom - must be an object', (t) => {
  for (const bad of ['text', 42, ['a'], null]) {
    validate({ work: [{ custom: bad }] }, (errors, valid) => {
      t.false(valid, `custom: ${JSON.stringify(bad)} is invalid`);
    });
  }
  t.end();
});

test('custom - every section entry declares it', (t) => {
  for (const section of SECTIONS) {
    t.deepEqual(
      schema.properties[section].items.properties.custom,
      { $ref: '#/definitions/custom' },
      section
    );
  }
  t.end();
});
