var test = require('tape');
var Validator = require('jsonschema').Validator;

const fixtures = require('./__test__/dates.json');
// var mockDateSchema = require('./__test__/mockDateSchema.json');

// The real iso8601 definition, so these tests break if schema.json drifts
const mockDateSchema = require('../schema.json').definitions.iso8601;

function dateValidate(resumeJson, callback) {
  var v = new Validator();

  const validation = v.validate(resumeJson, mockDateSchema);

  if (!validation.valid) {
    return callback(validation.errors, false);
  }

  return callback(null, true);
}

test('dates - YYYY-MM-DD', (t) => {
  dateValidate(fixtures.yearMonthDay, (err, valid) => {
    t.equal(err, null, 'err should be null');
    t.true(valid, 'valid is true');
  });
  t.end();
});

test('dates - YYYY-MM', (t) => {
  dateValidate(fixtures.yearMonth, (err, valid) => {
    t.equal(err, null, 'err should be null');
    t.true(valid, 'valid is true');
  });
  t.end();
});

test('dates - YYYY', (t) => {
  dateValidate(fixtures.year, (err, valid) => {
    t.equal(err, null, 'err should be null');
    t.true(valid, 'valid is true');
  });
  t.end();
});

test('dates - invalid', (t) => {
  dateValidate(fixtures.invalid, (err, valid) => {
    t.notEqual(err, null, 'err should contain an error');
    t.false(valid, 'valid is false');
  });
  t.end();
});

// Regression: each fixture must actually match its named iso8601 granularity,
// so the YYYY / YYYY-MM tests genuinely exercise those branches of the pattern.
test('dates - fixtures match their named granularity', (t) => {
  t.match(fixtures.year, /^[1-2][0-9]{3}$/, 'year fixture is a bare YYYY');
  t.match(
    fixtures.yearMonth,
    /^[1-2][0-9]{3}-[0-1][0-9]$/,
    'yearMonth fixture is YYYY-MM'
  );
  t.match(
    fixtures.yearMonthDay,
    /^[1-2][0-9]{3}-[0-1][0-9]-[0-3][0-9]$/,
    'yearMonthDay fixture is YYYY-MM-DD'
  );
  t.end();
});

test('dates - impossible months and days are rejected', (t) => {
  for (const date of [
    '2013-00',
    '2013-13',
    '2013-19-39',
    '2013-01-00',
    '2013-01-32',
  ]) {
    dateValidate(date, (err, valid) => {
      t.false(valid, `${date} is invalid`);
    });
  }
  for (const date of ['2013-01', '2013-12', '2013-12-31', '2013-02-29']) {
    dateValidate(date, (err, valid) => {
      t.true(valid, `${date} is valid`);
    });
  }
  t.end();
});
