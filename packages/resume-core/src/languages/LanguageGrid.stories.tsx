import React from 'react';
/**
 * LanguageGrid Stories
 */
import { LanguageGrid } from './LanguageGrid';

const meta = {
  title: 'Resume Core/Languages/LanguageGrid',
  component: LanguageGrid,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    languages: [
      { name: 'English', level: 'Native' },
      { name: 'Spanish', level: 'Professional' },
      { name: 'French', level: 'Intermediate' },
    ],
  },
};

export const Example = {
  args: {
    languages: [
      { name: 'Mandarin', level: 'Native' },
      { name: 'English', level: 'Fluent' },
    ],
  },
};
