/* eslint-disable */

module.exports = {
  root: true,
  extends: ['@repo/eslint-config-custom'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  env: {
    es2022: true,
    node: true,
    browser: true,
  },
  // *.d.ts is hand-typed declarations checked by tsc (typecheck), not eslint;
  // the eslintrc parser flags its declared params as unused.
  ignorePatterns: ['node_modules', 'dist', '**/*.d.ts'],
  rules: {
    // Framework-free, library-grade: no console output is allowed.
    'no-console': 'error',
  },
};
