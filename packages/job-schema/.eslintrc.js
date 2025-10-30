/* eslint-disable */

module.exports = {
  extends: ['@repo/eslint-config-custom'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: false,
    },
  },
  ignorePatterns: ['dist', 'scripts'],
};
