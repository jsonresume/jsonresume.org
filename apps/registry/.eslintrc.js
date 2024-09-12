/* eslint-disable */

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
    '@next/next/no-sync-scripts': 'off',
    '@next/next/no-page-custom-font': 'off',
  },
  env: {
    browser: true,
    es2021: true,
    jquery: true,
    commonjs: true,
    node: true,
  },
};
