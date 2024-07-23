/* eslint-disable */

module.exports = {
  root: true,
  extends: ['@repo/eslint-config-custom'],
  parser: '@typescript-eslint/parser',
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
    '@next/next/no-sync-scripts': 'off',
    '@next/next/no-page-custom-font': 'off',
    '@next/next/no-img-element': 'off',
  },
  env: {
    browser: true,
    es2021: true,
    jquery: true,
    commonjs: true,
    node: true,
  },
};
