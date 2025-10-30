import React from 'react';
/**
 * ProficiencyScale Stories
 */
import { ProficiencyScale } from './ProficiencyScale';

const meta = {
  title: 'Resume Core/Languages/ProficiencyScale',
  component: ProficiencyScale,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    language: 'English',
    level: 5,
    maxLevel: 5,
  },
};

export const Example = {
  args: {
    language: 'Spanish',
    level: 4,
    maxLevel: 5,
  },
};
