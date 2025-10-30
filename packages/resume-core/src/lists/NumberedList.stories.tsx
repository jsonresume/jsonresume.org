import React from 'react';
/**
 * NumberedList Stories
 */
import { NumberedList } from './NumberedList';

const meta = {
  title: 'Resume Core/Lists/NumberedList',
  component: NumberedList,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    items: [
      'Research and analyze user requirements',
      'Design system architecture and data models',
      'Implement features using agile methodology',
      'Conduct code reviews and testing',
      'Deploy to production and monitor',
    ],
    start: 1,
  },
};

export const Example = {
  args: {
    items: [
      'Bachelor of Science in Computer Science',
      'AWS Certified Solutions Architect',
      'Certified Scrum Master (CSM)',
      'Google Cloud Professional Architect',
    ],
    start: 1,
  },
};
