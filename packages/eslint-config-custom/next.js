module.exports = {
  // './index' already extends eslint-config-next (resolved explicitly there).
  // The previous duplicate bare 'next' here re-resolved relative to the linted
  // package and could pull in eslint-config-next@16's flat-config array, which
  // crashes the ESLint 8 eslintrc loader. Deduped to keep a single, pinned
  // eslint-config-next in the chain.
  extends: ['./index'],
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
