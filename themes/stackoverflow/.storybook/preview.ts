import '../style.css';
import type { Preview } from '@storybook/react';
import i18n from './i18next';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    i18n,
  },
  globals: {
    locale: 'en',
    locales: {
      en: { title: 'English' },
      de: { title: 'Deutsch' },
    },
  },
};

export default preview;
