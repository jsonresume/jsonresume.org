import React from 'react';
/**
 * LanguageBar Stories
 */
import { LanguageBar } from './LanguageBar';

const meta = {
  title: 'Resume Core/Languages/LanguageBar',
  component: LanguageBar,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    language: 'English',
    fluency: 'Native',
  },
};

export const Example = {
  args: {
    language: 'Spanish',
    fluency: 'Professional Working Proficiency',
  },
};
