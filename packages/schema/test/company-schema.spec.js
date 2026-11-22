var test = require('tape');
var { Validator } = require('jsonschema');
var { companySchema, jobSchema } = require('../validator');

const valid = (doc, schema = companySchema) =>
  new Validator().validate(doc, schema).valid;

test('company - every field is optional', (t) => {
  t.true(valid({}));
  t.true(valid({ name: 'outGoing' }));
  t.false(valid('outGoing'), 'a document is an object');
  t.end();
});

test('company - identity, size and dates', (t) => {
  t.true(
    valid({
      name: 'Acme',
      url: 'https://acme.example',
      founded: '2015',
      employees: { min: 11, max: 50 },
      stage: 'Series A',
    })
  );
  t.false(valid({ url: 'acme dot com' }), 'url is a URI');
  t.false(valid({ founded: 'last year' }), 'founded is an ISO 8601 date');
  t.false(valid({ employees: '11-50' }), 'employees is a range object');
  t.false(valid({ employees: { min: 0 } }), 'at least one person');
  t.false(valid({ employees: { min: 10.5 } }), 'whole people');
  t.end();
});

test('company - where and how it works', (t) => {
  t.true(
    valid({
      headquarters: { city: 'Lisbon', countryCode: 'PT' },
      locations: [{ city: 'Berlin', countryCode: 'DE' }],
      remote: 'Full',
    })
  );
  t.false(valid({ remote: 'remote-first' }), 'remote is Full, Hybrid or None');
  t.false(valid({ headquarters: 'Lisbon' }), 'headquarters is a location');
  t.false(valid({ technologies: 'Go' }), 'lists are arrays');
  t.false(valid({ benefits: [1] }), 'of strings');
  t.end();
});

test('company - extensions are kept', (t) => {
  t.true(valid({ custom: { myTool: { rating: 4 } }, unknownField: true }));
  t.false(valid({ custom: 'x' }), 'custom is an object');
  t.end();
});

test('job (#353) - posting url, how to apply and the company it links to', (t) => {
  t.true(
    valid(
      {
        url: 'https://news.ycombinator.com/item?id=1',
        apply: {
          url: 'https://acme.example/apply',
          email: 'jobs@acme.example',
          instructions: 'Mention HN',
        },
        companyUrl: 'https://acme.example',
      },
      jobSchema
    )
  );
  t.true(valid({ apply: {} }, jobSchema));
  t.false(valid({ apply: 'email us' }, jobSchema), 'apply is an object');
  t.false(valid({ apply: { email: 'not an address' } }, jobSchema));
  t.false(valid({ companyUrl: 'acme' }, jobSchema), 'companyUrl is a URI');
  t.end();
});
