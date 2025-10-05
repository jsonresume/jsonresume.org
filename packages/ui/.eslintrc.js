/* eslint-disable */

module.exports = {
  root: true,
  extends: ['@repo/eslint-config-custom', 'plugin:storybook/recommended'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
  },
};
