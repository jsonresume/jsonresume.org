/* eslint-disable */

module.exports = {
  root: true,
  extends: ['@repo/eslint-config-custom'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  settings: { react: { version: 'detect' } },
  ignorePatterns: ['dist', 'node_modules', 'scripts'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    // TypeScript checks unused code (noUnusedLocals); the base rule misreads
    // parameter names in function types.
    'no-unused-vars': 'off',
    '@next/next/no-html-link-for-pages': 'off',
    // A framework-agnostic library: next/image is not available to consumers.
    '@next/next/no-img-element': 'off',
  },
};
