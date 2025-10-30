import React from 'react';
/**
 * SectionTitle Stories
 */
import { SectionTitle } from './SectionTitle';

const meta = {
  title: 'Resume Core/Primitives/SectionTitle',
  component: SectionTitle,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    children: 'Professional Experience',
  },
};

export const Example = {
  args: {
    children: 'Education & Certifications',
    level: 2,
  },
};
