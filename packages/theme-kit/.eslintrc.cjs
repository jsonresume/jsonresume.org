/* eslint-disable */

module.exports = {
  root: true,
  extends: ['@repo/eslint-config-custom'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    es2022: true,
    node: true,
    browser: true,
  },
  ignorePatterns: ['node_modules', 'dist'],
  rules: {
    // Library-grade: no console output is allowed.
    'no-console': 'error',
  },
};
