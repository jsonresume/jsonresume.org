module.exports = {
  parser: '@babel/eslint-parser',
  extends: ['eslint:recommended', 'plugin:react/recommended', 'next'],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    requireConfigFile: false,
  },
  plugins: ['react'],
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
