var test = require('tape');
var { validate } = require('../validator');

const valid = (resume) => {
  let result;
  validate(resume, (errors, ok) => {
    result = ok;
  });
  return result;
};

test('languages[].scale (#315) - framework and level', (t) => {
  t.true(
    valid({
      languages: [
        {
          language: 'German',
          fluency: 'Fluent',
          scale: { framework: 'CEFR', level: 'C1' },
        },
      ],
    })
  );
  t.true(
    valid({ languages: [{ language: 'Dutch', fluency: 'Native' }] }),
    'optional'
  );
  t.true(valid({ languages: [{ scale: { framework: 'ILR', level: '3+' } }] }));
  t.false(valid({ languages: [{ scale: 'C1' }] }), 'a string is invalid');
  t.false(valid({ languages: [{ scale: { level: 1 } }] }), 'level is text');
  t.end();
});

test('languages[].level and proficiency stay free (#315)', (t) => {
  t.true(
    valid({
      languages: [
        { language: 'Spanish', level: 'B2', proficiency: 'Limited Working' },
      ],
    })
  );
  t.end();
});

test('skills[].id (#313) - text', (t) => {
  t.true(valid({ skills: [{ id: 'typescript', name: 'TypeScript' }] }));
  t.false(valid({ skills: [{ id: 7 }] }));
  t.end();
});

test('entry skills (#313) - names, ids or skill objects', (t) => {
  for (const section of ['work', 'volunteer', 'education', 'projects']) {
    t.true(
      valid({ [section]: [{ skills: ['TypeScript', 'go'] }] }),
      `${section}: names`
    );
    t.true(
      valid({
        [section]: [{ skills: [{ name: 'Backend', keywords: ['Go', 'SQL'] }] }],
      }),
      `${section}: skill objects, as resumes already write them`
    );
    t.false(
      valid({ [section]: [{ skills: 'TypeScript' }] }),
      `${section}: must be a list`
    );
    t.false(valid({ [section]: [{ skills: [3] }] }), `${section}: no numbers`);
    t.false(
      valid({ [section]: [{ skills: [{ keywords: 'Go' }] }] }),
      `${section}: keywords is a list`
    );
  }
  t.end();
});
