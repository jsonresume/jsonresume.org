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
  ignorePatterns: ['dist', 'node_modules'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    // TypeScript checks unused code; the base rule misreads type parameters.
    'no-unused-vars': 'off',
    // `const X = Schema.Struct(...)` with `type X = typeof X.Type` is the
    // Effect Schema idiom; TypeScript itself rejects real redeclarations.
    'no-redeclare': 'off',
    // Not a Next.js app: plain <a> and <img> are right here.
    '@next/next/no-html-link-for-pages': 'off',
    '@next/next/no-img-element': 'off',
    'no-console': 'error',
    // No React here: HttpRouter.use is not a hook. TypeScript checks names.
    'react-hooks/rules-of-hooks': 'off',
    'no-undef': 'off',
  },
};
