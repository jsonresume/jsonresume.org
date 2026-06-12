// Resolve eslint-config-next explicitly from THIS package so the legacy
// .eslintrc loader (@eslint/eslintrc) always loads the eslintrc-format config
// declared here. A bare 'next' extends is resolved by walking up from the
// linted package, which non-deterministically picks up an app's
// eslint-config-next@16. v16 ships a flat-config ARRAY, which the ESLint 8
// eslintrc loader cannot validate and crashes on while formatting the schema
// error ("Converting circular structure to JSON"). Pinning here keeps
// resolution deterministic across every workspace package and environment.
module.exports = {
  extends: [
    'eslint:recommended',
    'prettier',
    require.resolve('eslint-config-next'),
  ],
  env: {
    es6: true,
  },
};
