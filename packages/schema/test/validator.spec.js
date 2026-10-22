var test = require('tape');
var { validate } = require('../validator');

test('validator - rejects input that is not a resume object', (t) => {
  for (const input of [undefined, null, 'resume', 42, []]) {
    validate(input, (errors, valid) => {
      t.false(valid, `${JSON.stringify(input)} is invalid`);
      t.ok(errors && errors.length, 'reports an error');
    });
  }
  t.end();
});

test('validator - accepts an empty resume object', (t) => {
  validate({}, (errors, valid) => {
    t.equal(errors, null);
    t.true(valid);
  });
  t.end();
});
