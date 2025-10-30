import React from 'react';
/**
 * Section Stories
 */
import { Section } from './Section';

const meta = {
  title: 'Resume Core/Primitives/Section',
  component: Section,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    title: 'Work Experience',
    children: 'Section content goes here',
  },
};

export const Example = {
  args: {
    title: 'Skills',
    children: 'List of skills and technologies',
  },
};
