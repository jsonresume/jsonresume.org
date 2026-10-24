var test = require('tape');
var { validate } = require('../validator');

const valid = (resume) => {
  let result;
  validate(resume, (errors, ok) => {
    result = ok;
  });
  return result;
};

test('work.keywords (#293) - array of strings', (t) => {
  t.true(valid({ work: [{ keywords: ['React', 'AWS'] }] }));
  t.false(valid({ work: [{ keywords: 'React' }] }), 'a string is invalid');
  t.false(valid({ work: [{ keywords: [1] }] }), 'non-string items are invalid');
  t.end();
});

test('education.summary (#292) - free text', (t) => {
  t.true(valid({ education: [{ summary: 'Thesis on compression.' }] }));
  t.false(valid({ education: [{ summary: 42 }] }));
  t.end();
});

test('certificates.expiryDate (#307) - iso8601 date, optional', (t) => {
  t.true(valid({ certificates: [{ name: 'X', date: '2020-01' }] }));
  t.true(valid({ certificates: [{ expiryDate: '2026-03-15' }] }));
  t.true(valid({ certificates: [{ expiryDate: '2026' }] }));
  t.false(valid({ certificates: [{ expiryDate: 'next year' }] }));
  t.end();
});

test('publications.type (#295) - free text', (t) => {
  t.true(valid({ publications: [{ name: 'X', type: 'patent' }] }));
  t.false(valid({ publications: [{ type: ['book'] }] }));
  t.end();
});

test('sample resume exercises every section (#294)', (t) => {
  const sample = require('../sample.resume.json');
  const schema = require('../schema.json');
  for (const section of Object.keys(schema.properties)) {
    if (section === '$schema' || section === 'custom') continue;
    t.ok(section in sample, `sample has ${section}`);
  }
  t.end();
});

test('certificates.credentialId and summary (#590) - free text', (t) => {
  t.true(
    valid({
      certificates: [{ credentialId: 'RN-123456', summary: 'Nursing licence' }],
    })
  );
  t.false(valid({ certificates: [{ credentialId: 123456 }] }));
  t.false(valid({ certificates: [{ summary: ['x'] }] }));
  t.end();
});

test('objective (#317) - optional root-level free text', (t) => {
  t.true(
    valid({ objective: 'Seeking a senior Go role in cloud infrastructure' })
  );
  t.false(valid({ objective: { text: 'x' } }));
  t.end();
});

test('projects.summary (#296) - free text; description still accepted', (t) => {
  t.true(valid({ projects: [{ name: 'X', summary: 'What it is' }] }));
  t.true(valid({ projects: [{ name: 'X', description: 'Legacy field' }] }));
  t.false(valid({ projects: [{ summary: 7 }] }));
  t.end();
});

test('publications authors, volume/issue/pages, identifiers (#289)', (t) => {
  t.true(valid({ publications: [{ name: 'Minimal' }] }));
  t.true(
    valid({
      publications: [
        {
          name: 'Middle-out compression',
          type: 'article',
          authors: ['Richard Hendriks', 'Bertram Gilfoyle'],
          volume: '12',
          issue: '3',
          pages: '45-67',
          identifiers: { doi: '10.1000/182', pmid: '12345678' },
        },
      ],
    })
  );
  t.false(valid({ publications: [{ authors: 'Richard Hendriks' }] }));
  t.false(valid({ publications: [{ volume: 12 }] }));
  t.false(valid({ publications: [{ identifiers: { doi: 182 } }] }));
  t.end();
});

test('references relationship, organization, date, availableOnRequest (#291)', (t) => {
  t.true(valid({ references: [{ name: 'Jane', reference: 'Great' }] }));
  t.true(
    valid({
      references: [
        {
          name: 'Jane Smith',
          relationship: 'Manager',
          organization: 'Pied Piper',
          date: '2016-03',
          reference: 'Consistently great',
        },
      ],
    })
  );
  t.true(valid({ references: [{ availableOnRequest: true }] }));
  t.false(valid({ references: [{ availableOnRequest: 'yes' }] }));
  t.false(valid({ references: [{ date: 'March 2016' }] }));
  t.false(valid({ references: [{ relationship: ['Manager'] }] }));
  t.end();
});
