module.exports = {
  extends: ['custom', 'next'],
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
  },
  env: {
    browser: true,
    es2021: true,
    jquery: true,
  },
};
