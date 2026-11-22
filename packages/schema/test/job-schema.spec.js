var test = require('tape');
var { Validator } = require('jsonschema');
var { jobSchema } = require('../validator');

const valid = (job) => new Validator().validate(job, jobSchema).valid;

test('job compensation (#319) - amounts, an ISO 4217 code and a period', (t) => {
  t.true(
    valid({
      salary: '$120k–150k',
      compensation: {
        min: 120000,
        max: 150000,
        currency: 'USD',
        period: 'year',
      },
    })
  );
  t.true(valid({ compensation: { min: 80, currency: 'EUR', period: 'hour' } }));
  t.false(valid({ compensation: { min: '120k' } }), 'amounts are numbers');
  t.false(valid({ compensation: { period: 'annually' } }), 'a known period');
  t.false(valid({ compensation: 'competitive' }), 'text goes in salary');
  t.end();
});

test('job facets (#353) - the fixed vocabulary, each optional', (t) => {
  t.true(
    valid({
      facets: {
        remoteScope: 'remote_region',
        remoteRegions: ['US', 'EU'],
        timezoneRange: 'UTC-5 to UTC+1',
        seniority: 'staff_plus',
        employmentType: 'full_time',
        visaSponsorship: 'unspecified',
        salaryProvenance: 'stated',
      },
    })
  );
  t.true(valid({ facets: {} }));
  t.false(valid({ facets: { remoteScope: 'Remote' } }), 'free text is remote');
  t.false(valid({ facets: { seniority: 'principal' } }));
  t.false(valid({ facets: { remoteRegions: 'US' } }));
  t.end();
});

test('job documents without the new fields stay valid', (t) => {
  t.true(valid({ title: 'Web Developer', salary: '100000', remote: 'Hybrid' }));
  t.end();
});
