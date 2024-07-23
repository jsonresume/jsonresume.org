/* eslint-disable */

module.exports = {
  root: true,
  extends: ['@repo/eslint-config-custom'],
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    es2021: true,
    jquery: true,
    commonjs: true,
    node: true,
  },
};
