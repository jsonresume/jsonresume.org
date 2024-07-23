/* eslint-disable */

module.exports = {
  root: true,
  extends: ['@repo/eslint-config-custom'],
  parser: '@typescript-eslint/parser',
  rules: {
    'no-redeclare': 'off',
    '@next/next/no-html-link-for-pages': 'off',
  },
};
