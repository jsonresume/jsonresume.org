import React from 'react';
/**
 * PrintOnly Stories
 */
import { PrintOnly } from './PrintOnly';

const meta = {
  title: 'Resume Core/Print/PrintOnly',
  component: PrintOnly,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;

export const Default = {
  args: {
    children: 'This content only appears in print',
  },
};

export const Example = {
  args: {
    children: 'Page footer for printed resumes',
  },
};
