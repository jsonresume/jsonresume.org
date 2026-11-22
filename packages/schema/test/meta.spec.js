var test = require('tape');
var { validate } = require('../validator');
const fixtures = require('./__test__/meta.json');

test('meta - valid', (t) => {
  validate(fixtures.metaValid, (err, valid) => {
    t.equal(err, null, 'err should be null');
    t.true(valid, 'valid is true');
  });
  t.end();
});

test('meta - invalid', (t) => {
  validate(fixtures.metaInvalid, (err, valid) => {
    t.notEqual(err, null, 'err should contain an error');
    t.false(valid, 'valid is false');
  });
  t.end();
});

test('meta.canonical - valid', (t) => {
  validate(fixtures.canonicalValid, (err, valid) => {
    t.equal(err, null, 'err should be null');
    t.true(valid, 'valid is true');
  });
  t.end();
});

test('meta.canonical - invalid', (t) => {
  validate(fixtures.canonicalInvalid, (err, valid) => {
    t.notEqual(err, null, 'err should contain an error');
    t.false(valid, 'valid is false');
  });
  t.end();
});

test('meta.version - valid', (t) => {
  validate(fixtures.versionValid, (err, valid) => {
    t.equal(err, null, 'err should be null');
    t.true(valid, 'valid is true');
  });
  t.end();
});

test('meta.version - invalid', (t) => {
  validate(fixtures.versionInvalid, (err, valid) => {
    t.notEqual(err, null, 'err should contain an error');
    t.false(valid, 'valid is false');
  });
  t.end();
});

test('meta.lastModified - valid', (t) => {
  validate(fixtures.lastModifiedValid, (err, valid) => {
    t.equal(err, null, 'err should be null');
    t.true(valid, 'valid is true');
  });
  t.end();
});

test('meta.lastModified - invalid', (t) => {
  validate(fixtures.lastModifiedInvalid, (err, valid) => {
    t.notEqual(err, null, 'err should contain an error');
    t.false(valid, 'valid is false');
  });
  t.end();
});

const validates = (resume) => {
  let result;
  validate(resume, (errors, ok) => {
    result = ok;
  });
  return result;
};

test('meta.language (#288) - a BCP 47 tag, as text', (t) => {
  t.true(validates({ meta: { language: 'en' } }));
  t.true(validates({ meta: { language: 'pt-BR' } }));
  t.false(validates({ meta: { language: ['en'] } }));
  t.false(validates({ meta: { language: 1 } }));
  t.end();
});

test('meta.translations (#288) - other documents by language and URL', (t) => {
  t.true(
    validates({
      meta: {
        language: 'en',
        translations: [
          { language: 'fr', url: 'https://jsonresume.org/@ada/fr.json' },
        ],
      },
    })
  );
  t.false(validates({ meta: { translations: { fr: 'https://x.org' } } }));
  t.false(validates({ meta: { translations: [{ url: 'not a url' }] } }));
  t.false(validates({ meta: { translations: [{ language: 7 }] } }));
  t.end();
});
