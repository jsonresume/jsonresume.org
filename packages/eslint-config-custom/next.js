module.exports = {
  extends: ['./index', 'next'],
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
    '@next/next/no-sync-scripts': 'off',
    '@next/next/no-page-custom-font': 'off',
    '@next/next/no-img-element': 'off',
    'react/no-unescaped-entities': 'off',
    'no-case-declarations': 'off',
    'no-unused-vars': ['error', { vars: 'all', args: 'none' }],
  },
};
